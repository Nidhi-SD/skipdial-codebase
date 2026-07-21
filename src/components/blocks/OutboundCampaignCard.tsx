"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhoneOutgoing, CalendarCheck, Voicemail, PhoneForwarded } from "lucide-react";
import { CountUp } from "@/components/motion";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   OutboundCampaignCard — the campaign console behind outbound calling. The
   outbound copy promises pacing, consistency, and full outcome logging; this
   shows all three at once: live campaigns with connect rates, the day's
   totals, and the outcome each call was logged under.

   Bars fill and totals count up once on scroll-in. Illustrative sample data,
   so the block is aria-hidden.
   ──────────────────────────────────────────────────────────────────────────── */

const campaigns = [
  { name: "Spring reactivation", dialed: 412, pct: 62, tone: "accent" },
  { name: "No-show recovery", dialed: 168, pct: 41, tone: "soft" },
  { name: "Estimate follow-up", dialed: 245, pct: 78, tone: "accent" },
];

const outcomes = [
  { icon: CalendarCheck, label: "Appointment booked", count: 34, tone: "signal" },
  { icon: PhoneForwarded, label: "Transferred to team", count: 19, tone: "accent" },
  { icon: Voicemail, label: "Voicemail · retry queued", count: 27, tone: "warn" },
];

export function OutboundCampaignCard({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-surface shadow-frame",
        className
      )}
    >
      {/* Console header */}
      <div className="flex items-center gap-2 border-b border-line bg-surface-alt/70 px-4 py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-accent">
          <PhoneOutgoing aria-hidden className="h-3.5 w-3.5" />
        </span>
        <p className="text-[12.5px] font-bold text-ink">Campaign console</p>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-signal/10 px-2.5 py-1 text-[10.5px] font-bold text-signal">
          <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-signal" />
          3 running
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Day totals */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Dialed today", value: 825, suffix: "" },
            { label: "Connected", value: 261, suffix: "" },
            { label: "Booked", value: 34, suffix: "" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-line p-3.5">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">
                {s.label}
              </p>
              <p className="mt-1 font-mono text-[21px] font-bold tabular-nums tracking-tight text-ink">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
            </div>
          ))}
        </div>

        {/* Live campaigns with connect-rate fill */}
        <div className="mt-4 rounded-xl border border-line p-4">
          <p className="text-[12.5px] font-bold text-ink">Active campaigns</p>
          <div className="mt-3.5 space-y-3.5">
            {campaigns.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-[12.5px] font-semibold text-ink">
                    {c.name}
                  </p>
                  <p className="shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">
                    {c.dialed} dialed · {c.pct}% connected
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-accent-tint">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      c.tone === "accent" ? "bg-accent" : "bg-accent-soft"
                    )}
                    initial={reduce ? { width: `${c.pct}%` } : { width: "4%" }}
                    whileInView={{ width: `${c.pct}%` }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: EASE }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logged outcomes */}
        <div className="mt-3 rounded-xl border border-line p-4">
          <p className="text-[12.5px] font-bold text-ink">Logged outcomes</p>
          <ul className="mt-3 space-y-2.5">
            {outcomes.map((o) => (
              <li key={o.label} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    o.tone === "signal" && "bg-signal/10 text-signal",
                    o.tone === "accent" && "bg-accent-tint text-accent",
                    o.tone === "warn" && "bg-warn/10 text-warn"
                  )}
                >
                  <o.icon aria-hidden className="h-3 w-3" />
                </span>
                <p className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">
                  {o.label}
                </p>
                <span className="shrink-0 font-mono text-[12.5px] font-bold tabular-nums text-ink">
                  <CountUp to={o.count} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
