// Preloaded with `node --import ./scripts/test/mock-fetch.mjs` by the build integration test.
// Replaces fetch with fixtures; MOCK_DOWN="podbean,youtube.com/feeds,…" makes those hosts/paths fail like a network error.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FX = fileURLToPath(new URL('./fixtures/', import.meta.url));
const fx = (n) => readFileSync(FX + n, 'utf8');
const down = (process.env.MOCK_DOWN || '').split(',').map((s) => s.trim()).filter(Boolean);
const json = (o, headers = {}) => new Response(JSON.stringify(o), { status: 200, headers: { 'content-type': 'application/json', ...headers } });
const xml = (s) => new Response(s, { status: 200, headers: { 'content-type': 'application/xml' } });

globalThis.fetch = async (input) => {
  const url = String(input?.url || input);
  if (down.some((d) => url.includes(d))) throw new TypeError(`fetch failed (mock: ${url} down)`);
  if (url.includes('feed.podbean.com/krishnamurti/')) return xml(fx('uoc.xml'));
  if (url.includes('feed.podbean.com/krishnamurticollection/')) return xml(fx('collection.xml'));
  if (url.includes('channel_id=UCX8wFEiD_FaLPgHM6wPD0Wg')) return xml(fx('yt-kft.xml'));
  if (url.includes('channel_id=UC88A5W9XyWx7WSwthd5ykhw')) return xml(fx('yt-official.xml'));
  if (url.includes('playlist_id=')) return new Response('Not found', { status: 404 });
  if (url.includes('youtube.com/oembed')) {
    if (url.includes('HIDDENVIDEO')) return new Response('Unauthorized', { status: 401 });
    const author = url.includes('N_oCPm5P_rg') ? 'https://www.youtube.com/@KFoundation' : 'https://www.youtube.com/@kft';
    return json({ title: 'x', author_url: author });
  }
  if (url.includes('/wp/v2/kft_media?')) return json([{ id: 74210, slug: 'learning-is-to-act', title: { rendered: 'Learning is to act' }, modified_gmt: '2026-04-24T03:49:20', kft_media_genre: [20], kft_media_audience: [31] }], { 'x-wp-totalpages': '1' });
  if (url.includes('kfoundation.org/media/')) return new Response(fx('media-page.html'), { status: 200 });
  if (url.includes('kft_media_genre')) return json([{ id: 20, name: 'Discussion', count: 760 }]);
  if (url.includes('kft_media_audience')) return json([{ id: 31, name: 'K School', count: 144 }]);
  if (url.includes('kft_promotion')) return json([{ id: 1, slug: 'p', title: { rendered: '1 &#8212; Test' }, meta: { display_order: 1, active_days: '1, 2', cta_label: '', cta_url: '' }, content: { rendered: '<style>x{}</style><div><h2>Hello</h2><p>Body <a class="inline" href="https://kfoundation.org/">link</a></p><p><a class="cta" href="https://kfoundation.org/donate/">Give</a></p></div>' } }]);
  if (url.includes('innstyle.co.uk')) throw new TypeError('fetch failed (mock: Inn Style not mocked)');
  return new Response('not mocked', { status: 404 });
};
