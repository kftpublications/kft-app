// Offline shell. Same-origin files are served from cache at once and refreshed in the background
// (stale-while-revalidate), so a new deploy reaches users on their next visit without a manual
// cache-name bump. feed.json stays network-first. Only successful responses are cached.
const CACHE = 'kft-app-v2';
const SHELL = ['./', './index.html', './css/app.css', './js/app.js', './vendor/hark.css', './vendor/hark-hero.css', './vendor/hark.js', './manifest.webmanifest', './icons/icon-192.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
));

const put = (req, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; };

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // never cache MP3s, YouTube or Inn Style
  if (url.pathname.endsWith('/data/feed.json')) {
    e.respondWith(fetch(e.request).then((r) => put(e.request, r)).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((r) => put(e.request, r)).catch(() => hit);
    if (hit) e.waitUntil(net);
    return hit || net;
  }));
});
