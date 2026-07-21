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

type TabId = "inbound" | "outbound" | "analytics";

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
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-950/70 px-3.5 py-2.5"
        >
          <r.icon aria-hidden className="h-4 w-4 shrink-0 text-accent-soft" />
          <p className="flex-1 text-[13px] font-semibold text-white">{r.title}</p>
          <p className="font-mono text-[11px] tabular-nums text-zinc-500">{r.meta}</p>
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
          className="rounded-lg border border-white/10 bg-zinc-950/70 px-3.5 py-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-white">{r.name}</p>
            <p className="font-mono text-[11px] tabular-nums text-zinc-500">
              {r.pct}% connected
            </p>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full bg-accent-soft"
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

function AnalyticsPanel({ reduce }: { reduce: boolean }) {
  const bars = [42, 66, 50, 84, 58, 96, 72];
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-4">
      <div className="flex gap-2">
        {[
          { v: "142", l: "calls today" },
          { v: "38", l: "qualified" },
          { v: "97%", l: "answered" },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPhysics, delay: 0.1 + i * 0.06 }}
            className="flex-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-2"
          >
            <p className="font-display text-[17px] font-bold leading-none text-white">
              {s.v}
            </p>
            <p className="mt-1 text-[10.5px] text-zinc-500">{s.l}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex h-16 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ ...springPhysics, delay: 0.2 + i * 0.05 }}
            style={{ height: `${h}%`, transformOrigin: "bottom" }}
            className={cn(
              "w-full rounded-sm",
              i === 5 ? "bg-accent-soft" : "bg-white/15"
            )}
          />
        ))}
      </div>
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
    label: "Outbound Campaigns",
    headline: "Follow-ups and campaigns that actually get made.",
    body: "Reactivate cold leads, confirm appointments, and run outbound call campaigns with consistent scripts and pacing.",
    bullets: [
      "Lead reactivation & follow-up calls",
      "Appointment confirmations & reminders",
      "Campaign pacing with full outcome logging",
    ],
    link: { href: "/outbound-calling", label: "Explore outbound calling" },
  },
  {
    id: "analytics",
    label: "Live Analytics",
    headline: "Every call becomes structured, visible data.",
    body: "Volume, outcomes, and qualification metrics update the moment a call ends, synced to the tools your team already uses.",
    bullets: [
      "Call volume & outcome dashboards",
      "Qualification metrics in real time",
      "Summaries synced to your CRM",
    ],
    link: { href: "/integrations", label: "See integrations" },
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
            className="flex w-max items-center gap-1 rounded-full border border-white/10 bg-zinc-900/80 p-1 backdrop-blur-md"
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
                    selected ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="active-skipdial-tab"
                      transition={springPhysics}
                      style={{ borderRadius: 9999 }}
                      className="absolute inset-0 border border-white/10 bg-white/10 shadow-[0_0_20px_-4px_rgba(105,70,235,0.5)]"
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
            className="grid items-center gap-8 rounded-2xl border border-white/10 bg-zinc-900/80 p-6 backdrop-blur-md md:grid-cols-[1.15fr_1fr] md:p-9"
          >
            <div>
              <h3 className="max-w-md text-[21px] font-semibold leading-snug text-white md:text-[25px]">
                {tab.headline}
              </h3>
              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-zinc-400">
                {tab.body}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {tab.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[13.5px] text-zinc-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-soft">
                      <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={tab.link.href}
                className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-soft transition-colors hover:text-white"
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
              {tab.id === "analytics" && <AnalyticsPanel reduce={reduce} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
