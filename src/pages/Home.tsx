"use client";

import Link from "@/components/ui/Link";
import { useEffect, useState, useRef } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Building, 
  ArrowRight, 
  Calculator, 
  DollarSign, 
  Percent, 
  Clock, 
  ArrowUpRight, 
  Activity, 
  TrendingUp, 
  CheckCircle,
  FileText
} from "lucide-react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { setCursorHovered, invoices } = useFlowStore();
  
  // Interactive Calculator State
  const [calcAmount, setCalcAmount] = useState(25000);
  const [calcTerm, setCalcTerm] = useState(60);
  const [calcApy, setCalcApy] = useState(11.5);

  // Tabbed Workflow Simulator State
  const [activeStep, setActiveStep] = useState(0);

  // Live Stats State
  const [liveStats, setLiveStats] = useState({
    factored: 12458900,
    deployed: 11204650,
    speed: 5.1,
    nodes: 82
  });

  // Calculate factoring outputs
  const advanceAmount = calcAmount * 0.90; // 90% advance rate
  const networkFee = calcAmount * 0.005; // 0.5% fee
  const yieldPaid = advanceAmount * (calcApy / 100) * (calcTerm / 365);
  const reserveRefund = (calcAmount * 0.10) - (networkFee + yieldPaid);
  const totalFunding = advanceAmount + Math.max(0, reserveRefund);

  // Live stats ticking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        factored: prev.factored + Math.floor(Math.random() * 45) + 12,
        deployed: prev.deployed + Math.floor(Math.random() * 40) + 10,
        speed: parseFloat((5.0 + Math.random() * 0.2).toFixed(1)),
        nodes: prev.nodes + (Math.random() > 0.85 ? 1 : 0)
      }));
    }, 4000);

    // GSAP visual entrance timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-glow", { opacity: 0, scale: 0.8, duration: 1.5, ease: "power3.out" })
        .from(".hero-badge", { y: -20, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=1.0")
        .from(".hero-title", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.6")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .from(".hero-actions", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
        .from(".hero-stats-card", { scale: 0.95, opacity: 0, y: 15, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.2");
    });

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const stepsData = [
    {
      num: "01",
      title: "Invoice Serialization",
      badge: "AI OCR Parsing",
      desc: "Export invoices are uploaded. The OCR engine reads counterparties, amounts, and dates, creating a unique cryptographic invoice ID on the Soroban network.",
      color: "border-gold/30 hover:border-gold",
      icon: <Building className="w-5 h-5 text-gold" />
    },
    {
      num: "02",
      title: "Consensus Attestation",
      badge: "Soroban Smart Oracles",
      desc: "Distributed oracle nodes verify invoice legitimacy, cross-referencing port authorities, custom registries, and corporate buyers via trustless consensus.",
      color: "border-accent-purple/30 hover:border-accent-purple",
      icon: <ShieldCheck className="w-5 h-5 text-accent-purple" />
    },
    {
      num: "03",
      title: "Fractional Capital Flow",
      badge: "Stellar Liquidity Pool",
      desc: "The asset is tokenized. Exporters receive 90% instant advance funding in stablecoins, and investors buy yield-bearing fractional pools.",
      color: "border-accent-green/30 hover:border-accent-green",
      icon: <Zap className="w-5 h-5 text-accent-green" />
    }
  ];

  return (
    <div className="flex flex-col gap-16 relative select-none w-full">
      {/* Background cinematic Sumi-E landscape image */}
      <img 
        src="/images/sumie.png"
        className="fixed inset-0 w-full h-full object-cover opacity-[0.09] pointer-events-none -z-20"
        alt="Sumi-e Zen background"
      />
      {/* Glow highlight */}
      <div className="hero-glow absolute -top-24 left-1/2 -translate-x-1/2 w-[70%] h-[350px] bg-gradient-to-b from-gold/5 via-space-purple/2 to-transparent blur-[80px] rounded-full pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-16 pb-0 mt-16">
        {/* Left Column: Asymmetric Left-Aligned content */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10 px-4">
          <div className="hero-badge inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full border border-gold/25 bg-space-card/90 shadow-[0_0_20px_rgba(197,160,89,0.06)]">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] font-light uppercase text-gold font-body">
              Soroban Smart Contract Liquidity
            </span>
          </div>

          <h1 className="hero-title font-heading text-white/95 text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.85] mb-2 font-normal">
            Beyond Silence, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold-dark filter drop-shadow-[0_2px_15px_rgba(197,160,89,0.15)] font-heading">
              Pure Trade Flow.
            </span>
          </h1>

          <p className="hero-desc font-body font-light text-white/60 text-sm max-w-xl leading-relaxed mt-1">
            Simplifying international invoice factoring. By removing traditional friction, we create digital havens for deep capital security and pure liquid flows on Stellar.
          </p>

          <div className="hero-actions flex flex-row items-center gap-4 mt-8 font-body">
            <Link
              href="/create"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="px-8 py-4 rounded-sm clip-corners bg-gradient-to-r from-gold-dark via-gold to-gold-light text-space-black text-xs font-bold uppercase tracking-widest shadow-[0_4px_25px_rgba(197,160,89,0.2)] hover:shadow-[0_4px_35px_rgba(197,160,89,0.45)] hover:scale-[1.03] transition-all duration-300 active-tactile"
            >
              Begin Journey
            </Link>
            <Link
              href="/marketplace"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="px-8 py-4 rounded-sm clip-corners bg-space-card hover:bg-space-card/80 border border-[#C5A059]/25 hover:border-gold text-white text-xs font-bold uppercase tracking-widest hover:scale-[1.03] transition-all duration-300 active-tactile"
            >
              Audit Exchange
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Ledger Dashboard Console (Bento style) */}
        <div className="lg:col-span-5 relative z-10 px-4 flex justify-center lg:pt-14">
          <div className="w-full max-w-sm glass-premium p-8 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.06)]">
            {/* Zen Gold Ink background */}
            <img 
              src="/images/gold_ink.png"
              className="absolute inset-0 w-full h-full object-cover opacity-[0.16] pointer-events-none z-0 mix-blend-screen"
              alt="Zen gold ink wash"
            />
            {/* Top glass highlights */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full z-10" />
            
            {/* Hanko Stamp Overlay */}
            <div className="absolute bottom-16 right-6 z-20 hanko-stamp px-3 py-1 rounded-sm border-2 text-[9px] font-bold select-none opacity-85 pointer-events-none font-mono">
              ORACLE VERIFIED
            </div>
            
            <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">LEDGER_STATE_REPLAY</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="text-[9px] font-mono text-accent-green font-bold uppercase">LIVE SYNC</span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-6 font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-white/30 uppercase">RECEIVABLE_ASSET_ID</span>
                <span className="text-white font-bold text-sm tracking-wide">CF- Mombasa Flower Export</span>
              </div>

              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/30 uppercase">FACE_VALUE</span>
                  <span className="text-gold font-bold text-2xl tracking-tight">$18,400.00</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-white/30 uppercase">DISCOUNT_APY</span>
                  <span className="text-accent-green font-bold text-base">11.2%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/30 uppercase">MATURITY</span>
                  <span className="text-slate-300 font-semibold">Oct 15, 2026</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/30 uppercase">TENOR</span>
                  <span className="text-slate-300 font-semibold">87 Days</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-[10px] text-white/55 flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>Buyer Status:</span>
                  <span className="text-accent-green font-bold uppercase">ATTESTED</span>
                </div>
                <div className="flex justify-between">
                  <span>Ledger Finality:</span>
                  <span className="text-white/80">Sequence #48102</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Supply:</span>
                  <span className="text-white/80">100 Fractions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Bento Grid 2.0) */}
      <section className="relative w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Invoices Factored (col-span-2) */}
          <div className="hero-stats-card p-8 rounded-[2rem] bg-[#0E0E18] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-gold/20 transition-all duration-300 md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] font-semibold text-gold uppercase">Invoices Factored</span>
                <span className="text-xs text-white/40">Total commercial receivables tokenized on-chain</span>
              </div>
              <Activity className="w-4 h-4 text-gold/60" />
            </div>
            <span className="text-display text-4xl sm:text-5xl font-black text-white">
              ${liveStats.factored.toLocaleString()}
            </span>
            <div className="mt-4 text-[10px] text-white/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-accent-green font-bold">▲ Live</span> updating in real-time
            </div>
          </div>

          {/* Card 2: Capital Deployed (col-span-1) */}
          <div className="hero-stats-card p-8 rounded-[2rem] bg-[#0E0E18] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-accent-purple/20 transition-all duration-300 md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] font-semibold text-gold uppercase">Capital Deployed</span>
              </div>
              <TrendingUp className="w-4 h-4 text-accent-purple/60" />
            </div>
            <span className="text-display text-3xl font-extrabold text-white">
              ${liveStats.deployed.toLocaleString()}
            </span>
            <div className="mt-8 text-[10px] text-white/40">
              Secured in smart liquidity pools
            </div>
          </div>

          {/* Card 3: Settlement Speed (col-span-1) */}
          <div className="hero-stats-card p-8 rounded-[2rem] bg-[#0E0E18] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-accent-green/20 transition-all duration-300 md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] font-semibold text-gold uppercase">Settlement Speed</span>
              </div>
              <Zap className="w-4 h-4 text-accent-green/60" />
            </div>
            <span className="text-display text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-teal-400">
              {liveStats.speed}s
            </span>
            <div className="mt-8 text-[10px] text-white/40">
              Stellar ledger finality time
            </div>
          </div>

          {/* Card 4: Validator Nodes (col-span-2) */}
          <div className="hero-stats-card p-8 rounded-[2rem] bg-[#0E0E18] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-gold/20 transition-all duration-300 md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] font-semibold text-gold uppercase">Validator Nodes</span>
                <span className="text-xs text-white/40">Independent consensus instances attesting assets</span>
              </div>
              <ShieldCheck className="w-4 h-4 text-gold/60" />
            </div>
            <span className="text-display text-4xl sm:text-5xl font-black text-white">
              {liveStats.nodes} Active
            </span>
            <div className="mt-4 text-[10px] text-white/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span>Decentralized validation network</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE CALCULATOR SECTION */}
      <section className="relative w-full animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: sliders */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.3em] font-bold text-gold uppercase flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" /> Finance Estimation Model
              </span>
              <h2 className="font-heading text-white/95 text-4xl sm:text-6xl tracking-tight leading-[0.85] mb-2 font-normal">
                Factoring Calculator
              </h2>
              <p className="font-body font-light text-white/60 text-sm max-w-xl leading-relaxed mt-1">
                Simulate your fractional invoice cash flows. Exporters get instant liquidity advances while investors secure competitive yields.
              </p>
            </div>

            <div className="flex flex-col gap-6 p-8 rounded-3xl glass">
              
              {/* Slider 1: Amount */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Invoice Amount</span>
                  <span className="text-gold font-mono">${calcAmount.toLocaleString()} USD</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="200000" 
                  step="5000"
                  value={calcAmount} 
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-white/35 font-mono">
                  <span>$5,000</span>
                  <span>$200,000</span>
                </div>
              </div>

              {/* Slider 2: Term */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Repayment Period</span>
                  <span className="text-accent-purple font-mono">{calcTerm} Days</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="120" 
                  step="15"
                  value={calcTerm} 
                  onChange={(e) => setCalcTerm(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-purple focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-white/35 font-mono">
                  <span>30 Days</span>
                  <span>120 Days</span>
                </div>
              </div>

              {/* Slider 3: APY */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Investor Pool APY</span>
                  <span className="text-accent-green font-mono">{calcApy.toFixed(1)}% APY</span>
                </div>
                <input 
                  type="range" 
                  min="6" 
                  max="18" 
                  step="0.5"
                  value={calcApy} 
                  onChange={(e) => setCalcApy(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-green focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-white/35 font-mono">
                  <span>6.0%</span>
                  <span>18.0%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right panel: dynamic receipt */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl glass-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-2xl rounded-full" />
              
              <h3 className="text-display text-lg font-bold text-white mb-6 border-b border-white/5 pb-4 flex items-center justify-between">
                <span>Receipt Summary</span>
                <span className="text-[10px] tracking-widest text-gold uppercase px-2 py-0.5 bg-gold/10 rounded font-mono">Soroban Node Estimator</span>
              </h3>

              <div className="flex flex-col gap-4">
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gold" /> Instant Funding (90% Advance)</span>
                  <span className="text-white font-bold font-mono">${advanceAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 flex items-center gap-1"><Percent className="w-3.5 h-3.5 text-accent-purple" /> Investor Yield Cost</span>
                  <span className="text-accent-red font-semibold font-mono">-${yieldPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent-green" /> ChainFlow Protocol Fee (0.5%)</span>
                  <span className="text-accent-red font-semibold font-mono">-${networkFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-4">
                  <span className="text-white/50 flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-gold" /> Escrow Maturity Reserve (10%)</span>
                  <span className="text-white font-mono">${(calcAmount * 0.10).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-white font-bold text-sm">Receivable Net Advance</span>
                  <span className="text-gold font-mono font-black text-xl">${totalFunding.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-white/30 italic mt-2 border-t border-white/5 pt-4">
                  <span>Maturity refund to exporter</span>
                  <span className="font-mono">${Math.max(0, reserveRefund).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>

              </div>

              <div className="mt-8">
                <Link
                  href="/create"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold-dark text-[#0A0A0F] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-transform duration-300 active-tactile shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.3)]"
                >
                  Apply for Factoring <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. TABBED WORKFLOW SIMULATOR */}
      <section className="flex flex-col gap-14 w-full">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.3em] font-black text-gold uppercase">Soroban Smart Oracles</span>
          <h2 className="font-heading text-white/95 text-4xl sm:text-6xl tracking-tight leading-[0.85] mb-2 font-normal">
            Programmable Consensus Flow
          </h2>
          <p className="font-body font-light text-white/60 text-sm max-w-xl mx-auto leading-relaxed mt-1">
            Click through our tokenization process to see how ChainFlow verifies physical invoice documents and unlocks Stellar blockchain liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tabs selector */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {stepsData.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 flex items-center gap-5 group relative ${
                  activeStep === idx 
                    ? "bg-[#111120] border-gold shadow-[0_0_20px_rgba(212,175,55,0.05)]" 
                    : "bg-[#090910]/40 border-white/5 hover:border-white/10 hover:bg-[#0E0E18]"
                }`}
              >
                {/* Active glow pointer */}
                {activeStep === idx && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gold rounded-r" />
                )}
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                  activeStep === idx ? "bg-black border-gold/40" : "bg-[#090910] border-white/10"
                }`}>
                  {step.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-widest text-gold/60 uppercase font-black">{step.badge}</span>
                    <span className="text-xs font-mono font-bold text-white/20">{step.num}</span>
                  </div>
                  <h3 className={`text-sm font-bold mt-1 transition-colors ${
                    activeStep === idx ? "text-gold" : "text-white"
                  }`}>
                    {step.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Screen Simulator (Interactive Visual Console) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/5 bg-[#08080F] p-8 min-h-[360px] flex flex-col justify-between shadow-2xl relative overflow-hidden font-mono">
              {/* Loop video background (Stellar AI abstract network nodes) */}
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
                className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none z-0"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(123,97,255,0.05),transparent_60%)] z-10" />
              
              {/* Console Header */}
              <div className="relative z-20 flex justify-between items-center border-b border-white/5 pb-4 mb-6 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-red/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gold/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-green/60" />
                  </div>
                  <span className="text-[10px] text-white/50 tracking-wider">CHAINFLOW_CONSENSUS_VM v1.0.0</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-white/5 rounded">STATUS: RUNNING</span>
              </div>

              {/* Console Content based on Step */}
              <div className="relative z-20 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {activeStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4 text-xs text-slate-300"
                    >
                      <div className="flex items-center gap-2 text-gold">
                        <FileText className="w-4 h-4" />
                        <span className="font-bold">INVOICE OCR SERIALIZER</span>
                      </div>
                      <div className="bg-black/40 p-4 rounded border border-white/5 flex flex-col gap-2">
                        <div>&gt; Loading document: <span className="text-white">mombasa_export_invoice_902.pdf</span></div>
                        <div>&gt; Extracting metadata via neural OCR...</div>
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[10px]">
                          <div><span className="text-white/40">Issuer:</span> Maria Agriculture</div>
                          <div><span className="text-white/40">Buyer:</span> Global Beverages</div>
                          <div><span className="text-white/40">Amount:</span> $12,500.00 USD</div>
                          <div><span className="text-white/40">Due Date:</span> 2026-09-15</div>
                        </div>
                      </div>
                      <div className="text-accent-green text-[10px]">&gt; Success: Serialized cryptography hash generated: cf10076a4a985fde...</div>
                    </motion.div>
                  )}

                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4 text-xs text-slate-300"
                    >
                      <div className="flex items-center gap-2 text-accent-purple">
                        <Activity className="w-4 h-4" />
                        <span className="font-bold">SOROBAN ORACLE CONSENSUS RUN</span>
                      </div>
                      <div className="bg-black/40 p-4 rounded border border-white/5 font-mono text-[10px] flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
                        <div className="text-white/40">[Soroban VM] Instantiating ledger auditor...</div>
                        <div>[Auditor Node 1] Checking Kenya Customs export logs: <span className="text-accent-green">MATCH</span></div>
                        <div>[Auditor Node 2] Cross-checking buyer invoice registry: <span className="text-accent-green">MATCH</span></div>
                        <div>[Auditor Node 3] Evaluating buyer repayment history: <span className="text-accent-green">98/100 SCORE</span></div>
                        <div className="text-white/40">[Soroban VM] Collecting attestations...</div>
                        <div className="text-accent-green">Consensus approved. 3/3 validator signatures appended.</div>
                      </div>
                      <div className="text-accent-green text-[10px]">&gt; State Update: Contract status set to ACTIVE on-chain.</div>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4 text-xs text-slate-300"
                    >
                      <div className="flex items-center gap-2 text-accent-green">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-bold">STELLAR LEDGER DISPATCHED</span>
                      </div>
                      <div className="bg-black/40 p-4 rounded border border-white/5 flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span>Transaction Hash:</span>
                          <span className="text-white font-mono text-[10px]">cf100...f7b3c2</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maturity Token Minted:</span>
                          <span className="text-gold font-mono text-[10px]">100 CF-TEA-001</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Liquid Advance Paid:</span>
                          <span className="text-accent-green font-mono text-[10px]">11,250.00 USDC</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-white/40">&gt; Funds released instantly. Ledger index #88390. Gas fee: 0.0001 XLM.</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Console Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-white/35 flex justify-between items-center">
                <span>Active Step: {stepsData[activeStep].title}</span>
                <span className="text-gold font-bold">STELLAR PROTOCOL COMPLIANT</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE FACTORING POOLS SHOWCASE */}
      <section className="flex flex-col gap-14 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.3em] font-bold text-gold uppercase flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Yield Receivables
            </span>
            <h2 className="font-heading text-white/95 text-4xl sm:text-6xl tracking-tight leading-[0.85] mb-2 font-normal">
              Active Factoring Pools
            </h2>
            <p className="font-body font-light text-white/60 text-sm max-w-xl leading-relaxed mt-1">
              Buy fractional shares of institutional invoices secured by Soroban smart contracts. Earn high APY backer yield settlements.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="px-6 py-3 rounded-full bg-[#111120] hover:bg-[#18182E] border border-white/10 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:scale-[1.02] transition-all duration-300"
          >
            Browse Marketplace <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>

        {/* Dynamic invoice card mapping */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {invoices.slice(0, 3).map((inv, idx) => {
            const fundedPercentage = ((inv.fractionCount - inv.availableFractions) / inv.fractionCount) * 100;
            return (
              <div
                key={inv.id}
                className="p-8 rounded-3xl glass flex flex-col justify-between min-h-[380px] hover:-translate-y-1.5 transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-2.5 py-1 rounded bg-[#090910] border border-white/10 text-[9px] font-mono tracking-widest text-gold uppercase font-black">
                      {inv.industry}
                    </span>
                    <span className="text-[10px] font-mono text-white/30 font-bold">{inv.id}</span>
                  </div>

                  <h3 className="text-display text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors">
                    {inv.title}
                  </h3>
                  <p className="text-sans text-xs text-white/50 leading-relaxed mb-6">
                    {inv.description}
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Progress bar */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-white/40">Funded Progress</span>
                      <span className="text-white font-mono">{fundedPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#171725] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-1000" 
                        style={{ width: `${fundedPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
                    <div>
                      <span className="block text-[8px] tracking-wider text-white/30 uppercase">APY Yield</span>
                      <span className="text-accent-green font-bold font-mono text-sm">{inv.yieldRate}%</span>
                    </div>
                    <div>
                      <span className="block text-[8px] tracking-wider text-white/30 uppercase">Value</span>
                      <span className="text-white font-bold font-mono text-sm">${inv.amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] tracking-wider text-white/30 uppercase">Risk</span>
                      <span className={`font-bold font-mono text-sm ${
                        inv.riskScore < 30 ? "text-accent-green" : inv.riskScore < 60 ? "text-gold" : "text-accent-red"
                      }`}>
                        A{inv.riskScore < 30 ? "+" : inv.riskScore < 60 ? "B" : "C"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/marketplace`}
                    className="w-full py-3.5 rounded-xl bg-[#090910] border border-white/10 text-white text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-1.5 hover:bg-gold hover:border-gold hover:text-black transition-colors"
                  >
                    View Details <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SOROBAN ATTESTATION ORACLE CONSENSUS LOGS */}
      <section className="flex flex-col gap-10 w-full relative">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.3em] font-bold text-gold uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Decentralized Integrity Verification
          </span>
          <h2 className="font-heading text-white/95 text-4xl sm:text-6xl tracking-tight leading-[0.85] mb-2 font-normal">
            Attestation Telemetry
          </h2>
          <p className="font-body font-light text-white/60 text-sm max-w-xl mx-auto leading-relaxed mt-1">
            Audit live invoice verification sequences from independent Stellar validator and anchor node streams in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Live Log Stream (col-span-8) */}
          <div className="lg:col-span-8 glass p-8 rounded-3xl border border-white/5 relative overflow-hidden font-mono flex flex-col justify-between min-h-[350px]">
            {/* Background flow particles (visual decor) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.03),transparent_50%)]" />
            
            <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <span className="text-[9px] tracking-widest text-white/30 uppercase">ATTESTATION_CONGRESS_LEDGER</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                <span className="text-[9px] text-accent-green font-bold uppercase">Consensus Stabilized</span>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col gap-3.5 text-xs text-white/70">
              <div className="flex items-start gap-4">
                <span className="text-gold shrink-0 font-bold">[15:39:10]</span>
                <span className="text-white/40">&gt;</span>
                <p>Ingesting Invoice ID <span className="text-white font-bold">CF-892-COL</span> (Bogota Coffee Coop). Face value: $14,500.00. Authenticating metadata hash...</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-gold shrink-0 font-bold">[15:39:12]</span>
                <span className="text-white/40">&gt;</span>
                <p>[Stellar VM] Attestation request sent. Oracles querying Colombian customs registries... <span className="text-accent-green font-bold">VERIFIED</span>.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-gold shrink-0 font-bold">[15:39:18]</span>
                <span className="text-white/40">&gt;</span>
                <p>Consensus reached: 3/3 signatures collected. Soroban contract minted <span className="text-gold font-bold">145 fractions</span> (CF-COF-091) active.</p>
              </div>
              <div className="flex items-start gap-4 border-t border-white/5 pt-4 mt-2">
                <span className="text-accent-purple shrink-0 font-bold">[15:42:01]</span>
                <span className="text-white/40">&gt;</span>
                <p>Deploying Invoice ID <span className="text-white font-bold">CF-902-KEN</span> (Mombasa Flower Export). Deployed to node cluster sequence #48102.</p>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/5 text-[9px] text-white/30 flex justify-between">
              <span>LEDGER_IDX: #884,912</span>
              <span>ORACLE ATTESTATION TIMEOUT: 120ms</span>
            </div>
          </div>

          {/* Right Block: Node Status Overview (col-span-4) */}
          <div className="lg:col-span-4 glass p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
            <div className="relative z-10">
              <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">VALIDATOR_POOL</span>
              <h3 className="text-display text-sm font-bold text-white uppercase tracking-wider mt-1.5 mb-6">Anchor Nodes</h3>
              
              <div className="flex flex-col gap-4 font-mono text-[11px]">
                {[
                  { name: "Node Alpha (Berlin)", ip: "188.42.102.*", active: true },
                  { name: "Node Beta (Singapore)", ip: "46.109.112.*", active: true },
                  { name: "Node Gamma (Bogota)", ip: "201.89.24.*", active: true },
                  { name: "Node Delta (Mombasa)", ip: "197.80.91.*", active: false }
                ].map((node, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-semibold">{node.name}</span>
                      <span className="text-[9px] text-white/30">{node.ip}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${node.active ? "bg-accent-green animate-pulse" : "bg-white/10"}`} />
                      <span className={`text-[9px] font-bold ${node.active ? "text-accent-green" : "text-white/20"}`}>
                        {node.active ? "SYNCED" : "OFFLINE"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/5 text-[9px] text-white/30 text-center font-mono">
              Network Decentralization: <span className="text-accent-green font-bold">75%</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="pt-14 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-white/40 text-xs w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gold/15 flex items-center justify-center font-display text-[10px] font-black text-gold border border-gold/30">
            CF
          </div>
          <span className="font-display font-bold text-white/70 tracking-wider">
            ChainFlow
          </span>
        </div>
        <p>© 2026 ChainFlow Protocol. Powered by Soroban & Stellar.</p>
        <div className="flex gap-6">
          <Link href="/whitepaper" className="hover:text-gold transition-colors">Whitepaper</Link>
          <Link href="/docs" className="hover:text-gold transition-colors">Developer API</Link>
          <Link href="/marketplace" className="hover:text-gold transition-colors">Invoice Exchange</Link>
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
