import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { PhysicsWorld } from '../physics/physics';

type StatuesConfig = ReturnType<typeof import('../config').getConfig>['statues'];

export async function createStatue(
    scene: THREE.Scene,
    physics: PhysicsWorld,
    modelConfig: StatuesConfig['models'][number],
    position: THREE.Vector3
): Promise<THREE.Group> {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    const group = new THREE.Group();

    group.position.copy(position);
    scene.add(group);

    await new Promise<void>((resolve, reject) => {
        loader.load(
            `/models/${modelConfig.file}`,
            (gltf) => {
                const model = gltf.scene;

                const uniformScale = modelConfig.scale ?? 1.0;
                model.scale.set(uniformScale, uniformScale, uniformScale);

                const yOffset = modelConfig.y_offset ?? 0;

                const box = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                const center = new THREE.Vector3();
                box.getSize(size);
                box.getCenter(center);

                model.position.sub(center);
                model.position.y += size.y / 2 + yOffset;

                model.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                    }
                });

                group.add(model);
                resolve();
            },
            undefined,
            (error) => {
                console.error(`Error loading statue model ${modelConfig.file}`, error);
                reject(error);
            }
        );
    });

    return group;
}
