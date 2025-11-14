import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import type { PhysicsWorld } from '../physics/physics';
import { InputHandler } from './input';
import { PlayerController } from './controller';
import { getConfig } from '../config';

/**
 * First-person camera with pointer lock controls
 */
export class FirstPersonCamera {
    camera: THREE.PerspectiveCamera;
    controls: PointerLockControls;
    
    private inputHandler: InputHandler;
    private playerController: PlayerController;
    private prevTime: number = performance.now();
    
    // Zoom settings
    private readonly defaultFov: number;
    private readonly zoomedFov: number;
    private readonly zoomSpeed: number;
    private currentFov: number;
    private targetFov: number;
    
    // View bobbing settings
    private bobbingTime: number = 0;
    private readonly walkBobbingSpeed: number;
    private readonly sprintBobbingSpeed: number;
    private readonly walkVerticalBob: number;
    private readonly walkHorizontalBob: number;
    private readonly sprintVerticalBob: number;
    private readonly sprintHorizontalBob: number;
    private baseHeight: number = 0;
    private targetBobbing: number = 0;
    private currentBobbing: number = 0;

    constructor(
        domElement: HTMLElement,
        aspect: number = window.innerWidth / window.innerHeight
    ) {
        const config = getConfig().camera;
        
        this.defaultFov = config.default_fov;
        this.zoomedFov = config.zoomed_fov;
        this.zoomSpeed = config.zoom_speed;
        this.currentFov = config.default_fov;
        this.targetFov = config.default_fov;
        
        this.walkBobbingSpeed = config.bobbing.walk_speed;
        this.sprintBobbingSpeed = config.bobbing.sprint_speed;
        this.walkVerticalBob = config.bobbing.walk_vertical_amplitude;
        this.walkHorizontalBob = config.bobbing.walk_horizontal_amplitude;
        this.sprintVerticalBob = config.bobbing.sprint_vertical_amplitude;
        this.sprintHorizontalBob = config.bobbing.sprint_horizontal_amplitude;
        
        this.camera = new THREE.PerspectiveCamera(config.default_fov, aspect, 0.1, 1000);
        this.camera.position.set(config.initial_x, config.initial_y, config.initial_z);
        this.baseHeight = this.camera.position.y;
        
        this.controls = new PointerLockControls(this.camera, domElement);
        
        domElement.addEventListener('click', () => {
            this.controls.lock();
        });
        
        this.inputHandler = new InputHandler();
        this.playerController = new PlayerController();
    }
    
    /**
     * Initialize physics for the player
     */
    initPhysics(physicsWorld: PhysicsWorld) {
        this.playerController.initPhysics(physicsWorld, this.camera.position);
    }

    /**
     * Update camera position based on movement state
     */
    update() {
        if (!this.controls.isLocked) return;

        // Calculate delta time in seconds
        const time = performance.now();
        const delta = (time - this.prevTime) / 1000;
        this.prevTime = time;

        // Get input state
        const input = this.inputHandler.getMovementInput();
        
        // Update zoom target based on input
        this.targetFov = input.zoom ? this.zoomedFov : this.defaultFov;
        
        // Smoothly interpolate FOV towards target
        if (Math.abs(this.currentFov - this.targetFov) > 0.1) {
            const direction = this.targetFov < this.currentFov ? -1 : 1;
            this.currentFov += direction * this.zoomSpeed * delta;

            if (direction < 0) {
                this.currentFov = Math.max(this.currentFov, this.targetFov);
            } else {
                this.currentFov = Math.min(this.currentFov, this.targetFov);
            }
            
            this.camera.fov = this.currentFov;
            this.camera.updateProjectionMatrix();
        }
        
        // Update player position
        const newPosition = this.playerController.update(
            delta,
            input,
            this.camera,
            this.camera.position
        );
        
        // Update base height from physics position
        this.baseHeight = newPosition.y;
        
        // View bobbing
        const isMoving = input.forward || input.backward || input.left || input.right;
        
        if (isMoving) {
            const bobbingSpeed = input.sprint ? this.sprintBobbingSpeed : this.walkBobbingSpeed;
            const verticalBob = input.sprint ? this.sprintVerticalBob : this.walkVerticalBob;
            const horizontalBob = input.sprint ? this.sprintHorizontalBob : this.walkHorizontalBob;
            
            this.targetBobbing = 1.0;
            this.bobbingTime += delta * bobbingSpeed;
        } else {
            this.targetBobbing = 0.0;
        }
        
        // Smooth interpolation
        this.currentBobbing += (this.targetBobbing - this.currentBobbing) * delta * 10;
        
        if (this.currentBobbing > 0.01) {
            const verticalBobAmount = input.sprint ? this.sprintVerticalBob : this.walkVerticalBob;
            const horizontalBobAmount = input.sprint ? this.sprintHorizontalBob : this.walkHorizontalBob;
            
            const verticalOffset = Math.abs(Math.sin(this.bobbingTime)) * verticalBobAmount * this.currentBobbing;
            const horizontalOffset = Math.sin(this.bobbingTime * 0.5) * horizontalBobAmount * this.currentBobbing;
            
            newPosition.y = this.baseHeight + verticalOffset;
            
            const right = new THREE.Vector3();
            this.camera.getWorldDirection(right);
            right.cross(new THREE.Vector3(0, 1, 0)).normalize();
            newPosition.add(right.multiplyScalar(horizontalOffset));
        }
        
        // Update camera position
        this.camera.position.copy(newPosition);
    }

    /**
     * Reset internal timing to avoid large deltas after pauses
     */
    resetDeltaTime() {
        this.prevTime = performance.now();
    }

    /**
     * Handle window resize
     */
    onResize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Get the THREE.js camera instance
     */
    getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    /**
     * Check if pointer is locked
     */
    isPointerLocked(): boolean {
        return this.controls.isLocked;
    }

    /**
     * Get the controls instance
     */
    getControls(): PointerLockControls {
        return this.controls;
    }

    /**
     * Get the player controller
     */
    getPlayerController(): PlayerController {
        return this.playerController;
    }

    /**
     * Request pointer lock
     */
    requestPointerLock() {
        this.controls.lock();
    }

    /**
     * Dispose of the camera and clean up resources
     */
    dispose() {
        // Dispose controls
        this.controls.dispose();
        
        // Clean up input handler
        this.inputHandler.dispose();
        
        // Clean up player controller
        this.playerController.dispose();
    }
}