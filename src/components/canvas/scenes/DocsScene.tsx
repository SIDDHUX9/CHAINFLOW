"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DocsScene() {
  const crystalRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate main crystal
    if (crystalRef.current) {
      crystalRef.current.rotation.y = time * 0.18;
      crystalRef.current.rotation.x = Math.sin(time * 0.4) * 0.15;
      
      // Floating breath effect
      crystalRef.current.position.y = Math.sin(time * 1.2) * 0.1;
    }

    // Outer glow pulse
    if (glowRef.current) {
      glowRef.current.rotation.y = -time * 0.08;
      const pulse = 1.1 + Math.sin(time * 1.5) * 0.04;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }

    // Orbiting document ring
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.1;
      ringRef.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.2) * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Knowledge Crystal (Refractive Glass Polyhedron) */}
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[1.8, 0]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.55}
          transmission={0.8}
          thickness={1.2}
          ior={1.75}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          emissive="#7B61FF"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Crystal Wireframe Core */}
      <mesh ref={glowRef}>
        <octahedronGeometry args={[1.82, 0]} />
        <meshBasicMaterial
          color="#D4AF37"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Dynamic Data Ring with orbiting documentation nodes */}
      <group ref={ringRef}>
        {/* Orbital Path */}
        <mesh>
          <torusGeometry args={[3.2, 0.008, 8, 64]} />
          <meshBasicMaterial color="#7B61FF" transparent opacity={0.15} />
        </mesh>

        {/* Orbit nodes */}
        {[...Array(4)].map((_, idx) => {
          const angle = (idx * Math.PI * 2) / 4;
          const x = Math.cos(angle) * 3.2;
          const y = Math.sin(angle) * 3.2;
          return (
            <group key={idx} position={[x, y, 0]}>
              {/* Node Sphere */}
              <mesh>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshPhysicalMaterial 
                  color="#D4AF37" 
                  emissive="#D4AF37" 
                  emissiveIntensity={0.5} 
                />
              </mesh>
              {/* Outer halo */}
              <mesh scale={[1.5, 1.5, 1.5]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshBasicMaterial color="#7B61FF" transparent opacity={0.3} wireframe />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
