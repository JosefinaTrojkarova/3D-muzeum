import * as THREE from 'three';
import type { PhysicsWorld } from '../physics/physics';
import { textureLoader } from '../utils/textureLoader';
import { getConfig } from '../config';

export function createFloor(scene: THREE.Scene, physicsWorld?: PhysicsWorld) {
    const config = getConfig().floor;
    
    const geometry = new THREE.PlaneGeometry(config.width, config.height);
    geometry.rotateX(-Math.PI / 2);
    
    const diffuseMap = textureLoader.load(config.diffuse_map);
    const normalMap = textureLoader.load(config.normal_map);
    const armMap = textureLoader.load(config.arm_map);
    
    [diffuseMap, normalMap, armMap].forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(config.texture_repeat_x, config.texture_repeat_y);
    });
    
    const material = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        aoMap: armMap,
        roughnessMap: armMap,
        metalnessMap: armMap,
    });
    
    const plane = new THREE.Mesh(geometry, material);
    
    plane.receiveShadow = true;

    plane.geometry.setAttribute('uv2', plane.geometry.attributes.uv);

    scene.add(plane);
    
    if (physicsWorld) {
        physicsWorld.createPlaneCollider(0);
    }
    
    return plane;
}