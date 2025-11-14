import * as THREE from 'three';
import { getConfig } from '../config';

export interface PlaqueData {
    title: string;
    artist: string;
}

interface PlaqueParams {
    paintingWidth: number;
    paintingHeight: number;
    paintingCenterHeight: number;
}

/**
 * Creates a 3D information plaque with text displaying artwork title and artist
 */
export async function createPlaque(data: PlaqueData, params: PlaqueParams): Promise<THREE.Group> {
    const { paintingWidth, paintingHeight, paintingCenterHeight } = params;
    const config = getConfig().plaque;
    const standConfig = getConfig().stand;
    
    // Wait for fonts to load before creating the plaque
    await document.fonts.ready;
    
    const plaque = new THREE.Group();
    plaque.name = 'plaque';
    
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    // Set canvas size (higher resolution for better text quality)
    canvas.width = config.canvas_width;
    canvas.height = config.canvas_height;
    
    context.fillStyle = config.canvas_background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = config.text_color;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    
    context.font = `bold ${config.title_font_size}px ${config.font_family}`;
    const titleY = canvas.height * 0.35;
    const textX = canvas.width * 0.08;
    const maxWidth = canvas.width * 0.85;
    wrapText(context, data.title, textX, titleY, maxWidth, config.title_font_size * 1.2, 'left');
    
    context.font = `bold ${config.artist_font_size}px ${config.font_family}`;
    const artistY = canvas.height * 0.68;
    context.fillText(data.artist, textX, artistY, maxWidth);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const canvasAspect = canvas.width / canvas.height;
    const plaqueAspect = config.width / config.height;
    
    if (canvasAspect > plaqueAspect) {
        texture.repeat.x = plaqueAspect / canvasAspect;
        texture.offset.x = (1 - texture.repeat.x) / 2;
    } else {
        texture.repeat.y = canvasAspect / plaqueAspect;
        texture.offset.y = (1 - texture.repeat.y) / 2;
    }
    
    const plateGeometry = new THREE.BoxGeometry(
        config.width,
        config.height,
        config.depth
    );
    
    const whiteMaterial = new THREE.MeshStandardMaterial({
        color: config.background_color,
        roughness: config.roughness,
        metalness: config.metalness,
    });
    const textureMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: config.roughness,
        metalness: config.metalness,
    });
    
    const materials = [
        whiteMaterial,
        whiteMaterial,
        whiteMaterial,
        whiteMaterial,
        textureMaterial,
        whiteMaterial,
    ];
    
    const plate = new THREE.Mesh(plateGeometry, materials);
    plate.castShadow = true;
    plate.receiveShadow = true;
    plaque.add(plate);
    
    // Calculate position dynamically
    const plaqueX = -(paintingWidth / 2) + (config.width / 2);
    const plaqueY = paintingCenterHeight - (paintingHeight / 2) - config.gap_below_painting - (config.height / 2);
    const plaqueZ = standConfig.backing_position_z + (standConfig.backing_depth / 2) + (config.depth / 2);
    
    plaque.position.set(plaqueX, plaqueY, plaqueZ);
    
    return plaque;
}

/**
 * Helper function to wrap text across multiple lines
 */
function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    align: 'left' | 'center' = 'center'
): void {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    const lines: string[] = [];
    
    // Build lines
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = context.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
            lines.push(line);
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    
    // Calculate starting Y to center all lines vertically
    const totalHeight = lines.length * lineHeight;
    currentY = y - (totalHeight / 2) + (lineHeight / 2);
    
    // Draw all lines
    for (const textLine of lines) {
        context.fillText(textLine.trim(), x, currentY, maxWidth);
        currentY += lineHeight;
    }
}

/**
 * Loads plaque data from JSON file
 */
export async function loadPlaqueData(paintingNumber: string): Promise<PlaqueData | null> {
    try {
        const response = await fetch(`/paintings/meta/${paintingNumber}.json`);
        if (!response.ok) {
            console.warn(`Failed to load metadata for painting ${paintingNumber}`);
            return null;
        }
        
        const data = await response.json();
        return {
            title: data.title || 'Untitled',
            artist: data.artist || 'Unknown Artist',
        };
    } catch (error) {
        console.error(`Error loading plaque data for painting ${paintingNumber}:`, error);
        return null;
    }
}
