"use client";

import { useEffect, useRef, useState, type ElementType, type SVGProps } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  PhoneIncoming,
} from "lucide-react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* Live hero widget — replays an after-hours HVAC dispatch call (mockup deck,
   Direction A hero). Transcript lines stream in; queued actions land as the
   agent works. Loops forever; renders fully static under reduced motion. */

function CapturedIssueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="5" width="13" height="10" rx="2.2" />
      <circle cx="7.5" cy="8.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.3" cy="15.3" r="4.1" fill="currentColor" stroke="none" />
      <polyline points="15.5,15.4 16.7,16.5 19.1,14" stroke="white" strokeWidth={1.5} />
    </svg>
  );
}

function VerifiedAddressIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round" {...props}>
      <path d="M12 21C12 21 18.5 14.7 18.5 9.4A6.5 6.5 0 1 0 5.5 9.4C5.5 14.7 12 21 12 21Z" />
      <polyline points="9.1,9.6 11.1,11.6 15,7.3" />
    </svg>
  );
}

const transcript = [
  { who: "grace", text: "Phoenix HVAC, this is Grace. What's going on tonight?" },
  { who: "caller", text: "Hey, my furnace just died. House is dropping fast and we've got a baby." },
  { who: "grace", text: "Got it. I'm marking this urgent. Can I grab the address?" },
  { who: "caller", text: "4218 Camelback Road, Phoenix." },
  { who: "grace", text: "Thanks. Marco's on call tonight, he can be there by 8:45. Does that work?" },
] as const;

type ActionItem = {
  afterLine: number;
  icon: ElementType;
  title: string;
  meta: string;
  tone: "signal" | "accent";
  variant: "badge" | "bare";
  extraDelay?: number;
};

const actions: ActionItem[] = [
  { afterLine: 2, icon: CapturedIssueIcon, title: "Captured issue", meta: "Furnace failure · urgent", tone: "signal", variant: "badge" },
  { afterLine: 4, icon: VerifiedAddressIcon, title: "Verified address", meta: "4218 Camelback Rd", tone: "signal", variant: "badge" },
  { afterLine: 5, icon: Calendar, title: "Dispatching", meta: "Marco · ETA 8:45 PM", tone: "accent", variant: "bare" },
  { afterLine: 5, icon: MessageSquare, title: "Text confirmation", meta: "(602) 555-0117", tone: "accent", variant: "bare", extraDelay: 900 },
];

const LINE_INTERVAL = 1700;
const LOOP_HOLD = 4200;

export function LiveCallCard({ className }: { className?: string }) {
  const reduce = useReducedMotion();
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

  return (
    <div
      className={cn(
        "grid gap-3 rounded-2xl border border-line bg-surface/80 p-3 shadow-frame backdrop-blur-sm md:grid-cols-[220px_1fr_240px]",
        className
      )}
    >
      {/* Caller panel */}
      <div className="flex flex-col rounded-xl border border-line bg-surface-alt/60 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-signal">
            <span className="pulse-dot relative inline-block h-2 w-2 rounded-full bg-signal" />
            Live
          </span>
          <span className="font-mono text-[12px] tabular-nums text-ink-faint">
            {mm}:{ss}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-tint">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatars/grace.png"
              alt=""
              className="h-full w-full origin-[50%_32%] scale-[1.6] object-cover"
            />
          </span>
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

        {/* Waveform */}
        <div aria-hidden className="mt-4 flex h-8 items-center gap-[3px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="waveform-bar w-[3px] rounded-full bg-accent/70"
              style={{
                height: `${30 + ((i * 37) % 60)}%`,
                animationDelay: `${(i % 8) * 0.12}s`,
              }}
            />
          ))}
        </div>

        <p className="mt-4 hidden text-[12px] italic leading-relaxed text-ink-light md:block">
          “…it&apos;s the furnace, won&apos;t kick on at all. We&apos;ve got a baby in the
          house...”
        </p>
      </div>

      {/* Transcript */}
      <div className="flex min-h-[280px] flex-col rounded-xl border border-line bg-surface p-4">
        <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Live transcript
        </p>
        <div className="mt-3 flex flex-1 flex-col gap-2.5" aria-live="off">
          <AnimatePresence mode="popLayout">
            {transcript.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={`${i}-${line.text.slice(0, 12)}`}
                initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.45, ease: EASE }}
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
                <span className="text-ink-light">{line.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {!reduce && visibleLines < transcript.length && (
            <div className="grid grid-cols-[52px_1fr] gap-2">
              <span />
              <span aria-hidden className="shimmer-text text-[12px] font-medium">
                {visibleLines % 2 === 0 ? "Grace is speaking…" : "listening…"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions queued */}
      <div className="rounded-xl border border-line bg-surface-alt/60 p-4">
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
                    type: "spring",
                    stiffness: 320,
                    damping: 26,
                    delay: reduce ? 0 : ("extraDelay" in a ? (a.extraDelay as number) : 0) / 1000,
                  }}
                  className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-3 py-2.5 shadow-soft"
                >
                  {a.variant === "badge" ? (
                    <span
                      className={cn(
                        "flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border",
                        a.tone === "signal"
                          ? "border-signal/25 bg-signal/10 text-signal"
                          : "border-accent/25 bg-accent/10 text-accent"
                      )}
                    >
                      <a.icon aria-hidden className="h-4 w-4" />
                    </span>
                  ) : (
                    <a.icon
                      aria-hidden
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        a.tone === "signal" ? "text-signal" : "text-accent"
                      )}
                    />
                  )}
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
