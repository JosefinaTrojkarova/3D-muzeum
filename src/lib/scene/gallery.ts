import * as THREE from 'three';
import type { PhysicsWorld } from '../physics/physics';
import { createArtworkStand, loadPaintingTexture } from './stands';
import { textureLoader } from '../utils/textureLoader';
import { getConfig } from '../config';
import { loadPlaqueData } from './plaque';

export async function createGallery(scene: THREE.Scene, physics: PhysicsWorld): Promise<THREE.Group[]> {
    const config = getConfig().gallery;
    const stands: THREE.Group[] = [];
    
    // Load the paint normal map for all paintings
    const paintNormalMap = textureLoader.load(config.paint_normal_map, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(config.paint_normal_repeat_x, config.paint_normal_repeat_y);
    });
    
    // Process paintings sequentially to maintain proper async flow
    for (let index = 0; index < config.paintings.length; index++) {
        const paintingName = config.paintings[index];
        
        // Calculate position based on index
        const row = Math.floor(index / config.stands_per_row);
        const col = index % config.stands_per_row;
        
        const position = new THREE.Vector3(
            config.start_position_x + (col * config.stand_spacing),
            config.start_position_y,
            config.start_position_z + (row * config.row_spacing)
        );
        
        // Determine rotation (optional: alternate or keep all facing same direction)
        const rotation = 0; // All facing forward
        
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
