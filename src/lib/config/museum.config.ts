/**
 * 3D Museum Configuration
 * All application-specific settings for the museum
 */

export const museumConfig = {
    camera: {
        // Camera field of view settings
        default_fov: 75,
        zoomed_fov: 30,
        zoom_speed: 130, // FOV change speed when zooming
        
        // Camera initial position
        initial_x: 0.0,
        initial_y: 1.6,
        initial_z: 5,
        eye_height: 1.6, // Height of camera from ground (meters)
        
        // View bobbing (head movement while walking/running)
        bobbing: {
            walk_speed: 8.0,
            sprint_speed: 11.0,
            walk_vertical_amplitude: 0.04,
            walk_horizontal_amplitude: 0.03,
            sprint_vertical_amplitude: 0.06,
            sprint_horizontal_amplitude: 0.045,
        },
    },

    player: {
        // Movement speeds
        move_speed: 2.5, // meters per second
        sprint_multiplier: 2.0,
        
        // Jumping
        jump_force: 5.0,
        
        // Player collision capsule
        radius: 0.3,
        height: 1.8,
    },

    physics: {
        // Physics world settings
        gravity_x: 0.0,
        gravity_y: -9.81,
        gravity_z: 0.0,
        
        // Character controller
        controller_offset: 0.01,
        autostep_max_height: 0.5,
        autostep_min_width: 0.2,
        snap_to_ground_distance: 0.5,
    },

    renderer: {
        // WebGL renderer settings
        antialias: true,
        power_preference: 'high-performance' as const,
        tone_mapping: 'ACESFilmic' as const,
        tone_mapping_exposure: 1.0,
        max_pixel_ratio: 2,
        
        // Shadow settings
        shadow_map_enabled: true,
        shadow_map_type: 'PCFSoft' as const,
    },

    lighting: {
        // Ambient light
        ambient_color: 0xffffff,
        ambient_intensity: 0,
        
        // Shadow properties for directional light
        shadows: {
            map_width: 2048,
            map_height: 2048,
            camera_near: 0.5,
            camera_far: 50.0,
            camera_left: -25.0,
            camera_right: 25.0,
            camera_top: 25.0,
            camera_bottom: -25.0,
        },
    },

    scene: {
        // Environment/Skybox
        skybox_texture_path: '/env/star.webp',
        skybox_radius: 500.0,
        skybox_segments_width: 60,
        skybox_segments_height: 40,
        skybox_rotation_x: -1.0,
        skybox_rotation_y: 0.5,
    },

    floor: {
        // Floor dimensions
        width: 50.0,
        height: 50.0,
        
        // Texture settings
        texture_repeat_x: 10.0,
        texture_repeat_y: 10.0,
        
        // Texture paths
        diffuse_map: '/textures/floor/floor-diff.jpg',
        normal_map: '/textures/floor/floor-nor.jpg',
        arm_map: '/textures/floor/floor-arm.jpg', // AO, Roughness, Metalness
    },

    gallery: {
        // Gallery layout
        stand_spacing: 5.0, // Distance between stands in same row
        stands_per_row: 5,
        row_spacing: 4, // Distance between rows
        start_position_x: -10.0,
        start_position_y: 0.0,
        start_position_z: 0.0,
        
        // Painting list
        paintings: [
            '1.webp',
            '2.webp',
            '3.webp',
            '4.webp',
            '5.webp',
            '6.webp',
            '7.webp',
            '8.webp',
            '9.webp',
            '10.webp',
            '11.webp',
            '12.webp',
            '13.webp',
            '14.webp',
            '15.webp',
        ],
        
        // Paint texture
        paint_normal_map: '/textures/paintings/paint.png',
        paint_normal_repeat_x: 6.0,
        paint_normal_repeat_y: 9.0,
    },

    statues: {
        // Statue base dimensions and material
        base_width: 3.0,
        base_depth: 3.0,
        base_height: 0.35,
        base_color: 0x777777,
        base_roughness: 0.8,
        base_metalness: 0.1,

        // Contact shadow under each base
        contact_shadow_radius: 0.3,
        contact_shadow_opacity: 0.23,
        contact_shadow_color: 0x000000,

        // Layout
        stand_spacing: 6.0,
        stands_per_row: 3,
        row_spacing: 6.0,
        start_position_x: 0.0,
        start_position_y: 0.0,
        start_position_z: 0.0,

        // Statue models to place (from /static/models)
        models: [
            {
                file: 'horse-dragon.glb',
                scale: 1.0,
                y_offset: 0,
            },
            {
                file: 'tepsichore.glb',
                scale: 1.0,
                y_offset: 0,
            },
            {
                file: 'bear.glb',
                scale: 0.2,
                y_offset: -0.5,
            },
            {
                file: 'angel.glb',
                scale: 0.2,
                y_offset: -0.03,
            },
            {
                file: 'poseidon.glb',
                scale: 1,
                y_offset: 0,
            }
        ],
    },

    stand: {
        // Backing board
        backing_width: 2.0,
        backing_height: 3.0,
        backing_depth: 0.1,
        backing_color: 0x8b7355, // Light brown
        backing_roughness: 0.9,
        backing_metalness: 0.0,
        backing_ground_offset: 0,
        backing_position_z: -0.7,
        
        // Painting/Canvas
        painting_default_width: 1.6,
        painting_depth: 0.05,
        painting_center_height: 1.6,
        painting_z_offset: -0.65,
        painting_color: 0xf5f5f5, // Off-white
        painting_roughness: 0.6,
        painting_metalness: 0.0,
    },

    // Picture light fixture dimensions
    picture_light: {
        light_bar_width_ratio: 0.8,
        light_bar_radius: 0.017,
        light_bar_segments: 64,
        light_pitch: Math.PI / 10,
        vertical_offset: 0.11,
        bar_forward_offset: 0.24,
        light_inset: 0.01,
        base_width_ratio: 0.18,
        base_height: 0.085,
        base_depth: 0.045,
        base_vertical_offset: 0.035,
        arm_spacing_ratio: 0.3,
        arm_radius: 0.006,
        arm_curve_height: 0.065,
        arm_curve_forward_offset: 0.12,
        arm_curve_segments: 40,
        arm_base_vertical_offset: 0.004,
        arm_base_depth_offset: 0.002,
        arm_inner_spacing_ratio: 0.62,
        arm_start_back_offset: 0.005,
        arm_end_forward_offset: 0.001,
        arm_joint_scale: 1.25,
        diffuser_side_inset: 0.1,
        diffuser_arc_angle: Math.PI * 0.72,
        diffuser_arc_segments: 14,
        diffuser_length_segments: 18,
        diffuser_surface_offset: 0.0004,
        
        // Metal material
        metal_color: 0xffd700,
        metal_roughness: 0.35,
        metal_metalness: 0.85,
        metal_env_map_intensity: 1.2,
        
        // Diffuser material
        diffuser_color: 0xffffff,
        diffuser_emissive: 0xffe4b6,
        diffuser_emissive_intensity: 3.5,
        diffuser_roughness: 0.25,
        diffuser_metalness: 0.0,
    },

    plaque: {
        // Plaque dimensions
        width: 0.35,
        height: 0.12,
        depth: 0.005,
        
        // Plaque material
        background_color: 0xffffff, // White
        roughness: 0.6,
        metalness: 0.05,
        
        // Canvas settings for text rendering
        canvas_width: 1024,
        canvas_height: 384,
        canvas_background: '#ffffff',
        
        // Text styling
        text_color: '#000000', // Black
        font_family: '"Libre Baskerville", serif',
        title_font_size: 52,
        artist_font_size: 36,
        
        // Position relative to painting
        gap_below_painting: 0.05,
    },

    controls: {
        // Keyboard bindings (informational - actual bindings in input.ts)
        forward_keys: ['KeyW', 'ArrowUp'],
        backward_keys: ['KeyS', 'ArrowDown'],
        left_keys: ['KeyA', 'ArrowLeft'],
        right_keys: ['KeyD', 'ArrowRight'],
        jump_key: 'Space',
        sprint_keys: ['ShiftLeft', 'ShiftRight'],
        zoom_key: 'KeyC',
    },
} as const;

export type MuseumConfig = typeof museumConfig;
