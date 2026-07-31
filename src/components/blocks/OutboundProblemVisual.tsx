"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { BellOff, PhoneMissed, Snowflake } from "@/components/icons/SystemIcons";
import { Stagger, Item } from "@/components/motion";
import { ProblemCard, useProblemLoop } from "@/components/blocks/ProblemVisualCard";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   OutboundProblemVisual — the outbound-page sibling of InboundProblemVisual.
   Three looping mini-scenes: a fresh lead cooling off while nobody calls, a
   callback queue that only ever grows, and an appointment that never gets
   confirmed and then no-shows. Same shell, cadence and reduced-motion rules.
   ──────────────────────────────────────────────────────────────────────────── */

/* ── 1 · A new lead cools while it waits for a callback ────────────────────── */

/** Elapsed time since the lead came in, and how warm it still is. */
const COOLING = [
  { label: "1 min", pct: 100 },
  { label: "5 min", pct: 74 },
  { label: "15 min", pct: 50 },
  { label: "45 min", pct: 28 },
  { label: "2 hrs", pct: 12 },
  { label: "1 day", pct: 4 },
];

function CoolingLead({ running }: { running: boolean }) {
  const reduce = useReducedMotion();
  const step = useProblemLoop(COOLING.length - 1, 620, 1600, running && !reduce);
  const stage = COOLING[reduce ? COOLING.length - 1 : step];
  const cold = stage.pct <= 30;

  return (
    <div className="w-full max-w-[200px]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          Waiting
        </span>
        {/* Keyed remount, no AnimatePresence — an exiting copy would sit in
            the DOM beside the new one and read as two different times. */}
        <motion.span
          key={stage.label}
          className={cn(
            "font-mono text-[22px] font-bold leading-none tabular-nums",
            cold ? "text-danger" : "text-ink"
          )}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {stage.label}
        </motion.span>
      </div>

      {/* Interest draining away */}
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-alt ring-1 ring-inset ring-line">
        <motion.div
          className={cn("h-full rounded-full", cold ? "bg-danger/60" : "bg-accent")}
          animate={{ width: `${stage.pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <motion.span
          animate={cold && !reduce ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className={cn("flex h-5 w-5 items-center justify-center rounded-full", cold ? "bg-danger/15 text-danger" : "bg-accent-tint text-accent")}
        >
          <Snowflake aria-hidden className="h-3 w-3" />
        </motion.span>
        <span
          className={cn(
            "text-[12px] font-semibold transition-colors duration-300",
            cold ? "text-danger" : "text-ink-light"
          )}
        >
          {cold ? "Gone cold" : "Still interested"}
        </span>
      </div>
    </div>
  );
}

/* ── 2 · The callback queue only ever grows ────────────────────────────────── */

const CALLBACKS = ["Missed · 9:14", "Missed · 10:02", "Missed · 11:37", "Missed · 1:20"];

function CallbackPile({ running }: { running: boolean }) {
  const reduce = useReducedMotion();
  const step = useProblemLoop(CALLBACKS.length, 620, 1700, running && !reduce);
  const shown = reduce ? CALLBACKS.length : step;

  return (
    <div className="flex w-full max-w-[190px] flex-col justify-end gap-1.5">
      {CALLBACKS.map((label, i) => {
        const visible = i < shown;
        return (
          <motion.div
            key={label}
            className="flex items-center gap-2 rounded-lg border border-danger/25 bg-danger/[0.06] px-2.5 py-1.5"
            initial={false}
            animate={
              visible
                ? { opacity: 1, x: 0, height: "auto" }
                : { opacity: 0, x: 26, height: 0 }
            }
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <PhoneMissed aria-hidden className="h-3.5 w-3.5 shrink-0 text-danger" />
            <span className="truncate font-mono text-[11.5px] font-medium text-ink-light">
              {label}
            </span>
            {/* the callback nobody ever ticks off */}
            <span className="ml-auto h-3.5 w-3.5 shrink-0 rounded-full border border-dashed border-danger/50" />
          </motion.div>
        );
      })}

      <span className="mt-1 text-center text-[11px] font-semibold text-danger">
        {shown} waiting on a callback
      </span>
    </div>
  );
}

/* ── 3 · No confirmation goes out, so the slot no-shows ────────────────────── */

function SkippedConfirmation({ running }: { running: boolean }) {
  const reduce = useReducedMotion();
  /* 0 booked · 1 reminder never sent · 2 no-show */
  const step = useProblemLoop(2, 1300, 1800, running && !reduce);
  const beat = reduce ? 2 : step;

  return (
    <div className="w-full max-w-[190px]">
      <div
        className={cn(
          "relative rounded-xl border p-3 transition-colors duration-500",
          beat === 2 ? "border-danger/30 bg-danger/[0.06]" : "border-line bg-surface-alt/50"
        )}
      >
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">
          Appointment
        </p>
        <p className="mt-1 text-[15px] font-bold text-ink">Tue · 9:30 AM</p>

        {/* Reminder that never goes out */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <motion.span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full",
              beat === 0 ? "bg-surface text-ink-faint ring-1 ring-inset ring-line" : "bg-danger/15 text-danger"
            )}
            animate={beat === 1 && !reduce ? { scale: [1, 1.18, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: beat === 1 ? Infinity : 0, ease: "easeInOut" }}
          >
            <BellOff aria-hidden className="h-3 w-3" />
          </motion.span>
          <span
            className={cn(
              "text-[11.5px] font-medium transition-colors duration-300",
              beat === 0 ? "text-ink-faint" : "text-danger"
            )}
          >
            No confirmation sent
          </span>
        </div>

        {/* No-show stamp */}
        <AnimatePresence>
          {beat === 2 ? (
            <motion.span
              className="absolute -right-1.5 -top-2.5 rotate-[-8deg] rounded-md border-2 border-danger/50 bg-surface px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-danger"
              initial={reduce ? false : { opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              No-show
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Section body ──────────────────────────────────────────────────────────── */

export function OutboundProblemVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const running = useInView(ref, { amount: 0.25 });

  return (
    <div ref={ref} className={className}>
      <Stagger className="grid gap-5 md:grid-cols-3" as="ul" stagger={0.32}>
        <Item as="li" variant="fadeUpSlow">
          <ProblemCard
            graphic={<CoolingLead running={running} />}
            title="Leads go cold waiting"
            sub="The longer a new lead sits, the less it's worth."
          />
        </Item>
        <Item as="li" variant="fadeUpSlow">
          <ProblemCard
            graphic={<CallbackPile running={running} />}
            title="Callbacks pile up"
            sub="Missed calls wait for someone who never gets to them."
          />
        </Item>
        <Item as="li" variant="fadeUpSlow">
          <ProblemCard
            graphic={<SkippedConfirmation running={running} />}
            title="Confirmations get skipped"
            sub="Unconfirmed appointments quietly turn into no-shows."
          />
        </Item>
      </Stagger>
    </div>
  );
}
