// Offline shell. Same-origin files are served from cache at once and refreshed in the background
// (stale-while-revalidate), so a new deploy reaches users on their next visit. feed.json and centre.json
// are network-first (fresh when online, last good copy offline). Only successful responses are cached.
// Downloaded episodes live in a separate cache (kft-audio-v1, written by app.js) under a same-origin
// address, ./offline-audio/<episode id>, and are served from it with byte ranges, so they play offline.
// Streamed MP3s from Podbean never pass through this worker. Bump CACHE when the shell list changes.
const CACHE = 'kft-app-v6';
const AUDIO = 'kft-audio-v1';
const SHELL = ['./', './index.html', './css/app.css', './js/app.js', './vendor/hark.css', './vendor/hark-hero.css', './vendor/hark.js', './manifest.webmanifest', './icons/icon-192.png', './icons/kft-logo.png', './data/centre.json', './data/feed.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== AUDIO && k !== 'kft-daily-v1').map((k) => caches.delete(k)))).then(() => self.clients.claim())
));

// Never answer a fetch with nothing (Safari reports "Returned response is null"): offline and not cached is a 503
const offline = () => new Response('Offline', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain' } });
// Data files are fetched as data/<file>?v=<hash>. Keep one copy per file: when a new version is stored,
// older versions of the same path are dropped, so the cache doesn't grow with every nightly build.
const put = (req, res) => {
  if (res && res.ok) {
    const copy = res.clone();
    const u = new URL(req.url);
    caches.open(CACHE).then(async (c) => {
      await c.put(req, copy);
      if (u.pathname.includes('/data/') && u.searchParams.has('v')) {
        for (const k of await c.keys()) { const o = new URL(k.url); if (o.pathname === u.pathname && o.search !== u.search) await c.delete(k); }
      }
    });
  }
  return res;
};

// A downloaded episode, answering Range requests (audio elements seek with them)
async function fromAudioCache(req) {
  const cache = await caches.open(AUDIO);
  const hit = await cache.match(req.url, { ignoreVary: true, ignoreSearch: true });
  if (!hit) return new Response('Not downloaded', { status: 404 });
  const range = req.headers.get('range');
  if (!range) return hit;
  const blob = await hit.blob();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  let start = m && m[1] ? Number(m[1]) : 0;
  let end = m && m[2] ? Number(m[2]) : blob.size - 1;
  if (m && !m[1] && m[2]) { start = Math.max(0, blob.size - Number(m[2])); end = blob.size - 1; }
  if (start >= blob.size || end < start) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${blob.size}` } });
  end = Math.min(end, blob.size - 1);
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: { 'Content-Type': hit.headers.get('Content-Type') || 'audio/mpeg', 'Content-Range': `bytes ${start}-${end}/${blob.size}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' },
  });
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // never touch MP3s, YouTube or Inn Style
  if (url.pathname.includes('/offline-audio/')) { e.respondWith(fromAudioCache(e.request)); return; }
  // Live data: fresh when online; offline, the last good copy (daily.json may also sit in kft-daily-v1; instagram.json is optional)
  if (/\/data\/(feed|centre|daily|instagram)\.json$/.test(url.pathname)) {
    e.respondWith(fetch(e.request).then((r) => (r.ok ? put(e.request, r) : caches.match(e.request, { ignoreSearch: true }).then((c) => c || r))).catch(() => caches.match(e.request, { ignoreSearch: true }).then((c) => c || offline())));
    return;
  }
  // Offline, a versioned data file falls back to the copy of the same file kept from an earlier version
  // and a page in the app's scope falls back to the app shell
  const fallback = () => Promise.resolve(url.pathname.includes('/data/') ? caches.match(e.request, { ignoreSearch: true }) : e.request.mode === 'navigate' ? caches.match('./') : undefined).then((r) => r || offline());
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((r) => put(e.request, r)).catch(() => hit || fallback());
    if (hit) e.waitUntil(net);
    return hit || net;
  }));
});
