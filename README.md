# 3D Museum

A virtual 3D museum gallery built with SvelteKit, Three.js, and Rapier physics.

## Features

- First-person camera controls with pointer lock
- Physics-based player movement with collision detection
- Art gallery with picture frame lighting
- HDR environment mapping
- Configurable via TOML configuration file

## Configuration

The museum is highly configurable via the `config.toml` file located in the root directory. This file controls all aspects of the 3D museum including:

- **Camera settings**: FOV, zoom, view bobbing
- **Player movement**: Speed, sprint multiplier, jump force
- **Physics**: Gravity, collision detection parameters
- **Renderer**: Quality settings, tone mapping, shadows
- **Scene**: Skybox, lighting, floor textures
- **Gallery layout**: Stand spacing, painting positions
- **Visual appearance**: Colors, materials, dimensions

### Modifying Configuration

1. Edit `config.toml` in the root directory
2. Changes are loaded automatically on page refresh
3. The config is copied to `static/config.toml` for serving

Example configuration sections:

```toml
[camera]
default_fov = 75
zoomed_fov = 30
eye_height = 1.6

[player]
move_speed = 2.5
sprint_multiplier = 2.0
jump_force = 5.0

[gallery]
stand_spacing = 5.0
paintings = ["1.webp", "2.webp"]
```

## 3D Museum

A virtual 3D art gallery built with SvelteKit, Three.js, and Rapier physics.

## Features

- First-person controls with physics-based movement
- Gallery with artwork stands and picture lighting
- HDR environment lighting and skybox
- Configurable museum settings

## Configuration

All museum-specific settings are centralized in `src/lib/config/museum.config.ts`. This includes:

- **Camera**: FOV, movement bobbing, initial position
- **Player**: Movement speed, jump force, collision capsule
- **Physics**: Gravity, character controller settings
- **Renderer**: Tone mapping, shadows, quality settings
- **Lighting**: Ambient and directional light properties
- **Scene**: Skybox configuration
- **Floor**: Dimensions and textures
- **Gallery**: Layout, spacing, painting list
- **Stands**: Backing and canvas properties
- **Picture Lights**: Fixture dimensions and spotlight settings

To modify the museum, edit the values in `museum.config.ts` and the changes will be applied immediately in development mode.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
