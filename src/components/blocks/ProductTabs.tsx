"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  PhoneIncoming,
  ClipboardList,
  Calendar,
  Check,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { springPhysics } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   ProductTabs — call-motion switcher. The active highlight pill shares
   layoutId="active-skipdial-tab" so it physically morphs and slides between
   buttons on a spring instead of fading. Panels swap with spring rises.
   ──────────────────────────────────────────────────────────────────────────── */

type TabId = "inbound" | "outbound";

/* ── Per-tab mini visuals ──────────────────────────────────────────────────── */

function EventRows({
  rows,
  reduce,
}: {
  rows: { icon: typeof PhoneIncoming; title: string; meta: string }[];
  reduce: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.title}
          initial={reduce ? false : { opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...springPhysics, delay: 0.1 + i * 0.08 }}
          className="flex items-center gap-3 rounded-lg border border-line bg-surface-alt px-3.5 py-2.5"
        >
          <r.icon aria-hidden className="h-4 w-4 shrink-0 text-accent" />
          <p className="flex-1 text-[13px] font-semibold text-ink">{r.title}</p>
          <p className="font-mono text-[11px] tabular-nums text-ink-faint">{r.meta}</p>
        </motion.div>
      ))}
    </div>
  );
}

function CampaignRows({ reduce }: { reduce: boolean }) {
  const rows = [
    { name: "Spring reactivation", pct: 62 },
    { name: "No-show recovery", pct: 41 },
    { name: "Estimate follow-up", pct: 78 },
  ];
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          initial={reduce ? false : { opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...springPhysics, delay: 0.1 + i * 0.08 }}
          className="rounded-lg border border-line bg-surface-alt px-3.5 py-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-ink">{r.name}</p>
            <p className="font-mono text-[11px] tabular-nums text-ink-faint">
              {r.pct}% connected
            </p>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-accent-tint">
            <motion.div
              className="h-full origin-left rounded-full bg-accent"
              style={{ width: `${r.pct}%` }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ ...springPhysics, delay: 0.2 + i * 0.08 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Tab content ───────────────────────────────────────────────────────────── */

const TABS: {
  id: TabId;
  label: string;
  headline: string;
  body: string;
  bullets: string[];
  link: { href: string; label: string };
}[] = [
  {
    id: "inbound",
    label: "Inbound Agents",
    headline: "Every inbound call answered, qualified, and routed.",
    body: "AI agents pick up 24/7, follow your intake scripts, and transfer live conversations based on your business rules.",
    bullets: [
      "24/7 answering with structured intake",
      "Live transfer & routing rules",
      "Appointment booking on connected calendars",
    ],
    link: { href: "/inbound-calling", label: "Explore inbound calling" },
  },
  {
    id: "outbound",
    label: "Outbound Agents",
    headline: "Follow-ups and campaigns that actually get made.",
    body: "Reactivate cold leads, confirm appointments, and run outbound call campaigns with consistent scripts and pacing.",
    bullets: [
      "Lead reactivation & follow-up calls",
      "Appointment confirmations & reminders",
      "Campaign pacing with full outcome logging",
    ],
    link: { href: "/outbound-calling", label: "Explore outbound calling" },
  },
];

export function ProductTabs({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState<TabId>("inbound");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS.find((t) => t.id === active)!;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = TABS.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next === -1) return;
    e.preventDefault();
    setActive(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={springPhysics}
      className={className}
    >
      {/* Tab bar */}
      <div className="flex justify-center">
        <div className="max-w-full overflow-x-auto p-px">
          <div
            role="tablist"
            aria-label="Explore SkipDial by call motion"
            onKeyDown={onKeyDown}
            className="flex w-max items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-[0_1px_2px_rgba(19,19,22,0.04)] backdrop-blur-md"
          >
            {TABS.map((t, i) => {
              const selected = t.id === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`skipdial-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`skipdial-panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors duration-200 md:px-5",
                    selected ? "text-accent" : "text-ink-light hover:text-ink"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="active-skipdial-tab"
                      transition={springPhysics}
                      style={{ borderRadius: 9999 }}
                      className="absolute inset-0 border border-accent/25 bg-accent-tint shadow-[0_0_20px_-4px_rgba(105,70,235,0.28)]"
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className="mt-8 md:mt-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab.id}
            role="tabpanel"
            id={`skipdial-panel-${tab.id}`}
            aria-labelledby={`skipdial-tab-${tab.id}`}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: springPhysics }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid items-center gap-8 rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(19,19,22,0.04)] backdrop-blur-md md:grid-cols-[1.15fr_1fr] md:p-9"
          >
            <div>
              <h3 className="max-w-md text-[21px] font-semibold leading-snug text-ink md:text-[25px]">
                {tab.headline}
              </h3>
              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-light">
                {tab.body}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {tab.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[13.5px] text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
                      <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={tab.link.href}
                className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent transition-colors hover:text-accent-deep"
              >
                {tab.link.label}
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div>
              {tab.id === "inbound" && (
                <EventRows
                  reduce={reduce}
                  rows={[
                    { icon: PhoneIncoming, title: "Answered", meta: "1st ring" },
                    { icon: ClipboardList, title: "Intake complete", meta: "6/6 fields" },
                    { icon: Calendar, title: "Booked", meta: "Tue · 9:30 AM" },
                  ]}
                />
              )}
              {tab.id === "outbound" && <CampaignRows reduce={reduce} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
