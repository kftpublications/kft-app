# Proposed architecture: one app, no external web pages

Written 16 Nov 2026 for Hark to implement. The patch in this folder (`kft-app-changes.patch`) is a reference implementation of the web-prototype parts. Test results are in REVIEW.md.

## 1. Target

The user stays inside the app for all content, booking and shopping. The only exception is Donate on iPhone (see 6).

## 2. App shell

- Wrap the existing web app with **Capacitor** (iOS and Android), as in README path A.
- Serve the app from an `https` scheme inside the shell (Capacitor `server.iosScheme` / `androidScheme` = `https`, with a fixed hostname). YouTube and Inn Style need a normal web origin.
- Plugins:
  - **Background audio and lock-screen controls**: a native audio plugin. The Media Session code in `app.js` already supplies the title, artwork and skip actions.
  - **In-app browser**: Capacitor Browser (SFSafariViewController / Chrome Custom Tabs) for pages that need the user's own cookies or Apple Pay, or a full-screen WebView for pages that must look like part of the app.
  - **Downloads**: Filesystem plugin for offline episodes.
  - **Push** (optional): new episode and new retreat dates.

## 3. Data pipeline

`scripts/build-feeds.mjs` runs each night (GitHub Actions, 04:00 UTC) and writes split data files under `public/data/` (formats in section 8). `feed.json` holds only Today data plus a manifest of file versions, so the app downloads a library file only when the user opens that library and only when it changed.

| Section | Source | Status |
|---|---|---|
| Podcasts | Podbean RSS, all episodes | Built: `data/podcasts/uoc.json`, `collection.json` |
| Videos | Keyless only (owner's amendment, 16 Nov 2026): channel RSS kept and added to each night, playlist RSS weekly, optional Google Takeout seed, kfoundation.org archive pages. Weekly oEmbed availability check. **No YouTube Data API and no key** | Built: `data/videos/<channel>/…` |
| KFT archive | kfoundation.org `kft_media` REST + each media page's `kftMediaConfig` (YouTube ID), recording date, transcript link, caption languages | Built: `data/archive/index.json`; first full crawl is spread over about 7 nights (500 pages a night) |
| Centre rates and rules | `public/data/centre.json`, edited by hand | The app reads it at start (step 1) |
| Programme | Inn Style promotion pages | Built, and the app reads it |
| Promotions | kfoundation.org `kft_promotion` (App Promos) | Built: in `feed.json`, as safe blocks (no HTML) |
| Archive genres | kfoundation.org WordPress REST | Built |
| Booking links | `scripts/check-booking-links.mjs` checks every retreat deep link nightly | Built: `data/booking-check.json` |
| Articles, quotes | kfoundation.org | Needs a clean article endpoint (no Divi shortcodes). Article images are mirrored: `data/img/` |
| Today's passage | Krishnamurti Daily | Framework built (`scripts/build-daily.mjs`, `schemas/daily.schema.json`); runs only when a source exists |

Reliability: each source is fetched on its own. If one fails, its last good file (or stored library) is kept and the run prints a GitHub `::warning::`. Every output is checked against its schema before it is written; an invalid output keeps the previous file. Files are rewritten only when their content changes (`generatedAt` is ignored), so a night with no news makes no commit. Escape all feed text before it goes into HTML.

## 4. Video in the app

- Today (web): the YouTube embed plays inline. All 30 videos in the feed allow embedding (tested 16 Nov).
- Native: YouTube shows **Error 153** in a WebView that sends no web address with the request. Fix: host a small `player.html` on our own https domain (it loads the YouTube IFrame Player API with `playsinline=1` and an `origin` parameter), and show that page in the app. Alternative: a native YouTube player library.
- YouTube does not allow background play. For audio with the screen off, use the podcast MP3s. To find the matching MP3 for a talk, add a link between video and episode IDs to the feed.
- Optional, later: KFT hosts its own video copies (Vimeo, Mux or Cloudflare Stream) for downloads, background audio and no YouTube branding. This costs money.

## 5. Booking (Inn Style)

How Inn Style works (checked 16 Nov):

- Each retreat is a "promotion" page: `/promotions/<id>`. Its form is a GET form with the real start date and nights.
- Deep link to the room-and-price step:
  `https://krishnamurticentre.innstyle.co.uk/enquiries/<id>?start_date=YYYY-MM-DD&nights=N&occupancies_attributes%5Badults%5D=G&bo=1964&promotion=<id>`
  This shows the real retreat price for each room type (for example 26 Feb 2027, 4 nights, 1 adult: Standard £420, Large £480, Flat £640, reduced-rate rooms £300 and £340).
- Individual stays: the same step works with enquiry id `1`: `/enquiries/1?start_date=…&nights=…&occupancies_attributes%5Badults%5D=G&bo=1964` (checked 16 Nov 2026). The `1` is undocumented; confirm with Inn Style.
- Inn Style keeps the booking progress in a cookie. In an iframe on iPhone Safari, this cookie is blocked as a third-party cookie.

Proposal:

1. Programme list and retreat details: native screens from `feed.json`.
2. "Book": open the deep link as a **full page** in the app (WebView or SFSafariViewController), not in an iframe. Then the cookie is first-party and the payment step works. In `app.js` every such link goes through `openExternal(url, kind)`; the native shell defines `window.KFTShell.openExternal` to take it over. On the web build, booking and gift vouchers open in the same tab (Inn Style's Book form targets `_top`), after the app saves its state in `sessionStorage`; Back restores the screen.
3. Ask Inn Style to (a) confirm the `/enquiries/1` link for individual stays, (b) provide an availability API or feed, so the app can show "places left" from real data. Until then, show no "places left" badges.
4. Apple: payment for a stay at the Centre is a real-world service, so the web payment is allowed. No in-app purchase is needed.

## 6. Other web pages

| Page | Proposal |
|---|---|
| Articles, "Start here", biography | Native reader from a clean WordPress endpoint |
| Archive genres | Native list from `kft_media` (titles and genres). Media URLs are needed for playback |
| Store (store.kfoundation.org) | In-app browser. Physical goods may use web payment |
| Newsletter | Native form that posts to the mailing-list service |
| Free 5-day introduction | Native sign-up form, same as the newsletter |
| Gift vouchers | In-app browser (Inn Style) |
| Donate | **iPhone:** only inside the app if Apple approves KFT as a nonprofit and the app uses Apple Pay. If not, it must open Safari. **Android:** check Google Play's policy before release |
| Maps, phone, email | Open the system Maps, Phone and Mail apps. This is normal and expected |


## 7. Test plan (each release)

Test on one iPhone (Safari and installed to the Home Screen) and one Android phone (Chrome):

1. Audio: play, pause, skip 15 and 30, speed, lock screen controls, headphone buttons, switch episode.
2. Video: inline play on both channels, full screen, return to the app.
3. Booking: open each retreat type, check the dates and guests on Inn Style, go to the guest-details step. Do not pay. Do the same for an individual stay.
4. In-app pages: Store basket keeps items, Donate, Gift vouchers, articles.
5. Offline: airplane mode, open the app, check the shell and last feed.
6. Feed: after 04:00 UTC, check that the workflow ran and that the programme matches Inn Style.
7. Accessibility: VoiceOver and TalkBack on each tab, text size at 200%.

## 8. Data files (formats for the app)

All paths are relative to `public/`. All JSON is UTF-8; text is plain (no HTML) and must still be escaped when shown. GitHub Pages serves JSON gzip-compressed. Dates: `…T…Z` = ISO UTC; `YYYY-MM-DD` = a calendar day.

### Versions: fetch only what changed
`data/feed.json` → `files` maps each data file to `{ v, bytes, n }` (`v` = first 10 hex of the file's SHA-256, `n` = item count). Fetch `data/<file>?v=<v>` and cache by that URL; when `v` is unchanged, use the cached copy. Load a library file only when the user opens that library.

### `data/feed.json` (Today, < 100 KB; about 45 KB now)
| key | content |
|---|---|
| `version` | 2 |
| `generatedAt` | ISO time of the build that last changed it |
| `files` | manifest (above) |
| `counts` | `uoc`, `collection`, `kft`, `kftShorts`, `official`, `other`, `archive`, `archiveWithVideo`, `matches` |
| `podcasts.urgencyOfChange`, `podcasts.collection` | `{ title, image, episodes }`; `episodes` = latest 10, each `{ key, id, number, title, date, durationSec, audioUrl, link, description (≤280 chars), image?, theme?, series?, seriesId?, part?, parts? }` (same shape step 1 reads, plus new fields) |
| `videos.kftChannel`, `videos.officialChannel` | latest 10: `{ id, title, date (YYYY-MM-DD), thumbnail (mqdefault), kind, format, short, channel }` |
| `retreats` | `[{ promo, name, start, nights }]` (unchanged) |
| `promotions` | see below |
| `archiveGenres` | `[{ id, name, count }]` |
| `images` | `{ "<kfoundation.org URL>": "data/img/<file>.jpg" }` (article and promotion images, ≤400 px wide) |

**Promotions** (`kft_promotion`, 9 items, ordered by `order`): `{ id, slug, title, order, date, modified, image (local path), imageSource, activeDays: [int], durationDays?, ctaLabel?, ctaUrl?, blocks }`. `blocks` replaces the HTML: `{type:"image", src (local), source, alt}`, `{type:"heading", text}`, `{type:"text", text, style?: "lead"|"quote", links?: [{text,url}]}`, `{type:"cta", label, url}`, `{type:"rule"}`. `cta_label`/`cta_url` are empty in REST today, so the CTA comes from the content. `activeDays` are probably day numbers of the 365-day journey (inferred; not confirmed by KFT).

### `data/podcasts/uoc.json`, `data/podcasts/collection.json`
`{ version, show: { id, title, image, link }, count, episodes: [Episode], series? }`
Episode: `id` (RSS guid), `key` (short stable id: `u<number>` / `c<number>`; use this for progress, downloads, matches and search), `show` (`uoc`|`collection`), `number`, `title`, `date`, `durationSec`, `audioUrl`, `link`, `season`, `episode` (raw `itunes:` values), `image` (only when the episode has its own), `description` (full plain text, paragraphs separated by blank lines).
- **Urgency of Change** (newest first): `number` = position in date order (1–305; matches "Ep. 305" on YouTube; `itunes:episode` restarts each season and the old app id from the MP3 file name collides for 76 episodes). `theme` from "Krishnamurti on …". `chapters: [{ start (seconds, or null when the feed prints "()"), title, source ("Krishnamurti's second talk in Ojai 1983"), talk? (talk key) }]`; 242 of 305 episodes have chapters (the older conversation episodes have none).
- **Collection** (newest first by `itunes:episode`): `series` ("Ojai 1984"), `part`, `parts`, `seriesId`, `place`, `year`, `talk` ("Talk 4"), `talkTitle`, `talkKey`. `series: [{ id, name, parts, episodes: [keys in part order], first, latestDate, place, year, incomplete? }]`, newest first (57 series; 2 have `incomplete` because the feed is missing parts).

### `data/videos/<channel>/…` (channel = `kft`, `official`, `other`)
`index.json`: `{ version, channel: { key, id, name }, count, shorts, kinds, kindSources, rows }`, rows newest first. Row (compact):
| key | meaning |
|---|---|
| `id` | YouTube ID. Thumbnails: `https://i.ytimg.com/vi/<id>/mqdefault.jpg` (grid), `hqdefault.jpg` (video screen) |
| `t` | title, cleaned (no " \| Krishnamurti" / " \| J. Krishnamurti", no "Audio \|") |
| `d` | YouTube publish day, or null (archive-only videos: use `r`) |
| `s` | duration in seconds **only from Takeout**, else null. Read `getDuration()` from the player on first play; never guess |
| `k` | format: `talk`, `discussion`, `qa`, `dialogue`, `conversation`, `seminar`, `audio` (title began "Audio \|"), `podcast` (UoC episode video), `extract`, `video` |
| `kind` | Watch division: `full`, `extract`, `short`, `unknown` (rules below) |
| `kindSource` | `archive-format`, `duration`, `feed-link`, `description-link`, `channel` (absent when `kind` is `unknown`) |
| `fm` | format label printed on the kfoundation.org media page: `extract`, `full-video`, `full-audio` (a `full-audio` row has `k: "audio"`) |
| `sh` | 1 = a YouTube Short (the feed links it as `/shorts/<id>`). Shorts only in the Shorts row |
| `p` | playlist IDs containing the video |
| `f` | the full video this extract comes from ("Watch the full video at …") |
| `pl`, `y` | place and year from a "J. Krishnamurti - Ojai 1984 - Public Talk 4 - …" title, else `pl` from the archive page's meta line; `y` from the recording date |
| `r` | recording date (kfoundation.org archive) |
| `ar` | kfoundation.org `kft_media` id (archive item) |

**Watch kind rules** (Toby, post-audit fix list, 17 Nov 2026; replaces the 16 Nov genre rule), in order: (1) archive match by YouTube ID, using the **format label** the kfoundation.org media page prints after the date ("… \| 23 APRIL 1978 \| VIDEO EXTRACT", "FULL VIDEO", "FULL AUDIO"): extract → `extract` (a vertical Short stays `short`), full video / full audio → `full` (`kindSource: "archive-format"`). The archive **genre** (Talk, Discussion, Dialogue, …) is the type of the source recording, so an extract of a talk has genre Talk: genre is a filter and label only and never decides the kind. (2) Duration where known (Takeout): ≤60 s → `short`, < 20 min → `extract`, else `full`; a video the feed links as `/shorts/<id>` → `short` (`kindSource: "feed-link"`). (3) "Watch the full video at …" in the description → `extract`. (4) Channel: Official → `full`, KFT Channel → `extract`. (5) Else `unknown`. Nothing else is guessed. Toby's sample of 40 media pages: 26 extract, 9 full video, 5 full audio.

`playlists.json`: `{ version, channel, count, playlists: [{ id, title, n, complete, items: [video IDs in playlist order], place?, year? }] }`. `complete: false` = the playlist feed was full (15 items), so it may be longer; Takeout makes it complete.
`descriptions.json`: `{ version, channel, descriptions: { <id>: text } }`, full description without the link/subscribe boilerplate (timestamps kept). Load only on the video screen.

### `data/archive/index.json` (kfoundation.org media archive)
`{ version, count, resolved, withVideo, withFormat, genres: {id: name}, audiences: {id: name}, rows }`. Row: `id` (kft_media id), `s` (slug: page `https://kfoundation.org/media/<s>/`), `t` title, `g` genre ids, `a` audience ids, `y` YouTube ID, `pf`/`pid` (platform other than YouTube, e.g. spotify), `r` recording date, `tr` transcript slug (`https://kfoundation.org/transcript/<tr>/`), `tid` transcript id (when REST provides it), `cl` caption language codes, `ch` channel found by oEmbed (archive-only videos), `h` 1 = hidden by oEmbed, `fm` format label (`extract` \| `full-video` \| `full-audio`), `pl` place from the page's meta line (title case, e.g. "Wolf Lake School, Victoria, British Columbia"). `resolved` = rows whose page has been read; the rest fill in over the first nights. Pages read before the parser learned a field (`PAGE_PARSER` in `archive.mjs`) are queued again, oldest parser first.


### `data/matches.json` (same talk across libraries)
`{ version, talks: { <talkKey>: { label, c: [Collection keys], u: [[UoC key, chapter index]] (index -1 = the whole episode), v: [[channel, video id]], a: [archive ids] } }, byItem: { <episode key | video id>: [talkKeys] }, fullTalk: { <extract id>: <full video id> } }`.
Talk key = `<place>-<year>-<type>-<n>`, e.g. `ojai-1984-talk-4`; type `talk`, `discussion`, `qa`, `dialogue`, `conversation`, `seminar`, with `s-` for school/student meetings; `podcast-ep-<n>` links a UoC episode to its video. Only talks found in at least two libraries are kept. "Watch this talk": `byItem[episodeKey]` → `talks[k].v`. "Listen as audio": `byItem[videoId]` → `talks[k].c` / `u`.

### `data/search.json`
`{ version, fields: ["type","id","title","place","year","group","extra","kind"], types, items: [[…]] }`. Types: `u`, `c` (episodes; id = key), `cs` (Collection series), `v` (video; group = channel, extra = format, kind = Watch kind), `pl` (playlist), `a` (archive item; group = YouTube ID, extra = genres). Built for a simple client-side token search; it works offline once cached. Places for UoC episodes come from the chapter sources, matched against a known-places list (`KNOWN_PLACES` in `index-build.mjs`; aliases such as "Brockwood Park School" → Brockwood Park), deduped; years deduped and sorted. Archive items carry the place from their page.

### Other files
- `data/booking-check.json`: nightly Inn Style check `{ version, resultSince, retreats, passed, failed, pages: {home, giftVouchers}, results: [{ promo, name, start, nights, url, endDate, checks: {deepLink, promotion, endDate?}, ok }] }`. `resultSince` changes only when the results change.
- `data/daily.json`: written only when a Daily source exists (`DAILY_SOURCE_URL` repository variable, or committed `data-src/daily/*.json`), validated against `schemas/daily.schema.json`. Never invented. Until then the repo ships an empty, schema-valid placeholder (`"passages": []`) so the app's start-up request answers 200 instead of logging a 404; the app shows the same empty state for it.
- Not deployed (repo root): `data/library/youtube/<channel>.json` (stored, append-only libraries with descriptions, sources, oEmbed status), `data/library/archive.json` (archive crawl state), `data/seed/youtube/` (Takeout seed CSVs and `playlists.json`).

### Video sources and checks (no API key)
1. **Takeout seed** (optional, none yet): put the CSVs from "YouTube and YouTube Music" (`videos/videos.csv`, `playlists/playlists.csv`, `playlists/<title>-videos.csv`) in `data/seed/youtube/<channel>/`. Only video ID, title, publish date, duration, privacy, state and description are read; only public videos are used. Comments, history, subscriptions, chats and purchases must not be committed; the build never reads them and warns if they are there.
2. **Channel RSS** nightly, added to the stored library (never replaced).
3. **Playlist RSS** weekly per playlist in `data/seed/youtube/playlists.json` (14 IDs, taken from the playlist embeds on kfoundation.org/video, 16 Nov 2026; replace with KFT's list or the Takeout export).
4. **kfoundation.org archive**: `kft_media` REST listing (full weekly, `modified_after` nightly) and each media page (≤1 req/s, 500 pages a night, read again only when `modified` changes). If KFT adds the YouTube ID, transcript and recording date as REST fields, those are used and the page is not fetched. Captions are not fetched.
5. **oEmbed** (`https://www.youtube.com/oembed?format=json&url=…watch?v=<id>`), ≤1 req/s, at most 900 a night: new videos first, then each video once a week. 200 = keep; 401/404 = hide (kept in the store, shown again if a later check returns 200); other answers change nothing. Archive-only videos join the channel library that oEmbed names as their author (`other` if neither channel).

**YouTube policy note.** The YouTube API Services Developer Policies (https://developers.google.com/youtube/terms/developer-policies, "Last updated 2026-11-06") say non-authorized API Data may be stored "not longer than 30 calendar days" before it is refreshed or deleted (III.E.4.d), and that stored data must reasonably match current YouTube data (III.E.4.e). They also forbid scraping YouTube applications (III.E.6). This pipeline uses no YouTube Data API and no scraping; even so, every stored video is re-checked with oEmbed at least weekly, which also keeps us well inside the 30-day refresh rule if any of this is ever treated as API Data. Required: the app must show YouTube attribution on YouTube content and link to YouTube's Terms of Service in its own terms (III.A, III.F.2).

## 9. App side (how `public/js/app.js` uses the data)
- Start: `feed.json`, `centre.json` and `daily.json` (each optional; built-in fallbacks for the first two, an empty state for Daily). Then `files` gives every other path with its version: video indexes load at once (about 30 KB), podcast lists when Listen opens, `descriptions.json` on the first video screen of a channel, `matches.json` on the first episode or video screen, `search.json` on first focus of search, `archive/index.json` only when an archive search result without a YouTube ID is opened.
- Service worker (`sw.js`, cache `kft-app-v4`): app shell and `centre.json`/`feed.json` precached; `feed.json`, `centre.json` and `daily.json` network-first; other same-origin files stale-while-revalidate (versioned URLs, so a change is a new entry; storing a new version drops the older versions of the same data file, and offline a missing version falls back to the last kept copy of that file). Downloads: `kft-audio-v1` (served from `./offline-audio/<id>` with byte ranges) and `kft-daily-v1`. Cross-origin requests (Podbean, YouTube, Inn Style) never pass through the worker.
- Ids: episodes by `key`, videos by YouTube id, retreats by Inn Style promotion id (so a live feed reload never changes which retreat a sheet shows).
