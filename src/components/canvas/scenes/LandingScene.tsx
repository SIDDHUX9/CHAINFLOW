"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LandingSceneProps {
  isDetailView?: boolean;
}

// Custom GPU displacement shaders for smooth, soothing liquid wave
const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Multi-frequency wave calculation for natural, soothing flow
    float wave1 = sin(modelPosition.x * 0.08 + uTime * 0.4) * cos(modelPosition.y * 0.08 + uTime * 0.3) * 2.5;
    float wave2 = sin(modelPosition.x * 0.2 - uTime * 0.6) * 0.8;
    float wave3 = cos(modelPosition.y * 0.15 + uTime * 0.2) * 1.0;

    // Soft mouse gravity warping (soothingly pull waves towards normalized cursor)
    vec2 mouseWorld = uMouse * 15.0;
    float dist = distance(modelPosition.xy, mouseWorld);
    float mouseInfluence = 0.0;
    if (dist < 12.0) {
      float factor = 1.0 - (dist / 12.0);
      mouseInfluence = sin(uTime * 1.2) * factor * 1.8;
    }

    float elevation = wave1 + wave2 + wave3 + mouseInfluence;
    modelPosition.z += elevation;
    vElevation = elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  void main() {
    // Normalize elevation range from [-4.0, 4.0] to [0.0, 1.0] for gradient blending
    float normElevation = (vElevation + 4.0) / 8.0;
    normElevation = clamp(normElevation, 0.0, 1.0);

    // Design-system-aligned colors:
    // Soothing deep blue-violet: #080812
    vec3 spaceDark = vec3(0.031, 0.031, 0.071);
    // Deep Indigo brand color: #2A1B6A
    vec3 deepIndigo = vec3(0.165, 0.106, 0.416);
    // Brand Gold: #D4AF37
    vec3 brandGold = vec3(0.831, 0.686, 0.216);
    
    // Blend deep background with indigo based on height
    vec3 baseColor = mix(spaceDark, deepIndigo, normElevation * 0.7);
    // Add shimmering gold accents on the wave crests
    vec3 finalColor = mix(baseColor, brandGold, pow(normElevation, 2.2) * 0.8);

    // Shimmering highlights on peak crests
    float crestIntensity = smoothstep(0.65, 1.0, normElevation);
    vec3 highlightColor = vec3(0.953, 0.898, 0.671); // Soft yellow/light gold
    finalColor += crestIntensity * highlightColor * 0.35;

    // Technical grid pattern overlay to reinforce ledger blockchain aesthetic
    float gridX = sin(vUv.x * 70.0) * 0.5 + 0.5;
    float gridY = sin(vUv.y * 70.0) * 0.5 + 0.5;
    float grid = step(0.985, gridX) + step(0.985, gridY);
    grid = clamp(grid, 0.0, 1.0);
    
    // Mix in the grid lines softly
    finalColor = mix(finalColor, highlightColor, grid * 0.08);

    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

// Helper component for floating nodes in space
function FloatingNode({ 
  position, 
  size, 
  color, 
  speed, 
  offset, 
  isGlass = false 
}: { 
  position: [number, number, number]; 
  size: number; 
  color: string; 
  speed: number; 
  offset: number; 
  isGlass?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Float up and down smoothly
      meshRef.current.position.y = position[1] + Math.sin(time * speed + offset) * 0.6;
      // Orbit/rotate
      meshRef.current.rotation.y = time * 0.25;
      meshRef.current.rotation.x = time * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      {isGlass ? (
        <meshPhysicalMaterial
          color={color}
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.4}
          transmission={0.9}
          thickness={0.8}
          ior={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      ) : (
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.9}
        />
      )}
    </mesh>
  );
}

export default function LandingScene({ isDetailView = false }: LandingSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const detailMeshRef = useRef<THREE.Mesh>(null);

  // Memoize uniforms to ensure reference stability
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouse = state.pointer; // normalized mouse positions (-1 to 1)

    // Rotate scene slightly for depth
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.008;
    }

    // Update uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
    }

    // Float detail page mesh if detail view
    if (detailMeshRef.current) {
      detailMeshRef.current.rotation.y = time * 0.15;
      detailMeshRef.current.rotation.x = Math.sin(time * 0.3) * 0.08;
      detailMeshRef.current.position.y = Math.sin(time * 1.0) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {!isDetailView ? (
        <>
          {/* Solid 3D Wave Plane with GPU custom displacement shaders */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[80, 80, 120, 120]} />
            <shaderMaterial
              ref={materialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              transparent
              depthWrite={true}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Floating Solid Glass & Gold Nodes representing financial consensus */}
          <group>
            {/* Main verification glass node */}
            <FloatingNode 
              position={[0, 0, -4]} 
              size={1.6} 
              color="#D4AF37" 
              speed={0.8} 
              offset={0} 
              isGlass 
            />

            {/* Orbiting gold asset node */}
            <FloatingNode 
              position={[-8, 2, -6]} 
              size={0.9} 
              color="#D4AF37" 
              speed={1.2} 
              offset={Math.PI / 3} 
            />

            {/* Orbiting violet security node */}
            <FloatingNode 
              position={[8, 1, -8]} 
              size={1.1} 
              color="#7B61FF" 
              speed={0.9} 
              offset={Math.PI * 0.7} 
              isGlass 
            />

            {/* Minor accent node */}
            <FloatingNode 
              position={[-4, -2, 2]} 
              size={0.4} 
              color="#F3E5AB" 
              speed={1.5} 
              offset={Math.PI * 1.2} 
            />
          </group>

          {/* Grid boundaries for design framework structure */}
          <gridHelper 
            args={[60, 30, "rgba(212, 175, 55, 0.06)", "rgba(123, 97, 255, 0.02)"]} 
            position={[0, -3.9, 0]} 
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
