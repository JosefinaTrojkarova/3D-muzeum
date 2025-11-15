import * as THREE from 'three';
import type { PhysicsWorld } from '../physics/physics';
import { createArtworkStand, loadPaintingTexture } from './stands';
import { textureLoader } from '../utils/textureLoader';
import { getConfig } from '../config';
import { loadPlaqueData } from './plaque';
import { createStatue } from './statue';

export async function createGallery(scene: THREE.Scene, physics: PhysicsWorld): Promise<THREE.Group[]> {
    const config = getConfig().gallery;
    const statuesConfig = getConfig().statues;
    const stands: THREE.Group[] = [];
    
    // Load the paint normal map for all paintings
    const paintNormalMap = textureLoader.load(config.paint_normal_map, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(config.paint_normal_repeat_x, config.paint_normal_repeat_y);
    });
    
    const centerPosition = new THREE.Vector3(
        statuesConfig.start_position_x,
        statuesConfig.start_position_y,
        statuesConfig.start_position_z
    );

    // --- Statues: center + inner ring ---
    const totalStatues = statuesConfig.models.length;
    const statueRingCount = totalStatues - 1;
    const statueRingRadius = statuesConfig.stand_spacing * 1.5;
    const centerIndex = statuesConfig.models.findIndex((m) => m.file === 'horse-dragon.glb');
    const resolvedCenterIndex = centerIndex === -1 ? 0 : centerIndex;

    let ringIndex = 0;

    for (let index = 0; index < totalStatues; index++) {
        const modelConfig = statuesConfig.models[index];

        let statuePosition: THREE.Vector3;

        if (index === resolvedCenterIndex) {
            statuePosition = centerPosition.clone();
        } else {
            const angle = (ringIndex / Math.max(statueRingCount, 1)) * Math.PI * 2;
            statuePosition = new THREE.Vector3(
                centerPosition.x + Math.cos(angle) * statueRingRadius,
                centerPosition.y,
                centerPosition.z + Math.sin(angle) * statueRingRadius
            );
            ringIndex++;
        }

        await createStatue(scene, physics, modelConfig, statuePosition);
    }

    // --- Paintings: outer ring ---
    const totalPaintings = config.paintings.length;
    const ringRadius = config.stand_spacing * 3.0;

    // Process paintings sequentially to maintain proper async flow
    for (let index = 0; index < totalPaintings; index++) {
        const paintingName = config.paintings[index];

        const angle = (index / Math.max(totalPaintings, 1)) * Math.PI * 2;

        const position = new THREE.Vector3(
            centerPosition.x + Math.cos(angle) * ringRadius,
            config.start_position_y,
            centerPosition.z + Math.sin(angle) * ringRadius
        );

        // Rotate stand so its front faces the center based on direction vector
        const directionToCenter = centerPosition.clone().sub(position);
        const rotation = Math.atan2(directionToCenter.x, directionToCenter.z);
        
        // Extract painting number from filename (e.g., "1.webp" -> "1")
        const paintingNumber = paintingName.split('.')[0];
        
        // Load plaque data
        const plaqueData = await loadPlaqueData(paintingNumber);
        
        // Create the stand with plaque data
        const stand = await createArtworkStand(
            scene,
            physics,
            position,
            rotation,
            undefined,
            paintNormalMap,
            plaqueData || undefined
        );
        
        // Load the painting texture (this will update plaque when texture loads)
        loadPaintingTexture(`/paintings/${paintingName}`, stand, paintNormalMap);
        
        stands.push(stand);
    }
    
    return stands;
}
