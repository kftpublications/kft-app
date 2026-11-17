// KFT's own archive on kfoundation.org (source 4). KFT's site, not YouTube.
// - List kft_media via WP REST (100/page). Nightly: modified_after (incremental). Weekly: full list (catches deletions).
// - Preferred: YouTube ID / transcript / recording date as REST fields, once KFT adds them (picked up automatically).
// - Until then: fetch each media page politely (≤1 req/s, per-run cap) and read
//     var kftMediaConfig = {"platform":"youtube","platformId":"<ID>",…}
//     Yoast VideoObject "datePublished":"YYYY-MM-DD"  (recording date)
//     href=".../transcript/<slug>/"                    (transcript link)
//     kftSubtitlesConfig "languages":[{"lang_code":…}] (caption languages; captions themselves are NOT fetched)
//     <div class="kft-media-meta"> PLACE | 23 APRIL 1978 | VIDEO EXTRACT </div>  (format label, place, date;
//                                                     place is left out on some pages)
//   A page is fetched again when its REST `modified` changes, or when the parser learns a new field
//   (PAGE_PARSER bumped: pages read by an older parser are queued again, oldest-parser first).
import { decode, sleep, UA } from './util.mjs';

export const WP = 'https://kfoundation.org/wp-json/wp/v2';
const FIELDS = 'id,slug,link,title,modified_gmt,kft_media_genre,kft_media_audience,meta,acf,youtube_id,platform,platform_id,platformId,transcript,transcript_id,recording_date';
const WEEK = 7 * 864e5;

// Bump when parseMediaPage reads a new field, so pages read before it are fetched again.
// 2: format label, place and date from the .kft-media-meta line (17 Nov 2026).
export const PAGE_PARSER = 2;

export const emptyArchive = () => ({ version: 1, listedAt: null, fullListAt: null, items: {} });

async function listPage(page, after) {
  const u = `${WP}/kft_media?per_page=100&page=${page}&orderby=id&order=desc&_fields=${FIELDS}${after ? `&modified_after=${encodeURIComponent(after)}` : ''}`;
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  if (r.status === 400 && page > 1) return { items: [], pages: page - 1 }; // past the last page
  if (!r.ok) throw new Error(`${r.status} kft_media page ${page}`);
  return { items: await r.json(), pages: Number(r.headers.get('x-wp-totalpages')) || 1 };
}

// Values KFT may add as REST fields later; any one of these names is accepted.
export function restFields(it) {
  const m = it.meta && typeof it.meta === 'object' ? it.meta : {};
  const a = it.acf && typeof it.acf === 'object' ? it.acf : {};
  const pick = (...vals) => vals.find((v) => typeof v === 'string' && v.trim()) || null;
  const yt = pick(it.youtube_id, it.platform_id, it.platformId, m.youtube_id, m.platformId, m.platform_id, m.kft_youtube_id, a.youtube_id, a.platformId);
  const out = {};
  if (yt && /^[\w-]{11}$/.test(yt.trim())) { out.yt = yt.trim(); out.platform = pick(it.platform, m.platform, a.platform) || 'youtube'; }
  const tr = pick(it.transcript, m.transcript_slug, m.transcript, a.transcript);
  if (tr) out.transcript = tr.replace(/^.*\/transcript\//, '').replace(/\/$/, '');
  const trId = it.transcript_id ?? m.transcript_id ?? a.transcript_id;
  if (Number(trId)) out.transcriptId = Number(trId);
  const rec = pick(it.recording_date, m.recording_date, a.recording_date);
  if (rec && /^\d{4}-\d{2}-\d{2}/.test(rec)) out.recorded = rec.slice(0, 10);
  return out;
}

// Parse one media page (HTML). Returns {} when nothing is found.
export function parseMediaPage(html) {
  const out = {};
  const cfg = /var\s+kftMediaConfig\s*=\s*(\{[\s\S]*?\})\s*;/.exec(html);
  if (cfg) {
    try {
      const c = JSON.parse(cfg[1]);
      if (c.platform) out.platform = String(c.platform);
      if (c.platformId) out.yt = String(c.platformId);
      if (c.spotifyType) out.spotifyType = String(c.spotifyType);
    } catch { /* malformed config: leave empty */ }
  }
  if (out.platform && out.platform !== 'youtube') { out.platformId = out.yt; delete out.yt; }
  if (out.yt && !/^[\w-]{11}$/.test(out.yt)) delete out.yt;
  const rec = /"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/.exec(html); // VideoObject date-only = recording date
  if (rec) out.recorded = rec[1];
  const tr = /href="https?:\/\/(?:www\.)?kfoundation\.org\/transcript\/([^"\/?#]+)\/?"/.exec(html);
  if (tr) out.transcript = decodeURIComponent(tr[1]);
  Object.assign(out, parseMetaLine(html));
  const sub = html.indexOf('kftSubtitlesConfig');
  if (sub >= 0) {
    const langs = /"languages"\s*:\s*\[([\s\S]*?)\]/.exec(html.slice(sub, sub + 20000));
    if (langs) {
      const codes = [...langs[1].matchAll(/"lang_code"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
      out.captions = [...new Set(codes)];
    }
  }
  return out;
}

// The line printed under the player: "[PLACE |] 23 APRIL 1978 | VIDEO EXTRACT".
// format: extract | full-video | full-audio (any other label is kept as formatLabel only).
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const SMALL = new Set(['of', 'the', 'and', 'in', 'at', 'on', 'de', 'la', 'le', 'du']);
export const titleCase = (s) => s.toLowerCase().replace(/[a-z\u00c0-\u024f]+('[a-z]+)?/g, (w, _a, i) => (i > 0 && SMALL.has(w) ? w : w[0].toUpperCase() + w.slice(1)));
export function formatOf(label = '') {
  const l = label.trim().toUpperCase();
  if (/\bEXTRACTS?\b/.test(l)) return 'extract';
  if (/^FULL\s+VIDEO$/.test(l)) return 'full-video';
  if (/^FULL\s+AUDIO$/.test(l)) return 'full-audio';
  return null;
}
export function parseDay(s = '') {
  const m = /^(?:(\d{1,2})\s+)?([A-Za-z]+)?\s*(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const mo = m[2] ? MONTHS.indexOf(m[2].toLowerCase()) + 1 : 0;
  if (m[2] && !mo) return null;
  if (m[1] && mo) return `${m[3]}-${String(mo).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}`;
  return mo ? `${m[3]}-${String(mo).padStart(2, '0')}` : m[3];
}
export function parseMetaLine(html) {
  const block = /<div[^>]*class="[^"]*\bkft-media-meta\b[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(html);
  if (!block) return {};
  const span = (cls) => { const m = new RegExp(`<span[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/span>`).exec(block[1]); return m ? decode(m[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim() : ''; };
  let place = span('kft-media-location'), date = span('kft-media-date'), label = span('kft-media-type');
  if (!place && !date && !label) {
    // No classed spans: read the plain "A | B | C" text (label last, date the part with a year)
    const parts = decode(block[1].replace(/<[^>]+>/g, ' ')).split('|').map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (parts.length && formatOf(parts[parts.length - 1])) label = parts.pop();
    const di = parts.findIndex((x) => /\b\d{4}$/.test(x));
    if (di >= 0) date = parts.splice(di, 1)[0];
    place = parts.join(', ');
  }
  const out = {};
  const f = formatOf(label);
  if (f) out.format = f; else if (label) out.formatLabel = label;
  if (place) out.place = titleCase(place);
  const d = parseDay(date);
  if (d) out.date = d;
  return out;
}

// Update the listing. Returns { listed, removed, mode }.
export async function listArchive(state, now, { full = false } = {}) {
  const doFull = full || !state.fullListAt || Date.parse(now) - Date.parse(state.fullListAt) >= WEEK - 3600e3;
  // modified_after compares with the site's local time; go back a day to be safe
  const after = doFull ? null : new Date(Date.parse(state.listedAt) - 864e5).toISOString().slice(0, 19);
  const seen = new Set();
  let page = 1, pages = 1, listed = 0;
  do {
    const res = await listPage(page, after);
    pages = res.pages;
    for (const it of res.items) {
      seen.add(String(it.id));
      const old = state.items[it.id] || {};
      const rest = restFields(it);
      state.items[it.id] = {
        ...old,
        id: it.id,
        slug: it.slug,
        title: decode(it.title?.rendered || ''),
        modified: it.modified_gmt || null,
        genres: it.kft_media_genre || [],
        audiences: it.kft_media_audience || [],
        ...(Object.keys(rest).length ? { rest } : {}),
      };
      if (!Object.keys(rest).length) delete state.items[it.id].rest;
      listed++;
    }
    page++;
    if (page <= pages) await sleep(300);
  } while (page <= pages);
  let removed = 0;
  if (doFull && listed > 0) for (const id of Object.keys(state.items)) if (!seen.has(id)) { delete state.items[id]; removed++; }
  state.listedAt = now;
  if (doFull) state.fullListAt = now;
  return { listed, removed, mode: doFull ? 'full' : 'incremental' };
}

// Items whose page must be (re)fetched: REST gives no YouTube ID and the page was not read at this `modified`.
export function crawlQueue(state) {
  return Object.values(state.items)
    .filter((it) => {
      if (it.gone) return it.crawled !== it.modified;
      const fresh = it.crawled === it.modified && (it.pv || 1) >= PAGE_PARSER;
      return !fresh && !(it.rest?.yt && it.rest?.transcript && it.rest?.recorded && it.page?.format);
    })
    .sort((a, b) => (a.crawled ? 1 : 0) - (b.crawled ? 1 : 0) || (a.pv || 1) - (b.pv || 1) || b.id - a.id);
}

export async function crawlPage(it) {
  // A stalled response must not stop the queue (a page hung for minutes in a catch-up crawl, 17 Nov 2026)
  const r = await fetch(`https://kfoundation.org/media/${encodeURIComponent(it.slug)}/`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
  if (r.status === 404 || r.status === 410) { it.gone = true; it.crawled = it.modified; return; }
  if (!r.ok) throw new Error(`${r.status} media ${it.slug}`);
  const page = parseMediaPage(await r.text()); // body read under the same 30 s signal
  delete it.gone;
  it.page = page;
  it.crawled = it.modified;
  it.pv = PAGE_PARSER;
}

// Effective values: REST fields win over the page.
export function effective(it) {
  const p = it.page || {}, r = it.rest || {};
  return { platform: r.platform || p.platform || null, yt: r.yt || p.yt || null, platformId: p.platformId || null, recorded: r.recorded || p.recorded || null, transcript: r.transcript || p.transcript || null, transcriptId: r.transcriptId || null, captions: p.captions || null, format: p.format || null, place: p.place || null, date: p.date || null };
}

// Public compact archive index
export function archivePublic(state, genres, audiences) {
  const rows = Object.values(state.items).filter((it) => !it.gone).sort((a, b) => b.id - a.id).map((it) => {
    const e = effective(it);
    const r = { id: it.id, s: it.slug, t: it.title };
    if (it.genres.length) r.g = it.genres;
    if (it.audiences.length) r.a = it.audiences;
    if (e.yt) r.y = e.yt;
    if (e.platform && e.platform !== 'youtube') { r.pf = e.platform; if (e.platformId) r.pid = e.platformId; }
    if (e.recorded) r.r = e.recorded;
    if (e.transcript) r.tr = e.transcript;
    if (e.transcriptId) r.tid = e.transcriptId;
    if (e.captions?.length) r.cl = e.captions;
    if (e.format) r.fm = e.format;
    if (e.place) r.pl = e.place;
    if (it.ch) r.ch = it.ch;
    if (it.avail === 'hidden') r.h = 1;
    return r;
  });
  const crawled = Object.values(state.items).filter((it) => it.crawled || it.rest?.yt).length;
  const withFormat = rows.filter((r) => r.fm).length;
  return {
    version: 1,
    count: rows.length,
    resolved: crawled,           // items whose page (or REST fields) has been read
    withVideo: rows.filter((r) => r.y).length,
    withFormat,
    genres: Object.fromEntries((genres || []).map((g) => [g.id, g.name])),
    audiences: Object.fromEntries((audiences || []).map((g) => [g.id, g.name])),
    rows,
  };
}

// public/data/coverage.json: how much of the archive has been resolved (page read), by format and by genre,
// and how the Watch libraries are divided. `resolved` = page (or REST fields) read at least once;
// `withFormat` = read by the current parser and printing a format label.
export function coverage(state, pub, videos, now) {
  const items = Object.values(state.items).filter((it) => !it.gone);
  const isRead = (it) => !!(it.crawled || it.rest?.yt);
  const byFormat = { extract: 0, 'full-video': 0, 'full-audio': 0, 'no-label': 0, unread: 0 };
  const byGenre = {};
  for (const it of items) {
    const f = effective(it).format;
    if (f) byFormat[f]++; else if (isRead(it) && (it.pv || 1) >= PAGE_PARSER) byFormat['no-label']++; else byFormat.unread++;
    for (const g of it.genres?.length ? it.genres : [0]) {
      const name = g ? pub.genres?.[g] || String(g) : 'none';
      const o = (byGenre[name] ||= { total: 0, resolved: 0 });
      o.total++; if (isRead(it)) o.resolved++;
    }
  }
  const watch = Object.fromEntries(Object.entries(videos).map(([ch, idx]) => [ch, { count: idx.count, kinds: idx.kinds || {}, kindSources: idx.kindSources || {} }]));
  return {
    version: 1,
    generatedAt: now,
    archive: { total: items.length, resolved: items.filter(isRead).length, withFormat: items.filter((it) => effective(it).format).length, withVideo: pub.withVideo, byFormat, byGenre },
    watch,
  };
}
