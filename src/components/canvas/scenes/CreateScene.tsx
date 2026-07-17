"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CreateScene() {
  const tunnelRef = useRef<THREE.Mesh>(null);
  const scannerRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const gemShardsRef = useRef<THREE.Group>(null);

  // We read the active wizard step from the document URL or custom triggers.
  // In Next.js, we can also pass a prop, but to make it automatically react, 
  // we'll hook it up in our main page component. Let's make this component listen
  // to a step parameter or read from standard DOM attributes.
  // For R3F, we can read the step value that is set by the state store. Let's use a selector
  // to read the step value from the DOM or standard state or a custom event.
  // Let's hook it up to the url hash or state. Let's read from the URL query or a global state.
  // We can write a custom store variable or use standard page logic. Let's assume we pass
  // a customized step prop or let the user click buttons which transitions the camera position.
  
  // We will configure a custom camera position for each step using GSAP.
  // Step 0: Upload -> camera Z=6, position= [0,0,6]
  // Step 1: Verify -> camera Z=0, position= [0,0,0]
  // Step 2: Tokenize -> camera Z=-6, position= [0,0,-6]
  // Step 3: List -> camera Z=-12, position= [0,0,-12]
  
  // Let's define the tunnel path points
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 20; i++) {
      p.push(new THREE.Vector3(0, 0, 10 - i * 4));
    }
    return p;
  }, []);

  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 64, 2.5, 12, false);
  }, [points]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate tunnel wireframe slightly
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z = time * 0.05;
    }

    // Step 1: Animate laser scanner plane
    if (scannerRef.current) {
      scannerRef.current.position.y = Math.sin(time * 3) * 1.0;
    }

    // Step 2: Rotate oracle rings
    if (ringsRef.current) {
      const children = ringsRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const mesh = children[i] as THREE.Mesh;
        mesh.rotation.x = time * (0.5 + i * 0.2);
        mesh.rotation.y = time * (0.3 + i * 0.1);
      }
    }

    // Step 3: Rotate gem
    if (gemRef.current) {
      gemRef.current.rotation.y = time * 0.6;
      gemRef.current.rotation.x = Math.sin(time) * 0.2;
    }

    // Shards orbiting the gem
    if (gemShardsRef.current) {
      gemShardsRef.current.rotation.y = -time * 0.8;
    }
  });

  return (
    <group>
      {/* 3D Wireframe Tunnel */}
      <mesh ref={tunnelRef} geometry={tubeGeometry}>
        <meshBasicMaterial 
          color="#D4AF37" 
          wireframe 
          transparent 
          opacity={0.1} 
        />
      </mesh>

      {/* Chamber 1: Upload Scanner (Z = 6) */}
      <group position={[0, 0, 6]}>
        <pointLight color="#D4AF37" intensity={1.5} distance={5} />
        {/* Floating document */}
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[1.2, 1.6]} />
          <meshPhysicalMaterial 
            color="#D4AF37" 
            transparent 
            opacity={0.4} 
            roughness={0.1}
            metalness={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Scanning laser frame */}
        <group ref={scannerRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.0, 0.05]} />
            <meshStandardMaterial 
              color="#00D26A" 
              emissive="#00D26A" 
              transparent 
              opacity={0.9} 
            />
          </mesh>
        </group>
      </group>

      {/* Chamber 2: Verify Oracle (Z = 0) */}
      <group position={[0, 0, 0]} ref={ringsRef}>
        <pointLight color="#7B61FF" intensity={1.5} distance={5} />
        {[...Array(3)].map((_, idx) => (
          <mesh key={idx}>
            <torusGeometry args={[1.2 + idx * 0.3, 0.02, 16, 64]} />
            <meshBasicMaterial 
              color="#7B61FF" 
              transparent 
              opacity={0.6 - idx * 0.15} 
              wireframe
            />
          </mesh>
        ))}
      </group>

      {/* Chamber 3: Tokenize Gem (Z = -6) */}
      <group position={[0, 0, -6]}>
        <pointLight color="#D4AF37" intensity={2.0} distance={6} />
        {/* Crystallizing core gem */}
        <mesh ref={gemRef}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshPhysicalMaterial
            color="#D4AF37"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.7}
            transmission={0.6}
            thickness={0.5}
            ior={1.6}
          />
        </mesh>
        
        {/* Shards splitting off */}
        <group ref={gemShardsRef}>
          {[...Array(6)].map((_, idx) => {
            const angle = (idx * Math.PI * 2) / 6;
            const x = Math.cos(angle) * 1.5;
            const y = Math.sin(angle) * 1.5;
            return (
              <mesh key={idx} position={[x, y, 0]}>
                <icosahedronGeometry args={[0.15, 0]} />
                <meshPhysicalMaterial
                  color="#7B61FF"
                  roughness={0.1}
                  metalness={0.8}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Chamber 4: Launch into Galaxy (Z = -12) */}
      <group position={[0, 0, -12]}>
        <pointLight color="#7B61FF" intensity={2.0} distance={5} />
        <points>
          <sphereGeometry args={[2, 16, 16]} />
          <pointsMaterial 
            size={0.03} 
            color="#D4AF37" 
            transparent 
            opacity={0.8} 
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}
