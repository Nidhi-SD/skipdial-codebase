import type { Metadata } from "next";
import { Sparkles } from "@/components/icons/SystemIcons";
import { Container, SectionHead, Button } from "@/components/ui/primitives";
import { Stagger, Item } from "@/components/motion";
import { Magnetic, CallArrivalFrame } from "@/components/motion/entrances";
import {
  PageHero,
  Section,
  ChecklistBand,
  CTABand,
  SplitSection,
} from "@/components/blocks";
import { InboundDecisionTree } from "@/components/blocks/InboundDecisionTree";
import { InboundProblemVisual } from "@/components/blocks/InboundProblemVisual";
import { InboundRecordCard } from "@/components/blocks/InboundRecordCard";
import { ScrollTimeline } from "@/components/blocks/ScrollTimeline";
import { TryDemoCall } from "@/components/blocks/TryDemoCall";

export const metadata: Metadata = {
  title: "AI Inbound Call Handling & Automation | SkipDial",
  description:
    "SkipDial uses AI agents to answer inbound calls 24/7, qualify leads, capture structured intake data, and sync call insights directly to your CRM and scheduling systems.",
};

const included = [
  "24/7 Call Answering",
  "Real-Time Lead Qualification",
  "CRM Sync & Follow-Up",
  "Multi-Language Support",
  "Appointment Booking",
  "Call Summaries & Logging",
  "After-Hours Coverage",
  "Escalation Rules",
];

const implementationSteps = [
  { title: "We review your call patterns and intake process" },
  { title: "We configure your workflows and required data fields" },
  { title: "We build and test your qualification rules" },
  { title: "We connect your CRM and scheduling systems" },
  { title: "We deploy once you approve" },
  { title: "We keep refining as your business changes" },
];

export default function InboundCallingPage() {
  return (
    <>
      <PageHero
        eyebrow="Inbound Calling"
        title="AI Inbound Call Handling That"
        mutedTitle="Captures Every Opportunity"
        body="When someone calls your business, they're usually ready to book, schedule, or move forward. SkipDial ensures those calls are answered immediately, handled consistently, and documented accurately."
        ctas={
          <>
            <Magnetic>
              <Button href="#live-demo" size="lg" arrow>
                Try It Yourself
              </Button>
            </Magnetic>
            <Button href="/how-it-works#hear-it-live" variant="outline" size="lg">
              Hear a Sample
            </Button>
          </>
        }
      />

      {/* The problem */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="The problem"
            index="01"
            title="The Problem with"
            mutedTitle="Traditional Call Handling"
          >
            Every missed call was demand that already existed.
          </SectionHead>
          <InboundProblemVisual className="mt-10" />
        </Container>
      </Section>

      {/* What SkipDial does */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="On every call"
            index="02"
            title="What SkipDial Does"
            mutedTitle="When a Call Comes In"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12">
            <InboundDecisionTree />
          </div>
        </Container>
      </Section>

      {/* What the call leaves behind */}
      <SplitSection
        eyebrow="In your CRM"
        index="03"
        title="Every Call Becomes a"
        mutedTitle="Structured Record"
        intro="The agent doesn't just take the call, it writes it down. Every required field is captured in your own intake order, the outcome is logged, and the summary, transcript, and recording land in your CRM before your team opens the record."
        link={{ href: "/integrations", label: "See supported integrations" }}
      >
        <InboundRecordCard />
      </SplitSection>


      {/* What's included */}
      <Section>
        <Container>
          <ChecklistBand items={included} />
        </Container>
      </Section>


      {/* Implementation */}
      <Section>
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="Getting started"
                index="05"
                title="We Handle Implementation"
              >
                Our team does the setup end to end — no prolonged project on
                your side, and no disruption to your existing systems.
              </SectionHead>
            </div>
            <ScrollTimeline steps={implementationSteps} />
          </div>
        </Container>
      </Section>

      {/* Live demo call widget */}
      <Section id="live-demo" tone="alt">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHead
                eyebrow="Try it now"
                title="Try It for"
                mutedTitle="Yourself"
              >
                Pick your industry and language, then get a live demonstration
                call. Hear how structured intake, appointment booking, and
                call routing work in a real interaction.
              </SectionHead>
              <Stagger className="mt-8 flex flex-wrap gap-2.5">
                {["Structured intake", "Appointment booking", "Call routing", "Multi language support", "CRM sync", "24/7 availability"].map(
                  (chip) => (
                    <Item
                      key={chip}
                      variant="fadeIn"
                      className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-light"
                    >
                      <Sparkles aria-hidden className="h-3.5 w-3.5 text-accent" />
                      {chip}
                    </Item>
                  )
                )}
              </Stagger>
            </div>
            <CallArrivalFrame>
              <TryDemoCall />
            </CallArrivalFrame>
          </div>
        </Container>
      </Section>

      <CTABand
        title="See How SkipDial Handles"
        mutedTitle="Your Inbound Calls"
        body="If your business depends on phone calls to generate revenue, consistent intake and immediate response are not optional. SkipDial provides structured inbound call handling without expanding headcount or sacrificing control."
      />
    </>
  );
}
