"use client";

import { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { 
  BookOpen, 
  Terminal, 
  ChevronRight, 
  Check, 
  Copy 
} from "lucide-react";
import Link from "@/components/ui/Link";

export default function Docs() {
  const { setCursorHovered } = useFlowStore();
  const [activeTab, setActiveTab] = useState("endpoints");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const menuItems = [
    { id: "endpoints", label: "REST API Endpoints" },
    { id: "smart-contracts", label: "Soroban Smart Contracts" },
    { id: "freighter", label: "Freighter Integration" },
  ];

  const codeBlocks = {
    endpoints: {
      lang: "json",
      title: "POST /api/v1/invoices/tokenize",
      code: `{
  "invoiceId": "INV-2026-8912",
  "issuer": "GCEZNJHOYRYNPHNJRLRPAQIZ5CVD757BAKIGUUXCEOVVZP7CYCY3S76D",
  "counterparty": "GCT2LPT6K2A6...",
  "amount": 14500.00,
  "dueDate": "2026-11-30T23:59:59Z",
  "yieldRate": 10.5
}`
    },
    "smart-contracts": {
      lang: "rust",
      title: "Soroban Contract Entrypoint",
      code: `#[contractimpl]
impl ChainflowInvoiceContract {
    pub fn mint_fractions(
        env: Env, 
        issuer: Address, 
        amount: u128, 
        fraction_count: u32
    ) -> Result<Symbol, Error> {
        issuer.require_auth();
        // mint fractions representing the invoice receivable
        Ok(symbol_short!("SUCCESS"))
    }
}`
    },
    freighter: {
      lang: "javascript",
      title: "Freighter Request Signatures",
      code: `import { signTransaction } from "@stellar/freighter-api";

const signFreighterTx = async (envelopeXdr) => {
  const result = await signTransaction(envelopeXdr, {
    networkPassphrase: "Testnet Public Stellar Network ; September 2015"
  });
  
  if (result.error) {
    throw new Error(result.error);
  }
  return result.signedTxXdr;
};`
    }
  };

  const selectedCode = codeBlocks[activeTab as keyof typeof codeBlocks];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full animate-fadeIn">
      {/* Left panel: Documentation Suite (col-span-8) */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        {/* Header */}
        <div className="border-b border-white/5 pb-6 text-left flex flex-col items-start animate-fadeIn">
          <h1 className="font-heading text-white/95 text-3xl md:text-5xl font-normal">Developer Portal</h1>
          <p className="text-sans text-xs sm:text-sm text-white/40 uppercase tracking-widest mt-1">
            ChainFlow Soroban Smart Contract & SDK Documentation
          </p>
        </div>

        {/* Main nested layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Sidebar Navigation */}
        <div className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === item.id 
                  ? "bg-gold/10 border-gold/30 text-gold shadow-md" 
                  : "bg-transparent border-white/5 text-white/50 hover:border-white/15 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Column 2 & 3 & 4: Documentation Viewer */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-5 relative overflow-hidden">
            {/* Background video loop from motionsites (data stream flow) */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
              className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none z-0"
            />
            
            <div className="relative z-10 w-full h-full flex flex-col gap-5">
            
            <div className="flex items-center gap-2 text-gold border-b border-white/5 pb-4">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-display text-sm font-bold text-white uppercase tracking-wider">
                {activeTab === "endpoints" ? "Factoring API Reference" :
                 activeTab === "smart-contracts" ? "Soroban Smart Contracts WASM API" :
                 "Freighter Wallet Connection Setup"}
              </h3>
            </div>

            <p className="text-sans text-xs text-white/60 leading-relaxed">
              {activeTab === "endpoints" ? "Integrate your corporate ERP or invoicing systems directly into the factoring network. Trigger attestation requests, upload invoice structures, and fetch fractional yields in real-time." :
               activeTab === "smart-contracts" ? "Invoice factoring assets are compiled into optimized WASM bytecodes deployed on the Soroban smart contract framework, ensuring decentralized multi-party allocations and automatic settlements." :
               "Interact with the Freighter browser wallet in client-side applications. Query addresses, verify connection status, and request cryptographic transaction signatures securely."}
            </p>

            {/* Code blocks with copy actions (Terminal Theme) */}
            <div className="flex flex-col rounded-2xl border border-white/10 overflow-hidden mt-3 bg-[#050508]">
              <div className="bg-[#090910] border-b border-white/10 px-5 py-3 flex justify-between items-center text-xs">
                <span className="font-mono text-[10px] text-white/40 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-gold" /> {selectedCode.title}
                </span>
                <button
                  onClick={() => handleCopy(selectedCode.code, activeTab)}
                  className="text-white/40 hover:text-white transition-colors flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-wider"
                >
                  {copiedCode === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-accent-green" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              <pre className="p-6 font-mono text-[11px] text-white/80 overflow-x-auto leading-relaxed bg-[#050509]">
                <code>{selectedCode.code}</code>
              </pre>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Right panel: Transparent space for the 3D rotating crystal */}
      <div className="lg:col-span-4 h-[300px] lg:h-[600px] flex items-center justify-center pointer-events-none" />
    </div>
  );
}
