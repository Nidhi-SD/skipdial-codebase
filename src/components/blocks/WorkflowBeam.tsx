"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  PhoneIncoming,
  Bot,
  Database,
  Check,
  type LucideIcon,
} from "lucide-react";
import { springPhysics } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   WorkflowBeam — 3-node call-routing diagram on a deep-dark panel:
   [Inbound Call] → [SkipDial AI Agent] → [CRM Sync & Lead Qualified].
   A glowing data packet travels the SVG connectors continuously via
   strokeDasharray/strokeDashoffset (framer-motion pathOffset loop).
   ──────────────────────────────────────────────────────────────────────────── */

const container: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
};

const nodeRise: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: springPhysics },
};

/* One traveling beam — dash covers 30% of the path, loops seamlessly. */
function BeamPath({
  d,
  gradient,
  delay = 0,
}: {
  d: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <>
      {/* Soft glow underlayer */}
      <motion.path
        d={d}
        stroke={gradient}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.45}
        filter="url(#wf-beam-blur)"
        initial={{ pathLength: 0.3, pathSpacing: 0.7, pathOffset: 0 }}
        animate={{ pathOffset: [0, 1] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "linear", delay }}
      />
      {/* Bright core */}
      <motion.path
        d={d}
        stroke={gradient}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0.3, pathSpacing: 0.7, pathOffset: 0 }}
        animate={{ pathOffset: [0, 1] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "linear", delay }}
      />
    </>
  );
}

function Connector({ reduce, delay }: { reduce: boolean; delay?: number }) {
  return (
    <div aria-hidden className="flex shrink-0 items-center justify-center md:w-24">
      {/* Horizontal (md+) */}
      <svg viewBox="0 0 96 24" fill="none" className="hidden h-6 w-full md:block">
        <path d="M0 12 H96" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {!reduce && <BeamPath d="M0 12 H96" gradient="url(#wf-beam-grad-h)" delay={delay} />}
      </svg>
      {/* Vertical (mobile) */}
      <svg viewBox="0 0 24 48" fill="none" className="block h-12 w-6 md:hidden">
        <path d="M12 0 V48" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {!reduce && <BeamPath d="M12 0 V48" gradient="url(#wf-beam-grad-v)" delay={delay} />}
      </svg>
    </div>
  );
}

function WorkflowNode({
  icon: Icon,
  title,
  meta,
  center = false,
  children,
}: {
  icon: LucideIcon;
  title: string;
  meta: string;
  center?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={nodeRise}
      className={cn(
        "relative flex items-start gap-3.5 rounded-2xl border p-4 backdrop-blur-md md:flex-1 md:p-5",
        center
          ? "border-accent/40 bg-zinc-900/80 shadow-[0_0_48px_-8px_rgba(105,70,235,0.45)]"
          : "border-white/10 bg-zinc-900/80"
      )}
    >
      {/* Floating status choreography — Running… holds, Completed lands */}
      {center && (
        <span aria-hidden className="absolute -top-2.5 right-4">
          <span className="wf-status-running absolute right-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-zinc-900 px-2.5 py-0.5 text-[10.5px] font-semibold text-accent-soft shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-soft" />
            Running…
          </span>
          <span className="wf-status-completed flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-zinc-900 px-2.5 py-0.5 text-[10.5px] font-semibold text-signal shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
            Completed
          </span>
        </span>
      )}
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
          center
            ? "border-accent/40 bg-accent text-white shadow-[0_0_20px_rgba(105,70,235,0.6)]"
            : "border-white/10 bg-white/5 text-accent-soft"
        )}
      >
        <Icon aria-hidden className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="text-[14.5px] font-bold leading-snug text-white">{title}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500">{meta}</p>
        {children}
      </div>
    </motion.div>
  );
}

export function WorkflowBeam({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={reduce ? undefined : container}
      initial={reduce ? undefined : "initial"}
      whileInView={reduce ? undefined : "animate"}
      viewport={{ once: true, margin: "-80px 0px" }}
      className={cn(
        "band-zinc relative overflow-hidden rounded-3xl border border-white/10 p-5 md:p-8",
        className
      )}
    >
      {/* Shared SVG defs for the beams */}
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
        <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          <span className="pulse-dot relative inline-block h-2 w-2 rounded-full bg-signal" />
          Live call routing
        </p>
        <p className="hidden font-mono text-[11px] tabular-nums text-zinc-500 sm:block">
          handoff &lt; 400 ms
        </p>
      </div>

      {/* Nodes + beams */}
      <div className="relative mt-6 flex flex-col items-stretch md:flex-row md:items-center">
        <WorkflowNode
          icon={PhoneIncoming}
          title="Inbound Call"
          meta="Caller · (602) 555-0117 · after hours"
        />
        <Connector reduce={reduce} />
        <WorkflowNode
          icon={Bot}
          title="SkipDial AI Agent"
          meta="Qualifying intent · collecting intake"
          center
        >
          <span aria-hidden className="mt-2 flex h-4 items-center gap-[3px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="waveform-bar w-[3px] rounded-full bg-accent-soft/80"
                style={{ height: `${45 + ((i * 29) % 50)}%`, animationDelay: `${i * 0.14}s` }}
              />
            ))}
          </span>
        </WorkflowNode>
        <Connector reduce={reduce} delay={0.4} />
        <WorkflowNode
          icon={Database}
          title="CRM Sync & Lead Qualified"
          meta="Record created · follow-up queued"
        >
          <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-signal/15 px-2 py-0.5 text-[11px] font-semibold text-signal">
            <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
            Qualified
          </span>
        </WorkflowNode>
      </div>
    </motion.div>
  );
}
