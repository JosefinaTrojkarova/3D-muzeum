import * as THREE from 'three';
import { getConfig } from '../config';

interface PictureLightParams {
    paintingWidth: number;
    paintingHeight: number;
    paintingCenterHeight: number;
}

export function createPictureLight(params: PictureLightParams): THREE.Group {
    const { paintingWidth, paintingHeight, paintingCenterHeight } = params;
    const config = getConfig().picture_light;
    const standConfig = getConfig().stand;
    
    const group = new THREE.Group();
    
    const lightBarLength = paintingWidth * config.light_bar_width_ratio;
    const barHalfLength = lightBarLength / 2;
    const barY = paintingCenterHeight + paintingHeight / 2 + config.vertical_offset;
    const wallZ = standConfig.painting_z_offset;
    const barZ = wallZ + config.bar_forward_offset;
    const lightZPos = barZ - config.light_inset;
    const barRotationEuler = new THREE.Euler(config.light_pitch, 0, 0);
    const armAttachmentLocal = new THREE.Vector3(0, 0, -config.light_bar_radius);
    armAttachmentLocal.applyEuler(barRotationEuler);
    const armEndY = barY + armAttachmentLocal.y;
    const armEndZ = barZ + armAttachmentLocal.z;
    
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: config.metal_color,
        roughness: config.metal_roughness,
        metalness: config.metal_metalness
    });
    metalMaterial.envMapIntensity = config.metal_env_map_intensity;
    
    const armSpacing = lightBarLength * config.arm_spacing_ratio;
    const innerOffsetRatio = THREE.MathUtils.clamp(config.arm_inner_spacing_ratio, 0.05, 0.95);
    const outerArmOffset = armSpacing / 2;
    const innerArmOffset = outerArmOffset * innerOffsetRatio;
    const baseWidth = Math.max(
        paintingWidth * config.base_width_ratio,
        armSpacing + config.arm_radius * 6
    );
    const baseGeometry = new THREE.BoxGeometry(baseWidth, config.base_height, config.base_depth);
    const baseY = barY - config.base_vertical_offset;
    const baseZ = wallZ + config.base_depth / 2;
    const base = new THREE.Mesh(baseGeometry, metalMaterial);
    base.position.set(0, baseY, baseZ);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const baseTopY = baseY + config.base_height / 2 - config.arm_base_vertical_offset;
    const baseFrontZ = baseZ + config.base_depth / 2 - config.arm_base_depth_offset;
    const armRotationSegments = 16;

    const jointGeometry = new THREE.SphereGeometry(config.arm_radius * config.arm_joint_scale, 16, 12);
    // Build four identical support arms (two per side) using the refined curvature.
    const armXPositions = [-outerArmOffset, -innerArmOffset, innerArmOffset, outerArmOffset];
    const startZ = baseFrontZ - config.arm_start_back_offset;
    const endZ = armEndZ + config.arm_end_forward_offset;
    const controlZ = wallZ + config.arm_curve_forward_offset;
    armXPositions.forEach((xPos) => {
        const armCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(xPos, baseTopY, startZ),
            new THREE.Vector3(
                xPos,
                baseTopY + config.arm_curve_height,
                controlZ
            ),
            new THREE.Vector3(xPos, armEndY, endZ)
        );
        const armMesh = new THREE.Mesh(
            new THREE.TubeGeometry(
                armCurve,
                config.arm_curve_segments,
                config.arm_radius,
                armRotationSegments,
                false
            ),
            metalMaterial
        );
        armMesh.castShadow = true;
        group.add(armMesh);

        const baseJoint = new THREE.Mesh(jointGeometry, metalMaterial);
        baseJoint.position.set(xPos, baseTopY, baseFrontZ);
        group.add(baseJoint);

        const topJoint = new THREE.Mesh(jointGeometry, metalMaterial);
        topJoint.position.set(xPos, armEndY, armEndZ);
        group.add(topJoint);
    });

    // Group keeps the bar and diffuser aligned while tilting the fixture downward.
    const lightAssembly = new THREE.Group();
    lightAssembly.position.set(0, barY, barZ);
    lightAssembly.rotation.x = config.light_pitch;

    const horizontalRotation = new THREE.Euler(0, 0, Math.PI / 2);
    const lightBarGeometry = new THREE.CylinderGeometry(
        config.light_bar_radius,
        config.light_bar_radius,
        lightBarLength,
        config.light_bar_segments,
        1,
        false
    );
    const lightBar = new THREE.Mesh(lightBarGeometry, metalMaterial);
    lightBar.rotation.copy(horizontalRotation);
    lightBar.castShadow = true;
    lightAssembly.add(lightBar);

    const diffuserMaterial = new THREE.MeshStandardMaterial({
        color: config.diffuser_color,
        emissive: config.diffuser_emissive,
        emissiveIntensity: config.diffuser_emissive_intensity,
        roughness: config.diffuser_roughness,
        metalness: config.diffuser_metalness,
        side: THREE.DoubleSide
    });
    const diffuserLength = Math.max(lightBarLength - config.diffuser_side_inset * 2, 0.02);
    const halfDiffuserLength = diffuserLength / 2;
    const radialSegments = Math.max(2, Math.floor(config.diffuser_arc_segments));
    const lengthSegments = Math.max(1, Math.floor(config.diffuser_length_segments));
    const startAngle = Math.PI - config.diffuser_arc_angle / 2;
    const endAngle = Math.PI + config.diffuser_arc_angle / 2;
    const surfaceRadius = config.light_bar_radius + config.diffuser_surface_offset;
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    for (let i = 0; i <= lengthSegments; i += 1) {
        const tLen = i / lengthSegments;
        const x = THREE.MathUtils.lerp(-halfDiffuserLength, halfDiffuserLength, tLen);
        for (let j = 0; j <= radialSegments; j += 1) {
            const tArc = j / radialSegments;
            const angle = THREE.MathUtils.lerp(startAngle, endAngle, tArc);
            const y = surfaceRadius * Math.cos(angle);
            const z = surfaceRadius * Math.sin(angle);
            positions.push(x, y, z);
            const normal = new THREE.Vector3(0, y, z).normalize();
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(tLen, tArc);
        }
    }
    const indices: number[] = [];
    const stride = radialSegments + 1;
    for (let i = 0; i < lengthSegments; i += 1) {
        for (let j = 0; j < radialSegments; j += 1) {
            const a = i * stride + j;
            const b = (i + 1) * stride + j;
            const c = (i + 1) * stride + j + 1;
            const d = i * stride + j + 1;
            indices.push(a, b, d);
            indices.push(b, c, d);
        }
    }

    // Curved ribbon geometry hugs the underside of the bar without intersecting it.
    const diffuserGeometry = new THREE.BufferGeometry();
    diffuserGeometry.setIndex(indices);
    diffuserGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    diffuserGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    diffuserGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    const diffuser = new THREE.Mesh(diffuserGeometry, diffuserMaterial);
    diffuser.castShadow = false;
    diffuser.receiveShadow = false;
    lightAssembly.add(diffuser);

    group.add(lightAssembly);

    
    return group;
}
