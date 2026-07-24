import type { Metadata } from "next";
import { CalendarCheck, Sparkles } from "lucide-react";
import { Container, SectionHead, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion";
import { CallArrivalFrame } from "@/components/motion/entrances";
import { PageHero, Section, BulletList } from "@/components/blocks";
import { TryDemoCall } from "@/components/blocks/TryDemoCall";

export const metadata: Metadata = {
  title: "Request an AI Call Automation Demo | SkipDial",
  description:
    "Schedule a live demo of SkipDial AI call automation to see how inbound and outbound calls are handled, qualified, routed, and integrated with your CRM and scheduling tools.",
};

const demoBenefits = [
  "Live walkthrough",
  "Workflow recommendations",
  "CRM & routing setup",
  "Q&A with our team",
];

/** Live booking calendar — real availability lives here, not on this page. */
const BOOKING_URL =
  "https://cal.com/aryanbisht/30-min-discovery-call?overlayCalendar=true";

function SchedulePanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-frame sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-soft/20 blur-3xl"
      />
      <div className="relative flex flex-col items-center gap-5 text-center">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-accent">
          <CalendarCheck aria-hidden className="h-3.5 w-3.5" />
          Schedule a Time
        </p>
        <Button href={BOOKING_URL} external size="lg" className="w-full" arrow>
          Book Your 30-Minute Demo
        </Button>
      </div>
    </div>
  );
}

export default function RequestDemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Try it now"
        title="Try It for"
        mutedTitle="Yourself"
        body="Pick your industry and language, then get a live demo call from our AI voice agent. Hear exactly how SkipDial handles structured intake, appointment booking, and call routing in a real interaction."
      >
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-wrap gap-3">
            {["Structured intake", "Appointment booking", "Call routing"].map(
              (feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-ink shadow-sm"
                >
                  <Sparkles aria-hidden className="h-3.5 w-3.5 text-accent" />
                  {feature}
                </div>
              )
            )}
          </div>
          <CallArrivalFrame>
            <TryDemoCall />
          </CallArrivalFrame>
        </div>
      </PageHero>

      <Section tone="alt">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHead
                eyebrow="Get in Touch"
                title="Book a Personalized"
                mutedTitle="Demo"
              >
                See SkipDial configured around your call volume, workflows,
                and integrations, live and in real time.
              </SectionHead>
              <BulletList items={demoBenefits} className="mt-8" />
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
