// Local copies of kfoundation.org images (the site blocks hotlinking: with a foreign Referer it answers with a
// small placeholder PNG instead of the photo). Each image is downloaded once, resized to ≤400 px wide with sharp
// (devDependency), and kept under public/data/img/<stable-name>.jpg. Map: public/data/img/images.json.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { get, hash, slug } from './util.mjs';

export const imageName = (url) => {
  const base = url.split('?')[0].split('/').pop().replace(/\.[a-z0-9]+$/i, '');
  return `${slug(base).slice(0, 48)}-${hash(url, 6)}.jpg`;
};

let sharpMod;
async function loadSharp() {
  if (sharpMod !== undefined) return sharpMod;
  try { sharpMod = (await import('sharp')).default; } catch { sharpMod = null; }
  return sharpMod;
}

// urls: source URLs. Returns { map: {url: 'data/img/x.jpg'}, fetched, failed: [url], resized: bool }
export async function mirrorImages(urls, dir, prevMap = {}, { width = 400 } = {}) {
  await mkdir(dir, { recursive: true });
  const sharp = await loadSharp();
  const map = {}; const failed = []; let fetched = 0;
  for (const url of [...new Set(urls)].filter((u) => /^https?:\/\//.test(u))) {
    const name = imageName(url);
    const file = join(dir, name);
    let exists = false;
    try { await access(file); exists = true; } catch { /* missing */ }
    if (exists && prevMap[url]) { map[url] = `data/img/${name}`; continue; }
    try {
      const buf = await get(url, { as: 'buffer', timeout: 60000 });
      let out = buf;
      if (sharp) out = await sharp(buf).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
      await writeFile(file, out);
      map[url] = `data/img/${name}`; fetched++;
    } catch (err) {
      if (exists) map[url] = `data/img/${name}`; else failed.push(`${url} (${err.message})`);
    }
  }
  return { map, fetched, failed, resized: !!sharp };
}

export async function articleImageUrls(configPath) {
  try { const j = JSON.parse(await readFile(configPath, 'utf8')); return (j.images || []).map((x) => (typeof x === 'string' ? x : x.url)); } catch { return []; }
}
