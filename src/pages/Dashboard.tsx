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
  Coins
} from "lucide-react";
import Link from "@/components/ui/Link";

export default function Dashboard() {
  const { invoices, activeRole, setActiveRole, investorStats } = useFlowStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState<string | null>(null);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-display text-3xl md:text-5xl font-black">Command Center</h1>
          <p className="text-sans text-xs sm:text-sm text-white/50 uppercase tracking-widest mt-1">
            Real-time Portfolio Overview
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex bg-space-black border border-white/10 rounded-full p-1 self-stretch md:self-auto">
          <button
            onClick={() => setActiveRole("investor")}
            className={`flex-1 md:flex-initial px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeRole === "investor"
                ? "bg-gradient-to-r from-gold-dark to-gold text-space-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Investor
          </button>
          <button
            onClick={() => setActiveRole("business")}
            className={`flex-1 md:flex-initial px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeRole === "business"
                ? "bg-gradient-to-r from-gold-dark to-gold text-space-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Business
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {activeRole === "business" ? (
        /* ================= BUSINESS DASHBOARD ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2 */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] tracking-wider uppercase text-gold">Total Invoice Value</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1">
                  ${businessTotalCapital.toLocaleString()}
                </h3>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] tracking-wider uppercase text-accent-green">Active Factoring</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1">
                  {activeInvoices.length} Invoices
                </h3>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] tracking-wider uppercase text-accent-purple">Pending Oracle</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1">
                  {pendingInvoices.length} Invoices
                </h3>
              </div>
            </div>

            {/* Drag & Drop Upload Portal */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`glass p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${
                dragActive ? "border-gold bg-gold/5 scale-[0.99]" : "border-white/10 hover:border-gold/30"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-space-black flex items-center justify-center border border-white/10 mb-4 animate-float">
                <UploadCloud className="w-6 h-6 text-gold" />
              </div>
              
              {uploadFile ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sans text-xs text-accent-green font-bold uppercase tracking-wider">
                    OCR Scan Complete
                  </span>
                  <p className="text-display text-sm font-bold text-white">
                    {uploadFile}
                  </p>
                  <Link
                    href="/create"
                    className="mt-4 px-6 py-2.5 rounded-full bg-gold text-space-black text-[10px] uppercase font-bold tracking-wider inline-block"
                  >
                    Proceed to Tokenize
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <h4 className="text-display text-lg font-bold text-white">
                    Drag and drop invoice document
                  </h4>
                  <p className="text-sans text-xs text-white/50 max-w-sm leading-relaxed">
                    Supports PDFs, XMLs or images. Our oracle automatically extracts counterparty, issue date, and amount.
                  </p>
                  <Link
                    href="/create"
                    className="mt-4 text-xs font-bold text-gold flex items-center gap-1 self-center hover:underline"
                  >
                    Or tokenize manually <Plus className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Active Invoices List */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-display text-lg font-bold text-white">Your Factored Invoices</h3>
              
              <div className="flex flex-col gap-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-xl bg-space-black/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sans text-sm font-bold text-white">{inv.title}</h4>
                      <p className="text-sans text-[10px] text-white/40 mt-0.5">
                        Issuer: {inv.issuer} • Counterparty: {inv.counterparty}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-sans text-xs font-bold text-white">${inv.amount.toLocaleString()}</span>
                        <p className="text-sans text-[9px] text-gold mt-0.5">{inv.yieldRate}% APY</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          inv.status === "active" ? "bg-accent-green/10 text-accent-green border border-accent-green/20" :
                          inv.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                          "bg-accent-red/10 text-accent-red border border-accent-red/20"
                        }`}>
                          {inv.status}
                        </span>

                        <Link 
                          href={`/invoice/${inv.id}`}
                          className="p-2 rounded-full border border-white/10 hover:border-gold/30 text-white hover:text-gold transition-colors"
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
            {/* Cash Flow Projection (3D simulation bar chart) */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-display text-sm font-bold text-white uppercase tracking-wider">
                Cash Flow Projection
              </h3>
              
              <div className="h-44 flex items-end justify-between gap-2 px-2 pt-4">
                {[40, 65, 80, 55, 95, 120].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-gold-dark via-gold to-gold-light rounded-t-sm shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-white/40 uppercase font-mono">M{i+1}</span>
                  </div>
                ))}
              </div>
              <p className="text-sans text-[10px] text-white/50 leading-relaxed">
                Projected cash flows show acceleration of receivables by an average of 54 days using programmable factoring.
              </p>
            </div>

            {/* Countdown Settlement timer */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-gold">
                <Clock className="w-4 h-4" />
                <h3 className="text-display text-sm font-bold uppercase tracking-wider">Next Settlement</h3>
              </div>

              <div className="flex justify-center gap-3 py-2">
                {[
                  { val: "08", label: "Days" },
                  { val: "14", label: "Hrs" },
                  { val: "32", label: "Min" }
                ].map((unit, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-lg bg-space-black border border-gold/20 flex items-center justify-center text-display text-2xl font-black text-gold">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2 */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Investor Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col">
                <span className="text-[10px] tracking-wider uppercase text-gold">Total Invested</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1">
                  ${investorStats.totalInvested.toLocaleString()}
                </h3>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col">
                <span className="text-[10px] tracking-wider uppercase text-accent-green">Earned Returns</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1">
                  +${investorStats.returnsEarned.toLocaleString()}
                </h3>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col">
                <span className="text-[10px] tracking-wider uppercase text-accent-purple">Wallet Balance</span>
                <h3 className="text-display text-2xl font-bold text-white mt-1">
                  {investorStats.walletBalance.toLocaleString()} XLM
                </h3>
              </div>
            </div>

            {/* Performance Chart Simulation */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-display text-lg font-bold text-white">Portfolio Yield Performance</h3>
                <span className="text-sans text-xs text-accent-green font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +11.4% Avg APY
                </span>
              </div>
              
              {/* SVG Area Chart */}
              <div className="w-full h-48 pt-4">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  
                  {/* Glowing Area Fill */}
                  <path 
                    d="M0,180 Q100,140 200,150 T400,80 T600,60 L600,200 L0,200 Z" 
                    fill="url(#chartGlow)" 
                  />
                  
                  {/* Main Line */}
                  <path 
                    d="M0,180 Q100,140 200,150 T400,80 T600,60" 
                    fill="none" 
                    stroke="#D4AF37" 
                    strokeWidth="3" 
                  />
                </svg>
              </div>
            </div>

            {/* Marketplace Preview List */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-display text-lg font-bold text-white">Marketplace Opportunities</h3>
                <Link href="/marketplace" className="text-sans text-xs text-gold hover:underline">
                  View All Opportunities
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {invoices.filter(i => i.status === "active").slice(0, 3).map((inv) => (
                  <div key={inv.id} className="p-4 rounded-xl bg-space-black/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] text-gold uppercase tracking-wider font-bold">{inv.industry}</span>
                      <h4 className="text-sans text-sm font-bold text-white">{inv.title}</h4>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-sans text-xs font-bold text-white">${inv.amount.toLocaleString()}</span>
                        <p className="text-sans text-[9px] text-accent-green mt-0.5">{inv.yieldRate}% Yield</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/50">
                          {inv.availableFractions} / {inv.fractionCount} left
                        </span>
                        <Link 
                          href={`/invoice/${inv.id}`}
                          className="px-4 py-1.5 rounded-full bg-gold text-space-black text-[10px] font-bold uppercase tracking-wider"
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
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-gold">
                <Filter className="w-4 h-4" />
                <h3 className="text-display text-sm font-bold uppercase tracking-wider">Risk Profile Filter</h3>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <span className="text-[10px] text-white/50">Maximum Risk Score: 50%</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="50" 
                  className="w-full accent-gold bg-space-black h-1 rounded-full outline-none appearance-none cursor-pointer"
                />
                
                <div className="flex justify-between text-[9px] text-white/40 font-mono mt-1">
                  <span>CONSERVATIVE</span>
                  <span>BALANCED</span>
                  <span>AGGRESSIVE</span>
                </div>
              </div>

              <p className="text-sans text-[10px] text-white/50 leading-relaxed mt-2 border-t border-white/5 pt-3">
                Risk assessment is calculated dynamically on-chain using oracle historical payment telemetry.
              </p>
            </div>

            {/* Auto Factoring Rules */}
            <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-accent-purple">
                <Coins className="w-4 h-4" />
                <h3 className="text-display text-sm font-bold uppercase tracking-wider">Auto-Invest Rules</h3>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Enable Auto-Invest</span>
                  <div className="w-8 h-4 rounded-full bg-gold/20 border border-gold/40 flex items-center p-0.5 cursor-pointer">
                    <div className="w-3 h-3 rounded-full bg-gold translate-x-3 transition-transform" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span>Max Per Invoice</span>
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
