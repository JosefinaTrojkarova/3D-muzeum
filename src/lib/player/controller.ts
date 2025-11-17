import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d';
import type { PhysicsWorld } from '../physics/physics';
import type { MovementInput } from './input';
import { getConfig } from '../config';

/**
 * Player movement controller with physics support
 */
export class PlayerController {
    private moveSpeed: number;
    private sprintMultiplier: number;
    private jumpVelocity: number = 0;
    private readonly jumpForce: number;
    private readonly gravity: number;
    
    // Physics components
    private physicsWorld: PhysicsWorld | null = null;
    private characterController: RAPIER.KinematicCharacterController | null = null;
    private collider: RAPIER.Collider | null = null;
    
    // Movement state
    private canJump: boolean = false;
    private velocity: THREE.Vector3 = new THREE.Vector3();
    private direction: THREE.Vector3 = new THREE.Vector3();
    
    constructor() {
        const playerConfig = getConfig().player;
        const physicsConfig = getConfig().physics;
        
        this.moveSpeed = playerConfig.move_speed;
        this.sprintMultiplier = playerConfig.sprint_multiplier;
        this.jumpForce = playerConfig.jump_force;
        this.gravity = physicsConfig.gravity_y;
    }
    
    /**
     * Initialize physics for the player
     */
    initPhysics(physicsWorld: PhysicsWorld, position: THREE.Vector3) {
        if (!physicsWorld.isInitialized()) {
            console.error('Physics world not initialized');
            return;
        }
        
        const playerConfig = getConfig().player;
        const cameraConfig = getConfig().camera;
        const physicsConfig = getConfig().physics;
        
        this.physicsWorld = physicsWorld;
        
        // Create character controller
        this.characterController = physicsWorld.createCharacterController(physicsConfig.controller_offset);
        if (this.characterController) {
            this.characterController.enableAutostep(
                physicsConfig.autostep_max_height,
                physicsConfig.autostep_min_width,
                true
            );
            this.characterController.enableSnapToGround(physicsConfig.snap_to_ground_distance);
        }
        
        // Create player collider (capsule)
        const playerHeight = playerConfig.height;
        const playerRadius = playerConfig.radius;
        const eyeHeight = cameraConfig.eye_height;
        
        this.collider = physicsWorld.createPlayerCollider(
            position,
            playerRadius,
            playerHeight
        );
        
        // Store the offset from capsule center to eyes
        // Capsule center will be at playerHeight/2 when on ground
        // We want eyes at eyeHeight, so offset is eyeHeight - (playerHeight / 2)
        this.eyeOffset = eyeHeight - (playerHeight / 2);
    }

    private eyeOffset: number = 0;

    /**
     * Update player position based on input and physics
     */
    update(
        delta: number,
        input: MovementInput,
        camera: THREE.Camera,
        position: THREE.Vector3
    ): THREE.Vector3 {
        if (this.characterController && this.collider && this.physicsWorld?.world) {
            return this.updateWithPhysics(delta, input, camera);
        } else {
            return this.updateWithoutPhysics(delta, input, camera, position);
        }
    }
    
    /**
     * Update with physics enabled
     */
    private updateWithPhysics(
        delta: number,
        input: MovementInput,
        camera: THREE.Camera
    ): THREE.Vector3 {
        if (!this.characterController || !this.collider || !this.physicsWorld?.world) {
            return new THREE.Vector3();
        }
        
        // Get movement direction based on input
        this.direction.z = Number(input.forward) - Number(input.backward);
        this.direction.x = Number(input.right) - Number(input.left);
        this.direction.normalize();

        // Calculate movement vector relative to camera direction
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        
        camera.getWorldDirection(forward);
        forward.y = 0; // Keep movement horizontal
        forward.normalize();
        
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        
        // Calculate current move speed (apply sprint multiplier if sprinting)
        const currentSpeed = input.sprint ? this.moveSpeed * this.sprintMultiplier : this.moveSpeed;
        
        // Calculate desired movement
        const movement = new THREE.Vector3();
        movement.addScaledVector(forward, this.direction.z * currentSpeed * delta);
        movement.addScaledVector(right, this.direction.x * currentSpeed * delta);
        
        // Apply gravity and jumping
        if (input.jump && this.canJump) {
            this.jumpVelocity = this.jumpForce;
        }
        
        this.jumpVelocity += this.gravity * delta;
        movement.y = this.jumpVelocity * delta;
        
        // Compute character controller movement
        this.characterController.computeColliderMovement(
            this.collider,
            movement
        );
        
        // Get corrected movement
        const correctedMovement = this.characterController.computedMovement();
        
        // Update collider position
        const translation = this.collider.translation();
        const newPos = new THREE.Vector3(
            translation.x + correctedMovement.x,
            translation.y + correctedMovement.y,
            translation.z + correctedMovement.z
        );
        this.collider.setTranslation(newPos);
        
        // Check if grounded for jumping
        this.canJump = this.characterController.computedGrounded();
        if (this.canJump) {
            this.jumpVelocity = 0;
        }
        
        // Return eye position (offset from capsule center)
        return new THREE.Vector3(newPos.x, newPos.y + this.eyeOffset, newPos.z);
    }
    
    /**
     * Update without physics (fallback)
     */
    private updateWithoutPhysics(
        delta: number,
        input: MovementInput,
        camera: THREE.Camera,
        currentPosition: THREE.Vector3
    ): THREE.Vector3 {
        // Apply damping to velocity
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(input.forward) - Number(input.backward);
        this.direction.x = Number(input.right) - Number(input.left);
        this.direction.normalize();

        // Calculate current move speed (apply sprint multiplier if sprinting)
        const currentSpeed = input.sprint ? this.moveSpeed * this.sprintMultiplier : this.moveSpeed;

        // Apply movement speed in m/s, scaled by delta time
        if (input.forward || input.backward) {
            this.velocity.z = this.direction.z * currentSpeed * delta;
        }
        if (input.left || input.right) {
            this.velocity.x = this.direction.x * currentSpeed * delta;
        }

        // Calculate movement based on camera direction
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        
        const movement = new THREE.Vector3();
        movement.addScaledVector(forward, -this.velocity.z);
        movement.addScaledVector(right, -this.velocity.x);
        
        return currentPosition.clone().add(movement);
    }

    /**
     * Get the physics collider
     */
    getCollider(): RAPIER.Collider | null {
        return this.collider;
    }

    /**
     * Check if player is grounded
     */
    isGrounded(): boolean {
        return this.canJump;
    }

    /**
     * Clean up physics resources
     */
    dispose() {
        // Note: Colliders and character controllers are freed when the physics world is freed
        this.physicsWorld = null;
        this.characterController = null;
        this.collider = null;
    }
}
