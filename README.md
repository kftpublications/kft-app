# Krishnamurti App: concept prototype

A clickable prototype that brings KFT's media and the Krishnamurti Centre into one mobile app. It's used to decide whether this hub goes into **Krishnamurti Daily** or Daily goes into this app.

Status: prototype, 16 Nov 2026. Not for release. Content belongs to Krishnamurti Foundation Trust Ltd.

## Run it
```bash
npm run serve        # http://localhost:5173
npm run feeds        # refresh public/data/feed.json from the live sources
```
Open it on a phone over a real http(s) address (for example GitHub Pages) so YouTube can play inline. A sandboxed preview with a `null` origin falls back to opening YouTube.

## Structure
```
public/
  index.html             app shell (phone frame on desktop, full screen on mobile)
  css/app.css            app styles (Krishnamurti Daily brand: Marcellus, #016e8f)
  js/app.js              all app logic (tabs, audio player, video player, sheets, booking)
  vendor/                base stylesheet + helper script from the page builder
  data/feed.json         generated feed v2: Today data + manifest of the other data files (see ARCHITECTURE.md §8)
  data/podcasts/, data/videos/, data/search.json, data/matches.json, data/archive/, data/img/   generated libraries
  data/daily.json        Daily passages (generated only when KFT's source exists; until then an empty placeholder; schema: schemas/daily.schema.json)
  data/centre.json       Centre rates, closures, stay rules and phone (edited by hand; read at start)
  manifest.webmanifest   makes it installable (Add to Home Screen)
  sw.js                  service worker: offline shell, network-first feed and centre.json, downloaded episodes
  icons/                 placeholder icons (replace with KFT artwork)
scripts/build-feeds.mjs  builds the data files from the public sources (Node 20, no deps)
tests/fixtures/          Daily test data (never shipped)
.github/workflows/feeds.yml  nightly feed refresh + GitHub Pages deploy
```

## Tabs (six; they fit at 360 px with labels and 48 px-high, 59 px-wide targets)
- **Today**: today's Daily passage (only when `data/daily.json` has one), new this week, next at the Centre, Continue listening, Saved
- **Daily**: the 365-day journey of passages from `data/daily.json` (empty state until KFT's data exists; see "Daily data contract")
- **Listen**: Urgency of Change and The Krishnamurti Collection, every episode (`data/podcasts/*.json`, pages of 10), chapters, cross-links, real MP3 playback, downloads
- **Watch**: Full talks | Extracts | Shorts from each video's `kind` (`data/videos/{kft,official}/index.json`), topic chips, YouTube embedded player, "Watch full talk" for extracts
- **Read**: search across the app (`data/search.json`), quotes, articles, archive genres, start here
- **Visit**: Centre programme by month, filters, retreat sheets, "Book your stay" with Inn Style deep links, rates, day visits, getting here

## Data sources
| Content | Source | Notes |
|---|---|---|
| Urgency of Change | https://feed.podbean.com/krishnamurti/feed.xml | RSS, newest first |
| The Krishnamurti Collection | https://feed.podbean.com/krishnamurticollection/feed.xml | 300 eps, **not date-ordered**, so sort by pubDate |
| KFT Channel | YouTube RSS, channel `UCX8wFEiD_FaLPgHM6wPD0Wg` | RSS gives the latest 15; the full back catalogue needs the YouTube Data API v3 |
| Official Channel | YouTube RSS, channel `UC88A5W9XyWx7WSwthd5ykhw` | same |
| Archive genres | kfoundation.org `/wp-json/wp/v2/kft_media_genre` | `kft_media` items return titles and genres only, with no media URLs |
| Articles, quotes | kfoundation.org pages | Divi shortcodes in REST `content`, so a clean article endpoint is needed |
| Programme | Inn Style promotion pages, via `feed.json` → `retreats` | built nightly; built-in copy is the offline fallback |
| Rates, closures, stay rules, phone | `public/data/centre.json` (from krishnamurticentre.org.uk/booking/, checked 16 Nov 2026) | edit this file when they change |
| Booking | https://krishnamurticentre.innstyle.co.uk | deep links (below); opens as a full page, never in an iframe. No public API |

## Known limitations / review points
1. Listen, Watch, search, cross-links and the programme come from the data files; rates from `data/centre.json`; the Daily passage only from `data/daily.json`. Quotes, articles, "Start here" and retreat descriptions are still built-in (steps 3–4).
2. No retreat price estimates: Inn Style shows the real retreat prices.
3. The hard-coded Today passage is gone; Today shows a passage only when `data/daily.json` exists.
4. The framed in-app browser is used only for kfoundation.org and krishnamurticentre.org.uk pages. Inn Style (booking, vouchers) is never framed; on the web it opens in the same tab. A native build should use the platform in-app browser for all of these.
5. YouTube can't play in the background (YouTube terms), so audio-only talks should use the podcast MP3s.
6. Accessibility: tap targets are 44 to 48px. A screen-reader pass hasn't been done.
7. No analytics, accounts or ads, by design (KFT content is free and ad-free).

## Path to the stores
- **A. Wrap with Capacitor**: add native audio (background, lock screen), downloads, push, and in-app browser plugins. Release under KFT's existing Apple and Google developer accounts.
- **B. Fold into Krishnamurti Daily**: port these tabs into Daily's codebase.

## Review merge (16 Nov 2026)
- Took REVIEW.md fixes to `build-feeds.mjs`, `sw.js` and `feeds.yml` as-is.
- App: feed.json now drives Listen, Watch and the archive grid when hosted (built-in lists are the fallback); device date; New Year retreat years; audio error toast; Media Session controls; a11y fixes (mini player, segments, sheet focus/Escape); localStorage for positions, saves and Continue listening.
- In-app browser only frames kfoundation.org and krishnamurticentre.org.uk; other hosts open in a new tab. (Superseded by step 1 below for Inn Style: booking now deep-links with dates and guests.)
- Retreat price estimates removed (Inn Style shows them).

## Step 1 and follow-ups (16 Nov 2026)

### Data the app reads (formats: ARCHITECTURE.md §8)
- `data/feed.json` (v2) first: Today, the programme, the `files` manifest and `counts`. Every other file is fetched as `data/<file>?v=<hash>` from the manifest, so the service worker keeps one copy per version.
- **Listen**: the first 10 episodes come from `feed.json`; the full lists (`data/podcasts/uoc.json`, `collection.json`, about 1.6 MB together) load when Listen opens. "Load more" adds pages of 10. Episode ids are the data's `key` (`u305`, `c300`), used for progress, downloads, matches and search. UoC chapters are listed on the episode screen (tap to play from that point).
- **Watch**: rows from `data/videos/{kft,official,other}/index.json`. Segments Full talks | Extracts | Shorts come from each row's `kind`; `unknown` or missing `kind` follows the channel (Official → Full talks, others → Extracts), as the pipeline does; a segment with no items is hidden. Older feeds that only carry a format (`talk`, `discussion`, `audio`…) count as full talks. The tablist has `aria-selected`, arrow-key navigation, 44 px targets and remembers the last choice (`localStorage`). Archive-only videos (`d` null) show "Recorded <r>". Descriptions load per channel only on the video screen. Extracts with `f` get "Watch full talk". YouTube attribution and a link to YouTube's Terms of Service are on every video screen.
- **Search** (Read tab): `data/search.json` loads on first focus of the search field (then offline via the service worker); every word must match title, place, year, group or extra; titles that match rank first. Results open the episode, video, series (Listen › Collection showing just that series' parts in order, with "All Collection episodes" to go back), playlist (YouTube) or archive page (kfoundation.org media page via `data/archive/index.json`).
- **Cross-links**: `data/matches.json` loads on the first episode or video screen and adds "Also in the app": "Watch this talk" (episode → video) and "Listen as audio" (video → Collection episode or UoC chapter).
- **Article images**: only the feed's own copies (`feed.json` → `images`, `data/img/…`); kfoundation.org blocks hotlinked images, so without a copy the app shows a tinted tile with the title's first letter.

### Saved on the device (`localStorage`, prefix `kapp.v1.`)
Playback position per episode (`pos`), last episode (`cur`), recently played (`recent`), played (`played`), saved episodes and videos (`savedItems`), downloads (`dl`), a small `lib` so saved items list offline, last Watch segment (`wkind`), and for Daily: start date (`dailyStart`), favourites with their text (`dailyFav`), reminder time (`dailyReminder`), download summary (`dailyDl`). Today shows **Continue listening** (up to three) and **Saved**. Media Session: title, show, artwork, play/pause/stop, seek, next/previous, position.

### Downloads
Real files: the MP3 (Podbean sends `Access-Control-Allow-Origin: *`) goes into the Cache API (`kft-audio-v1`) under `./offline-audio/<id>`; `sw.js` serves it with byte ranges. Daily "Download all readings" also stores `daily.json` and transcripts in `kft-daily-v1`, shows progress and size, and can be removed. A transcript on a host without CORS cannot be saved; the app says how many files failed.

### Booking (Inn Style), web build
- Deep links (checked 16 Nov 2026):
  - Retreat: `https://krishnamurticentre.innstyle.co.uk/enquiries/<promo>?start_date=YYYY-MM-DD&nights=N&occupancies_attributes%5Badults%5D=<guests>&bo=1964&promotion=<promo>`
  - Individual stay: `https://krishnamurticentre.innstyle.co.uk/enquiries/1?start_date=YYYY-MM-DD&nights=N&occupancies_attributes%5Badults%5D=<guests>&bo=1964`. **The `1` enquiry id is undocumented**; it works today, but ask Inn Style to confirm it.
  - Gift vouchers: `…/gift-vouchers`.
- `openExternal(url, kind)` is the one exit. Native shell: `window.KFTShell.openExternal(url, kind)` takes over (Capacitor in-app browser). Web: `booking` and `voucher` save the app state (tab, scroll, filter, open retreat or booking sheet with its dates, room and guests) in `sessionStorage`, set the URL hash to the tab (`#visit`), and open the deep link **in the same tab** as a full page. Inn Style's Book form has `target="_top"` (and `&iframe=1` does not change that, verified by the owner), so it is never framed. Coming Back restores the screen and sheet; a page restored from the back-forward cache keeps its state as it was. Other links open a new tab.
- The booking sheet says "You'll continue on the Centre's booking site. Use Back to return." Closure dates (closes 4 Jan 2027, re-opens 12 Feb 2027, from `centre.json`) show the closure message and disable Continue. Day visits call `tel:+441962771748`. "Ask a question" is a `mailto:` to `info@krishnamurticentre.org.uk` (the address on krishnamurticentre.org.uk/information/, checked 16 Nov 2026) with the retreat name and dates in the subject; without an email in `centre.json` the button is left out.
- Inn Style's `booking[end_date]` is the **last night**, not the departure day (26 Feb 2027 + 4 nights → `end_date` 2027-03-01; seen on all 25 retreats). Inferred from the pages; worth confirming with Inn Style.

### Rates (`data/centre.json`)
Rooms (weekday, weekend, week, sleeps), reduced rooms, day visits, deposit, closures (`from`/`reopen`), min/max nights, adults only, check-in/out, phone, email. Validated on load; the copy in `app.js` is only an offline fallback.

## Daily data contract
The Daily tab reads `public/data/daily.json`, written only by the feed pipeline from KFT's source and validated against `schemas/daily.schema.json`. Missing or empty file → "Daily passages coming soon", and Today shows no passage. Nothing is invented.
```json
{
  "version": 1,
  "updated": "YYYY-MM-DD",
  "passages": [{
    "day": 1,                      // 1–365, one passage per day
    "flowId": "string",            // groups passages into a flow
    "flowTitle": "string",         // "Flow: <flowTitle>, <flowIndex> of <flowLength>"
    "flowIndex": 1, "flowLength": 7,
    "title": "optional string",
    "text": "plain text; paragraphs separated by a blank line (\n\n)",
    "source": { "work": "required", "date": "optional", "place": "optional" },
    "audioUrl": "optional https URL (plays in the app's player, Media Session on the lock screen)",
    "durationSec": 120,
    "transcriptUrl": "optional https URL"
  }]
}
```
- Day number = days since the user's start date (stored on the device; set on first use), wrapping after 365. "Restart from day 1" resets it (two taps). Past days and flows can be browsed; future days are not shown.
- All text is escaped; paragraphs come only from blank lines.
- Favourites keep the passage text on the device, so they read offline. "Download all readings" stores `daily.json`, transcripts and the audio (see Downloads).
- The reminder time is stored on the device only, labelled "Reminders arrive in the app version". There is no web push; real notifications come with the Capacitor step.
- Test data: `tests/fixtures/daily.fixture.json` and `daily.empty.json` (marked test data, schema-valid, never in `public/`).

## Design pass (16 Nov 2026)
Full list of CSS changes: `work/kft-app-shots/design/CSS-CHANGES.md` (outside the repo). In short: resets in `:where()` (zero specificity) so component padding applies, no `!important` on chips, design tokens for spacing, type (rem), colour, radii, one shadow and motion, dark mode, and screen-by-screen polish.

### Tests (outside the repo: `work/kft-app-tests/`, Playwright 1.65)
Serve `public/` (for example `python3 -m http.server 5173` in `public/`), then:
- `node e2e.mjs` (Chromium, 390×844): tabs, Listen paging over every episode, Watch segments and counts, play state, saved position after reload, played/saved, search and cross-links, booking URLs, closures, escaping, offline download playback, fallbacks, overflow.
- `node daily.mjs`: Daily empty state (missing and empty file), fixture state, day numbering and wrap, favourites, flows, share, reminder, download/remove, offline, and the 6 tabs at 360 px.
- `node booking.mjs chromium|firefox|webkit [--live]`: the booking brief's rows 1–5 and 8–12 in each engine; `--live` GETs each deep link once (≤1 request/second, no forms) and checks "Availability for the", the retreat name, a "£" price, the arrival date and adults. Results: `booking-results.json`.
- `node design-shots.mjs <before|after> <light|dark|text200>`: screenshots of every tab and sheet at 360/375/390/430 px plus overflow, 44 px target and WCAG AA contrast checks.
Third-party hosts are stubbed or fetched through a local cache, so the runs are repeatable.
