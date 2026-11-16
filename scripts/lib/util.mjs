// Shared helpers for the feed builder: fetching, XML/HTML text, JSON files that only change when content changes.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';

export const UA = 'KFT-App-FeedBuilder/0.2 (+https://kfoundation.org)';

// fetch with a timeout and one retry on network errors / 5xx. Tests replace globalThis.fetch.
export async function get(url, { as = 'text', timeout = 30000, retries = 1, headers = {} } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeout);
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, ...headers }, signal: ctl.signal });
      if (!r.ok) {
        const err = new Error(`${r.status} ${url}`); err.status = r.status;
        if (r.status < 500) throw err;
        lastErr = err; continue;
      }
      return as === 'json' ? await r.json() : as === 'buffer' ? Buffer.from(await r.arrayBuffer()) : await r.text();
    } catch (err) {
      lastErr = err;
      if (err.status && err.status < 500) throw err;
    } finally { clearTimeout(t); }
  }
  throw lastErr;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '\u2019', lsquo: '\u2018', rdquo: '\u201d', ldquo: '\u201c', ndash: '\u2013', mdash: '\u2014', hellip: '\u2026', bull: '\u2022' };
// One pass, so "&amp;lt;" becomes "&lt;" (not "<"). Handles hex and astral code points.
export const decodeEntities = (s = '') => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') { const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1)); try { return String.fromCodePoint(n); } catch { return m; } }
  return ENT[e.toLowerCase()] ?? m;
});
export const unCdata = (s = '') => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
export const decode = (s = '') => decodeEntities(unCdata(s)).trim();

const esc = (n) => n.replace(/[:.]/g, '\\$&');
export const tag = (xml, name) => { const m = xml.match(new RegExp(`<${esc(name)}(?:\\s[^>]*)?>([\\s\\S]*?)</${esc(name)}>`)); return m ? decode(m[1]) : ''; };
export const rawTag = (xml, name) => { const m = xml.match(new RegExp(`<${esc(name)}(?:\\s[^>]*)?>([\\s\\S]*?)</${esc(name)}>`)); return m ? unCdata(m[1]) : ''; };
export const attr = (xml, name, a) => { const m = xml.match(new RegExp(`<${esc(name)}\\s[^>]*?\\b${a}="([^"]*)"`)); return m ? decode(m[1]) : ''; };
export const blocks = (xml, name) => xml.match(new RegExp(`<${esc(name)}[\\s>][\\s\\S]*?</${esc(name)}>`, 'g')) || [];

// HTML to plain text that keeps paragraph breaks ("\n\n") and line breaks ("\n").
export function htmlToText(html = '') {
  return decodeEntities(unCdata(html)
    .replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h\d|li|blockquote)>/gi, '\n\n')
    .replace(/<[^>]+>/g, ''))
    .replace(/\r/g, '')
    .replace(/[ \t\u00a0]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
export const oneLine = (s = '') => s.replace(/\s+/g, ' ').trim();

export const isoDate = (s) => { if (!s) return null; const d = new Date(s); return isNaN(d) ? null : d.toISOString(); };
// itunes:duration can be seconds ("3760"), "MM:SS" or "HH:MM:SS"
export const seconds = (s) => { if (!s) return null; const n = String(s).split(':').reduce((t, p) => t * 60 + Number(p), 0); return Number.isFinite(n) && n > 0 ? Math.round(n) : null; };

export const hash = (s, n = 10) => createHash('sha256').update(s).digest('hex').slice(0, n);
export const slug = (s = '') => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export async function readJson(path, fallback = undefined) {
  try { return JSON.parse(await readFile(path, 'utf8')); } catch { return fallback; }
}

// Serialise and write only when the content (ignoring the given top-level keys, e.g. generatedAt) changed.
// Returns { changed, text } where text is what is on disk afterwards.
export async function writeJsonIfChanged(path, obj, { ignore = ['generatedAt'], pretty = false } = {}) {
  const ser = (o) => JSON.stringify(o, null, pretty ? 2 : 0) + '\n';
  const strip = (o) => { if (!o || typeof o !== 'object' || Array.isArray(o)) return o; const c = { ...o }; ignore.forEach((k) => delete c[k]); return c; };
  const text = ser(obj);
  let old;
  try { old = await readFile(path, 'utf8'); } catch { /* new file */ }
  if (old !== undefined) {
    try { if (JSON.stringify(strip(JSON.parse(old))) === JSON.stringify(strip(obj))) return { changed: false, text: old }; } catch { /* rewrite a broken file */ }
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text);
  return { changed: true, text };
}

// GitHub Actions annotations; plain console lines elsewhere.
export const warnings = [];
export function warn(title, msg) { warnings.push(`${title}: ${msg}`); console.log(`::warning title=${title}::${String(msg).replace(/\n/g, ' ')}`); }
