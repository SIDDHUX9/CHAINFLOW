import { useEffect, useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import Navbar from "@/components/ui/Navbar";
import Preloader from "@/components/ui/Preloader";
import Toasts from "@/components/ui/Toasts";
import CustomCursor from "@/components/ui/CustomCursor";

import GlobalCanvas from "@/components/canvas/GlobalCanvas";
import { playBlip } from "@/utils/audio";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import CreateInvoice from "./pages/CreateInvoice";
import InvestorProfile from "./pages/InvestorProfile";
import Analytics from "./pages/Analytics";
import Docs from "./pages/Docs";
import Whitepaper from "./pages/Whitepaper";
import InvoiceDetail from "./pages/InvoiceDetail";

export default function App() {
  const activePage = useFlowStore((state) => state.activePage);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Play digital blip sound on route change
  useEffect(() => {
    if (activePage) {
      playBlip();
    }
  }, [activePage]);

  // Track scrolling progress percentage for Zen Sun indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on page change to recalculate
    handleScroll();
    
    // Tiny delay to ensure page height has settled
    const timeout = setTimeout(handleScroll, 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [activePage]);

  // Client-side router mapping Zustand activePage to pages
  const renderPageContent = () => {
    if (activePage === "/") return <Home />;
    if (activePage === "/dashboard") return <Dashboard />;
    if (activePage === "/marketplace") return <Marketplace />;
    if (activePage === "/create") return <CreateInvoice />;
    if (activePage === "/analytics") return <Analytics />;
    if (activePage === "/docs") return <Docs />;
    if (activePage === "/whitepaper") return <Whitepaper />;
    
    // Dynamic Dynamic parameters matching
    if (activePage.startsWith("/invoice/")) return <InvoiceDetail />;
    if (activePage.startsWith("/investor/")) return <InvestorProfile />;

    // 404 fallback
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <h2 className="text-display text-xl font-bold text-white">404 — Ledger Node Lost</h2>
        <p className="text-sans text-xs text-white/50">The page link you requested does not exist on-chain.</p>
        <a href="/" className="text-xs text-gold font-bold uppercase tracking-wider hover:underline">
          Return to Network
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#ECE6D9] overflow-x-hidden relative font-sans">
      {/* 1. Master WebGL Scene (crawling stars & liquid gold nodes in background) */}
      <GlobalCanvas />

      {/* 2. Global UI Shell Overlay */}
      <Navbar />
      <Preloader />
      <Toasts />
      <CustomCursor />

      {/* 3. Scroll progress Sun thread indicator */}
      <div className="scroll-progress-container hidden md:flex">
        <div className="scroll-progress-line animate-pulse" style={{ height: `${scrollProgress * 100}%` }} />
        <div className="scroll-progress-dot" style={{ transform: `translate3d(0, calc(${scrollProgress} * 70vh - 4px), 0)` }} />
      </div>

      {/* 4. Dynamic Page Content Mount Point */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16">
        {renderPageContent()}
      </main>
    </div>
  );
}
