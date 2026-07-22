import type { Metadata } from "next";
import { Container, SectionHead, Button } from "@/components/ui/primitives";
import {
  PageHero,
  Section,
  ChecklistBand,
  NumberedSteps,
  CTABand,
  SplitSection,
} from "@/components/blocks";
import { InboundDecisionTree } from "@/components/blocks/InboundDecisionTree";
import { InteractiveConfigBuilder } from "@/components/blocks/InteractiveConfigBuilder";
import { InboundRecordCard } from "@/components/blocks/InboundRecordCard";

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
  { title: "Review your call patterns and intake process" },
  { title: "Configure workflows and required data fields" },
  { title: "Connect CRM and scheduling systems" },
  { title: "Test real-world call scenarios" },
  { title: "Launch and refine" },
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
            <Button href="/request-a-free-demo" size="lg" arrow>
              Get a Free Demo
            </Button>
            <Button href="/how-it-works" variant="outline" size="lg">
              How It Works
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
            Even well-run offices miss calls during busy periods, lose
            after-hours inquiries to voicemail, and end up with intake that
            varies depending on who picks up. As call volume increases, these
            gaps become more frequent, and each one represents demand that
            existed but went unmet.
          </SectionHead>
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

      {/* Built around your business */}
      <SplitSection
        eyebrow="Configuration"
        index="04"
        title="Built Around Your Business,"
        mutedTitle="Not a Generic Script"
        intro="SkipDial agents are configured using your service offerings, intake requirements, escalation rules, pricing guidelines, and FAQs. You control what the agent says, what it must ask, and when a call transfers to a human. The result is consistent, accurate intake on every call, and structured data ready for your team."
        tone="alt"
      >
        <InteractiveConfigBuilder />
      </SplitSection>

      {/* Implementation */}
      <Section>
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="Getting started"
                index="05"
                title="How Implementation Works"
              >
                Structured and controlled, with no prolonged setup and no
                disruption to your existing systems.
              </SectionHead>
            </div>
            <NumberedSteps steps={implementationSteps} />
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
