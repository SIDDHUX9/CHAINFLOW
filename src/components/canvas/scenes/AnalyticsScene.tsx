"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AnalyticsScene() {
  const globeGroupRef = useRef<THREE.Group>(null);
  const terrainRef = useRef<THREE.Mesh>(null);
  const schoolRef = useRef<THREE.Group>(null);

  // Generate capital flow beams (Quadratic Beziers)
  const beams = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      // Choose random start and end points on a sphere of radius 3
      const vStart = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 6
      ).normalize().multiplyScalar(3);

      const vEnd = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 6
      ).normalize().multiplyScalar(3);

      const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
      const dist = vStart.distanceTo(vEnd);
      mid.normalize().multiplyScalar(3 + dist * 0.4); // lift high in arc

      const curve = new THREE.QuadraticBezierCurve3(vStart, mid, vEnd);
      const points = curve.getPoints(30);

      arr.push({
        geometry: new THREE.BufferGeometry().setFromPoints(points),
        speed: 1 + Math.random() * 2,
        phase: Math.random() * 10
      });
    }
    return arr;
  }, []);

  // Generate fish coordinates (simulating invoices in ocean of liquidity)
  const fishCount = 15;
  const fishData = useMemo(() => {
    return Array.from({ length: fishCount }).map((_, idx) => ({
      y: -2.5 - Math.random() * 2.5, // depth
      radius: 4 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * 100,
      scale: 0.15 + Math.random() * 0.15,
      color: idx % 3 === 0 ? "#7B61FF" : "#D4AF37"
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate globe
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = time * 0.05;
    }

    // Animate displaced risk terrain mesh
    if (terrainRef.current) {
      const positionAttr = terrainRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < positionAttr.count; i++) {
        const x = positionAttr.getX(i);
        const y = positionAttr.getY(i);
        // Build undulating waves on the grid using simple sin/cos waves
        const z = Math.sin(x * 0.5 + time) * 0.15 + Math.cos(y * 0.5 + time) * 0.15;
        positionAttr.setZ(i, z);
      }
      positionAttr.needsUpdate = true;
    }

    // Animate swimming fish
    if (schoolRef.current) {
      const children = schoolRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const mesh = children[i] as THREE.Group;
        const fish = fishData[i];
        if (!fish) continue;
        const angle = time * fish.speed + fish.phase;
        
        // Circular path orbit
        const x = Math.cos(angle) * fish.radius;
        const z = Math.sin(angle) * fish.radius;
        
        mesh.position.set(x, fish.y, z);
        mesh.rotation.y = -angle + Math.PI / 2; // face swimming direction
        
        // Tail wag animation
        const tail = mesh.children[0] as THREE.Mesh;
        if (tail) {
          tail.rotation.y = Math.sin(time * 8 + fish.phase) * 0.35;
        }
      }
    }
  });

  return (
    <group>
      {/* Globe & Flows (Z = 0, Y = 2) */}
      <group ref={globeGroupRef} position={[0, 2.2, 0]}>
        <mesh>
          <sphereGeometry args={[3, 32, 16]} />
          <meshBasicMaterial 
            color="#7B61FF" 
            wireframe 
            transparent 
            opacity={0.06} 
          />
        </mesh>

        {beams.map((beam, idx) => (
          <line key={idx}>
            <bufferGeometry attach="geometry" {...beam.geometry} />
            <lineBasicMaterial 
              attach="material" 
              color="#D4AF37" 
              transparent 
              opacity={0.4} 
            />
          </line>
        ))}
      </group>

      {/* 3D Ocean Fish (Z = 0, Y = depth) */}
      <group ref={schoolRef}>
        {fishData.map((fish, idx) => (
          <group key={idx}>
            {/* Fish Body */}
            <mesh scale={[fish.scale, fish.scale * 0.5, fish.scale * 2.0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial
                color={fish.color}
                roughness={0.1}
                metalness={0.8}
                transparent
                opacity={0.75}
              />
            </mesh>
            {/* Fish Tail */}
            <mesh position={[0, 0, -fish.scale * 1.2]} scale={[fish.scale * 0.2, fish.scale * 0.8, fish.scale * 0.8]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={fish.color} transparent opacity={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Risk Terrain Heatmap Grid (Floor at Y = -4) */}
      <mesh 
        ref={terrainRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -4.5, 0]}
      >
        <planeGeometry args={[20, 20, 24, 24]} />
        <meshPhysicalMaterial
          color="#0A0A0F"
          roughness={0.7}
          metalness={0.4}
          clearcoat={0.2}
          wireframe
          emissive="#7B61FF"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}
