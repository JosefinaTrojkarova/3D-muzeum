export type RapierModule = typeof import('@dimforge/rapier3d');
export type RapierWorld = import('@dimforge/rapier3d').World;
export type RapierCollider = import('@dimforge/rapier3d').Collider;
export type RapierRayColliderHit = import('@dimforge/rapier3d').RayColliderHit;
export type RapierKinematicCharacterController = import('@dimforge/rapier3d').KinematicCharacterController;

let rapierPromise: Promise<RapierModule> | null = null;

function normalizeModule(mod: unknown): RapierModule {
    if (mod && typeof mod === 'object' && 'default' in mod) {
        return (mod as { default: RapierModule }).default;
    }
    return mod as RapierModule;
}

export async function loadRapier(): Promise<RapierModule> {
    if (!rapierPromise) {
        rapierPromise = import('@dimforge/rapier3d').then(normalizeModule);
    }
    return rapierPromise;
}
