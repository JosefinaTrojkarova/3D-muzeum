import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/Addons.js';
import { getConfig } from '../config';

/**
 * Load and setup skybox with HDR or standard textures (e.g. WebP)
 */
export async function setupSkybox(
    scene: THREE.Scene,
    renderer?: THREE.WebGLRenderer
): Promise<THREE.Texture> {
    const config = getConfig().scene;
    const skyboxPath = config.skybox_texture_path;
    const isHdr = skyboxPath.toLowerCase().endsWith('.hdr');

    return new Promise((resolve, reject) => {
        const handleTexture = (texture: THREE.Texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            if (!isHdr) {
                texture.colorSpace = THREE.SRGBColorSpace;
            }

            if (renderer) {
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            }

            const geometry = new THREE.SphereGeometry(
                config.skybox_radius,
                config.skybox_segments_width,
                config.skybox_segments_height
            );
            geometry.scale(-1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const skyboxMesh = new THREE.Mesh(geometry, material);

            skyboxMesh.rotation.x = config.skybox_rotation_x;
            skyboxMesh.rotation.y = config.skybox_rotation_y;

            scene.add(skyboxMesh);

            resolve(texture);
        };

        const handleError = (error: unknown) => {
            console.error('Error loading skybox texture:', error);
            reject(error);
        };

        if (isHdr) {
            const hdrLoader = new HDRLoader();
            hdrLoader.load(skyboxPath, handleTexture, undefined, handleError);
        } else {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(skyboxPath, handleTexture, undefined, handleError);
        }
    });
}
