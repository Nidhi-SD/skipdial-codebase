import type { Metadata } from "next";
import type { CSSProperties, SVGProps } from "react";
import { ChevronDown, Sparkles, PhoneOff, Users, Clock, EyeOff } from "lucide-react";
import { Container, SectionHead, Button, Eyebrow } from "@/components/ui/primitives";
import { BlurTitle, Reveal, Stagger, Item } from "@/components/motion";
import { CallArrivalFrame, Magnetic, ParallaxDrift } from "@/components/motion/entrances";
import {
  Section,
  IconCardGrid,
  LostRevenueCalculator,
  BulletList,
  CTABand,
} from "@/components/blocks";
import { ScrollTimeline } from "@/components/blocks/ScrollTimeline";
import { VoiceAgentSimulator } from "@/components/blocks/VoiceAgentSimulator";
import { WorkflowBeam } from "@/components/blocks/WorkflowBeam";
import { FeatureBento } from "@/components/blocks/FeatureBento";
import { ProductTabs } from "@/components/blocks/ProductTabs";
import { DashboardCard } from "@/components/blocks/DashboardCard";
import { FullPageScrollBgCanvas } from "@/components/FullPageScrollBgCanvas";
import { AudioPlayer } from "@/components/blocks/AudioPlayer";
import { TryDemoCall } from "@/components/blocks/TryDemoCall";

export const metadata: Metadata = {
  title: "AI Call Agents for Inbound and Outbound Calls | SkipDial",
  description:
    "SkipDial uses AI call agents to handle inbound and outbound calls 24/7, qualify leads, book appointments, and sync call data directly to your CRM for full visibility and follow-up.",
};

const painCards = [
  {
    icon: PhoneOff,
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
    body: "Callers don't wait for business hours. After hours voicemail is where high intent leads go cold.",
  },
  {
    icon: EyeOff,
    title: "Manual Call Notes = Poor Visibility",
    body: "Sticky notes and memory aren't reporting. Without structured data, follow up discipline breaks down.",
  },
];

const solveSteps = [
  {
    step: "01",
    title: "Instant Answer",
    body: "SkipDial picks up within rings, 24/7/365, eliminating hold times and missed opportunity.",
  },
  {
    step: "02",
    title: "Structured Information Gathering",
    body: "Agents follow your configured intake scripts to collect exact caller info, symptoms, project specs, or inquiry details.",
  },
  {
    step: "03",
    title: "Intelligent Qualification & Booking",
    body: "Qualified leads are booked directly on your calendar, while urgent calls escalate according to your protocol.",
  },
  {
    step: "04",
    title: "Automated CRM & Team Sync",
    body: "Call summaries, transcripts, and structured fields flow straight into your CRM and notification channels.",
  },
];

export default function Home() {
  return (
    <>
      {/* Scroll-driven frame background behind the whole page */}
      <FullPageScrollBgCanvas />

      {/* ── 1 · Hero section — fills the viewport on load; the next section
             only reveals itself once the user scrolls ───────────────────── */}
      <section className="relative flex min-h-dvh flex-col overflow-hidden pt-24 pb-10 md:pt-28 md:pb-14">
        {/* Readability scrim — the scroll canvas runs full-bleed behind the
            page, so the headline column gets its own soft white falloff to
            keep copy legible without hiding the animation. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(72%_68%_at_50%_46%,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.86)_42%,rgba(255,255,255,0.6)_68%,transparent_88%)]"
        />

        <Container className="relative flex flex-1 flex-col items-center justify-center text-center">
          <Reveal variant="fadeUp">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pl-1 pr-3.5 text-[13px] font-medium text-ink-light backdrop-blur-sm">
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-ink-inverse">
                24/7
              </span>
              Autonomous voice agents for inbound &amp; outbound
            </span>
          </Reveal>

          <BlurTitle
            as="h1"
            text="Skip the Dial."
            mutedText="Not the Call."
            className="hero-title-brand mx-auto mt-6 max-w-4xl text-display-xl text-ink"
          />

          <Reveal variant="fadeUp" delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-[19px] leading-relaxed text-ink-light">
              AI voice agents that answer calls, book appointments, and sync your CRM 24/7.
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

          {/* Trust line — unified style, concise copy */}
          <Reveal variant="fadeUp" delay={0.5}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[14.5px] font-medium text-ink-light">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span className="trust-shimmer">Answering calls 24/7/365</span>
              </span>
              <span className="flex items-center gap-2" style={{ "--pulse-delay": "0.8s" } as CSSProperties}>
                <svg className="h-4 w-4 text-accent/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span className="trust-shimmer">Inbound + outbound in one agent</span>
              </span>
              <span className="flex items-center gap-2" style={{ "--pulse-delay": "1.6s" } as CSSProperties}>
                <svg className="h-4 w-4 text-accent/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span className="trust-shimmer">Syncs to your CRM automatically</span>
              </span>
            </div>
          </Reveal>
        </Container>

        {/* Scroll cue — signals there's more below and doubles as a
            smooth-scroll shortcut into the next section. */}
        <a
          href="#live-call"
          aria-label="Scroll to next section"
          className="scroll-hint absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-ink-light transition-colors hover:text-ink md:bottom-8"
        >
          <ChevronDown aria-hidden className="h-5 w-5" />
        </a>
      </section>

      {/* ── 2 · Live call simulator — its own showcase, fully in frame ───── */}
      <Section id="live-call">
        <Container>
          <SectionHead
            eyebrow="See it live"
            title="Watch a Real Call,"
            mutedTitle="Handled End to End"
            align="center"
            className="mx-auto"
          >
            This is an after hours HVAC emergency. Grace answers on the first
            ring, captures the issue, verifies the address, and dispatches a
            technician while the caller is still on the line.
          </SectionHead>
        </Container>

        {/* Breaks past the text column for a dominant product visual */}
        <Reveal variant="scaleIn" className="mt-12 text-left md:mt-14">
          <div className="mx-auto w-full max-w-[80rem] px-5 md:px-8">
            <ParallaxDrift>
              <VoiceAgentSimulator />
            </ParallaxDrift>
          </div>
        </Reveal>
      </Section>

      {/* ── 3 · Pain points ──────────────────────────────────────────────── */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="The problem"
            title="Missed Calls Are Costing You"
            mutedTitle="More Than You Think"
          >
            Revenue doesn't disappear all at once. It leaks out quietly.
            A ring that went one too long, a voicemail returned a day late,
            a detail nobody wrote down.
          </SectionHead>
          <IconCardGrid cards={painCards} columns={4} className="mt-12" />
          
          <Reveal variant="fadeUp" delay={0.2}>
            <LostRevenueCalculator className="mx-auto mt-12 w-full max-w-5xl" />
          </Reveal>
        </Container>
      </Section>

      {/* ── 4 · How we solve that ────────────────────────────────────────── */}
      <Section tone="alt">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
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
                  "Real Time Lead Qualification",
                  "CRM Sync & Follow Up",
                  "Multi Language Support",
                  "Built for High Volume Call Teams",
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
        body="Consistent coverage, reliable intake, and disciplined follow up, without adding headcount."
        smallPrint="Free 30 minute demo · configured around your call workflows"
      />
    </>
  );
}
