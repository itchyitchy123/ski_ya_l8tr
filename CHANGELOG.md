# Changelog

All notable player-facing changes are documented here.

## Unreleased — 2026-08-25

- Began the gameplay architecture migration with independent event, audio, input, and UI-state modules; run lifecycle, pause, crash, and surface transitions now publish explicit system events without changing gameplay behavior.
- Added an opt-in F3 performance diagnostics panel for FPS, frame time, canvas scale, and network state, with offline caching and production wiring checks.
- Added gameplay-feedback polish with crash impact animation, live surface-state HUD color, personal-record medal celebration, and a new personal-best audio/toast moment.
- Improved touch controls with pressed-state feedback and accessible `aria-pressed` labels for held actions.
- Improved Web Audio reliability by resuming the audio context when browser autoplay policies suspend it.
- Added predictable `npm test` coverage and production regression checks for accessibility and presentation states.
- Added Keystone, Cooper, and Copper Mountain routes with distinct Colorado terrain, run names, elevations, unlock thresholds, snow-report coordinates, resort artwork, and offline asset caching.
- Added persistent mobile steering sensitivity options with low, standard, and high response profiles.
- Added persistent haptic feedback controls for tilt steering, touch gestures, and mobile action buttons.
- Hardened lodge-credit upgrades against unavailable storage, invalid credit values, and failed saves.
- Added visible upgrade costs and max-level states directly to the gear buttons for touch users.
- Updated the service worker to use network-first loading for live weather and leaderboard APIs.
- Restricted offline `index.html` fallback behavior to navigation requests so missing assets report correctly.
- Preserved Training Run as a valid saved event instead of silently converting it to Freeride after reload.
- Added the snowboarder’s clear-line bonus to obstacle and rail scoring.
- Bumped the offline cache version and verified syntax, smoke, production, and whitespace checks.

## Unreleased — 2026-08-23

- WebGL piste presentation now composites the selected resort's actual mountain artwork behind the 3D run, with a transparent snow scene, stronger skier silhouette, and a WebGL fallback for unsupported browsers.
- Rebuilt the visible rider model with downhill stance, bent legs, jacket and helmet silhouette, goggles, poles, skis or snowboard, carving lean, and loadout-aware colors.
- Fixed WebGL chase-camera tracking so carving is visibly readable, added touch-button input to the 3D renderer, and increased ski/snowboard contrast with dark equipment and bright bindings.
- Replaced the crude foreground cuboid rider with a high-contrast illustrated downhill rider overlay, including recognizable stance, skis/board, poles, goggles, snow spray, and animated carving lean.
- Removed the floating 2D rider layer and restored a fully grounded 3D-only rider, so skis, boots, jumps, and piste contact all share the same world coordinates.
- Rebuilt the WebGL piste from continuous triangulated snow and terrain-shoulder surfaces instead of repeated box slabs, improving downhill depth and reducing the road-like appearance.
- Hardened leaderboard CORS, headers, rate limiting, key validation, score bounds, and replay imports; added a restrictive browser Content Security Policy and removed the remaining inline boot script.
- Replaced the WebGL prototype renderer with a clean forward-chase 3D scene: continuous piste mesh, grounded rider, same-direction traffic, recycled downhill scenery, touch input, and preserved resort backdrops.
- Restored the polished 2D gameplay renderer as the active experience; the experimental WebGL renderer is retained in the repository but no longer loaded by the game.
- Added persistent career progression with XP, levels, sponsor tiers, and daily sponsor contracts.
- Fixed duplicate settings controls, stale delayed finishes, persisted-setting validation, cancellable snow reports, and mobile results/settings overflow.
- Simplified resort selection with larger type and moved snow reports, Colorado flavor, progression, and optional resort panels into a dedicated Mountain Details screen.
- Refined the resort layout into a predictable full-width flow and increased Mountain Details typography for easier reading.
- Added high-contrast piste edges, colored boundary lines, and alternating marker poles so the playable trail is obvious during desktop runs.
- Added a visual polish pass with stronger hierarchy, premium depth/shadows, improved focus states, larger HUD typography, and more dimensional resort cards.
- Reworked the run surface so the visible piste is a distinct, natural snow corridor that matches the rider’s playable width instead of a broad painted track.
- Widened the playable fall line and removed the dark full-width overlay so the rider can use the whole visible piste while the mountain background remains visible.
- Added a persistent resort/run identity badge during gameplay, smoother screen transitions, and a more polished results highlight treatment.
- Added resort-specific visual theming and image-backed result posters so every finished run carries the identity of its mountain.
- Removed the painted trail corridor from desktop gameplay; desktop now shows the natural mountain surface with restrained marker poles, while mobile retains clearer touch-oriented piste guidance.
- Added progressive mountain parallax: distant ridges, nearer terrain layers, and snow streaks now move with the run to reinforce downhill travel.
- Added same-direction piste riders with gentle traverses/merges, plus mogul bumps that compress and launch the skier or boarder instead of acting like incoming traffic.
- Added a forward chase-camera pass so the rider advances from the upper piste toward the foreground as the run progresses, rather than remaining vertically pinned.
- Added a world-space shared-rider layer with downhill distance, relative speed, lane traversal, piste-curve projection, and rider-merge collisions.
- Improved grounded rider animation with downhill stance lean, ski/board contact tracks, edge compression cues, and directional snow spray.
- Aligned the rider’s skis, contact shadow, and track marks to the same piste point to remove the floating appearance.
- Unified the rider’s downhill position with the piste projection so feet, shadow, tracks, and snow surface share the same ground contact point.
- Consolidated the final rider contact pass around one authoritative world-space piste projection, including lane position, look-ahead depth, slope, and jump height.
- Added a render-time ground lock so the rider is snapped to the projected piste surface every frame, preventing camera/update drift from producing a floating appearance.
- Added a softly shaded, projection-matched desktop piste surface with natural banks and terrain undulation, replacing the empty snow beneath the rider without restoring the street-like track.
- Retired the legacy 2D gameplay canvas in favor of a native WebGL piste scene with perspective camera, 3D snow geometry, world-space skier traffic, trees, and terrain depth.
- Added Downhill Race, Big Air, Patrol Chase, weekly modifiers, trick battles, and photo-finish results.
- Added branching groomer/risk lines, rival riders with personalities, blocking, speed pressure, signature tricks, and banter.
- Added wildlife, snowcats, lift towers, fallen signs, crowds, rescue events, patrol overloads, and changing weather hazards.
- Added secret mountain stashes, a persistent badge wall, collectible milestones, and replay timeline highlights.
- Added equipment upgrade paths for edge control, jump pop, and powder float, with setup-specific handling.
- Added friend ghost import/export and visible replay playback controls.
- Added randomized snow-sports loss messages and improved character/result readability.
- Added German mountain routes and Hoedown Hill with procedural audio only.
- Added mobile rendering optimizations, service-worker cache updates, and continued production smoke coverage.
- Added in-season live snow reports for every resort, with cached Open-Meteo conditions, snowfall/base-depth metrics, equipment recommendations, and a pre-run weather briefing.
- Live snowfall, temperature, and wind now influence automatic surface conditions and handling recommendations.
- Added dynamic in-game lift and trail status for each resort, including open, limited, wind-hold, and off-season states with live open-run counts.
- Added playable lift access: severe live winds place the selected mountain on patrol hold, disable drop-in, and show a clear reopening advisory.
- Added a persistent patrol career with rescue/hazard action tracking, rank progression, and end-of-run patrol rewards.
- Added a lift-briefing moment before each drop-in so riders see the selected line, current conditions, and patrol guidance.
- Added sparse snow-sports humor from lift announcements, patrol radio, weather events, near-run commentary, and replay timeline markers.
- Added the Après Lodge hub with earned lodge credits, rival gossip, jukebox access, and gear-repair interactions between runs.
- Added live mountain events that close technical runs during limited conditions and label alternate powder, slush, and patrol lines in the run picker.
- Added a lift-line balance mini-game in the Après Lodge that awards lodge credits and humorous liftie reactions.
- Added persistent gear wear from crashes, handling penalties for worn equipment, and lodge repair support.
- Added current snow-condition labels to the weekly board so records are easier to compare fairly.
- Added persistent rival story arcs with remembered overtakes, rivalry commentary, rival records, and rematch challenges.
- Expanded rival arcs into five persistent chapters, including escalating dialogue, milestone unlocks, and summit showdown rematches.
- Added rival-specific showdown events with unique conditions, disciplines, routes, objectives, and results.
- Added best-of-three rival campaigns with persistent round scores, campaign wins/losses, and final showdown outcomes.
- Added signature rival showdown courses: Maya gate rhythms, Kai park features, Luca ice patches, and Nova patrol gauntlets.
- Added a championship campaign finale that combines signature hazards from every rival in the deciding round.
- Added rival campaign cutscenes between rounds, with personality-driven dialogue, score context, and a dedicated championship finish.
- Added persistent resort reputation ranks with local milestones and run-based reputation rewards.
- Added rotating legendary challenges with bonus points, seasonal reward boosts, and clear daily objectives.
- Added seasonal mountain events that change the briefing flavor and reward economy throughout the year.
- Added Purgatory Resort in Durango, Colorado, with powder bowls, steep glades, a dedicated snow report location, and three new runs.
- Added sponsor-ready resort partner spotlights with official resort links, signature-run promotion, safety messaging, and branded challenge hooks.
- Added a dedicated Purgatory mountain renderer with San Juan ridgelines, powder fall line, chairlift towers, aspens, and base-area signage.
- Replaced Purgatory’s stylized background with a realistic Colorado ski photography asset for visual parity with the other resorts.
- Increased UI typography across resort selection, controls, HUD labels, results, and settings with responsive mobile minimum sizes.
- Refined resort promotion into a quieter Mountain Guide experience with local context, safety notes, featured lines, and unobtrusive official links.
- Added a first-drop onboarding tutorial, surface-change feedback, and clearer control guidance for a more professional first session.
- Added Beginner, Rider, Pro, and Legend difficulty tiers with tuned hazard density, scoring, and a limited beginner assist.
- Audited resort elevation metadata: corrected Hausberg to 1,338 m and separated Hoedown Hill’s 4,904 ft summit elevation from its 130 ft vertical drop.
- Added a no-penalty Training Run and post-run coaching recap with actionable feedback based on flow, tricks, clears, and difficulty.
- Added guided Training Run milestones for carving, jumping, and boosting, plus compact shareable “beat my line” challenge codes.
- Added a beginner-friendly Learn the Basics page covering skiing, snowboarding, lifts, etiquette, falling safely, and first-run advice.
- Renamed the beginner entry point and page to clearly identify it as the “Ski & Snowboard Tutorial.”
- Added a clearer next-goal progression card, next-run recommendations, accurate career XP progress, high-contrast settings, reduced-motion support, and stronger first-session guidance.
- Added resort-specific first-drop briefings, terrain coaching, mobile haptic feedback for landings and crashes, and clearer run identity before the countdown.
- Added a Colorado Day event with I-70 traffic and chain-up zones, Colorado local notes, 14er and bluebird badges, and a mountain passport presentation.
- Added a Pond Skim spring festival event, Colorado county-plate collectibles, 14er/bluebird/pond-skimmer/county-cruiser badges, and Colorado trivia in the Après Lodge.
- Added a Parking Lot Survivor shuttle challenge, pass-specific Colorado weather flavor, Green Chile Lodge quests, and local achievement titles for parking, dust-on-crust, San Juan lines, and chile-powered laps.
- Added a persistent Colorado season map with regional passport stamps, mountain-radio updates, and county-plate progress that carries between runs.
- Fixed resort elevation units, duplicate finish rewards, route-click overwork, stale background refreshes, invalid saved settings, mobile result actions, desktop card placement, and noisy screen-reader notifications.

## 2.0.0 — 2026-08-22

- Added Freeride, Time Trial, Slalom, and Terrain Park disciplines.
- Added persistent course medals, records, and personal-best ghost racing.
- Added trail previews with difficulty, distance, terrain, and route geometry.
- Added gamepad, fullscreen, unit, motion, volume, and quality controls.
- Added continuous procedural wind and ski-edge audio.
- Added tuck/brake controls and terrain-dependent handling.
- Added installable offline PWA support and automated quality checks.
- Opened every Colorado mountain from the first launch.
