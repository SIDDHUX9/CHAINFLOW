"use client";

import { useFlowStore } from "@/store/useFlowStore";
import { 
  Building, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowLeft,
  Activity,
  Award
} from "lucide-react";
import Link from "@/components/ui/Link";

export default function InvoiceDetail() {
  const { activePage, invoices } = useFlowStore();
  const setPage = useFlowStore((state) => state.setPage);

  // Extract ID from the activePage URI structure
  const pathId = activePage.split("/invoice/")[1];
  const invoice = invoices.find(inv => inv.id === pathId) || invoices[0];

  const handleBack = () => {
    setPage("/marketplace");
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="self-start text-xs font-bold text-white/50 hover:text-gold flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Exchange
      </button>

      {/* Invoice Overview Card */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-gold/15 relative overflow-hidden flex flex-col md:flex-row justify-between gap-8 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]">
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-[10px] uppercase text-gold tracking-widest font-bold">
              {invoice.industry} Sector
            </span>
            <h1 className="text-display text-2xl md:text-4xl font-black text-white mt-1">
              {invoice.title}
            </h1>
            <p className="text-sans text-xs text-white/40 mt-1 uppercase font-mono">
              Soroban Asset ID: {invoice.id}
            </p>
          </div>

          <p className="text-sans text-xs text-white/70 max-w-xl leading-relaxed">
            {invoice.description || "Tokenized commercial receivable factoring asset backed by verified shipping logs and attestation oracle networks on the Stellar blockchain."}
          </p>

          <div className="flex items-center gap-3 text-xs text-white/60">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gold" /> {invoice.country}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gold" /> Due {invoice.dueDate}</span>
          </div>
        </div>

        {/* Factoring Pricing Callout */}
        <div className="p-6 rounded-2xl bg-space-black border border-gold/20 flex flex-col justify-between items-center md:items-end text-center md:text-right shrink-0 min-w-[200px] shadow-[0_0_20px_rgba(212,175,55,0.05)]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Invoice Value</span>
            <span className="text-display text-2xl font-black text-white">${invoice.amount.toLocaleString()}</span>
          </div>

          <div className="flex flex-col gap-0.5 mt-4">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Annual Yield Rate</span>
            <span className="text-display text-2xl font-black text-accent-green">{invoice.yieldRate}% APY</span>
          </div>
        </div>
      </div>

      {/* Audit Telemetry & Constellation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Column 1: On-Chain Audit Log */}
        <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-gold">
            <Activity className="w-5 h-5" />
            <h3 className="text-display text-base font-bold text-white uppercase tracking-wider">
              On-Chain Audit Timeline
            </h3>
          </div>

          <div className="flex flex-col gap-6 relative pl-6 border-l border-white/10 mt-2">
            {[
              { title: "Invoice Registered", date: "July 15, 2026", desc: "PDF uploaded, OCR metadata compiled.", icon: <Building className="w-3.5 h-3.5 text-gold" /> },
              { title: "Attestation Attended", date: "July 15, 2026", desc: "Bank registries cross-checked by oracle nodes.", icon: <ShieldCheck className="w-3.5 h-3.5 text-accent-purple" /> },
              { title: "Smart Contract Minted", date: "July 16, 2026", desc: "Soroban contract deployed, fractions created.", icon: <Award className="w-3.5 h-3.5 text-accent-green" /> }
            ].map((node, idx) => (
              <div key={idx} className="relative flex flex-col gap-1">
                {/* Timeline node marker */}
                <div className="absolute -left-[33px] top-0.5 w-4 h-4 rounded-full bg-space-black border border-white/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                </div>
                
                <h4 className="text-sans text-sm font-bold text-white">{node.title}</h4>
                <span className="text-sans text-[10px] text-white/40 font-mono uppercase">{node.date}</span>
                <p className="text-sans text-xs text-white/50 leading-relaxed mt-0.5">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Fraction Allocation Details */}
        <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-accent-purple">
            <Award className="w-5 h-5" />
            <h3 className="text-display text-base font-bold text-white uppercase tracking-wider">
              Fraction Allocations
            </h3>
          </div>

          <div className="flex flex-col gap-4 text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">Total Minted Fractions:</span>
              <span className="text-white font-bold">{invoice.fractionCount} slots</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Price per fraction:</span>
              <span className="text-gold font-bold">${invoice.fractionPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Available for backing:</span>
              <span className="text-white font-bold">{invoice.availableFractions} slots remaining</span>
            </div>

            <div className="w-full bg-space-black h-2 rounded-full overflow-hidden border border-white/5 mt-4">
              <div 
                className="bg-gold h-full shadow-[0_0_8px_#D4AF37]" 
                style={{ width: `${(invoice.availableFractions / invoice.fractionCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
