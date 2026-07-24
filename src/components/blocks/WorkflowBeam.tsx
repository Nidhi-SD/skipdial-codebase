"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  PhoneIncoming,
  Bot,
  Database,
  Check,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { springPhysics } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   WorkflowBeam — 3-node call-routing diagram on a deep-dark panel.
   Animated to show a sequence of events.
   ──────────────────────────────────────────────────────────────────────────── */

const container: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
};

const nodeRise: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: springPhysics },
};

/* One traveling beam — dash covers 30% of the path. Fires when `trigger` is true. */
function BeamPath({
  d,
  gradient,
  trigger,
}: {
  d: string;
  gradient: string;
  trigger: boolean;
}) {
  return (
    <>
      <motion.path
        d={d}
        stroke={gradient}
        strokeWidth={6}
        strokeLinecap="round"
        filter="url(#wf-beam-blur)"
        initial={{ pathLength: 0.3, pathSpacing: 0.7, pathOffset: 0, opacity: 0 }}
        animate={
          trigger
            ? { pathOffset: [0, 1], opacity: [0, 0.45, 0.45, 0] }
            : { pathOffset: 0, opacity: 0 }
        }
        transition={{ duration: 1.2, ease: "linear" }}
      />
      <motion.path
        d={d}
        stroke={gradient}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0.3, pathSpacing: 0.7, pathOffset: 0, opacity: 0 }}
        animate={
          trigger
            ? { pathOffset: [0, 1], opacity: [0, 1, 1, 0] }
            : { pathOffset: 0, opacity: 0 }
        }
        transition={{ duration: 1.2, ease: "linear" }}
      />
    </>
  );
}

function Connector({ reduce, trigger }: { reduce: boolean; trigger: boolean }) {
  return (
    <div aria-hidden className="flex shrink-0 items-center justify-center md:w-24">
      {/* Horizontal (md+) */}
      <svg viewBox="0 0 96 24" fill="none" className="hidden h-6 w-full md:block">
        <path d="M0 12 H96" stroke="rgba(105,70,235,0.18)" strokeWidth="1.5" />
        {!reduce && <BeamPath d="M0 12 H96" gradient="url(#wf-beam-grad-h)" trigger={trigger} />}
      </svg>
      {/* Vertical (mobile) */}
      <svg viewBox="0 0 24 48" fill="none" className="block h-12 w-6 md:hidden">
        <path d="M12 0 V48" stroke="rgba(105,70,235,0.18)" strokeWidth="1.5" />
        {!reduce && <BeamPath d="M12 0 V48" gradient="url(#wf-beam-grad-v)" trigger={trigger} />}
      </svg>
    </div>
  );
}

function WorkflowNode({
  icon: Icon,
  title,
  meta,
  isActive = false,
  isComplete = false,
  isDimmed = false,
  center = false,
  statusIndicator,
  children,
}: {
  icon: LucideIcon;
  title: string;
  meta: string;
  isActive?: boolean;
  isComplete?: boolean;
  isDimmed?: boolean;
  center?: boolean;
  statusIndicator?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={nodeRise}
      className={cn(
        "relative flex items-start gap-3.5 rounded-2xl border bg-surface p-4 backdrop-blur-md transition-all duration-700 ease-out md:flex-1 md:p-5",
        isActive
          ? center
            ? "border-accent/50 shadow-[0_0_48px_-8px_rgba(105,70,235,0.4)]"
            : "border-ink/20 shadow-lg"
          : isComplete
          ? "border-signal/40 shadow-[0_0_32px_-8px_rgba(22,163,74,0.2)]"
          : "border-line shadow-sm",
        isDimmed && !isActive && !isComplete && "opacity-50 grayscale-[50%]"
      )}
    >
      {/* Status Badge */}
      {statusIndicator && (
        <span aria-hidden className="absolute -top-2.5 right-4 z-10 transition-opacity duration-300">
          {statusIndicator}
        </span>
      )}
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500",
          isActive || isComplete
            ? center
              ? "border-accent/40 bg-accent text-white shadow-[0_0_20px_rgba(105,70,235,0.5)]"
              : isComplete
              ? "border-signal bg-signal text-white shadow-[0_0_16px_rgba(22,163,74,0.4)]"
              : "border-ink/20 bg-ink/5 text-ink"
            : "border-line bg-surface-alt text-ink-light"
        )}
      >
        <Icon aria-hidden className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 transition-opacity duration-500">
        <p
          className={cn(
            "text-[14.5px] font-bold leading-snug transition-colors",
            isActive || isComplete ? "text-ink" : "text-ink-light"
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-ink-light transition-all">
          {meta}
        </p>
        {children}
      </div>
    </motion.div>
  );
}

export function WorkflowBeam({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  
  // Steps: 0: Idle, 1: Inbound Call, 2: Agent Answers, 3: Fetching Data, 4: Conversing, 5: CRM Sync, 6: Complete
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === 0) timeout = setTimeout(() => setStep(1), 1000); 
    else if (step === 1) timeout = setTimeout(() => setStep(2), 1500); 
    else if (step === 2) timeout = setTimeout(() => setStep(3), 2000); 
    else if (step === 3) timeout = setTimeout(() => setStep(4), 1500); 
    else if (step === 4) timeout = setTimeout(() => setStep(5), 3500); 
    else if (step === 5) timeout = setTimeout(() => setStep(6), 2500); 
    else if (step === 6) timeout = setTimeout(() => setStep(0), 3000); 
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <motion.div
      variants={reduce ? undefined : container}
      initial={reduce ? undefined : "initial"}
      whileInView={reduce ? undefined : "animate"}
      viewport={{ once: true, margin: "-80px 0px" }}
      className={cn(
        "band-zinc relative overflow-hidden rounded-3xl border border-line p-5 md:p-8",
        className
      )}
    >
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="wf-beam-grad-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6946EB" />
            <stop offset="60%" stopColor="#9F81FC" />
            <stop offset="100%" stopColor="#E9E2FF" />
          </linearGradient>
          <linearGradient id="wf-beam-grad-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6946EB" />
            <stop offset="60%" stopColor="#9F81FC" />
            <stop offset="100%" stopColor="#E9E2FF" />
          </linearGradient>
          <filter id="wf-beam-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden
        className="dot-grid-inverse absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_30%,black,transparent)]"
      />

      {/* Panel header */}
      <div className="relative flex items-center justify-between">
        <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-light">
          <span
            className={cn(
              "relative inline-block h-2 w-2 rounded-full transition-colors",
              step > 0 && step < 6 ? "bg-signal pulse-dot" : "bg-ink-faint"
            )}
          />
          Live call routing
        </p>
        <p className="hidden font-mono text-[11px] tabular-nums text-ink-faint sm:block">
          handoff &lt; 400 ms
        </p>
      </div>

      {/* Nodes + beams */}
      <div className="relative mt-6 flex flex-col items-stretch md:flex-row md:items-center">
        
        {/* NODE 1: Inbound Call */}
        <WorkflowNode
          icon={PhoneIncoming}
          title="Inbound Call"
          meta={step >= 1 ? "Caller · (602) 555-0117" : "Waiting for call..."}
          isActive={step === 1}
          isComplete={step > 1 && step < 6}
          isDimmed={step === 0}
        />

        <Connector reduce={reduce} trigger={step === 1} />

        {/* NODE 2: SkipDial AI Agent */}
        <WorkflowNode
          icon={Bot}
          title="SkipDial AI Agent"
          meta={
            step === 2 ? "Connecting..." : 
            step >= 3 && step <= 5 ? "Qualifying intent · collecting intake" : 
            "Standby"
          }
          center
          isActive={step >= 2 && step <= 5}
          isDimmed={step < 2}
          statusIndicator={
            step >= 2 && step <= 4 ? (
              <span className="absolute right-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10.5px] font-semibold text-accent shadow-[0_4px_16px_rgba(105,70,235,0.18)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                {step === 2 ? "Connecting…" : "Running…"}
              </span>
            ) : null
          }
        >
          {/* Waveform animates only when actively conversing */}
          <span aria-hidden className="mt-2 flex h-4 items-center gap-[3px] opacity-100 transition-opacity">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn(
                  "w-[3px] rounded-full transition-all duration-300",
                  step >= 3 && step <= 5 ? "bg-accent/80 waveform-bar" : "bg-line h-[4px]"
                )}
                style={
                  step >= 3 && step <= 5 
                  ? { height: `${45 + ((i * 29) % 50)}%`, animationDelay: `${i * 0.14}s` }
                  : {}
                }
              />
            ))}
          </span>
        </WorkflowNode>

        <Connector reduce={reduce} trigger={step === 3 || step === 5} />

        {/* NODE 3: CRM */}
        <WorkflowNode
          icon={Database}
          title="CRM Sync"
          meta={
            step === 3 ? "Fetching customer context..." :
            step === 5 ? "Syncing conversation notes..." :
            step === 6 ? "Record updated · follow up queued" :
            "Awaiting data sync"
          }
          isActive={step === 3 || step === 5}
          isComplete={step === 6}
          isDimmed={step < 3}
          statusIndicator={
            step === 3 || step === 5 ? (
              <span className="absolute right-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10.5px] font-semibold text-ink shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
                <Loader2 aria-hidden className="h-2.5 w-2.5 animate-spin text-ink-light" strokeWidth={3} />
                {step === 3 ? "Fetching" : "Syncing"}
              </span>
            ) : step === 6 ? (
              <span className="absolute right-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10.5px] font-semibold text-signal shadow-[0_4px_16px_rgba(22,163,74,0.18)]">
                <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
                Qualified
              </span>
            ) : null
          }
        >
          {step === 6 && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-signal/15 px-2 py-0.5 text-[11px] font-semibold text-signal">
              <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
              Lead Captured
            </span>
          )}
        </WorkflowNode>
      </div>
    </motion.div>
  );
}
