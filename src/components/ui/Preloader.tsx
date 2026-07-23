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
      {/* SVG Ensō Circle Simulation */}
      <div className="preloader-torus relative w-64 h-64 flex items-center justify-center mb-8">
        {/* Outer glowing aura */}
        <div className="absolute inset-0 rounded-full bg-[#C5A059]/3 blur-xl animate-pulse" />
        
        {/* SVG Ensō Circle */}
        <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 220 220">
          <circle
            cx="110"
            cy="110"
            r="90"
            stroke="rgba(197, 160, 89, 0.06)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="110"
            cy="110"
            r="90"
            stroke="#C5A059"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
            className="enso-circle"
            style={{
              strokeDasharray: 565,
              strokeDashoffset: 565 - (565 * loadingProgress) / 100,
              transition: "stroke-dashoffset 0.15s ease-out",
            }}
          />
        </svg>
        
        {/* Center Loading Status */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="font-heading text-5xl font-medium text-white leading-none">
            {loadingProgress}%
          </span>
          <span className="font-heading text-xs tracking-[0.25em] text-accent-red font-bold uppercase mt-2 animate-pulse">
            LOADING
          </span>
        </div>
      </div>

      <div className="preloader-text flex flex-col items-center">
        <h1 className="font-heading text-4xl md:text-5xl font-normal tracking-[0.15em] text-white mb-2">
          ChainFlow
        </h1>
        <p className="font-heading text-xs tracking-[0.3em] text-[#C5A059] uppercase opacity-90">
          Liquidity, Unlocked{dots}
        </p>
      </div>
    </div>
  );
}
