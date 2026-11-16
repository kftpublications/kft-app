// Podbean RSS -> full episode libraries (all episodes, no limit).
import { tag, rawTag, attr, blocks, isoDate, seconds, htmlToText, oneLine, slug } from './util.mjs';
import { placeYear, labelTypeNum, talkKey, proseTalk } from './talks.mjs';

export const SHOWS = {
  uoc: { feed: 'https://feed.podbean.com/krishnamurti/feed.xml', prefix: 'u' },
  collection: { feed: 'https://feed.podbean.com/krishnamurticollection/feed.xml', prefix: 'c' },
};

// "2:36", "1:02:03", "2m 6s", "1h 2m 3s" -> seconds
export function timeToSec(s = '') {
  s = s.trim();
  if (/^\d+(:\d{1,2}){1,2}$/.test(s)) return s.split(':').reduce((t, p) => t * 60 + Number(p), 0);
  const m = /^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m(?:in)?)?\s*(?:(\d+)\s*s)?$/i.exec(s);
  if (m && (m[1] || m[2] || m[3])) return (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3] || 0);
  return null;
}

// Urgency of Change: "The first extract (2:36) is from Krishnamurti’s first talk at Rajghat 1963, and is titled: The Fiction of Non-violence"
// An extract with an empty "()" keeps its title with start: null (the feed omits the time; never guessed).
export function parseChapters(text = '') {
  const out = [];
  for (const para of text.split(/\n+/)) {
    const p = oneLine(para);
    const m = /^The\s+(?:[\w-]+\s+)?(?:and\s+final\s+)?extract\b[^()]*\(\s*([^)]*?)\s*\)\s*(.*)$/i.exec(p);
    if (!m) continue;
    const start = m[1] ? timeToSec(m[1]) : null;
    if (m[1] && start === null) continue;
    const rest = m[2];
    const tm = /titled:?\s*[‘'"“]?(.+?)[’'"”]?\s*\.?\s*$/i.exec(rest);
    const title = tm ? tm[1].replace(/[’'"”.]+$/, '').trim() : '';
    const src = /\bis\s+from\s+(.+?)(?:,?\s*(?:and\s+is\s+)?titled\b|\.\s|$)/i.exec(rest);
    const ch = { start, title: title || `Extract ${out.length + 1}` };
    if (src) ch.source = src[1].replace(/[,.\s]+$/, '');
    const talk = proseTalk(rest);
    if (talk?.key) ch.talk = talk.key;
    out.push(ch);
  }
  // keep order by time where times exist; drop an exact duplicate start
  return out.filter((c, i) => c.start === null || out.findIndex((o) => o.start === c.start) === i);
}

// Collection: "299 • Ojai 1984 (6/6) • Talk 4: Is Love Part of Consciousness?"
export function parseCollectionTitle(title = '') {
  const parts = title.split(/\s*•\s*/);
  const out = {};
  const sm = /^(.*?)\s*\((\d+)\s*\/\s*(\d+)\)\s*$/.exec(parts[1] || '');
  if (!sm) return out;
  out.series = sm[1].trim();
  out.part = Number(sm[2]);
  out.parts = Number(sm[3]);
  const py = placeYear(out.series);
  if (py) { out.place = py.place; out.year = py.year; }
  const rest = parts.slice(2).join(' • ');
  const lm = /^([^:]+):\s*(.*)$/.exec(rest);
  if (lm) {
    out.talk = lm[1].trim();
    out.talkTitle = lm[2].trim();
    const tn = labelTypeNum(out.talk);
    const key = py && tn ? talkKey(py.place, py.year, tn.type, tn.n) : null;
    if (key) out.talkKey = key;
  } else if (rest) out.talkTitle = rest.trim();
  return out;
}

export function parsePodcast(xml, show) {
  const prefix = SHOWS[show].prefix;
  const channel = xml.split(/<item[\s>]/)[0];
  let eps = blocks(xml, 'item').map((it) => {
    const descHtml = rawTag(it, 'content:encoded') || rawTag(it, 'description');
    const description = htmlToText(descHtml);
    const e = {
      id: tag(it, 'guid'),
      show,
      title: tag(it, 'title'),
      date: isoDate(tag(it, 'pubDate')),
      durationSec: seconds(tag(it, 'itunes:duration')),
      audioUrl: attr(it, 'enclosure', 'url'),
      link: tag(it, 'link'),
      season: Number(tag(it, 'itunes:season')) || null,
      episode: Number(tag(it, 'itunes:episode')) || null,
      description,
    };
    const img = attr(it, 'itunes:image', 'href');
    if (img) e.image = img;
    return e;
  }).filter((e) => e.audioUrl && e.title);
  if (!eps.length) throw new Error(`${show}: no episodes in feed`);
  if (show === 'collection') {
    eps.forEach((e) => {
      Object.assign(e, parseCollectionTitle(e.title));
      e.number = e.episode || Number((/^(\d+)\s*•/.exec(e.title) || [])[1]) || null;
    });
    // Newest first by episode number (the feed is not in date order and a series shares one timestamp)
    eps.sort((a, b) => (b.number || 0) - (a.number || 0) || (b.date || '').localeCompare(a.date || ''));
  } else {
    // UoC itunes:episode restarts each season; the overall number is the position in date order (Ep. 305 = newest)
    eps.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    eps.forEach((e, i) => {
      e.number = i + 1;
      const tm = /^Krishnamurti on\s+(.+)$/i.exec(e.title);
      if (tm) e.theme = tm[1].trim();
      const ch = parseChapters(e.description);
      if (ch.length) e.chapters = ch;
    });
    eps.reverse();
  }
  const seen = new Set();
  eps.forEach((e) => {
    let key = `${prefix}${e.number}`;
    while (seen.has(key)) key += 'x';
    seen.add(key);
    e.key = key;
    if (!e.id) e.id = key;
  });
  const out = {
    version: 1,
    show: { id: show, title: tag(channel, 'title'), image: attr(channel, 'itunes:image', 'href'), link: tag(channel, 'link') },
    count: eps.length,
    episodes: eps,
  };
  if (show === 'collection') out.series = collectionSeries(eps);
  return out;
}

// Group Collection episodes into series: same series name and part count, in episode order.
export function collectionSeries(eps) {
  const groups = new Map();
  [...eps].sort((a, b) => (a.number || 0) - (b.number || 0)).forEach((e) => {
    if (!e.series) return;
    // a new group starts when part numbering restarts (the same event can appear twice in the feed)
    let k = `${slug(e.series)}~${e.parts}`;
    let g = groups.get(k);
    if (g && g.episodes.some((x) => x.part === e.part)) { let i = 2; while (groups.get(`${k}~${i}`)?.episodes.some((x) => x.part === e.part)) i++; k = `${k}~${i}`; g = groups.get(k); }
    if (!g) { g = { id: `${slug(e.series)}-${e.number}`, name: e.series, place: e.place, year: e.year, parts: e.parts, episodes: [] }; groups.set(k, g); }
    g.episodes.push(e);
  });
  const list = [...groups.values()].map((g) => {
    g.episodes.sort((a, b) => a.part - b.part);
    g.episodes.forEach((e) => { e.seriesId = g.id; });
    const first = g.episodes[0];
    const out = { id: g.id, name: g.name, parts: g.parts, episodes: g.episodes.map((e) => e.key), first: first.number, latestDate: g.episodes.map((e) => e.date).sort().pop() || null };
    if (g.place) out.place = g.place;
    if (g.year) out.year = g.year;
    if (g.episodes.length !== g.parts) out.incomplete = true;
    return out;
  });
  return list.sort((a, b) => b.first - a.first);
}
