"use client";

import type { ReactNode } from "react";
import { PhoneIncoming, PhoneOutgoing, MessageSquareText } from "@/components/icons/SystemIcons";
import type { IconComponent } from "@/components/icons/SystemIcons";
import { cn } from "@/lib/cn";

type Segment = {
  key: string;
  label: string;
  value: number;
  /** bg-* class for the bar segment. */
  fillClass: string;
  /** text-* class matching fillClass's hue, applied to the legend icon so
   *  color identity survives even where an icon replaces the swatch dot. */
  tintClass?: string;
  icon?: IconComponent;
};

/** A single horizontal stacked bar — part-to-whole reads more precisely from
 *  segment width than from pie-slice angle, and it's still the one form that
 *  lets a client compare "is Missed meaningfully bigger than Voicemail" at a
 *  glance, which a donut makes surprisingly hard. */
function ProportionBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const visible = segments.filter((s) => s.value > 0);

  return (
    <div>
      <div
        role="img"
        aria-label={segments
          .map((s) => `${s.label} ${total ? Math.round((s.value / total) * 100) : 0}%`)
          .join(", ")}
        className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-surface-alt"
      >
        {visible.map((s) => (
          <div
            key={s.key}
            style={{ flex: `${s.value} 0 0%` }}
            className={cn("h-full", s.fillClass)}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2.5">
        {segments.map((s) => {
          const pct = total ? Math.round((s.value / total) * 100) : 0;
          return (
            <li key={s.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[13px] text-ink-light">
                {s.icon ? (
                  <s.icon aria-hidden className={cn("h-3.5 w-3.5", s.tintClass ?? "text-ink-faint")} />
                ) : (
                  <span
                    aria-hidden
                    className={cn("h-2.5 w-2.5 shrink-0 rounded-full", s.fillClass)}
                  />
                )}
                {s.label}
              </span>
              <span className="font-mono text-[13px] tabular-nums text-ink">
                {s.value}
                <span className="ml-1 text-ink-faint">· {pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CompositionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft transition-shadow duration-300 hover:shadow-card md:p-6">
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      <p className="mt-0.5 text-[13px] text-ink-light">{hint}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function CallComposition({
  outcomes,
  direction,
}: {
  outcomes: { connected: number; voicemail: number; missed: number };
  direction: { inbound: number; outbound: number; web: number };
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CompositionCard title="Call outcomes" hint="How your calls resolved">
        <ProportionBar
          segments={[
            { key: "connected", label: "Connected", value: outcomes.connected, fillClass: "bg-accent" },
            { key: "voicemail", label: "Voicemail", value: outcomes.voicemail, fillClass: "bg-warn" },
            {
              key: "missed",
              label: "Not connected",
              value: outcomes.missed,
              fillClass: "bg-ink-faint",
            },
          ]}
        />
      </CompositionCard>

      <CompositionCard title="Call channels" hint="Where your calls came from">
        <ProportionBar
          segments={[
            {
              key: "inbound",
              label: "Inbound",
              value: direction.inbound,
              fillClass: "bg-accent",
              tintClass: "text-accent",
              icon: PhoneIncoming,
            },
            {
              key: "outbound",
              label: "Outbound",
              value: direction.outbound,
              fillClass: "bg-accent-deep",
              tintClass: "text-accent-deep",
              icon: PhoneOutgoing,
            },
            {
              key: "web",
              label: "Web calls",
              value: direction.web,
              fillClass: "bg-accent-soft",
              tintClass: "text-accent-soft",
              icon: MessageSquareText,
            },
          ]}
        />
      </CompositionCard>
    </div>
  );
}
