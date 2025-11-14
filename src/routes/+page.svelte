<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { createRenderer } from "$lib/renderer/renderer";
    import { FirstPersonCamera } from "$lib/player/camera";
    import { PhysicsWorld } from "$lib/physics/physics";
    import { initializeScene } from "$lib/scene/init";
    import { textureLoader } from "$lib/utils/textureLoader";
    import LoadingScreen from "$lib/components/LoadingScreen.svelte";
    import PauseScreen from "$lib/components/PauseScreen.svelte";

    let canvasContainer: HTMLDivElement;
    let isLoading = $state(true);
    let isReady = $state(false);
    let hasEntered = $state(false);
    let isPaused = $state(false);
    let fpCamera: FirstPersonCamera | null = null;

    function enterMuseum() {
        hasEntered = true;
        isPaused = false;
        // Request pointer lock immediately when entering
        resumeExperience();
    }

    function resumeExperience() {
        if (!fpCamera) return;

        if (fpCamera.isPointerLocked()) {
            isPaused = false;
            fpCamera.resetDeltaTime();
            return;
        }

        fpCamera.requestPointerLock();
    }

    onMount(() => {
        let cleanupFn: (() => void) | null = null;
        let removeControlsListeners: (() => void) | null = null;
        let removeKeyListener: (() => void) | null = null;
        let removeKeyUpListener: (() => void) | null = null;
        
        (async () => {
            const renderer = createRenderer(
                canvasContainer,
                window.innerWidth,
                window.innerHeight
            );

            const camera = new FirstPersonCamera(
                renderer.domElement,
                window.innerWidth / window.innerHeight
            );
            fpCamera = camera;

            const physics = new PhysicsWorld();
            await physics.init();
            
            camera.initPhysics(physics);

            const scene = await initializeScene(physics, renderer);

            // Loading complete
            isLoading = false;
            isReady = true;

            function onWindowResize() {
                camera.onResize(window.innerWidth, window.innerHeight);
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
            window.addEventListener("resize", onWindowResize);

            const controls = camera.getControls();
            const handleLock = () => {
                camera.resetDeltaTime();
                if (hasEntered) {
                    isPaused = false;
                }
            };
            const handleUnlock = () => {
                if (hasEntered) {
                    isPaused = true;
                }
            };
            controls.addEventListener('lock', handleLock);
            controls.addEventListener('unlock', handleUnlock);
            removeControlsListeners = () => {
                controls.removeEventListener('lock', handleLock);
                controls.removeEventListener('unlock', handleUnlock);
            };

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.code === 'Escape' && fpCamera?.isPointerLocked()) {
                    event.preventDefault();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            removeKeyListener = () => {
                window.removeEventListener('keydown', handleKeyDown);
            };

            const handleKeyUp = (event: KeyboardEvent) => {
                if (
                    event.code === 'Escape' &&
                    hasEntered &&
                    isPaused &&
                    fpCamera &&
                    !fpCamera.isPointerLocked()
                ) {
                    event.preventDefault();
                    resumeExperience();
                }
            };
            window.addEventListener('keyup', handleKeyUp);
            removeKeyUpListener = () => {
                window.removeEventListener('keyup', handleKeyUp);
            };

            function animate() {
                if (isPaused) {
                    return;
                }

                physics.step();
                camera.update();
                renderer.render(scene, camera.getCamera());
            }
            renderer.setAnimationLoop(animate);

            cleanupFn = () => {
                renderer.setAnimationLoop(null);
                window.removeEventListener("resize", onWindowResize);
                removeControlsListeners?.();
                removeKeyListener?.();
                removeKeyUpListener?.();
                
                camera.dispose();
                physics.dispose();
                
                scene.traverse((object) => {
                    if (object instanceof THREE.Mesh) {
                        if (object.geometry) {
                            object.geometry.dispose();
                        }
                        if (object.material) {
                            if (Array.isArray(object.material)) {
                                object.material.forEach((material: THREE.Material) => material.dispose());
                            } else {
                                object.material.dispose();
                            }
                        }
                    }
                });
                
                textureLoader.clearCache();
                renderer.dispose();
            };
        })();
        
        return () => {
            if (cleanupFn) cleanupFn();
        };
    });
</script>

<div bind:this={canvasContainer} class="canvas-container" class:hidden={!hasEntered}>

</div>

<LoadingScreen 
    {isLoading} 
    {isReady} 
    {hasEntered} 
    onEnter={enterMuseum} 
/>

<PauseScreen 
    visible={hasEntered && isPaused}
    onResume={resumeExperience}
/>

<style>
    .canvas-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
    }

    .canvas-container.hidden {
        opacity: 0;
        pointer-events: none;
    }
</style>