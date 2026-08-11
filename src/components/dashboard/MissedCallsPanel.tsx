"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Phone, PhoneMissed } from "@/components/icons/SystemIcons";
import { CallDrawer } from "@/components/dashboard/CallList";
import type { PortalCall } from "@/lib/portal";

const MAX_SHOWN = 5;

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* Calls that never connected are the ones worth a callback — this surfaces the
   most recent of them up front rather than making the client filter for them
   inside the full call list below. Read-only: there's no "resolved" state to
   persist, just a tel: link onto the client's own phone. */
export function MissedCallsPanel({ calls }: { calls: PortalCall[] }) {
  const [selected, setSelected] = useState<PortalCall | null>(null);
  // `calls` arrives newest-first from the API; filtering preserves that order.
  const missed = calls.filter((c) => c.outcome === "missed").slice(0, MAX_SHOWN);

  if (missed.length === 0) {
    return (
      <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-5 shadow-soft md:p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/15 bg-accent-tint text-accent">
          <PhoneMissed aria-hidden className="h-[18px] w-[18px]" />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Needs follow-up</h2>
          <p className="text-[13px] text-ink-light">No missed calls in this period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-warn/25 bg-warn/[0.04] shadow-soft">
      <div className="flex items-center gap-3.5 border-b border-warn/15 px-5 py-4 md:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-warn/20 bg-warn/15 text-warn">
          <PhoneMissed aria-hidden className="h-[18px] w-[18px]" />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Needs follow-up</h2>
          <p className="text-[13px] text-ink-light">
            {missed.length} call{missed.length === 1 ? "" : "s"} didn&apos;t connect recently
          </p>
        </div>
      </div>

      <ul className="divide-y divide-warn/10">
        {missed.map((call) => (
          <li key={call.id} className="flex items-center gap-3 px-5 py-1 md:px-6">
            <button
              type="button"
              onClick={() => setSelected(call)}
              className="min-w-0 flex-1 cursor-pointer rounded-lg py-2.5 text-left transition-colors hover:bg-warn/[0.06]"
            >
              <span className="block truncate text-[14px] font-medium text-ink">
                {call.customerName || call.customerNumber || "Unknown caller"}
              </span>
              <span className="block truncate text-[12.5px] text-ink-light">
                {formatWhen(call.startedAt)}
              </span>
            </button>
            {call.customerNumber ? (
              <a
                href={`tel:${call.customerNumber}`}
                className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-accent px-3 text-[12.5px] font-semibold text-ink-inverse transition-colors hover:bg-accent-deep"
              >
                <Phone aria-hidden className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Call back</span>
              </a>
            ) : null}
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {selected ? <CallDrawer call={selected} onClose={() => setSelected(null)} /> : null}
      </AnimatePresence>
    </div>
  );
}
