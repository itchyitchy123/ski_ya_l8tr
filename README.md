<div align="center">
  <img src="assets/alpine-rush-cover.png" alt="A skier carving through an alpine valley at sunrise" width="100%">

  # Alpine Rush

  **A fast, responsive downhill arcade game built for the browser.**

  [Play now](https://skiyalatr.cyberducttape.com) · [Report a bug](https://github.com/itchyitchy123/ski_ya_l8tr/issues/new?template=bug_report.yml) · [Request a feature](https://github.com/itchyitchy123/ski_ya_l8tr/issues/new?template=feature_request.yml)

  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=111) ![No dependencies](https://img.shields.io/badge/dependencies-none-56d9ff?style=flat-square)
</div>

## About

Alpine Rush is a compact score-chasing ski game with an intentionally simple goal: stay on your feet, jump the pack, and push the pace as high as you can. It runs entirely in the browser with no framework, build step, or runtime dependencies.

### Highlights

- Momentum-based carving with keyboard and touch controls
- Risk/reward jump scoring and close-clear bonuses
- Difficulty that accelerates with every run
- Persistent local high scores
- Responsive desktop and mobile layout
- Pause, sound, reduced-motion, and automatic tab-blur handling
- Hand-drawn Canvas 2D mountain environment

## Play

Visit **[skiyalatr.cyberducttape.com](https://skiyalatr.cyberducttape.com)** or run the game locally:

```bash
git clone https://github.com/itchyitchy123/ski_ya_l8tr.git
cd ski_ya_l8tr
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

| Action | Keyboard | Touch |
| --- | --- | --- |
| Carve | `←` `→` or `A` `D` | Left/right buttons |
| Jump | `Space` | Jump button |
| Pause | `P` or `Esc` | Pause button |

## Scoring

Your score increases while you stay on the mountain. Jumping a rival adds at least 200 points; the tighter the clearance, the larger the bonus. Pace increases with score, so a high-scoring run also becomes a faster one.

## Architecture

The project deliberately stays small and transparent:

```text
.
├── assets/              # Cover art and browser icon
├── .github/             # Issue and pull-request templates
├── index.html           # Semantic game shell and UI
├── styles.css           # Responsive visual system
└── game.js              # Game loop, input, audio, and Canvas rendering
```

The renderer uses `requestAnimationFrame`; game movement is delta-time based, and the canvas scales for high-density displays. Player preferences and the best score stay in the browser through `localStorage`.

## Contributing

Bug reports, balancing ideas, accessibility improvements, and focused pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a change. For security concerns, follow [SECURITY.md](SECURITY.md).

## Roadmap

- Additional mountain routes and weather conditions
- Trick combinations and a richer scoring system
- Optional music and expanded sound design
- Automated gameplay and accessibility checks

---

<div align="center"><sub>Built for one more run.</sub></div>
