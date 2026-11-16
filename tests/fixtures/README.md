# Test fixtures (not app content)

`daily.fixture.json` and `daily.empty.json` are **test data only**, used by the Playwright tests in `work/kft-app-tests/daily.mjs`.
They follow `schemas/daily.schema.json`. Every passage says "TEST FIXTURE" and is not a Krishnamurti text.
Never copy these files into `public/`: the app reads `public/data/daily.json`, which only the feed pipeline writes, from KFT's source.
