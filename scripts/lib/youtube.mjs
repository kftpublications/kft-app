// YouTube libraries WITHOUT an API key (owner's amendment, 16 Nov 2026). Four keyless sources merged into one
// append-only stored library per channel (data/library/youtube/<channel>.json, repo root, not deployed):
//   1. Google Takeout seed CSVs (data/seed/youtube/<channel>/), optional
//   2. channel RSS (latest 15), added to the store each night
//   3. playlist RSS (latest 15 per playlist), weekly, IDs from data/seed/youtube/playlists.json
//   4. KFT's own archive (kfoundation.org kft_media), joined by YouTube ID (see archive.mjs)
// Availability: oEmbed once a week per video (rolling, ≤1 req/s). 200 = public + embeddable; 401/404 = hidden.
// No YouTube Data API, no key, no scraping of YouTube pages.
import { tag, attr, blocks, isoDate, decode, hash, sleep, get } from './util.mjs';
import { dashedTitle, placeYear } from './talks.mjs';

export const CHANNELS = {
  kft: { id: 'UCX8wFEiD_FaLPgHM6wPD0Wg', handle: '@kft', name: 'KFT Channel' },
  official: { id: 'UC88A5W9XyWx7WSwthd5ykhw', handle: '@KFoundation', name: 'J. Krishnamurti - Official Channel' },
  // Archive videos whose oEmbed author is neither channel (e.g. another Foundation's channel)
  other: { id: null, handle: null, name: 'Other channels' },
};
export const channelFeed = (id) => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
export const playlistFeed = (id) => `https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`;
export const oembedUrl = (id) => `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`;
const WEEK = 7 * 864e5;

// " | Krishnamurti" / " | J. Krishnamurti" removed; "Audio | …" -> kind audio
export function cleanTitle(raw = '') {
  let t = raw.trim();
  const audio = /^audio\s*\|\s*/i.test(t);
  if (audio) t = t.replace(/^audio\s*\|\s*/i, '');
  t = t.replace(/\s*\|\s*(J\.\s*)?Krishnamurti\s*$/i, '').trim();
  return { title: t, audio };
}

export function videoKind(chKey, rawTitle) {
  const { title, audio } = cleanTitle(rawTitle);
  if (audio) return 'audio';
  if (/^The Krishnamurti Podcast\b/i.test(title)) return 'podcast';
  const d = dashedTitle(title);
  if (d && d.type) return ({ qa: 'qa', talk: 'talk', discussion: 'discussion', dialogue: 'dialogue', conversation: 'conversation', seminar: 'seminar' })[d.type.replace(/^s-/, '')] || 'video';
  if (d) return 'video';
  return chKey === 'kft' ? 'extract' : 'video';
}

// Channel or playlist Atom feed -> entries. Shorts: <link rel="alternate" href=".../shorts/<id>">.
export function parseFeed(xml) {
  if (!/<feed[\s>]/.test(xml)) throw new Error('not an Atom feed');
  const head = xml.split(/<entry[\s>]/)[0];
  const entries = blocks(xml, 'entry').map((e) => {
    const id = tag(e, 'yt:videoId');
    const href = attr(e, 'link', 'href');
    return {
      id,
      title: tag(e, 'title') || tag(e, 'media:title'),
      date: isoDate(tag(e, 'published')),
      description: decode(tag(e, 'media:description')).replace(/\r/g, ''),
      short: /\/shorts\//.test(href),
      channelId: tag(e, 'yt:channelId'),
    };
  }).filter((e) => /^[\w-]{11}$/.test(e.id));
  return { title: tag(head, 'title'), channelId: tag(head, 'yt:channelId'), playlistId: tag(head, 'yt:playlistId'), entries };
}

export const emptyStore = (key) => ({ version: 1, channel: { key, id: CHANNELS[key].id, name: CHANNELS[key].name }, videos: {}, playlists: {} });

// Add or update one video in a store. Never removes anything (append-only).
export function upsert(store, v, src, now) {
  const old = store.videos[v.id];
  const row = old || { id: v.id, title: '', date: null, description: '', short: null, durationSec: null, src: [], first: now, avail: null, checked: null };
  if (v.title && (src !== 'takeout' || !row.title)) row.title = v.title;          // feed titles are the current ones
  if (v.date && (!row.date || src === 'rss')) row.date = v.date;
  if (v.description && (src !== 'takeout' || !row.description)) row.description = v.description;
  if (typeof v.short === 'boolean' && src !== 'takeout') row.short = v.short;     // only feeds know the Shorts link
  if (v.durationSec) row.durationSec = v.durationSec;                              // only Takeout has durations; never guessed
  if (v.archive) row.archive = v.archive;
  if (v.genres) row.genres = v.genres;
  if (v.recorded) row.recorded = v.recorded;
  if (!row.src.includes(src)) row.src = [...row.src, src].sort();
  store.videos[v.id] = row;
  return !old;
}

export function applyTakeout(store, seed, now) {
  let added = 0, skipped = 0;
  for (const v of seed.videos.values()) {
    if ((v.privacy && v.privacy !== 'public') || (v.state && !/^(published|processed|live|uploaded)$/.test(v.state))) { skipped++; continue; }
    if (upsert(store, v, 'takeout', now)) added++;
  }
  for (const p of seed.playlists) store.playlists[p.id] = { id: p.id, title: p.title, items: p.items, complete: true, src: 'takeout', fetched: now };
  return { added, skipped };
}

export function applyChannelFeed(store, feed, now) {
  let added = 0;
  for (const e of feed.entries) if (!e.channelId || e.channelId === store.channel.id) { if (upsert(store, e, 'rss', now)) added++; }
  return added;
}

// A playlist feed: playlist order and title; videos of this channel are added to the library.
export function applyPlaylistFeed(store, feed, now) {
  let added = 0;
  for (const e of feed.entries) if (e.channelId === store.channel.id && upsert(store, e, 'playlist', now)) added++;
  const old = store.playlists[feed.playlistId];
  if (old?.src === 'takeout') { old.title = feed.title || old.title; return added; } // Takeout has the full order
  store.playlists[feed.playlistId] = { id: feed.playlistId, title: feed.title, items: feed.entries.map((e) => e.id), complete: feed.entries.length < 15, src: 'rss', fetched: now };
  return added;
}

// Which videos are due for the weekly oEmbed check: never checked first, then the oldest checks over a week old.
export function dueForCheck(rows, now) {
  const t = Date.parse(now);
  return rows.filter((r) => !r.checked || t - Date.parse(r.checked) >= WEEK - 3600e3)
    .sort((a, b) => (a.checked ? 1 : 0) - (b.checked ? 1 : 0) || (a.checked || '').localeCompare(b.checked || '') || (b.date || '').localeCompare(a.date || ''));
}

// Returns { status: 'ok'|'hidden'|'error', author } for one video. 401/404 hide; anything else leaves the row as it was.
export async function oembed(id) {
  const r = await fetch(oembedUrl(id), { headers: { 'User-Agent': 'KFT-App-FeedBuilder/0.2' } });
  if (r.status === 200) { const j = await r.json().catch(() => ({})); return { status: 'ok', author: j.author_url || '', title: j.title || '' }; }
  if (r.status === 401 || r.status === 404) return { status: 'hidden', code: r.status };
  return { status: 'error', code: r.status };
}

export function channelOfAuthor(url = '') {
  const u = url.toLowerCase();
  for (const [k, c] of Object.entries(CHANNELS)) if (c.handle && (u.endsWith('/' + c.handle.toLowerCase()) || (c.id && u.includes(c.id.toLowerCase())))) return k;
  return 'other';
}

// Rate-limited queue runner: ≤1 request per `gapMs`, stops at `cap`.
export async function paced(items, fn, { gapMs = 1000, cap = Infinity, deadline = Infinity } = {}) {
  let n = 0;
  for (const it of items) {
    if (n >= cap || Date.now() > deadline) break;
    const t0 = Date.now();
    try { await fn(it); } catch { /* one failure must not stop the queue */ }
    n++;
    const wait = gapMs - (Date.now() - t0);
    if (wait > 0) await sleep(wait);
  }
  return n;
}

// Full description as plain text, without the link lists KFT appends to every upload (subscribe/social/site
// link lines). Lines holding a timestamp ("12:34") are always kept.
const BOILER = /(subscribe|instagram|twitter|facebook|tiktok|x\.com|newsletter|donate|support our work|online store|statement of authenticity|get involved|start here|free booklets|video directories|index of topics|15 quotes on|^·|^→|^--+$|^—+$)/i;
export function cleanDescription(d = '') {
  // The Official Channel appends a long "about the foundations" block to every upload
  const cut = d.replace(/\r/g, '').split(/\n\s*This channel is managed by the Krishnamurti Foundation/i)[0];
  const lines = cut.split('\n').filter((l) => !/^\s*(_{2,}|We are a charity registered|This organi[sz]ation is a registered charity|Registered charity number)/i.test(l));
  const keep = lines.filter((l) => {
    const t = l.trim();
    if (!t) return true;
    if (/\b\d{1,2}:\d{2}(:\d{2})?\b/.test(t)) return true;
    const isLinkLine = /https?:\/\/|\b[\w-]+\.(org|com|uk)\b/i.test(t);
    return !(BOILER.test(t) && (isLinkLine || t.length < 40));
  });
  return keep.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
const fullLink = (d = '') => (/Watch the full video at\s+https?:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([\w-]{11})/i.exec(d) || [])[1];

// Watch division (Toby, 16 Nov 2026 23:10). Rules in order, nothing guessed beyond them:
//  1. archive match (kfoundation.org kft_media genre): Extracts -> extract; Talk, Discussion, Question & Answer,
//     Dialogue, Seminar, Interview, Film -> full                                   (kindSource "archive-genre")
//  2. duration where known (Takeout): ≤60 s -> short; < 20 min -> extract; else full (kindSource "duration");
//     a vertical Short (the feed links it as /shorts/<id>) -> short                 (kindSource "feed-link")
//  3. channel: Official Channel -> full, KFT Channel -> extract                     (kindSource "channel")
//  4. otherwise kind "unknown" (no kindSource)
const GENRE_FORMAT = { talk: 'talk', discussion: 'discussion', 'question & answer': 'qa', dialogue: 'dialogue', seminar: 'seminar', interview: 'conversation', film: 'video', extracts: 'extract' };
const FULL_GENRES = /^(talk|discussion|question\s*&\s*answer|q\s*&\s*a|dialogue|seminar|interview|film)$/i;
export function classify(chKey, v) {
  const g = v.genres || [];
  if (g.some((x) => /^extracts?$/i.test(x))) return { kind: 'extract', kindSource: 'archive-genre' };
  if (g.some((x) => FULL_GENRES.test(x))) return { kind: 'full', kindSource: 'archive-genre' };
  if (v.durationSec) {
    if (v.durationSec <= 60 || v.short) return { kind: 'short', kindSource: 'duration' };
    return { kind: v.durationSec < 1200 ? 'extract' : 'full', kindSource: 'duration' };
  }
  if (v.short) return { kind: 'short', kindSource: 'feed-link' };
  if (fullLink(v.description || v.desc || '')) return { kind: 'extract', kindSource: 'description-link' }; // "Watch the full video at …" (added 16 Nov 2026 after the pipeline report; confirm with Toby)
  if (chKey === 'official') return { kind: 'full', kindSource: 'channel' };
  if (chKey === 'kft') return { kind: 'extract', kindSource: 'channel' };
  return { kind: 'unknown' };
}

// Public, compact per-channel files. Hidden videos are left out.
export function toPublic(store) {
  const plOf = {};
  const playlists = Object.values(store.playlists).map((p) => {
    const items = p.items.filter((id) => store.videos[id] && store.videos[id].avail !== 'hidden');
    items.forEach((id) => { (plOf[id] ||= []).push(p.id); });
    const py = placeYear(cleanTitle(p.title).title.replace(/^J\.\s*Krishnamurti\s*[-–]\s*/i, '').split(/\s+[-–]\s+/)[0]);
    const o = { id: p.id, title: cleanTitle(p.title).title, n: items.length, complete: !!p.complete, items };
    if (py) { o.place = py.place; o.year = py.year; }
    return o;
  }).filter((p) => p.n).sort((a, b) => a.title.localeCompare(b.title));
  const rows = Object.values(store.videos).filter((v) => v.avail !== 'hidden')
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.id.localeCompare(b.id));
  const descriptions = {};
  const index = rows.map((v) => {
    const { title } = cleanTitle(v.title);
    const r = { id: v.id, t: title, d: v.date ? v.date.slice(0, 10) : null, s: v.durationSec || null, k: videoKind(store.channel.key, v.title), ...classify(store.channel.key, v) };
    // Format from the archive genre when the title gives none (e.g. full talks on the KFT Channel)
    const gk = (v.genres || []).map((g) => GENRE_FORMAT[g.toLowerCase()]).find(Boolean);
    if (gk && (r.k === 'extract' || r.k === 'video')) r.k = gk;
    if (plOf[v.id]) r.p = plOf[v.id];
    if (v.short) r.sh = 1;
    const f = fullLink(v.description); if (f && f !== v.id) { r.f = f; if (r.k === 'video') r.k = 'extract'; }
    const dt = dashedTitle(title);
    if (dt) { r.pl = dt.place; r.y = dt.year; }
    if (v.recorded) { r.r = v.recorded; if (!r.y) r.y = Number(v.recorded.slice(0, 4)); }
    if (v.archive) r.ar = v.archive;
    const cd = cleanDescription(v.description); if (cd && cd !== title && cd !== v.title) descriptions[v.id] = cd;
    return r;
  });
  return {
    index: { version: 1, channel: { key: store.channel.key, id: store.channel.id, name: store.channel.name }, count: index.length, shorts: index.filter((r) => r.sh).length, kinds: tally(index, 'kind'), kindSources: tally(index, 'kindSource'), rows: index },
    playlists: { version: 1, channel: store.channel.key, count: playlists.length, playlists },
    descriptions: { version: 1, channel: store.channel.key, descriptions },
  };
}

const tally = (rows, k) => rows.reduce((o, r) => { const v = r[k] || 'none'; o[v] = (o[v] || 0) + 1; return o; }, {});

// The store sorted for stable diffs
export function sortStore(store) {
  const videos = Object.fromEntries(Object.entries(store.videos).sort((a, b) => (b[1].date || '').localeCompare(a[1].date || '') || a[0].localeCompare(b[0])));
  const playlists = Object.fromEntries(Object.entries(store.playlists).sort((a, b) => a[0].localeCompare(b[0])));
  return { ...store, videos, playlists };
}

export { get, hash };
