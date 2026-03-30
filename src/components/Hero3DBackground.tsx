// @ts-nocheck
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarField(props: any) {
  const pointsRef = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  
  // Generate random points in a spherical volume
  const sphere = useMemo(() => {
    const numPoints = 5000;
    const points = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
        // Random point within radius 1.5
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 1.5;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        
        points[i * 3] = r * sinPhi * cosTheta;
        points[i * 3 + 1] = r * sinPhi * sinTheta;
        points[i * 3 + 2] = r * cosPhi;
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    // Slower continuous motion for the stars
    if (pointsRef.current) {
        pointsRef.current.rotation.x -= delta / 30;
        pointsRef.current.rotation.y -= delta / 45;
    }

    // Interactive gentle tilt based on mouse position
    if (groupRef.current) {
        // Map mouse -1 -> 1 to a slight tilt angle (reduced for subtler motion)
        const targetX = (state.pointer.y * Math.PI) * 0.05;
        const targetY = (state.pointer.x * Math.PI) * 0.05;
        
        // Smoothly ease the current rotation towards the target (reduced easing speed)
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.8 * delta;
        groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.8 * delta;

        // Interactive depth: pull stars closer when mouse is near the center
        const dist = Math.sqrt(state.pointer.x ** 2 + state.pointer.y ** 2);
        const targetScale = 1.0 + Math.max(0, 1 - dist) * 0.15; // scales up to 1.15x at center
        
        // Use lerp to smoothly animate the scale
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 2 * delta);
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ff6b35"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
      {/* Adding a secondary layer with different color and size */}
      <Points positions={sphere} stride={3} frustumCulled={false} {...props}>
          <PointMaterial
            transparent
            color="#00ADB5"
            size={0.0015}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.4}
          />
      </Points>
    </group>
  );
}

export function Hero3DBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-50 dark:opacity-80 transition-opacity duration-700">
      <Canvas eventSource={document.body} camera={{ position: [0, 0, 1] }}>
        <StarField />
      </Canvas>
    </div>
  );
}
