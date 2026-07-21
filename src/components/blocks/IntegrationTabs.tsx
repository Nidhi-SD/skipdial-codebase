"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Database,
  CalendarCheck,
  Server,
  BellRing,
  LineChart,
  Check,
  type LucideIcon,
} from "lucide-react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Category = {
  id: string;
  icon: LucideIcon;
  label: string;
  intro: string;
  outcomesLabel: string;
  outcomes: string[];
  note?: string;
};

const categories: Category[] = [
  {
    id: "crm",
    icon: Database,
    label: "CRM & Lead Management",
    intro:
      "Integrations allow the agent to create and update records, tag outcomes, and keep follow-up organized.",
    outcomesLabel: "Common outcomes",
    outcomes: [
      "New leads created automatically",
      "Call notes and summaries attached to records",
      "Lead stage changes based on qualification results",
      "Follow-up tasks created when needed",
    ],
  },
  {
    id: "scheduling",
    icon: CalendarCheck,
    label: "Scheduling & Calendars",
    intro:
      "Scheduling integrations let the agent confirm availability and place appointments on the correct calendar without back-and-forth.",
    outcomesLabel: "Outcomes",
    outcomes: [
      "Appointments booked during the call",
      "Rescheduling and cancellations handled consistently",
      "Automatic confirmations sent to the customer",
      "Reduced double-booking risk through real-time checks",
    ],
  },
  {
    id: "systems",
    icon: Server,
    label: "Business Systems & Databases",
    intro:
      "For businesses with frequently changing information, the agent can be configured to reference live data rather than static scripts.",
    outcomesLabel: "Examples",
    outcomes: [
      "Property availability and unit details for property management",
      "Service areas, job types, or dispatch rules for home services",
      "Account or policy context for professional offices",
    ],
    note: "When inventory or policies change, connected systems keep call answers aligned with current data.",
  },
  {
    id: "messaging",
    icon: BellRing,
    label: "Messaging & Notifications",
    intro: "Integrations can support confirmations and internal alerts.",
    outcomesLabel: "Common outcomes",
    outcomes: [
      "Text confirmations and reminders",
      "Internal notifications when urgent calls occur",
      "Escalation alerts when a call meets defined criteria",
    ],
  },
  {
    id: "reporting",
    icon: LineChart,
    label: "Reporting & Analytics",
    intro: "Call data is only valuable if it is visible and usable.",
    outcomesLabel: "Common outcomes",
    outcomes: [
      "Call volume and outcome reporting",
      "Qualification and booking metrics",
      "After-hours call visibility",
      "Conversion tracking tied to call outcomes",
    ],
  },
];

export function IntegrationTabs({ className }: { className?: string }) {
  const [active, setActive] = useState(categories[0].id);
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[300px_1fr]", className)}>
      {/* Tab rail */}
      <div
        role="tablist"
        aria-label="Integration categories"
        aria-orientation="vertical"
        className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {categories.map((c) => {
          const selected = c.id === active;
          return (
            <button
              key={c.id}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={selected}
              aria-controls={`panel-${c.id}`}
              onClick={() => setActive(c.id)}
              className={cn(
                "relative flex shrink-0 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14px] font-semibold transition-all duration-200",
                selected
                  ? "border-accent/30 bg-accent-tint/50 text-ink shadow-soft"
                  : "border-line bg-surface text-ink-light hover:border-line-strong hover:text-ink"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  selected ? "bg-accent text-ink-inverse" : "bg-surface-alt text-ink-light"
                )}
              >
                <c.icon aria-hidden className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap lg:whitespace-normal">{c.label}</span>
              {selected && (
                <motion.span
                  layoutId="tab-indicator"
                  aria-hidden
                  className="absolute inset-y-3 left-0 hidden w-[3px] rounded-full bg-accent lg:block"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8"
          >
            <p className="text-[16px] leading-relaxed text-ink-light">{current.intro}</p>
            <p className="mt-6 text-[13px] font-semibold text-accent">
              {current.outcomesLabel}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {current.outcomes.map((o, i) => (
                <motion.li
                  key={o}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: EASE }}
                  className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-alt/50 p-3.5"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
                    <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-[13.5px] font-medium leading-snug text-ink">
                    {o}
                  </span>
                </motion.li>
              ))}
            </ul>
            {current.note ? (
              <p className="mt-5 rounded-xl bg-accent-tint/40 p-4 text-[13.5px] leading-relaxed text-ink-light">
                {current.note}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
