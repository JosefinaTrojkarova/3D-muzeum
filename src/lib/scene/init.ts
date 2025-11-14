import * as THREE from 'three';
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
    
    await setupSkybox(scene, renderer);
    
    setupLighting(scene);
    
    createFloor(scene, physics);
    
    await createGallery(scene, physics);
    
    return scene;
}
