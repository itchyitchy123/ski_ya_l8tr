# Optional leaderboard service

`server.mjs` is a dependency-free starter service for local development. It
requires `LEADERBOARD_SECRET` and accepts only HMAC-signed score envelopes.
Scores are held in memory, so deploy a durable database, authentication,
retention policy, and replay verification before using it publicly.

```sh
LEADERBOARD_SECRET='replace-me' node leaderboard/server.mjs
```

The API implements the contract in [`../leaderboard.md`](../leaderboard.md):

- `POST /v1/scores` with `X-Score-Signature: sha256(body)`
- `GET /v1/leaderboards/<route>/<run>/<mode>`

The service includes bounded input, score limits, CORS handling, and a basic
per-IP write/read rate limit. It is intentionally not bundled into the static
game until a deployment URL and trust model are chosen.
