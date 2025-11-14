# Project Structure

```
src/
├── lib/
│   ├── index.ts                    # Main barrel export
│   │
│   ├── renderer/                   # 🎨 Rendering
│   │   ├── index.ts               # Barrel export
│   │   └── renderer.ts            # WebGL renderer setup
│   │
│   ├── scene/                     # 🌍 3D Scene
│   │   ├── index.ts               # Barrel export
│   │   ├── init.ts                # Scene initialization
│   │   ├── skybox.ts              # HDR skybox
│   │   ├── lighting.ts            # Lights setup
│   │   ├── floor.ts               # Floor with textures
│   │   └── test-objects.ts        # Demo objects
│   │
│   ├── player/                    # 🎮 Player Control
│   │   ├── index.ts               # Barrel export
│   │   ├── camera.ts              # First-person camera
│   │   ├── input.ts               # Keyboard input
│   │   └── controller.ts          # Movement physics
│   │
│   ├── physics/                   # ⚛️ Physics
│   │   ├── index.ts               # Barrel export
│   │   ├── physics.ts             # Physics world (Rapier)
│   │   └── helpers.ts             # Physics utilities
│   │
│   ├── assets/                    # Static assets
│   └── styles/                    # CSS styles
│       └── reset.css
│
├── routes/
│   ├── +layout.svelte             # Layout
│   └── +page.svelte               # Main app (simplified!)
│
└── app.html

static/
├── env/                           # HDR environments
│   ├── galaxy.hdr
│   └── star.hdr
└── textures/                      # Textures
    └── floor/
        ├── floor-diff.jpg
        ├── floor-nor.jpg
        └── floor-arm.jpg
```

## Module Dependencies

```
+page.svelte
    ├── renderer/renderer.ts
    ├── player/camera.ts
    │   ├── player/input.ts
    │   └── player/controller.ts
    │       └── physics/physics.ts
    ├── physics/physics.ts
    └── scene/init.ts
        ├── scene/skybox.ts
        ├── scene/lighting.ts
        ├── scene/floor.ts
        │   └── physics/physics.ts
        └── scene/test-objects.ts
            └── physics/physics.ts
```

## Responsibility Matrix

| Module | Responsibility | Dependencies |
|--------|---------------|--------------|
| **renderer** | WebGL setup, configuration | THREE.js |
| **scene/skybox** | HDR environment loading | THREE.js, HDRLoader |
| **scene/lighting** | Ambient & directional lights | THREE.js |
| **scene/floor** | Floor mesh + physics collider | THREE.js, physics |
| **scene/test-objects** | Demo objects for testing | THREE.js, physics |
| **scene/init** | Compose all scene elements | All scene modules |
| **player/input** | Keyboard event handling | None |
| **player/controller** | Movement + physics | THREE.js, Rapier, physics |
| **player/camera** | Camera + pointer lock | THREE.js, PointerLockControls, input, controller |
| **physics/physics** | Physics world management | Rapier |
| **physics/helpers** | Physics object creators | THREE.js, physics |

## Data Flow

```
User Input (Keyboard/Mouse)
    ↓
InputHandler (player/input.ts)
    ↓ MovementInput
PlayerController (player/controller.ts)
    ↓ Position Updates
    ↔ PhysicsWorld (physics/physics.ts)
    ↓
FirstPersonCamera (player/camera.ts)
    ↓ Camera Matrix
Renderer (renderer/renderer.ts)
    ↓
Screen Output
```
