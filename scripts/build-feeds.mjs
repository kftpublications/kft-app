// Builds public/data/feed.json from KFT's public sources.
// Run nightly by .github/workflows/feeds.yml (Node 20+, no dependencies).
import { readFile, writeFile } from 'node:fs/promises';

const SOURCES = {
  urgencyOfChange: 'https://feed.podbean.com/krishnamurti/feed.xml',
  collection: 'https://feed.podbean.com/krishnamurticollection/feed.xml',
  ytKft: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCX8wFEiD_FaLPgHM6wPD0Wg',      // KFT Channel (extracts)
  ytOfficial: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC88A5W9XyWx7WSwthd5ykhw', // J. Krishnamurti Official Channel
  mediaGenres: 'https://kfoundation.org/wp-json/wp/v2/kft_media_genre?per_page=50&_fields=id,name,count',
};

const UA = { headers: { 'User-Agent': 'KFT-App-FeedBuilder/0.1 (+https://kfoundation.org)' } };
const get = async (url) => { const r = await fetch(url, UA); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.text(); };

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '\u2019', lsquo: '\u2018', rdquo: '\u201d', ldquo: '\u201c', ndash: '\u2013', mdash: '\u2014', hellip: '\u2026' };
// One pass, so "&amp;lt;" becomes "&lt;" (not "<"). Handles hex and astral code points.
const decode = (s = '') => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') { const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1)); try { return String.fromCodePoint(n); } catch { return m; } }
    return ENT[e.toLowerCase()] ?? m;
  }).trim();
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)); return m ? decode(m[1]) : ''; };
const attr = (xml, name, a) => { const m = xml.match(new RegExp(`<${name}[^>]*\\s${a}="([^"]*)"`)); return m ? decode(m[1]) : ''; };
const blocks = (xml, name) => xml.match(new RegExp(`<${name}[\\s>][\\s\\S]*?</${name}>`, 'g')) || [];
const stripHtml = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
// Bad or missing dates must not crash the whole build
const isoDate = (s) => { const d = new Date(s); return isNaN(d) ? null : d.toISOString(); };
// itunes:duration can be seconds ("3760"), "MM:SS" or "HH:MM:SS"
const seconds = (s) => { if (!s) return null; const n = s.split(':').reduce((t, p) => t * 60 + Number(p), 0); return Number.isFinite(n) && n > 0 ? n : null; };
// Leading episode number in Collection titles ("297 • Ojai 1984 ...")
const epNum = (t) => { const m = /^(\d+)\s*•/.exec(t); return m ? Number(m[1]) : 0; };

function parsePodcast(xml, limit = 40) {
  const channel = xml.split('<item')[0];
  const items = blocks(xml, 'item').map((it) => ({
    title: tag(it, 'title'),
    date: isoDate(tag(it, 'pubDate')),
    durationSec: seconds(tag(it, 'itunes:duration')),
    audioUrl: attr(it, 'enclosure', 'url'),
    link: tag(it, 'link'),
    description: stripHtml(tag(it, 'description')).slice(0, 600),
  })).filter((e) => e.audioUrl);
  // Collection feed is not date-ordered, and a whole series can share one timestamp: tie-break on episode number
  items.sort((a, b) => (b.date || '').localeCompare(a.date || '') || epNum(b.title) - epNum(a.title));
  return { title: tag(channel, 'title'), image: attr(channel, 'itunes:image', 'href'), episodes: items.slice(0, limit) };
}

function parseYouTube(xml) {
  return blocks(xml, 'entry').map((e) => ({
    id: tag(e, 'yt:videoId'),
    title: tag(e, 'title'),
    date: tag(e, 'published'),
    thumbnail: `https://i.ytimg.com/vi/${tag(e, 'yt:videoId')}/hqdefault.jpg`,
  }));
}

// One failing source keeps its section from the last good feed.json, instead of failing the whole build
const OUT = new URL('../public/data/feed.json', import.meta.url);
let prev = {};
try { prev = JSON.parse(await readFile(OUT, 'utf8')); } catch { /* first run */ }
const results = await Promise.allSettled(Object.values(SOURCES).map(get));
const keys = Object.keys(SOURCES);
const failed = [];
const pick = (i, parse, old) => {
  if (results[i].status === 'fulfilled') { try { return parse(results[i].value); } catch (err) { results[i] = { status: 'rejected', reason: err }; } }
  failed.push(`${keys[i]}: ${results[i].reason?.message}`);
  if (old === undefined) throw new Error(`No data and no previous feed for ${keys[i]}`);
  return old;
};
const feed = {
  generatedAt: new Date().toISOString(),
  podcasts: {
    urgencyOfChange: pick(0, parsePodcast, prev.podcasts?.urgencyOfChange),
    collection: pick(1, parsePodcast, prev.podcasts?.collection),
  },
  videos: {
    kftChannel: pick(2, parseYouTube, prev.videos?.kftChannel),
    officialChannel: pick(3, parseYouTube, prev.videos?.officialChannel),
  },
  archiveGenres: pick(4, (t) => JSON.parse(t).map((g) => ({ id: g.id, name: decode(g.name), count: g.count })), prev.archiveGenres),
};
await writeFile(OUT, JSON.stringify(feed, null, 2) + '\n');
console.log(`feed.json: ${feed.podcasts.urgencyOfChange.episodes.length} UoC, ${feed.podcasts.collection.episodes.length} Collection, ${feed.videos.kftChannel.length + feed.videos.officialChannel.length} videos`);
// A GitHub Actions warning, not a failure, so the rest of the feed still deploys
if (failed.length) console.log(failed.map((f) => `::warning title=Feed source failed, kept previous data::${f}`).join('\n'));
