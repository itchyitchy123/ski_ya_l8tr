# Contributing to Alpine Rush

Thanks for helping make the mountain better. Small, focused changes are easiest to review.

## Development setup

Alpine Rush has no package dependencies or build step. Clone the repository, start any static server, and open the local URL in a browser.

```bash
python3 -m http.server 8080
```

## Before opening a pull request

1. Create a branch from `main`.
2. Keep the existing dependency-free architecture unless the change clearly requires otherwise.
3. Test keyboard and touch input at desktop and mobile widths.
4. Check the browser console for errors.
5. Run `npm run check`.
6. Describe the player-facing effect and include screenshots for visual changes.

Use clear commit messages such as `Fix jump collision at high pace` or `Improve mobile HUD spacing`.

## Reporting bugs

Use the bug-report template and include your browser, device, steps to reproduce, and what you expected to happen. Please do not disclose security issues publicly; use the process in [SECURITY.md](SECURITY.md).
