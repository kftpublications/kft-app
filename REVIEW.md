# Code review: Krishnamurti App prototype

Reviewed 16 Nov 2026. The app was tested in Chromium at iPhone 13 size. The live sources (Podbean, YouTube, kfoundation.org, Inn Style) were not reachable from the test environment. Thus, live audio, video, images and framing were not tested.

## A. Bugs fixed in this version

| # | File | Problem | Fix |
|---|------|---------|-----|
| 1 | app.js | The Watch topic chips (Fear, Love…) change state but do not filter the list. | Filter by a keyword in the title. Show an empty message if no video matches. |
| 2 | app.js | Past retreats stay in the programme and in "Next at the Centre". The Today screen always shows rows 0 and 1. | Remove retreats that have ended. Today shows the next two. |
| 3 | app.js | The Today date is hard-coded ("Monday 16 November"). | Use the device date. |
| 4 | app.js | "Continue to secure booking" opens a new tab. The retreat sheet says "Book without leaving the app", and the Inn Style banner is never shown. | Open Inn Style in the in-app browser with the secure-booking banner. |
| 5 | app.js | The individual-stay estimate accepts dates in the annual closure (4 Jan–12 Feb 2027). | Show "The Centre is closed…" for those dates. |
| 6 | app.js | A retreat over New Year gets the wrong start year. | Use the previous year when the start month is after the end month. |
| 7 | app.js | A broken MP3 URL gives no message (only a rejected `play()` is caught). | Listen for the audio `error` event. |
| 8 | app.js | No lock-screen or headphone controls. | Add the Media Session API (title, show, artwork, play, pause, skip). |
| 9 | index.html / app.js | The mini player is `role="button"` and has a button inside it (nested controls). Segment controls use `role="tablist"` with no tabs. | The title area is now a real button. Segments use `role="group"` with `aria-pressed`. |
| 10 | sw.js | Cache-first with a fixed cache name. After a deploy, users keep the old app until someone changes the cache name. Error responses (404, 500) are cached. | Stale-while-revalidate, `skipWaiting` and `clients.claim`. Cache only good responses. |
| 11 | index.html | `register("sw.js")` has no `.catch`. It gives an unhandled error in a sandboxed preview. | Add `.catch`. |
| 12 | build-feeds.mjs | Entities are decoded in the wrong order (`&amp;lt;` becomes `<`). Hex entities (`&#x2019;`) and emoji are not decoded correctly. | One-pass decoder with `fromCodePoint`. |
| 13 | build-feeds.mjs | One empty or bad `pubDate` stops the full build (`RangeError`). | Bad dates become `null`. |
| 14 | build-feeds.mjs | `itunes:duration` in `HH:MM:SS` format becomes `null`. | Parse seconds, `MM:SS` and `HH:MM:SS`. |
| 15 | build-feeds.mjs | Collection episodes with the same timestamp sort in the wrong order (294 above 295 and 296). | Sort by episode number when dates are equal. |
| 16 | build-feeds.mjs | If one source fails, `Promise.all` stops the full build. | Keep the last good data for that source and show a GitHub warning. |
| 17 | feeds.yml | `actions/deploy-pages` needs `environment: github-pages`. Without it, the deploy step fails. Code changes deploy only at 04:00. | Add the environment, `configure-pages`, `concurrency` and a `push` trigger. |

## B. Flaws not fixed (decisions for Hark and KFT)

1. **The app does not use `feed.json`.** All content is hard-coded in `app.js`. The nightly feed is built and cached, but the app does not read it. This is the most important next step.
2. **In-app browser fallback does not work.** Browsers fire the iframe `load` event also when a site blocks framing (`X-Frame-Options` / `frame-ancestors`). Thus the "This page can't be shown" message almost never appears. The user sees a blank or "refused to connect" page. Use a list of hosts that allow framing (Inn Style). Open other hosts in a new tab.
3. **Booking data is not sent to Inn Style.** The user selects dates, room and guests, but Inn Style opens on its home page. Find out if Inn Style accepts dates in the URL.
4. **Retreat estimates use individual-stay rates** (also in the README). Do not show a price for retreats until retreat prices are known.
5. **No saved state.** Playback position, "Save" and "Downloaded" are lost on reload. "Continue listening" only works in one session. Store these in `localStorage` (prototype) or on the device (native).
6. **Hard-coded text.** The passage, share text, programme, rates, closure dates and phone number are in `app.js`. Rates and dates will go out of date.
7. **Focus management.** Sheets and the detail view do not move focus or keep focus inside. A screen-reader pass is necessary (README item 6).
8. **No dark mode.** `hark.js` reads a saved theme, but `app.css` has no dark styles.
9. **Content from feeds is not HTML-safe.** The decoder now outputs real `<` and `>` characters. When the app renders `feed.json`, use `esc()` on all text.
10. **Nightly commit every day.** `generatedAt` changes on each run, so `feed.json` always changes. Compare without `generatedAt` if a daily commit is not wanted.
11. **Hero image on Visit is very tall.** The programme is below the fold on a phone. Make the hero shorter or put the programme first.

## C. Improvements to consider

- Render Listen and Watch from `feed.json`, with "Load more" for the 40 episodes and 15 videos.
- Real `.ics` file for "Add to calendar" (it is simulated now).
- Auto-play the next episode in a series (Collection parts 1/6 to 6/6).
- A sleep timer and "Mark as played" for long talks.
- Real search across podcasts, videos and articles (a static index built by `build-feeds.mjs` is enough for a prototype).
- Text size control for the passage and articles.
