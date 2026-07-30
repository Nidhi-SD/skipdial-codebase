"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared shell for the "problem" sections on the inbound and outbound pages:
   a looping mini-scene above a short headline. Kept in one place so both
   pages animate on the same cadence and sit at the same card height.
   ──────────────────────────────────────────────────────────────────────────── */

/** Looping step counter: 0 → steps, holds at the end, then restarts.
    Pass running=false (off screen or reduced motion) to freeze it. */
export function useProblemLoop(
  steps: number,
  ms: number,
  holdMs: number,
  running: boolean
) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!running) return;
    const atEnd = step >= steps;
    const t = setTimeout(
      () => setStep((s) => (s >= steps ? 0 : s + 1)),
      atEnd ? holdMs : ms
    );
    return () => clearTimeout(t);
  }, [running, step, steps, ms, holdMs]);

  return step;
}

export function ProblemCard({
  graphic,
  title,
  sub,
  className,
}: {
  graphic: ReactNode;
  title: string;
  sub: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-line bg-surface p-6 shadow-card md:p-7",
        className
      )}
    >
      <div className="flex h-[130px] items-center justify-center">{graphic}</div>
      <p className="mt-5 text-[17px] font-bold leading-snug text-ink">{title}</p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-light">{sub}</p>
    </div>
  );
}
