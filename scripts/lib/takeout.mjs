// Google Takeout ("YouTube and YouTube Music") importer for the channel seed in data/seed/youtube/<channel>/.
// Reads ONLY the video-metadata and playlist CSVs, and only the columns the app needs. Files that hold personal
// data (comments, history, subscriptions, live chats…) are never read; the build warns if they were committed.
import { readdir, readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';

// Personal-data parts of a Takeout export, by folder or file name. Never read.
export const PERSONAL_DIR = /^(comments|my-comments|live[ -]?chats?|my-live-chat-messages|history|subscriptions|chats|purchases|memberships)$/i;
export const PERSONAL_FILE = /^(comments|my-comments|subscriptions|watch-history|search-history|live[ -]?chats?|purchases|memberships)\b/i;
export const isPersonal = (path) => path.split(/[\\/]/).slice(0, -1).some((d) => PERSONAL_DIR.test(d)) || PERSONAL_FILE.test(basename(path));

// RFC 4180 CSV (quoted fields, doubled quotes, newlines inside quotes, optional BOM)
export function parseCsv(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  const head = (rows.shift() || []).map((h) => h.trim());
  return rows.filter((r) => r.some((x) => x.trim() !== '')).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const col = (row, ...pats) => { for (const p of pats) { const k = Object.keys(row).find((h) => p.test(h)); if (k && row[k] !== '') return row[k]; } return ''; };
const isoOrNull = (s) => { const d = new Date(s); return s && !isNaN(d) ? d.toISOString() : null; };
const keyOf = (s) => s.toLowerCase().replace(/-videos$/, '').replace(/[^a-z0-9]+/g, '');

async function walk(dir) {
  let out = [];
  let ents;
  try { ents = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(await walk(p)); else out.push(p);
  }
  return out;
}

// Returns null when there is no seed, else { videos: Map(id -> row), playlists: [...], skipped: [personal files] }
export async function importTakeout(dir) {
  const all = await walk(dir);
  const files = all.filter((f) => /\.csv$/i.test(f));
  const skipped = all.filter((f) => isPersonal(f.slice(dir.length))).map((f) => basename(f));
  if (!files.length) return skipped.length ? { videos: new Map(), playlists: [], skipped } : null;
  const videos = new Map(); const playlistMeta = []; const itemFiles = [];
  for (const file of files) {
    const name = basename(file);
    // A per-playlist file ("Ojai 1984-videos.csv") is allowed even though "videos" appears in it.
    if (isPersonal(file.slice(dir.length))) continue;
    const rows = parseCsv(await readFile(file, 'utf8'));
    if (!rows.length) continue;
    const head = Object.keys(rows[0]).join('|');
    if (/Playlist ID/i.test(head) && /Title/i.test(head)) {
      rows.forEach((r) => playlistMeta.push({ id: col(r, /^Playlist ID$/i), title: col(r, /Playlist Title/i, /^Title$/i), visibility: col(r, /Visibility/i, /Privacy/i).toLowerCase() || null }));
    } else if (/Video ID/i.test(head) && /Title/i.test(head)) {
      for (const r of rows) {
        const id = col(r, /^Video ID$/i);
        if (!/^[\w-]{11}$/.test(id)) continue;
        const ms = Number(col(r, /Duration \(ms\)/i));
        const sec = Number(col(r, /Duration \(s(ec(onds)?)?\)/i));
        videos.set(id, {
          id,
          title: col(r, /Video Title/i, /^Title$/i),
          date: isoOrNull(col(r, /Publish Timestamp/i, /Published/i, /Create Timestamp/i)),
          durationSec: ms > 0 ? Math.round(ms / 1000) : sec > 0 ? Math.round(sec) : null,
          privacy: col(r, /Privacy/i).toLowerCase() || null,
          state: col(r, /Video State/i).toLowerCase() || null,
          description: col(r, /Description/i),
        });
      }
    } else if (/Video ID/i.test(head)) {
      itemFiles.push({ key: keyOf(name.replace(/\.csv$/i, '')), ids: rows.map((r) => col(r, /^Video ID$/i)).filter((x) => /^[\w-]{11}$/.test(x)) });
    }
  }
  const playlists = [];
  for (const it of itemFiles) {
    const meta = playlistMeta.find((p) => keyOf(p.title) === it.key);
    if (!meta || !meta.id) continue;
    if (meta.visibility && meta.visibility !== 'public') continue;
    playlists.push({ id: meta.id, title: meta.title, items: it.ids });
  }
  return { videos, playlists, skipped };
}
