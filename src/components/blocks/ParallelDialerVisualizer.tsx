"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { PhoneOutgoing, User, Check, X, Voicemail } from "lucide-react";

const outcomes = [
  { id: "connected", label: "Connected & Booked", icon: Check, color: "var(--signal)", bg: "bg-signal" },
  { id: "voicemail", label: "Left Voicemail", icon: Voicemail, color: "var(--warn)", bg: "bg-warn" },
  { id: "disconnected", label: "No Answer / Retry", icon: X, color: "var(--accent)", bg: "bg-accent" },
];

export function ParallelDialerVisualizer({ className }: { className?: string }) {
  const [activeCalls, setActiveCalls] = useState<{ id: string | number; targetIdx: number; progress: number; outcome?: typeof outcomes[0] }[]>([]);
  
  // Animation loop to simulate outbound calls
  useEffect(() => {
    const spawnCall = () => {
      const id = Math.random().toString(36).substring(2, 9);
      const targetIdx = Math.floor(Math.random() * 5); // 5 targets on the right
      
      setActiveCalls(curr => [...curr, { id, targetIdx, progress: 0 }]);
      
      // Call progresses over 2 seconds
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        if (p >= 100) {
          clearInterval(interval);
          // Assign outcome
          const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
          setActiveCalls(curr => curr.map(c => c.id === id ? { ...c, progress: 100, outcome } : c));
          
          // Remove call after 1.5s delay
          setTimeout(() => {
            setActiveCalls(curr => curr.filter(c => c.id !== id));
          }, 1500);
        } else {
          setActiveCalls(curr => curr.map(c => c.id === id ? { ...c, progress: p } : c));
        }
      }, 50);
    };

    // Spawn calls every 800ms
    const spawner = setInterval(spawnCall, 800);
    spawnCall();
    
    return () => clearInterval(spawner);
  }, []);

  return (
    <div className={cn("relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-card", className)}>
      <div className="flex items-center justify-between">
        
        {/* Left: AI Engine */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface-alt shadow-sm">
            <PhoneOutgoing className="h-7 w-7 text-ink" />
          </div>
          <p className="mt-3 text-[13px] font-bold uppercase tracking-wider text-ink-light">AI Dialer</p>
          <div className="mt-2 flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="text-[11px] font-semibold text-accent">Calling multiple lists</span>
          </div>
        </div>

        {/* Center: The visualization paths */}
        <div className="relative h-[280px] flex-1">
          {/* Static paths */}
          <div className="absolute inset-0 flex flex-col justify-between py-6">
            {[0, 1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-px w-full border-b border-dashed border-line opacity-50" />
            ))}
          </div>

          {/* Active calls moving across */}
          {activeCalls.map(call => (
            <motion.div
              key={call.id}
              className="absolute left-0 top-[24px] flex items-center"
              style={{
                y: call.targetIdx * (280 / 4) - 24, // Distribute along height
                x: `${call.progress}%`,
                width: '100%',
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Connection line trail */}
                <div 
                  className="absolute right-full top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent to-ink/20"
                  style={{ width: `${call.progress * 3}px` }}
                />
                
                {/* Node */}
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-colors duration-300",
                  call.outcome ? call.outcome.bg : "bg-ink",
                  call.outcome ? "text-white" : "text-surface"
                )}>
                  {call.outcome ? (
                    <call.outcome.icon className="h-3.5 w-3.5" />
                  ) : (
                    <PhoneOutgoing className="h-3 w-3" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Targets */}
        <div className="relative z-10 flex h-[280px] flex-col justify-between py-2">
          {[0, 1, 2, 3, 4].map((idx) => {
            const hasOutcome = activeCalls.find(c => c.targetIdx === idx && c.outcome);
            return (
              <div 
                key={idx} 
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                  hasOutcome ? `border-transparent ${hasOutcome.outcome?.bg} text-white scale-110 shadow-sm` : "border-line bg-surface text-ink-light"
                )}
              >
                {hasOutcome && hasOutcome.outcome ? (
                  <hasOutcome.outcome.icon className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-line pt-6">
        {outcomes.map(outcome => (
          <div key={outcome.id} className="flex items-center gap-2">
            <div className={cn("flex h-6 w-6 items-center justify-center rounded-md text-white", outcome.bg)}>
              <outcome.icon className="h-3 w-3" />
            </div>
            <span className="text-[13px] font-medium text-ink-light">{outcome.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
