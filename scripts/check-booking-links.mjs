// Nightly check of the Inn Style booking deep links (runs after build-feeds.mjs; never fails the deploy).
// GET requests only, ≤1 request per second, a fresh cookie jar for each retreat. Never submits a form.
// Writes public/data/booking-check.json and a GitHub ::warning:: per failure.
//
// Note: Inn Style creates an "enquiry" record (edit_enquiry_<n> form) when the /enquiries/<id> deep link is
// opened, so each nightly check adds one enquiry per retreat on Inn Style's side. Ask Inn Style if that matters.
// On the Book form, booking[end_date] is the LAST NIGHT, not the departure day
// (e.g. 20 Nov 2026 for 4 nights -> end_date 2026-11-23; Gathering 13 Aug 2027, 5 nights -> 17 Aug 2027).
import { readFile } from 'node:fs/promises';
import { writeJsonIfChanged } from './lib/util.mjs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FEED = join(ROOT, 'public', 'data', 'feed.json');
const OUT = join(ROOT, 'public', 'data', 'booking-check.json');
const BASE = 'https://krishnamurticentre.innstyle.co.uk';
const GAP = Number(process.env.REQ_GAP_MS || 1000);
const UA = 'KFT-App-BookingCheck/0.1 (+https://kfoundation.org)';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const deepLink = (r) => `${BASE}/enquiries/${r.promo}?start_date=${r.start}&nights=${r.nights}&occupancies_attributes%5Badults%5D=1&bo=1964&promotion=${r.promo}`;
export const lastNight = (start, nights) => { const d = new Date(`${start}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + nights - 1); return d.toISOString().slice(0, 10); };

const decodeHtml = (s) => s.replace(/\\n|\\"/g, (m) => (m === '\\n' ? ' ' : '"')).replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
export const pageText = (html) => decodeHtml(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const norm = (s) => s.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();

// Human forms of the arrival date as Inn Style prints them ("20 Nov 2026", "Friday 20 November", "20th November")
export function dateForms(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  const day = d.getUTCDate(), mon = MONTHS[d.getUTCMonth()], y = d.getUTCFullYear();
  const sfx = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  return [`${day} ${mon.slice(0, 3)} ${y}`, `${day} ${mon} ${y}`, `${DAYS[d.getUTCDay()]} ${day} ${mon}`, `${mon} ${day}${sfx}`, `${day}${sfx} ${mon}`];
}

// Fresh cookie jar per check: follow redirects by hand so Set-Cookie is carried within one check only.
async function fetchWithJar(url, jar = new Map(), hops = 5) {
  const cookie = [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
  const r = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': UA, ...(cookie ? { Cookie: cookie } : {}) } });
  for (const c of r.headers.getSetCookie?.() || []) { const [kv] = c.split(';'); const i = kv.indexOf('='); if (i > 0) jar.set(kv.slice(0, i).trim(), kv.slice(i + 1).trim()); }
  if ([301, 302, 303, 307, 308].includes(r.status) && hops > 0 && r.headers.get('location')) {
    await r.arrayBuffer().catch(() => {});
    return fetchWithJar(new URL(r.headers.get('location'), url).href, jar, hops - 1);
  }
  return { status: r.status, url, body: await r.text() };
}

export function checkEnquiry(r, res) {
  const fails = [];
  if (res.status !== 200) return [`HTTP ${res.status}`];
  const text = pageText(res.body);
  const t = norm(text);
  if (!t.includes('availability for the')) fails.push('no "Availability for the"');
  if (!t.includes(norm(r.name))) fails.push(`retreat name "${r.name}" not on page`);
  if (!/£\s?\d/.test(text)) fails.push(/no prices for this enquiry/i.test(text) ? 'no price (£): Inn Style says "There are no prices for this enquiry"' : 'no price (£)');
  if (!dateForms(r.start).some((f) => t.includes(norm(f)))) fails.push(`arrival date ${r.start} not on page`);
  const end = /booking\[end_date\][^>]*?value=\\?"(\d{4}-\d{2}-\d{2})|value=\\?"(\d{4}-\d{2}-\d{2})\\?"[^>]*?name=\\?"booking\[end_date\]/.exec(res.body);
  const endDate = end && (end[1] || end[2]);
  return { fails, endDate };
}

export function checkPromotion(res) {
  if (res.status !== 200) return [`HTTP ${res.status}`];
  const sel = (res.body.match(/<select name="start_date"[\s\S]*?<\/select>/) || [''])[0];
  return /value="\d{4}-\d{2}-\d{2}"/.test(sel) ? [] : ['no start date on the promotion page'];
}

async function main() {
  const t0 = Date.now();
  const feed = JSON.parse(await readFile(FEED, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  const retreats = (feed.retreats || []).filter((r) => r.start >= today);
  const results = [];
  const pause = () => new Promise((res) => setTimeout(res, GAP));
  const get = async (url) => { try { return await fetchWithJar(url); } catch (err) { return { status: 0, body: '', error: err.message }; } finally { await pause(); } };
  for (const r of retreats) {
    const row = { promo: r.promo, name: r.name, start: r.start, nights: r.nights, url: deepLink(r), checks: {} };
    // Opening the deep link creates an enquiry record at Inn Style, so it only runs when asked (BOOKING_DEEP=1, manual run).
    if (process.env.BOOKING_DEEP !== '1') {
      const promo = await get(`${BASE}/promotions/${r.promo}`);
      const pf = checkPromotion(promo);
      row.checks.promotion = pf.length ? pf : 'ok';
      row.ok = row.checks.promotion === 'ok';
      results.push(row);
      continue;
    }
    const enq = await get(row.url); // fresh jar per retreat (fetchWithJar default)
    const e = checkEnquiry(r, enq);
    const enqFails = Array.isArray(e) ? e : e.fails;
    row.checks.deepLink = enqFails.length ? enqFails : 'ok';
    if (!Array.isArray(e) && e.endDate) {
      row.endDate = e.endDate;
      const expect = lastNight(r.start, r.nights);
      if (e.endDate !== expect) row.checks.endDate = [`booking[end_date] ${e.endDate}, expected last night ${expect}`];
    }
    const promo = await get(`${BASE}/promotions/${r.promo}`);
    const pf = checkPromotion(promo);
    row.checks.promotion = pf.length ? pf : 'ok';
    row.ok = Object.values(row.checks).every((c) => c === 'ok');
    results.push(row);
  }
  const pages = {};
  for (const [k, path] of [['home', '/'], ['giftVouchers', '/gift-vouchers']]) { const res = await get(BASE + path); pages[k] = { url: BASE + path, status: res.status, ok: res.status === 200 }; }
  const failures = [
    ...results.filter((r) => !r.ok).map((r) => `${r.name} (${r.start}, promo ${r.promo}): ${Object.entries(r.checks).filter(([, v]) => v !== 'ok').map(([k, v]) => `${k}: ${v.join(', ')}`).join('; ')}`),
    ...Object.entries(pages).filter(([, p]) => !p.ok).map(([k, p]) => `${k} ${p.url}: HTTP ${p.status}`),
  ];
  const report = { version: 1, resultSince: new Date().toISOString(), // kept unchanged while the results stay the same (no daily commit noise)
    deepChecked: process.env.BOOKING_DEEP === '1', retreats: results.length, passed: results.filter((r) => r.ok).length, failed: failures.length, pages, results };
  await writeJsonIfChanged(OUT, report, { pretty: true, ignore: ['resultSince'] });
  failures.forEach((f) => console.log(`::warning title=Booking link check failed::${f}`));
  console.log(`Booking check: ${report.passed}/${results.length} retreats pass, home ${pages.home.status}, gift vouchers ${pages.giftVouchers.status}, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => { console.log(`::warning title=Booking link check could not run::${err.message}`); });
}
