# Optional leaderboard service

`server.mjs` is a dependency-free starter service for local development. It
requires `LEADERBOARD_SECRET` and accepts only HMAC-signed score envelopes.
Scores are held in memory, so deploy a durable database, authentication,
retention/deletion policy, replay verification, abuse reporting, and a service
privacy notice before using it publicly. Do not collect real names or contact
details; use an intentionally anonymous display name and moderate it before
public display.

```sh
LEADERBOARD_SECRET='replace-me' node leaderboard/server.mjs
```

The API implements the contract in [`../leaderboard.md`](../leaderboard.md):

- `POST /v1/scores` with `X-Score-Signature: sha256(body)`
- `GET /v1/leaderboards/<route>/<run>/<mode>`

The service includes bounded input, score limits, CORS handling, and a basic
per-IP write/read rate limit. The IP address is used as a transient rate-limit
key and must not be persisted without a disclosed purpose and retention rule.
It is intentionally not bundled into the static game until a deployment URL,
privacy notice, moderation process, and trust model are chosen.
