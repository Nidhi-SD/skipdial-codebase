"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneIncoming, Zap, CalendarCheck, HelpCircle, ArrowRight, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

const branches = [
  {
    id: "emergency",
    label: "Emergency",
    icon: Zap,
    tone: "warn",
    actions: ["Alert on-call tech", "Send SMS to team", "Log high-priority ticket"],
  },
  {
    id: "quote",
    label: "New Quote",
    icon: CalendarCheck,
    tone: "signal",
    actions: ["Qualify budget & timeline", "Check availability", "Book estimate on calendar"],
  },
  {
    id: "support",
    label: "Support",
    icon: HelpCircle,
    tone: "accent",
    actions: ["Lookup account", "Provide status update", "Route to billing if needed"],
  },
];

export function InboundDecisionTree({ className }: { className?: string }) {
  const [activeBranch, setActiveBranch] = useState("quote");
  const [isHovering, setIsHovering] = useState(false);

  // Auto-cycle through branches when not hovering
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveBranch((curr) => {
        const idx = branches.findIndex((b) => b.id === curr);
        return branches[(idx + 1) % branches.length].id;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const activeData = branches.find((b) => b.id === activeBranch) || branches[1];

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-10 shadow-card",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Top: Incoming Call */}
      <div className="relative z-10 mx-auto flex w-[240px] flex-col items-center justify-center rounded-2xl border border-line bg-surface-alt p-4 shadow-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-ink-inverse">
          <PhoneIncoming className="h-5 w-5" />
        </span>
        <p className="mt-3 text-[14px] font-bold text-ink">Inbound Call Received</p>
        <p className="mt-1 text-[12px] text-ink-light">AI answers instantly</p>
      </div>

      {/* SVG Connections */}
      <div className="relative mx-auto mt-4 h-[120px] w-[300px]">
        <svg
          width="300"
          height="120"
          viewBox="0 0 300 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          {/* Base paths */}
          <path d="M 150 0 C 150 60, 50 60, 50 120" stroke="currentColor" strokeWidth="2" className="text-line" strokeDasharray="4 4" />
          <path d="M 150 0 C 150 60, 150 60, 150 120" stroke="currentColor" strokeWidth="2" className="text-line" strokeDasharray="4 4" />
          <path d="M 150 0 C 150 60, 250 60, 250 120" stroke="currentColor" strokeWidth="2" className="text-line" strokeDasharray="4 4" />
          
          {/* Active animated path */}
          <motion.path
            key={activeBranch}
            d={
              activeBranch === "emergency" 
                ? "M 150 0 C 150 60, 50 60, 50 120"
                : activeBranch === "quote"
                ? "M 150 0 C 150 60, 150 60, 150 120"
                : "M 150 0 C 150 60, 250 60, 250 120"
            }
            stroke={
              activeData.tone === "warn" ? "var(--warn)" :
              activeData.tone === "signal" ? "var(--signal)" : "var(--accent)"
            }
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>

        {/* Floating Data Packet */}
        <motion.div
          key={`packet-${activeBranch}`}
          className={cn(
            "absolute left-0 top-0 h-3 w-3 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.5)]",
            activeData.tone === "warn" ? "bg-warn" :
            activeData.tone === "signal" ? "bg-signal" : "bg-accent"
          )}
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
          style={{
            offsetPath: `path('${
              activeBranch === "emergency" 
                ? "M 150 0 C 150 60, 50 60, 50 120"
                : activeBranch === "quote"
                ? "M 150 0 C 150 60, 150 60, 150 120"
                : "M 150 0 C 150 60, 250 60, 250 120"
            }')`
          }}
        />
      </div>

      {/* Branch nodes */}
      <div className="relative z-10 mx-auto flex w-[340px] justify-between">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => setActiveBranch(branch.id)}
            className={cn(
              "flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-2xl border transition-all duration-300",
              activeBranch === branch.id
                ? "scale-110 border-transparent shadow-card"
                : "border-line bg-surface opacity-50 hover:opacity-100",
              activeBranch === branch.id && branch.tone === "warn" && "bg-warn text-white",
              activeBranch === branch.id && branch.tone === "signal" && "bg-signal text-white",
              activeBranch === branch.id && branch.tone === "accent" && "bg-accent text-white"
            )}
          >
            <branch.icon className="h-6 w-6" />
          </button>
        ))}
      </div>

      {/* Outcome pane */}
      <div className="mx-auto mt-8 w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBranch}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <Settings className="h-4 w-4 text-ink-faint" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-light">
                {activeData.label} Protocol
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {activeData.actions.map((action, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[13.5px] font-medium text-ink">
                  <ArrowRight className="h-3.5 w-3.5 text-ink-faint" />
                  {action}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
