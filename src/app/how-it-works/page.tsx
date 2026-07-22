"use client";

import { motion } from "framer-motion";
import {
  Map,
  BookOpen,
  Plug,
  FlaskConical,
  Rocket,
  PhoneIncoming,
  Ear,
  ClipboardList,
  Filter,
  Route,
  Database,
  type LucideIcon,
} from "lucide-react";
import { Container, SectionHead, Button, ArrowLink, Eyebrow } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/motion";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import {
  PageHero,
  Section,
  BulletList,
  HearItLive,
  CTABand,
} from "@/components/blocks";

type ProcessStep = {
  icon: LucideIcon;
  title: string;
  body: string;
  listLabel?: string;
  list?: string[];
  secondListLabel?: string;
  secondList?: string[];
  closing?: string;
  link?: { href: string; label: string };
};

const steps: ProcessStep[] = [
  {
    icon: Map,
    title: "Map Your Call Workflows",
    body: "Every business handles calls differently. SkipDial can be configured for any scenario or volume, whether your business requires detailed intake, prioritizes urgency, or routes by service type, location, or customer status.",
    listLabel: "The process starts by reviewing",
    list: [
      "How inbound calls are currently handled and what questions must always be asked",
      "What qualifies a lead or request, and when calls should transfer to a human",
      "How appointments are scheduled and documented",
    ],
  },
  {
    icon: BookOpen,
    title: "Build Your AI Agent Around Your Scripts and Knowledge Base",
    body: "SkipDial agents are configured using your approved information. You define services offered, FAQs, intake requirements, pricing boundaries, escalation rules, and transfer conditions. The agent operates within those boundaries. It does not invent services, improvise policies, or answer outside what you approve. Required intake fields are enforced on every call.",
  },
  {
    icon: Plug,
    title: "Connect to Your Phone System and CRM",
    body: "SkipDial integrates with your existing phone system and business tools so call activity flows directly into your workflow.",
    listLabel: "This includes",
    list: [
      "Routing logic for live transfers",
      "Appointment booking through connected calendars",
      "CRM synchronization",
      "Call summaries and outcome tagging",
      "Reporting dashboards",
    ],
    closing:
      "You do not need to replace your current systems. The AI layer connects to them and adds structured automation.",
    link: { href: "/integrations", label: "Integrations" },
  },
  {
    icon: FlaskConical,
    title: "Test Real-World Call Scenarios",
    body: "Before launch, workflows are tested using realistic call scenarios.",
    listLabel: "Examples may include",
    list: [
      "Emergency vs. standard service calls",
      "New lead vs. existing customer",
      "After-hours calls",
      "Appointment booking and rescheduling",
      "Frequently asked questions",
    ],
    secondListLabel: "Testing ensures",
    secondList: [
      "Questions are asked in the right order",
      "Routing rules behave correctly",
      "Data fields populate properly",
      "Escalation triggers work as intended",
    ],
    closing: "Adjustments are made before the system goes live.",
  },
  {
    icon: Rocket,
    title: "Launch and Optimize",
    body: "Priorities change, services expand, and messaging evolves. SkipDial supports ongoing refinement through performance dashboards so the agent stays aligned with your current operations.",
    listLabel: "Ongoing refinement",
    list: [
      "Performance dashboards",
      "Call outcome reporting",
      "Workflow adjustments",
      "Knowledge base updates",
    ],
  },
];

const everyCall = [
  { icon: PhoneIncoming, label: "Call answered immediately" },
  { icon: Ear, label: "Caller intent identified" },
  { icon: ClipboardList, label: "Intake information collected" },
  { icon: Filter, label: "Caller qualified by defined rules" },
  { icon: Route, label: "Call routed, scheduled, or resolved" },
  { icon: Database, label: "Summary logged to CRM" },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="The Process"
        title="How SkipDial AI"
        mutedTitle="Call Handling Works"
        body="You have complete control over how calls are handled. SkipDial is built around structured workflows, defined business rules, and controlled integrations so every call follows a process you approve. Rather than replacing your systems, it configures AI agents around how your business already operates, and enforces consistency at scale."
        ctas={
          <Button href="/request-a-free-demo" size="lg" arrow>
            Get a Free Demo
          </Button>
        }
      />

      {/* Five-step process */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            {steps.map((step, i) => (
              <Reveal key={step.title} variant="fadeUp">
                <SpotlightCard
                  as={motion.article}
                  className="rounded-2xl border border-line bg-surface/80 p-7 shadow-soft backdrop-blur-md transition-colors duration-500 hover:border-accent/30 sm:p-9"
                >
                  <div className="flex items-center justify-between gap-4">
                    <Eyebrow>{`Step ${i + 1}`}</Eyebrow>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-accent-tint/10 text-accent transition-colors duration-300 group-hover:bg-accent/20 group-hover:border-accent/40">
                      <step.icon aria-hidden className="h-5 w-5" />
                    </span>
                  </div>
                  <h2 className="mt-4 text-display-sm font-bold">{step.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-light">
                    {step.body}
                  </p>

                  {step.list ? (
                    <>
                      <p className="mt-6 text-[13px] font-semibold text-accent">
                        {step.listLabel}
                      </p>
                      <BulletList items={step.list} className="mt-3" />
                    </>
                  ) : null}

                  {step.secondList ? (
                    <>
                      <p className="mt-6 text-[13px] font-semibold text-accent">
                        {step.secondListLabel}
                      </p>
                      <BulletList items={step.secondList} className="mt-3" />
                    </>
                  ) : null}

                  {step.closing ? (
                    <div className="mt-6 rounded-xl border border-line bg-surface-alt p-5">
                      <p className="text-[14px] font-medium leading-relaxed text-ink-light">
                        {step.closing}
                      </p>
                    </div>
                  ) : null}

                  {step.link ? (
                    <ArrowLink href={step.link.href} className="mt-6 inline-flex">
                      {step.link.label}
                    </ArrowLink>
                  ) : null}
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <HearItLive />

      {/* What happens on every call */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="Every call"
            index="06"
            title="What Happens on Every Call"
            align="center"
            className="mx-auto"
          />
          <Stagger
            as="ol"
            className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {everyCall.map((c, i) => (
              <Item as="li" key={c.label} className="h-full">
                <SpotlightCard className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface/80 p-6 shadow-soft backdrop-blur-sm transition-colors duration-500 hover:border-accent/30 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-accent-tint/10 text-accent transition-colors duration-300 group-hover:bg-accent/20">
                      <c.icon aria-hidden className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[12px] font-semibold text-ink-faint">
                      0{i + 1}
                    </span>
                  </div>
                  <span className="text-[14px] font-semibold leading-relaxed text-ink">
                    {c.label}
                  </span>
                </SpotlightCard>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CTABand
        title="See How SkipDial Would Work"
        mutedTitle="for Your Business"
        body="Every business has unique call patterns and operational priorities. The best way to understand how SkipDial would function in your environment is to review your workflows and test real scenarios."
      />
    </>
  );
}