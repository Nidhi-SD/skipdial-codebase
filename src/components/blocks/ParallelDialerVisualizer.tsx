"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { PhoneOutgoing, Check, X, Voicemail, type LucideIcon } from "lucide-react";

/* Outbound dialer walkthrough — the AI works a follow-up list one lead at a
   time. Previous version animated calls to unlabeled targets at random,
   which read as noise rather than a story. This version names each lead and
   narrates its outcome in place, so the sequence is legible at a glance. */

const leads = [
  { name: "Sarah Whitman", note: "Policy renewal follow-up" },
  { name: "David Chen", note: "Quote requested last week" },
  { name: "Maria Lopez", note: "Missed appointment reminder" },
  { name: "Tom Reyes", note: "Re-engagement · cold lead" },
  { name: "Priya Shah", note: "Referral follow-up" },
];

const outcomes: {
  id: string;
  label: string;
  icon: LucideIcon;
  tone: "solid" | "tint" | "neutral";
}[] = [
  { id: "connected", label: "Connected & Booked", icon: Check, tone: "solid" },
  { id: "voicemail", label: "Left Voicemail", icon: Voicemail, tone: "tint" },
  { id: "retry", label: "No Answer · Retry", icon: X, tone: "neutral" },
];

const outcomeForIndex = (i: number) => outcomes[i % outcomes.length];

const STEP_MS = 1700;
const HOLD_MS = 2600;

export function ParallelDialerVisualizer({ className }: { className?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      if (cancelled) return;
      setActiveIdx(0);
      setResolvedCount(0);
      leads.forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setResolvedCount(i + 1);
            setActiveIdx(i + 1 < leads.length ? i + 1 : -1);
          }, (i + 1) * STEP_MS)
        );
      });
      timers.push(setTimeout(run, leads.length * STEP_MS + HOLD_MS));
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8",
        className
      )}
    >
      {/* Dialer header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface-alt shadow-sm">
          <PhoneOutgoing aria-hidden className="h-5 w-5 text-ink" />
        </div>
        <div>
          <p className="text-[13px] font-bold uppercase tracking-wider text-ink">AI Dialer</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span aria-hidden className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-[12px] font-medium text-ink-faint">Working a follow-up list</span>
          </div>
        </div>
      </div>

      {/* Lead rows */}
      <ul className="mt-6 flex flex-col gap-2">
        {leads.map((lead, i) => {
          const isActive = i === activeIdx;
          const outcome = i < resolvedCount ? outcomeForIndex(i) : null;

          return (
            <li
              key={lead.name}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors duration-300",
                isActive ? "border-accent/30 bg-accent-tint/50" : "border-line bg-surface"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  !outcome && isActive && "bg-accent/15 text-accent",
                  !outcome && !isActive && "bg-surface-alt text-ink-faint",
                  outcome?.tone === "solid" && "bg-accent text-ink-inverse",
                  outcome?.tone === "tint" && "bg-accent-tint text-accent",
                  outcome?.tone === "neutral" && "bg-surface-alt text-ink-faint"
                )}
              >
                {outcome ? (
                  <outcome.icon aria-hidden className="h-3.5 w-3.5" />
                ) : (
                  lead.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{lead.name}</p>
                <p className="truncate text-[11.5px] text-ink-faint">{lead.note}</p>
              </div>

              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold",
                  !outcome && isActive && "bg-accent-tint text-accent",
                  !outcome && !isActive && "text-ink-faint",
                  outcome?.tone === "solid" && "bg-accent-deep/10 text-accent-deep",
                  outcome?.tone === "tint" && "bg-accent-tint text-accent",
                  outcome?.tone === "neutral" && "border border-line text-ink-faint"
                )}
              >
                {outcome ? outcome.label : isActive ? "Calling…" : "Queued"}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-5 border-t border-line pt-5">
        {outcomes.map((outcome) => (
          <div key={outcome.id} className="flex items-center gap-1.5">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md",
                outcome.tone === "solid" && "bg-accent text-ink-inverse",
                outcome.tone === "tint" && "bg-accent-tint text-accent",
                outcome.tone === "neutral" && "bg-surface-alt text-ink-faint"
              )}
            >
              <outcome.icon aria-hidden className="h-3 w-3" />
            </span>
            <span className="text-[12px] font-medium text-ink-light">{outcome.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
