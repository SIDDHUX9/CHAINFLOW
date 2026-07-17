"use client";

import { useEffect, useRef, useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  speedX: number;
  speedY: number;
}

export default function CustomCursor() {
  const { cursorHovered } = useFlowStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Mouse positions (real and interpolated)
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Only activate cursor on desktop
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (!isDesktop) return;

    // Add cursor hiding class to body
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Auto expand on links and buttons
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.classList.contains("clickable")
      ) {
        cursorDotRef.current?.classList.add("scale-[2.5]", "bg-gold-light");
        cursorRingRef.current?.classList.add("scale-[1.8]", "border-gold-light/40");
      } else {
        cursorDotRef.current?.classList.remove("scale-[2.5]", "bg-gold-light");
        cursorRingRef.current?.classList.remove("scale-[1.8]", "border-gold-light/40");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    // Canvas particle loop
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Lerp ring position for delayed smooth follow effect
      const lerpFactor = 0.15;
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * lerpFactor;

      // 2. Position DOM cursor elements
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // 3. Emit golden trail particles when moving
      if (Math.random() < 0.4) {
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          size: Math.random() * 2 + 1,
          color: "212, 175, 55", // Liquid gold RGB
          alpha: 0.7,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5 - 0.5, // float up slightly
        });
      }

      // 4. Draw and update particles
      particles.current.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= 0.015;
        p.size *= 0.98;

        if (p.alpha <= 0) {
          particles.current.splice(idx, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isDesktop]);

  // Expand cursor based on global Zustand hover state
  useEffect(() => {
    if (!isDesktop) return;
    if (cursorHovered) {
      cursorDotRef.current?.classList.add("scale-[2.5]", "bg-gold-light");
      cursorRingRef.current?.classList.add("scale-[1.8]", "border-gold-light/40");
    } else {
      cursorDotRef.current?.classList.remove("scale-[2.5]", "bg-gold-light");
      cursorRingRef.current?.classList.remove("scale-[1.8]", "border-gold-light/40");
    }
  }, [cursorHovered, isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Canvas for trailing particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
      />
      {/* Small center dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] pointer-events-none z-50 transition-transform duration-200 ease-out"
      />
      {/* Smoothly trailing halo ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold/40 pointer-events-none z-50 transition-transform duration-100 ease-out"
      />
    </>
  );
}
