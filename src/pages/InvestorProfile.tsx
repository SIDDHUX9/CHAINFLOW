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
    <div className="flex flex-col gap-10 max-w-4xl mx-auto">
      
      {/* 1. Header Hologram card */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-gold/15 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]">
        {/* Holographic Avatar bust replacement */}
        <div className="w-28 h-28 rounded-full border-2 border-gold/30 flex items-center justify-center bg-space-black relative group shadow-[0_0_20px_rgba(212,175,55,0.15)] shrink-0">
          <div className="absolute inset-0.5 rounded-full border border-dashed border-gold/10 animate-spin" />
          <Users className="w-10 h-10 text-gold" />
        </div>

        <div className="flex flex-col gap-4 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-[9px] uppercase tracking-wider font-bold text-gold">
              <Award className="w-3 h-3" /> Accredited Factoring Partner
            </div>
            <h1 className="text-display text-2xl md:text-4xl font-black mt-2 text-white">{profile.name}</h1>
            <p className="text-sans text-xs text-white/40 mt-1 uppercase tracking-widest font-mono">
              Key: {profile.pubKey}
            </p>
          </div>

          <p className="text-sans text-xs text-white/70 leading-relaxed max-w-lg">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* 2. Interactive metrics ring simulation layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 text-center">
          <span className="text-[10px] uppercase text-white/40 tracking-wider">Total Supported Capital</span>
          <h3 className="text-display text-2xl font-black text-white mt-1">
            ${profile.totalInvested.toLocaleString()}
          </h3>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 text-center">
          <span className="text-[10px] uppercase text-white/40 tracking-wider">Active Portfolios</span>
          <h3 className="text-display text-2xl font-black text-white mt-1">
            {profile.activePositions} Positions
          </h3>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 text-center">
          <span className="text-[10px] uppercase text-white/40 tracking-wider">On-Chain Rep Score</span>
          <h3 className="text-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-teal-400 mt-1">
            {profile.score}% Perfect
          </h3>
        </div>
      </div>

      {/* 3. Review feeds */}
      <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-gold">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-display text-lg font-bold text-white">Client Telemetry Feed</h3>
        </div>

        <div className="flex flex-col gap-4">
          {profile.reviews.map((rev, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-space-black/50 border border-white/5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{rev.author}</span>
                <span className="text-sans text-xs text-gold">{"★".repeat(rev.rating)}</span>
              </div>
              <p className="text-sans text-xs text-white/70 leading-relaxed italic">
                “{rev.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
