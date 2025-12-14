Live: https://3d-muzeum.pages.dev/

POUŽITÉ ZDROJE:
Při této práci BYLO použito AI ve formě github copilotu. Bylo využito modelů claude sonnet 4.5 a GPT 5 Codex. Historii specifických chatů nelze sdílet protože to copilot neumožňuje. AI bylo použito ve většině souborů ve formě autofillu a případně chat sidebaru.

# 3D Museum

This repo contains a small first-person 3D gallery built with SvelteKit, Three.js, and Rapier. It lets you walk through a curated room, view artwork on stands, and experience custom lighting, materials, and ambience.

## What's in the project

- **Interactive scene**: Player capsule with pointer-lock controls, collisions, and a configurable speed curve.
- **Gallery content**: Paintings, stands, plaques, floor textures, HDR skybox, and picture lights that highlight each frame.
- **Rendering stack**: Three.js renderer, tone mapping, post-processing, and an environment map tailored for the virtual room.
- **Physics + helpers**: Rapier setup, character controller helpers, and texture/asset loaders for fast startup.
- **Config + assets**: `src/lib/config/museum.config.ts` centralizes camera, lighting, and layout values; `models/` and `textures/` hold the art assets used in the scene.

## Running it locally

```sh
pnpm install
pnpm dev
```

Adjust the values in `src/lib/config/museum.config.ts`, refresh the browser, and the museum updates instantly.
