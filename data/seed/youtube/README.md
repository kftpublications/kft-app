# YouTube seed (no API key)

- `playlists.json`: series playlist IDs, read weekly through the keyless playlist RSS. The 14 IDs here come from the playlist embeds on https://kfoundation.org/video/ (16 Nov 2026). Replace or extend them with KFT's own list or with the Takeout export. Accepted forms: `["PL…"]`, `{ "kft": ["PL…"], "official": ["PL…"] }`, or `[{ "id": "PL…" }]`.
- `kft/` and `official/`: put the Google Takeout CSVs here ("YouTube and YouTube Music": video metadata and playlists, exported from the account that owns the channel). Only these files are used:
  - `videos/videos.csv` (video ID, title, publish time, approx. duration, privacy, state, description)
  - `playlists/playlists.csv` and `playlists/<title>-videos.csv`
- Do **not** commit personal data from the export: comments, live chats, history, subscriptions, purchases, memberships. The build never reads them and prints a warning if they are found.
