// KFT's own archive on kfoundation.org (source 4). KFT's site, not YouTube.
// - List kft_media via WP REST (100/page). Nightly: modified_after (incremental). Weekly: full list (catches deletions).
// - Preferred: YouTube ID / transcript / recording date as REST fields, once KFT adds them (picked up automatically).
// - Until then: fetch each media page politely (≤1 req/s, per-run cap) and read
//     var kftMediaConfig = {"platform":"youtube","platformId":"<ID>",…}
//     Yoast VideoObject "datePublished":"YYYY-MM-DD"  (recording date)
//     href=".../transcript/<slug>/"                    (transcript link)
//     kftSubtitlesConfig "languages":[{"lang_code":…}] (caption languages; captions themselves are NOT fetched)
//   A page is fetched again only when its REST `modified` changes.
import { decode, sleep, UA } from './util.mjs';

export const WP = 'https://kfoundation.org/wp-json/wp/v2';
const FIELDS = 'id,slug,link,title,modified_gmt,kft_media_genre,kft_media_audience,meta,acf,youtube_id,platform,platform_id,platformId,transcript,transcript_id,recording_date';
const WEEK = 7 * 864e5;

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
    .filter((it) => !(it.rest?.yt && it.rest?.transcript && it.rest?.recorded) && it.crawled !== it.modified && !(it.gone && it.crawled === it.modified))
    .sort((a, b) => (a.crawled ? 1 : 0) - (b.crawled ? 1 : 0) || b.id - a.id);
}

export async function crawlPage(it) {
  const r = await fetch(`https://kfoundation.org/media/${encodeURIComponent(it.slug)}/`, { headers: { 'User-Agent': UA } });
  if (r.status === 404 || r.status === 410) { it.gone = true; it.crawled = it.modified; return; }
  if (!r.ok) throw new Error(`${r.status} media ${it.slug}`);
  const page = parseMediaPage(await r.text());
  delete it.gone;
  it.page = page;
  it.crawled = it.modified;
}

// Effective values: REST fields win over the page.
export function effective(it) {
  const p = it.page || {}, r = it.rest || {};
  return { platform: r.platform || p.platform || null, yt: r.yt || p.yt || null, platformId: p.platformId || null, recorded: r.recorded || p.recorded || null, transcript: r.transcript || p.transcript || null, transcriptId: r.transcriptId || null, captions: p.captions || null };
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
    if (it.ch) r.ch = it.ch;
    if (it.avail === 'hidden') r.h = 1;
    return r;
  });
  const crawled = Object.values(state.items).filter((it) => it.crawled || it.rest?.yt).length;
  return {
    version: 1,
    count: rows.length,
    resolved: crawled,           // items whose page (or REST fields) has been read
    withVideo: rows.filter((r) => r.y).length,
    genres: Object.fromEntries((genres || []).map((g) => [g.id, g.name])),
    audiences: Object.fromEntries((audiences || []).map((g) => [g.id, g.name])),
    rows,
  };
}
