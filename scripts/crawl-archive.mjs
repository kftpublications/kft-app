// Catch-up crawl of the kfoundation.org media archive, without the rest of the build.
// Same politeness as the nightly build: one request at a time, ≥ REQ_GAP_MS (1000) apart, our User-Agent.
// Lists kft_media (full listing), then reads every page in crawlQueue() order (unread first, then pages read by
// an older parser), saving data/library/archive.json every 50 pages so it can be stopped and resumed.
// Env: ARCHIVE_PAGE_CAP (all), REQ_GAP_MS (1000), TIME_BUDGET_MIN (90).
// The nightly build (build-feeds.mjs) then joins the archive to the libraries and writes public/data.
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readJson, writeJsonIfChanged, sleep } from './lib/util.mjs';
import { emptyArchive, listArchive, crawlQueue, crawlPage, PAGE_PARSER } from './lib/archive.mjs';

const ROOT = process.env.KFT_ROOT || fileURLToPath(new URL('..', import.meta.url));
const FILE = join(ROOT, 'data', 'library', 'archive.json');
const GAP = Number(process.env.REQ_GAP_MS || 1000);
const CAP = Number(process.env.ARCHIVE_PAGE_CAP || Infinity);
const DEADLINE = Date.now() + Number(process.env.TIME_BUDGET_MIN || 90) * 60e3;
const save = (a) => writeJsonIfChanged(FILE, a, { pretty: true, ignore: [] });

const archive = (await readJson(FILE)) || emptyArchive();
if (process.env.SKIP_LIST !== '1') {
  const l = await listArchive(archive, new Date().toISOString(), { full: true });
  console.log(`listed ${l.listed}, removed ${l.removed}`);
  await save(archive);
}
const q = crawlQueue(archive);
console.log(`queue ${q.length} of ${Object.keys(archive.items).length}`);
let n = 0, failed = 0;
for (const it of q) {
  if (n >= CAP || Date.now() > DEADLINE) break;
  const t0 = Date.now();
  try { await crawlPage(it); } catch (err) { failed++; console.log(`failed ${it.slug}: ${err.message}`); if (/^(429|503)/.test(err.message)) await sleep(60e3); }
  n++;
  if (n % 50 === 0) { await save(archive); console.log(`${n}/${q.length} read, ${failed} failed`); }
  const wait = GAP - (Date.now() - t0);
  if (wait > 0) await sleep(wait);
}
await save(archive);
const items = Object.values(archive.items);
console.log(`done: ${n} read, ${failed} failed; current parser ${items.filter((it) => it.pv === PAGE_PARSER || it.gone).length}/${items.length}`);
