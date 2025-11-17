import * as THREE from 'three';
import type { PhysicsWorld } from '../physics/physics';
import { textureLoader } from '../utils/textureLoader';
import { createPictureLight } from './pictureLight';
import { getConfig } from '../config';
import { createPlaque, type PlaqueData } from './plaque';

export async function createArtworkStand(
    scene: THREE.Scene, 
    physics: PhysicsWorld,
    position: THREE.Vector3,
    rotation: number = 0,
    paintingTexture?: THREE.Texture,
    normalMap?: THREE.Texture,
    plaqueData?: PlaqueData
): Promise<THREE.Group> {
    const config = getConfig().stand;
    const stand = new THREE.Group();
    
    const backingGeometry = new THREE.BoxGeometry(
        config.backing_width,
        config.backing_height,
        config.backing_depth
    );
    const backingMaterial = new THREE.MeshStandardMaterial({ 
        color: config.backing_color,
        roughness: config.backing_roughness,
        metalness: config.backing_metalness
    });
    const backing = new THREE.Mesh(backingGeometry, backingMaterial);
    const backingBaseY = (config.backing_height / 2) + config.backing_ground_offset;
    backing.position.y = backingBaseY;
    backing.position.z = config.backing_position_z;
    backing.castShadow = true;
    backing.receiveShadow = true;
    stand.add(backing);
    
    // Store plaque data for later creation (after texture loads)
    if (plaqueData) {
        (stand as any).plaqueData = plaqueData;
    }
    
    // Store normal map for later use
    if (normalMap) {
        (stand as any).normalMap = normalMap;
    }
    
    stand.position.copy(position);
    stand.rotation.y = rotation;
    scene.add(stand);
    
    const backingOffset = new THREE.Vector3(0, backingBaseY, config.backing_position_z);
    backingOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    const backingColliderPos = new THREE.Vector3(
        position.x + backingOffset.x,
        position.y + backingOffset.y,
        position.z + backingOffset.z
    );
    
    const backingRotation = new THREE.Quaternion();
    backingRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    
    const backingSize = new THREE.Vector3(
        config.backing_width,
        config.backing_height,
        config.backing_depth
    );
    physics.createBoxCollider(backingColliderPos, backingSize, backingRotation);
    
    return stand;
}

export interface PaintingConfig {
    imagePath: string;
    position: THREE.Vector3;
    rotation?: number;
}

export async function loadPaintingTexture(
    imagePath: string,
    stand: THREE.Group,
    normalMap?: THREE.Texture,
    renderer?: THREE.WebGLRenderer
): Promise<void> {
    const config = getConfig().stand;
    
    // Use stored normal map if not provided
    const usedNormalMap = normalMap || (stand as any).normalMap;
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(imagePath, resolve, undefined, reject);
    });

    texture.colorSpace = THREE.SRGBColorSpace;

    if (renderer) {
        const initTexture = (renderer as THREE.WebGLRenderer & { initTexture?: (texture: THREE.Texture) => void }).initTexture;
        initTexture?.call(renderer, texture);
    }

    const image = texture.image as { width?: number; height?: number } | undefined;
    const paintingWidth = config.painting_default_width;
    const aspectRatio = image?.width ? (image.height ?? image.width) / image.width : 1;
    const paintingHeight = paintingWidth * aspectRatio;

    const paintingGeometry = new THREE.BoxGeometry(
        paintingWidth,
        paintingHeight,
        config.painting_depth
    );

    const frontMaterial = new THREE.MeshBasicMaterial({
        map: texture
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({ 
        normalMap: usedNormalMap,
        color: config.painting_color,
        roughness: config.painting_roughness,
        metalness: config.painting_metalness
    });

    const backMaterial = new THREE.MeshStandardMaterial({ 
        color: config.painting_color,
        roughness: config.painting_roughness,
        metalness: config.painting_metalness
    });

    const paintingMaterials = [
        edgeMaterial,
        edgeMaterial,
        edgeMaterial,
        edgeMaterial,
        frontMaterial,
        backMaterial
    ];

    const painting = new THREE.Mesh(paintingGeometry, paintingMaterials);
    painting.position.y = config.painting_center_height;
    painting.position.z = config.painting_z_offset;
    painting.castShadow = true;
    painting.receiveShadow = true;
    stand.add(painting);

    // Create picture light only once per stand
    if (!stand.children.find(child => child.type === 'Group' && child.children.length > 5)) {
        const pictureLight = createPictureLight({
            paintingWidth,
            paintingHeight,
            paintingCenterHeight: config.painting_center_height
        });
        stand.add(pictureLight);
    }

    const plaqueData = (stand as any).plaqueData as PlaqueData | undefined;
    if (plaqueData && !stand.children.find(child => child.name === 'plaque')) {
        const plaque = await createPlaque(plaqueData, {
            paintingWidth,
            paintingHeight,
            paintingCenterHeight: config.painting_center_height
        });
        stand.add(plaque);
    }
}
