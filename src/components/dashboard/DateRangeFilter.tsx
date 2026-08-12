"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown } from "@/components/icons/SystemIcons";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* Client-side date filter — everything the dashboard shows is already
   fetched in full (see api/dashboard/route.ts: Retell has no retention
   ceiling, so "all logs" really is all of them), so this never triggers a
   refetch. It just narrows which of the already-loaded calls DashboardView
   re-aggregates. One popover holds both the quick presets and the custom
   range, rather than two separate floating controls. */

export type DatePreset = "today" | "week" | "month" | "all";
export type DateFilterValue =
  | { preset: DatePreset }
  | { preset: "custom"; from: string; to: string };

export const DEFAULT_DATE_FILTER: DateFilterValue = { preset: "all" };

const PRESETS: { id: "all" | "today" | "week" | "month"; label: string }[] = [
  { id: "all", label: "All time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

/* Anchored to the *viewer's own* local timezone, deliberately — not the
   Phoenix-anchored day used by the volume chart's bucketing. Every call
   timestamp CallList/MissedCallsPanel show is already in the viewer's own
   local time ("bucketed by the viewer's local hour... for whoever's
   reading it" — see PeakHoursChart), and a native <input type="date"> is
   itself interpreted in the browser's local time with no timezone of its
   own. Anchoring the filter to Phoenix instead would silently disagree with
   what's on screen: pick "Jul 14" and a call *displayed* as "Jul 15" could
   still pass the filter, because Phoenix's Jul 14 and the viewer's Jul 14
   are different 24h windows whenever the viewer isn't in Arizona. */

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function filterLabel(value: DateFilterValue): string {
  if (value.preset === "custom") {
    // No offset suffix — parsed as local time, same as the day it was typed.
    const fmt = (iso: string) =>
      new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(value.from)} – ${fmt(value.to)}`;
  }
  return PRESETS.find((p) => p.id === value.preset)?.label ?? "All time";
}

/** Resolves a filter value into a concrete instant range for filtering
 *  PortalCall.startedAt against — `start: null` means no lower bound (all
 *  time). Calendar boundaries (today/week/month) are the viewer's own local
 *  calendar, matching what's actually displayed on every call row. */
export function resolveDateRange(value: DateFilterValue): { start: number | null; end: number } {
  const now = Date.now();

  if (value.preset === "custom") {
    return {
      start: new Date(`${value.from}T00:00:00`).getTime(),
      end: new Date(`${value.to}T23:59:59.999`).getTime(),
    };
  }
  if (value.preset === "all") return { start: null, end: now };

  const today = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  if (value.preset === "today") return { start: startOfDay(today), end: now };
  if (value.preset === "week") {
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay()); // back to this week's Sunday
    return { start: startOfDay(sunday), end: now };
  }
  // month: the 1st of the viewer's current local month
  return { start: new Date(today.getFullYear(), today.getMonth(), 1).getTime(), end: now };
}

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateFilterValue;
  onChange: (v: DateFilterValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const [fromDraft, setFromDraft] = useState(value.preset === "custom" ? value.from : "");
  const [toDraft, setToDraft] = useState(value.preset === "custom" ? value.to : "");
  const rootRef = useRef<HTMLDivElement>(null);
  const maxDate = todayISO();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const applyCustom = () => {
    if (!fromDraft || !toDraft) return;
    const [from, to] = fromDraft <= toDraft ? [fromDraft, toDraft] : [toDraft, fromDraft];
    onChange({ preset: "custom", from, to });
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-[13px] font-medium text-ink-light transition-colors hover:border-line-strong hover:text-ink"
      >
        <Calendar aria-hidden className="h-3.5 w-3.5" />
        {filterLabel(value)}
        <ChevronDown
          aria-hidden
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 4, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute right-0 top-full z-20 mt-2 w-[280px] overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lift"
          >
            <ul className="space-y-0.5">
              {PRESETS.map((p) => {
                const active = value.preset === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange({ preset: p.id });
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors",
                        active ? "bg-accent-tint text-accent" : "text-ink hover:bg-surface-alt"
                      )}
                    >
                      {p.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-1.5 border-t border-line p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                Custom range
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fromDraft}
                  max={toDraft || maxDate}
                  onChange={(e) => setFromDraft(e.target.value)}
                  aria-label="From date"
                  className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface-alt px-2 text-[12.5px] text-ink transition-colors hover:border-line-strong focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <span aria-hidden className="text-ink-faint">
                  –
                </span>
                <input
                  type="date"
                  value={toDraft}
                  min={fromDraft || undefined}
                  max={maxDate}
                  onChange={(e) => setToDraft(e.target.value)}
                  aria-label="To date"
                  className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface-alt px-2 text-[12.5px] text-ink transition-colors hover:border-line-strong focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                type="button"
                onClick={applyCustom}
                disabled={!fromDraft || !toDraft}
                className="mt-2.5 w-full cursor-pointer rounded-lg bg-accent px-3 py-2 text-[12.5px] font-semibold text-ink-inverse transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
