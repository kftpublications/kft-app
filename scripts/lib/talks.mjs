// Recognise "which talk is this" from titles and prose, so the build can link the same talk across libraries:
//   Collection title  "Ojai 1984 (6/6) • Talk 4: Is Love Part of Consciousness?"
//   Official channel  "J. Krishnamurti - Ojai 1984 - Public Talk 4 - Is love part of consciousness?"
//   UoC chapter prose "Krishnamurti’s second talk in Ojai 1983"
//   KFT extract desc  "From the fifth public talk in Madras (Chennai), 1980-81. Watch the full video at https://youtu.be/…"
// A talk key is "<place>-<year>-<type>-<n>", e.g. "ojai-1984-talk-4". Types: talk, discussion, qa, dialogue,
// conversation, seminar; a "s-" prefix marks school/student meetings (they are numbered separately).
import { slug } from './util.mjs';

const ORD = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12, '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '6th': 6, '7th': 7, '8th': 8, '9th': 9, '10th': 10 };
const PLACE_ALIAS = { chennai: 'madras', mumbai: 'bombay', delhi: 'new-delhi', brockwood: 'brockwood-park', 'brockwood-park-school': 'brockwood-park', varanasi: 'rajghat', 'rajghat-besant-school': 'rajghat' };

export function placeKey(place = '') {
  const p = slug(place.replace(/\([^)]*\)/g, ' ').replace(/^the\s+/i, ''));
  return PLACE_ALIAS[p] || p;
}

export function typeKey(label = '') {
  const l = label.toLowerCase();
  const school = /\b(school|student)/.test(l) ? 's-' : '';
  if (/question|q\s*&\s*a|answer meeting/.test(l)) return school + 'qa';
  if (/dialogue/.test(l)) return school + 'dialogue';
  if (/discussion/.test(l)) return school + 'discussion';
  if (/conversation|interview/.test(l)) return school + 'conversation';
  if (/seminar/.test(l)) return school + 'seminar';
  if (/talk/.test(l)) return school + 'talk';
  return '';
}

export const talkKey = (place, year, type, n) => (place && year && type && n ? `${placeKey(place)}-${year}-${type}-${n}` : null);

const TYPE_LABEL = { talk: 'Talk', discussion: 'Discussion', qa: 'Q&A', dialogue: 'Dialogue', conversation: 'Conversation', seminar: 'Seminar' };
export function talkLabel(key) {
  const m = /^(.+)-(\d{4})-(s-)?([a-z]+)-(\d+)$/.exec(key || '');
  if (!m) return key;
  const place = m[1].split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  return `${place} ${m[2]} · ${m[3] ? 'School ' : ''}${TYPE_LABEL[m[4]] || m[4]} ${m[5]}`;
}

// "Ojai 1984" or "Madras 1980-81" -> { place, year }
export function placeYear(s = '') {
  const m = /^(.*?)[\s,]+((?:19|20)\d\d)(?:\s*[-–\/]\s*\d{2,4})?\s*$/.exec(s.trim());
  return m ? { place: m[1].replace(/[,\s]+$/, '').trim(), year: Number(m[2]) } : null;
}

// Collection talk label "Talk 4", "Question & Answer Meeting 2", "Students Talk 1", "Conversation with X 3" -> {type, n}
export function labelTypeNum(label = '') {
  const type = typeKey(label);
  const m = /(\d+)\s*$/.exec(label.trim());
  return type ? { type, n: m ? Number(m[1]) : null } : null;
}

// Prose: "<ordinal> [public|school] <kind> ... (in|at) <Place>[,] <Year>"
const PROSE = /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|\d+(?:st|nd|rd|th))\s+((?:public\s+|school\s+|small\s+group\s+|question\s*(?:&|and)\s*answer\s+)?(?:talk|discussion|dialogue|seminar|meeting|conversation)s?)(?:\s+with\s+students)?(?:\s+(?:in|at|,)\s*|\s*,\s*)((?:the\s+)?[A-Z][\w’'.\- ]*?(?:\s*\([^)]*\))?)\s*,?\s*(?:in\s+)?((?:19|20)\d\d)/;
export function proseTalk(text = '') {
  const m = PROSE.exec(text);
  if (!m) return null;
  const n = ORD[m[1].toLowerCase()];
  let type = typeKey(m[2] + (/students|school/i.test(text.slice(m.index, m.index + m[0].length)) ? ' school' : ''));
  if (/meeting/i.test(m[2]) && !/question/i.test(m[2])) type = type || 'qa';
  const place = m[3].trim();
  return { place, year: Number(m[4]), type, n, key: talkKey(place, Number(m[4]), type, n) };
}

// Official-channel style title: "J. Krishnamurti - Ojai 1984 - Public Talk 4 - Title"
export function dashedTitle(title = '') {
  const parts = title.split(/\s+[-–]\s+/);
  if (parts.length < 3 || !/krishnamurti/i.test(parts[0])) return null;
  const py = placeYear(parts[1]);
  if (!py) return null;
  const tn = labelTypeNum(parts[2]);
  return { ...py, type: tn?.type || '', n: tn?.n || null, key: tn ? talkKey(py.place, py.year, tn.type, tn.n) : null };
}
