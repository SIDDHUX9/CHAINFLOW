"use client";

import { useFlowStore } from "@/store/useFlowStore";
import { 
  Award, 
  CheckCircle, 
  Users, 
  MessageSquare
} from "lucide-react";
import Link from "@/components/ui/Link";

export default function InvestorProfile() {
  const { activePage } = useFlowStore();
  const id = activePage.split("/investor/")[1] || "GD4KR79LHNSCHMDT";

  // Simulate details for the selected investor profile
  const profile = {
    name: "Hans Schmidt",
    pubKey: "GD4K...R79L",
    company: "Schmidt Capital Berlin",
    bio: "Focused on supply chain financing and cross-border trade invoices. Helping exporters unlock working capital using blockchain technology.",
    score: 98,
    joined: "June 2025",
    totalInvested: 840200,
    activePositions: 14,
    reviews: [
      { author: "Kenya Tea Exporters", text: "Fast funding for tea leaf shipping container invoices. Highly recommended backing partner.", rating: 5 },
      { author: "AeroCargo Logistics", text: "Structured automated financing rules that execute within seconds after oracle attestation checks.", rating: 5 },
    ]
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto animate-fadeIn">
      
      {/* 1. Header card */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-gold/25 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
        {/* Background video loop from motionsites (investors flow) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none z-0 mix-blend-overlay"
        />
        
        {/* Holographic Avatar ring */}
        <div className="w-28 h-28 rounded-full border-2 border-gold/30 flex items-center justify-center bg-[#090910] relative group shadow-md shrink-0 z-10">
          <div className="absolute inset-1.5 rounded-full border border-dashed border-gold/20 animate-spin" style={{ animationDuration: "15s" }} />
          <Users className="w-10 h-10 text-gold" />
        </div>

        <div className="flex flex-col gap-4 text-center md:text-left relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/10 text-[9px] uppercase tracking-widest font-black text-gold">
              <Award className="w-3.5 h-3.5" /> Accredited Backing Partner
            </div>
            <h1 className="text-display text-2xl md:text-4xl font-black mt-3 text-white leading-tight">{profile.name}</h1>
            <p className="text-sans text-[10px] text-white/40 mt-1 uppercase tracking-widest font-mono">
              Ledger Address: {profile.pubKey}
            </p>
          </div>

          <p className="text-sans text-xs text-white/70 leading-relaxed max-w-lg">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* 2. Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 text-center">
          <span className="text-[10px] uppercase text-white/40 tracking-wider font-bold">Total Supported Capital</span>
          <h3 className="text-display text-2xl font-black text-white mt-1.5 font-mono">
            ${profile.totalInvested.toLocaleString()}
          </h3>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 text-center">
          <span className="text-[10px] uppercase text-white/40 tracking-wider font-bold">Active Assets</span>
          <h3 className="text-display text-2xl font-black text-white mt-1.5 font-mono">
            {profile.activePositions} positions
          </h3>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 text-center">
          <span className="text-[10px] uppercase text-white/40 tracking-wider font-bold">Consensus Reputation</span>
          <h3 className="text-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-teal-400 mt-1.5 font-mono">
            {profile.score}% Perfect
          </h3>
        </div>
      </div>

      {/* 3. Review feeds */}
      <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-gold border-b border-white/5 pb-4">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-display text-sm font-bold text-white uppercase tracking-wider">Backer Reputation Feed</h3>
        </div>

        <div className="flex flex-col gap-4">
          {profile.reviews.map((rev, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#090910] border border-white/5 flex flex-col gap-3 hover:border-gold/15 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-widest">{rev.author}</span>
                <span className="text-sans text-xs text-gold tracking-widest font-mono">
                  {"★".repeat(rev.rating)}
                </span>
              </div>
              <p className="text-sans text-xs text-white/60 leading-relaxed italic">
                “{rev.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
