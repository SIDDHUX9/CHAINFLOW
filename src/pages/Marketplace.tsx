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
  Globe,
  Award,
  DollarSign
} from "lucide-react";
import Link from "@/components/ui/Link";
import confetti from "canvas-confetti";

export default function Marketplace() {
  const { invoices, investInInvoice, setCursorHovered } = useFlowStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  
  // Dynamic 3D Globe map toggle
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
        // Trigger particle explosion confetti
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.65 },
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-display text-3xl md:text-5xl font-black text-white">Invoice Exchange</h1>
          <p className="text-sans text-xs sm:text-sm text-white/40 uppercase tracking-widest mt-1">
            Soroban Certified Yield-Bearing Assets
          </p>
        </div>

        {/* Globe View Toggle */}
        <button
          onClick={() => setShowGlobeView(!showGlobeView)}
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
          className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-2 transition-all duration-300 ${
            showGlobeView 
              ? "bg-gradient-to-r from-gold-dark to-gold text-space-black border-transparent shadow-lg" 
              : "border-white/10 text-white/80 hover:border-gold/30 hover:text-white bg-[#0A0A0F]"
          }`}
        >
          <Globe className="w-4 h-4" /> {showGlobeView ? "Standard List Console" : "On-Chain Globe Map"}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#090910] border border-white/5 p-4 rounded-2xl shadow-md">
        <div className="flex-1 flex items-center gap-3 bg-[#050508] border border-white/10 px-4 py-2.5 rounded-xl">
          <Search className="w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search counterparties, issuers, ledger IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedIndustry(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedIndustry === null 
                ? "bg-gold/15 text-gold border border-gold/35" 
                : "bg-transparent text-white/40 border border-white/5 hover:border-white/15 hover:text-white"
            }`}
          >
            All Sectors
          </button>
          
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedIndustry === ind 
                  ? "bg-gold/15 text-gold border border-gold/35" 
                  : "bg-transparent text-white/40 border border-white/5 hover:border-white/15 hover:text-white"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content / Map View */}
      {showGlobeView ? (
        <div className="relative h-[60vh] rounded-3xl border border-white/10 flex items-center justify-between p-6 select-none bg-transparent overflow-hidden animate-fadeIn">
          {/* Overlay left: description */}
          <div className="absolute top-6 left-6 p-5 rounded-2xl bg-[#090910]/85 border border-white/10 max-w-xs z-10 shadow-2xl">
            <h3 className="text-display text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gold" /> Ledger Node Globe
            </h3>
            <p className="text-sans text-[10px] text-white/50 leading-relaxed mt-2">
              Visualizing active capital paths. Glowing connections link suppliers to liquidity backing nodes globally across the Stellar network.
            </p>
          </div>

          {/* Overlay right: floating inventory status */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2.5 z-10 max-h-[80%] overflow-y-auto pr-2">
            {filteredInvoices.map((inv) => (
              <div key={inv.id} className="px-4 py-3 rounded-xl bg-[#0D0D15]/95 border border-gold/25 text-[10px] text-white flex flex-col gap-1.5 w-52 shadow-xl hover:border-gold transition-colors">
                <div className="flex justify-between font-bold">
                  <span className="text-gold uppercase tracking-widest">{inv.country}</span>
                  <span className="font-mono text-white">${inv.amount.toLocaleString()}</span>
                </div>
                <span className="text-white/40 truncate">{inv.title}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Invoice Cards Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="glass p-7 rounded-3xl border border-white/5 hover:border-gold/30 hover:shadow-[0_12px_30px_-10px_rgba(212,175,55,0.06)] group transition-all duration-300 relative flex flex-col justify-between min-h-[380px]"
              >
                {/* Certificate-style Header */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[9px] tracking-widest uppercase font-black text-gold">
                      {inv.industry} Sector
                    </span>
                    <span className="text-display text-base font-extrabold text-white mt-1.5 group-hover:text-gold transition-colors leading-tight">
                      {inv.title}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-white/40 flex items-center gap-1 bg-[#090910] border border-white/5 px-2.5 py-1 rounded-full font-mono">
                    <MapPin className="w-3 h-3 text-gold" /> {inv.countryCode}
                  </span>
                </div>

                {/* Capital Metrics */}
                <div className="my-6 py-4.5 border-t border-b border-white/5 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] tracking-wider text-white/40 uppercase font-bold">Invoice Principal</span>
                    <span className="text-display text-lg font-black text-white">${inv.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[9px] tracking-wider text-white/40 uppercase font-bold">Projected Yield</span>
                    <span className="text-display text-lg font-black text-accent-green flex items-center justify-end gap-0.5">
                      <Percent className="w-3.5 h-3.5" /> {inv.yieldRate}%
                    </span>
                  </div>
                </div>

                {/* Risk telemetry indicators */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40 uppercase font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-accent-purple" /> Risk Index
                    </span>
                    <span className="font-mono font-bold text-accent-purple">{inv.riskScore}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#05050A] h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-accent-purple h-full shadow-[0_0_10px_#7B61FF]" 
                      style={{ width: `${inv.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Fraction Details */}
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/30 uppercase font-bold">Fraction Unit</span>
                    <span className="text-sans text-xs font-bold text-white mt-0.5">
                      ${inv.fractionPrice} / fract.
                    </span>
                    <span className="text-[9px] text-white/40 mt-1">
                      {inv.availableFractions} of {inv.fractionCount} open
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/invoice/${inv.id}`}
                      className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-wider text-white bg-[#0A0A0F]"
                    >
                      Audit
                    </Link>
                    <button
                      onClick={() => setActiveDetailsInvoice(inv.id)}
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-gold-dark to-gold text-space-black text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Invest
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-white/40 text-xs border border-dashed border-white/10 rounded-3xl bg-[#090910]">
              No active on-chain factoring assets match your search parameters.
            </div>
          )}
        </div>
      )}

      {/* INVESTMENT DETAILED WIZARD MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="glass w-full max-w-xl rounded-3xl border border-gold/25 overflow-hidden relative shadow-2xl animate-popup">
            {/* Background video loop from motionsites (web3 abstract flow) */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
              className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none z-0"
            />
            <div className="relative z-10 w-full h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#090910]">
              <div>
                <span className="text-[9px] text-gold uppercase tracking-widest font-black flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> SECURE CHECKOUT PORTAL
                </span>
                <h3 className="text-display text-base font-bold text-white mt-1">{selectedInvoice.title}</h3>
              </div>
              <button 
                onClick={closeInvestmentModal}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6">
              {investSuccess ? (
                /* Success Portal View */
                <div className="flex flex-col items-center justify-center text-center py-6 gap-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center border border-accent-green/30 animate-pulse">
                    <CheckCircle className="w-8 h-8 text-accent-green" />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <h4 className="text-display text-lg font-black text-white">Investment Authenticated</h4>
                    <p className="text-sans text-xs text-white/50 max-w-sm">
                      Signed via Freighter Wallet. Ledger sequence verified. Your fractional interest yields accrue immediately.
                    </p>
                  </div>

                  <div className="w-full bg-[#090910] p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs mt-2 font-mono">
                    <span className="text-white/40">Fractions Acquired:</span>
                    <span className="font-bold text-gold">{fractionAmount} slots</span>
                  </div>

                  <button
                    onClick={closeInvestmentModal}
                    className="w-full mt-4 py-3.5 rounded-full bg-gold text-space-black text-xs font-black uppercase tracking-widest"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Standard Purchase View */
                <>
                  {/* Ledger stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#090910] border border-white/5">
                      <span className="text-[9px] text-white/40 uppercase font-bold">Fractions Available</span>
                      <p className="text-sans text-xs font-bold text-white mt-1">
                        {selectedInvoice.availableFractions} slots
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#090910] border border-white/5">
                      <span className="text-[9px] text-white/40 uppercase font-bold">Fraction Price</span>
                      <p className="text-sans text-xs font-bold text-gold mt-1">
                        ${selectedInvoice.fractionPrice} USD
                      </p>
                    </div>
                  </div>

                  {/* Range counter */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-white/60">Fractions to purchase:</span>
                      <span className="font-bold text-gold font-mono">{fractionAmount} Fractions</span>
                    </div>

                    <input 
                      type="range"
                      min="1"
                      max={selectedInvoice.availableFractions}
                      value={fractionAmount}
                      onChange={(e) => setFractionAmount(parseInt(e.target.value))}
                      className="w-full accent-gold bg-[#090910] border border-white/10 h-1.5 rounded-full outline-none cursor-pointer"
                    />
                  </div>

                  {/* Calculations invoice receipt */}
                  <div className="flex flex-col gap-3 border-t border-white/5 pt-4 bg-[#090910] p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-bold">Fractional Subtotal:</span>
                      <span className="font-mono text-white">${(fractionAmount * selectedInvoice.fractionPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 font-bold">Soroban Ledger Fee:</span>
                      <span className="text-accent-green font-mono font-bold">&lt; 0.0001 XLM</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold border-t border-white/5 pt-3 mt-1.5">
                      <span className="text-white flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-gold" /> Total Estimated Cost
                      </span>
                      <span className="text-gold font-mono font-black">${(fractionAmount * selectedInvoice.fractionPrice).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleInvest}
                    disabled={signingTransaction}
                    className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-gold-dark to-gold text-space-black text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                  >
                    {signingTransaction ? (
                      <>
                        <div className="w-4 h-4 border-2 border-space-black border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing Wallet Transaction...</span>
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
        </div>
      )}
    </div>
  );
}
