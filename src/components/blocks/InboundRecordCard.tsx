"use client";

import { useState } from "react";
import { Check, PhoneIncoming, CalendarCheck, ArrowRight, LifeBuoy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Stagger, Item } from "@/components/motion";
import { cn } from "@/lib/cn";

const scenarios = [
  {
    id: "emergency",
    label: "Emergency Service",
    initial: "M",
    name: "Mariela Ortiz",
    meta: "Inbound · after hours · 2m 14s",
    tag: "New lead",
    tagTone: "accent",
    fields: [
      { label: "Caller", value: "Mariela Ortiz" },
      { label: "Phone", value: "(602) 555-0117" },
      { label: "Service needed", value: "Furnace not heating" },
      { label: "Urgency", value: "Emergency · same day" },
      { label: "Address", value: "4218 Camelback Rd" },
      { label: "Preferred time", value: "Tonight after 7 PM" },
    ],
    outcome: {
      title: "Technician dispatched · 8:45 PM",
      desc: "Marco assigned from the on-call rotation",
      icon: CalendarCheck,
    },
  },
  {
    id: "support",
    label: "Support Question",
    initial: "D",
    name: "David Chen",
    meta: "Inbound · business hours · 4m 10s",
    tag: "Existing customer",
    tagTone: "signal",
    fields: [
      { label: "Caller", value: "David Chen" },
      { label: "Phone", value: "(415) 555-0988" },
      { label: "Account ID", value: "ACC-89214" },
      { label: "Issue", value: "Login portal locked out" },
      { label: "Troubleshooting", value: "Password reset sent" },
      { label: "Status", value: "Resolved on call" },
    ],
    outcome: {
      title: "Ticket logged & closed",
      desc: "No further action required",
      icon: LifeBuoy,
    },
  },
];

export function InboundRecordCard({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState(scenarios[0].id);
  const activeScenario = scenarios.find((s) => s.id === activeId) || scenarios[0];

  return (
    <div className={className}>
      {/* Interactive Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-300",
              activeId === s.id
                ? "border-accent bg-accent text-ink-inverse shadow-sm"
                : "border-line bg-surface text-ink-light hover:border-line-strong hover:text-ink"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        aria-hidden
        className="overflow-hidden rounded-2xl border border-line bg-surface shadow-frame relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenario.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {/* Record header */}
            <div className="flex items-center gap-3 border-b border-line bg-surface-alt/70 px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-bold text-ink-inverse">
                {activeScenario.initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-bold text-ink">
                  {activeScenario.name}
                </p>
                <p className="flex items-center gap-1.5 text-[12px] text-ink-faint">
                  <PhoneIncoming aria-hidden className="h-3 w-3" />
                  {activeScenario.meta}
                </p>
              </div>
              <span
                className={cn(
                  "hidden shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold sm:inline",
                  activeScenario.tagTone === "accent"
                    ? "bg-accent-tint text-accent"
                    : "bg-signal/15 text-signal"
                )}
              >
                {activeScenario.tag}
              </span>
            </div>

            <div className="p-5">
              <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-faint">
                Captured intake
              </p>

              <Stagger
                as="ul"
                stagger={0.07}
                className="mt-3.5 space-y-px overflow-hidden rounded-xl border border-line"
              >
                {activeScenario.fields.map((f) => (
                  <Item
                    as="li"
                    key={f.label}
                    variant="fadeIn"
                    className="flex items-center gap-3 bg-surface px-3.5 py-2.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-line"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal/12 text-signal">
                      <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </span>
                    <span className="w-[104px] shrink-0 text-[12px] font-medium text-ink-faint sm:w-[120px]">
                      {f.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-ink">
                      {f.value}
                    </span>
                  </Item>
                ))}
              </Stagger>

              {/* Outcome */}
              <div className="mt-4 rounded-xl border border-accent/25 bg-accent-tint/40 p-4">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-ink-inverse">
                    <activeScenario.outcome.icon aria-hidden className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-tight text-ink">
                      {activeScenario.outcome.title}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-ink-light">
                      {activeScenario.outcome.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-accent/15 pt-3">
                  {["Call summary", "Intake fields", "Recording"].map((chip, i) => (
                    <span key={chip} className="flex items-center gap-2">
                      {i > 0 && (
                        <ArrowRight aria-hidden className="h-3 w-3 text-ink-faint" />
                      )}
                      <span className="rounded-md border border-line bg-surface px-2 py-1 text-[11px] font-semibold text-ink">
                        {chip}
                      </span>
                    </span>
                  ))}
                  <span className="ml-auto flex items-center gap-1.5 rounded-md bg-signal/10 px-2 py-1 text-[11px] font-bold text-signal">
                    <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                    Synced
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
