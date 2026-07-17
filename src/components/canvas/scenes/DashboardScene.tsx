"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFlowStore } from "@/store/useFlowStore";

interface DashboardSceneProps {
  isInvestorView?: boolean;
}

export default function DashboardScene({ isInvestorView = false }: DashboardSceneProps) {
  const { invoices } = useFlowStore();
  const groupRef = useRef<THREE.Group>(null);
  const investorBustRef = useRef<THREE.Group>(null);

  // Map invoices into planet data
  const planets = useMemo(() => {
    return invoices.map((inv, idx) => {
      // Orbit radius
      const radius = 6 + idx * 2.2;
      // Orbit speed (inverse of radius)
      const speed = 0.5 / radius;
      // Scale (invoice amount relative size)
      const scale = Math.max(0.3, Math.min(1.2, (inv.amount / 90000) * 1.2));
      
      // Color matching invoice status
      let color = "#00D26A"; // active
      if (inv.status === "pending") color = "#FFB300";
      if (inv.status === "disputed") color = "#FF4757";

      // Investors moons count
      const moonCount = inv.investors.length;

      return {
        id: inv.id,
        radius,
        speed,
        scale,
        color,
        moonCount
      };
    });
  }, [invoices]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate solar system slightly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.02;
    }

    // Animate investor profile hologram if active
    if (investorBustRef.current) {
      const children = investorBustRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const mesh = children[i] as THREE.Mesh;
        // Alternate rotation directions
        mesh.rotation.y = time * (0.2 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
        mesh.rotation.z = Math.sin(time * 0.5) * 0.1;
      }
    }
  });

  if (isInvestorView) {
    // Holographic investor representation (Complex abstract rings and core)
    return (
      <group ref={investorBustRef} position={[0, 0, 0]}>
        {/* Concentric glowing rings */}
        {[...Array(4)].map((_, idx) => (
          <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5 + idx * 0.5, 0.02, 16, 100]} />
            <meshBasicMaterial 
              color={idx % 2 === 0 ? "#D4AF37" : "#7B61FF"} 
              transparent 
              opacity={0.6 - idx * 0.12} 
              wireframe
            />
          </mesh>
        ))}

        {/* Central glowing crystalline bust core */}
        <mesh>
          <octahedronGeometry args={[1.0, 1]} />
          <meshPhysicalMaterial
            color="#7B61FF"
            emissive="#D4AF37"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.8}
            wireframe
          />
        </mesh>
        
        {/* Particle envelope */}
        <points>
          <dodecahedronGeometry args={[3, 2]} />
          <pointsMaterial size={0.03} color="#D4AF37" transparent opacity={0.4} />
        </points>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Central Star (Liquidity Pool) */}
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      
      {/* Subtly glowing liquid sun corona */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting planets (Invoices) */}
      {planets.map((planet) => (
        <group key={planet.id}>
          {/* Orbit line ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[planet.radius, 0.005, 8, 128]} />
            <meshBasicMaterial color="rgba(212, 175, 55, 0.15)" transparent />
          </mesh>

          {/* Orbit dynamic positioning */}
          <PlanetComponent planet={planet} />
        </group>
      ))}
    </group>
  );
}

interface PlanetData {
  id: string;
  radius: number;
  speed: number;
  scale: number;
  color: string;
  moonCount: number;
}

// Separate component to handle per-frame orbit of each planet
function PlanetComponent({ planet }: { planet: PlanetData }) {
  const planetRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = time * planet.speed + (planet.radius * 12.3); // add pseudo-random phase offset
    
    if (planetRef.current) {
      // Calculate orbit position
      const x = Math.cos(angle) * planet.radius;
      const z = Math.sin(angle) * planet.radius;
      planetRef.current.position.set(x, 0, z);
      
      // Self rotation
      planetRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group ref={planetRef}>
      {/* Planet Spheres */}
      <mesh>
        <sphereGeometry args={[planet.scale * 0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={planet.color}
          roughness={0.2}
          metalness={0.7}
          emissive={planet.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Halo for disputed scanline feel */}
      {planet.color === "#FF4757" && (
        <mesh scale={1.25}>
          <sphereGeometry args={[planet.scale * 0.5, 16, 16]} />
          <meshBasicMaterial color="#FF4757" transparent opacity={0.3} wireframe />
        </mesh>
      )}

      {/* Orbiting moons (Investors) */}
      {[...Array(planet.moonCount)].map((_, mIdx) => (
        <MoonComponent key={mIdx} index={mIdx} total={planet.moonCount} parentScale={planet.scale} />
      ))}
    </group>
  );
}

function MoonComponent({ index, total, parentScale }: { index: number; total: number; parentScale: number }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const moonOrbitRadius = parentScale * 0.5 + 0.4;
  const speed = 2.0;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = time * speed + (index * ((Math.PI * 2) / total));
    
    if (moonRef.current) {
      const x = Math.cos(angle) * moonOrbitRadius;
      const z = Math.sin(angle) * moonOrbitRadius;
      // Slant the orbits slightly for visual depth
      const y = Math.sin(angle) * 0.15;
      moonRef.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color="#D4AF37" />
    </mesh>
  );
}
