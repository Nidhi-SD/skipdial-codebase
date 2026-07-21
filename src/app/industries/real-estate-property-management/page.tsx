import type { Metadata } from "next";
import {
  Clock,
  Ear,
  ClipboardList,
  CalendarCheck,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Real Estate & Property Management | SkipDial",
  description:
    "SkipDial provides AI call automation for real estate teams and property management companies, capturing inquiries, qualifying leads, scheduling tours, and syncing call data directly to your CRM.",
};

const data: IndustryData = {
  breadcrumbLabel: "Real Estate & Property Management",
  heroTitle: "AI Call Automation for Real Estate",
  heroMuted: "& Property Management",
  heroBody:
    "In real estate and property management, phone calls often represent immediate interest. A prospective buyer requesting a showing, a seller evaluating listing options, or a tenant reporting an issue expects a timely response. When calls are missed or follow-up is delayed, opportunities shift quickly to competitors. Speed to lead, structured intake, and consistent routing directly influence occupancy rates, listing conversions, and client satisfaction. SkipDial configures AI voice agents around your workflows so every inquiry is handled consistently and documented accurately.",
  breakdown: {
    title: "Where Call Handling Breaks Down in",
    muted: "Real Estate and Property Management",
    body: "Real estate teams and property managers often depend on a combination of agents, leasing staff, front-office coordinators, and answering services to handle calls. When lead volume increases due to marketing campaigns or new listings, response time and intake consistency often decline.",
    frictionLabel: "Common friction points",
    friction: [
      "New listing or buyer inquiries going to voicemail",
      "After-hours leasing calls that receive delayed follow-up",
      "Inconsistent intake for buyer or tenant qualification",
      "Manual note-taking that leads to incomplete records",
      "Overloaded agents missing calls while in meetings or showings",
    ],
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "Buyer and Tenant Qualification",
      "Showing and Tour Scheduling",
      "After-Hours Leasing Coverage",
      "Tenant Call Categorization",
      "CRM and Calendar Sync",
      "Outbound Follow-Up Automation",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Real Estate Call Comes In",
    cards: [
      {
        icon: Clock,
        title: "Answers Immediately (including after hours)",
        body: "Calls are answered without requiring agents to step out of meetings, showings, or inspections.",
      },
      {
        icon: Ear,
        title: "Identifies the Caller's Intent",
        body: "Buyer inquiry, seller consultation, leasing request, tenant issue, or general question.",
      },
      {
        icon: ClipboardList,
        title: "Captures Structured Qualification Data",
        body: "Timeline, budget range, property preferences, and financing status for buyers and renters. Property details and listing goals for sellers.",
      },
      {
        icon: CalendarCheck,
        title: "Schedules Showings or Consultations",
        body: "Appointments booked directly into connected calendars or routed to the appropriate team member.",
      },
      {
        icon: Database,
        title: "Categorizes and Logs Every Interaction",
        body: "Call summaries, lead status, and qualification data sync to your CRM so follow-up stays organized and measurable.",
      },
    ],
  },
  surge: {
    title: "Designed for Variable",
    muted: "Lead Volume",
    body: (
      <>
        Marketing campaigns, new listings, open houses, and seasonal leasing
        cycles can cause call volume to fluctuate significantly.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents scale automatically
        </strong>{" "}
        to handle multiple concurrent inquiries without degrading intake quality
        or response time, so growth in lead volume doesn&apos;t create new
        bottlenecks.
      </>
    ),
  },
  reserve: {
    title: "Improve Speed to Lead",
    muted: "Without Expanding Staff",
    intro:
      "In competitive markets, response time influences conversion rates. Agents are frequently in appointments, negotiations, or property tours when new calls arrive. AI call automation ensures inquiries are never left waiting.",
    helpsLabel: "AI call automation handles",
    helps: [
      "Immediate inquiry acknowledgment",
      "Consistent qualification questions",
      "Showing scheduling without delay",
      "Real-time CRM lead logging",
    ],
    focusLabel: "This allows your team to",
    focus: [
      "Close transactions",
      "Manage client relationships",
      "Negotiate and advise",
      "Focus on high-value follow-up",
    ],
  },
  builtAround: {
    title: "Built Around Your Listings,",
    muted: "Policies, and Systems",
    body: "Every real estate team and property management company operates differently. SkipDial agents are configured using your listing intake process, leasing criteria, FAQs, office policies, and live property data from your CRM so information provided to callers stays consistent with your approved messaging.",
    cards: [
      {
        title: "Listing Intake Process",
        body: "Buyer, seller, and renter workflows",
      },
      {
        title: "Leasing Criteria",
        body: "Qualification rules and boundaries",
      },
      {
        title: "Escalation Rules",
        body: "Urgent tenant issues and transfers",
      },
      {
        title: "CRM and Scheduling",
        body: "Tours and notes sync automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "real-estate",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial qualifies buyers, tenants, and sellers and books showings in real time.",
  },
  cta: {
    title: "See How SkipDial Supports Real Estate",
    muted: "& Property Management Teams",
    body: "Consistent intake, immediate response, and structured follow-up are critical in competitive markets. SkipDial provides AI call automation designed around the operational realities of brokerages and property management companies.",
  },
};

export default function RealEstatePage() {
  return <IndustryTemplate data={data} />;
}
