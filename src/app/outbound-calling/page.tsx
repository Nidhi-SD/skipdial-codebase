import type { Metadata } from "next";
import {
  Zap,
  MessageSquare,
  Gauge,
  PhoneForwarded,
  ClipboardCheck,
  PhoneMissed,
  CalendarCheck,
  RefreshCw,
  HeartHandshake,
  Banknote,
  UserPlus,
} from "lucide-react";
import { Container, SectionHead, Button, ArrowLink } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/motion";
import {
  PageHero,
  Section,
  IconCardGrid,
  ChecklistBand,
  NumberedSteps,
  SubCardGrid,
  HearItLive,
  CTABand,
} from "@/components/blocks";

export const metadata: Metadata = {
  title: "AI Outbound Call Automation & Follow-Up | SkipDial",
  description:
    "SkipDial uses AI to automate outbound calls for lead follow-up, appointment confirmations, re-engagement, and retention, with structured workflows and real-time CRM integration.",
};

const outboundCards = [
  {
    icon: Zap,
    title: "Initiates Calls Based on Defined Triggers",
    body: "New form submissions, missed calls, CRM stage changes, scheduled reminders, or defined outreach lists.",
  },
  {
    icon: MessageSquare,
    title: "Engages in Structured Conversation",
    body: "The AI follows messaging built around your scripts, qualification criteria, and escalation rules.",
  },
  {
    icon: Gauge,
    title: "Qualifies Interest in Real Time",
    body: "Prospects are categorized based on urgency, readiness, and intent, with outcomes tagged automatically.",
  },
  {
    icon: PhoneForwarded,
    title: "Books Appointments or Transfers Live",
    body: "Interested prospects can schedule immediately or be routed directly to the appropriate team member.",
  },
  {
    icon: ClipboardCheck,
    title: "Logs Every Outcome Automatically",
    body: "From no answer or voicemail to qualified lead or appointment booked, every call attempt and result is recorded in your system.",
  },
];

const included = [
  "Trigger-based Outbound Calls",
  "Real-time Lead Qualification",
  "Appointment Booking & Transfer",
  "CRM Sync & Outcome Logging",
  "Voicemail Detection",
  "Configurable Call Cadence",
  "Escalation & Transfer Rules",
];

const controlCards = [
  { title: "Lead Stages", body: "Configured to your CRM pipeline" },
  { title: "Follow-up Cadence", body: "You set when calls are placed" },
  { title: "Qualification Rules", body: "Urgency, readiness, and intent" },
  { title: "Escalation Policies", body: "Transfer and handoff rules" },
];

const useCases = [
  { icon: UserPlus, label: "Immediate follow-up on new inbound leads" },
  { icon: PhoneMissed, label: "Missed-call callbacks" },
  { icon: CalendarCheck, label: "Appointment confirmations and reminders" },
  { icon: RefreshCw, label: "Re-engaging older prospects" },
  { icon: HeartHandshake, label: "Customer retention outreach" },
  { icon: Banknote, label: "Payment or collections reminders" },
];

const implementationSteps = [
  { title: "Define outbound triggers and target lists" },
  { title: "Configure scripts and qualification rules" },
  { title: "Connect CRM and scheduling systems" },
  { title: "Test scenarios and call flows" },
  { title: "Launch and refine based on performance" },
];

export default function OutboundCallingPage() {
  return (
    <>
      <PageHero
        eyebrow="Outbound Calling"
        title="AI Outbound Call Automation"
        mutedTitle="for Consistent Follow-Up"
        body="SkipDial automates outbound calls using structured AI workflows designed around your sales process, appointment flow, and customer lifecycle. Instead of relying on manual call lists, inconsistent callbacks, or overextended staff, outbound activity becomes disciplined, trackable, and scalable."
        ctas={
          <>
            <Button href="/request-a-free-demo" size="lg" arrow>
              Get a Free Demo
            </Button>
            <Button href="/integrations" variant="outline" size="lg">
              See Integrations
            </Button>
          </>
        }
      />

      {/* Where follow-up breaks down */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="The problem"
            index="01"
            title="Where Outbound Follow-Up"
            mutedTitle="Breaks Down"
          >
            New leads wait too long for a response. Missed-call callbacks fall
            through the cracks. Appointment confirmations get skipped. As
            inbound demand increases, outbound discipline typically declines,
            and call outcomes go poorly documented or not documented at all.
          </SectionHead>
        </Container>
      </Section>

      {/* What SkipDial does */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="On every call"
            index="02"
            title="What SkipDial Does When It"
            mutedTitle="Places an Outbound Call"
          >
            Every outbound call follows a configured workflow, not
            improvisation.
          </SectionHead>
          <IconCardGrid cards={outboundCards} columns={3} className="mt-12" />
        </Container>
      </Section>

      <HearItLive />

      {/* What's included */}
      <Section>
        <Container>
          <ChecklistBand items={included} />
        </Container>
      </Section>

      {/* Not a robocall platform */}
      <Section tone="alt">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="Controlled outreach"
                index="03"
                title="Not a Robocall Platform"
              >
                Outbound automation is often associated with mass dialing and
                generic scripts. SkipDial operates differently. Calls respond
                dynamically to what the prospect says, messaging is configured
                specifically to your business, and every outcome syncs directly
                to your CRM.{" "}
                <strong className="font-semibold text-ink">
                  This is controlled outbound follow-up, not blind cold calling.
                </strong>
              </SectionHead>
              <Reveal variant="fadeUp" delay={0.2}>
                <div className="mt-8">
                  <p className="text-[15px] text-ink-light">
                    Outbound calls update your CRM, sync appointments, log
                    follow-up tasks, and reflect true activity in your reporting
                    dashboards automatically, without manual data entry.
                  </p>
                  <ArrowLink href="/integrations" className="mt-4">
                    Learn About Integrations
                  </ArrowLink>
                </div>
              </Reveal>
            </div>
            <SubCardGrid cards={controlCards} className="lg:grid-cols-2" />
          </div>
        </Container>
      </Section>

      {/* Use cases */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="Use cases"
            index="04"
            title="Common Outbound Use Cases"
            align="center"
            className="mx-auto"
          >
            Outbound automation ensures response time and follow-up discipline
            don&apos;t depend on staffing bandwidth.
          </SectionHead>
          <Stagger
            as="ul"
            className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2"
          >
            {useCases.map((u) => (
              <Item
                as="li"
                key={u.label}
                className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-tint/60 text-accent">
                  <u.icon aria-hidden className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[15px] font-semibold text-ink">{u.label}</span>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Implementation */}
      <Section tone="alt">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="Getting started"
                index="05"
                title="How Implementation Works"
              >
                Outbound workflows evolve alongside your sales and retention
                strategy.
              </SectionHead>
            </div>
            <NumberedSteps steps={implementationSteps} />
          </div>
        </Container>
      </Section>

      <CTABand
        title="See How SkipDial Automates"
        mutedTitle="Outbound Follow-Up"
        body="Consistent outbound activity increases conversion rates without increasing headcount."
      />
    </>
  );
}
