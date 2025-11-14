import * as THREE from 'three';
import { museumConfig, type MuseumConfig } from './museum.config';

export type { MuseumConfig };

/**
 * Get the museum configuration
 */
export function getConfig(): MuseumConfig {
    return museumConfig;
}

/**
 * Helper to convert tone mapping string to THREE constant
 */
export function getToneMappingConstant(toneMappingName: string): THREE.ToneMapping {
    switch (toneMappingName) {
        case 'None':
            return THREE.NoToneMapping;
        case 'Linear':
            return THREE.LinearToneMapping;
        case 'Reinhard':
            return THREE.ReinhardToneMapping;
        case 'Cineon':
            return THREE.CineonToneMapping;
        case 'ACESFilmic':
            return THREE.ACESFilmicToneMapping;
        default:
            return THREE.ACESFilmicToneMapping;
    }
}

/**
 * Helper to convert shadow map type string to THREE constant
 */
export function getShadowMapType(shadowMapType: string): THREE.ShadowMapType {
    switch (shadowMapType) {
        case 'Basic':
            return THREE.BasicShadowMap;
        case 'PCF':
            return THREE.PCFShadowMap;
        case 'PCFSoft':
            return THREE.PCFSoftShadowMap;
        case 'VSM':
            return THREE.VSMShadowMap;
        default:
            return THREE.PCFSoftShadowMap;
    }
}

// Re-export the config for convenience
export { museumConfig };

