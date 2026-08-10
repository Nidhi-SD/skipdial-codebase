"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export type DailyBucket = {
  date: string;
  label: string;
  connected: number;
  missed: number;
  total: number;
};

/* Daily call volume — one column per day, connected stacked over not-connected.
   Plain CSS columns rather than an SVG chart: the bars stay crisp at any width
   without a viewBox, and there is no charting dependency to add for one view. */

export function CallVolumeChart({ daily }: { daily: DailyBucket[] }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  const peak = Math.max(1, ...daily.map((d) => d.total));
  // Past ~40 columns the individual date labels collide, so only the ends and
  // the midpoint are drawn.
  const sparseLabels = daily.length > 40;
  const active = hovered !== null ? daily[hovered] : null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft md:p-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Call volume</h2>
          <p className="mt-0.5 text-[13px] text-ink-light">
            Peak day: {peak} {peak === 1 ? "call" : "calls"}
          </p>
        </div>
        <div className="flex items-center gap-4 text-[12.5px] text-ink-light">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-accent" aria-hidden />
            Connected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-ink/15" aria-hidden />
            Not connected
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Tooltip is pinned above the plot rather than following the cursor —
            no layout thrash, and it never clips at the container edges. */}
        <div className="pointer-events-none absolute -top-1 left-0 right-0 flex justify-center">
          {active ? (
            <span className="rounded-lg border border-line bg-surface px-2.5 py-1 text-[12px] font-medium text-ink shadow-card">
              {active.label} · {active.connected} connected
              {active.missed > 0 ? ` · ${active.missed} missed` : ""}
            </span>
          ) : null}
        </div>

        <div
          role="img"
          aria-label={`Daily call volume over ${daily.length} days. Peak ${peak} calls in a day.`}
          onMouseLeave={() => setHovered(null)}
          className="flex h-44 items-end gap-[3px] pt-7"
        >
          {daily.map((d, i) => {
            const totalPct = (d.total / peak) * 100;
            const connectedShare = d.total ? (d.connected / d.total) * 100 : 0;
            return (
              <div
                key={d.date}
                onMouseEnter={() => setHovered(i)}
                className="group relative flex h-full flex-1 cursor-default items-end"
              >
                {/* Full-height hit area so thin bars (and empty days) are still
                    hoverable. */}
                <span className="absolute inset-0 rounded-sm transition-colors group-hover:bg-accent-tint/50" />
                <motion.div
                  initial={reduce ? false : { height: 0 }}
                  animate={{ height: `${Math.max(totalPct, d.total ? 3 : 0)}%` }}
                  transition={{
                    duration: 0.5,
                    delay: reduce ? 0 : Math.min(i * 0.008, 0.4),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "relative w-full overflow-hidden rounded-[3px] bg-ink/15",
                    d.total === 0 && "bg-transparent"
                  )}
                >
                  <span
                    className="absolute inset-x-0 bottom-0 bg-accent"
                    style={{ height: `${connectedShare}%` }}
                    aria-hidden
                  />
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex justify-between text-[11.5px] text-ink-faint">
          {sparseLabels ? (
            <>
              <span>{daily[0]?.label}</span>
              <span>{daily[Math.floor(daily.length / 2)]?.label}</span>
              <span>{daily[daily.length - 1]?.label}</span>
            </>
          ) : (
            daily.map((d, i) => (
              <span
                key={d.date}
                className={cn(
                  "flex-1 text-center",
                  // Thin out labels on mid-density ranges so they never overlap.
                  daily.length > 14 && i % 3 !== 0 && "invisible"
                )}
              >
                {d.label.replace(/^\w+ /, "")}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
