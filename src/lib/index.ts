// Renderer
export { createRenderer, resizeRenderer } from './renderer/renderer';

// Scene
export { initializeScene } from './scene/init';
export { setupSkybox } from './scene/skybox';
export { setupLighting } from './scene/lighting';
export { createFloor } from './scene/floor';
export { createGallery } from './scene/gallery';
export { createArtworkStand, loadPaintingTexture } from './scene/stands';

// Player
export { FirstPersonCamera } from './player/camera';
export { InputHandler } from './player/input';
export { PlayerController } from './player/controller';
export type { MovementInput } from './player/input';

// Physics
export { PhysicsWorld } from './physics/physics';
export { createPhysicsBox, createPlatform, createStairs } from './physics/helpers';
