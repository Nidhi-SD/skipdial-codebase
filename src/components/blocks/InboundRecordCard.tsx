import { Check, PhoneIncoming, CalendarCheck, ArrowRight } from "lucide-react";
import { Stagger, Item } from "@/components/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   InboundRecordCard — the CRM record an inbound call leaves behind. Answers
   the question the inbound copy raises but never shows: "what do I actually
   get after the agent hangs up?" Structured intake fields land one by one,
   then the outcome row resolves.

   Illustrative sample data — aria-hidden so screen readers aren't read a
   fake contact record as if it were real.
   ──────────────────────────────────────────────────────────────────────────── */

const intakeFields = [
  { label: "Caller", value: "Mariela Ortiz" },
  { label: "Phone", value: "(602) 555-0117" },
  { label: "Service needed", value: "Furnace not heating" },
  { label: "Urgency", value: "Emergency · same day" },
  { label: "Address", value: "4218 Camelback Rd" },
  { label: "Preferred time", value: "Tonight after 7 PM" },
];

export function InboundRecordCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-surface shadow-frame",
        className
      )}
    >
      {/* Record header */}
      <div className="flex items-center gap-3 border-b border-line bg-surface-alt/70 px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-bold text-ink-inverse">
          M
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-bold text-ink">
            Mariela Ortiz
          </p>
          <p className="flex items-center gap-1.5 text-[12px] text-ink-faint">
            <PhoneIncoming aria-hidden className="h-3 w-3" />
            Inbound · after hours · 2m 14s
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-accent-tint px-2.5 py-1 text-[10.5px] font-bold text-accent sm:inline">
          New lead
        </span>
      </div>

      <div className="p-5">
        <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Captured intake
        </p>

        <Stagger as="ul" stagger={0.07} className="mt-3.5 space-y-px overflow-hidden rounded-xl border border-line">
          {intakeFields.map((f) => (
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
              <CalendarCheck aria-hidden className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-bold leading-tight text-ink">
                Technician dispatched · 8:45 PM
              </p>
              <p className="mt-0.5 text-[11.5px] text-ink-light">
                Marco assigned from the on-call rotation
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
    </div>
  );
}
