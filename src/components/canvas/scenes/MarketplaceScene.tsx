"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFlowStore } from "@/store/useFlowStore";
import { OrbitControls } from "@react-three/drei";

export default function MarketplaceScene() {
  const { invoices } = useFlowStore();
  const globeRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Generate geographic pins and arc flows based on active invoices
  const regions = useMemo(() => {
    return invoices.map((inv) => ({
      name: inv.country,
      lat: inv.lat,
      lng: inv.lng,
      color: inv.status === "active" ? "#D4AF37" : "#7B61FF",
      amount: inv.amount
    }));
  }, [invoices]);

  // Translate lat/long coordinates into 3D sphere points (sphere radius = 4)
  const convertLatLngToVector3 = (lat: number, lng: number, radius: number = 4) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.sin(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    return new THREE.Vector3(x, y, z);
  };

  const arcs = useMemo(() => {
    const radius = 4;
    // Map arcs between sequentially listed regions to represent active flow lines
    const capitalFlows = [];
    for (let i = 0; i < regions.length; i++) {
      const fromRegion = regions[i];
      const toRegion = regions[(i + 1) % regions.length];
      
      const start = convertLatLngToVector3(fromRegion.lat, fromRegion.lng, radius);
      const end = convertLatLngToVector3(toRegion.lat, toRegion.lng, radius);

      // Create quadratic bezier curve mid-point floating above the surface
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      mid.normalize().multiplyScalar(radius + dist * 0.25); // lift mid-point

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      
      capitalFlows.push({
        points: new THREE.BufferGeometry().setFromPoints(points),
        color: fromRegion.color
      });
    }
    return capitalFlows;
  }, [regions]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Constant slow rotation of the globe
    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.04;
      globeRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;
    }

    // Atmosphere slow breathing animation
    if (atmosphereRef.current) {
      const scale = 1.05 + Math.sin(time * 0.5) * 0.01;
      atmosphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        minDistance={6} 
        maxDistance={15} 
      />
      {/* Atmosphere Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[4.0, 32, 32]} />
        <meshPhysicalMaterial
          color="#7B61FF"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main rotating Globe group */}
      <group ref={globeRef}>
        {/* Globe Core */}
        <mesh>
          <sphereGeometry args={[3.95, 64, 64]} />
          <meshPhysicalMaterial
            color="#0A0A0F"
            roughness={0.8}
            metalness={0.2}
            clearcoat={0.3}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Golden Latitude / Longitude lines wireframe grid overlay */}
        <mesh>
          <sphereGeometry args={[4.0, 36, 18]} />
          <meshBasicMaterial
            color="#D4AF37"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>

        {/* Dynamic invoice location pins */}
        {regions.map((region, idx) => {
          const pinPos = convertLatLngToVector3(region.lat, region.lng, 4.02);
          return (
            <group key={idx} position={[pinPos.x, pinPos.y, pinPos.z]}>
              {/* Pulsing signal ring */}
              <mesh>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshBasicMaterial color={region.color} />
              </mesh>
              <mesh scale={[1.4, 1.4, 1.4]}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshBasicMaterial 
                  color={region.color} 
                  transparent 
                  opacity={0.3} 
                  wireframe
                />
              </mesh>
            </group>
          );
        })}

        {/* Capital Flow Arcs */}
        {arcs.map((arc, idx) => (
          <line key={idx}>
            <bufferGeometry attach="geometry" {...arc.points} />
            <lineBasicMaterial 
              attach="material" 
              color={arc.color} 
              linewidth={1} 
              transparent 
              opacity={0.65} 
            />
          </line>
        ))}
      </group>
    </group>
  );
}
