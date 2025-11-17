import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson(), wasm()],
	resolve: {
		alias: {
			'@dimforge/rapier3d': '@dimforge/rapier3d/rapier.js'
		}
	},
	build: {
		chunkSizeWarningLimit: 2048,
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Split very large deps so Cloudflare assets stay under size limits
					if (id.includes('node_modules/three')) {
						return 'vendor_three';
					}
					if (id.includes('@dimforge/rapier3d')) {
						return 'vendor_rapier';
					}
					if (id.includes('node_modules/gsap')) {
						return 'vendor_gsap';
					}
				}
			}
		}
	},
	ssr: {
		noExternal: ['@dimforge/rapier3d']
	}
});
