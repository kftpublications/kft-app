// Cross-library matches and the compact search index, both computed at build time (never on the phone).
import { talkKey, talkLabel, dashedTitle, proseTalk, placeKey } from './talks.mjs';

// libs: { uoc, collection (podcast files), videos: { kft: index, official: index, other: index }, archive (public archive) }
export function buildMatches(libs) {
  const talks = {};
  const add = (key, lib, val) => { if (!key) return; const t = (talks[key] ||= { label: talkLabel(key) }); (t[lib] ||= []).some((x) => JSON.stringify(x) === JSON.stringify(val)) || t[lib].push(val); };
  libs.collection.episodes.forEach((e) => add(e.talkKey, 'c', e.key));
  libs.uoc.episodes.forEach((e) => (e.chapters || []).forEach((ch, i) => add(ch.talk, 'u', [e.key, i])));
  const fullTalk = {};
  for (const [chKey, idx] of Object.entries(libs.videos)) {
    for (const r of idx.rows) {
      const d = dashedTitle(r.t);
      if (d?.key) add(d.key, 'v', [chKey, r.id]);
      // KFT extracts point at their full video ("Watch the full video at https://youtu.be/…")
      if (r.f) fullTalk[r.id] = r.f;
      // KFT "The Krishnamurti Podcast - Ep. 305 - …" is the video of UoC episode 305
      const ep = /^The Krishnamurti Podcast\s*[-–]\s*Ep\.?\s*(\d+)/i.exec(r.t);
      if (ep) add(`podcast-ep-${ep[1]}`, 'v', [chKey, r.id]);
    }
  }
  libs.uoc.episodes.forEach((e) => { if (talks[`podcast-ep-${e.number}`]) add(`podcast-ep-${e.number}`, 'u', [e.key, -1]); });
  // Archive items: recording date + YouTube ID; link by video ID to any talk the video is in.
  const vidTalks = {};
  for (const [k, t] of Object.entries(talks)) (t.v || []).forEach(([, id]) => { (vidTalks[id] ||= []).push(k); });
  (libs.archive?.rows || []).forEach((a) => { if (a.y && vidTalks[a.y]) vidTalks[a.y].forEach((k) => add(k, 'a', a.id)); });
  // Keep talks that join at least two different libraries (or a podcast episode to its video)
  for (const [k, t] of Object.entries(talks)) {
    const libsIn = ['c', 'u', 'v'].filter((l) => t[l]?.length).length;
    if (libsIn < 2) delete talks[k];
    else if (k.startsWith('podcast-ep-')) t.label = `Urgency of Change · Ep. ${k.slice(11)}`;
  }
  const byItem = {};
  const link = (id, k) => { (byItem[id] ||= []).includes(k) || byItem[id].push(k); };
  for (const [k, t] of Object.entries(talks)) {
    (t.c || []).forEach((id) => link(id, k));
    (t.u || []).forEach(([id]) => link(id, k));
    (t.v || []).forEach(([, id]) => link(id, k));
  }
  return { version: 1, talks, byItem, fullTalk };
}

// Search index: one array per item, fields listed once. Types: u, c (episodes), cs (Collection series),
// v (video; channel in field 5), pl (playlist), a (archive item).
export function buildSearch(libs) {
  const items = [];
  const placesOf = (s = '') => [...s.matchAll(/(?:in|at)\s+([A-Z][\w’'. -]*?)(?:,)?\s+((?:19|20)\d\d)/g)].map((m) => [m[1].trim(), m[2]]);
  libs.uoc.episodes.forEach((e) => {
    const py = (e.chapters || []).flatMap((c) => placesOf(c.source || ''));
    items.push(['u', e.key, e.title, [...new Set(py.map((x) => x[0]))].join(' '), [...new Set(py.map((x) => x[1]))].join(' '), e.theme || '', (e.chapters || []).map((c) => c.title).join(' · '), '']);
  });
  libs.collection.episodes.forEach((e) => items.push(['c', e.key, e.talkTitle || e.title, e.place || '', e.year ? String(e.year) : '', e.series || '', e.talk || '', '']));
  (libs.collection.series || []).forEach((s) => items.push(['cs', s.id, `${s.name} · ${s.parts} part${s.parts === 1 ? '' : 's'}`, s.place || '', s.year ? String(s.year) : '', s.name, '', '']));
  for (const [chKey, idx] of Object.entries(libs.videos)) {
    idx.rows.forEach((r) => items.push(['v', r.id, r.t, r.pl || '', r.y ? String(r.y) : '', chKey, r.k, r.kind]));
    (libs.playlists[chKey]?.playlists || []).forEach((p) => items.push(['pl', p.id, p.title, p.place || '', p.year ? String(p.year) : '', chKey, `${p.n} videos`, '']));
  }
  (libs.archive?.rows || []).filter((a) => !a.h).forEach((a) => items.push(['a', String(a.id), a.t, '', a.r ? a.r.slice(0, 4) : '', a.y || '', (a.g || []).map((g) => libs.archive.genres[g]).filter(Boolean).join(' '), '']));
  return {
    version: 1,
    fields: ['type', 'id', 'title', 'place', 'year', 'group', 'extra', 'kind'],
    types: { u: 'Urgency of Change episode', c: 'Collection episode', cs: 'Collection series', v: 'Video (group = channel, extra = format, kind = full|extract|short|unknown)', pl: 'Playlist (group = channel)', a: 'Archive item (group = YouTube ID)' },
    items,
  };
}

export { talkKey, proseTalk, placeKey };
