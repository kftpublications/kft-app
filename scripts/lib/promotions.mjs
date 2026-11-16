// kfoundation.org "App Promos" (kft_promotion). Only fields that exist in the REST response are used:
// id, slug, title, date/modified, promotion_image, meta.{display_order, active_days, duration_in_days, cta_label, cta_url},
// and content.rendered, which is turned into safe blocks (no HTML reaches the app).
import { decodeEntities, oneLine } from './util.mjs';

export const PROMO_URL = 'https://kfoundation.org/wp-json/wp/v2/kft_promotion?per_page=100&_fields=id,slug,title,date_gmt,modified_gmt,promotion_image,meta,content';

const text = (h) => oneLine(decodeEntities(h.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')));
const attrOf = (h, a) => (new RegExp(`\\b${a}="([^"]*)"`).exec(h) || [])[1] || '';

// content.rendered -> [{type:'image',src,alt}|{type:'heading',text}|{type:'text',text,style?,links?}|{type:'cta',label,url}|{type:'rule'}]
export function promoBlocks(html = '') {
  const body = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  const out = [];
  const re = /<img\b[^>]*>|<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<p\b[^>]*>[\s\S]*?<\/p>|<hr\b[^>]*>/gi;
  let m;
  while ((m = re.exec(body))) {
    const h = m[0];
    if (/^<img/i.test(h)) { const src = decodeEntities(attrOf(h, 'src')); if (/^https?:\/\//.test(src)) out.push({ type: 'image', src, alt: decodeEntities(attrOf(h, 'alt')) }); continue; }
    if (/^<hr/i.test(h)) { out.push({ type: 'rule' }); continue; }
    if (/^<h/i.test(h)) { const t = text(h); if (t) out.push({ type: 'heading', text: t }); continue; }
    // paragraph: may wrap an image or a CTA link
    for (const img of h.match(/<img\b[^>]*>/gi) || []) { const src = decodeEntities(attrOf(img, 'src')); if (/^https?:\/\//.test(src)) out.push({ type: 'image', src, alt: decodeEntities(attrOf(img, 'alt')) }); }
    const cta = /<a\b[^>]*class="[^"]*\bcta\b[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(h);
    if (cta) { const url = decodeEntities(attrOf(cta[0], 'href')); if (/^https?:\/\//.test(url)) out.push({ type: 'cta', label: text(cta[1]), url }); continue; }
    const t = text(h);
    if (!t) continue;
    const b = { type: 'text', text: t };
    const cls = attrOf(h.slice(0, h.indexOf('>') + 1), 'class');
    if (/\bquote\b/.test(cls)) b.style = 'quote';
    else if (/\blead\b/.test(cls)) b.style = 'lead';
    const links = [...h.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map((l) => ({ text: text(l[2]), url: decodeEntities(l[1]) })).filter((l) => /^https?:\/\//.test(l.url) && l.text);
    if (links.length) b.links = links;
    out.push(b);
  }
  return out;
}

export function parsePromotions(list) {
  if (!Array.isArray(list)) throw new Error('kft_promotion: not a list');
  return list.map((p) => {
    const meta = p.meta && typeof p.meta === 'object' ? p.meta : {};
    const o = { id: p.id, slug: p.slug, title: decodeEntities(p.title?.rendered || '').trim() };
    if (typeof meta.display_order === 'number') o.order = meta.display_order;
    if (p.date_gmt) o.date = p.date_gmt + 'Z';
    if (p.modified_gmt) o.modified = p.modified_gmt + 'Z';
    if (typeof p.promotion_image === 'string' && /^https?:\/\//.test(p.promotion_image)) o.image = p.promotion_image;
    if (meta.active_days !== undefined && meta.active_days !== '') o.activeDays = String(meta.active_days).split(/\s*,\s*/).map(Number).filter(Number.isFinite);
    if (Number(meta.duration_in_days)) o.durationDays = Number(meta.duration_in_days);
    if (meta.cta_label) o.ctaLabel = String(meta.cta_label);
    if (meta.cta_url) o.ctaUrl = String(meta.cta_url);
    o.blocks = promoBlocks(p.content?.rendered || '');
    return o;
  }).sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.id - b.id);
}
