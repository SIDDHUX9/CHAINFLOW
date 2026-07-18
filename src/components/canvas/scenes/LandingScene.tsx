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

  // 45 x 45 grid of ledger particles = 2025 nodes
  const gridWidth = 45;
  const gridDepth = 45;
  const particleCount = gridWidth * gridDepth;
  
  // Build initial X, Y, Z positions and random colors
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    let idx = 0;
    const spacing = 1.0;
    const offsetX = (gridWidth - 1) * spacing * 0.5;
    const offsetZ = (gridDepth - 1) * spacing * 0.5;

    for (let x = 0; x < gridWidth; x++) {
      for (let z = 0; z < gridDepth; z++) {
        // Grid layout in XZ plane
        pos[idx * 3] = x * spacing - offsetX;
        pos[idx * 3 + 1] = 0; // Will be animated in useFrame
        pos[idx * 3 + 2] = z * spacing - offsetZ;

        // Color gradient: Gold in the center, transitioning to deep indigo/purple at the edges
        const xDist = (x - gridWidth / 2) / (gridWidth / 2);
        const zDist = (z - gridDepth / 2) / (gridDepth / 2);
        const centerDist = Math.min(1.0, Math.sqrt(xDist * xDist + zDist * zDist));
        
        // Gold: #D4AF37 (212, 175, 55) -> Purple: #7B61FF (123, 97, 255)
        const r = THREE.MathUtils.lerp(0.831, 0.482, centerDist);
        const g = THREE.MathUtils.lerp(0.686, 0.380, centerDist);
        const b = THREE.MathUtils.lerp(0.216, 1.000, centerDist);

        col[idx * 3] = r;
        col[idx * 3 + 1] = g;
        col[idx * 3 + 2] = b;
        
        idx++;
      }
    }
    return [pos, col];
  }, [particleCount, gridWidth, gridDepth]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate the entire network smoothly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.015;
      groupRef.current.rotation.x = Math.sin(time * 0.008) * 0.03;
    }

    // Animate the grid wave on CPU
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const array = posAttr.array as Float32Array;
      
      let idx = 0;
      for (let x = 0; x < gridWidth; x++) {
        for (let z = 0; z < gridDepth; z++) {
          const posX = array[idx * 3];
          const posZ = array[idx * 3 + 2];
          
          // Ledger Wave equation combining concentric waves and longitudinal ripples
          const dist = Math.sqrt(posX * posX + posZ * posZ);
          const wave1 = Math.sin(dist * 0.35 - time * 1.5) * 0.6;
          const wave2 = Math.cos(posX * 0.15 + time) * 0.4;
          const wave3 = Math.sin(posZ * 0.2 + time * 0.7) * 0.3;
          
          array[idx * 3 + 1] = wave1 + wave2 + wave3 - 3.5; // lower the wave field slightly below layout height
          idx++;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Detail view mesh floating animation
    if (detailMeshRef.current) {
      detailMeshRef.current.rotation.y = time * 0.2;
      detailMeshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      detailMeshRef.current.position.y = Math.sin(time * 1.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {!isDetailView ? (
        <>
          {/* Wave of digital ledger nodes */}
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
              size={0.085}
              vertexColors
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>

          {/* Glowing node clusters (three visual anchor meshes in space) */}
          <group position={[0, -2, 0]}>
            <mesh position={[-6, 1, -6]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} wireframe />
            </mesh>
            <mesh position={[6, -1, 6]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshBasicMaterial color="#7B61FF" transparent opacity={0.3} wireframe />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color="#D4AF37" transparent opacity={0.4} />
            </mesh>
          </group>

          {/* Interactive grid mesh boundary lines */}
          <gridHelper 
            args={[50, 25, "rgba(212, 175, 55, 0.08)", "rgba(123, 97, 255, 0.03)"]} 
            position={[0, -5, 0]} 
          />
        </>
      ) : (
        /* Floating Glass Invoice Document for detail page */
        <mesh ref={detailMeshRef} position={[0, 0, 0]}>
          <boxGeometry args={[3, 4.2, 0.05]} />
          <meshPhysicalMaterial
            color="#D4AF37"
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.3}
            transmission={0.7}
            thickness={0.4}
            ior={1.6}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            emissive="#D4AF37"
            emissiveIntensity={0.15}
          />
        </mesh>
      )}
    </group>
  );
}
