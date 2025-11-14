import * as THREE from 'three';

class TextureLoaderManager {
    private static instance: TextureLoaderManager;
    private loader: THREE.TextureLoader;
    private loadedTextures: Map<string, THREE.Texture> = new Map();

    private constructor() {
        this.loader = new THREE.TextureLoader();
        THREE.Cache.enabled = true;
    }

    static getInstance(): TextureLoaderManager {
        if (!TextureLoaderManager.instance) {
            TextureLoaderManager.instance = new TextureLoaderManager();
        }
        return TextureLoaderManager.instance;
    }

    load(
        url: string,
        onLoad?: (texture: THREE.Texture) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (error: unknown) => void
    ): THREE.Texture {
        // Check if we have a cached texture and if it's still valid (not disposed)
        const cached = this.loadedTextures.get(url);
        if (cached) {
            // Check if texture image is still valid
            const img = cached.image as HTMLImageElement | undefined;
            if (img && img.width > 0) {
                if (onLoad) {
                    setTimeout(() => onLoad(cached), 0);
                }
                return cached;
            } else {
                // Texture was disposed, remove from cache
                this.loadedTextures.delete(url);
            }
        }

        const texture = this.loader.load(
            url,
            (loadedTexture) => {
                this.loadedTextures.set(url, loadedTexture);
                if (onLoad) onLoad(loadedTexture);
            },
            onProgress,
            onError
        );

        return texture;
    }

    async preloadTextures(urls: string[]): Promise<THREE.Texture[]> {
        const promises = urls.map((url) => {
            return new Promise<THREE.Texture>((resolve, reject) => {
                this.load(url, resolve, undefined, reject);
            });
        });

        return Promise.all(promises);
    }

    clearCache() {
        this.loadedTextures.forEach((texture) => {
            texture.dispose();
        });
        this.loadedTextures.clear();
        THREE.Cache.clear();
    }

    getCacheSize(): number {
        return this.loadedTextures.size;
    }
}

export const textureLoader = TextureLoaderManager.getInstance();
