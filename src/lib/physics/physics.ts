import RAPIER from '@dimforge/rapier3d';
import * as THREE from 'three';
import { getConfig } from '../config';

export class PhysicsWorld {
    world: RAPIER.World | null = null;
    private initialized: boolean = false;

    async init() {
        if (this.initialized) return;
        
        const physicsConfig = getConfig().physics;
        
        // Create physics world with gravity
        const gravity = {
            x: physicsConfig.gravity_x,
            y: physicsConfig.gravity_y,
            z: physicsConfig.gravity_z
        };
        this.world = new RAPIER.World(gravity);
        
        this.initialized = true;
    }

    /**
     * Step the physics simulation
     */
    step() {
        if (!this.world) return;
        this.world.step();
    }

    /**
     * Create a kinematic character controller
     */
    createCharacterController(offset: number = 0.01): RAPIER.KinematicCharacterController | null {
        if (!this.world) return null;
        
        return this.world.createCharacterController(offset);
    }

    /**
     * Create a capsule collider for the player
     */
    createPlayerCollider(position: THREE.Vector3, radius: number = 0.3, height: number = 1.6): RAPIER.Collider | null {
        if (!this.world) return null;
        
        // Create a capsule shape (radius, half-height of cylinder part)
        const halfHeight = (height - 2 * radius) / 2;
        const shape = RAPIER.ColliderDesc.capsule(halfHeight, radius)
            .setTranslation(position.x, position.y, position.z);
        
        return this.world.createCollider(shape);
    }

    /**
     * Create a static box collider
     */
    createBoxCollider(
        position: THREE.Vector3,
        size: THREE.Vector3,
        rotation?: THREE.Quaternion
    ): RAPIER.Collider | null {
        if (!this.world) return null;
        
        const halfExtents = {
            x: size.x / 2,
            y: size.y / 2,
            z: size.z / 2
        };
        
        const desc = RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z)
            .setTranslation(position.x, position.y, position.z);
        
        if (rotation) {
            desc.setRotation(rotation);
        }
        
        return this.world.createCollider(desc);
    }

    /**
     * Create a static plane collider (for floors)
     */
    createPlaneCollider(height: number = 0): RAPIER.Collider | null {
        if (!this.world) return null;
        
        // Create a large box to simulate an infinite plane
        const desc = RAPIER.ColliderDesc.cuboid(100, 0.1, 100)
            .setTranslation(0, height - 0.1, 0);
        
        return this.world.createCollider(desc);
    }

    /**
     * Cast a ray and return the first hit
     */
    castRay(
        origin: THREE.Vector3,
        direction: THREE.Vector3,
        maxToi: number = 100
    ): RAPIER.RayColliderHit | null {
        if (!this.world) return null;
        
        const ray = new RAPIER.Ray(origin, direction);
        const hit = this.world.castRay(ray, maxToi, true);
        
        return hit;
    }

    /**
     * Check if world is initialized
     */
    isInitialized(): boolean {
        return this.initialized && this.world !== null;
    }

    /**
     * Dispose of the physics world and free resources
     */
    dispose() {
        if (this.world) {
            this.world.free();
            this.world = null;
        }
        this.initialized = false;
    }
}
