// node --test scripts/test/   (no network: fetch is mocked from fixtures)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { parseFeed, emptyStore, applyChannelFeed, toPublic, cleanTitle, videoKind, cleanDescription, dueForCheck } from '../lib/youtube.mjs';
import { parsePodcast, parseChapters, parseCollectionTitle, timeToSec } from '../lib/podcasts.mjs';
import { parseCsv, importTakeout } from '../lib/takeout.mjs';
import { parseMediaPage, restFields } from '../lib/archive.mjs';
import { promoBlocks } from '../lib/promotions.mjs';
import { validate, videoIndexSchema, podcastSchema } from '../lib/schema.mjs';
import { proseTalk, dashedTitle } from '../lib/talks.mjs';
import { dateForms, lastNight, checkEnquiry } from '../check-booking-links.mjs';

const FX = fileURLToPath(new URL('./fixtures/', import.meta.url));
const SCRIPTS = fileURLToPath(new URL('..', import.meta.url));
const fx = (n) => readFileSync(FX + n, 'utf8');
const NOW = '2026-11-16T23:00:00.000Z';

test('Shorts are flagged from the feed link (/shorts/<id> vs /watch?v=)', () => {
  const kft = parseFeed(fx('yt-kft.xml'));
  const official = parseFeed(fx('yt-official.xml'));
  const raw = fx('yt-kft.xml');
  for (const e of kft.entries) {
    const isShortLink = raw.includes(`href="https://www.youtube.com/shorts/${e.id}"`);
    assert.equal(e.short, isShortLink, e.id);
  }
  assert.equal(kft.entries.filter((e) => e.short).length, 10);
  assert.equal(official.entries.filter((e) => e.short).length, 0);
  const pub = toPublic((() => { const s = emptyStore('kft'); applyChannelFeed(s, kft, NOW); return s; })()).index;
  assert.equal(pub.shorts, 10);
  assert.ok(pub.rows.filter((r) => r.sh).every((r) => raw.includes(`/shorts/${r.id}`)));
});

test('Title cleanup and kinds', () => {
  assert.deepEqual(cleanTitle('Space means silence | Krishnamurti'), { title: 'Space means silence', audio: false });
  assert.deepEqual(cleanTitle('Audio | J. Krishnamurti - Paris 1965 - Public Talk 5 - The root'), { title: 'J. Krishnamurti - Paris 1965 - Public Talk 5 - The root', audio: true });
  assert.equal(videoKind('official', 'Audio | J. Krishnamurti - Paris 1965 - Public Talk 4 - x'), 'audio');
  assert.equal(videoKind('official', 'J. Krishnamurti - Ojai 1984 - Public Talk 4 - Is love part of consciousness?'), 'talk');
  assert.equal(videoKind('kft', 'The Krishnamurti Podcast - Ep. 305 - Krishnamurti on Non-violence'), 'podcast');
  assert.equal(videoKind('kft', 'You are anger | Krishnamurti'), 'extract');
  assert.equal(dashedTitle('J. Krishnamurti - Ojai 1984 - Public Talk 4 - x').key, 'ojai-1984-talk-4');
});

test('Stored library is append-only: a later feed without old videos keeps them', () => {
  const s = emptyStore('kft');
  const feed = parseFeed(fx('yt-kft.xml'));
  applyChannelFeed(s, feed, NOW);
  const later = { ...feed, entries: feed.entries.slice(0, 2).map((e) => ({ ...e, id: e.id.slice(0, 10) + 'Z' })) };
  applyChannelFeed(s, later, NOW);
  assert.equal(Object.keys(s.videos).length, 17);
});

test('Descriptions keep the text and timestamps, drop link/boilerplate lines', () => {
  const d = 'Intro line.\n0:00 Start\n12:34 Second part\n\n· Instagram — https://www.instagram.com/x\n· Free Newsletter — https://kfoundation.org/newsletter\nSubscribe for more\n\nThis channel is managed by the Krishnamurti Foundation Trust, UK.\nMore boilerplate';
  assert.equal(cleanDescription(d), 'Intro line.\n0:00 Start\n12:34 Second part');
});

test('oEmbed rolling schedule: unchecked first, weekly re-check', () => {
  const rows = [{ id: 'a', checked: '2026-11-15T00:00:00Z' }, { id: 'b', checked: null }, { id: 'c', checked: '2026-11-01T00:00:00Z' }];
  assert.deepEqual(dueForCheck(rows, NOW).map((r) => r.id), ['b', 'c']);
});

test('Podcasts: all episodes, Collection series/parts, UoC chapters', () => {
  const u = parsePodcast(fx('uoc.xml'), 'uoc');
  const c = parsePodcast(fx('collection.xml'), 'collection');
  assert.equal(u.count, 4);
  const ep = u.episodes[0];
  assert.equal(ep.theme, 'Non-violence');
  assert.deepEqual(ep.chapters.slice(0, 3).map((x) => [x.start, x.title, x.talk]), [[156, 'The Fiction of Non-violence', 'rajghat-1963-talk-1'], [846, 'The Violent Pursuit of Non-violence', 'brockwood-park-1983-s-discussion-3'], [1911, 'Ending Violence Completely', 'ojai-1983-talk-2']]);
  assert.equal(ep.chapters[3].start, null); // the feed prints "()" for the final extract
  assert.ok(!/<[a-z]/i.test(ep.description));
  assert.deepEqual(c.episodes.map((e) => e.number), [300, 299, 298, 297, 296, 295, 294]);
  const ojai = c.series.find((s) => s.name === 'Ojai 1984');
  assert.equal(ojai.parts, 6);
  assert.deepEqual(ojai.episodes, ['c294', 'c295', 'c296', 'c297', 'c298', 'c299']);
  assert.equal(c.episodes[1].talkKey, 'ojai-1984-talk-4');
  assert.deepEqual(validate(podcastSchema, u), []);
  assert.deepEqual(validate(podcastSchema, c), []);
  assert.equal(timeToSec('2m 6s'), 126);
  assert.equal(timeToSec('1:02:03'), 3723);
  assert.equal(parseChapters('The first extract (2m 6s) is from Krishnamurti’s fifth talk in Saanen 1982, titled ‘What is beauty?’')[0].title, 'What is beauty?');
  assert.equal(parseCollectionTitle('228 • Saanen 1985 (8/8) • 3rd Question & Answer Meeting').series, 'Saanen 1985');
  assert.equal(proseTalk('From the fifth public talk in Madras (Chennai), 1980-81. Watch').key, 'madras-1980-talk-5');
});

test('Takeout importer: needed columns only, public only, personal files never read', () => {
  const dir = mkdtempSync(join(tmpdir(), 'takeout-'));
  mkdirSync(join(dir, 'videos')); mkdirSync(join(dir, 'playlists')); mkdirSync(join(dir, 'comments'));
  writeFileSync(join(dir, 'videos', 'videos.csv'), 'Video ID,Approx Duration (ms),Video Title (Original),Privacy,Video State,Video Publish Timestamp,Video Description (Original)\nAAAAAAAAAAA,125000,"Talk, one",Public,Published,2020-01-02T03:04:05+00:00,"Line 1\nLine 2"\nBBBBBBBBBBB,1000,Private one,Private,Published,2020-01-02T03:04:05+00:00,\n');
  writeFileSync(join(dir, 'playlists', 'playlists.csv'), 'Playlist ID,Playlist Title (Original),Playlist Visibility\nPLxxxxxxxxxxxxxx,Ojai 1984,Public\n');
  writeFileSync(join(dir, 'playlists', 'Ojai 1984-videos.csv'), 'Video ID,Playlist Video Creation Timestamp\nAAAAAAAAAAA,2020\n');
  writeFileSync(join(dir, 'comments', 'comments.csv'), 'Comment ID,Text\n1,secret\n');
  return importTakeout(dir).then((seed) => {
    assert.equal(seed.videos.get('AAAAAAAAAAA').durationSec, 125);
    assert.equal(seed.videos.get('AAAAAAAAAAA').title, 'Talk, one');
    assert.equal(seed.videos.get('AAAAAAAAAAA').description, 'Line 1\nLine 2');
    assert.equal(seed.videos.get('BBBBBBBBBBB').privacy, 'private');
    assert.deepEqual(seed.playlists, [{ id: 'PLxxxxxxxxxxxxxx', title: 'Ojai 1984', items: ['AAAAAAAAAAA'] }]);
    assert.deepEqual(seed.skipped, ['comments.csv']);
    assert.equal(parseCsv('a,b\n"x ""y""",2\n')[0].a, 'x "y"');
  });
});

test('Archive media page: YouTube ID, recording date, transcript, caption languages; REST fields preferred', () => {
  assert.deepEqual(parseMediaPage(fx('media-page.html')), { platform: 'youtube', yt: 'N_oCPm5P_rg', recorded: '1978-04-23', transcript: 'k-school-discussion-3-victoria-british-columbia-23-april-1978', captions: ['en'] });
  assert.deepEqual(restFields({ id: 1 }), {});
  assert.equal(restFields({ meta: { youtube_id: 'N_oCPm5P_rg' } }).yt, 'N_oCPm5P_rg');
});

test('Promotion HTML becomes safe blocks', () => {
  const b = promoBlocks('<style>.x{}</style><img class="hero" src="https://kfoundation.org/a.jpg" alt="A"><h2>Hi &amp; bye</h2><p class="quote">“Q”</p><p><a class="cta" href="https://kfoundation.org/donate/">Support</a></p><hr>');
  assert.deepEqual(b.map((x) => x.type), ['image', 'heading', 'text', 'cta', 'rule']);
  assert.equal(b[1].text, 'Hi & bye');
  assert.equal(b[2].style, 'quote');
});

test('Booking check helpers', () => {
  assert.equal(lastNight('2027-08-13', 5), '2027-08-17');
  assert.equal(lastNight('2026-11-20', 4), '2026-11-23');
  assert.ok(dateForms('2026-11-20').includes('20 Nov 2026'));
  const html = '<h2>Availability for the Young Adults Retreat • November 2026 package</h2><p>Friday 20 November</p><span>£380</span><input value="2026-11-23" type="hidden" name="booking[end_date]" />';
  const r = checkEnquiry({ name: 'Young Adults Retreat', start: '2026-11-20', nights: 4 }, { status: 200, body: html });
  assert.deepEqual(r.fails, []);
  assert.equal(r.endDate, '2026-11-23');
  assert.ok(checkEnquiry({ name: 'Gathering', start: '2026-11-20' }, { status: 200, body: html }).fails.length === 1);
});

// Acceptance test 9 (amended): one source offline keeps the last good library.
test('Build: a source going offline keeps the last good library (integration, mocked network)', () => {
  const root = mkdtempSync(join(tmpdir(), 'kftbuild-'));
  mkdirSync(join(root, 'public', 'data'), { recursive: true });
  const run = (down) => execFileSync(process.execPath, ['--import', join(SCRIPTS, 'test', 'mock-fetch.mjs'), join(SCRIPTS, 'build-feeds.mjs')], { env: { ...process.env, KFT_ROOT: root, MOCK_DOWN: down, REQ_GAP_MS: '0', OEMBED_CAP: '100' }, encoding: 'utf8' });
  const read = (p) => JSON.parse(readFileSync(join(root, 'public', 'data', p), 'utf8'));
  const out1 = run('');
  assert.match(out1, /Podcasts: UoC 4, Collection 7/);
  const kft1 = read('videos/kft/index.json');
  const off1 = read('videos/official/index.json');
  assert.equal(kft1.count, 15);
  assert.equal(kft1.shorts, 10);
  assert.equal(off1.count, 4 + 1); // 4 from RSS + 1 archive-only video (oEmbed author @KFoundation)
  const arow = off1.rows.find((r) => r.id === 'N_oCPm5P_rg');
  assert.deepEqual([arow.kind, arow.kindSource, arow.r], ['full', 'archive-genre', '1978-04-23']);
  assert.ok(kft1.rows.filter((r) => r.sh).every((r) => r.kind === 'short'));
  const arch = read('archive/index.json');
  assert.equal(arch.rows[0].y, 'N_oCPm5P_rg');
  assert.equal(arow.ar, 74210);
  const feed1 = read('feed.json');
  assert.equal(feed1.counts.kft, 15);
  assert.ok(feed1.files['videos/kft/index.json'].v);
  // Second night: YouTube feeds and the UoC feed are down
  const out2 = run('youtube.com/feeds,feed.podbean.com/krishnamurti/');
  assert.match(out2, /::warning title=YouTube channel feed failed, kept stored library::kft/);
  assert.match(out2, /::warning title=Podcast feed failed, kept previous file::uoc/);
  assert.deepEqual(read('videos/kft/index.json'), kft1);
  assert.deepEqual(read('videos/official/index.json'), off1);
  assert.equal(read('podcasts/uoc.json').count, 4);
  const feed2 = read('feed.json');
  assert.equal(feed2.counts.kft, 15);
  assert.equal(feed2.files['videos/kft/index.json'].v, feed1.files['videos/kft/index.json'].v);
  assert.ok(existsSync(join(root, 'data', 'library', 'youtube', 'kft.json')));
});

test('Watch kind rules: archive genre, duration, feed link, channel, unknown', async () => {
  const { classify } = await import('../lib/youtube.mjs');
  assert.deepEqual(classify('official', { genres: ['Extracts'] }), { kind: 'extract', kindSource: 'archive-genre' });
  assert.deepEqual(classify('kft', { genres: ['Question & Answer'] }), { kind: 'full', kindSource: 'archive-genre' });
  assert.deepEqual(classify('official', { durationSec: 45 }), { kind: 'short', kindSource: 'duration' });
  assert.deepEqual(classify('official', { durationSec: 600 }), { kind: 'extract', kindSource: 'duration' });
  assert.deepEqual(classify('kft', { durationSec: 3600 }), { kind: 'full', kindSource: 'duration' });
  assert.deepEqual(classify('official', { short: true }), { kind: 'short', kindSource: 'feed-link' });
  assert.deepEqual(classify('official', {}), { kind: 'full', kindSource: 'channel' });
  assert.deepEqual(classify('kft', {}), { kind: 'extract', kindSource: 'channel' });
  assert.deepEqual(classify('other', {}), { kind: 'unknown' });
});

test('Daily: no source writes nothing; a valid source is written; an invalid one is refused', () => {
  const root = mkdtempSync(join(tmpdir(), 'kftdaily-'));
  mkdirSync(join(root, 'public', 'data'), { recursive: true });
  const run = () => execFileSync(process.execPath, [join(SCRIPTS, 'build-daily.mjs')], { env: { ...process.env, KFT_ROOT: root, DAILY_SOURCE_URL: '' }, encoding: 'utf8' });
  assert.match(run(), /daily: no source/);
  assert.ok(!existsSync(join(root, 'public', 'data', 'daily.json')));
  mkdirSync(join(root, 'data-src', 'daily'), { recursive: true });
  const p = { day: 1, flowId: 'f', flowTitle: 'F', flowIndex: 1, flowLength: 2, text: 'T', source: { work: 'W' } };
  writeFileSync(join(root, 'data-src', 'daily', 'a.json'), JSON.stringify({ version: 1, updated: '2026-11-16', passages: [p] }));
  assert.match(run(), /daily: 1 passages/);
  assert.equal(JSON.parse(readFileSync(join(root, 'public', 'data', 'daily.json'), 'utf8')).passages[0].day, 1);
  writeFileSync(join(root, 'data-src', 'daily', 'b.json'), JSON.stringify({ passages: [{ ...p, day: 400 }] }));
  assert.match(run(), /::warning title=Daily source invalid/);
  assert.equal(JSON.parse(readFileSync(join(root, 'public', 'data', 'daily.json'), 'utf8')).passages.length, 1);
});
