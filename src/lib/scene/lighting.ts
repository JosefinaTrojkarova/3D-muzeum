import * as THREE from 'three';
import { getConfig } from '../config';

/**
 * Add ambient and directional lighting to the scene
 */
export function setupLighting(scene: THREE.Scene) {
    const config = getConfig().lighting;
    
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(config.ambient_color, config.ambient_intensity);
    
    // Make ambient light not affect the floor (only layer 0)
    ambientLight.layers.disableAll();
    ambientLight.layers.enable(0);
    
    scene.add(ambientLight);
    
    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(config.sun_color, config.sun_intensity);
    sunLight.position.set(config.sun_position_x, config.sun_position_y, config.sun_position_z);
    sunLight.castShadow = true;
    
    // Make sun light affect all layers including the floor's special layer
    sunLight.layers.enableAll();
    
    // Configure shadow properties
    sunLight.shadow.mapSize.width = config.shadows.map_width;
    sunLight.shadow.mapSize.height = config.shadows.map_height;
    sunLight.shadow.camera.near = config.shadows.camera_near;
    sunLight.shadow.camera.far = config.shadows.camera_far;
    sunLight.shadow.camera.left = config.shadows.camera_left;
    sunLight.shadow.camera.right = config.shadows.camera_right;
    sunLight.shadow.camera.top = config.shadows.camera_top;
    sunLight.shadow.camera.bottom = config.shadows.camera_bottom;
    
    scene.add(sunLight);
    
    return { ambientLight, sunLight };
}
