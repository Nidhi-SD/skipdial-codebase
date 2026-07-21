"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Clock,
  MessageSquare,
  LineChart,
  Languages,
  Workflow,
  TrendingUp,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { springPhysics } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   FeatureBento — asymmetric 3-column bento grid on light surfaces.
   Each card carries a cursor-tracking spotlight (CSS vars --x/--y → radial
   gradient overlay) and cascades upward on scroll with spring physics.
   ──────────────────────────────────────────────────────────────────────────── */

const gridStagger: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
};

const cardRise: Variants = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: springPhysics },
};

/* ── SpotlightCard — dark blur card with cursor glow ───────────────────────── */

function SpotlightCard({
  icon: Icon,
  title,
  body,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();

  const onMouseMove = (e: MouseEvent<HTMLLIElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.li
      ref={ref}
      onMouseMove={onMouseMove}
      variants={reduce ? undefined : cardRise}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={springPhysics}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-card transition-colors duration-300 hover:border-line-strong md:p-7",
        className
      )}
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="spotlight-overlay-dark pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-accent-tint text-accent">
        <Icon aria-hidden className="h-[18px] w-[18px]" />
      </span>
      <h3 className="relative mt-4 text-[15.5px] font-semibold text-ink">{title}</h3>
      <p className="relative mt-1.5 max-w-md text-[13.5px] leading-relaxed text-ink-light">
        {body}
      </p>
      {children ? <div className="relative mt-auto pt-6">{children}</div> : null}
    </motion.li>
  );
}

/* ── Mini-visuals ──────────────────────────────────────────────────────────── */

/** 24h coverage strip — call markers landing across a full day. */
function CoverageStrip() {
  const marks = [3, 7, 11, 15, 19, 22];
  return (
    <div className="rounded-xl border border-line bg-surface-alt p-4">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        <span>00:00</span>
        <span className="flex items-center gap-1.5 text-signal">
          <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-signal" />
          0 missed this week
        </span>
        <span>24:00</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-[3px]">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="relative flex h-6 w-full items-end justify-center">
            {marks.includes(i) && (
              <span className="absolute -top-1 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(105,70,235,0.5)]" />
            )}
            <span
              className={cn(
                "w-px rounded-full",
                marks.includes(i) ? "h-5 bg-accent/50" : "h-3 bg-line-strong"
              )}
            />
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-ink-light">
        Nights, weekends, surge hours: every ring answered.
      </p>
    </div>
  );
}

/** Caller utterance → detected intent. */
function IntentSnippet() {
  return (
    <div className="rounded-xl border border-line bg-surface-alt p-4">
      <p className="text-[12px] italic leading-relaxed text-ink-light">
        &ldquo;Hey, my furnace just died and we&rsquo;ve got a baby in the house...&rdquo;
      </p>
      <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
        <ArrowRight aria-hidden className="h-3 w-3" />
        Urgent · service dispatch
      </p>
    </div>
  );
}

/** Mini live bar chart — bars grow in with springs (transform only). */
function MiniBars() {
  const reduce = useReducedMotion();
  const bars = [34, 58, 42, 72, 50, 88, 64];
  return (
    <div className="rounded-xl border border-line bg-surface-alt p-4">
      <div className="flex h-14 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={reduce ? undefined : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ ...springPhysics, delay: i * 0.05 }}
            style={{ height: `${h}%`, transformOrigin: "bottom" }}
            className={cn(
              "w-full rounded-sm",
              i === 5 ? "bg-accent" : "bg-line-strong"
            )}
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-light">
        <span className="font-semibold text-ink">142 calls</span> · today
      </p>
    </div>
  );
}

/** CRM sync pipeline chips. */
function SyncPipeline() {
  const stages = ["Call summary", "Intake fields", "CRM record"];
  return (
    <div className="rounded-xl border border-line bg-surface-alt p-4">
      <div className="flex flex-wrap items-center gap-2">
        {stages.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="rounded-md border border-line bg-surface px-2.5 py-1 text-[11.5px] font-medium text-ink">
              {s}
            </span>
            {i < stages.length - 1 && (
              <ArrowRight aria-hidden className="h-3 w-3 text-ink-faint" />
            )}
          </span>
        ))}
        <span className="flex items-center gap-1 rounded-md bg-signal/15 px-2 py-1 text-[11px] font-semibold text-signal">
          <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
          Synced · 0.4s
        </span>
      </div>
      <p className="mt-3 text-[11.5px] text-ink-light">
        HubSpot, Salesforce, Zoho, GoHighLevel, custom webhooks
      </p>
    </div>
  );
}

/** Language chips. */
function LanguageChips() {
  const langs = ["English", "Español", "Français", "Deutsch", "Português", "हिन्दी"];
  return (
    <div className="flex flex-wrap gap-2">
      {langs.map((l) => (
        <span
          key={l}
          className="rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-ink"
        >
          {l}
        </span>
      ))}
      <span className="rounded-full border border-dashed border-line-strong px-3 py-1 text-[12px] font-medium text-ink-faint">
        +12 more
      </span>
    </div>
  );
}

/** Concurrency stat. */
function ScaleStat() {
  return (
    <div className="rounded-xl border border-line bg-surface-alt p-4">
      <p className="font-display text-[28px] font-bold leading-none text-ink">
        50<span className="text-accent">×</span>
      </p>
      <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-light">
        simultaneous calls, one agent. No hold queue, no degraded intake.
      </p>
    </div>
  );
}

/* ── Grid ──────────────────────────────────────────────────────────────────── */

export function FeatureBento({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.ul
      variants={reduce ? undefined : gridStagger}
      initial={reduce ? undefined : "initial"}
      whileInView={reduce ? undefined : "animate"}
      viewport={{ once: true, margin: "-80px 0px" }}
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      <SpotlightCard
        icon={Clock}
        title="24/7 Call Answering"
        body="Every call picked up immediately: nights, weekends, and peak-demand surges included."
        className="sm:col-span-2"
      >
        <CoverageStrip />
      </SpotlightCard>

      <SpotlightCard
        icon={MessageSquare}
        title="Natural Language"
        body="Callers speak normally. No menus, no button prompts. The agent understands intent conversationally."
      >
        <IntentSnippet />
      </SpotlightCard>

      <SpotlightCard
        icon={LineChart}
        title="Real-Time Analytics"
        body="Call volume, outcomes, and qualification metrics visible the moment a call ends."
      >
        <MiniBars />
      </SpotlightCard>

      <SpotlightCard
        icon={Workflow}
        title="CRM Integration"
        body="Summaries, intake fields, and timestamps land in the tools your team already uses."
        className="sm:col-span-2"
      >
        <SyncPipeline />
      </SpotlightCard>

      <SpotlightCard
        icon={Languages}
        title="Multi-Language Support"
        body="Serve callers in the language they're most comfortable speaking."
        className="sm:col-span-2"
      >
        <LanguageChips />
      </SpotlightCard>

      <SpotlightCard
        icon={TrendingUp}
        title="Built to Scale"
        body="Answer one call or fifty simultaneously. Intake quality never degrades under volume."
        className="sm:col-span-2 lg:col-span-1"
      >
        <ScaleStat />
      </SpotlightCard>
    </motion.ul>
  );
}
