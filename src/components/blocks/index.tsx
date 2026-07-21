import Link from "next/link";
import { Check, type LucideIcon } from "lucide-react";
import {
  Container,
  Eyebrow,
  SectionHead,
  Button,
  ArrowLink,
} from "@/components/ui/primitives";
import { BlurTitle, Reveal, Stagger, Item } from "@/components/motion";
import { RingPulse, PopChip, DrawLineV } from "@/components/motion/entrances";
import { GlobalNetworkField } from "@/components/motion/GlobalNetworkField";
import { AudioPlayer } from "@/components/blocks/AudioPlayer";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared page blocks — every marketing page composes from these.
   ──────────────────────────────────────────────────────────────────────────── */

/* ── PageHero — standard inner-page opener on the purple wash ──────────────── */

export function PageHero({
  eyebrow,
  breadcrumb,
  title,
  mutedTitle,
  body,
  ctas,
  children,
  center = false,
}: {
  eyebrow?: string;
  breadcrumb?: { href: string; label: string }[];
  title: string;
  mutedTitle?: string;
  body?: ReactNode;
  ctas?: ReactNode;
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <section className="hero-wash relative overflow-hidden pb-14 pt-28 md:pb-20 md:pt-36">
      <div
        aria-hidden
        className="dot-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)]"
      />
      <Container className={cn("relative", center && "text-center")}>
        {breadcrumb ? (
          <Reveal variant="fadeUp">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-ink-light">
                {breadcrumb.map((b, i) => (
                  <li key={b.href} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden>/</span>}
                    <Link href={b.href} className="transition-colors hover:text-accent">
                      {b.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        ) : eyebrow ? (
          <Reveal variant="fadeUp">
            <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
          </Reveal>
        ) : null}

        <BlurTitle
          as="h1"
          text={title}
          mutedText={mutedTitle}
          className={cn("max-w-4xl text-display-xl", center && "mx-auto")}
        />

        {body ? (
          <Reveal variant="fadeUp" delay={0.18}>
            <div
              className={cn(
                "mt-5 max-w-copy text-[16px] leading-relaxed text-ink-light",
                center && "mx-auto"
              )}
            >
              {body}
            </div>
          </Reveal>
        ) : null}

        {ctas ? (
          <Reveal variant="fadeUp" delay={0.28}>
            <div
              className={cn(
                "mt-8 flex flex-wrap items-center gap-3",
                center && "justify-center"
              )}
            >
              {ctas}
            </div>
          </Reveal>
        ) : null}

        {children}
      </Container>
    </section>
  );
}

/* ── Section — consistent vertical rhythm wrapper ──────────────────────────── */

export function Section({
  children,
  className,
  tone = "white",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "alt" | "wash";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        tone === "alt" && "border-y border-line bg-surface-alt/60",
        tone === "wash" && "bg-wash/60",
        className
      )}
    >
      {children}
    </section>
  );
}

/* ── IconCardGrid — “what happens on a call” cards ─────────────────────────── */

export type IconCard = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function IconCardGrid({
  cards,
  columns = 3,
  className,
}: {
  cards: IconCard[];
  columns?: 2 | 3 | 4 | 5;
  /** Accepted for backwards compatibility; index numbers are no longer shown. */
  numbered?: boolean;
  className?: string;
}) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  }[columns];

  return (
    <Stagger className={cn("grid gap-4", colClass, className)} as="ul">
      {cards.map((card) => (
        <Item
          as="li"
          key={card.title}
          className="group relative flex flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-accent-tint/50 text-accent transition-colors duration-300 group-hover:border-accent/30 group-hover:bg-accent group-hover:text-ink-inverse">
            <RingPulse />
            <card.icon aria-hidden className="h-[17px] w-[17px]" />
          </span>
          <h3 className="mt-4 text-[15.5px] font-semibold leading-snug">{card.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-light">{card.body}</p>
        </Item>
      ))}
    </Stagger>
  );
}

/* ── ChecklistBand — “What’s Included” chips in a hairline cell grid ───────── */

export function ChecklistBand({
  heading = "What's Included",
  items,
  className,
}: {
  heading?: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <Reveal variant="fadeUp">
        <p className="text-[13px] font-semibold text-accent">{heading}</p>
      </Reveal>
      <Stagger
        as="ul"
        stagger={0.05}
        className="mt-6 grid grid-cols-1 overflow-hidden rounded-2xl border border-line bg-surface sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map((item) => (
          <Item
            as="li"
            key={item}
            variant="fadeIn"
            className="flex items-center gap-3 border-b border-r-0 border-line p-5 transition-colors last:border-b-0 hover:bg-accent-tint/30 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-last-child(-n+4)]:border-b-0"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
              <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="text-[14px] font-semibold text-ink">{item}</span>
          </Item>
        ))}
      </Stagger>
    </div>
  );
}

/* ── NumberedSteps — implementation timeline ───────────────────────────────── */

export function NumberedSteps({
  steps,
  className,
}: {
  steps: { title: string; body?: string }[];
  className?: string;
}) {
  return (
    <Stagger as="ol" className={cn("relative flex flex-col gap-0", className)}>
      {steps.map((step, i) => (
        <Item
          as="li"
          key={step.title}
          className="group relative flex gap-5 pb-10 last:pb-0"
        >
          {/* connector — draws downward once the step's chip has landed */}
          {i < steps.length - 1 && (
            <DrawLineV className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-line" />
          )}
          <PopChip className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-[13px] font-semibold text-accent transition-colors duration-300 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-ink-inverse">
            {i + 1}
          </PopChip>
          <div className="pt-1.5">
            <h3 className="text-[16px] font-semibold leading-snug">{step.title}</h3>
            {step.body ? (
              <p className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-ink-light">
                {step.body}
              </p>
            ) : null}
          </div>
        </Item>
      ))}
    </Stagger>
  );
}

/* ── SubCardGrid — compact 4-up config cards ───────────────────────────────── */

export function SubCardGrid({
  cards,
  className,
}: {
  cards: { title: string; body: string }[];
  className?: string;
}) {
  return (
    <Stagger className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {cards.map((c) => (
        <Item
          key={c.title}
          className="rounded-2xl border border-line bg-surface p-5 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card"
        >
          <h3 className="text-[15px] font-semibold">{c.title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-light">{c.body}</p>
        </Item>
      ))}
    </Stagger>
  );
}

/* ── BulletList — accent-check bullets ─────────────────────────────────────── */

export function BulletList({
  items,
  className,
  tone = "light",
}: {
  items: string[];
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Stagger as="ul" stagger={0.05} className={cn("space-y-3", className)}>
      {items.map((item) => (
        <Item as="li" key={item} variant="fadeUp" className="flex items-start gap-3">
          <PopChip
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              tone === "dark" ? "bg-accent-soft/20 text-accent-soft" : "bg-accent-tint text-accent"
            )}
          >
            <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
          </PopChip>
          <span
            className={cn(
              "text-[15px] leading-relaxed",
              tone === "dark" ? "text-ink-inverse/80" : "text-ink-light"
            )}
          >
            {item}
          </span>
        </Item>
      ))}
    </Stagger>
  );
}

/* ── HearItLive — repeating audio-sample block ─────────────────────────────── */

export function HearItLive({
  subtext = "Hear how SkipDial handles a real inbound call for your industry.",
  showCta = false,
}: {
  subtext?: string;
  showCta?: boolean;
}) {
  return (
    <Section tone="alt">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHead eyebrow="Listen in" title="Hear it Live!" className="max-w-md">
            {subtext}
          </SectionHead>
          <Reveal variant="expandX">
            <div className="flex flex-col gap-6">
              <AudioPlayer src="/audio/real-estate-call-recording.wav" />
              {showCta ? (
                <div>
                  <Button href="/request-a-free-demo" arrow>
                    Get a Free Demo
                  </Button>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ── CTABand — light closing band with brand wash ──────────────────────────── */

export function CTABand({
  title,
  mutedTitle,
  body,
  ctaLabel = "Get a Free Demo",
  ctaHref = "/request-a-free-demo",
  smallPrint,
  variant = "dark",
}: {
  title: string;
  mutedTitle?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  smallPrint?: string;
  /** "dark" is retained for backwards compat but now renders the same light
   *  lavender band as everything else. "bold" keeps the purple full-bleed. */
  variant?: "dark" | "bold";
}) {
  const isBold = variant === "bold";
  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        isBold ? "band-gradient-bold text-ink-inverse" : "band-wash-dark text-ink"
      )}
    >
      {isBold ? (
        <div
          aria-hidden
          className="grid-overlay-light absolute inset-0 opacity-70 [mask-image:radial-gradient(70%_75%_at_50%_35%,black,transparent)]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 [mask-image:radial-gradient(85%_80%_at_50%_35%,black,transparent)]"
        >
          <GlobalNetworkField />
        </div>
      )}
      <Container className="relative text-center">
        <BlurTitle
          as="h2"
          text={title}
          mutedText={mutedTitle}
          className={cn(
            "mx-auto max-w-3xl text-display-lg",
            isBold && "text-ink-inverse"
          )}
        />
        {body ? (
          <Reveal variant="fadeUp" delay={0.15}>
            <p
              className={cn(
                "mx-auto mt-5 max-w-copy text-[16px] leading-relaxed",
                isBold ? "text-ink-inverse/70" : "text-ink-light"
              )}
            >
              {body}
            </p>
          </Reveal>
        ) : null}
        <Reveal variant="fadeUp" delay={0.25}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              href={ctaHref}
              variant={isBold ? "inverse" : "primary"}
              size="lg"
              arrow
            >
              {ctaLabel}
            </Button>
          </div>
          {smallPrint ? (
            <p
              className={cn(
                "mt-5 text-[13px]",
                isBold ? "text-ink-inverse/45" : "text-ink-faint"
              )}
            >
              {smallPrint}
            </p>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}

/* ── SplitSection — heading column + content column ────────────────────────── */

export function SplitSection({
  eyebrow,
  index,
  title,
  mutedTitle,
  intro,
  link,
  children,
  reverse = false,
  tone = "white",
}: {
  eyebrow?: string;
  index?: string;
  title: string;
  mutedTitle?: string;
  intro?: ReactNode;
  link?: { href: string; label: string };
  children: ReactNode;
  reverse?: boolean;
  tone?: "white" | "alt";
}) {
  return (
    <Section tone={tone}>
      <Container>
        <div
          className={cn(
            "grid items-start gap-12 lg:grid-cols-2 lg:gap-16",
            reverse && "lg:[&>*:first-child]:order-2"
          )}
        >
          <div className="lg:sticky lg:top-28">
            <SectionHead
              eyebrow={eyebrow}
              index={index}
              title={title}
              mutedTitle={mutedTitle}
            >
              {intro}
            </SectionHead>
            {link ? (
              <Reveal variant="fadeUp" delay={0.2}>
                <ArrowLink href={link.href} className="mt-6">
                  {link.label}
                </ArrowLink>
              </Reveal>
            ) : null}
          </div>
          <div>{children}</div>
        </div>
      </Container>
    </Section>
  );
}
