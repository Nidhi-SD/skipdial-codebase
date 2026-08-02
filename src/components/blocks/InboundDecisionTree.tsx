"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IconComponent } from "@/components/icons/SystemIcons";
import {
  PhoneIncoming,
  Zap,
  CalendarCheck,
  HelpCircle,
} from "@/components/icons/SystemIcons";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   InboundDecisionTree — one inbound call branching to a routed protocol.

   Top-down flow: call node → connector → intent row → protocol payload.
   Two things are deliberate:

   1. The connector SVG scales with the container (preserveAspectRatio="none")
      and its endpoints sit at 1/6, 1/2 and 5/6 of the viewBox — exactly the
      centers of a 3-column grid. A fixed-width SVG under a wider node row
      leaves the curves pointing at nothing.
   2. Branch colors are CSS-var values rather than class-name fragments, so a
      renamed token can't silently leave a branch with no active fill.
   ──────────────────────────────────────────────────────────────────────────── */

const AUTO_ADVANCE_MS = 4200;
const CONNECTOR_H = 76;

type Branch = {
  id: string;
  label: string;
  caption: string;
  icon: IconComponent;
  color: string;
  actions: string[];
};

const branches: Branch[] = [
  {
    id: "emergency",
    label: "Emergency",
    caption: "Urgent · after hours",
    icon: Zap,
    color: "var(--accent-deep)",
    actions: ["Alert on-call tech", "Send SMS to team", "Log high-priority ticket"],
  },
  {
    id: "quote",
    label: "New Quote",
    caption: "Inbound lead",
    icon: CalendarCheck,
    color: "var(--accent)",
    actions: [
      "Qualify budget & timeline",
      "Check availability",
      "Book estimate on calendar",
    ],
  },
  {
    id: "support",
    label: "Support",
    caption: "Existing customer",
    icon: HelpCircle,
    color: "var(--accent-soft)",
    actions: ["Lookup account", "Provide status update", "Route to billing if needed"],
  },
];

export function InboundDecisionTree({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState(branches[1].id);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Background tabs freeze rAF but keep firing timers. Advancing there leaves
     AnimatePresence mid-exit with no frame to finish on, so the panel renders
     empty until the tab is looked at again — hold the cycle while hidden. */
  const [docHidden, setDocHidden] = useState(false);
  useEffect(() => {
    const sync = () => setDocHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (paused || docHidden) return;
    const timer = setInterval(() => {
      setActiveId((curr) => {
        const i = branches.findIndex((b) => b.id === curr);
        return branches[(i + 1) % branches.length].id;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, docHidden]);

  /* The connector is drawn 1:1 — viewBox in real pixels, endpoints measured
     from the actual node centers. Stretching a fixed viewBox to fit instead
     (preserveAspectRatio="none") distorts the geometry two ways: dash lengths
     under non-scaling-stroke resolve in screen units while framer-motion's
     pathLength math is in viewBox units, so the drawn line stops short of its
     endpoint; and grid gaps push node centers off the assumed thirds. */
  const connectorRef = useRef<HTMLDivElement>(null);
  const [geom, setGeom] = useState<{ w: number; xs: number[] } | null>(null);

  useEffect(() => {
    const measure = () => {
      const wrap = connectorRef.current;
      if (!wrap) return;
      const wr = wrap.getBoundingClientRect();
      if (!wr.width) return;
      const xs = branches.map((_, i) => {
        const el = tabRefs.current[i];
        if (!el) return wr.width / 2;
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 - wr.left;
      });
      setGeom({ w: wr.width, xs });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (connectorRef.current) ro.observe(connectorRef.current);
    // Fonts landing after mount can reflow the node row under the curves.
    document.fonts?.ready.then(measure).catch(() => {});
    /* ResizeObserver does not deliver while the tab is backgrounded, so a
       window resized in the background would leave the curves drawn to the
       old width. Re-measure whenever the page is looked at again. */
    document.addEventListener("visibilitychange", measure);
    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", measure);
    };
  }, []);

  const paths = geom
    ? geom.xs.map((x) => {
        const cx = geom.w / 2;
        const h = CONNECTOR_H;
        return x === cx
          ? `M ${cx} 0 L ${cx} ${h}`
          : `M ${cx} 0 C ${cx} ${h * 0.55}, ${x} ${h * 0.45}, ${x} ${h}`;
      })
    : [];

  const activeIndex = Math.max(
    0,
    branches.findIndex((b) => b.id === activeId)
  );
  const active = branches[activeIndex];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (activeIndex + delta + branches.length) % branches.length;
    setActiveId(branches[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-wash/70 to-surface p-6 shadow-frame sm:p-8",
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Hairline grid for depth — purely decorative, sits under everything. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid-size opacity-[0.5]"
      />

      <div className="relative">
        {/* ── Call node ────────────────────────────────────────────────── */}
        <div className="mx-auto flex w-full max-w-[20rem] items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-card">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-ink-inverse">
            <PhoneIncoming aria-hidden className="h-[19px] w-[19px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-bold leading-tight text-ink">
              Inbound Call Received
            </span>
            <span className="block text-[12px] leading-tight text-ink-light">
              AI answers instantly
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-accent-tint px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-accent-deep">
            <span className="pulse-dot relative h-1.5 w-1.5 rounded-full bg-accent" />
            Live
          </span>
        </div>

        {/* ── Connector ────────────────────────────────────────────────── */}
        <div
          ref={connectorRef}
          className="relative w-full"
          style={{ height: CONNECTOR_H }}
          aria-hidden
        >
          {geom ? (
            <svg
              viewBox={`0 0 ${geom.w} ${CONNECTOR_H}`}
              width={geom.w}
              height={CONNECTOR_H}
              className="absolute inset-0"
              fill="none"
            >
              {paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                  className="text-line-strong"
                />
              ))}
              {/* Active route redraws on every change. */}
              <motion.path
                key={activeId}
                d={paths[activeIndex]}
                stroke={active.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          ) : null}
        </div>

        {/* ── Intent row ───────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Call intent"
          onKeyDown={onKeyDown}
          className="grid grid-cols-3 gap-2.5 sm:gap-3"
        >
          {branches.map((branch, i) => {
            const on = branch.id === activeId;
            return (
              <button
                key={branch.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="protocol-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActiveId(branch.id)}
                style={on ? { borderColor: branch.color } : undefined}
                className={cn(
                  "group flex min-w-0 flex-col items-center gap-2 rounded-2xl border bg-surface px-2 py-3.5 text-center transition-all duration-300 ease-out-expo sm:px-3",
                  on
                    ? "-translate-y-0.5 shadow-card"
                    : "border-line opacity-70 hover:-translate-y-0.5 hover:opacity-100 hover:shadow-soft"
                )}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
                  style={{
                    backgroundColor: on ? branch.color : "rgb(var(--line-rgb))",
                    color: on ? "#fff" : "rgb(var(--ink-faint-rgb))",
                  }}
                >
                  <branch.icon aria-hidden className="h-[17px] w-[17px]" />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-[12.5px] font-bold leading-tight sm:text-[13.5px]",
                      on ? "text-ink" : "text-ink-light"
                    )}
                  >
                    {branch.label}
                  </span>
                  <span className="mt-0.5 hidden truncate text-[11px] leading-tight text-ink-faint sm:block">
                    {branch.caption}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Protocol payload ─────────────────────────────────────────── */}
        <div
          id="protocol-panel"
          role="tabpanel"
          aria-live="polite"
          className="mt-3.5 sm:mt-4"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft"
            >
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: active.color }}
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-ink-light">
                  {active.label} Protocol
                </span>
                <span className="ml-auto text-[11px] font-semibold text-ink-faint">
                  {active.actions.length} actions
                </span>
              </div>
              <ol className="divide-y divide-line">
                {active.actions.map((action, i) => (
                  <li
                    key={action}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-ink"
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold tabular-nums"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${active.color} 14%, transparent)`,
                        color: active.color,
                      }}
                    >
                      {i + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
