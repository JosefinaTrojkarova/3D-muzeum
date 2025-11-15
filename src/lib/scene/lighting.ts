import * as THREE from 'three';
import { getConfig } from '../config';

/**
 * Add ambient lighting and a very soft, shadowless directional "sun" for reflections.
 */
export function setupLighting(scene: THREE.Scene) {
    const config = getConfig().lighting;

    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(config.ambient_color, config.ambient_intensity);

    // Make ambient light not affect the floor (only layer 0)
    ambientLight.layers.disableAll();
    ambientLight.layers.enable(0);

    scene.add(ambientLight);

    return { ambientLight };
}
