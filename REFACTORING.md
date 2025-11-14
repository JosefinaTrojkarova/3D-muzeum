# Code Organization Refactoring

## Overview
The codebase has been refactored into smaller, more focused modules with clear separation of concerns.

## New Structure

### 📁 `src/lib/renderer/`
**Purpose**: WebGL renderer configuration and management

- `renderer.ts` - Renderer creation, configuration, and resize handling
- `index.ts` - Barrel exports

**Key exports**:
- `createRenderer()` - Initialize WebGL renderer with configuration
- `resizeRenderer()` - Handle window resize
- `RendererConfig` - Type for renderer options

---

### 📁 `src/lib/scene/`
**Purpose**: 3D scene setup and objects

- `init.ts` - Main scene initialization orchestrator
- `skybox.ts` - HDR skybox loading and setup
- `lighting.ts` - Ambient and directional lighting
- `floor.ts` - Floor geometry with textures and physics
- `test-objects.ts` - Test boxes for physics demonstration
- `index.ts` - Barrel exports

**Key exports**:
- `initializeScene()` - Setup complete scene (async)
- `setupSkybox()` - Load and configure skybox
- `setupLighting()` - Add lights to scene
- `createFloor()` - Create floor with physics collider
- `addTestBoxes()` - Add test objects

---

### 📁 `src/lib/player/`
**Purpose**: Player controls, input, and movement

- `camera.ts` - First-person camera with pointer lock
- `input.ts` - Keyboard input handling
- `controller.ts` - Player movement and physics controller
- `index.ts` - Barrel exports

**Responsibilities separated**:
- **camera.ts**: Camera setup, pointer lock controls, orchestration
- **input.ts**: Keyboard event handling, input state management
- **controller.ts**: Movement physics, collision detection, jumping

**Key exports**:
- `FirstPersonCamera` - Main camera class
- `InputHandler` - Keyboard input manager
- `PlayerController` - Movement and physics controller
- `MovementInput` - Type for input state

---

### 📁 `src/lib/physics/`
**Purpose**: Physics simulation using Rapier

- `physics.ts` - Physics world and collider creation
- `helpers.ts` - Helper functions for physics objects
- `index.ts` - Barrel exports

**Key exports**:
- `PhysicsWorld` - Main physics world manager
- `createPhysicsBox()` - Create box with visual + physics
- `createPlatform()` - Create platform/floor segment
- `createStairs()` - Create stairs with physics

---

### 📄 `src/routes/+page.svelte`
**Purpose**: Main application entry point

**Simplified to**:
- Renderer initialization
- Camera setup
- Physics initialization
- Scene initialization (via `initializeScene()`)
- Animation loop
- Cleanup

---

## Benefits of New Organization

### 1. **Single Responsibility**
Each module has one clear purpose:
- Renderer only handles WebGL setup
- Input only handles keyboard events
- Controller only handles movement logic

### 2. **Better Testability**
Small modules are easier to test in isolation.

### 3. **Easier to Navigate**
Clear folder structure makes it obvious where to find code:
- Need to change lighting? → `src/lib/scene/lighting.ts`
- Need to change controls? → `src/lib/player/input.ts`
- Need to add physics object? → `src/lib/physics/helpers.ts`

### 4. **Reusability**
Modules can be easily reused:
```typescript
// Use just the renderer
import { createRenderer } from '$lib/renderer';

// Use just the input handler
import { InputHandler } from '$lib/player';

// Use the complete scene setup
import { initializeScene } from '$lib/scene';
```

### 5. **Easier to Extend**
Adding new features is straightforward:
- New scene object? Add to `src/lib/scene/`
- New input type? Extend `src/lib/player/input.ts`
- New physics helper? Add to `src/lib/physics/helpers.ts`

---

## Import Patterns

### From Outside the Library
```typescript
// Import from main barrel export
import { FirstPersonCamera, PhysicsWorld, initializeScene } from '$lib';

// Import from module barrel export
import { createRenderer } from '$lib/renderer';
import { setupLighting } from '$lib/scene';
import { InputHandler } from '$lib/player';
```

### From Within the Library
```typescript
// Use relative imports for same module
import { PlayerController } from './controller';

// Use module path for different modules
import type { PhysicsWorld } from '../physics/physics';
```

---

## Migration Guide

### Old Code
```typescript
import { FirstPersonCamera } from "$lib/player/camera";
import { skyBox } from "$lib/scene/scene";
import { createFloor } from "$lib/scene/floor";
```

### New Code
```typescript
import { FirstPersonCamera } from "$lib/player";
import { initializeScene } from "$lib/scene";
// or
import { setupSkybox, createFloor } from "$lib/scene";
```

---

## File Size Comparison

### Before
- `camera.ts`: ~250 lines (camera + input + movement)
- `scene.ts`: ~80 lines (skybox + lighting + legacy floor)
- `+page.svelte`: ~100 lines (lots of initialization code)

### After
- `camera.ts`: ~90 lines (just camera orchestration)
- `input.ts`: ~90 lines (just input handling)
- `controller.ts`: ~180 lines (just movement logic)
- `skybox.ts`: ~45 lines (just skybox)
- `lighting.ts`: ~35 lines (just lighting)
- `renderer.ts`: ~60 lines (just renderer)
- `init.ts`: ~25 lines (scene composition)
- `+page.svelte`: ~60 lines (simplified)

Each file is now focused and under 200 lines!
