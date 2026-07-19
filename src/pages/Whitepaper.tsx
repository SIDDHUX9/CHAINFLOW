"use client";

import { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { 
  FileText, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  Network, 
  Percent, 
  Zap, 
  BookOpen,
  ArrowRight
} from "lucide-react";
import Link from "@/components/ui/Link";

export default function Whitepaper() {
  const { setCursorHovered } = useFlowStore();
  const [activeSection, setActiveSection] = useState("executive-summary");

  const sections = [
    { id: "executive-summary", label: "1. Executive Summary", icon: <BookOpen className="w-4 h-4" /> },
    { id: "market-problem", label: "2. The Liquidity Problem", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "protocol-architecture", label: "3. Protocol Architecture", icon: <Network className="w-4 h-4" /> },
    { id: "stellar-soroban", label: "4. Stellar & Soroban Stack", icon: <Zap className="w-4 h-4" /> },
    { id: "financial-engineering", label: "5. Financial Modelling", icon: <Percent className="w-4 h-4" /> },
    { id: "consensus-security", label: "6. Security & Consensus", icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto animate-fadeIn relative">
      
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <FileText className="w-6 h-6 text-gold" />
          <span className="text-[10px] tracking-[0.3em] font-bold text-gold uppercase">ChainFlow Technical Paper</span>
        </div>
        <h1 className="text-display text-3xl md:text-5xl font-black text-white">ChainFlow Protocol Whitepaper</h1>
        <p className="text-sans text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Decentralized Fractional Factoring, Cross-Border Attestation, and On-Chain Liquidity Settlement on the Soroban Smart Contract Platform.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Sticky Left Sidebar Navigation */}
        <div className="lg:col-span-4 sticky top-28 flex flex-col gap-3">
          <div className="p-5 rounded-2xl bg-[#0E0E18] border border-white/5 flex flex-col gap-4">
            <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase font-black">Table of Contents</span>
            
            <nav className="flex flex-col gap-2">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleSectionClick(sec.id)}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    activeSection === sec.id 
                      ? "bg-gold/10 border-gold/30 text-gold shadow-md font-bold" 
                      : "bg-transparent border-white/5 text-white/50 hover:border-white/15 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {sec.icon}
                    <span>{sec.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </nav>

            <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
              <span className="text-[9px] font-mono text-white/30 uppercase">Related Links</span>
              <Link 
                href="/docs" 
                className="text-[10px] text-gold hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
              >
                Developer API Docs <ArrowRight className="w-3 h-3" />
              </Link>
              <Link 
                href="/marketplace" 
                className="text-[10px] text-gold hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
              >
                Explore Active Pools <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Scrollable Content Pane */}
        <div className="lg:col-span-8 flex flex-col gap-12 text-slate-300 text-sm leading-relaxed max-h-[80vh] overflow-y-auto px-4 custom-scrollbar">
          
          {/* Section 1: Executive Summary */}
          <section id="executive-summary" className="flex flex-col gap-4 border-b border-white/5 pb-10">
            <h2 className="text-display text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">1.</span> Executive Summary
            </h2>
            <p>
              The global trade finance gap currently stands at over <strong>$2.5 Trillion</strong>, primarily impacting Small and Medium Enterprises (SMEs) in emerging markets. Exporters frequently endure repayment terms spanning 30 to 120 days from buyers, locking up working capital and choking operational growth.
            </p>
            <p>
              <strong>ChainFlow</strong> introduces a trustless, decentralized factoring network built on the Stellar blockchain. By leverage Soroban smart contracts, the protocol tokenizes verified commercial invoice receivables into yield-bearing fractional assets, allowing exporters to receive instant liquidity in stablecoins (USDC/XLM) and enabling global backers to purchase fractions of institutional receivables.
            </p>
            <div className="p-5 rounded-xl bg-gold/5 border border-gold/20 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-black text-gold uppercase tracking-wider">Core Protocol Innovation</span>
              <p className="text-xs text-slate-300">
                A secure bridging architecture converting off-chain trade invoices to on-chain tokenized fractions, governed by distributed oracle consensus and settled instantly with sub-cent network gas fees.
              </p>
            </div>
          </section>

          {/* Section 2: The Liquidity Problem */}
          <section id="market-problem" className="flex flex-col gap-4 border-b border-white/5 pb-10">
            <h2 className="text-display text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">2.</span> The Liquidity Problem
            </h2>
            <p>
              Traditional factoring relies heavily on centralized financial intermediaries. This process is hindered by:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong>High Transaction Costs:</strong> Overhead audits, compliance checks, and legal reviews make traditional factoring unprofitable for invoices under $100,000.</li>
              <li><strong>Severe Settlement Delays:</strong> Underwriting takes days or weeks, forcing exporters to halt shipping lines while waiting for bank checks.</li>
              <li><strong>Double-Spend & Fraud:</strong> Centralized registries fail to prevent bad actors from factoring the same invoice document with multiple banks simultaneously.</li>
            </ul>
            <p>
              By serializing invoices cryptographically on a decentralized ledger, ChainFlow prevents double-factoring and automates risk calculation in a trustless environment.
            </p>
          </section>

          {/* Section 3: Protocol Architecture */}
          <section id="protocol-architecture" className="flex flex-col gap-4 border-b border-white/5 pb-10">
            <h2 className="text-display text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">3.</span> Protocol Architecture
            </h2>
            <p>
              The ChainFlow protocol operates in three distinct layers to ensure transparency, security, and velocity:
            </p>
            
            <h3 className="text-white font-bold mt-2 text-xs uppercase tracking-wider">A. AI Invoice Serialization</h3>
            <p>
              Exporters upload invoice documents (PDFs) to the portal. The built-in AI parser executes optical character recognition (OCR) to extract counterparties, shipment quantities, currency amounts, and maturity dates. The system hashes these details to mint a unique, non-fungible <strong>Invoice Ledger Receipt (ILR)</strong>.
            </p>

            <h3 className="text-white font-bold mt-2 text-xs uppercase tracking-wider">B. Decentralized Oracle Attestation</h3>
            <p>
              Before an ILR can seek funding, Soroban oracle validators execute automated compliance queries:
            </p>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 font-mono text-xs text-white/70">
              [Validator 1] Query customs database: Cargo cleared port ✅<br/>
              [Validator 2] Query seller corporate ledger: Balance sheet verified ✅<br/>
              [Validator 3] Query buyer confirmation: Terms acknowledged ✅
            </div>

            <h3 className="text-white font-bold mt-2 text-xs uppercase tracking-wider">C. Fractional Yield Distribution</h3>
            <p>
              Once attested, the ILR is locked into a Soroban custody vault. The contract mints yield-bearing fractions (represented as ERC-20 equivalent Stellar assets), letting backers buy fractions for as low as 10 XLM. Exporters receive an instant 90% capital advance.
            </p>
          </section>

          {/* Section 4: Stellar & Soroban Stack */}
          <section id="stellar-soroban" className="flex flex-col gap-4 border-b border-white/5 pb-10">
            <h2 className="text-display text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">4.</span> Stellar & Soroban Technology Stack
            </h2>
            <p>
              Building on Stellar provides ChainFlow with key advantages that make micro-factoring viable for the first time:
            </p>
            <table className="w-full text-left text-xs border border-white/5 rounded-xl overflow-hidden mt-2">
              <thead>
                <tr className="bg-white/5 text-white">
                  <th className="p-3">Feature</th>
                  <th className="p-3">Stellar/Soroban</th>
                  <th className="p-3">Other L1 Networks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="p-3 font-semibold text-white">Average Gas Fee</td>
                  <td className="p-3 text-accent-green font-semibold">&lt;$0.0001 USD</td>
                  <td className="p-3">$1.50 - $15.00 USD</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Settlement Speed</td>
                  <td className="p-3 text-accent-green font-semibold">3.5 - 5 Seconds</td>
                  <td className="p-3">15 Sec - 12 Minutes</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Execution Safety</td>
                  <td className="p-3">Rust WASM Sandbox</td>
                  <td className="p-3">EVM Solidity (High Hacks)</td>
                </tr>
              </tbody>
            </table>
            <p>
              Soroban's state storage fees are highly predictable, preventing gas price spikes from eating into investor APY returns on micro-invoices.
            </p>
          </section>

          {/* Section 5: Financial Modelling */}
          <section id="financial-engineering" className="flex flex-col gap-4 border-b border-white/5 pb-10">
            <h2 className="text-display text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">5.</span> Financial Engineering & Yield Models
            </h2>
            <p>
              The factoring yield model calculates risk-adjusted APY dynamically based on buyer rating, industry class, and cargo delay histories.
            </p>
            
            <h3 className="text-white font-bold mt-2 text-xs uppercase tracking-wider font-mono">Invoice Factoring Formula</h3>
            <p>
              The advance payout ($A_P$) and maturity refund ($R_M$) are defined as:
            </p>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center font-mono text-sm text-gold">
              A_P = Amount \times 0.90 <br/>
              R_M = (Amount \times 0.10) - (Fee_{"{Protocol}"} + Yield_{"{Investor}"})
            </div>
            <p>
              Where the investor yield is computed linearly based on terms:
            </p>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center font-mono text-xs text-white/70">
              Yield_{"{Investor}"} = A_P \times APY_{"{Rate}"} \times \left( \frac{"{Term}"}{365} \right)
            </div>
            <p>
              The 10% escrow reserve ensures there is a cushion in case of minor shipping disputes or delay penalties, shielding backers from loss.
            </p>
          </section>

          {/* Section 6: Security & Consensus */}
          <section id="consensus-security" className="flex flex-col gap-4 pb-12">
            <h2 className="text-display text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">6.</span> Security & Consensus
            </h2>
            <p>
              ChainFlow secures institutional assets with three strict defensive mechanisms:
            </p>
            <ol className="list-decimal pl-5 flex flex-col gap-2">
              <li><strong>Authorized Buyer Signatures:</strong> Invoices require cryptographic consent from the buyer (using Freighter or administrative Stellar accounts) to establish payment legal obligations before tokenization.</li>
              <li><strong>State-Expiry Protection:</strong> State archive features in Soroban prevent dead contracts from leaking storage rent, making the long-term protocol lifecycle sustainable.</li>
              <li><strong>Consensus Multi-Sig Release:</strong> The escrow settlement releases capital strictly when buyer repayments clear or when 2/3 oracle consensus attests to shipping defaults, initiating collateral liquidation.</li>
            </ol>
            <p>
              This combination of financial engineering and smart contract auditing positions ChainFlow as a global pioneer in trade finance tokenization.
            </p>
          </section>

        </div>

      </div>

    </div>
  );
}
