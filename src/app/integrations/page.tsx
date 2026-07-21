import type { Metadata } from "next";
import {
  CalendarCheck,
  ClipboardCheck,
  RefreshCw,
  Route,
  Database,
  ShieldCheck,
  Workflow,
  PhoneCall,
  Braces,
} from "lucide-react";
import { Container, SectionHead, Button } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/motion";
import {
  PageHero,
  Section,
  ChecklistBand,
  NumberedSteps,
  BulletList,
  HearItLive,
  CTABand,
} from "@/components/blocks";
import { IntegrationTabs } from "@/components/blocks/IntegrationTabs";
import { BrandLogo } from "@/components/blocks/BrandLogo";

export const metadata: Metadata = {
  title: "AI Call Agent Integrations for CRM and Scheduling Tools | SkipDial",
  description:
    "SkipDial connects AI voice agents to your CRM, calendar, scheduling tools, and business systems so calls can book appointments, update records, and deliver structured call insights automatically.",
};

const possibilities = [
  {
    icon: CalendarCheck,
    label: "Booking, rescheduling, or confirming appointments in real time",
  },
  { icon: ClipboardCheck, label: "Logging call summaries and outcomes automatically" },
  {
    icon: RefreshCw,
    label: "Updating lead status and follow-up tasks based on call results",
  },
  {
    icon: Route,
    label: "Routing calls based on CRM context (new lead vs. existing customer)",
  },
  {
    icon: Database,
    label: "Pulling approved details from your systems so answers stay accurate",
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

const logoGroups = [
  {
    icon: PhoneCall,
    label: "Core Telephony Infrastructure",
    logos: ["Vonage", "Twilio", "Telnyx", "RingCentral", "SIP Trunking"],
  },
  {
    icon: Database,
    label: "CRM & Sales Platforms",
    logos: ["HubSpot", "Salesforce", "GoHighLevel", "ServiceTitan", "Jobber", "Pipedrive"],
  },
  {
    icon: Workflow,
    label: "Workflow Automation",
    logos: ["Zapier", "Make", "n8n", "Slack"],
  },
  {
    icon: Braces,
    label: "& Custom API Connections",
    logos: ["REST APIs", "Webhooks", "Middleware", "Custom Databases"],
  },
];

const dataFlow = [
  {
    title: "A call comes in",
    body: "Or an outbound trigger initiates a call based on a defined event.",
  },
  {
    title: "The agent follows a configured workflow",
    body: "It collects required information from the caller and references integrated systems when needed.",
  },
  {
    title: "The system logs a structured summary",
    body: "And tags the outcome of every conversation.",
  },
  {
    title: "Your systems update automatically",
    body: "CRM records, appointment calendars, and follow-up tasks update based on the call result.",
  },
  {
    title: "Your team receives the outcome",
    body: "In the same tools they already use.",
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Integrations"
        title="Integrations That Connect Calls"
        mutedTitle="to Your Workflow"
        body="The real impact of AI call handling comes from structured outcomes. SkipDial integrates AI voice agents into your existing tech stack so inbound and outbound calls can trigger real actions, sync data automatically, and deliver visibility without manual entry."
        ctas={
          <Button href="/request-a-free-demo" size="lg" arrow>
            Get a Free Demo
          </Button>
        }
      />

      {/* What integrations make possible */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="Possibilities"
            index="01"
            title="What Integrations"
            mutedTitle="Make Possible"
          >
            When the AI agent is connected to your systems, it can support
            workflows such as:
          </SectionHead>
          <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {possibilities.map((p) => (
              <Item
                as="li"
                key={p.label}
                className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-tint/60 text-accent">
                  <p.icon aria-hidden className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[14.5px] font-semibold leading-snug text-ink">
                  {p.label}
                </span>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Category tabs */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="Categories"
            index="02"
            title="Five Ways SkipDial Plugs"
            mutedTitle="Into Your Stack"
          />
          <Reveal variant="fadeUp" delay={0.15}>
            <IntegrationTabs className="mt-12" />
          </Reveal>
        </Container>
      </Section>

      <HearItLive />

      {/* What's included */}
      <Section>
        <Container>
          <ChecklistBand items={included} />
        </Container>
      </Section>

      {/* Types of integrations */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="Ecosystem"
            index="03"
            title="Types of Integrations"
            mutedTitle="SkipDial Supports"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {logoGroups.map((group, gi) => (
              <Reveal key={group.label} variant="fadeUp" delay={gi * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-tint/60 text-accent">
                      <group.icon aria-hidden className="h-4 w-4" />
                    </span>
                    <h3 className="text-[15px] font-bold">{group.label}</h3>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3.5">
                    {group.logos.map((logo) => (
                      <li key={logo}>
                        <BrandLogo name={logo} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal variant="fadeIn" delay={0.2}>
            <p className="mt-6 text-center text-[13px] text-ink-light">
              + dozens more through API-based connections and middleware
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Data flow */}
      <Section>
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="From ring to record"
                index="04"
                title="How the Integrated"
                mutedTitle="Data Flow Works"
              >
                A typical integrated call flow from first ring to CRM update.
              </SectionHead>
            </div>
            <NumberedSteps steps={dataFlow} />
          </div>
        </Container>
      </Section>

      {/* Control & accuracy */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="Implementation"
            index="05"
            title="Built for Control, Accuracy"
            mutedTitle="& Clean Implementation"
          >
            Integrations should reduce mistakes, not introduce them. SkipDial
            setups are implemented through direct system connections, API-based
            integrations, and webhooks or middleware when needed. The practical
            goal is the same in every case: call outcomes land in your workflow
            automatically.
          </SectionHead>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal variant="fadeUp">
              <div className="h-full rounded-2xl border border-line bg-surface p-7 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-tint/60 text-accent">
                    <ShieldCheck aria-hidden className="h-4 w-4" />
                  </span>
                  <h3 className="text-[16px] font-bold">Designed for Accuracy</h3>
                </div>
                <BulletList
                  className="mt-5"
                  items={[
                    "Defined workflows and required fields",
                    "Controlled knowledge bases for approved information",
                    "Clear escalation and transfer rules",
                    "Structured data mapping for consistent CRM fields",
                  ]}
                />
              </div>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.1}>
              <div className="h-full rounded-2xl border border-line bg-surface p-7 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-tint/60 text-accent">
                    <Workflow aria-hidden className="h-4 w-4" />
                  </span>
                  <h3 className="text-[16px] font-bold">Implementation Approach</h3>
                </div>
                <BulletList
                  className="mt-5"
                  items={[
                    "Direct system connections where available",
                    "API-based integrations for business tools",
                    "Webhooks and middleware when needed",
                    "No manual transcription or re-entry required",
                  ]}
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand
        title="See What Integrated Call Automation"
        mutedTitle="Looks Like in Practice"
        body="Your team may be spending valuable time on manual data entry because your call handling solution does not connect cleanly to your CRM and scheduling tools. SkipDial integrates AI voice agents into your systems so calls produce measurable outcomes, reliable follow-up, and fewer manual errors."
      />
    </>
  );
}
