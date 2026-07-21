import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  Clock,
  Workflow,
  ShieldCheck,
} from "lucide-react";
import { Container, SectionHead, Button } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/motion";
import { PageHero, Section, BulletList } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Request an AI Call Automation Demo | SkipDial",
  description:
    "Schedule a live demo of SkipDial AI call automation to see how inbound and outbound calls are handled, qualified, routed, and integrated with your CRM and scheduling tools.",
};

const expectations = [
  "A walkthrough of live inbound and outbound call handling",
  "Workflow configuration mapped to your call volume and intake requirements",
  "Routing rules, escalation paths, and CRM integrations in action",
  "Clear next steps. No pressure, no obligation",
];

/* Decorative scheduler panel — swap the inner block for the real booking embed
   (Calendly / GHL iframe) once the client confirms the provider + link. */
function SchedulePanel() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-frame sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-soft/20 blur-3xl"
      />
      <div className="relative">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-accent">
          <CalendarCheck aria-hidden className="h-3.5 w-3.5" />
          Schedule a Time
        </p>
        <h3 className="mt-3 text-display-sm font-bold">
          Pick a slot that works for you
        </h3>

        <div className="mt-6 grid grid-cols-5 gap-2" aria-hidden>
          {days.map((d, i) => (
            <div
              key={d}
              className={
                i === 2
                  ? "rounded-xl border border-accent bg-accent text-center text-ink-inverse shadow-card"
                  : "rounded-xl border border-line bg-surface-alt/60 text-center text-ink-light"
              }
            >
              <p className="pt-2.5 font-mono text-[10.5px] uppercase tracking-wide opacity-70">
                {d}
              </p>
              <p className="pb-2.5 text-[15px] font-bold">{20 + i}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2" aria-hidden>
          {slots.map((s, i) => (
            <div
              key={s}
              className={
                i === 1
                  ? "rounded-xl border border-accent/40 bg-accent-tint/60 py-2.5 text-center text-[13px] font-semibold text-accent"
                  : "rounded-xl border border-line py-2.5 text-center text-[13px] font-medium text-ink-light"
              }
            >
              {s}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button href="tel:+14808681102" size="lg" className="w-full" arrow>
            Book by Phone · (480) 868-1102
          </Button>
          <Button
            href="mailto:info@skipdial.ai?subject=SkipDial%20Demo%20Request"
            variant="outline"
            size="lg"
            className="w-full"
          >
            Request Times by Email
          </Button>
        </div>
        <p className="mt-4 text-center text-[12px] text-ink-light">
          30 minutes · tailored to your call workflows · no obligation
        </p>
      </div>
    </div>
  );
}

export default function RequestDemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Request a Free Demo"
        center
        body="If your business depends on phone calls, the most effective way to evaluate AI call automation is to see how the platform handles workflows in practice."
      />

      <Section className="pt-0">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHead
                eyebrow="What you'll see"
                title="Request a 30-Minute"
                mutedTitle="SkipDial Demo"
              >
                Schedule a free demo and consultation to see how SkipDial could
                be configured for your call volume, intake requirements, routing
                rules, and integrations.
              </SectionHead>
              <BulletList items={expectations} className="mt-8" />

              <Stagger className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Clock, label: "30 minutes" },
                  { icon: Workflow, label: "Your workflows" },
                  { icon: ShieldCheck, label: "No obligation" },
                ].map((chip) => (
                  <Item
                    key={chip.label}
                    variant="scaleIn"
                    className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-[13px] font-semibold text-ink shadow-soft"
                  >
                    <chip.icon aria-hidden className="h-4 w-4 text-accent" />
                    {chip.label}
                  </Item>
                ))}
              </Stagger>

              <Reveal variant="fadeUp" delay={0.15}>
                <div className="mt-10 space-y-3 rounded-2xl border border-line bg-surface-alt/60 p-6 text-[14px] text-ink-light">
                  <a
                    href="tel:+14808681102"
                    className="flex items-center gap-2.5 transition-colors hover:text-ink"
                  >
                    <Phone aria-hidden className="h-4 w-4 text-accent" />
                    (480) 868-1102
                  </a>
                  <a
                    href="mailto:info@skipdial.ai"
                    className="flex items-center gap-2.5 transition-colors hover:text-ink"
                  >
                    <Mail aria-hidden className="h-4 w-4 text-accent" />
                    info@skipdial.ai
                  </a>
                  <p className="flex items-start gap-2.5">
                    <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
                    1801 E. Camelback Rd, Suite 201, Phoenix, AZ 85016
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal variant="scaleIn" delay={0.1}>
              <SchedulePanel />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
