import * as THREE from 'three';
import { getConfig } from '../config';

/**
 * Setup a simple skybox using a solid "old yellow paper" color instead of an image texture.
 */
export async function setupSkybox(
    scene: THREE.Scene,
    renderer?: THREE.WebGLRenderer
): Promise<THREE.Texture> {
    const config = getConfig().scene;

    return new Promise((resolve) => {
        const geometry = new THREE.SphereGeometry(
            config.skybox_radius,
            config.skybox_segments_width,
            config.skybox_segments_height
        );

        // Invert the sphere so we see the inside surface
        geometry.scale(-1, 1, 1);

        const material = new THREE.MeshBasicMaterial({
            color: 0xdbc99a
        });

        const skyboxMesh = new THREE.Mesh(geometry, material);

        skyboxMesh.rotation.x = config.skybox_rotation_x;
        skyboxMesh.rotation.y = config.skybox_rotation_y;

        scene.add(skyboxMesh);

        // Keep return type compatible; this texture is not used.
        const dummyTexture = new THREE.Texture();
        if (renderer) {
            dummyTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }

        resolve(dummyTexture);
    });
}
