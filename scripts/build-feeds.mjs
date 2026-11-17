// Builds the app's data files from KFT's public sources (nightly, .github/workflows/feeds.yml; Node 20+).
// Formats: ARCHITECTURE.md "Data files". No YouTube API and no key: see lib/youtube.mjs.
//
// public/data/feed.json                      Today data (<100 KB) + manifest of file versions
// public/data/podcasts/{uoc,collection}.json all episodes
// public/data/videos/<ch>/index.json         compact rows, ch = kft | official | other
// public/data/videos/<ch>/playlists.json
// public/data/videos/<ch>/descriptions.json  full descriptions (video screen only)
// public/data/archive/index.json             kfoundation.org kft_media archive, joined by YouTube ID
// public/data/search.json, matches.json      search index, cross-library talk matches
// public/data/img/*.jpg, img/images.json     local copies of kfoundation.org images
// data/library/youtube/<ch>.json             stored, append-only video libraries (not deployed)
// data/library/archive.json                  archive crawl state (not deployed)
//
// Env: OEMBED_CAP (900), ARCHIVE_PAGE_CAP (2000), REQ_GAP_MS (1000), TIME_BUDGET_MIN (40),
//      FULL_ARCHIVE_LIST=1, OFFLINE_SOURCES="rss-kft,uoc,…" (simulate a source being down, for testing)
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { get, readJson, writeJsonIfChanged, warn, warnings, hash, decode } from './lib/util.mjs';
import { SHOWS, parsePodcast } from './lib/podcasts.mjs';
import { importTakeout } from './lib/takeout.mjs';
import { CHANNELS, channelFeed, playlistFeed, parseFeed, emptyStore, applyTakeout, applyChannelFeed, applyPlaylistFeed, upsert, dueForCheck, oembed, channelOfAuthor, paced, toPublic, sortStore, cleanTitle } from './lib/youtube.mjs';
import { emptyArchive, listArchive, crawlQueue, crawlPage, effective, archivePublic, coverage, WP } from './lib/archive.mjs';
import { PROMO_URL, parsePromotions } from './lib/promotions.mjs';
import { mirrorImages, articleImageUrls } from './lib/images.mjs';
import { buildMatches, buildSearch } from './lib/index-build.mjs';
import * as SCHEMA from './lib/schema.mjs';

const t0 = Date.now();
const ROOT = process.env.KFT_ROOT || fileURLToPath(new URL('..', import.meta.url)); // KFT_ROOT: tests build into a temp copy
const PUB = join(ROOT, 'public', 'data');
const LIB = join(ROOT, 'data', 'library');
const SEED = join(ROOT, 'data', 'seed', 'youtube');
const NOW = new Date().toISOString();
const env = (k, d) => (process.env[k] !== undefined && process.env[k] !== '' ? process.env[k] : d);
const GAP = Number(env('REQ_GAP_MS', 1000));
const DEADLINE = t0 + Number(env('TIME_BUDGET_MIN', 40)) * 60e3;
const OFFLINE = new Set(env('OFFLINE_SOURCES', '').split(',').map((s) => s.trim()).filter(Boolean));
const WEEK = 7 * 864e5;
const source = async (name, fn) => { if (OFFLINE.has(name)) throw new Error(`${name} offline (OFFLINE_SOURCES)`); return fn(); };
const log = (...a) => console.log(...a);

const prevFeed = (await readJson(join(PUB, 'feed.json'))) || {};

// ---------- Podcasts ----------
const podcasts = {};
for (const show of Object.keys(SHOWS)) {
  const file = join(PUB, 'podcasts', `${show}.json`);
  try { podcasts[show] = await source(show, async () => parsePodcast(await get(SHOWS[show].feed, { timeout: 60000 }), show)); }
  catch (err) { warn('Podcast feed failed, kept previous file', `${show}: ${err.message}`); podcasts[show] = await readJson(file); }
  if (!podcasts[show]) throw new Error(`No data and no previous file for podcast ${show}`);
}

// ---------- YouTube libraries ----------
const stores = {};
for (const ch of Object.keys(CHANNELS)) stores[ch] = (await readJson(join(LIB, 'youtube', `${ch}.json`))) || emptyStore(ch);
const storeOfVideo = (id) => Object.values(stores).find((s) => s.videos[id]);
const ytStats = {};
for (const ch of ['kft', 'official']) {
  const st = (ytStats[ch] = { takeout: 0, rss: 0, playlist: 0, archive: 0 });
  try {
    const seed = await importTakeout(join(SEED, ch));
    if (seed?.skipped.length) warn('Personal data in Takeout seed', `${ch}: ${seed.skipped.join(', ')} - not read; please remove these files from the repository`);
    if (seed) st.takeout = applyTakeout(stores[ch], seed, NOW).added;
  } catch (err) { warn('Takeout seed unreadable', `${ch}: ${err.message}`); }
  try { st.rss = applyChannelFeed(stores[ch], parseFeed(await source(`rss-${ch}`, () => get(channelFeed(CHANNELS[ch].id)))), NOW); }
  catch (err) { warn('YouTube channel feed failed, kept stored library', `${ch}: ${err.message}`); }
}
// Playlist feeds, weekly per playlist
const seedPlaylists = await readJson(join(SEED, 'playlists.json'), []);
const plIds = [...new Set((Array.isArray(seedPlaylists) ? seedPlaylists : Array.isArray(seedPlaylists.playlists) ? seedPlaylists.playlists : Object.values(seedPlaylists).flat())
  .map((p) => (typeof p === 'string' ? p : p?.id)).filter((id) => typeof id === 'string' && /^[\w-]{10,64}$/.test(id)))];
const plFetched = (id) => Object.values(stores).map((s) => s.playlists[id]).find(Boolean);
const plDue = plIds.filter((id) => { const p = plFetched(id); return !p || (p.src !== 'takeout' && Date.parse(NOW) - Date.parse(p.fetched) >= WEEK - 3600e3); });
let plOk = 0;
await paced(plDue, async (id) => {
  try {
    const feed = parseFeed(await source('rss-playlists', () => get(playlistFeed(id))));
    feed.playlistId ||= id;
    const ch = Object.keys(CHANNELS).find((k) => CHANNELS[k].id && CHANNELS[k].id === feed.channelId) || 'other';
    const n = applyPlaylistFeed(stores[ch], feed, NOW);
    if (ytStats[ch]) ytStats[ch].playlist += n;
    plOk++;
  } catch (err) { warn('Playlist feed failed, kept stored playlist', `${id}: ${err.message}`); }
}, { gapMs: GAP, deadline: DEADLINE });

// ---------- KFT archive (kft_media) ----------
const archive = (await readJson(join(LIB, 'archive.json'))) || emptyArchive();
let archiveList = null;
try { archiveList = await source('archive', () => listArchive(archive, NOW, { full: env('FULL_ARCHIVE_LIST', '') === '1' })); }
catch (err) { warn('kft_media listing failed, kept previous archive', err.message); }

// oEmbed queue (built before the crawl so both run side by side, each ≤1 req/s on its own host)
const archiveCandidates = Object.values(archive.items).filter((it) => {
  const e = effective(it);
  return e.platform === 'youtube' && e.yt && !storeOfVideo(e.yt) && (!it.checked || Date.parse(NOW) - Date.parse(it.checked) >= WEEK - 3600e3);
});
const rowsDue = dueForCheck(Object.values(stores).flatMap((s) => Object.values(s.videos)), NOW);
const oQueue = [
  ...rowsDue.filter((r) => !r.checked).map((row) => ({ row })),
  ...archiveCandidates.filter((it) => !it.checked).map((item) => ({ item })),
  ...rowsDue.filter((r) => r.checked).map((row) => ({ row })),
  ...archiveCandidates.filter((it) => it.checked).map((item) => ({ item })),
];
const oStats = { checked: 0, ok: 0, hidden: 0, errors: 0, queued: oQueue.length };
const crawlStats = { fetched: 0, queued: 0, failed: 0 };
const cq = archiveList ? crawlQueue(archive) : [];
crawlStats.queued = cq.length;
await Promise.all([
  paced(oQueue, async (q) => {
    const id = q.row ? q.row.id : effective(q.item).yt;
    const res = await source('oembed', () => oembed(id)).catch((err) => ({ status: 'error', code: err.message }));
    oStats.checked++;
    if (res.status === 'error') { oStats.errors++; return; }
    const target = q.row || q.item;
    target.checked = NOW;
    if (res.status === 'ok') { oStats.ok++; target.avail = 'ok'; delete target.code; if (q.item) q.item.ch = channelOfAuthor(res.author); }
    else { oStats.hidden++; target.avail = 'hidden'; target.code = res.code; }
  }, { gapMs: GAP, cap: Number(env('OEMBED_CAP', 900)), deadline: DEADLINE }),
  paced(cq, async (it) => {
    try { await source('archive-pages', () => crawlPage(it)); crawlStats.fetched++; }
    catch (err) { crawlStats.failed++; if (crawlStats.failed <= 3) warn('Archive page failed', `${it.slug}: ${err.message}`); }
  }, { gapMs: GAP, cap: Number(env('ARCHIVE_PAGE_CAP', 2000)), deadline: DEADLINE }),
]);
// Archive videos found by tonight's crawl: check them now if the oEmbed budget allows
const oCap = Number(env('OEMBED_CAP', 900));
const fresh = Object.values(archive.items).filter((it) => { const e = effective(it); return e.platform === 'youtube' && e.yt && !storeOfVideo(e.yt) && !it.checked; });
await paced(fresh, async (item) => {
  const res = await source('oembed', () => oembed(effective(item).yt)).catch((err) => ({ status: 'error', code: err.message }));
  oStats.checked++;
  if (res.status === 'error') { oStats.errors++; return; }
  item.checked = NOW;
  if (res.status === 'ok') { oStats.ok++; item.avail = 'ok'; delete item.code; item.ch = channelOfAuthor(res.author); }
  else { oStats.hidden++; item.avail = 'hidden'; item.code = res.code; }
}, { gapMs: GAP, cap: Math.max(0, oCap - oStats.checked), deadline: DEADLINE });
if (oStats.errors > 10) warn('oEmbed errors', `${oStats.errors} of ${oStats.checked} checks failed (left unchanged)`);

let archiveGenres = prevFeed.archiveGenres || [];
try { archiveGenres = (await source('genres', () => get(`${WP}/kft_media_genre?per_page=100&_fields=id,name,count`, { as: 'json' }))).map((g) => ({ id: g.id, name: decode(g.name), count: g.count })); }
catch (err) { warn('Archive genres failed, kept previous', err.message); }
const genreName = Object.fromEntries(archiveGenres.map((g) => [g.id, g.name]));

// Join the archive to the libraries by YouTube ID; archive-only videos join the library of their oEmbed channel.
for (const it of Object.values(archive.items)) {
  const e = effective(it);
  if (e.platform !== 'youtube' || !e.yt || it.gone) continue;
  const s = storeOfVideo(e.yt);
  const genres = (it.genres || []).map((g) => genreName[g]).filter(Boolean);
  if (s) { const row = s.videos[e.yt]; row.archive = it.id; if (e.recorded) row.recorded = e.recorded; if (e.format) row.format = e.format; else delete row.format; if (e.place) row.place = e.place; else delete row.place; if (genres.length) row.genres = genres; else delete row.genres; if (!row.src.includes('archive')) row.src = [...row.src, 'archive'].sort(); if (ytStats[s.channel.key]) ytStats[s.channel.key].archive++; continue; }
  if (it.ch && it.avail === 'ok' && stores[it.ch]) {
    upsert(stores[it.ch], { id: e.yt, title: it.title, recorded: e.recorded, archive: it.id, ...(e.format ? { format: e.format } : {}), ...(e.place ? { place: e.place } : {}), ...(genres.length ? { genres } : {}) }, 'archive', NOW);
    Object.assign(stores[it.ch].videos[e.yt], { avail: 'ok', checked: it.checked });
  }
}

// ---------- Promotions, genres, audiences, retreats ----------
let promotions = prevFeed.promotions || [];
try { promotions = parsePromotions(await source('promotions', () => get(PROMO_URL, { as: 'json' }))); }
catch (err) { warn('Promotions failed, kept previous', err.message); }
let audiences = (await readJson(join(PUB, 'archive', 'index.json')))?.audiences;
audiences = audiences ? Object.entries(audiences).map(([id, name]) => ({ id: Number(id), name })) : [];
try { audiences = (await source('audiences', () => get(`${WP}/kft_media_audience?per_page=100&_fields=id,name,count`, { as: 'json' }))).map((g) => ({ id: g.id, name: decode(g.name) })); }
catch (err) { warn('Archive audiences failed, kept previous', err.message); }

// Centre programme from Inn Style. Each retreat is a "promotion" page whose GET form holds the real
// start date and number of nights, so we do not parse the free-text dates on the list page.
const INNSTYLE = 'https://krishnamurticentre.innstyle.co.uk';
async function buildRetreats(previous = []) {
  const home = await get(`${INNSTYLE}/`);
  const ids = new Set([...home.matchAll(/\/promotions\/(\d+)/g)].map((m) => m[1]));
  previous.forEach((r) => ids.add(String(r.promo))); // the list page does not always show every retreat
  const out = [];
  for (const id of ids) { // one at a time, to be gentle with the booking site
    let html;
    try { html = await get(`${INNSTYLE}/promotions/${id}`); } catch { continue; }
    const name = decode((html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '').split('\u2022')[0].trim();
    const select = (html.match(/<select name="start_date"[\s\S]*?<\/select>/) || [''])[0];
    const start = (select.match(/value="(\d{4}-\d{2}-\d{2})"/) || [])[1]; // first arrival date = retreat start
    const nights = Number((html.match(/<select name="nights"[\s\S]*?value="(\d+)"/) || [])[1]);
    if (name && start && nights) out.push({ promo: Number(id), name, start, nights }); // past retreats have no dates
  }
  if (!out.length) throw new Error('no bookable retreats found on Inn Style');
  return out.sort((a, b) => a.start.localeCompare(b.start));
}
let retreats = prevFeed.retreats || [];
try { retreats = await source('retreats', () => buildRetreats(prevFeed.retreats)); }
catch (err) { warn('Retreats failed, kept previous', err.message); }

// ---------- Images (kfoundation.org blocks hotlinking) ----------
const prevImages = (await readJson(join(PUB, 'img', 'images.json')))?.images || {};
const promoImgs = promotions.flatMap((p) => [p.imageSource || p.image, ...p.blocks.filter((b) => b.type === 'image').map((b) => b.source || b.src)]).filter(Boolean);
const articleImgs = await articleImageUrls(join(ROOT, 'scripts', 'article-images.json'));
let images = prevImages;
try {
  const res = await source('images', () => mirrorImages([...articleImgs, ...promoImgs], join(PUB, 'img'), prevImages));
  images = { ...prevImages, ...res.map };
  if (!res.resized) warn('sharp not installed', 'images stored at original size; run npm ci');
  res.failed.forEach((f) => warn('Image download failed', f));
} catch (err) { warn('Images failed, kept previous', err.message); }
// Promotions point at the local copies (original kept in imageSource / source)
promotions = promotions.map((p) => {
  const src = p.imageSource || p.image;
  const q = { ...p };
  if (src && images[src]) { q.imageSource = src; q.image = images[src]; }
  q.blocks = p.blocks.map((b) => { if (b.type !== 'image') return b; const s = b.source || b.src; return images[s] ? { ...b, source: s, src: images[s] } : b; });
  return q;
});

// ---------- Write outputs (validated; an invalid output keeps the previous file) ----------
const files = {};
async function out(rel, schema, obj, n) {
  const errs = SCHEMA.validate(schema, obj);
  if (errs.length) { warn('Schema check failed, kept previous file', `${rel}: ${errs.slice(0, 5).join('; ')}`); const old = await readJson(join(PUB, rel)); if (!old) return null; obj = old; }
  const { text } = await writeJsonIfChanged(join(PUB, rel), obj);
  files[rel] = { v: hash(text), bytes: Buffer.byteLength(text), ...(n !== undefined ? { n } : {}) };
  return obj;
}
await out('podcasts/uoc.json', SCHEMA.podcastSchema, podcasts.uoc, podcasts.uoc.count);
await out('podcasts/collection.json', SCHEMA.podcastSchema, podcasts.collection, podcasts.collection.count);
const videos = {}; const playlists = {};
for (const ch of Object.keys(CHANNELS)) {
  const pub = toPublic(stores[ch]);
  videos[ch] = (await out(`videos/${ch}/index.json`, SCHEMA.videoIndexSchema, pub.index, pub.index.count)) || pub.index;
  playlists[ch] = (await out(`videos/${ch}/playlists.json`, SCHEMA.playlistsSchema, pub.playlists, pub.playlists.count)) || pub.playlists;
  await out(`videos/${ch}/descriptions.json`, SCHEMA.descSchema, pub.descriptions, Object.keys(pub.descriptions.descriptions).length);
  await writeJsonIfChanged(join(LIB, 'youtube', `${ch}.json`), sortStore(stores[ch]), { pretty: true, ignore: [] });
}
const archivePub = archivePublic(archive, archiveGenres, audiences);
await out('archive/index.json', SCHEMA.archiveSchema, archivePub, archivePub.count);
await writeJsonIfChanged(join(LIB, 'archive.json'), archive, { pretty: true, ignore: [] });
const libs = { uoc: podcasts.uoc, collection: podcasts.collection, videos, playlists, archive: archivePub };
const matches = buildMatches(libs);
await out('matches.json', SCHEMA.matchesSchema, matches, Object.keys(matches.talks).length);
const search = buildSearch(libs);
await out('search.json', SCHEMA.searchSchema, search, search.items.length);
const cov = coverage(archive, archivePub, videos, NOW);
await out('coverage.json', SCHEMA.coverageSchema, cov, cov.archive.resolved);
const imgIndex = { version: 1, images };
await writeJsonIfChanged(join(PUB, 'img', 'images.json'), imgIndex);

// ---------- feed.json: Today data + manifest ----------
const short = (s = '', n = 280) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);
const legacyEps = (p) => p.episodes.slice(0, 10).map((e) => {
  const o = { key: e.key, id: e.id, number: e.number, title: e.title, date: e.date, durationSec: e.durationSec, audioUrl: e.audioUrl, link: e.link, description: short(e.description) };
  for (const k of ['image', 'theme', 'series', 'seriesId', 'part', 'parts']) if (e[k] !== undefined) o[k] = e[k];
  return o;
});
const legacyVids = (ch) => videos[ch].rows.slice(0, 10).map((r) => ({ id: r.id, title: r.t, date: r.d, thumbnail: `https://i.ytimg.com/vi/${r.id}/mqdefault.jpg`, kind: r.kind, format: r.k, short: !!r.sh, channel: ch }));
const feed = {
  version: 2,
  generatedAt: NOW,
  files,
  counts: { uoc: podcasts.uoc.count, collection: podcasts.collection.count, kft: videos.kft.count, kftShorts: videos.kft.shorts || 0, official: videos.official.count, other: videos.other.count, archive: archivePub.count, archiveWithVideo: archivePub.withVideo, matches: Object.keys(matches.talks).length },
  podcasts: {
    urgencyOfChange: { title: podcasts.uoc.show.title, image: podcasts.uoc.show.image, episodes: legacyEps(podcasts.uoc) },
    collection: { title: podcasts.collection.show.title, image: podcasts.collection.show.image, episodes: legacyEps(podcasts.collection) },
  },
  videos: { kftChannel: legacyVids('kft'), officialChannel: legacyVids('official') },
  retreats,
  promotions,
  archiveGenres,
  images,
};
const fErr = SCHEMA.validate(SCHEMA.feedSchema, feed);
if (fErr.length) { warn('Schema check failed for feed.json, kept previous file', fErr.slice(0, 5).join('; ')); }
else {
  const { text, changed } = await writeJsonIfChanged(join(PUB, 'feed.json'), feed, { pretty: true });
  const kb = Buffer.byteLength(text) / 1024;
  if (kb > 100) warn('feed.json over budget', `${kb.toFixed(1)} KB (limit 100 KB)`);
  log(`feed.json ${changed ? 'written' : 'unchanged'}: ${kb.toFixed(1)} KB`);
}

log(`Podcasts: UoC ${podcasts.uoc.count}, Collection ${podcasts.collection.count} (${podcasts.collection.series.length} series)`);
for (const ch of Object.keys(CHANNELS)) log(`Videos ${ch}: ${videos[ch].count} visible (${videos[ch].shorts || 0} Shorts), ${Object.keys(stores[ch].videos).length} stored, ${playlists[ch].count} playlists; new: ${JSON.stringify(ytStats[ch] || {})}; kinds ${JSON.stringify(videos[ch].kinds || {})}; kindSource ${JSON.stringify(videos[ch].kindSources || {})}`);
log(`Playlists: ${plIds.length} seeded, ${plDue.length} due, ${plOk} fetched`);
log(`Archive: ${archivePub.count} items, ${archivePub.resolved} resolved, ${archivePub.withVideo} with YouTube ID; listing ${archiveList ? `${archiveList.mode} (${archiveList.listed} listed, ${archiveList.removed} removed)` : 'failed'}; pages fetched ${crawlStats.fetched}/${crawlStats.queued} queued`);
log(`Coverage: archive ${cov.archive.resolved}/${cov.archive.total} resolved, ${cov.archive.withFormat} with format ${JSON.stringify(cov.archive.byFormat)}`);
log(`oEmbed: ${oStats.checked} checked of ${oStats.queued} due (${oStats.ok} ok, ${oStats.hidden} hidden, ${oStats.errors} errors)`);
log(`Retreats ${retreats.length}, promotions ${promotions.length}, images ${Object.keys(images).length}, matches ${Object.keys(matches.talks).length}, search items ${search.items.length}`);
log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)} s, ${warnings.length} warning(s)`);
