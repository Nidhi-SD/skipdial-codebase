import type { Metadata } from "next";
import { PhoneMissed, Users, Clock, FileText, Sparkles } from "lucide-react";
import { Container, SectionHead, Button, Eyebrow } from "@/components/ui/primitives";
import { BlurTitle, Reveal, Stagger, Item } from "@/components/motion";
import { CallArrivalFrame, HeroBackdrop, Magnetic, ParallaxDrift } from "@/components/motion/entrances";
import {
  Section,
  IconCardGrid,
  BulletList,
  CTABand,
} from "@/components/blocks";
import { ScrollTimeline } from "@/components/blocks/ScrollTimeline";
import { VoiceAgentSimulator } from "@/components/blocks/VoiceAgentSimulator";
import { WorkflowBeam } from "@/components/blocks/WorkflowBeam";
import { FeatureBento } from "@/components/blocks/FeatureBento";
import { ProductTabs } from "@/components/blocks/ProductTabs";
import { DashboardCard } from "@/components/blocks/DashboardCard";
import { AudioPlayer } from "@/components/blocks/AudioPlayer";
import { TryDemoCall } from "@/components/blocks/TryDemoCall";

export const metadata: Metadata = {
  title: "AI Call Agents for Inbound and Outbound Calls | SkipDial",
  description:
    "SkipDial uses AI call agents to handle inbound and outbound calls 24/7, qualify leads, book appointments, and sync call data directly to your CRM for full visibility and follow-up.",
};

const painCards = [
  {
    icon: PhoneMissed,
    title: "Missed Calls = Lost Revenue",
    body: "Every unanswered ring is a customer choosing the next provider on their list. Demand existed. It just went unmet.",
  },
  {
    icon: Users,
    title: "Front Desk Bottlenecks = Inconsistent Intake",
    body: "Intake quality shouldn't depend on who picks up. Busy staff skip questions, and details slip through.",
  },
  {
    icon: Clock,
    title: "Limited Office Hours = Uncaptured Demand",
    body: "Callers don't wait for business hours. After-hours voicemail is where high-intent leads go cold.",
  },
  {
    icon: FileText,
    title: "Manual Call Notes = Poor Visibility",
    body: "Sticky notes and memory aren't reporting. Without structured data, follow-up discipline breaks down.",
  },
];

const solveSteps = [
  {
    title: "Connect Your System",
    body: "SkipDial connects to your phone system, CRM, and scheduling tools, so it can be integrated cleanly without disrupting your existing workflow.",
  },
  {
    title: "Let AI Handle Calls",
    body: "AI voice agents answer calls 24/7, engage callers naturally, and guide conversations based on your configured workflows.",
  },
  {
    title: "Automatically Route + Qualify Leads",
    body: "Every call is analyzed in real time. Qualified leads are routed with context so your team knows exactly who is calling and why.",
  },
  {
    title: "Integrate With Your CRM",
    body: "Call summaries, intake data, outcomes, and timestamps sync automatically to your CRM for tracking and follow-up.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── 1 · Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-wash relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32">
        {/* Backdrop planes separate on scroll: grid dissolves, orb sinks, glow lifts */}
        <HeroBackdrop />
        <Container className="relative text-center">
          <Reveal variant="fadeUp">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pl-1 pr-3.5 text-[13px] font-medium text-ink-light backdrop-blur-sm">
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-ink-inverse">
                24/7
              </span>
              AI Call Handling
            </span>
          </Reveal>

          <BlurTitle
            as="h1"
            text="Automate Your Calls With AI Agents"
            mutedText="That Never Miss an Opportunity."
            delay={0.1}
            className="hero-title-brand mx-auto mt-7 max-w-4xl text-balance text-[clamp(2.6rem,5.6vw,4.1rem)] font-extrabold leading-[1] tracking-[-0.04em]"
          />

          <Reveal variant="fadeUp" delay={0.3}>
            <p className="mx-auto mt-6 max-w-[34rem] text-balance text-[16px] leading-relaxed text-ink-light">
              AI agents that answer every call, qualify every caller, and sync
              every conversation to your CRM. Natural speech, no menus, no hold
              queues.
            </p>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.4}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <Button href="/request-a-free-demo" size="lg" arrow>
                  Get a Free Demo
                </Button>
              </Magnetic>
              <Button href="#sample" variant="outline" size="lg">
                Hear a Sample
              </Button>
            </div>
          </Reveal>
        </Container>

        {/* Live AI voice-agent simulator — breaks past the text column for a
            dominant hero visual, pointer parallax adds ambient depth */}
        <Reveal variant="scaleIn" delay={0.5} className="mt-14 text-left md:mt-16">
          <div className="mx-auto w-full max-w-[80rem] px-5 md:px-8">
            <ParallaxDrift>
              <VoiceAgentSimulator />
            </ParallaxDrift>
          </div>
        </Reveal>
      </section>

      {/* ── 2 · Pain points ──────────────────────────────────────────────── */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="The problem"
            title="Missed Calls Are Costing You"
            mutedTitle="More Than You Think"
          >
            Phone-driven businesses lose revenue in quiet, invisible ways: a
            ring that went one too long, a voicemail returned a day late, a
            detail nobody wrote down.
          </SectionHead>
          <IconCardGrid cards={painCards} columns={4} className="mt-12" />
        </Container>
      </Section>

      {/* ── 3 · How we solve that ────────────────────────────────────────── */}
      <Section tone="alt">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="Automate your workflows"
                title="How We Solve That"
              >
                SkipDial replaces inconsistent call handling with structured,
                always-on AI agents that answer every call, collect the right
                information, and route conversations based on your business
                rules.
              </SectionHead>
            </div>
            <ScrollTimeline steps={solveSteps} />
          </div>

          {/* Live routing visualized — beam travels inbound → agent → CRM */}
          <WorkflowBeam className="mt-16 md:mt-20" />
        </Container>
      </Section>

      {/* ── 5 · Workflow insights ────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            <div>
              <SectionHead
                eyebrow="Visibility"
                title="Insights That Fit Seamlessly"
                mutedTitle="Into Your Workflow"
              >
                SkipDial turns every call into structured data. Instead of
                relying on memory, sticky notes, or voicemail callbacks, your
                team gets organized insight delivered directly into the tools
                they already use.
              </SectionHead>
              <BulletList
                className="mt-8"
                items={[
                  "24/7 Call Answering",
                  "Real-Time Lead Qualification",
                  "CRM Sync & Follow-Up",
                  "Multi-Language Support",
                  "Built for High-Volume Call Teams",
                ]}
              />
            </div>
            <Reveal variant="wipe">
              <DashboardCard />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── 6 · Platform — light lavender bento + call-motion tabs ────────── */}
      <section
        id="platform"
        className="band-lavender relative overflow-hidden py-20 md:py-28"
      >
        <div
          aria-hidden
          className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]"
        />
        <Container className="relative">
          <SectionHead
            eyebrow="Platform"
            title="Features That Set Us Apart"
            align="center"
            className="mx-auto"
          >
            One agent, configured around your business, with the coverage and
            discipline of a full front office.
          </SectionHead>
          <FeatureBento className="mt-12" />

          <div className="mx-auto mt-24 max-w-2xl text-center">
            <Reveal variant="fadeUp">
              <Eyebrow>Choose your motion</Eyebrow>
            </Reveal>
            <BlurTitle
              as="h3"
              text="One Platform,"
              mutedText="Every Call Motion"
              className="mt-4 text-display-md text-ink"
            />
          </div>
          <ProductTabs className="mt-10" />
        </Container>
      </section>

      {/* ── 7 · Audio sample ─────────────────────────────────────────────── */}
      <Section id="sample">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <SectionHead
              eyebrow="Listen in"
              title="Hear SkipDial in Action"
            >
              Listen to how SkipDial answers calls, gathers information,
              qualifies leads, and routes conversations using structured,
              natural dialogue{" "}
              <strong className="font-semibold text-ink">
                designed around your business rules.
              </strong>
            </SectionHead>
            <Reveal variant="expandX">
              <AudioPlayer src="/audio/real-estate-call-recording.wav" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── 8 · Live demo call widget ────────────────────────────────────── */}
      <Section tone="alt" id="live-demo">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
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
                {["Structured intake", "Appointment booking", "Call routing"].map(
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

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <CTABand
        title="The next call your business misses"
        mutedTitle="will cost you a customer."
        body="Consistent coverage, reliable intake, and disciplined follow-up, without adding headcount."
        smallPrint="Free 30-minute demo · configured around your call workflows"
      />
    </>
  );
}
