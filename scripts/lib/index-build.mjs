// Cross-library matches and the compact search index, both computed at build time (never on the phone).
import { talkKey, talkLabel, dashedTitle, proseTalk, placeKey } from './talks.mjs';

// libs: { uoc, collection (podcast files), videos: { kft: index, official: index, other: index }, archive (public archive) }
export function buildMatches(libs) {
  const talks = {};
  const add = (key, lib, val) => { if (!key) return; const t = (talks[key] ||= { label: talkLabel(key) }); (t[lib] ||= []).some((x) => JSON.stringify(x) === JSON.stringify(val)) || t[lib].push(val); };
  libs.collection.episodes.forEach((e) => add(e.talkKey, 'c', e.key));
  libs.uoc.episodes.forEach((e) => (e.chapters || []).forEach((ch, i) => add(ch.talk, 'u', [e.key, i])));
  const fullTalk = {};
  for (const [chKey, idx] of Object.entries(libs.videos)) {
    for (const r of idx.rows) {
      const d = dashedTitle(r.t);
      if (d?.key) add(d.key, 'v', [chKey, r.id]);
      // KFT extracts point at their full video ("Watch the full video at https://youtu.be/…")
      if (r.f) fullTalk[r.id] = r.f;
      // KFT "The Krishnamurti Podcast - Ep. 305 - …" is the video of UoC episode 305
      const ep = /^The Krishnamurti Podcast\s*[-–]\s*Ep\.?\s*(\d+)/i.exec(r.t);
      if (ep) add(`podcast-ep-${ep[1]}`, 'v', [chKey, r.id]);
    }
  }
  libs.uoc.episodes.forEach((e) => { if (talks[`podcast-ep-${e.number}`]) add(`podcast-ep-${e.number}`, 'u', [e.key, -1]); });
  // Archive items: recording date + YouTube ID; link by video ID to any talk the video is in.
  const vidTalks = {};
  for (const [k, t] of Object.entries(talks)) (t.v || []).forEach(([, id]) => { (vidTalks[id] ||= []).push(k); });
  (libs.archive?.rows || []).forEach((a) => { if (a.y && vidTalks[a.y]) vidTalks[a.y].forEach((k) => add(k, 'a', a.id)); });
  // Keep talks that join at least two different libraries (or a podcast episode to its video)
  for (const [k, t] of Object.entries(talks)) {
    const libsIn = ['c', 'u', 'v'].filter((l) => t[l]?.length).length;
    if (libsIn < 2) delete talks[k];
    else if (k.startsWith('podcast-ep-')) t.label = `Urgency of Change · Ep. ${k.slice(11)}`;
  }
  const byItem = {};
  const link = (id, k) => { (byItem[id] ||= []).includes(k) || byItem[id].push(k); };
  for (const [k, t] of Object.entries(talks)) {
    (t.c || []).forEach((id) => link(id, k));
    (t.u || []).forEach(([id]) => link(id, k));
    (t.v || []).forEach(([, id]) => link(id, k));
  }
  return { version: 1, talks, byItem, fullTalk };
}

// Places Krishnamurti spoke at, as UoC chapter sources and archive pages name them. Longest names are matched
// first, so "Brockwood Park School" is not also read as "Brockwood Park". Aliases map to one search name.
export const KNOWN_PLACES = ['Ojai', 'Saanen', 'Brockwood Park', 'Madras', 'Bombay', 'Rajghat', 'New Delhi', 'London', 'New York',
  'Paris', 'Amsterdam', 'San Francisco', 'Santa Monica', 'Rishi Valley', 'Bangalore', 'Rome', 'San Diego', 'Calcutta',
  'Los Alamos', 'Colombo', 'Claremont', 'Washington DC', 'Stanford', 'Benares', 'Varanasi', 'Berkeley', 'San Juan', 'Puerto Rico',
  'Wassenaar', 'Hamburg', 'Sydney', 'Bern', 'Gstaad', 'Chennai', 'Mumbai', 'Kolkata', 'Victoria', 'Oak Grove', 'Malibu', 'Vasanta Vihar',
  'Wolf Lake School', 'Ommen', 'Eerde', 'Adyar', 'Poona', 'Pune', 'Jabalpur', 'Hyderabad', 'Banaras', 'Montreal', 'Toronto', 'Helsinki',
  'Stockholm', 'Brussels', 'Vienna', 'Athens', 'Auckland', 'Buenos Aires', 'Rio de Janeiro', 'Montevideo', 'Santiago', 'Mexico City'];
const PLACE_ALIAS = { 'brockwood park school': 'Brockwood Park', 'brockwood': 'Brockwood Park', 'madras (chennai)': 'Madras', 'washington d.c.': 'Washington DC' };
const ALIAS_NAMES = Object.keys(PLACE_ALIAS).map((a) => a.replace(/\b\w/g, (c) => c.toUpperCase()));
const PLACE_NAMES = [...new Set([...KNOWN_PLACES, ...ALIAS_NAMES])].sort((a, b) => b.length - a.length);
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PLACE_RE = new RegExp(`\\b(?:${PLACE_NAMES.map(esc).join('|')})(?![\\w])`, 'g');
const canon = (p) => PLACE_ALIAS[p.toLowerCase()] || KNOWN_PLACES.find((k) => k.toLowerCase() === p.toLowerCase()) || p;

// Places and years named in a set of texts (UoC chapter sources): known places, deduped in order of first mention;
// years deduped and sorted. A place not on the list is still read from "in/at <Place> [in] 1983" (without a
// trailing "in"/"at"), so a new venue is not lost.
export function placesOf(texts) {
  const places = [], years = [];
  for (const t of [].concat(texts || [])) {
    if (!t) continue;
    let rest = t;
    for (const m of t.matchAll(PLACE_RE)) { places.push(canon(m[0])); rest = rest.replace(m[0], ' '); }
    for (const m of rest.matchAll(/\b(?:in|at)\s+((?:[A-Z][\w’'.-]*)(?:\s+[A-Z][\w’'.-]*)*),?\s+(?:in\s+)?(?:19|20)\d\d\b/g)) places.push(m[1].replace(/\s+(?:in|at)$/i, '').trim());
    for (const m of t.matchAll(/\b(?:19|20)\d\d\b/g)) years.push(m[0]);
  }
  return { places: [...new Set(places)], years: [...new Set(years)].sort() };
}

// Search index: one array per item, fields listed once. Types: u, c (episodes), cs (Collection series),
// v (video; channel in field 5), pl (playlist), a (archive item).
export function buildSearch(libs) {
  const items = [];
  libs.uoc.episodes.forEach((e) => {
    const py = placesOf((e.chapters || []).map((c) => c.source || ''));
    items.push(['u', e.key, e.title, py.places.join(' '), py.years.join(' '), e.theme || '', (e.chapters || []).map((c) => c.title).join(' · '), '']);
  });
  libs.collection.episodes.forEach((e) => items.push(['c', e.key, e.talkTitle || e.title, e.place || '', e.year ? String(e.year) : '', e.series || '', e.talk || '', '']));
  (libs.collection.series || []).forEach((s) => items.push(['cs', s.id, `${s.name} · ${s.parts} part${s.parts === 1 ? '' : 's'}`, s.place || '', s.year ? String(s.year) : '', s.name, '', '']));
  for (const [chKey, idx] of Object.entries(libs.videos)) {
    idx.rows.forEach((r) => items.push(['v', r.id, r.t, r.pl || '', r.y ? String(r.y) : '', chKey, r.k, r.kind]));
    (libs.playlists[chKey]?.playlists || []).forEach((p) => items.push(['pl', p.id, p.title, p.place || '', p.year ? String(p.year) : '', chKey, `${p.n} videos`, '']));
  }
  (libs.archive?.rows || []).filter((a) => !a.h).forEach((a) => items.push(['a', String(a.id), a.t, a.pl || '', a.r ? a.r.slice(0, 4) : '', a.y || '', (a.g || []).map((g) => libs.archive.genres[g]).filter(Boolean).join(' '), '']));
  return {
    version: 1,
    fields: ['type', 'id', 'title', 'place', 'year', 'group', 'extra', 'kind'],
    types: { u: 'Urgency of Change episode', c: 'Collection episode', cs: 'Collection series', v: 'Video (group = channel, extra = format, kind = full|extract|short|unknown)', pl: 'Playlist (group = channel)', a: 'Archive item (group = YouTube ID)' },
    items,
  };
}

export { talkKey, proseTalk, placeKey };
