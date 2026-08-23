# Leaderboard integration contract

Alpine Rush currently stores scores locally so the game remains offline-first.
An online leaderboard should be added as a separate service rather than
trusting client-submitted scores.

## Proposed endpoint

`POST /v1/scores`

The client submits a signed run envelope containing the route, run, mode,
score, elapsed time, game version, and a replay checksum. The server validates
the envelope against the course rules before accepting it. Never accept a raw
score or player-provided rank from the browser.

`GET /v1/leaderboards/{route}/{run}?mode=freeride&period=daily`

The response should contain a bounded page of anonymous entries, a short-lived
cache header, and the current player's rank when available. Rate-limit writes,
reject impossible times, and retain only the minimum identifier needed for
anti-cheat and deletion requests.
