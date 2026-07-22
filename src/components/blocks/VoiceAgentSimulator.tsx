"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  MessageSquare,
  PhoneIncoming,
} from "lucide-react";
import { springPhysics } from "@/lib/motion";
import { cn } from "@/lib/cn";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────────────────
   VoiceAgentSimulator — deep-dark hero frame replaying a live SkipDial call.
   Concentric glowing ring + 5-bar waveform pulse while the agent speaks;
   transcript lines stream in word-by-word (staggerChildren: 0.15) like
   real-time speech; queued CRM actions land with spring pops. Loops forever;
   renders fully static under reduced motion.
   ──────────────────────────────────────────────────────────────────────────── */

const transcript = [
  { who: "grace", text: "Phoenix HVAC, this is Grace. What's going on tonight?" },
  { who: "caller", text: "Hey, my furnace just died. House is dropping fast and we've got a baby." },
  { who: "grace", text: "Got it. I'm marking this urgent. Can I grab the address?" },
  { who: "caller", text: "4218 Camelback Road, Phoenix." },
  { who: "grace", text: "Thanks. Marco's on call tonight, he can be there by 8:45. Does that work?" },
] as const;

const actions = [
  { afterLine: 2, icon: CheckCircle2, title: "Captured issue", meta: "Furnace failure · urgent", tone: "signal" },
  { afterLine: 4, icon: CheckCircle2, title: "Verified address", meta: "4218 Camelback Rd", tone: "signal" },
  { afterLine: 5, icon: Calendar, title: "Dispatching", meta: "Marco · ETA 8:45 PM", tone: "accent" },
  { afterLine: 5, icon: MessageSquare, title: "Text confirmation", meta: "(602) 555-0117", tone: "accent", extraDelay: 900 },
] as const;

const LINE_INTERVAL = 2100;
const LOOP_HOLD = 4200;

/* Word-by-word reveal — 0.15s per word reads like live speech. */
const lineStagger: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.15 } },
};

const wordRise: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: springPhysics },
};

/* Per-bar waveform keyframes — organic, non-uniform pulse. */
const BAR_PEAKS = [
  [0.35, 0.9, 0.5, 1, 0.4],
  [0.5, 1, 0.35, 0.8, 0.55],
  [0.3, 0.75, 1, 0.55, 0.35],
  [0.55, 0.95, 0.45, 0.9, 0.5],
  [0.4, 0.8, 0.6, 1, 0.3],
];
const BAR_IDLE = [0.22, 0.3, 0.26, 0.32, 0.24];

function Waveform({ active, reduce }: { active: boolean; reduce: boolean }) {
  return (
    <div aria-hidden className="flex h-9 items-center gap-[4px]">
      {BAR_PEAKS.map((peaks, i) => (
        <motion.span
          key={i}
          className="h-full w-[4px] origin-center rounded-full bg-accent-soft"
          style={{ boxShadow: "0 0 12px rgba(159,129,252,0.55)" }}
          animate={
            reduce
              ? { scaleY: 0.4, opacity: 0.8 }
              : active
                ? { scaleY: peaks, opacity: 1 }
                : { scaleY: BAR_IDLE[i], opacity: 0.55 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 1.15 + i * 0.08,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  );
}

function GlowRing({ active, reduce }: { active: boolean; reduce: boolean }) {
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
      {!reduce &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-full border border-accent-soft/50"
            animate={active ? { scale: [1, 1.75], opacity: [0.65, 0] } : { scale: 1, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 1,
            }}
          />
        ))}
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-accent text-[14px] font-bold text-white shadow-[0_0_24px_rgba(105,70,235,0.45)] overflow-hidden">
        <Image src="/avatars/grace.png" alt="Grace" width={44} height={44} className="object-cover" />
      </span>
    </span>
  );
}

export function VoiceAgentSimulator({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const [visibleLines, setVisibleLines] = useState(reduce ? transcript.length : 0);
  const [seconds, setSeconds] = useState(47);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Call timer ticks continuously
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setSeconds((s) => (s + 1) % 5400), 1000);
    return () => clearInterval(id);
  }, [reduce]);

  // Transcript loop
  useEffect(() => {
    if (reduce) {
      setVisibleLines(transcript.length);
      return;
    }
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      setVisibleLines(0);
      for (let i = 1; i <= transcript.length; i++) {
        timers.current.push(
          setTimeout(() => !cancelled && setVisibleLines(i), 600 + i * LINE_INTERVAL)
        );
      }
      timers.current.push(
        setTimeout(run, 600 + transcript.length * LINE_INTERVAL + LOOP_HOLD)
      );
    };
    run();
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [reduce]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  // Agent is "speaking" while her line is the latest visible one
  const currentLine = transcript[Math.min(visibleLines, transcript.length) - 1];
  const agentSpeaking = reduce ? true : visibleLines === 0 || currentLine?.who === "grace";

  return (
    <div
      className={cn(
        "ai-glow-border relative grid gap-3 overflow-hidden rounded-2xl border border-line bg-surface p-3 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_40px_120px_-32px_rgba(105,70,235,0.28)] backdrop-blur-md md:grid-cols-[236px_1fr_248px]",
        className
      )}
    >
      {/* Ambient texture */}
      <div
        aria-hidden
        className="dot-grid-inverse pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[420px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
      />

      {/* Caller panel */}
      <div className="relative flex flex-col rounded-xl border border-line bg-surface p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-signal">
            <span className="pulse-dot relative inline-block h-2 w-2 rounded-full bg-signal" />
            Live
          </span>
          <span className="font-mono text-[12px] tabular-nums text-ink-faint">
            {mm}:{ss}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <GlowRing active={agentSpeaking} reduce={reduce} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink">
              Grace · After-hours
            </p>
            <p className="flex items-center gap-1 text-[11.5px] text-ink-faint">
              <PhoneIncoming aria-hidden className="h-3 w-3 shrink-0" />
              <span className="min-w-0 truncate">Inbound · HVAC</span>
            </p>
          </div>
        </div>

        {/* Voice pulse */}
        <div className="mt-5 flex items-center gap-3">
          <Waveform active={agentSpeaking} reduce={reduce} />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
            {agentSpeaking ? "Agent speaking" : "Listening…"}
          </span>
        </div>

        <p className="mt-5 hidden text-[12px] italic leading-relaxed text-ink-light md:block">
          &ldquo;…it&apos;s the furnace, won&apos;t kick on at all. We&apos;ve got a baby in the
          house...&rdquo;
        </p>
      </div>

      {/* Transcript */}
      {/* min-height fits the full transcript so the hero doesn't resize (and
          jitter the scrollbar) as the loop fills and resets */}
      <div className="relative flex min-h-[320px] flex-col rounded-xl border border-line bg-surface p-4 backdrop-blur-md">
        <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Live transcript
        </p>
        <div className="mt-3 flex flex-1 flex-col gap-3" aria-live="off">
          <AnimatePresence mode="popLayout">
            {transcript.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={`${i}-${line.text.slice(0, 12)}`}
                variants={reduce ? undefined : lineStagger}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="grid grid-cols-[52px_1fr] gap-2 text-[13px] leading-snug"
              >
                <span
                  className={cn(
                    "font-mono text-[11px] font-medium",
                    line.who === "grace" ? "text-accent" : "text-ink-faint"
                  )}
                >
                  {line.who === "grace" ? "Grace" : "Caller"}
                </span>
                <span className="text-ink">
                  {line.text.split(" ").map((word, w) => (
                    <motion.span
                      key={w}
                      variants={reduce ? undefined : wordRise}
                      className="inline-block whitespace-pre"
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {!reduce && visibleLines < transcript.length && (
            <div className="grid grid-cols-[52px_1fr] gap-2">
              <span />
              <span aria-hidden className="text-[12px] font-medium text-ink-faint">
                {visibleLines % 2 === 0 ? "Grace is speaking…" : "listening…"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions queued */}
      <div className="relative rounded-xl border border-line bg-surface p-4 backdrop-blur-md">
        <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Actions queued
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <AnimatePresence>
            {actions
              .filter((a) => visibleLines >= a.afterLine)
              .map((a) => (
                <motion.div
                  key={a.title}
                  initial={reduce ? false : { opacity: 0, x: 14, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{
                    ...springPhysics,
                    delay: reduce ? 0 : ("extraDelay" in a ? (a.extraDelay as number) : 0) / 1000,
                  }}
                  className="flex items-start gap-2.5 rounded-lg border border-line bg-surface-alt px-3 py-2.5"
                >
                  <a.icon
                    aria-hidden
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      a.tone === "signal" ? "text-signal" : "text-accent"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold leading-tight text-ink">
                      {a.title}
                    </p>
                    <p className="truncate text-[11.5px] text-ink-faint">{a.meta}</p>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
