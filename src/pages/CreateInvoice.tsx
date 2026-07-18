"use client";

import { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { 
  UploadCloud, 
  FileText, 
  HelpCircle,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Award,
  Terminal
} from "lucide-react";
import Link from "@/components/ui/Link";

export default function CreateInvoice() {
  const { walletConnected, connectWallet, addInvoice } = useFlowStore();
  const setPage = useFlowStore((state) => state.setPage);

  // Form states
  const [step, setStep] = useState(0); // 0: Upload, 1: Verify, 2: Tokenize, 3: Review, 4: Done
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [amount, setAmount] = useState<number>(5000);
  const [dueDate, setDueDate] = useState("2026-09-30");
  const [yieldRate, setYieldRate] = useState<number>(9.5);
  const [industry, setIndustry] = useState("Agriculture");
  const [fractionCount, setFractionCount] = useState<number>(100);
  const [fractionPrice, setFractionPrice] = useState<number>(50);
  const [country, setCountry] = useState("Colombia");
  const [countryCode, setCountryCode] = useState("COL");
  const [description, setDescription] = useState("");

  const handleManualInvoiceEntry = () => {
    setTitle("AeroCargo Transport Logistics Invoice");
    setIssuer("Kenyan Logistics Corp");
    setCounterparty("AeroCargo Ltd");
    setAmount(18400);
    setYieldRate(11.2);
    setDueDate("2026-10-15");
    setIndustry("Logistics");
    setFractionCount(100);
    setFractionPrice(184);
    setCountry("Kenya");
    setCountryCode("KEN");
    setDescription("Payment invoice for air cargo shipment of fresh flowers and agriculture produce to European hub ports.");
    setStep(1);
  };

  const handleTriggerVerification = async () => {
    setLoading(true);
    // Simulate smart contract attestation latency
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setLoading(false);
    setStep(2);
  };

  const handleLaunchFactoring = async () => {
    if (!walletConnected) {
      connectWallet();
      return;
    }

    setLoading(true);
    try {
      await addInvoice({
        title,
        issuer,
        counterparty,
        amount,
        yieldRate,
        dueDate,
        industry,
        fractionCount,
        fractionPrice,
        country,
        countryCode,
        lat: 4.7110,
        lng: -74.0721,
        riskScore: 24,
        description
      });
      setStep(4);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto">
      {/* Wizard Header */}
      <div className="text-center flex flex-col items-center border-b border-white/5 pb-6">
        <h1 className="text-display text-3xl md:text-5xl font-black text-white">Invoice Tokenizer</h1>
        <p className="text-sans text-xs sm:text-sm text-white/40 uppercase tracking-widest mt-1">
          Soroban Asset Fractionalization Chamber
        </p>

        {/* Dynamic step capsules */}
        <div className="flex justify-center gap-3 mt-8 max-w-md w-full">
          {["Ingest", "Verify", "Tokenize", "Compile"].map((name, idx) => (
            <div key={idx} className="flex-1 flex flex-col gap-2 items-center">
              <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                step > idx ? "bg-gold shadow-[0_0_10px_#D4AF37]" :
                step === idx ? "bg-gold/40" : "bg-white/5"
              }`} />
              <span className={`text-[8px] tracking-wider uppercase font-bold ${
                step >= idx ? "text-gold" : "text-white/30"
              }`}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main wizard frame */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl bg-[#0E0E17]">
        
        {step === 0 && (
          /* ================= STEP 0: FILE UPLOAD ================= */
          <div className="flex flex-col gap-6 text-center items-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#090910] flex items-center justify-center border border-white/10 mb-2 animate-float">
              <UploadCloud className="w-6 h-6 text-gold" />
            </div>

            <div>
              <h2 className="text-display text-lg font-bold text-white uppercase tracking-wider">Secure Document Ingestion</h2>
              <p className="text-sans text-xs text-white/50 max-w-md mx-auto mt-1 leading-relaxed">
                Drag and drop your standard commercial invoice (PDF or image). Our OCR models will parse values, counterparties, and registry logs.
              </p>
            </div>

            <div className="w-full max-w-md border border-white/10 hover:border-gold/30 rounded-2xl p-10 bg-[#050508] cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors group">
              <UploadCloud className="w-10 h-10 text-white/20 group-hover:text-gold transition-colors" />
              <span className="text-xs text-white/60 font-bold group-hover:text-white transition-colors">Select Invoice Document</span>
              <span className="text-[9px] text-white/30 uppercase font-mono">PDF, XML, or JPG up to 15MB</span>
            </div>

            <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest mt-2">— OR MOCK THE SYSTEM —</span>

            <button
              onClick={handleManualInvoiceEntry}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-dark to-gold text-space-black text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              Load Simulated Invoice <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 1 && (
          /* ================= STEP 1: VERIFY ATTRIBUTE DETAILS ================= */
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="text-display text-lg font-bold text-white uppercase tracking-wider">Verify Extracted Metadata</h2>
              <p className="text-sans text-xs text-white/40">Ensure attributes match your physical commercial invoice structure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/40 uppercase font-bold">Invoice Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#090910] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-gold/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/40 uppercase font-bold">Counterparty Name</label>
                <input 
                  type="text" 
                  value={counterparty} 
                  onChange={(e) => setCounterparty(e.target.value)}
                  className="bg-[#090910] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-gold/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/40 uppercase font-bold">Invoice Value ($)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#090910] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-gold/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/40 uppercase font-bold">Estimated Yield APY (%)</label>
                <input 
                  type="number" 
                  value={yieldRate} 
                  onChange={(e) => setYieldRate(parseFloat(e.target.value))}
                  className="bg-[#090910] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-gold/30 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleTriggerVerification}
              disabled={loading}
              className="w-full mt-6 py-4 rounded-full bg-gold hover:bg-gold-light text-space-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Consensus Oracles...</span>
                </>
              ) : (
                <span>Trigger On-Chain Verification</span>
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          /* ================= STEP 2: FRACTIONALIZATION SETTINGS ================= */
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="text-display text-lg font-bold text-white uppercase tracking-wider">Fractional Ledger Splits</h2>
              <p className="text-sans text-xs text-white/40">Determine how many fractional slots you wish to split this invoice asset into.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/40 uppercase font-bold">Fraction Slot Count</label>
                <input 
                  type="number" 
                  value={fractionCount} 
                  onChange={(e) => {
                    setFractionCount(Number(e.target.value));
                    setFractionPrice(amount / Number(e.target.value));
                  }}
                  className="bg-[#090910] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-gold/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/40 uppercase font-bold">Calculated Slot Price ($)</label>
                <input 
                  type="number" 
                  disabled
                  value={fractionPrice.toFixed(2)}
                  className="bg-[#090910]/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white/40 outline-none font-mono"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090910] border border-gold/15 flex items-start gap-3.5 mt-2">
              <Sparkles className="w-5 h-5 text-gold mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white">Stellar Ledger Splitting</span>
                <p className="text-white/40 mt-1 leading-relaxed">
                  Minting fractional slots permits institutional or retail backers globally to purchase portions of your invoice. Soroban contracts handle payments and distributions automatically.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full mt-4 py-4 rounded-full bg-gold hover:bg-gold-light text-space-black text-xs font-black uppercase tracking-widest transition-colors shadow-md"
            >
              Review Attestation Terms
            </button>
          </div>
        )}

        {step === 3 && (
          /* ================= STEP 3: REVIEW AND LAUNCH ================= */
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
              <h2 className="text-display text-lg font-bold text-white uppercase tracking-wider">Compile Asset Parameters</h2>
              <p className="text-sans text-xs text-white/40">By launching, you compile and publish the Soroban WASM contract representing this invoice.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090910] border border-white/5 flex flex-col gap-3 text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Exchanged Asset:</span>
                <span className="font-sans font-bold text-white">{title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Collateral Value:</span>
                <span className="font-bold text-gold">${amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Industry & Country:</span>
                <span className="text-white">{industry} ({countryCode})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Maturity Ledger Date:</span>
                <span className="text-white">{dueDate}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-white/40">Mint Details:</span>
                <span className="text-white font-bold">{fractionCount} Slots @ ${fractionPrice} each</span>
              </div>
            </div>

            {!walletConnected ? (
              <div className="flex flex-col gap-3 text-center mt-2">
                <button
                  onClick={connectWallet}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-space-black text-xs font-black uppercase tracking-widest shadow-lg transition-transform hover:scale-105"
                >
                  Connect Freighter Wallet
                </button>
                <span className="text-[10px] text-white/40 font-semibold tracking-wider">Freighter extension is required to sign ledger compilations.</span>
              </div>
            ) : (
              <button
                onClick={handleLaunchFactoring}
                disabled={loading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-space-black text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:brightness-105 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Minting Soroban Asset WASM...</span>
                  </>
                ) : (
                  <span>Mint & List Invoice</span>
                )}
              </button>
            )}
          </div>
        )}

        {step === 4 && (
          /* ================= STEP 4: SUCCESS CHAMPION ================= */
          <div className="flex flex-col gap-6 text-center items-center py-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-accent-green/10 flex items-center justify-center border border-accent-green/30 animate-pulse mb-2">
              <FileCheck className="w-8 h-8 text-accent-green" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-display text-2xl font-black text-white uppercase tracking-wider">Asset Tokenized</h2>
              <p className="text-sans text-xs text-white/50 max-w-md mx-auto leading-relaxed mt-1">
                The factoring contract parameters have been published to the Stellar ledger. Exporters and backers can now trade fractional slots.
              </p>
            </div>

            <div className="w-full max-w-md p-4.5 rounded-xl bg-[#090910] border border-white/5 flex flex-col gap-2 text-xs text-left font-mono">
              <div className="flex justify-between">
                <span className="text-white/40">Compiled WASM Hash:</span>
                <span className="text-gold text-[10px]">CBAR...7S8E</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                <span className="text-white/40">Ledger Height:</span>
                <span className="text-white text-[10px]">#3,248,510</span>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-md mt-6">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-3.5 rounded-full border border-white/10 hover:border-gold/30 hover:bg-gold/5 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Tokenize Another
              </button>
              <button
                onClick={() => setPage("/marketplace")}
                className="flex-1 py-3.5 rounded-full bg-gold hover:bg-gold-light text-space-black text-xs font-black uppercase tracking-wider transition-all"
              >
                Go to Exchange
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
