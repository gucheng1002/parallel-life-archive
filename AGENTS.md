# Project AGENTS.md

## Project

This is a mobile-first 9:16 interactive web project about “平行人生”.

The core idea is:

“日常空间正在被另一种没被选择的人生慢慢改写。”

The mood should be quiet, surreal, gentle, dreamlike, and slightly regretful.

## Visual direction

- Keep a hand-painted anime film background feeling.
- Keep the atmosphere calm, cinematic, and slightly unreal.
- Prefer low-saturation blue-gray tones with warm beige light.
- Avoid 3D render, cyberpunk, horror, magic effects, glossy AI look, cheap template feeling, and over-designed tech UI.
- Preserve the existing visual assets unless the user explicitly asks to replace them.

## File rules

- Images are stored in `public/images/`.
- Do not rename image files unless requested.
- Do not break existing image paths.
- Do not move assets unless requested.
- Prefer editing CSS and JS/TSX logic before changing the whole structure.
- Do not rewrite the whole project for a small interaction fix.

## Important image assets

The project uses these image files:

- `intro-blink.jpg`
- `intro-blur.jpg`
- `beginning.jpg`
- `normal.jpg`
- `water.jpg`
- `ocean.jpg`
- `photo-pile.jpg`
- `photo-float.jpg`
- `node-road.jpg`
- `node-mirror.jpg`
- `node-booth.jpg`
- `node-fork.jpg`

Keep these paths under:

`public/images/`

## Layout rules

- Mobile 9:16 is the priority.
- On desktop, keep the phone-like layout centered.
- Do not stretch or crop important image content carelessly.
- Keep interactions usable on mobile.
- Preserve the cinematic image-first feeling.

## Interaction rules

- The opening animation should feel continuous, not like a hard cut.
- The black screen, blur, and clear image transition should feel smooth.
- The ID photo room should transform from normal room, to shallow water, to seaside.
- Water should appear from the ground, not from the ceiling.
- The camera should produce four photo papers.
- The photo papers should land near the lower-right area, close to the tripod.
- Clicking the photo pile should make the four photo papers float up.
- Clicking empty space should cancel selection when appropriate.
- Card/photo interactions should be clear, but they should not look like generic UI cards.
- Use subtle hints for interaction, such as glow or small text.
- Keep the node start page before entering each node.
- Do not remove the node start page unless requested.

## Current project flow

The intended flow is:

1. Opening black / blurry / clear first-person transition.
2. Camera flash.
3. Third-person ID photo studio room.
4. The room slowly gains shallow water.
5. The blue backdrop lifts and reveals the sea horizon.
6. Four wet photo papers appear.
7. User clicks the photo papers.
8. Four photo papers float up.
9. User selects one of four nodes.
10. Node start page appears.
11. User enters the node interaction.

## Four node images

The four node images are:

- `node-road.jpg`: empty seaside road
- `node-mirror.jpg`: mirror practice room
- `node-booth.jpg`: rainy phone booth
- `node-fork.jpg`: dusk forked road

## Work process

Before changing code:

- Read this file.
- Read the relevant TSX, CSS, and asset paths.
- Explain the planned changes.
- Ask before large structural changes.

After changing code:

- Summarize files changed.
- Explain how to test the result.
- Mention any risk or uncertain part.

## Do not do these without permission

- Do not rename image files.
- Do not change the 9:16 layout priority.
- Do not replace the whole interaction flow.
- Do not remove existing visual assets.
- Do not add a generic template-style UI.
- Do not make the project look like a normal dashboard, app landing page, or tech product page.