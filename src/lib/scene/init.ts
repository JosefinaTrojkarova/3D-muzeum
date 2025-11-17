import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { PhysicsWorld } from '../physics/physics';
import { setupSkybox } from './skybox';
import { setupLighting } from './lighting';
import { createFloor } from './floor';
import { createGallery } from './gallery';

THREE.Cache.enabled = true;

export async function initializeScene(
    physics: PhysicsWorld,
    renderer?: THREE.WebGLRenderer
): Promise<THREE.Scene> {
    const scene = new THREE.Scene();
    
    // Setup image-based lighting using RoomEnvironment when renderer is available
    if (renderer) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        const envScene = new RoomEnvironment();
        const envMap = pmremGenerator.fromScene(envScene, 0.03).texture;

        scene.environment = envMap;

        pmremGenerator.dispose();
        envScene.dispose();
    }

    await setupSkybox(scene, renderer);
    
    setupLighting(scene);
    
    createFloor(scene, physics);
    
    await createGallery(scene, physics, renderer);
    
    return scene;
}
