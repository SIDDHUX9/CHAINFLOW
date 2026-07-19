"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowStore } from "@/store/useFlowStore";
import { Wallet, Menu, X } from "lucide-react";

export default function Navbar() {
  const { 
    activePage: pathname,
    walletAddress, 
    walletConnected, 
    walletConnecting, 
    connectWallet, 
    disconnectWallet, 
    setCursorHovered 
  } = useFlowStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Network", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Tokenize", path: "/create" },
    { name: "Analytics", path: "/analytics" },
    { name: "Docs", path: "/docs" },
  ];

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-6xl pointer-events-none">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full pointer-events-auto"
        >
          <div className="glass-premium rounded-full px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-gold-dark via-gold to-gold-light p-[1px] shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all">
              <div className="w-full h-full rounded-full bg-space-black flex items-center justify-center font-display text-sm font-black text-gold">
                CF
              </div>
            </div>
            <span className="text-display text-lg font-bold tracking-wider text-white group-hover:text-gold transition-colors">
              ChainFlow
            </span>
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1 bg-space-black/40 rounded-full p-1 border border-white/5">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className={`relative px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold transition-colors duration-300 ${
                    isActive ? "text-space-black font-bold" : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow-underline"
                      className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Wallet Action Button & Mobile Hamburguer */}
          <div className="flex items-center gap-3">
            {walletConnected ? (
              <>
                {/* Desktop view */}
                <div className="hidden md:flex items-center gap-3">
                  {/* Connected Wallet Capsule */}
                  <div className="px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest text-gold-light uppercase">
                      {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    onMouseEnter={() => setCursorHovered(true)}
                    onMouseLeave={() => setCursorHovered(false)}
                    className="px-3 py-1.5 rounded-full border border-white/10 hover:border-accent-red/40 hover:text-accent-red bg-space-black/50 text-[10px] tracking-wider uppercase font-semibold transition-all duration-300"
                  >
                    Disconnect
                  </button>
                </div>
                {/* Mobile view */}
                <div className="flex md:hidden items-center gap-2">
                  <div className="px-2.5 py-1 py-1.5 rounded-full border border-gold/30 bg-gold/5 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-[9px] font-mono tracking-widest text-gold-light uppercase">
                      {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-2)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Desktop Connect Wallet */}
                <button
                  onClick={connectWallet}
                  disabled={walletConnecting}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-space-black text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  {walletConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
                {/* Mobile Connect Wallet */}
                <button
                  onClick={connectWallet}
                  disabled={walletConnecting}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  className="flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-space-black text-[10px] font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
                >
                  <Wallet className="w-3 h-3" />
                  {walletConnecting ? "..." : "Connect"}
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
              className="md:hidden p-2 rounded-full border border-gold/20 text-gold hover:bg-gold/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>
    </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 md:hidden bg-space-black/95 backdrop-blur-xl flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-6 text-center">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-display text-2xl font-bold tracking-widest uppercase ${
                      pathname === item.path ? "text-gold" : "text-white/60"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="mt-8 flex justify-center"
              >
                {walletConnected ? (
                  <div className="flex flex-col gap-3 items-center">
                    <div className="px-4 py-2 rounded-full border border-gold/30 bg-gold/5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      <span className="text-xs font-mono tracking-widest text-gold-light uppercase">
                        {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setMobileMenuOpen(false);
                      }}
                      className="px-6 py-2 rounded-full border border-accent-red/30 text-accent-red text-xs uppercase tracking-wider font-semibold"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-space-black text-xs font-bold uppercase tracking-wider"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
