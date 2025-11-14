import * as THREE from 'three';
import { getConfig, getToneMappingConstant, getShadowMapType } from '../config';

/**
 * Create and configure a WebGL renderer
 */
export function createRenderer(
    container: HTMLElement,
    width: number,
    height: number
): THREE.WebGLRenderer {
    const config = getConfig().renderer;

    const renderer = new THREE.WebGLRenderer({ 
        antialias: config.antialias,
        powerPreference: config.power_preference as 'default' | 'high-performance' | 'low-power'
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.max_pixel_ratio));
    renderer.toneMapping = getToneMappingConstant(config.tone_mapping);
    renderer.toneMappingExposure = config.tone_mapping_exposure;
    
    // Enable shadows
    renderer.shadowMap.enabled = config.shadow_map_enabled;
    renderer.shadowMap.type = getShadowMapType(config.shadow_map_type);
    
    container.appendChild(renderer.domElement);
    
    return renderer;
}

/**
 * Handle renderer resize
 */
export function resizeRenderer(
    renderer: THREE.WebGLRenderer,
    width: number,
    height: number
) {
    renderer.setSize(width, height);
}
