# Mobile support

Alpine Rush is designed for landscape phones and tablets. The mobile layer
provides a virtual steering joystick, swipe-to-jump/steer gestures, haptic
feedback, safe-area-aware controls, orientation guidance, and automatic
quality reduction on constrained devices.

Test releases on Safari iOS and Chrome Android in both landscape orientations.
The game remains playable in portrait mode when the player chooses
“Continue anyway,” but the course is intentionally wider in landscape.

Recommended QA matrix:

| Device class | Quality | Required checks |
| --- | --- | --- |
| Modern phone | High | 60 FPS, joystick, haptics, PWA install |
| Budget phone | Balanced/Low | no input lag, no browser scrolling |
| Tablet | High | orientation changes, safe areas, fullscreen |
| Desktop | High | keyboard, gamepad, sharing, replay |
