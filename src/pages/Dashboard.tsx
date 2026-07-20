"use client";

import { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { 
  TrendingUp, 
  Clock, 
  UploadCloud, 
  ArrowUpRight, 
  Filter, 
  Plus,
  Coins,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import Link from "@/components/ui/Link";

export default function Dashboard() {
  const { invoices, activeRole, setActiveRole, investorStats } = useFlowStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [riskValue, setRiskValue] = useState(50);
  const [autoInvest, setAutoInvest] = useState(true);

  // Business Invoice Stats
  const activeInvoices = invoices.filter(inv => inv.status === "active");
  const pendingInvoices = invoices.filter(inv => inv.status === "pending");
  const businessTotalCapital = invoices
    .filter(inv => inv.status === "active" || inv.status === "pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-heading italic text-white/95 text-4xl md:text-6xl tracking-tight leading-[0.85] mb-1">Command Center</h1>
          <p className="text-sans text-xs sm:text-sm text-white/40 uppercase tracking-widest mt-1">
            Soroban Factoring Telemetry & Ledger Control
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex bg-[#090910] border border-white/10 rounded-full p-1 self-stretch md:self-auto shadow-inner">
          <button
            onClick={() => setActiveRole("investor")}
            className={`flex-1 md:flex-initial px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              activeRole === "investor"
                ? "bg-gradient-to-r from-gold-dark to-gold text-space-black shadow-lg"
                : "text-white/40 hover:text-white"
            }`}
          >
            Investor Console
          </button>
          <button
            onClick={() => setActiveRole("business")}
            className={`flex-1 md:flex-initial px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              activeRole === "business"
                ? "bg-gradient-to-r from-gold-dark to-gold text-space-black shadow-lg"
                : "text-white/40 hover:text-white"
            }`}
          >
            Business Console
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {activeRole === "business" ? (
        /* ================= BUSINESS DASHBOARD ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          
          {/* Column 1 & 2 */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl border border-white/5 relative group">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase text-white/40 font-bold">Total Receivables</span>
                <h3 className="text-display text-2xl font-black text-white mt-1.5">
                  ${businessTotalCapital.toLocaleString()}
                </h3>
              </div>
              
              <div className="glass p-6 rounded-2xl border border-white/5 relative group">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-green" />
                <span className="text-[10px] tracking-widest uppercase text-white/40 font-bold font-sans">Active Factoring</span>
                <h3 className="text-display text-2xl font-black text-white mt-1.5">
                  {activeInvoices.length} Invoices
                </h3>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/5 relative group">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase text-white/40 font-bold">Awaiting Oracle</span>
                <h3 className="text-display text-2xl font-black text-white mt-1.5">
                  {pendingInvoices.length} Invoices
                </h3>
              </div>
            </div>

            {/* High-Tech Drag & Drop Upload Portal */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`glass p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${
                dragActive ? "border-gold bg-[#141423] scale-[0.99]" : "border-white/10 hover:border-gold/30"
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#090910] flex items-center justify-center border border-white/10 mb-4 animate-float">
                <UploadCloud className="w-6 h-6 text-gold" />
              </div>
              
              {uploadFile ? (
                <div className="flex flex-col gap-2 relative z-10 animate-fadeIn">
                  <span className="text-sans text-[10px] text-accent-green font-black uppercase tracking-wider">
                    OCR Contract Scan Complete
                  </span>
                  <p className="text-display text-sm font-black text-white px-4 py-2 rounded-lg bg-[#090910] border border-white/5 mt-1">
                    {uploadFile}
                  </p>
                  <Link
                    href="/create"
                    className="mt-5 px-8 py-3 rounded-full bg-gold hover:bg-gold-light text-space-black text-xs font-black uppercase tracking-wider inline-block transition-transform hover:scale-105"
                  >
                    Proceed to Tokenize
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 relative z-10">
                  <h4 className="text-display text-lg font-bold text-white">
                    Secure Invoice Ingestion Chamber
                  </h4>
                  <p className="text-sans text-xs text-white/50 max-w-sm leading-relaxed mx-auto">
                    Drag and drop commercial invoices (PDF, XML, or images). The Stellar oracle model will parse counterparties, maturity, and ledger values.
                  </p>
                  <Link
                    href="/create"
                    className="mt-4 text-xs font-bold text-gold flex items-center justify-center gap-1.5 self-center hover:text-gold-light transition-colors"
                  >
                    Or tokenize manually <Plus className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Active Invoices List */}
            <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
              <h3 className="text-display text-lg font-bold text-white uppercase tracking-wider">Your Factored Ledger</h3>
              
              <div className="flex flex-col gap-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="p-5 rounded-xl bg-[#090910] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold/15 transition-all">
                    <div>
                      <h4 className="text-sans text-sm font-bold text-white">{inv.title}</h4>
                      <p className="text-sans text-[10px] text-white/40 mt-1 uppercase font-mono">
                        Asset ID: {inv.id} • Counterparty: {inv.counterparty}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-sans text-xs font-bold text-white">${inv.amount.toLocaleString()}</span>
                        <p className="text-sans text-[9px] text-gold mt-0.5">{inv.yieldRate}% APY</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          inv.status === "active" ? "bg-accent-green/5 text-accent-green border-accent-green/20" :
                          inv.status === "pending" ? "bg-yellow-500/5 text-yellow-500 border-yellow-500/20" :
                          "bg-accent-red/5 text-accent-red border-accent-red/20"
                        }`}>
                          {inv.status}
                        </span>

                        <Link 
                          href={`/invoice/${inv.id}`}
                          className="p-2.5 rounded-full border border-white/10 hover:border-gold/30 text-white hover:text-gold transition-colors bg-[#0D0D15]"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3 (Sidebar) */}
          <div className="flex flex-col gap-8">
            
            {/* Cash Flow Projection (Towers) */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-display text-xs font-bold text-white uppercase tracking-widest">
                Cash Flow Projection
              </h3>
              
              <div className="h-44 flex items-end justify-between gap-2 px-2 pt-6">
                {[45, 68, 82, 59, 98, 125].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div 
                      className="w-full bg-gradient-to-t from-gold-dark via-gold to-gold-light rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.1)] relative group"
                      style={{ height: `${(h / 125) * 100}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#12121E] border border-white/10 text-white text-[8px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {h}k
                      </div>
                    </div>
                    <span className="text-[9px] text-white/40 uppercase font-mono">M{i+1}</span>
                  </div>
                ))}
              </div>
              <p className="text-sans text-[10px] text-white/50 leading-relaxed border-t border-white/5 pt-4 mt-2">
                Accelerating factored receivables by an average of 54.2 days relative to standard net-90 credit loops.
              </p>
            </div>

            {/* Countdown Settlement timer */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-gold">
                <Clock className="w-4 h-4" />
                <h3 className="text-display text-xs font-bold uppercase tracking-widest">Next Settlement Block</h3>
              </div>

              <div className="flex justify-center gap-3 py-2">
                {[
                  { val: "08", label: "Days" },
                  { val: "14", label: "Hours" },
                  { val: "32", label: "Minutes" }
                ].map((unit, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-[#090910] border border-white/10 flex items-center justify-center text-display text-2xl font-black text-white">
                      {unit.val}
                    </div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest mt-1.5">{unit.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= INVESTOR DASHBOARD ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          
          {/* Column 1 & 2 */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Investor Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl border border-white/5 relative">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold" />
                <span className="text-[10px] tracking-wider uppercase text-white/40 font-bold">Total Supported Capital</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1.5">
                  ${investorStats.totalInvested.toLocaleString()}
                </h3>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 relative">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-green" />
                <span className="text-[10px] tracking-wider uppercase text-white/40 font-bold">Returns Accrued</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1.5">
                  +${investorStats.returnsEarned.toLocaleString()}
                </h3>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 relative">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-purple" />
                <span className="text-[10px] tracking-wider uppercase text-white/40 font-bold">Freighter Wallet Balance</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1.5">
                  {investorStats.walletBalance.toLocaleString()} XLM
                </h3>
              </div>
            </div>

            {/* Performance Chart Simulation (High Fidelity Upgrade) */}
            <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gold" />
                  <h3 className="text-display text-base font-bold text-white uppercase tracking-wider">Portfolio Yield Performance</h3>
                </div>
                <span className="text-sans text-xs text-accent-green font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +11.4% Avg APY
                </span>
              </div>
              
              {/* SVG Area Chart with labels and grid */}
              <div className="w-full h-52 relative flex flex-col justify-between">
                {/* Horizontal grid markings */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-8">
                  <div className="w-full border-t border-white/5 flex justify-between text-[8px] text-white/30 font-mono pt-1">
                    <span>15% APY</span>
                    <span>JULY 2026</span>
                  </div>
                  <div className="w-full border-t border-white/5 flex justify-between text-[8px] text-white/30 font-mono pt-1">
                    <span>10% APY</span>
                    <span>JUNE 2026</span>
                  </div>
                  <div className="w-full border-t border-white/5 flex justify-between text-[8px] text-white/30 font-mono pt-1">
                    <span>5% APY</span>
                    <span>MAY 2026</span>
                  </div>
                  <div className="w-full border-b border-white/5 flex justify-between text-[8px] text-white/30 font-mono pb-1">
                    <span>0% APY</span>
                    <span>APRIL 2026</span>
                  </div>
                </div>

                <svg className="w-full h-full relative z-10" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Glowing Area Fill */}
                  <path 
                    d="M0,180 Q100,135 200,150 T400,90 T600,55 L600,200 L0,200 Z" 
                    fill="url(#chartGlow)" 
                  />
                  
                  {/* Main Line */}
                  <path 
                    d="M0,180 Q100,135 200,150 T400,90 T600,55" 
                    fill="none" 
                    stroke="#D4AF37" 
                    strokeWidth="3.5" 
                  />

                  {/* Active tracker coordinates point */}
                  <circle cx="600" cy="55" r="5" fill="#F3E5AB" />
                  <circle cx="600" cy="55" r="11" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: "600px 55px" }} />
                </svg>
              </div>
            </div>

            {/* Marketplace Preview List */}
            <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="text-display text-base font-bold text-white uppercase tracking-wider">Marketplace Opportunities</h3>
                <Link href="/marketplace" className="text-sans text-xs text-gold hover:underline font-bold uppercase tracking-wider">
                  Browse Exchange
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {invoices.filter(i => i.status === "active").slice(0, 3).map((inv) => (
                  <div key={inv.id} className="p-5 rounded-xl bg-[#090910] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold/15 transition-all">
                    <div>
                      <span className="text-[9px] text-gold uppercase tracking-widest font-black">{inv.industry}</span>
                      <h4 className="text-sans text-sm font-bold text-white mt-0.5">{inv.title}</h4>
                    </div>

                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-sans text-xs font-bold text-white">${inv.amount.toLocaleString()}</span>
                        <p className="text-sans text-[9px] text-accent-green mt-0.5">{inv.yieldRate}% APY</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/40 font-mono">
                          {inv.availableFractions} / {inv.fractionCount} slots left
                        </span>
                        <Link 
                          href={`/invoice/${inv.id}`}
                          className="px-5 py-2 rounded-full bg-gold hover:bg-gold-light text-space-black text-[10px] font-black uppercase tracking-wider transition-all"
                        >
                          Invest
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3 (Sidebar) */}
          <div className="flex flex-col gap-8">
            
            {/* Risk Filters & Allocation */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-5">
              <div className="flex items-center gap-2 text-gold">
                <Filter className="w-4 h-4" />
                <h3 className="text-display text-xs font-bold uppercase tracking-widest">Risk Allocation Model</h3>
              </div>

              <div className="flex flex-col gap-3 mt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Maximum Risk Index</span>
                  <span className="font-mono text-gold font-bold">{riskValue}%</span>
                </div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={riskValue} 
                  onChange={(e) => setRiskValue(Number(e.target.value))}
                  className="w-full accent-gold bg-[#090910] border border-white/10 h-1.5 rounded-full outline-none cursor-pointer"
                />
                
                <div className="flex justify-between text-[9px] text-white/40 font-mono mt-1">
                  <span>CONSERVATIVE</span>
                  <span>BALANCED</span>
                  <span>AGGRESSIVE</span>
                </div>
              </div>

              <p className="text-sans text-[10px] text-white/40 leading-relaxed border-t border-white/5 pt-4 mt-2">
                Limits exposure to counterparties with higher probability-of-default oracles and ledger delays.
              </p>
            </div>

            {/* Auto Factoring Rules */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-accent-purple">
                <Coins className="w-4 h-4" />
                <h3 className="text-display text-xs font-bold uppercase tracking-widest font-sans">Automated Backer Settings</h3>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Enable Auto-Liquidity</span>
                  <button 
                    onClick={() => setAutoInvest(!autoInvest)}
                    className={`w-10 h-5 rounded-full border transition-colors flex items-center p-0.5 ${
                      autoInvest ? "bg-gold/20 border-gold" : "bg-[#090910] border-white/20"
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-gold transition-transform ${
                      autoInvest ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                  <span className="text-white/60">Cap Per Allocation</span>
                  <span className="font-mono text-gold font-bold">500 XLM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
