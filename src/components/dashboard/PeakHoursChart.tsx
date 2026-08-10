"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { PortalCall } from "@/lib/portal";

/* When calls actually land during the day — bucketed by the *viewer's* local
   hour (Date#getHours), not a server timezone, since this chart's whole point
   is "when should I expect the phone to ring" for whoever's reading it. */

function formatHour(h: number): string {
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12} ${period}`;
}

function formatHourShort(h: number): string {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

export function PeakHoursChart({ calls }: { calls: PortalCall[] }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  const buckets = useMemo(() => {
    const counts = new Array(24).fill(0) as number[];
    for (const call of calls) {
      if (!call.startedAt) continue;
      counts[new Date(call.startedAt).getHours()]++;
    }
    return counts;
  }, [calls]);

  const hasData = buckets.some((c) => c > 0);
  const peak = Math.max(1, ...buckets);
  const peakHour = buckets.indexOf(Math.max(...buckets));
  const active = hovered !== null ? buckets[hovered] : null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft md:p-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Peak call times</h2>
          <p className="mt-0.5 text-[13px] text-ink-light">
            {hasData ? `Busiest around ${formatHour(peakHour)}` : "By hour of day"}
          </p>
        </div>
      </div>

      {!hasData ? (
        <p className="py-8 text-center text-[13.5px] text-ink-light">
          Not enough calls yet to show a pattern.
        </p>
      ) : (
        <div className="relative">
          <div className="pointer-events-none absolute -top-1 left-0 right-0 flex justify-center">
            {active !== null && hovered !== null ? (
              <span className="rounded-lg border border-line bg-surface px-2.5 py-1 text-[12px] font-medium text-ink shadow-card">
                {formatHour(hovered)} · {active} {active === 1 ? "call" : "calls"}
              </span>
            ) : null}
          </div>

          <div
            role="img"
            aria-label={`Calls by hour of day. Busiest around ${formatHour(peakHour)}.`}
            onMouseLeave={() => setHovered(null)}
            className="flex h-32 items-end gap-[3px] pt-7"
          >
            {buckets.map((count, hour) => (
              <div
                key={hour}
                onMouseEnter={() => setHovered(hour)}
                className="group relative flex h-full flex-1 cursor-default items-end"
              >
                <span className="absolute inset-0 rounded-sm transition-colors group-hover:bg-accent-tint/50" />
                <motion.div
                  initial={reduce ? false : { height: 0 }}
                  animate={{ height: `${Math.max((count / peak) * 100, count ? 5 : 0)}%` }}
                  transition={{
                    duration: 0.4,
                    delay: reduce ? 0 : hour * 0.012,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "w-full rounded-[2px]",
                    hour === peakHour ? "bg-accent" : "bg-ink/15"
                  )}
                />
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-[3px]">
            {buckets.map((_, hour) => (
              <span
                key={hour}
                className={cn(
                  "flex-1 text-center text-[11px] text-ink-faint",
                  hour % 3 !== 0 && "invisible"
                )}
              >
                {formatHourShort(hour)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
