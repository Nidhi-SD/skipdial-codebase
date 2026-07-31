"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Phone, PhoneCall, PhoneOff, Check, X } from "@/components/icons/SystemIcons";
import { Stagger, Item } from "@/components/motion";
import { ProblemCard, useProblemLoop } from "@/components/blocks/ProblemVisualCard";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   InboundProblemVisual — three looping mini-scenes, one short line each. Each
   one plays the problem out rather than illustrating it: calls ring and go
   unanswered, a clock hand sweeps into the closed hours, an intake form fills
   in and then stalls. All loop while on screen, freeze on their end state
   under reduced motion, and pause entirely when scrolled away.
   ──────────────────────────────────────────────────────────────────────────── */

/* ── 1 · Calls ring in; three of them never get picked up ──────────────────── */

const CALLS = [1, 1, 1, 0, 1, 1, 0, 1, 0, 1]; // 1 = answered, 0 = missed

function UnansweredCalls({ running }: { running: boolean }) {
  const reduce = useReducedMotion();
  const step = useProblemLoop(CALLS.length, 460, 1400, running && !reduce);

  return (
    <div className="grid grid-cols-5 gap-2.5">
      {CALLS.map((answered, i) => {
        const resolved = reduce || i < step;
        const ringing = !reduce && i === step;

        return (
          <motion.span
            key={i}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300",
              !resolved && !ringing && "bg-surface-alt text-ink-faint/40 ring-1 ring-inset ring-line",
              ringing && "bg-accent-tint text-accent ring-1 ring-inset ring-accent/30",
              resolved && answered === 1 && "bg-accent text-ink-inverse",
              resolved && answered === 0 && "bg-danger/10 text-danger ring-1 ring-inset ring-danger/25"
            )}
            animate={
              ringing
                ? { rotate: [0, -8, 8, -6, 6, 0], scale: 1.06 }
                : { rotate: 0, scale: 1 }
            }
            transition={
              ringing
                ? { rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 0.05 }, scale: { duration: 0.2 } }
                : { duration: 0.25 }
            }
          >
            {/* ring wave while the phone is live */}
            {ringing ? (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl border-2 border-accent"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
              />
            ) : null}

            {ringing ? (
              <PhoneCall aria-hidden className="h-5 w-5" />
            ) : resolved && answered === 0 ? (
              <PhoneOff aria-hidden className="h-5 w-5" />
            ) : (
              <Phone aria-hidden className="h-5 w-5" />
            )}
          </motion.span>
        );
      })}
    </div>
  );
}

/* ── 2 · A clock hand sweeping through mostly-closed hours ─────────────────── */

const CLOSED_HOURS = 15;
const R = 46;
const C = 2 * Math.PI * R;
const OPEN_FRACTION = (24 - CLOSED_HOURS) / 24;
/* Open hours occupy the first slice of the sweep, so the marker crosses the
   purple arc before spending the rest of the lap over red. */
const OPEN_ARC = C * OPEN_FRACTION;
const SWEEP = 9; // seconds per full day

function ClosedClock({ running }: { running: boolean }) {
  const reduce = useReducedMotion();
  const spin = running && !reduce;

  return (
    <div className="relative h-[130px] w-[130px]">
      <svg aria-hidden viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        {/* Closed — the whole ring, so red is what dominates */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgb(var(--danger-rgb) / 0.45)" strokeWidth="16" />
        {/* Open — the small staffed slice the marker crosses first */}
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="rgb(var(--accent-rgb))"
          strokeWidth="16"
          strokeDasharray={`${OPEN_ARC} ${C}`}
        />
        {/* Marker rides the ring — one rotation is one day. Kept out on the
            track so it never crosses the centre label. */}
        <motion.g
          style={{ originX: "60px", originY: "60px" }}
          animate={spin ? { rotate: 360 } : { rotate: 250 }}
          transition={
            spin ? { duration: SWEEP, repeat: Infinity, ease: "linear" } : { duration: 0 }
          }
        >
          <circle
            cx="60"
            cy={60 - R}
            r="6"
            fill="rgb(var(--surface-rgb))"
            stroke="rgb(var(--ink-rgb))"
            strokeWidth="2.5"
          />
        </motion.g>
      </svg>

      {/* Centre stays on message — the sweeping marker carries the motion */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[24px] font-bold leading-none text-danger">15</span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-danger">
          hrs closed
        </span>
      </div>
    </div>
  );
}

/* ── 3 · One form fills in, the other stalls halfway ───────────────────────── */

const ROWS = 5;
const CAPTURED_WHEN_BUSY = 2;

function Notepad({ filled, total, ok }: { filled: number; total: number; ok: boolean }) {
  return (
    <div className="flex-1 rounded-xl border border-line bg-surface-alt/50 p-3">
      <motion.span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full",
          ok ? "bg-accent text-ink-inverse" : "bg-danger/15 text-danger"
        )}
        animate={{ scale: 1 }}
        initial={false}
      >
        {ok ? <Check aria-hidden className="h-3 w-3" /> : <X aria-hidden className="h-3 w-3" />}
      </motion.span>
      <div className="mt-2.5 space-y-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const done = i < filled;
          return (
            <span key={i} className="block h-1.5 overflow-hidden rounded-full">
              {done ? (
                <motion.span
                  className="block h-full rounded-full bg-accent/35"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ transformOrigin: "left" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              ) : (
                <span className="block h-full w-[62%] rounded-full border border-dashed border-danger/40" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MismatchedNotes({ running }: { running: boolean }) {
  const reduce = useReducedMotion();
  const step = useProblemLoop(ROWS, 480, 1600, running && !reduce);
  const filled = reduce ? ROWS : step;

  return (
    <div className="flex w-full max-w-[200px] gap-3">
      <Notepad filled={filled} total={ROWS} ok />
      <Notepad
        filled={Math.min(filled, CAPTURED_WHEN_BUSY)}
        total={ROWS}
        ok={false}
      />
    </div>
  );
}

/* ── Section body ──────────────────────────────────────────────────────────── */

export function InboundProblemVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const running = useInView(ref, { amount: 0.25 });

  return (
    <div ref={ref} className={className}>
      <Stagger className="grid gap-5 md:grid-cols-3" as="ul">
        <Item as="li">
          <ProblemCard
            graphic={<UnansweredCalls running={running} />}
            title="Calls go unanswered"
            sub="When the desk is busy, the phone just keeps ringing."
          />
        </Item>
        <Item as="li">
          <ProblemCard
            graphic={<ClosedClock running={running} />}
            title="Closed most of the day"
            sub="Nights and weekends go straight to voicemail."
          />
        </Item>
        <Item as="li">
          <ProblemCard
            graphic={<MismatchedNotes running={running} />}
            title="Notes vary by person"
            sub="Under pressure, questions get skipped."
          />
        </Item>
      </Stagger>
    </div>
  );
}
