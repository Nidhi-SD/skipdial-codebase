import { AlertTriangle } from "@/components/icons/SystemIcons";
import { Container, SectionHead, Button } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/motion";
import { CallArrivalFrame, Magnetic } from "@/components/motion/entrances";
import {
  PageHero,
  Section,
  IconCardGrid,
  ChecklistBand,
  BulletList,
  SubCardGrid,
  HearItLive,
  CTABand,
  type IconCard,
} from "@/components/blocks";
import { ArrowLink } from "@/components/ui/primitives";
import { TryDemoCall } from "@/components/blocks/TryDemoCall";
import type { TranscriptLine } from "@/components/blocks/AudioPlayer";

/* Data-driven template shared by the three industry pages — same structural
   rhythm, industry-specific copy. */

export type IndustryData = {
  breadcrumbLabel: string;
  heroTitle: string;
  heroMuted: string;
  heroBody: string;
  breakdown: {
    title: string;
    muted: string;
    body: string;
    frictionLabel: string;
    friction: string[];
    closing?: string;
  };
  hearItLive?: { src: string; transcript: TranscriptLine[] };
  checklist: { heading: string; items: string[] };
  callCards: { title: string; muted: string; intro?: string; cards: IconCard[] };
  surge: {
    title: string;
    muted: string;
    body: React.ReactNode;
  };
  reserve: {
    title: string;
    muted: string;
    intro: string;
    helpsLabel: string;
    helps: string[];
    focusLabel: string;
    focus: string[];
    closing?: string;
  };
  builtAround: {
    title: string;
    muted: string;
    body: string;
    cards: { title: string; body: string }[];
  };
  demo: { defaultIndustry: string };
  cta: { title: string; muted: string; body: string };
};

export function IndustryTemplate({ data }: { data: IndustryData }) {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: data.breadcrumbLabel }]}
        title={data.heroTitle}
        mutedTitle={data.heroMuted}
        body={data.heroBody}
        ctas={
          <>
            <Magnetic>
              <Button href="#live-demo" size="lg" arrow>
                Try It Yourself
              </Button>
            </Magnetic>
            <Button href="#hear-it-live" variant="outline" size="lg">
              Hear a Sample
            </Button>
          </>
        }
        aside={
          <div id="live-demo">
            <CallArrivalFrame>
              <TryDemoCall defaultIndustry={data.demo.defaultIndustry} size="compact" />
            </CallArrivalFrame>
          </div>
        }
      />

      <HearItLive src={data.hearItLive?.src} transcript={data.hearItLive?.transcript} />

      {/* Where call handling breaks down */}
      <Section>
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="The problem"
                index="01"
                title={data.breakdown.title}
                mutedTitle={data.breakdown.muted}
              >
                {data.breakdown.body}
              </SectionHead>
            </div>
            <div>
              <Reveal variant="fadeUp">
                <p className="text-[13px] font-semibold text-accent">
                  {data.breakdown.frictionLabel}
                </p>
              </Reveal>
              <Stagger as="ul" className="mt-5 space-y-3">
                {data.breakdown.friction.map((f) => (
                  <Item
                    as="li"
                    key={f}
                    className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-soft"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warn/10 text-warn">
                      <AlertTriangle aria-hidden className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[14.5px] leading-relaxed text-ink-light">{f}</span>
                  </Item>
                ))}
              </Stagger>
              {data.breakdown.closing ? (
                <Reveal variant="fadeUp" delay={0.15}>
                  <p className="mt-5 rounded-xl bg-surface-alt p-4 text-[14px] font-medium leading-relaxed text-ink">
                    {data.breakdown.closing}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      {/* Checklist */}
      <Section>
        <Container>
          <ChecklistBand heading={data.checklist.heading} items={data.checklist.items} />
        </Container>
      </Section>

      {/* Call cards */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="On every call"
            index="02"
            title={data.callCards.title}
            mutedTitle={data.callCards.muted}
          >
            {data.callCards.intro}
          </SectionHead>
          <IconCardGrid cards={data.callCards.cards} columns={3} className="mt-12" />
        </Container>
      </Section>

      {/* Surge / scale band */}
      <Section tone="wash">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHead
              eyebrow="Scale"
              index="03"
              title={data.surge.title}
              mutedTitle={data.surge.muted}
              align="center"
            >
              {data.surge.body}
            </SectionHead>
          </div>
        </Container>
      </Section>

      {/* Reserve human judgment */}
      <Section>
        <Container>
          <SectionHead
            eyebrow="Division of labor"
            index="04"
            title={data.reserve.title}
            mutedTitle={data.reserve.muted}
          >
            {data.reserve.intro}
          </SectionHead>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal variant="fadeUp">
              <div className="h-full rounded-2xl border border-line bg-surface p-7 shadow-soft">
                <p className="text-[13px] font-semibold text-accent">
                  {data.reserve.helpsLabel}
                </p>
                <BulletList items={data.reserve.helps} className="mt-5" />
              </div>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.1}>
              <div className="h-full rounded-2xl border border-line bg-surface p-7 shadow-soft">
                <p className="text-[13px] font-semibold text-accent">
                  {data.reserve.focusLabel}
                </p>
                <BulletList items={data.reserve.focus} className="mt-5" />
              </div>
            </Reveal>
          </div>
          {data.reserve.closing ? (
            <Reveal variant="fadeIn" delay={0.15}>
              <p className="mt-6 text-center text-[14px] text-ink-light">
                {data.reserve.closing}
              </p>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {/* Built around */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="Configuration"
            index="05"
            title={data.builtAround.title}
            mutedTitle={data.builtAround.muted}
          >
            {data.builtAround.body}
          </SectionHead>
          <SubCardGrid cards={data.builtAround.cards} className="mt-12" />
          <Reveal variant="fadeUp" delay={0.15}>
            <ArrowLink href="/integrations" className="mt-8">
              Integrations
            </ArrowLink>
          </Reveal>
        </Container>
      </Section>

      <CTABand
        title={data.cta.title}
        mutedTitle={data.cta.muted}
        body={data.cta.body}
      />
    </>
  );
}
