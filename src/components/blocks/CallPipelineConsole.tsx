"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Check,
  Loader2,
  Lock,
  PhoneIncoming,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { EASE, springPhysics } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   CallPipelineConsole — the operations surface behind a live call.

   Deliberately NOT a flow diagram: it shows the machinery doing work, which is
   what this section actually claims. Each column maps to one of the section's
   four steps — intake sheet filling itself (02), qualification rules resolving
   and routing (03), slot held plus systems synced (03/04) — with the header
   carrying the live call itself (01).

   The conversation is intentionally almost absent here: the hero's
   VoiceAgentSimulator already owns transcript-and-actions, so this one leans on
   structured data instead and the two don't read as the same widget twice.

   One flat beat script drives everything. Every visible value derives from the
   current beat index, so there is a single clock and no nested timers.
   ──────────────────────────────────────────────────────────────────────────── */

/* The intake script the agent is configured to collect (step 02).
   `flag` marks a value that should read as a warning once captured. */
const FIELDS: readonly {
  label: string;
  value: string;
  flag?: boolean;
}[] = [
  { label: "Caller", value: "Sarah Mitchell" },
  { label: "Number", value: "(602) 555-0117" },
  { label: "Service", value: "Furnace — no heat" },
  { label: "Address", value: "4218 Camelback Rd" },
  { label: "Urgency", value: "High · infant at home", flag: true },
];

/* Business rules evaluated against the captured record (step 03). */
const RULES = [
  { label: "Within service area", detail: "Phoenix metro" },
  { label: "Job value threshold", detail: "Est. $1,240" },
  { label: "After-hours protocol", detail: "Escalate to on-call" },
] as const;

/* Downstream systems written to (step 04). */
const SYNCS = [
  { label: "HubSpot", detail: "Deal created" },
  { label: "Slack · #dispatch", detail: "Team notified" },
  { label: "SMS confirmation", detail: "Sent to caller" },
] as const;

const SLOTS = ["6:15 PM", "7:30 PM", "8:45 PM", "9:30 PM"] as const;
const CHOSEN_SLOT = 2;

/* ── The beat script ───────────────────────────────────────────────────────
   Flat and explicit so retiming is a single edit. ~11.6s per pass. Every
   derived value below is a clamp over this index — no second source of truth. */
const BEATS: readonly number[] = [
  1000, // 0      call answered
  620,
  620,
  620,
  620,
  620, // 1–5    capture each intake field
  560,
  560,
  560, // 6–8    evaluate each rule
  700, // 9      routing verdict
  1500, // 10     slot held
  480,
  480,
  480, // 11–13  write each system
  2200, // 14     settled, then loop
];

const LAST_BEAT = BEATS.length - 1;

const STAGES = ["Answer", "Intake", "Qualify", "Sync"] as const;

/* ── Motion ────────────────────────────────────────────────────────────────
   Console chrome always paints; only its contents animate in. Gating the
   frame on a viewport callback would mean one undelivered event leaves a
   blank hole where the showpiece belongs. */

const consoleIn: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

const paneIn: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: springPhysics },
};

const rowIn: Variants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: springPhysics },
};

/* ── Hooks ────────────────────────────────────────────────────────────────── */

/** Page visibility. A background tab keeps firing timers but freezes rAF, so
    the clock would advance while framer's transitions stall. */
function useDocumentVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return visible;
}

/** Resolves text character-by-character out of noise — reads as extraction
    rather than as text simply appearing. Mounts once per capture, so the
    interval is short-lived and there is never more than one running.
    Stride keeps the duration ~350ms whatever the value's length. */
function ScrambleValue({ text, reduce }: { text: string; reduce: boolean }) {
  const [out, setOut] = useState(reduce ? text : "");

  useEffect(() => {
    if (reduce) {
      setOut(text);
      return;
    }
    const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%&";
    const stride = Math.max(1, Math.ceil(text.length / 14));
    let resolved = 0;

    const id = window.setInterval(() => {
      resolved += stride;
      if (resolved >= text.length) {
        setOut(text);
        window.clearInterval(id);
        return;
      }
      setOut(
        text.slice(0, resolved) +
          text
            .slice(resolved)
            .replace(/\S/g, () => NOISE[(Math.random() * NOISE.length) | 0])
      );
    }, 24);

    return () => window.clearInterval(id);
  }, [text, reduce]);

  /* Non-breaking space holds the line box before the first frame lands. */
  return <>{out || " "}</>;
}

/* ── Pieces ───────────────────────────────────────────────────────────────── */

function StageRail({ stage }: { stage: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {STAGES.map((label, i) => {
        const done = stage > i;
        const active = stage === i;
        return (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-500",
                done
                  ? "text-signal"
                  : active
                    ? "text-accent"
                    : "text-ink-faint/70"
              )}
            >
              {label}
            </span>
            {i < STAGES.length - 1 && (
              <span className="relative block h-px w-5 overflow-hidden rounded-full bg-line">
                <motion.span
                  className="absolute inset-y-0 left-0 block"
                  style={{
                    background: done
                      ? "rgb(var(--signal-rgb))"
                      : "rgb(var(--accent-rgb))",
                  }}
                  animate={{ width: done ? "100%" : active ? "45%" : "0%" }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Pane({
  title,
  meta,
  children,
  className,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={paneIn}
      className={cn(
        "relative flex flex-col rounded-xl border border-line bg-surface/85 p-3.5 backdrop-blur-sm",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.85)]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          {title}
        </h4>
        {meta}
      </header>
      <div className="mt-3 flex flex-1 flex-col">{children}</div>
    </motion.section>
  );
}

/** Small circular determinate arc — used for the per-system write. */
function SyncArc({ complete }: { complete: boolean }) {
  return (
    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
      <svg viewBox="0 0 20 20" className="h-4 w-4 -rotate-90">
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          strokeWidth="2.5"
          style={{ stroke: "rgb(var(--line-rgb))" }}
        />
        <motion.circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ stroke: "rgb(var(--signal-rgb))" }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: complete ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </svg>
      <AnimatePresence>
        {complete && (
          <motion.span
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={springPhysics}
            className="absolute text-signal"
          >
            <Check className="h-2.5 w-2.5" strokeWidth={4} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ── Console ──────────────────────────────────────────────────────────────── */

export function CallPipelineConsole({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "0px 0px -10% 0px" });
  const visible = useDocumentVisible();

  const running = inView && visible && !reduce;

  /* Entrance latch, sharing the loop's observer rather than adding a second. */
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  /* Backstop: if that observer never delivers, the panes would sit at opacity 0
     forever. Poll geometry until entry, gated on actually being on screen so
     the reveal is never spent before the reader arrives. */
  useEffect(() => {
    if (entered) return;
    const check = () => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) setEntered(true);
    };
    const id = window.setInterval(check, 700);
    return () => window.clearInterval(id);
  }, [entered]);

  /* One clock. Reduced motion parks on the final beat — the settled console
     tells the whole story in a single frame. */
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setBeat((b) => (b + 1) % BEATS.length),
      BEATS[beat]
    );
    return () => window.clearTimeout(id);
  }, [beat, running]);

  const b = reduce ? LAST_BEAT : beat;

  /* Everything below is a clamp over the beat index. */
  const fieldsShown = Math.max(0, Math.min(FIELDS.length, b));
  const rulesShown = Math.max(0, Math.min(RULES.length, b - 5));
  const verdict = b >= 9;
  const booked = b >= 10;
  const syncsShown = Math.max(0, Math.min(SYNCS.length, b - 10));
  const settled = b === LAST_BEAT;

  const stage = b === 0 ? 0 : b <= 5 ? 1 : b <= 10 ? 2 : b <= 13 ? 3 : 4;

  /* Call timer reads as continuous rather than resetting with the loop. */
  const [seconds, setSeconds] = useState(12);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setSeconds((s) => (s + 1) % 3600),
      1000
    );
    return () => window.clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const capturing = b >= 1 && b <= FIELDS.length;

  return (
    <motion.div
      ref={rootRef}
      variants={reduce ? undefined : consoleIn}
      initial={reduce ? undefined : "initial"}
      animate={reduce ? undefined : entered ? "animate" : "initial"}
      className={cn(
        "band-lavender relative overflow-hidden rounded-3xl border border-line p-4 md:p-6",
        "shadow-[0_1px_0_rgb(255_255_255/0.7)_inset,0_40px_120px_-48px_rgb(var(--accent-rgb)/0.3)]",
        !running && "wf-paused",
        className
      )}
    >
      <div
        aria-hidden
        className="dot-grid-inverse pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(75%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[520px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "rgb(var(--accent-rgb) / 0.13)" }}
      />

      {/* One static description; the live internals are hidden from AT so a
          screen reader gets the claim, not a frozen slice of the loop. */}
      <p className="sr-only">
        A live call is answered, the agent captures caller name, number, service
        needed, address and urgency, checks them against service area, job value
        and after-hours rules, holds an 8:45 PM slot with the on-call
        technician, then writes the record to HubSpot, Slack and an SMS
        confirmation.
      </p>

      <div aria-hidden className="relative">
        {/* ── Header: the live call itself (step 01) ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal">
              <span className="pulse-dot relative inline-block h-2 w-2 rounded-full bg-signal" />
              Live call
            </span>
            <span className="font-mono text-[12px] tabular-nums text-ink-faint">
              {mm}:{ss}
            </span>

            {/* Waveform — house .waveform-bar keyframe, reduced-motion aware */}
            <span className="flex h-4 items-end gap-[3px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "w-[3px] rounded-full transition-colors duration-300",
                    settled ? "h-[4px] bg-line" : "waveform-bar bg-accent/80"
                  )}
                  style={
                    settled
                      ? undefined
                      : {
                          height: `${45 + ((i * 29) % 50)}%`,
                          animationDelay: `${i * 0.13}s`,
                        }
                  }
                />
              ))}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <StageRail stage={stage} />
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-[10.5px] text-ink-light sm:flex">
              <PhoneIncoming className="h-3 w-3" />
              Grace · after-hours
            </span>
          </div>
        </div>

        {/* ── Three panes ── */}
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-[1.05fr_1fr_0.95fr]">
          {/* 02 · Structured information gathering */}
          <Pane
            title="Intake script"
            meta={
              <span className="font-mono text-[10px] tabular-nums text-ink-faint">
                {fieldsShown}/{FIELDS.length}
              </span>
            }
          >
            <ul className="flex flex-col gap-1.5">
              {FIELDS.map((f, i) => {
                const shown = fieldsShown > i;
                const active = capturing && b - 1 === i;
                return (
                  <li
                    key={f.label}
                    className={cn(
                      "relative grid grid-cols-[62px_1fr_16px] items-center gap-2 rounded-md border py-1.5 pl-2 pr-1.5 transition-colors duration-500",
                      active
                        ? "border-accent/35 bg-accent-tint/60"
                        : shown
                          ? "border-transparent bg-surface-alt/70"
                          : "border-transparent bg-transparent"
                    )}
                  >
                    <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                      {f.label}
                    </span>

                    {/* Reserved line box: values resolve in place, never reflow */}
                    <span
                      className={cn(
                        "min-w-0 truncate text-[12.5px] font-medium tabular-nums",
                        f.flag && shown ? "text-warn" : "text-ink"
                      )}
                    >
                      {shown ? (
                        <ScrambleValue text={f.value} reduce={reduce} />
                      ) : (
                        <span className="text-ink-faint/50">— — —</span>
                      )}
                    </span>

                    <span className="flex h-4 w-4 items-center justify-center">
                      <AnimatePresence mode="wait">
                        {shown && !active ? (
                          <motion.span
                            key="ok"
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={springPhysics}
                            className="text-signal"
                          >
                            <Check className="h-3 w-3" strokeWidth={4} />
                          </motion.span>
                        ) : active ? (
                          <motion.span
                            key="busy"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-accent"
                          >
                            <Loader2
                              className="h-3 w-3 animate-spin"
                              strokeWidth={3}
                            />
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Pane>

          {/* 03 · Intelligent qualification */}
          <Pane title="Qualification rules">
            <ul className="flex flex-col gap-1.5">
              {RULES.map((r, i) => {
                const shown = rulesShown > i;
                const active = !shown && rulesShown === i && b >= 6 && b <= 8;
                return (
                  <li
                    key={r.label}
                    className="grid grid-cols-[16px_1fr] items-start gap-2 rounded-md bg-surface-alt/60 px-2 py-1.5"
                  >
                    <span className="mt-0.5 flex h-4 w-4 items-center justify-center">
                      {shown ? (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={springPhysics}
                          className="text-signal"
                        >
                          <Check className="h-3 w-3" strokeWidth={4} />
                        </motion.span>
                      ) : active ? (
                        <Loader2
                          className="h-3 w-3 animate-spin text-accent"
                          strokeWidth={3}
                        />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-line" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-[12.5px] font-medium transition-colors duration-500",
                          shown ? "text-ink" : "text-ink-faint"
                        )}
                      >
                        {r.label}
                      </span>
                      <span className="block truncate font-mono text-[10.5px] text-ink-faint">
                        {shown || active ? r.detail : "pending"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Routing verdict — the decision the rules produce */}
            <div className="mt-auto pt-3">
              <span className="block h-[54px]">
                <AnimatePresence>
                  {verdict && (
                    <motion.span
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={springPhysics}
                      className="flex items-start gap-2 rounded-lg border px-2.5 py-2"
                      style={{
                        borderColor: "rgb(var(--warn-rgb) / 0.35)",
                        background: "rgb(var(--warn-rgb) / 0.08)",
                      }}
                    >
                      <Siren className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
                      <span className="min-w-0">
                        <span className="block text-[12px] font-bold text-ink">
                          Escalate · on-call dispatch
                        </span>
                        <span className="block truncate font-mono text-[10.5px] text-ink-light">
                          Marco R. · protocol AH-2
                        </span>
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </div>
          </Pane>

          {/* 03/04 · Booking + team sync */}
          <Pane
            title="Booking & sync"
            meta={
              settled ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springPhysics}
                  className="flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-signal"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Resolved
                </motion.span>
              ) : undefined
            }
            className="md:col-span-2 lg:col-span-1"
          >
            {/* Slot strip — the chosen slot locks in */}
            <div className="grid grid-cols-4 gap-1.5">
              {SLOTS.map((slot, i) => {
                const chosen = booked && i === CHOSEN_SLOT;
                return (
                  <motion.span
                    key={slot}
                    animate={{ scale: chosen ? 1.04 : 1 }}
                    transition={springPhysics}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-md border py-1.5 font-mono text-[10.5px] tabular-nums transition-colors duration-500",
                      chosen
                        ? "border-signal/45 bg-signal/10 font-semibold text-signal"
                        : "border-line bg-surface-alt/60 text-ink-faint"
                    )}
                  >
                    {slot}
                    <span className="flex h-3 items-center">
                      {chosen && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.3 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={springPhysics}
                        >
                          <Lock className="h-2.5 w-2.5" strokeWidth={3} />
                        </motion.span>
                      )}
                    </span>
                  </motion.span>
                );
              })}
            </div>

            <p className="mt-2 font-mono text-[10.5px] text-ink-faint">
              {booked ? "Today · held with Marco R." : "Checking calendar…"}
            </p>

            {/* Systems written to */}
            <ul className="mt-3 flex flex-col gap-1.5">
              {SYNCS.map((s, i) => {
                const done = syncsShown > i;
                const active = !done && syncsShown === i && b >= 11 && b <= 13;
                return (
                  <motion.li
                    key={s.label}
                    variants={reduce ? undefined : rowIn}
                    className="grid grid-cols-[16px_1fr] items-center gap-2 rounded-md bg-surface-alt/60 px-2 py-1.5"
                  >
                    <SyncArc complete={done} />
                    <span className="flex min-w-0 items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-[12px] font-medium transition-colors duration-500",
                          done ? "text-ink" : "text-ink-faint"
                        )}
                      >
                        {s.label}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-ink-faint">
                        {done ? s.detail : active ? "writing…" : "queued"}
                      </span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </Pane>
        </div>
      </div>
    </motion.div>
  );
}
