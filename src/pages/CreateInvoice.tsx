"use client";

import { useState, useEffect } from "react";
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
  const { walletConnected, connectWallet, addInvoice, scannedInvoice, setScannedInvoice } = useFlowStore();
  const setPage = useFlowStore((state) => state.setPage);

  // Form states
  const [step, setStep] = useState(0); // 0: Upload, 1: Verify, 2: Tokenize, 3: Review, 4: Done
  const [loading, setLoading] = useState(false);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrFileName, setOcrFileName] = useState<string | null>(null);

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

  // Check for scanned invoice from dashboard
  useEffect(() => {
    if (scannedInvoice) {
      setTitle(scannedInvoice.title);
      setIssuer(scannedInvoice.issuer);
      setCounterparty(scannedInvoice.counterparty);
      setAmount(scannedInvoice.amount);
      setYieldRate(scannedInvoice.yieldRate);
      setDueDate(scannedInvoice.dueDate);
      setIndustry(scannedInvoice.industry);
      setFractionCount(scannedInvoice.fractionCount);
      setFractionPrice(scannedInvoice.fractionPrice);
      setCountry(scannedInvoice.country);
      setCountryCode(scannedInvoice.countryCode);
      setDescription(scannedInvoice.description);
      setOcrFileName(scannedInvoice.title.replace(" Factoring", "") + ".pdf");
      setStep(1);
    }
  }, [scannedInvoice]);

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setOcrFileName(fileName);
      setOcrScanning(true);
      
      // Simulate scanning progress for 2.5 seconds
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const parsedInvoice = {
        title: fileName.replace(/\.[^/.]+$/, "") + " Factoring",
        issuer: "Global Agriculture Trade",
        counterparty: "Consolidated Distributors Inc",
        amount: Math.floor(15000 + Math.random() * 45000),
        yieldRate: parseFloat((9.0 + Math.random() * 5).toFixed(1)),
        dueDate: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString().split('T')[0], // 45 days
        industry: "Agriculture",
        fractionCount: 100,
        fractionPrice: 0,
        country: "Colombia",
        countryCode: "CO",
        description: `Attested commercial invoice fractionalized on Stellar. Extracted from document: ${fileName}`
      };
      parsedInvoice.fractionPrice = parsedInvoice.amount / parsedInvoice.fractionCount;
      
      // Set field states
      setTitle(parsedInvoice.title);
      setIssuer(parsedInvoice.issuer);
      setCounterparty(parsedInvoice.counterparty);
      setAmount(parsedInvoice.amount);
      setYieldRate(parsedInvoice.yieldRate);
      setDueDate(parsedInvoice.dueDate);
      setIndustry(parsedInvoice.industry);
      setFractionCount(parsedInvoice.fractionCount);
      setFractionPrice(parsedInvoice.fractionPrice);
      setCountry(parsedInvoice.country);
      setCountryCode(parsedInvoice.countryCode);
      setDescription(parsedInvoice.description);
      
      setOcrScanning(false);
      setStep(1);
    }
  };

  const handleManualInvoiceEntry = () => {
    setOcrFileName("Simulated_Data");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
      {/* Left panel: Form Wizard (col-span-7) */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        {/* Wizard Header */}
        <div className="text-left flex flex-col items-start border-b border-white/5 pb-6">
        <h1 className="font-heading text-white/95 text-3xl md:text-5xl font-normal">債権鋳造所 <span className="font-sans text-2xl font-light ml-2 uppercase text-white/50 tracking-wider">Invoice Tokenizer</span></h1>
        <p className="text-sans text-xs sm:text-sm text-white/40 uppercase tracking-widest mt-1">
          「証券化と流動化の儀」 Soroban Asset Fractionalization Chamber
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
      <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Background video loop from motionsites (payments flow) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_192508_4eecde4c-f835-4f4b-b255-eafd1156da99.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none z-0"
        />
        
        {/* Ensure all contents render above background video with z-10 */}
        <div className="relative z-10 w-full h-full">
        
        {ocrScanning ? (
          /* ================= OCR SCANNING LOADER ================= */
          <div className="flex flex-col gap-6 text-center items-center py-10 animate-fadeIn animate-pulse">
            <div className="relative w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center bg-[#090910] animate-float">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent animate-bounce top-1/2" />
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gold uppercase tracking-widest font-black">Scanning Document via OCR...</span>
              <p className="text-sans text-xs text-white/50 font-mono mt-1">Analyzing: {ocrFileName}</p>
            </div>
            
            <div className="w-full max-w-xs bg-space-black/50 border border-white/5 p-4 rounded-xl text-[10px] font-mono text-left text-white/40 flex flex-col gap-1">
              <div>&gt; Loading file buffers... DONE</div>
              <div>&gt; Invoking optical character neural network...</div>
              <div>&gt; Extracting counterparty keypairs...</div>
            </div>
          </div>
        ) : step === 0 ? (
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

            <div 
              onClick={() => document.getElementById("direct-file-upload")?.click()}
              className="w-full max-w-md border border-white/10 hover:border-gold/30 rounded-2xl p-10 bg-[#050508] cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors group"
            >
              <input 
                type="file" 
                id="direct-file-upload" 
                className="hidden" 
                onChange={handleDirectFileUpload}
                accept=".pdf,.xml,.jpg,.jpeg"
              />
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
        ) : null}

        {step === 1 && (
          /* ================= STEP 1: VERIFY ATTRIBUTE DETAILS ================= */
          <div className="flex flex-col gap-6 animate-fadeIn">
            {ocrFileName && (
              <div className="p-4 rounded-2xl bg-gold/5 border border-gold/25 flex justify-between items-center text-xs animate-fadeIn mb-2">
                <span className="text-white/80 font-medium">
                  ✨ Pre-filled with AI OCR parsed data from <span className="font-mono text-gold font-bold">{ocrFileName}</span>.
                </span>
                <button 
                  onClick={() => {
                    setScannedInvoice(null);
                    setOcrFileName(null);
                    setTitle("");
                    setIssuer("");
                    setCounterparty("");
                    setAmount(5000);
                    setYieldRate(9.5);
                    setDueDate("2026-09-30");
                    setIndustry("Agriculture");
                    setFractionCount(100);
                    setFractionPrice(50);
                    setCountry("Colombia");
                    setCountryCode("COL");
                    setDescription("");
                    setStep(0);
                  }}
                  className="text-[10px] font-black uppercase text-gold hover:underline"
                >
                  Clear / Reset
                </button>
              </div>
            )}

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
    </div>

      {/* Right panel: Transparent space highlighting the 3D orbital tunnel */}
      <div className="lg:col-span-5 h-[300px] lg:h-[600px] flex items-center justify-center pointer-events-none relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
      </div>
    </div>
  );
}
