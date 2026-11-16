// Daily tab data (gated). Runs only when a source exists:
//   env DAILY_SOURCE_URL  -> JSON fetched from that URL, or
//   data-src/daily/*.json -> committed files (passages merged, in file-name order)
// Otherwise it writes nothing and logs "daily: no source". Passages are never invented or filled in:
// the source must already match schemas/daily.schema.json. An invalid source keeps the previous daily.json.
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { validate } from './lib/schema.mjs';
import { writeJsonIfChanged, get, warn } from './lib/util.mjs';

const ROOT = process.env.KFT_ROOT || fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'public', 'data', 'daily.json');

async function loadSource() {
  if (process.env.DAILY_SOURCE_URL) return [{ name: 'DAILY_SOURCE_URL', data: await get(process.env.DAILY_SOURCE_URL, { as: 'json', timeout: 60000 }) }];
  const dir = join(ROOT, 'data-src', 'daily');
  let files = [];
  try { files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort(); } catch { /* no folder */ }
  return Promise.all(files.map(async (f) => ({ name: f, data: JSON.parse(await readFile(join(dir, f), 'utf8')) })));
}

export async function buildDaily() {
  const sources = await loadSource();
  if (!sources.length) { console.log('daily: no source'); return null; }
  const schema = JSON.parse(await readFile(join(ROOT, 'schemas', 'daily.schema.json'), 'utf8').catch(() => readFile(fileURLToPath(new URL('../schemas/daily.schema.json', import.meta.url)), 'utf8')));
  // A file may be the whole document or {passages:[…]}; nothing else is added.
  const first = sources[0].data;
  const doc = {
    version: first.version ?? 1,
    updated: first.updated,
    passages: sources.flatMap((s) => (Array.isArray(s.data) ? s.data : s.data.passages || [])),
  };
  if (sources.length > 1) doc.updated = sources.map((s) => s.data.updated).filter(Boolean).sort().pop();
  const errors = validate(schema, doc);
  const days = new Map();
  doc.passages.forEach((p, i) => { if (days.has(p.day)) errors.push(`$.passages[${i}]: day ${p.day} repeats passages[${days.get(p.day)}]`); else days.set(p.day, i); });
  doc.passages.forEach((p, i) => { if (p.flowIndex > p.flowLength) errors.push(`$.passages[${i}]: flowIndex ${p.flowIndex} > flowLength ${p.flowLength}`); });
  if (errors.length) { warn('Daily source invalid, kept previous daily.json', `${sources.map((s) => s.name).join(', ')}: ${errors.slice(0, 5).join('; ')}`); return null; }
  doc.passages.sort((a, b) => a.day - b.day);
  const { changed } = await writeJsonIfChanged(OUT, doc, { ignore: [] });
  console.log(`daily: ${doc.passages.length} passages from ${sources.map((s) => s.name).join(', ')} (${changed ? 'written' : 'unchanged'})`);
  return doc;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  buildDaily().catch((err) => warn('Daily build failed, kept previous daily.json', err.message));
}
