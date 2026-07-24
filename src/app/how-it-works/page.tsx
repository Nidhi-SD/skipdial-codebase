import {
  PhoneIncoming,
  Ear,
  ClipboardList,
  Filter,
  Route,
  Database,
  ChevronRight,
} from "lucide-react";
import { Container, SectionHead, Button, ArrowLink } from "@/components/ui/primitives";
import { Stagger, Item } from "@/components/motion";
import { PageHero, Section, HearItLive, CTABand } from "@/components/blocks";
import { ScrollTimeline } from "@/components/blocks/ScrollTimeline";
import { WorkflowBeam } from "@/components/blocks/WorkflowBeam";

const steps = [
  {
    title: "Map your call workflows",
    body: "We review how calls are handled today, what qualifies a lead, and how appointments get booked.",
  },
  {
    title: "Configure the agent around your rules",
    body: "Services, FAQs, pricing, and escalation rules come from your approved playbook — nothing improvised.",
  },
  {
    title: "Connect your phone system & CRM",
    body: "Routing, booking, and call summaries sync directly into the tools your team already uses.",
  },
  {
    title: "Test real call scenarios",
    body: "Emergencies, new leads, after-hours calls, and edge cases all run before anything goes live.",
  },
  {
    title: "Launch and optimize",
    body: "Dashboards and call outcomes keep the agent aligned as your services and priorities evolve.",
  },
];

const everyCall = [
  { icon: PhoneIncoming, label: "Answered immediately" },
  { icon: Ear, label: "Intent identified" },
  { icon: ClipboardList, label: "Intake collected" },
  { icon: Filter, label: "Qualified by your rules" },
  { icon: Route, label: "Routed or resolved" },
  { icon: Database, label: "Logged to CRM" },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="The Process"
        title="How SkipDial AI"
        mutedTitle="Call Handling Works"
        body="Every SkipDial agent is configured around how your business already operates — your workflows, your rules, your systems. Nothing is improvised, and nothing goes live until you approve it."
        ctas={
          <Button href="/request-a-free-demo" size="lg" arrow>
            Get a Free Demo
          </Button>
        }
      />

      {/* Five-step process + live call-routing visual */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHead eyebrow="Five steps" title="Configured Around" mutedTitle="Your Business">
                Not a generic script. Every agent is mapped, built, tested, and
                launched around how your business already runs calls.
              </SectionHead>
              <ArrowLink href="/integrations" className="mt-6">
                See supported integrations
              </ArrowLink>
            </div>
            <ScrollTimeline steps={steps} />
          </div>

          <WorkflowBeam className="mt-16 md:mt-20" />
        </Container>
      </Section>

      <HearItLive />

      {/* What happens on every call */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="Every call"
            title="Every Call Follows"
            mutedTitle="the Same Path"
            align="center"
            className="mx-auto"
          />
          <Stagger className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
            {everyCall.map((c, i) => (
              <Item key={c.label} variant="fadeIn" className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-light shadow-soft">
                  <c.icon aria-hidden className="h-3.5 w-3.5 text-accent" />
                  {c.label}
                </span>
                {i < everyCall.length - 1 ? (
                  <ChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink-faint/60" />
                ) : null}
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
