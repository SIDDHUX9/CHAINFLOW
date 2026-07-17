"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LandingSceneProps {
  isDetailView?: boolean;
}

export default function LandingScene({ isDetailView = false }: LandingSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const detailMeshRef = useRef<THREE.Mesh>(null);

  // Generate particle positions for the liquidity network
  const particleCount = 250;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Create a nice distribution (partially spherical, partially random neural net)
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const radius = THREE.MathUtils.randFloat(4, 16);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.15; // flatten significantly
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Color variation: Liquid gold to dark cosmic blue
      const r = i % 5 === 0 ? 0.482 : 0.831; // #7B61FF / #D4AF37
      const g = i % 5 === 0 ? 0.380 : 0.686;
      const b = i % 5 === 0 ? 1.000 : 0.216;

      col[i * 3] = r;
      col[i * 3 + 1] = g;
      col[i * 3 + 2] = b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate the entire network smoothly on GPU
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.03;
      groupRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;
    }

    // Detail view mesh floating animation
    if (detailMeshRef.current) {
      detailMeshRef.current.rotation.y = time * 0.3;
      detailMeshRef.current.position.y = Math.sin(time * 1.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {!isDetailView ? (
        <>
          {/* Main neural network point cloud */}
          <points ref={pointsRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[positions, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[colors, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.06}
              vertexColors
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>

          {/* Random pulsing line connections */}
          <gridHelper 
            args={[30, 30, "rgba(212, 175, 55, 0.15)", "rgba(26, 26, 62, 0.05)"]} 
            position={[0, -4, 0]} 
          />
        </>
      ) : (
        /* Floating Glass Invoice Document for detail page */
        <mesh ref={detailMeshRef} position={[0, 0, 0]}>
          <boxGeometry args={[3, 4.2, 0.1]} />
          <meshPhysicalMaterial
            color="#D4AF37"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.4}
            transmission={0.6}
            thickness={0.5}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#D4AF37"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  );
}
