"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Stars, 
  PerspectiveCamera 
} from "@react-three/drei";
import { 
  EffectComposer, 
  Bloom, 
  Vignette 
} from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import * as THREE from "three";
import gsap from "gsap";

// Sub-scenes
import LandingScene from "./scenes/LandingScene";
import DashboardScene from "./scenes/DashboardScene";
import MarketplaceScene from "./scenes/MarketplaceScene";
import CreateScene from "./scenes/CreateScene";
import AnalyticsScene from "./scenes/AnalyticsScene";
import DocsScene from "./scenes/DocsScene";

function SceneController() {
  const { activePage } = useFlowStore();
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Handle camera position transitions when activePage changes
  useEffect(() => {
    const tl = gsap.timeline();
    
    if (activePage === "/") {
      // Landing Page macro view
      tl.to(camera.position, { x: 0, y: 5, z: 25, duration: 2.5, ease: "power2.inOut" });
      targetLookAt.current.set(0, 0, 0);
    } else if (activePage === "/dashboard") {
      // Dashboard Solar System view
      tl.to(camera.position, { x: 0, y: 15, z: 22, duration: 2.2, ease: "power2.inOut" });
      targetLookAt.current.set(0, 0, 0);
    } else if (activePage === "/marketplace") {
      // Marketplace Globe view
      tl.to(camera.position, { x: 0, y: 0, z: 12, duration: 2.0, ease: "power2.inOut" });
      targetLookAt.current.set(0, 0, 0);
    } else if (activePage === "/create") {
      // Create Invoice Tunnel view
      tl.to(camera.position, { x: 0, y: 0, z: 8, duration: 2.0, ease: "power2.inOut" });
      targetLookAt.current.set(0, 0, -2);
    } else if (activePage === "/analytics") {
      // Analytics flow map view
      tl.to(camera.position, { x: 0, y: 8, z: 16, duration: 2.5, ease: "power2.inOut" });
      targetLookAt.current.set(0, 0, 0);
    } else if (activePage.startsWith("/docs")) {
      // Docs crystal view
      tl.to(camera.position, { x: 0, y: 2, z: 10, duration: 2.0, ease: "power2.inOut" });
      targetLookAt.current.set(0, 0, 0);
    } else if (activePage.startsWith("/invoice/")) {
      // Invoice detail deep-dive view
      tl.to(camera.position, { x: -3, y: 3, z: 8, duration: 2.2, ease: "power2.inOut" });
      targetLookAt.current.set(0, 0, 0);
    } else if (activePage.startsWith("/investor/")) {
      // Investor profile view
      tl.to(camera.position, { x: 3, y: 2, z: 9, duration: 2.2, ease: "power2.inOut" });
      targetLookAt.current.set(0, 0, 0);
    }
  }, [activePage, camera]);

  useFrame(() => {
    // Keep camera looking at the target point
    camera.lookAt(targetLookAt.current);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
      <directionalLight position={[-5, 5, 5]} intensity={1.2} color="#7B61FF" />

      {/* Render sub-scenes based on route */}
      <Suspense fallback={null}>
        {activePage === "/" && <LandingScene />}
        {activePage === "/dashboard" && <DashboardScene />}
        {activePage === "/marketplace" && <MarketplaceScene />}
        {activePage === "/create" && <CreateScene />}
        {activePage === "/analytics" && <AnalyticsScene />}
        {activePage.startsWith("/docs") && <DocsScene />}
        
        {/* Dynamic Details pages can reuse scenes or render specific stubs */}
        {activePage.startsWith("/invoice/") && <LandingScene isDetailView />}
        {activePage.startsWith("/investor/") && <DashboardScene isInvestorView />}
      </Suspense>
    </>
  );
}

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-transparent pointer-events-none">
      <Canvas
        dpr={[1, 2]} // Cap DPR at 2 for performance optimization
        gl={{ 
          antialias: false, // Disabled for post-processing pipeline
          alpha: true,
          powerPreference: "high-performance" 
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 25]} fov={55} />
          <Stars 
            radius={100} 
            depth={50} 
            count={2000} 
            factor={4} 
            saturation={0.5} 
            fade 
            speed={1} 
          />
          
          <SceneController />

          <EffectComposer multisampling={0}>
            <Bloom 
              luminanceThreshold={0.5} 
              luminanceSmoothing={0.9} 
              height={300} 
              intensity={0.6} 
            />
            <Vignette eskil={false} offset={0.15} darkness={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
