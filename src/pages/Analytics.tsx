"use client";

import { useFlowStore } from "@/store/useFlowStore";
import { 
  BarChart3, 
  TrendingUp, 
  Map, 
  Coins, 
  HelpCircle 
} from "lucide-react";
import Link from "@/components/ui/Link";

export default function Analytics() {
  const { invoices } = useFlowStore();

  const totalCapital = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const averageApy = (invoices.reduce((acc, curr) => acc + curr.yieldRate, 0) / invoices.length).toFixed(1);

  // Sector distribution percentage calculations
  const totalInvoices = invoices.length;
  const sectors = invoices.reduce((acc: {[key: string]: number}, curr) => {
    acc[curr.industry] = (acc[curr.industry] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header */}
      <div>
        <h1 className="text-display text-3xl md:text-5xl font-black">Platform Analytics</h1>
        <p className="text-sans text-xs sm:text-sm text-white/50 uppercase tracking-widest mt-1">
          Decentralized Factoring Telemetry
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 shrink-0">
            <Coins className="w-5 h-5 text-gold" />
          </div>
          <div>
            <span className="text-[9px] uppercase text-white/40 tracking-wider">Total Value Locked</span>
            <h3 className="text-display text-xl font-bold text-white mt-0.5">${totalCapital.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center border border-accent-green/20 shrink-0">
            <TrendingUp className="w-5 h-5 text-accent-green" />
          </div>
          <div>
            <span className="text-[9px] uppercase text-white/40 tracking-wider">Average Platform Yield</span>
            <h3 className="text-display text-xl font-bold text-white mt-0.5">{averageApy}% APY</h3>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20 shrink-0">
            <BarChart3 className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <span className="text-[9px] uppercase text-white/40 tracking-wider">Contract Ledgers Height</span>
            <h3 className="text-display text-xl font-bold text-white mt-0.5">#3.24M</h3>
          </div>
        </div>
      </div>

      {/* Charts / Wave Visualizer Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Risk Heatmap */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(123,97,255,0.05)_0%,transparent_70%)]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-accent-purple">
              <Map className="w-5 h-5" />
              <h3 className="text-display text-lg font-bold text-white">Dynamic Global Risk Matrix</h3>
            </div>
            
            <Link 
              href="/docs" 
              className="text-sans text-xs text-white/40 hover:text-gold flex items-center gap-1"
            >
              Learn about oracles <HelpCircle className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Holographic matrix grids */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 py-4">
            {[...Array(32)].map((_, idx) => {
              const pulse = idx % 9 === 0;
              const intensity = (idx * 17) % 100;
              return (
                <div 
                  key={idx} 
                  className={`h-12 rounded-xl flex items-center justify-center border transition-all ${
                    pulse ? "bg-accent-purple/20 border-accent-purple shadow-[0_0_15px_rgba(123,97,255,0.3)] animate-pulse" :
                    intensity > 70 ? "bg-gold/10 border-gold/30 text-gold" :
                    "bg-white/5 border-white/10 text-white/40"
                  }`}
                >
                  <span className="text-[10px] font-mono">{intensity}%</span>
                </div>
              );
            })}
          </div>

          <p className="text-sans text-xs text-white/50 leading-relaxed border-t border-white/5 pt-4">
            Risk scores represent on-chain invoice payment delays, counterparties default probabilities, and industry sectors volatility monitored in real-time by decentralized attestation nodes.
          </p>
        </div>

        {/* Column 3: Sector Allocations */}
        <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
          <h3 className="text-display text-sm font-bold text-white uppercase tracking-wider">
            Sector Division Allocations
          </h3>

          <div className="flex flex-col gap-4 mt-2">
            {Object.entries(sectors).map(([name, count]) => {
              const pct = Math.round((count / totalInvoices) * 100);
              return (
                <div key={name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white">{name}</span>
                    <span className="text-gold font-mono">{pct}%</span>
                  </div>
                  <div className="w-full bg-space-black h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gold h-full shadow-[0_0_8px_#D4AF37]" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
