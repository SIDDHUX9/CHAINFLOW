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
      y: 35,
      duration: 1.4,
      stagger: 0.2,
      ease: "power4.out",
    });

    return () => clearInterval(interval);
  }, []);

  const trustPartners = [
    { name: "STELLAR FOUNDATION", logo: "★" },
    { name: "SOROBAN ECOSYSTEM", logo: "◆" },
    { name: "ANCHOR NETWORK", logo: "▲" },
    { name: "DTCC COMPLIANT", logo: "■" },
    { name: "ORACLE TRUST", logo: "●" }
  ];

  const steps = [
    {
      num: "01",
      title: "Invoice Serialization",
      desc: "Upload commercial invoices as PDFs. Our OCR model extracts and formats metadata such as counterparties, values, and due dates.",
      icon: <Building className="w-5 h-5 text-gold" />,
    },
    {
      num: "02",
      title: "Consensus Attestation",
      desc: "Stellar decentralized oracle nodes cross-reference the invoice validity with registry databases for trustless verification.",
      icon: <ShieldCheck className="w-5 h-5 text-accent-purple" />,
    },
    {
      num: "03",
      title: "Fractional Capital",
      desc: "Receive instant factoring liquidity in XLM or stablecoins. Backers secure yield-bearing fractions of the asset.",
      icon: <Zap className="w-5 h-5 text-accent-green" />,
    },
  ];

  return (
    <div className="flex flex-col gap-28 relative select-none">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 min-h-[80vh]">
        {/* Subtle dark backdrop for clarity */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,15,0.9)_0%,rgba(10,10,15,0.4)_70%,transparent_100%)] pointer-events-none" />
        
        <div className="flex flex-col gap-6 max-w-5xl relative z-10 px-4">
          
          <div className="hero-element inline-flex items-center gap-2 self-center px-4 py-1.5 rounded-full border border-gold/30 bg-[#141423] shadow-[0_0_15px_rgba(212,175,55,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] font-bold uppercase text-gold">
              Soroban Smart Contract Protocol
            </span>
          </div>

          <h1 className="hero-element text-display text-white text-4xl sm:text-6xl md:text-8xl font-black leading-[1.05] tracking-tight">
            Turn Unpaid Invoices <br />
            Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold-dark filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">Liquid Yield</span>
          </h1>

          <p className="hero-element text-sans text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mt-2">
            ChainFlow fractionally tokenizes invoice receivables on the Stellar blockchain. Access sub-cent ledger transactions, instant capital, and automated interest settlements.
          </p>

          <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/create"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-space-black text-xs font-black uppercase tracking-widest shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300"
            >
              Start Factoring
            </Link>
            <Link
              href="/marketplace"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-[#11111E] hover:bg-[#18182B] border border-white/10 hover:border-gold/30 text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all duration-300"
            >
              Explore Exchange
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Premium Solid Cards) */}
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0F0F17] p-10 md:p-14 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 bg-gradient-to-r from-space-blue/15 to-gold/5 pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-white/5 relative z-10">
          <div className="flex flex-col gap-2 p-2">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-gold uppercase">
              Total Invoices Factored
            </span>
            <span className="text-display text-4xl sm:text-5xl font-extrabold text-white mt-1">
              ${stats.factored.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-2 pt-8 md:pt-2">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-gold uppercase">
              Capital Deployed
            </span>
            <span className="text-display text-4xl sm:text-5xl font-extrabold text-white mt-1">
              ${stats.deployed.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-2 pt-8 md:pt-2">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-gold uppercase">
              Ledger Settlement Time
            </span>
            <span className="text-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-teal-400 mt-1">
              {stats.speed}s
            </span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="flex flex-col gap-14">
        <div className="text-center">
          <h2 className="text-display text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Programmable Cash Flow
          </h2>
          <p className="text-sans text-xs sm:text-sm text-white/40 tracking-widest uppercase mt-2 font-semibold">
            The Fractional Factoring Architecture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass p-8 rounded-2xl flex flex-col gap-5 border border-white/5 hover:border-gold/20 hover:-translate-y-1.5 transition-all duration-300 relative group"
            >
              {/* Glowing background accent on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#090910] flex items-center justify-center border border-white/10">
                  {step.icon}
                </div>
                <span className="text-display text-lg font-black text-white/10 font-mono tracking-tighter">
                  {step.num}
                </span>
              </div>
              
              <h3 className="text-display text-lg font-bold text-white relative z-10 group-hover:text-gold transition-colors">
                {step.title}
              </h3>
              <p className="text-sans text-xs text-white/50 leading-relaxed relative z-10">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRUST BAR */}
      <section className="py-10 border-t border-b border-white/5 bg-[#090910]/40">
        <div className="flex flex-col gap-6 items-center">
          <span className="text-[10px] tracking-[0.35em] font-bold text-white/30 uppercase">
            POWERED BY DECENTRALIZED STELLAR NETWORKS
          </span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
            {trustPartners.map((partner) => (
              <div key={partner.name} className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-gold font-bold text-xs">{partner.logo}</span>
                <span className="text-display text-xs font-black tracking-widest text-white">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="flex flex-col gap-14">
        <div className="text-center">
          <h2 className="text-display text-3xl sm:text-4xl font-black text-white">
            Client Attestations
          </h2>
          <p className="text-sans text-xs text-white/40 uppercase tracking-widest mt-1">
            Exporters & Backers Feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-10 rounded-3xl border border-white/5 flex flex-col gap-6 relative group">
            <div className="absolute top-6 right-8 text-5xl text-gold/10 font-serif pointer-events-none select-none">“</div>
            <p className="text-sans text-sm text-slate-300 leading-relaxed italic relative z-10">
              With ChainFlow, we fractionalized a $12,500 shipping invoice for black tea leaves and received funding in stablecoins in minutes. This completely bypasses the traditional bank review periods.
            </p>
            <div className="border-t border-white/5 pt-4 mt-2">
              <h4 className="text-display text-xs font-bold text-white uppercase tracking-wider">
                Maria Rodriguez
              </h4>
              <p className="text-sans text-[10px] text-gold uppercase tracking-wider mt-0.5">
                Founder, Mombasa Agriculture Export
              </p>
            </div>
          </div>

          <div className="glass p-10 rounded-3xl border border-white/5 flex flex-col gap-6 relative group">
            <div className="absolute top-6 right-8 text-5xl text-gold/10 font-serif pointer-events-none select-none">“</div>
            <p className="text-sans text-sm text-slate-300 leading-relaxed italic relative z-10">
              Providing liquidity to micro-invoices was impossible on other chains due to transaction cost spikes. On Stellar, gas is sub-cent, enabling us to distribute diversified yield backing pools safely.
            </p>
            <div className="border-t border-white/5 pt-4 mt-2">
              <h4 className="text-display text-xs font-bold text-white uppercase tracking-wider">
                Hans Schmidt
              </h4>
              <p className="text-sans text-[10px] text-gold uppercase tracking-wider mt-0.5">
                Partner, Schmidt Capital Berlin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="pt-14 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-white/40 text-xs">
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
          <Link href="/docs" className="hover:text-gold transition-colors">Developer API</Link>
          <Link href="/marketplace" className="hover:text-gold transition-colors">Invoice Exchange</Link>
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
