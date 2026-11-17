// A small JSON-schema subset validator (type, required, properties, additionalProperties:false, items, enum,
// pattern, minimum, maximum, minItems, minLength, maxLength) and the schemas for every public output. No dependency.

export function validate(schema, value, path = '$', errors = []) {
  if (errors.length > 20) return errors;
  const types = [].concat(schema.type || []);
  if (types.length) {
    const t = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value;
    const ok = types.some((x) => x === t || (x === 'number' && t === 'integer'));
    if (!ok) { errors.push(`${path}: expected ${types.join('|')}, got ${t}`); return errors; }
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: ${JSON.stringify(value)} not in enum`);
  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: "${value.slice(0, 40)}" does not match ${schema.pattern}`);
    if (schema.maxLength && value.length > schema.maxLength) errors.push(`${path}: longer than ${schema.maxLength}`);
    if (schema.minLength && value.length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`);
  }
  if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: below ${schema.minimum}`);
  if (typeof value === 'number' && schema.maximum !== undefined && value > schema.maximum) errors.push(`${path}: above ${schema.maximum}`);
  if (Array.isArray(value)) {
    if (schema.minItems && value.length < schema.minItems) errors.push(`${path}: fewer than ${schema.minItems} items`);
    if (schema.items) value.forEach((v, i) => validate(schema.items, v, `${path}[${i}]`, errors));
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const k of schema.required || []) if (!(k in value)) errors.push(`${path}: missing ${k}`);
    if (schema.properties) for (const [k, s] of Object.entries(schema.properties)) if (k in value) validate(s, value[k], `${path}.${k}`, errors);
    if (schema.additionalProperties === false && schema.properties) for (const k of Object.keys(value)) if (!(k in schema.properties)) errors.push(`${path}: unexpected key ${k}`);
    if (schema.values) for (const [k, v] of Object.entries(value)) validate(schema.values, v, `${path}.${k}`, errors);
  }
  return errors;
}

const S = { type: 'string' }, N = { type: 'number' }, I = { type: 'integer' };
const str = (pattern) => ({ type: 'string', pattern });
const nul = (s) => ({ ...s, type: [].concat(s.type, 'null') });
const ISO = '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$';
const DAY = '^\\d{4}-\\d{2}-\\d{2}$';
const URL = '^https?://';
const YT = '^[\\w-]{11}$';
const arr = (items, extra = {}) => ({ type: 'array', items, ...extra });

const chapter = { type: 'object', required: ['start', 'title'], additionalProperties: false, properties: { start: nul({ type: 'integer', minimum: 0 }), title: S, source: S, talk: S } };
const episode = {
  type: 'object', additionalProperties: false,
  required: ['id', 'key', 'show', 'number', 'title', 'date', 'durationSec', 'audioUrl', 'link', 'season', 'episode', 'description'],
  properties: {
    id: { type: 'string', minLength: 1 }, key: str('^[uc]\\d+x*$'), show: { enum: ['uoc', 'collection'] }, number: I, title: { type: 'string', minLength: 1 },
    date: nul(str(ISO)), durationSec: nul(I), audioUrl: str(URL), link: S, season: nul(I), episode: nul(I), image: str(URL), description: S,
    theme: S, chapters: arr(chapter), series: S, seriesId: S, part: I, parts: I, place: S, year: I, talk: S, talkTitle: S, talkKey: S,
  },
};
export const podcastSchema = {
  type: 'object', required: ['version', 'show', 'count', 'episodes'], additionalProperties: false,
  properties: {
    version: I, show: { type: 'object', required: ['id', 'title', 'image'], properties: { id: S, title: S, image: S, link: S } }, count: I,
    episodes: arr(episode, { minItems: 1 }),
    series: arr({ type: 'object', required: ['id', 'name', 'parts', 'episodes'], additionalProperties: false, properties: { id: S, name: S, parts: I, episodes: arr(S), first: I, latestDate: nul(S), place: S, year: I, incomplete: { type: 'boolean' } } }),
  },
};
const videoRow = {
  type: 'object', required: ['id', 't', 'd', 's', 'k', 'kind'], additionalProperties: false,
  properties: { id: str(YT), t: S, d: nul(str(DAY)), s: nul(I), k: { enum: ['extract', 'talk', 'discussion', 'qa', 'dialogue', 'conversation', 'seminar', 'audio', 'podcast', 'video'] }, kind: { enum: ['full', 'extract', 'short', 'unknown'] }, kindSource: { enum: ['archive-format', 'archive-genre', 'description-link', 'duration', 'feed-link', 'channel', 'title'] }, p: arr(S), sh: { enum: [1] }, f: str(YT), pl: S, y: I, r: str(DAY), ar: I, fm: { enum: ['extract', 'full-video', 'full-audio'] } },
};
export const videoIndexSchema = { type: 'object', required: ['version', 'channel', 'count', 'rows'], additionalProperties: false, properties: { version: I, channel: { type: 'object', required: ['key', 'name'] }, count: I, shorts: I, kinds: { type: 'object', values: I }, kindSources: { type: 'object', values: I }, rows: arr(videoRow) } };
export const playlistsSchema = {
  type: 'object', required: ['version', 'channel', 'playlists'], additionalProperties: false,
  properties: { version: I, channel: S, count: I, playlists: arr({ type: 'object', required: ['id', 'title', 'n', 'items', 'complete'], additionalProperties: false, properties: { id: str('^[\\w-]{10,64}$'), title: S, n: I, complete: { type: 'boolean' }, items: arr(str(YT)), place: S, year: I } }) },
};
export const descSchema = { type: 'object', required: ['version', 'channel', 'descriptions'], properties: { version: I, channel: S, descriptions: { type: 'object', values: S } } };
export const archiveSchema = {
  type: 'object', required: ['version', 'count', 'rows'], additionalProperties: false,
  properties: {
    version: I, count: I, resolved: I, withVideo: I, withFormat: I, genres: { type: 'object', values: S }, audiences: { type: 'object', values: S },
    rows: arr({ type: 'object', required: ['id', 's', 't'], additionalProperties: false, properties: { id: I, s: S, t: S, g: arr(I), a: arr(I), y: str(YT), pf: S, pid: S, r: str(DAY), tr: S, tid: I, cl: arr(S), fm: { enum: ['extract', 'full-video', 'full-audio'] }, pl: S, ch: { enum: ['kft', 'official', 'other'] }, h: { enum: [1] } } }),
  },
};
export const searchSchema = { type: 'object', required: ['version', 'fields', 'items'], properties: { version: I, fields: arr(S), types: { type: 'object' }, items: arr({ type: 'array' }) } };
export const matchesSchema = {
  type: 'object', required: ['version', 'talks', 'byItem'],
  properties: { version: I, talks: { type: 'object', values: { type: 'object', required: ['label'], properties: { label: S, c: arr(S), u: arr({ type: 'array' }), v: arr({ type: 'array' }), a: arr(I) } } }, byItem: { type: 'object', values: arr(S) }, fullTalk: { type: 'object', values: str(YT) } },
};
const block = { type: 'object', required: ['type'], properties: { type: { enum: ['image', 'heading', 'text', 'cta', 'rule'] }, src: S, alt: S, text: S, style: S, label: S, url: str(URL), links: arr({ type: 'object', required: ['text', 'url'] }) } };
const legacyEp = { type: 'object', required: ['key', 'title', 'audioUrl'], properties: { key: S, title: S, audioUrl: str(URL), date: nul(S) } };
const legacyVid = { type: 'object', required: ['id', 'title', 'kind'], properties: { id: str(YT), title: S, date: nul(S), thumbnail: str(URL) } };
export const feedSchema = {
  type: 'object', additionalProperties: false,
  required: ['version', 'generatedAt', 'files', 'counts', 'podcasts', 'videos', 'retreats', 'promotions', 'archiveGenres'],
  properties: {
    version: I, generatedAt: str(ISO),
    files: { type: 'object', values: { type: 'object', required: ['v', 'bytes'], properties: { v: str('^[0-9a-f]{10}$'), bytes: I, n: I } } },
    counts: { type: 'object', values: I },
    podcasts: { type: 'object', required: ['urgencyOfChange', 'collection'], values: { type: 'object', required: ['title', 'image', 'episodes'], properties: { title: S, image: S, episodes: arr(legacyEp) } } },
    videos: { type: 'object', required: ['kftChannel', 'officialChannel'], values: arr(legacyVid) },
    retreats: arr({ type: 'object', required: ['promo', 'name', 'start', 'nights'], properties: { promo: I, name: S, start: str(DAY), nights: I } }),
    promotions: arr({ type: 'object', required: ['id', 'title', 'blocks'], properties: { id: I, title: S, image: S, blocks: arr(block) } }),
    archiveGenres: arr({ type: 'object', required: ['id', 'name', 'count'], properties: { id: I, name: S, count: I } }),
    images: { type: 'object', values: str('^data/img/[\\w.-]+$') },
  },
};

