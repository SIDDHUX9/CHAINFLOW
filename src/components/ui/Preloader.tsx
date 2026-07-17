"use client";

import { useEffect, useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import gsap from "gsap";

export default function Preloader() {
  const { loadingProgress, setLoadingProgress, loadingComplete, setLoadingComplete } = useFlowStore();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    // Animate loading dots text
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);

    // Simulate loading progress with custom easing
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      const step = Math.floor(Math.random() * 8) + 2;
      currentProgress = Math.min(100, currentProgress + step);
      setLoadingProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        clearInterval(dotsInterval);
        
        // Trigger exit animations
        const tl = gsap.timeline({
          onComplete: () => {
            setLoadingComplete(true);
          }
        });

        // Explode torus and fade overlay
        tl.to(".preloader-torus", {
          scale: 1.8,
          opacity: 0,
          duration: 0.8,
          ease: "power3.in"
        })
        .to(".preloader-text", {
          y: -40,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in"
        }, "-=0.6")
        .to(".preloader-bg", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.3");
      }
    }, 80);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [setLoadingProgress, setLoadingComplete]);

  if (loadingComplete) return null;

  return (
    <div className="preloader-bg fixed inset-0 z-50 flex flex-col items-center justify-center bg-space-black select-none">
      {/* 3D Liquid Torus Simulation */}
      <div className="preloader-torus relative w-64 h-64 flex items-center justify-center mb-8">
        {/* Outer glowing gold aura */}
        <div className="absolute inset-0 rounded-full border border-gold/10 blur-xl animate-pulse" />
        
        {/* Animated concentric rings */}
        <div 
          className="absolute w-full h-full rounded-full border border-dashed border-gold/30 animate-spin" 
          style={{ animationDuration: "25s" }}
        />
        <div 
          className="absolute w-[80%] h-[80%] rounded-full border border-gold/20 animate-spin" 
          style={{ animationDuration: "12s", animationDirection: "reverse" }}
        />
        
        {/* Pulsing liquid gold core */}
        <div className="absolute w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-gold-dark via-gold to-gold-light opacity-80 blur-xs shadow-[0_0_50px_rgba(212,175,55,0.4)] animate-pulse">
          <div className="absolute inset-2 rounded-full bg-space-black flex items-center justify-center">
            <span className="text-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold-dark">
              {loadingProgress}%
            </span>
          </div>
        </div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#D4AF37]"
            style={{
              transform: `rotate(${i * 60}deg) translate(110px) rotate(-${i * 60}deg)`,
              animation: `spin 10s infinite linear`
            }}
          />
        ))}
      </div>

      <div className="preloader-text flex flex-col items-center">
        <h1 className="text-display text-3xl md:text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-gold to-white mb-2">
          CHAINFLOW
        </h1>
        <p className="text-sans text-xs tracking-[0.3em] text-gold uppercase opacity-80">
          Liquidity, Unlocked{dots}
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) translate(110px) rotate(0deg); }
          to { transform: rotate(360deg) translate(110px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
