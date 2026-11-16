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
  data/feed.json         generated content feed (see scripts/build-feeds.mjs)
  manifest.webmanifest   makes it installable (Add to Home Screen)
  sw.js                  service worker: offline shell, network-first feed
  icons/                 placeholder icons (replace with KFT artwork)
scripts/build-feeds.mjs  builds feed.json from the public sources (Node 20, no deps)
.github/workflows/feeds.yml  nightly feed refresh + GitHub Pages deploy
```

## Tabs
- **Today**: daily passage (from Krishnamurti Daily), new this week, next at the Centre
- **Listen**: Urgency of Change and The Krishnamurti Collection. Real MP3 playback, mini player, Now Playing, skip and speed
- **Watch**: KFT Channel extracts and Official Channel full talks. YouTube embedded player with a related list
- **Read**: quotes, articles, archive genres and search (searches this tab only in the prototype)
- **Visit**: Centre programme, filters, retreat sheets, a native "Book your stay" step that hands off to Inn Style, rates, day visits, getting here

## Data sources
| Content | Source | Notes |
|---|---|---|
| Urgency of Change | https://feed.podbean.com/krishnamurti/feed.xml | RSS, newest first |
| The Krishnamurti Collection | https://feed.podbean.com/krishnamurticollection/feed.xml | 300 eps, **not date-ordered**, so sort by pubDate |
| KFT Channel | YouTube RSS, channel `UCX8wFEiD_FaLPgHM6wPD0Wg` | RSS gives the latest 15; the full back catalogue needs the YouTube Data API v3 |
| Official Channel | YouTube RSS, channel `UC88A5W9XyWx7WSwthd5ykhw` | same |
| Archive genres | kfoundation.org `/wp-json/wp/v2/kft_media_genre` | `kft_media` items return titles and genres only, with no media URLs |
| Articles, quotes | kfoundation.org pages | Divi shortcodes in REST `content`, so a clean article endpoint is needed |
| Programme, rates | krishnamurticentre.org.uk | hard-coded in app.js for now, with no feed |
| Booking | https://krishnamurticentre.innstyle.co.uk | allows framing (`frame-ancestors *`), but needs cookies, so use SFSafariViewController / Custom Tabs natively. No public API |

## Known limitations / review points
1. **Content is hard-coded in `js/app.js`**. The next step is to render from `data/feed.json` (already generated).
2. Retreat price estimates use individual-stay rates. Retreats have their own pricing.
3. Today's passage audio is a placeholder. It should come from Krishnamurti Daily's content source.
4. The in-app browser uses iframes. A native build should use the platform in-app browser instead.
5. YouTube can't play in the background (YouTube terms), so audio-only talks should use the podcast MP3s.
6. Accessibility: tap targets are 44 to 48px. A screen-reader pass hasn't been done.
7. No analytics, accounts or ads, by design (KFT content is free and ad-free).

## Path to the stores
- **A. Wrap with Capacitor**: add native audio (background, lock screen), downloads, push, and in-app browser plugins. Release under KFT's existing Apple and Google developer accounts.
- **B. Fold into Krishnamurti Daily**: port these tabs into Daily's codebase.
