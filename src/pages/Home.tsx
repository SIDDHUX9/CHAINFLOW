"use client";

import Link from "@/components/ui/Link";
import { useEffect, useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { ShieldCheck, Zap, Sparkles, Building } from "lucide-react";
import gsap from "gsap";

export default function Home() {
  const { setCursorHovered } = useFlowStore();
  const [stats, setStats] = useState({ factored: 12450000, deployed: 11200000, speed: 5.1 });

  // Simulate slightly updating live stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        factored: prev.factored + Math.floor(Math.random() * 50) + 10,
        deployed: prev.deployed + Math.floor(Math.random() * 45) + 8,
        speed: parseFloat((5.0 + Math.random() * 0.2).toFixed(1)),
      }));
    }, 3000);

    // Initial load animations
    gsap.from(".hero-element", {
      opacity: 0,
      y: 30,
      duration: 1.2,
      stagger: 0.25,
      ease: "power3.out",
    });

    return () => clearInterval(interval);
  }, []);

  const trustPartners = ["STELLAR ORG", "SOROBAN FOUNDATION", "ANCHOR GLOBAL", "DTCC FINTECH", "SECURE ORACLE"];

  const steps = [
    {
      title: "Invoice & Upload",
      desc: "Upload standard PDF invoices. Our instant OCR scans verification metadata, counterparties, and values automatically.",
      icon: <Building className="w-5 h-5 text-gold" />,
    },
    {
      title: "Oracle Attestation",
      desc: "Smart contracts cross-reference invoice details with bank and supplier registries using decentralized secure oracles.",
      icon: <ShieldCheck className="w-5 h-5 text-accent-purple" />,
    },
    {
      title: "Instant Liquidity",
      desc: "Receive instant funding in XLM or stablecoins, minus a minimal sub-cent processing fee. No 90-day waiting windows.",
      icon: <Zap className="w-5 h-5 text-accent-green" />,
    },
  ];

  return (
    <div className="flex flex-col gap-24 relative select-none">
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center py-16 md:py-28 min-h-[75vh]">
        {/* Dark radial backdrop to isolate text from background particles and ensure 100% contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,15,0.85)_0%,rgba(10,10,15,0.5)_60%,transparent_100%)] pointer-events-none" />
        
        <div className="flex flex-col gap-6 max-w-4xl relative z-10 px-4">
          <div className="hero-element inline-flex items-center gap-2 self-center px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-gold">
              Soroban-Powered Factoring
            </span>
          </div>

          <h1 className="hero-element text-display text-white text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Turn Unpaid Invoices <br />
            Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold-dark drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">Instant Capital</span>
          </h1>

          <p className="hero-element text-sans text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            ChainFlow tokenizes invoices into fractional, yield-bearing assets on Stellar. Secure sub-cent transactions, instant liquidity, and trustless settlement.
          </p>

          <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              href="/create"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-space-black text-xs font-black uppercase tracking-widest shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Start Factoring
            </Link>
            <Link
              href="/marketplace"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 hover:border-gold/40 text-white text-xs font-black uppercase tracking-widest transition-all duration-300"
            >
              Explore Network
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden border border-gold/15 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-0 bg-gradient-to-r from-space-blue/10 to-gold/5 pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/5 relative z-10">
          <div className="flex flex-col gap-2 p-4 md:p-0">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-gold uppercase">
              Total Invoices Factored
            </span>
            <span className="text-display text-3xl sm:text-4xl font-extrabold text-white">
              ${stats.factored.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-4 pt-8 md:p-0 md:pt-0">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-gold uppercase">
              Capital Deployed
            </span>
            <span className="text-display text-3xl sm:text-4xl font-extrabold text-white">
              ${stats.deployed.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-4 pt-8 md:p-0 md:pt-0">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-gold uppercase">
              Average Settlement Time
            </span>
            <span className="text-display text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-teal-400">
              {stats.speed}s
            </span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-display text-3xl sm:text-4xl md:text-5xl font-black">
            The Flow of Capital, Redefined
          </h2>
          <p className="text-sans text-xs sm:text-sm text-white/50 tracking-wider uppercase mt-2">
            3-Step Visual Tokenization Process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass p-6 rounded-2xl flex flex-col gap-4 border border-white/5 hover:border-gold/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-space-black flex items-center justify-center border border-white/10">
                {step.icon}
              </div>
              <h3 className="text-display text-lg font-bold text-white">
                {step.title}
              </h3>
              <p className="text-sans text-xs text-white/60 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRUST BAR */}
      <section className="py-8 border-t border-b border-white/5">
        <div className="flex flex-col gap-4 items-center">
          <span className="text-[9px] tracking-[0.3em] font-semibold text-white/30 uppercase">
            Anchored in Secure Stellar Infrastructure
          </span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40">
            {trustPartners.map((partner) => (
              <span key={partner} className="text-display text-xs font-black tracking-widest text-white hover:opacity-100 transition-opacity">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-display text-3xl sm:text-4xl font-black">
            Trusted by Builders & Investors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6 relative">
            <div className="text-4xl text-gold font-serif">“</div>
            <p className="text-sans text-sm text-white/80 leading-relaxed italic -mt-4">
              With ChainFlow, we tokenized a $12,500 shipping invoice for black tea leaves and received funding in XLM in under 5 minutes. This has completely eliminated our 60-day cash flow lag.
            </p>
            <div>
              <h4 className="text-display text-xs font-bold text-white uppercase tracking-wider">
                Maria Rodriguez
              </h4>
              <p className="text-sans text-[10px] text-gold uppercase tracking-wider">
                Founder, Kenyan Agriculture Co.
              </p>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6 relative">
            <div className="text-4xl text-gold font-serif">“</div>
            <p className="text-sans text-sm text-white/80 leading-relaxed italic -mt-4">
              Factoring micro-invoices was impossible on other chains due to gas spikes. On Stellar, fees are sub-cent, allowing us to fund parts of dozens of global supply chains with 11% yield.
            </p>
            <div>
              <h4 className="text-display text-xs font-bold text-white uppercase tracking-wider">
                Hans Schmidt
              </h4>
              <p className="text-sans text-[10px] text-gold uppercase tracking-wider">
                Partner, Schmidt Capital Berlin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MINIMAL PARTICLES FOOTER */}
      <footer className="mt-12 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-white/40 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center font-display text-[9px] font-black text-gold border border-gold/20">
            CF
          </div>
          <span className="font-display font-bold text-white/60 tracking-wider">
            ChainFlow
          </span>
        </div>
        <p>© 2026 ChainFlow Protocol. Powered by Soroban & Stellar.</p>
        <div className="flex gap-4">
          <Link href="/docs" className="hover:text-gold transition-colors">API Docs</Link>
          <Link href="/marketplace" className="hover:text-gold transition-colors">Marketplace</Link>
          <a href="#" className="hover:text-gold transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
