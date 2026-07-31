"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Phone,
  CalendarCheck2,
  Gauge,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "@/components/icons/SystemIcons";
import { CountUp } from "@/components/motion";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* Animated product-dashboard mockup (platform screens, mockup deck p7).
   Stats count up and volume bars grow when scrolled into view. */

const stats: {
  label: string;
  value: number;
  suffix: string;
  delta: string;
  decimals?: number;
  icon: LucideIcon;
  ringPct: number;
}[] = [
  { label: "Calls", value: 247, suffix: "", delta: "+18%", icon: Phone, ringPct: 82 },
  { label: "Booked", value: 38, suffix: "", delta: "+24%", icon: CalendarCheck2, ringPct: 76 },
  { label: "Pickup", value: 1.4, suffix: "s", delta: "−0.3s", decimals: 1, icon: Gauge, ringPct: 68 },
  { label: "Connect", value: 31.2, suffix: "%", delta: "+2.1pp", decimals: 1, icon: Star, ringPct: 31 },
];

const bars = [
  { day: "Wed", inbound: 55, outbound: 38 },
  { day: "Thu", inbound: 62, outbound: 44 },
  { day: "Fri", inbound: 74, outbound: 52, highlight: true },
  { day: "Sat", inbound: 58, outbound: 40 },
  { day: "Sun", inbound: 42, outbound: 30 },
  { day: "Mon", inbound: 78, outbound: 56 },
  { day: "Tue", inbound: 96, outbound: 66 },
];

const recentCalls = [
  { name: "Mariela Ortiz", initials: "MO", note: "Furnace not heating · dispatched", tag: "Booked", tone: "solid" },
  { name: "Bill Treadwell", initials: "BT", note: "BOV pitched · interested", tag: "Transferred", tone: "tint" },
  { name: "Linda Park", initials: "LP", note: "Voicemail · scheduled retry", tag: "Voicemail", tone: "neutral" },
];

/* Radial progress ring around each stat's icon — echoes the goal-tracking
   gauges from the mockup deck rather than a flat icon chip. `pct` is a
   normalized 0-100 read on that metric (literal for Connect rate, a
   goal-relative fill for the rest). */
function StatRing({
  icon: Icon,
  pct,
  reduce,
}: {
  icon: LucideIcon;
  pct: number;
  reduce: boolean | null;
}) {
  const size = 34;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);

  return (
    <span className="relative flex h-[34px] w-[34px] shrink-0 items-center justify-center">
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          className="stroke-accent-tint"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          className="stroke-accent"
          strokeDasharray={c}
          initial={reduce ? { strokeDashoffset: offset } : { strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </svg>
      <Icon aria-hidden className="h-3.5 w-3.5 text-accent" />
    </span>
  );
}

/* Small decorative squiggle — separates each stat's headline number from its
   delta without the visual weight of a hard rule. */
function WaveDivider() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className="my-1.5 h-2 w-full text-line-strong/70"
    >
      <path
        d="M0 4 Q 4 0 8 4 T 16 4 T 24 4 T 32 4 T 40 4 T 48 4 T 56 4 T 64 4 T 72 4 T 80 4 T 88 4 T 96 4 T 104 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 text-[10.5px] font-bold text-accent-deep">
          <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          All systems normal
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => {
            const down = /^[−-]/.test(s.delta);
            const ArrowIcon = down ? ArrowDownRight : ArrowUpRight;
            return (
              <div
                key={s.label}
                className="rounded-xl border border-line bg-surface p-3.5"
              >
                <div className="flex items-center gap-2">
                  <StatRing icon={s.icon} pct={s.ringPct} reduce={reduce} />
                  <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    {s.label}
                  </p>
                </div>
                <p className="mt-2 font-mono text-[22px] font-bold tabular-nums tracking-tight text-ink">
                  <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </p>
                <WaveDivider />
                <p className="flex items-center gap-0.5 text-[11.5px] font-semibold text-accent-deep">
                  <ArrowIcon aria-hidden className="h-3 w-3" />
                  {s.delta}
                </p>
              </div>
            );
          })}
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
                <div
                  key={b.day}
                  className="relative flex flex-1 flex-col items-center gap-1.5"
                >
                  {b.highlight && (
                    <div className="pointer-events-none absolute -top-1 left-1/2 z-10 w-max -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[10px] font-semibold leading-tight shadow-card">
                      <p className="text-ink-faint">
                        <span className="text-ink">{b.day}</span> · Inbound{" "}
                        <span className="text-accent">{b.inbound}</span> · Outbound{" "}
                        <span className="text-accent-soft">{b.outbound}</span>
                      </p>
                    </div>
                  )}
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
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold",
                      c.tone === "solid" && "bg-accent text-ink-inverse",
                      c.tone === "tint" && "bg-accent-tint text-accent",
                      c.tone === "neutral" && "bg-surface-alt text-ink-faint"
                    )}
                  >
                    {c.initials}
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
                      c.tone === "solid" && "bg-accent-deep/10 text-accent-deep",
                      c.tone === "tint" && "bg-accent-tint text-accent",
                      c.tone === "neutral" && "border border-line text-ink-faint"
                    )}
                  >
                    {c.tag}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3.5 flex items-center gap-0.5 text-[11.5px] font-semibold text-accent">
              View all calls
              <ChevronRight aria-hidden className="h-3 w-3" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
