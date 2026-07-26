import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { Container, SectionHead, Button } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/motion";
import { CallArrivalFrame } from "@/components/motion/entrances";
import { PageHero, Section } from "@/components/blocks";
import { TryDemoCall } from "@/components/blocks/TryDemoCall";

export const metadata: Metadata = {
  title: "Request an AI Call Automation Demo | SkipDial",
  description:
    "Schedule a live demo of SkipDial AI call automation to see how inbound and outbound calls are handled, qualified, routed, and integrated with your CRM and scheduling tools.",
};

const demoHighlights = [
  "Live walkthrough",
  "Workflow & CRM setup",
  "Direct Q&A with our team",
];

/** Live booking calendar — real availability lives here, not on this page. */
const BOOKING_URL =
  "https://cal.com/aryanbisht/30-min-discovery-call?overlayCalendar=true";

export default function RequestDemoPage() {
  return (
    <>
      {/* 1 — Try the AI. The hero, and the whole reason to be on this page. */}
      <PageHero
        eyebrow="Try it now"
        title="Try It for"
        mutedTitle="Yourself"
        body="Pick an industry and language, then get a live call from our AI voice agent — hear it handle intake, booking, and routing in real time."
      >
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-wrap gap-3">
            {["Structured intake", "Appointment booking", "Call routing", "Multi language support", "CRM sync", "24/7 availability"].map(
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

      {/* 2 — Book the demo. One question, one answer, one button: one
          focused column rather than a competing sales panel. */}
      <Section tone="wash">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <SectionHead
              eyebrow="Next step"
              title="See It Configured for"
              mutedTitle="Your Business"
              align="center"
              className="mx-auto"
            >
              A 30-minute walkthrough built around your call volume,
              workflows, and systems.
            </SectionHead>

            <Stagger className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {demoHighlights.map((item) => (
                <Item key={item} variant="fadeIn" className="flex items-center gap-2">
                  <Check aria-hidden className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
                  <span className="text-[13.5px] font-medium text-ink-light">
                    {item}
                  </span>
                </Item>
              ))}
            </Stagger>

            <Reveal variant="fadeUp" delay={0.15}>
              <div className="mt-9 flex flex-col items-center gap-3">
                <Button href={BOOKING_URL} external size="lg" arrow>
                  Book Your 30-Minute Demo
                </Button>
                <p className="text-[12.5px] text-ink-faint">
                  Pick any time. Reschedule freely.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
