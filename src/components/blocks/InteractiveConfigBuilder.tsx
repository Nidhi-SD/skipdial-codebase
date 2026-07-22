"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { Thermometer, Home, Stethoscope } from "lucide-react";

const industries = [
  {
    id: "hvac",
    label: "HVAC & Trades",
    icon: Thermometer,
    config: {
      questions: ["Is there heating or cooling right now?", "How old is the unit?", "Are you the homeowner?"],
      escalation: "If no heat and < 40°F, dispatch immediately. Otherwise book next day.",
      tone: "Urgent, Professional",
    },
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: Home,
    config: {
      questions: ["Are you looking to buy or sell?", "What is your timeline?", "Are you pre-approved?"],
      escalation: "If timeline is < 30 days, text lead to top agent. Otherwise add to nurture sequence.",
      tone: "Friendly, Consultative",
    },
  },
  {
    id: "dental",
    label: "Dental Practice",
    icon: Stethoscope,
    config: {
      questions: ["Are you experiencing pain?", "Are you a new patient?", "Do you have insurance?"],
      escalation: "If pain is severe (>7/10), alert doctor on-call. Otherwise offer next available slot.",
      tone: "Empathetic, Reassuring",
    },
  },
];

export function InteractiveConfigBuilder({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("hvac");
  
  const activeData = industries.find((i) => i.id === activeTab) || industries[0];

  return (
    <div className={cn("flex flex-col gap-6 md:flex-row h-full", className)}>
      {/* Left: Toggles */}
      <div className="flex shrink-0 flex-col gap-2 md:w-48">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => setActiveTab(industry.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-300",
              activeTab === industry.id
                ? "border-accent bg-accent/5 shadow-soft"
                : "border-line bg-surface hover:bg-surface-alt"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                activeTab === industry.id ? "bg-accent text-white" : "bg-accent-tint/50 text-accent"
              )}
            >
              <industry.icon className="h-4 w-4" />
            </span>
            <span
              className={cn(
                "text-[13px] font-semibold",
                activeTab === industry.id ? "text-accent" : "text-ink"
              )}
            >
              {industry.label}
            </span>
          </button>
        ))}
      </div>

      {/* Right: Code / Config View */}
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-line bg-ink p-1">
        {/* Fake window header */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 opacity-50">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
        
        <div className="relative h-[280px] w-full rounded-xl bg-[#0F1115] p-5 font-mono text-[13px] leading-relaxed text-[#8B949E]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col"
            >
              <p><span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">agentConfig</span> <span className="text-[#FF7B72]">=</span> {"{"}</p>
              
              <div className="ml-4 mt-2">
                <p className="text-[#79C0FF]">industry<span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">&quot;{activeData.label}&quot;</span>,</p>
                <p className="mt-2 text-[#79C0FF]">tone<span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">&quot;{activeData.config.tone}&quot;</span>,</p>
                
                <p className="mt-2 text-[#79C0FF]">requiredIntake<span className="text-[#FF7B72]">:</span> {"["}</p>
                <ul className="ml-4 border-l border-[#30363D] pl-3">
                  {activeData.config.questions.map((q, i) => (
                    <li key={i} className="text-[#A5D6FF]">&quot;{q}&quot;{i < activeData.config.questions.length - 1 ? "," : ""}</li>
                  ))}
                </ul>
                <p>{"]"},</p>

                <p className="mt-2 text-[#79C0FF]">routingRule<span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">&quot;{activeData.config.escalation}&quot;</span></p>
              </div>
              
              <p className="mt-2">{"};"}</p>

              {/* Blinking cursor */}
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="mt-1 h-3.5 w-2 bg-[#79C0FF]"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
