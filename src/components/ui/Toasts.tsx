"use client";

import { useFlowStore } from "@/store/useFlowStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

export default function Toasts() {
  const { notifications, removeNotification } = useFlowStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          let shadowColor = "rgba(212, 175, 55, 0.1)";
          let icon = <CheckCircle2 className="w-5 h-5 text-gold" />;
          let bgClass = "bg-space-black/90 border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]";

          if (notif.type === "error") {
            shadowColor = "rgba(255, 71, 87, 0.15)";
            icon = <XCircle className="w-5 h-5 text-accent-red" />;
            bgClass = "bg-space-black/95 border-accent-red/30 shadow-[0_0_25px_rgba(255,71,87,0.15)] animate-shake";
          } else if (notif.type === "warning") {
            shadowColor = "rgba(255, 179, 0, 0.1)";
            icon = <AlertTriangle className="w-5 h-5 text-yellow-500 animate-pulse" />;
            bgClass = "bg-space-black/90 border-yellow-500/20 shadow-[0_0_20px_rgba(255,179,0,0.1)]";
          }

          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`pointer-events-auto p-4 rounded-xl border flex items-start gap-3 backdrop-blur-xl relative group ${bgClass}`}
            >
              {/* Glowing background */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md -z-10"
                style={{
                  background: `radial-gradient(circle at center, ${shadowColor} 0%, transparent 70%)`
                }}
              />

              <div className="flex-shrink-0 mt-0.5">{icon}</div>

              <div className="flex-1 pr-4">
                <h4 className="text-display text-xs font-bold uppercase tracking-wider text-white">
                  {notif.title}
                </h4>
                <p className="text-sans text-xs text-white/70 mt-1 leading-relaxed">
                  {notif.description}
                </p>
              </div>

              <button
                onClick={() => removeNotification(notif.id)}
                className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
