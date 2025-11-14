/**
 * Movement input state
 */
export interface MovementInput {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    zoom: boolean;
    sprint: boolean;
}

/**
 * Keyboard input handler for player movement
 */
export class InputHandler {
    private movement: MovementInput = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        zoom: false,
        sprint: false
    };

    private onKeyDown: (event: KeyboardEvent) => void;
    private onKeyUp: (event: KeyboardEvent) => void;

    constructor() {
        this.onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.movement.forward = true;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.movement.backward = true;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.movement.left = true;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.movement.right = true;
                    break;
                case 'Space':
                    this.movement.jump = true;
                    break;
                case 'KeyC':
                    this.movement.zoom = true;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.movement.sprint = true;
                    break;
            }
        };

        this.onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.movement.forward = false;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.movement.backward = false;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.movement.left = false;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.movement.right = false;
                    break;
                case 'Space':
                    this.movement.jump = false;
                    break;
                case 'KeyC':
                    this.movement.zoom = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.movement.sprint = false;
                    break;
            }
        };

        this.setupKeyboardControls();
    }

    private setupKeyboardControls() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    /**
     * Get current movement input state
     */
    getMovementInput(): Readonly<MovementInput> {
        return this.movement;
    }

    /**
     * Reset jump input (useful for one-time jump actions)
     */
    resetJump() {
        this.movement.jump = false;
    }

    /**
     * Clean up event listeners
     */
    dispose() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    }
}
