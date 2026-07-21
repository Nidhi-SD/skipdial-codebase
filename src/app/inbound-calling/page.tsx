import type { Metadata } from "next";
import {
  PhoneIncoming,
  MessageSquare,
  ListChecks,
  Filter,
  CalendarCheck,
  BarChart3,
  Target,
  Tags,
  Database,
} from "lucide-react";
import { Container, SectionHead, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion";
import {
  PageHero,
  Section,
  IconCardGrid,
  ChecklistBand,
  NumberedSteps,
  HearItLive,
  CTABand,
  SplitSection,
} from "@/components/blocks";

export const metadata: Metadata = {
  title: "AI Inbound Call Handling & Automation | SkipDial",
  description:
    "SkipDial uses AI agents to answer inbound calls 24/7, qualify leads, capture structured intake data, and sync call insights directly to your CRM and scheduling systems.",
};

const callCards = [
  {
    icon: PhoneIncoming,
    title: "Answers Immediately",
    body: "Picked up without hold queues or voicemail deferrals, every time.",
  },
  {
    icon: MessageSquare,
    title: "Engages in Natural Conversation",
    body: "Callers speak normally. The AI understands intent without forcing button prompts or menu trees.",
  },
  {
    icon: ListChecks,
    title: "Follows Your Configured Workflow",
    body: "Required questions are asked every time. No steps skipped, no fields missed.",
  },
  {
    icon: Filter,
    title: "Qualifies and Categorizes the Caller",
    body: "Emergency vs. standard. New lead vs. existing customer. Identified in real time.",
  },
  {
    icon: CalendarCheck,
    title: "Routes, Books, and Logs Automatically",
    body: "Calls are transferred, appointments are booked, and outcomes are logged based on your rules.",
  },
];

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

const configCards = [
  {
    title: "Call Volume Tracking",
    body: "See exactly how many calls come in, when, and at what frequency.",
  },
  {
    title: "Lead Qualification Metrics",
    body: "Understand which callers are qualified and how your lead mix shifts.",
  },
  {
    title: "Outcome Categorization",
    body: "Every call is labeled as booked, info only, escalated, or after-hours.",
  },
  {
    title: "CRM-Ready Data",
    body: "Summaries, intake fields, and timestamps sync automatically.",
  },
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
          />
          <IconCardGrid cards={callCards} columns={3} className="mt-12" />
        </Container>
      </Section>

      <HearItLive />

      {/* What's included */}
      <Section>
        <Container>
          <ChecklistBand items={included} />
        </Container>
      </Section>

      {/* Built around your business */}
      <SplitSection
        eyebrow="Configuration"
        index="03"
        title="Built Around Your Business,"
        mutedTitle="Not a Generic Script"
        intro="SkipDial agents are configured using your service offerings, intake requirements, escalation rules, pricing guidelines, and FAQs. You control what the agent says, what it must ask, and when a call transfers to a human. The result is consistent, accurate intake on every call, and structured data ready for your team."
        tone="alt"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: BarChart3, ...configCards[0] },
            { icon: Target, ...configCards[1] },
            { icon: Tags, ...configCards[2] },
            { icon: Database, ...configCards[3] },
          ].map((c, i) => (
            <Reveal key={c.title} variant="fadeUp" delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-accent/25 hover:shadow-lift">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-accent-tint/50 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-ink-inverse">
                  <c.icon aria-hidden className="h-[18px] w-[18px]" />
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold">{c.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-light">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </SplitSection>

      {/* Implementation */}
      <Section>
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="Getting started"
                index="04"
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
