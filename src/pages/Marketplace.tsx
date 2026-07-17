"use client";

import { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { 
  Search, 
  MapPin, 
  Percent, 
  ShieldCheck, 
  X,
  CreditCard,
  CheckCircle,
  Globe
} from "lucide-react";
import Link from "@/components/ui/Link";
import confetti from "canvas-confetti";

export default function Marketplace() {
  const { invoices, investInInvoice, setCursorHovered } = useFlowStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  
  // Dynamic 3D Globe map toggle (shows capital curves & pins on geographic coordinates)
  const [showGlobeView, setShowGlobeView] = useState(false);
  
  // Selected Invoice for investing popup
  const [activeDetailsInvoice, setActiveDetailsInvoice] = useState<string | null>(null);
  const [fractionAmount, setFractionAmount] = useState(1);
  const [investSuccess, setInvestSuccess] = useState(false);
  const [signingTransaction, setSigningTransaction] = useState(false);

  const selectedInvoice = invoices.find(inv => inv.id === activeDetailsInvoice);

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (inv.status !== "active") return false;
    const matchesSearch = inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.counterparty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustry ? inv.industry === selectedIndustry : true;
    return matchesSearch && matchesIndustry;
  });

  const industries = ["Agriculture", "Logistics", "Textiles", "Energy", "Technology"];

  const handleInvest = async () => {
    if (!selectedInvoice) return;
    setSigningTransaction(true);

    try {
      // Simulate Freighter wallet transaction signing latency
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = await investInInvoice(selectedInvoice.id, fractionAmount);
      if (success) {
        setInvestSuccess(true);
        // Trigger Liquid Gold particle explosion confetti!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#AA7C11", "#FFDF73", "#1A1A3E", "#7B61FF"]
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSigningTransaction(false);
    }
  };

  const closeInvestmentModal = () => {
    setActiveDetailsInvoice(null);
    setInvestSuccess(false);
    setFractionAmount(1);
  };

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header and View Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-display text-3xl md:text-5xl font-black">Capital Liquidity Exchange</h1>
          <p className="text-sans text-xs sm:text-sm text-white/50 uppercase tracking-widest mt-1">
            Soroban verified tokenized assets
          </p>
        </div>

        {/* Globe View Toggle */}
        <button
          onClick={() => setShowGlobeView(!showGlobeView)}
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2 transition-all duration-300 ${
            showGlobeView 
              ? "bg-gradient-to-r from-gold-dark to-gold text-space-black border-transparent shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
              : "border-white/10 text-white/80 hover:border-gold/30 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" /> {showGlobeView ? "Hide Interactive Globe" : "Show On-Chain Globe Map"}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-space-black/50 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex-1 flex items-center gap-3 bg-space-black/60 border border-white/10 px-4 py-2 rounded-xl">
          <Search className="w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search by counterparty, issuer, dynamic attributes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedIndustry(null)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedIndustry === null 
                ? "bg-white/10 text-white border border-white/20" 
                : "bg-transparent text-white/60 border border-white/5 hover:border-white/15"
            }`}
          >
            All Sectors
          </button>
          
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedIndustry === ind 
                  ? "bg-gold/15 text-gold border border-gold/30" 
                  : "bg-transparent text-white/60 border border-white/5 hover:border-white/15"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content / Map View */}
      {showGlobeView ? (
        <div className="glass h-[50vh] rounded-3xl border border-gold/15 flex items-center justify-center relative overflow-hidden select-none bg-[radial-gradient(circle_at_center,rgba(26,26,62,0.3)_0%,transparent_70%)]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-space-black/45 z-10">
            <h3 className="text-display text-xl font-bold text-white mb-2">3D Globe Visualization Engaged</h3>
            <p className="text-sans text-xs text-white/60 max-w-sm leading-relaxed">
              Drag on the background to rotate the planet. Glowing gold connection curves represent active capital paths between business exporters and global backers.
            </p>
            <div className="flex gap-3 mt-6">
              {filteredInvoices.map((inv) => (
                <div key={inv.id} className="px-3 py-1.5 rounded-full bg-space-black border border-gold/20 text-[9px] font-bold text-gold uppercase tracking-wider">
                  📍 {inv.country} (${inv.amount.toLocaleString()})
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Invoice Cards Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="glass p-6 rounded-3xl border border-white/5 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] group transition-all duration-300 relative flex flex-col justify-between min-h-[360px]"
              >
                {/* Sector Header */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[9px] tracking-wider uppercase font-bold text-gold">
                      {inv.industry}
                    </span>
                    <span className="text-display text-base font-bold text-white mt-1 group-hover:text-gold transition-colors">
                      {inv.title}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-white/40 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-dark" /> {inv.countryCode}
                  </span>
                </div>

                {/* Capital Metrics */}
                <div className="my-6 py-4 border-t border-b border-white/5 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] tracking-wider text-white/40 uppercase">Invoice Value</span>
                    <span className="text-display text-lg font-bold text-white">${inv.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-right">
                    <span className="text-[9px] tracking-wider text-white/40 uppercase">Est. Yield (APY)</span>
                    <span className="text-display text-lg font-bold text-accent-green flex items-center justify-end gap-0.5">
                      <Percent className="w-3.5 h-3.5" /> {inv.yieldRate}%
                    </span>
                  </div>
                </div>

                {/* Risk score and progress bar */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40 uppercase font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-purple" /> Risk Telemetry
                    </span>
                    <span className="font-mono font-bold text-accent-purple">{inv.riskScore}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-space-black h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-accent-purple h-full shadow-[0_0_10px_#7B61FF]" 
                      style={{ width: `${inv.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Fraction Details and CTAs */}
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/30 uppercase">Fraction Price</span>
                    <span className="text-sans text-xs font-bold text-white">
                      ${inv.fractionPrice} / fract.
                    </span>
                    <span className="text-[9px] text-white/40 mt-0.5">
                      {inv.availableFractions} of {inv.fractionCount} left
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/invoice/${inv.id}`}
                      className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-wider text-white"
                    >
                      Audit
                    </Link>
                    <button
                      onClick={() => setActiveDetailsInvoice(inv.id)}
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-gold-dark to-gold text-space-black text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all"
                    >
                      Invest
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-white/50 text-xs">
              No matching on-chain tokenized opportunities found.
            </div>
          )}
        </div>
      )}

      {/* INVESTMENT DETAILED WIZARD MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/85 backdrop-blur-md">
          <div className="glass w-full max-w-xl rounded-3xl border border-gold/20 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-popup">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-space-black/50">
              <div>
                <span className="text-[9px] text-gold uppercase tracking-wider font-bold">Invest Fractions</span>
                <h3 className="text-display text-base font-bold text-white mt-1">{selectedInvoice.title}</h3>
              </div>
              <button 
                onClick={closeInvestmentModal}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6">
              {investSuccess ? (
                /* Success Portal View */
                <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center border border-accent-green/30 animate-pulse">
                    <CheckCircle className="w-8 h-8 text-accent-green" />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <h4 className="text-display text-lg font-black text-white">Investment Confirmed</h4>
                    <p className="text-sans text-xs text-white/60 max-w-sm">
                      Signed via Freighter Wallet. Ledger hash updated. Your yield begins accruing immediately on-chain.
                    </p>
                  </div>

                  <div className="w-full bg-space-black/50 p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs mt-2">
                    <span className="text-white/40">Fractions Purchased:</span>
                    <span className="font-bold text-white">{fractionAmount} Fractions</span>
                  </div>

                  <button
                    onClick={closeInvestmentModal}
                    className="w-full mt-4 py-3 rounded-full bg-gold text-space-black text-xs font-bold uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Standard Purchase View */
                <>
                  {/* Ledger statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-space-black/50 border border-white/5">
                      <span className="text-[9px] text-white/40 uppercase">Total Available</span>
                      <p className="text-sans text-xs font-bold text-white mt-0.5">
                        {selectedInvoice.availableFractions} Fractions
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-space-black/50 border border-white/5">
                      <span className="text-[9px] text-white/40 uppercase">Price Per Fraction</span>
                      <p className="text-sans text-xs font-bold text-gold mt-0.5">
                        ${selectedInvoice.fractionPrice}
                      </p>
                    </div>
                  </div>

                  {/* Range counter */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <span>Fractions to purchase:</span>
                      <span className="font-bold text-gold font-mono">{fractionAmount} Fractions</span>
                    </div>

                    <input 
                      type="range"
                      min="1"
                      max={selectedInvoice.availableFractions}
                      value={fractionAmount}
                      onChange={(e) => setFractionAmount(parseInt(e.target.value))}
                      className="w-full accent-gold bg-space-black h-1.5 rounded-full outline-none appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Calculations waterfall */}
                  <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Fractional Subtotal:</span>
                      <span>${(fractionAmount * selectedInvoice.fractionPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Soroban Processing Fee:</span>
                      <span className="text-accent-green">&lt; 0.0001 XLM</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold border-t border-white/5 pt-2 mt-1">
                      <span>Total Estimated Cost:</span>
                      <span className="text-gold">${(fractionAmount * selectedInvoice.fractionPrice).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleInvest}
                    disabled={signingTransaction}
                    className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-gold-dark to-gold text-space-black text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2"
                  >
                    {signingTransaction ? (
                      <>
                        <div className="w-4 h-4 border-2 border-space-black border-t-transparent rounded-full animate-spin" />
                        <span>Signing with Freighter...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Sign & Invest via Freighter</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
