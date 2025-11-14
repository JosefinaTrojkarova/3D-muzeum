import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/Addons.js';
import { getConfig } from '../config';

/**
 * Load and setup skybox with HDR environment
 */
export async function setupSkybox(
    scene: THREE.Scene,
    renderer?: THREE.WebGLRenderer
): Promise<THREE.Texture> {
    const config = getConfig().scene;
    
    return new Promise((resolve, reject) => {
        const loader = new HDRLoader();
        
        loader.load(
            config.skybox_hdr_path,
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                
                // Enable anisotropic filtering for better texture quality
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
            },
            undefined,
            (error) => {
                console.error('Error loading HDR skybox:', error);
                reject(error);
            }
        );
    });
}
