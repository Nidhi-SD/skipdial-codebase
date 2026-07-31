import {
  PhoneIncoming,
  Ear,
  ClipboardList,
  Filter,
  Route,
  Database,
  ChevronRight,
  Sparkles,
} from "@/components/icons/SystemIcons";
import { Container, SectionHead, Button, ArrowLink } from "@/components/ui/primitives";
import { Stagger, Item } from "@/components/motion";
import { Magnetic, CallArrivalFrame } from "@/components/motion/entrances";
import { PageHero, Section, HearItLive, CTABand } from "@/components/blocks";
import { ScrollTimeline } from "@/components/blocks/ScrollTimeline";
import { WorkflowBeam } from "@/components/blocks/WorkflowBeam";
import { TryDemoCall } from "@/components/blocks/TryDemoCall";

const steps = [
  {
    title: "We understand your requirements",
    body: "We sit with your team and map how calls are handled today, what qualifies a lead, and how appointments get booked. You talk; we take notes.",
  },
  {
    title: "We configure your workflows",
    body: "Your services, FAQs, pricing, and escalation rules become the agent's playbook. We write it up, you approve it.",
  },
  {
    title: "We build your automations",
    body: "Qualification logic, booking rules, and routing paths are built out by our team — nothing for you to assemble.",
  },
  {
    title: "We integrate your tools",
    body: "We connect your phone system, calendar, and CRM so bookings and call summaries land where your team already works.",
  },
  {
    title: "We deploy everything",
    body: "We test emergencies, new leads, after-hours calls, and edge cases first. Nothing goes live until you give the word.",
  },
  {
    title: "We keep supporting you",
    body: "We monitor call outcomes and tune the agent as your services, pricing, and priorities change. It stays our job, not yours.",
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
        body="Our team builds every SkipDial agent around how your business already operates — your workflows, your rules, your systems. We handle the setup end to end. Nothing is improvised, and nothing goes live until you approve it."
        ctas={
          <Magnetic>
            <Button href="#live-demo" size="lg" arrow>
              Try It Yourself
            </Button>
          </Magnetic>
        }
      />

      {/* Six-step process + live call-routing visual */}
      <Section>
        <Container>
          {/* No align override: the column stretches to the row height, and the
              short inner block sticks inside it while the steps scroll past. */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="lg:sticky lg:top-28">
                <SectionHead eyebrow="We handle it" title="We Build It Around" mutedTitle="Your Business">
                  Not a generic script, and not a setup project you have to run.
                  Our team maps, builds, integrates, and launches your agent —
                  you review and approve.
                </SectionHead>
                <ArrowLink href="/integrations" className="mt-6">
                  See supported integrations
                </ArrowLink>
              </div>
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
          <Stagger
            stagger={0.22}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-3 lg:flex-nowrap"
          >
            {everyCall.map((c, i) => (
              <Item key={c.label} variant="fadeIn" className="flex shrink-0 items-center gap-1.5">
                <span className="flex items-center gap-1 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-ink-light shadow-soft">
                  <c.icon aria-hidden className="h-3 w-3 shrink-0 text-accent" />
                  {c.label}
                </span>
                {i < everyCall.length - 1 ? (
                  <ChevronRight aria-hidden className="h-3 w-3 shrink-0 text-ink-faint/60" />
                ) : null}
              </Item>
            ))}
          </Stagger>
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
        title="See How SkipDial Would Work"
        mutedTitle="for Your Business"
        body="Every business has unique call patterns and operational priorities. The best way to understand how SkipDial would function in your environment is to review your workflows and test real scenarios."
      />
    </>
  );
}
