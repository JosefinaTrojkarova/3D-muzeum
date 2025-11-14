import * as THREE from 'three';
import type { PhysicsWorld } from './physics';

/**
 * Create a box with both visual mesh and physics collider
 */
export function createPhysicsBox(
    scene: THREE.Scene,
    physics: PhysicsWorld,
    position: THREE.Vector3,
    size: THREE.Vector3,
    color: number = 0x808080
): THREE.Mesh {
    // Create visual mesh
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshStandardMaterial({ 
        color,
        roughness: 0.7,
        metalness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    // Create physics collider
    physics.createBoxCollider(position, size);
    
    return mesh;
}

/**
 * Create a platform/floor segment with physics
 */
export function createPlatform(
    scene: THREE.Scene,
    physics: PhysicsWorld,
    position: THREE.Vector3,
    width: number,
    depth: number,
    height: number = 0.2,
    color: number = 0x444444
): THREE.Mesh {
    const size = new THREE.Vector3(width, height, depth);
    return createPhysicsBox(scene, physics, position, size, color);
}

/**
 * Create stairs with physics
 */
export function createStairs(
    scene: THREE.Scene,
    physics: PhysicsWorld,
    startPos: THREE.Vector3,
    stepCount: number,
    stepWidth: number = 2,
    stepDepth: number = 0.5,
    stepHeight: number = 0.3,
    direction: 'forward' | 'backward' = 'forward'
): THREE.Group {
    const stairGroup = new THREE.Group();
    const dir = direction === 'forward' ? 1 : -1;
    
    for (let i = 0; i < stepCount; i++) {
        const stepPos = new THREE.Vector3(
            startPos.x,
            startPos.y + i * stepHeight + stepHeight / 2,
            startPos.z + i * stepDepth * dir
        );
        
        const stepSize = new THREE.Vector3(stepWidth, stepHeight, stepDepth);
        const step = createPhysicsBox(scene, physics, stepPos, stepSize, 0x666666);
        stairGroup.add(step);
    }
    
    scene.add(stairGroup);
    return stairGroup;
}
