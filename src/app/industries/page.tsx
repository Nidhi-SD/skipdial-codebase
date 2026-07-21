import type { Metadata } from "next";
import {
  Wrench,
  Building2,
  Briefcase,
  PhoneMissed,
  ClipboardX,
  MoonStar,
  FileWarning,
  IterationCcw,
  Home,
  Stethoscope,
  Gavel,
  Wind,
  Warehouse,
  Activity,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container, SectionHead, Button, ArrowLink } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/motion";
import { CallArrivalFrame } from "@/components/motion/entrances";
import { PageHero, Section, BulletList, CTABand } from "@/components/blocks";
import { TryDemoCall } from "@/components/blocks/TryDemoCall";

export const metadata: Metadata = {
  title:
    "AI Call Handling for Home Services, Real Estate & Professional Offices | SkipDial",
  description:
    "SkipDial provides AI call automation for home services, real estate, property management, and professional offices, delivering consistent intake, follow-up, and CRM integration.",
};

type IndustryCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  helpsLabel: string;
  helps: string[];
  closing: string;
  href: string;
  linkLabel: string;
};

const industryCards: IndustryCard[] = [
  {
    icon: Wrench,
    title: "Home Services",
    body: "For HVAC, plumbing, roofing, electrical, and restoration contractors, inbound calls signal immediate demand. A missed call during a storm event or peak period isn't an inconvenience. It's a lost job, especially when a dozen competitors are one dial away.",
    helpsLabel: "SkipDial helps home service businesses",
    helps: [
      "Answer calls 24/7",
      "Distinguish emergency vs. standard requests",
      "Capture complete service details",
      "Book appointments directly",
      "Route urgent calls instantly",
    ],
    closing:
      "Consistent intake ensures dispatch teams receive clear, structured information every time.",
    href: "/industries/home-services",
    linkLabel: "All Home Services",
  },
  {
    icon: Building2,
    title: "Real Estate & Property Management",
    body: "In real estate and property management, speed to lead matters. Delayed responses can mean lost listings, missed showings, or unleased units.",
    helpsLabel: "SkipDial supports",
    helps: [
      "Lead qualification for buyers and sellers",
      "Showing and tour scheduling",
      "After-hours leasing inquiries",
      "Tenant call categorization",
      "Automated follow-up on new inquiries",
    ],
    closing:
      "AI call agents ensure that inbound interest is captured immediately and outbound follow-up remains consistent.",
    href: "/industries/real-estate-property-management",
    linkLabel: "All Real Estate Services",
  },
  {
    icon: Briefcase,
    title: "Professional & Service Offices",
    body: "Law firms, insurance agencies, healthcare practices, accounting firms, and consulting offices share a common requirement: structured intake and accurate routing. Incomplete notes, rushed conversations, and voicemail backlogs create friction that affects both client experience and internal operations.",
    helpsLabel: "SkipDial enables",
    helps: [
      "Consistent, confidential intake workflows",
      "FAQ responses from approved knowledge bases",
      "Call categorization by practice area or service type",
      "HIPAA-aligned configurations and secure data handling",
      "CRM and scheduling integration",
    ],
    closing:
      "Callers are acknowledged promptly, and every interaction is documented to meet confidentiality and compliance requirements.",
    href: "/industries/professional-offices",
    linkLabel: "All Professional Services",
  },
];

const gaps = [
  { icon: PhoneMissed, label: "Missed demand" },
  { icon: ClipboardX, label: "Inconsistent intake" },
  { icon: MoonStar, label: "After-hours gaps" },
  { icon: FileWarning, label: "Manual documentation" },
  { icon: IterationCcw, label: "Follow-up breakdowns" },
];

type Vertical = { href: string; label: string; icon: LucideIcon };

const verticals: Vertical[] = [
  { href: "/industries/real-estate", label: "Real Estate", icon: Home },
  { href: "/industries/dentists", label: "Dentists", icon: Stethoscope },
  { href: "/industries/injury-lawyers", label: "Injury Lawyers", icon: Gavel },
  { href: "/industries/hvac", label: "HVAC", icon: Wind },
  { href: "/industries/roofing", label: "Roofing", icon: Warehouse },
  {
    href: "/industries/property-management",
    label: "Property Management",
    icon: Building2,
  },
  { href: "/industries/chiropractors", label: "Chiropractors", icon: Activity },
  { href: "/industries/insurance", label: "Insurance", icon: ShieldCheck },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="AI Call Automation Built for Businesses"
        mutedTitle="That Depend on Phone Calls"
        body="Not all industries rely on phone calls the same way. In some sectors, calls represent urgent service needs. In others, they are the first step in a high-value client relationship. SkipDial configures AI call agents around your specific call patterns, intake requirements, and follow-up workflows."
        ctas={
          <Button href="/request-a-free-demo" size="lg" arrow>
            Get a Free Demo
          </Button>
        }
      />

      {/* Industry cards */}
      <Section>
        <Container>
          <div className="space-y-8">
            {industryCards.map((card, i) => (
              <Reveal key={card.title} variant="fadeUp">
                <article className="group grid gap-8 rounded-3xl border border-line bg-surface p-8 shadow-soft transition-all duration-300 ease-out-expo hover:border-accent/25 hover:shadow-lift md:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-accent-tint/50 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-ink-inverse">
                        <card.icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[12px] font-medium text-ink-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="mt-5 text-display-md font-bold">{card.title}</h2>
                    <p className="mt-4 text-[15.5px] leading-relaxed text-ink-light">
                      {card.body}
                    </p>
                    <p className="mt-5 hidden text-[14px] font-medium text-ink lg:block">
                      {card.closing}
                    </p>
                    <ArrowLink href={card.href} className="mt-6">
                      {card.linkLabel}
                    </ArrowLink>
                  </div>
                  <div className="rounded-2xl border border-line bg-surface-alt/50 p-6">
                    <p className="text-[13px] font-semibold text-accent">
                      {card.helpsLabel}
                    </p>
                    <BulletList items={card.helps} className="mt-4" />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Quick links to the 8 specific verticals */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="Browse by vertical"
            index="02"
            title="Or Go Straight to"
            mutedTitle="Your Specific Industry"
            align="center"
            className="mx-auto"
          >
            Each vertical below has its own dedicated breakdown of common call
            patterns, intake requirements, and configuration options.
          </SectionHead>
          <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {verticals.map((v) => (
              <Item key={v.href} variant="fadeUp">
                <ArrowLink
                  href={v.href}
                  className="flex h-full items-center gap-3 rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card [&>svg]:ml-auto"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-accent-tint/50 text-accent">
                    <v.icon aria-hidden className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[14.5px] font-semibold text-ink">
                    {v.label}
                  </span>
                </ArrowLink>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Gap chips */}
      <Section tone="alt">
        <Container>
          <SectionHead
            eyebrow="Common ground"
            index="04"
            title="Built Around Your Industry's"
            mutedTitle="Call Patterns"
            align="center"
            className="mx-auto"
          >
            While call types differ across industries, the underlying challenges
            are similar. SkipDial addresses these gaps using configured
            workflows, structured qualification, and system integration tailored
            to your business model.
          </SectionHead>
          <Stagger className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {gaps.map((gap) => (
              <Item
                key={gap.label}
                variant="scaleIn"
                className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-2.5 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card"
              >
                <gap.icon aria-hidden className="h-4 w-4 text-accent" />
                <span className="text-[14px] font-semibold text-ink">{gap.label}</span>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Live demo call widget */}
      <Section id="live-demo">
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

      <CTABand
        title="See How SkipDial Would Work"
        mutedTitle="in Your Industry"
        body="Every industry has unique call dynamics. SkipDial adapts to them without adding operational complexity."
      />
    </>
  );
}
