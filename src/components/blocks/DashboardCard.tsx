"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhoneCall, ArrowUpRight } from "lucide-react";
import { CountUp } from "@/components/motion";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* Animated product-dashboard mockup (platform screens, mockup deck p7).
   Stats count up and volume bars grow when scrolled into view. */

const stats = [
  { label: "Calls today", value: 247, suffix: "", delta: "+18%" },
  { label: "Booked appts", value: 38, suffix: "", delta: "+24%" },
  { label: "Avg pickup", value: 1.4, suffix: "s", delta: "−0.3s", decimals: 1 },
  { label: "Connect rate", value: 31.2, suffix: "%", delta: "+2.1pp", decimals: 1 },
];

const bars = [
  { day: "Wed", inbound: 55, outbound: 38 },
  { day: "Thu", inbound: 62, outbound: 44 },
  { day: "Fri", inbound: 74, outbound: 52 },
  { day: "Sat", inbound: 58, outbound: 40 },
  { day: "Sun", inbound: 42, outbound: 30 },
  { day: "Mon", inbound: 78, outbound: 56 },
  { day: "Tue", inbound: 96, outbound: 66 },
];

const recentCalls = [
  { name: "Mariela Ortiz", note: "Furnace not heating · dispatched", tag: "Booked", tone: "signal" },
  { name: "Bill Treadwell", note: "BOV pitched · interested", tag: "Transferred", tone: "accent" },
  { name: "Linda Park", note: "Voicemail · scheduled retry", tag: "Voicemail", tone: "warn" },
];

export function DashboardCard({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-surface shadow-frame",
        className
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-surface-alt/70 px-4 py-3">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 font-mono text-[11px] text-ink-faint">
          skipdial.ai / dashboard
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-signal/10 px-2.5 py-1 text-[10.5px] font-bold text-signal">
          <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-signal" />
          All systems normal
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-line bg-surface p-3.5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {s.label}
              </p>
              <p className="mt-1 font-mono text-[22px] font-bold tabular-nums tracking-tight text-ink">
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="flex items-center gap-0.5 text-[11.5px] font-semibold text-signal">
                <ArrowUpRight aria-hidden className="h-3 w-3" />
                {s.delta}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
          {/* Volume chart */}
          <div className="rounded-xl border border-line p-4">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-bold text-ink">Call volume</p>
              <div className="flex items-center gap-3 text-[10.5px] font-medium text-ink-faint">
                <span className="flex items-center gap-1">
                  <span aria-hidden className="h-2 w-2 rounded-sm bg-accent" /> Inbound
                </span>
                <span className="flex items-center gap-1">
                  <span aria-hidden className="h-2 w-2 rounded-sm bg-accent-soft/50" /> Outbound
                </span>
              </div>
            </div>
            <div className="mt-4 flex h-32 items-end justify-between gap-2">
              {bars.map((b, i) => (
                <div key={b.day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-24 w-full items-end justify-center gap-1">
                    {[
                      { v: b.inbound, cls: "bg-accent" },
                      { v: b.outbound, cls: "bg-accent-soft/50" },
                    ].map((bar, j) => (
                      <motion.span
                        key={j}
                        initial={reduce ? { height: `${bar.v}%` } : { height: "8%" }}
                        whileInView={{ height: `${bar.v}%` }}
                        viewport={viewportOnce}
                        transition={{
                          duration: 0.8,
                          delay: 0.1 + i * 0.06 + j * 0.03,
                          ease: EASE,
                        }}
                        className={cn("w-2.5 rounded-t-sm sm:w-3", bar.cls)}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-ink-faint">{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent calls */}
          <div className="rounded-xl border border-line p-4">
            <p className="text-[12.5px] font-bold text-ink">Recent calls</p>
            <ul className="mt-3 space-y-2.5">
              {recentCalls.map((c) => (
                <li key={c.name} className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
                    <PhoneCall aria-hidden className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold text-ink">
                      {c.name}
                    </p>
                    <p className="truncate text-[11px] text-ink-faint">{c.note}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      c.tone === "signal" && "bg-signal/10 text-signal",
                      c.tone === "accent" && "bg-accent-tint text-accent",
                      c.tone === "warn" && "bg-warn/10 text-warn"
                    )}
                  >
                    {c.tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
