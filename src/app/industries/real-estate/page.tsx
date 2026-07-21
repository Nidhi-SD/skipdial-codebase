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
  title: "AI Call Automation for Real Estate Agents & Brokerages | SkipDial",
  description:
    "SkipDial provides AI call automation for real estate agents and brokerages, qualifying buyer and seller leads, scheduling showings, and syncing every call directly to your CRM.",
};

const data: IndustryData = {
  breadcrumbLabel: "Real Estate",
  heroTitle: "AI Call Automation for Real Estate",
  heroMuted: "Agents & Brokerages",
  heroBody:
    "For real estate agents and brokerages, an inbound call is rarely idle curiosity. It's a buyer ready to see a property, a seller weighing their options, or a past client asking about the market. Agents are frequently unreachable while showing homes, in negotiations, or at closings, and every call that slips to voicemail is a lead one search away from a competing agent. SkipDial configures AI voice agents around your listing process so buyer and seller inquiries are qualified, logged, and routed the moment they call.",
  breakdown: {
    title: "Where Call Handling Breaks Down for",
    muted: "Agents and Brokerages",
    body: "Most agents and brokerage front desks split attention between phones, showings, and in-person clients. When a listing goes live or a marketing campaign runs, inbound volume spikes and the gaps widen.",
    frictionLabel: "Common friction points",
    friction: [
      "Buyer inquiries on new listings going straight to voicemail",
      "Agents unable to answer while showing property or in closings",
      "Seller leads receiving inconsistent qualification questions",
      "Open house follow-up delayed by a day or more",
      "Referral and past-client calls with no structured logging",
    ],
    closing:
      "In competitive markets, the first agent to respond usually wins the relationship. Delay is the single biggest cost of manual call handling.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "Buyer & Seller Qualification",
      "Showing Scheduling",
      "Open House Follow-Up",
      "Listing FAQ Responses",
      "CRM and Calendar Sync",
      "Outbound Lead Follow-Up",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Buyer or Seller Calls",
    cards: [
      {
        icon: Clock,
        title: "Answers Every Call, Including After Hours",
        body: "Calls are picked up immediately whether an agent is at a showing, in a closing, or off the clock for the evening.",
      },
      {
        icon: Ear,
        title: "Identifies What the Caller Needs",
        body: "New buyer inquiry, seller looking for a listing consultation, showing request, or an existing client follow-up.",
      },
      {
        icon: ClipboardList,
        title: "Qualifies the Lead on the Spot",
        body: "Timeline, budget range, financing status, and property preferences for buyers. Property details and motivation for sellers.",
      },
      {
        icon: CalendarCheck,
        title: "Books the Showing or Consultation",
        body: "Appointments are scheduled directly into the assigned agent's calendar, or routed to whoever is next up.",
      },
      {
        icon: Database,
        title: "Logs Every Lead in Your CRM",
        body: "Qualification details and call summaries sync automatically, so nothing depends on an agent remembering to enter notes later.",
      },
    ],
  },
  surge: {
    title: "Built for Listing Launches",
    muted: "and Marketing Spikes",
    body: (
      <>
        New listings, price drops, open houses, and paid campaigns can send
        call volume up sharply for days at a time.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents scale automatically
        </strong>{" "}
        to answer every inbound caller in parallel, so a strong marketing push
        never turns into a wave of missed opportunities.
      </>
    ),
  },
  reserve: {
    title: "Protect Agent Time for",
    muted: "Showings and Negotiations",
    intro:
      "Agents generate revenue by being in front of buyers and sellers, not by re-qualifying every inbound call themselves.",
    helpsLabel: "AI call automation handles",
    helps: [
      "First-touch buyer and seller qualification",
      "Showing and consultation scheduling",
      "Open house follow-up calls",
      "Routine listing FAQ questions",
    ],
    focusLabel: "This allows agents to focus on",
    focus: [
      "Touring properties with buyers",
      "Winning listing appointments",
      "Negotiating offers",
      "Closing transactions",
    ],
  },
  builtAround: {
    title: "Built Around Your Listings,",
    muted: "Territory & CRM",
    body: "Every brokerage runs differently. SkipDial agents are configured using your active listing data, territory or agent-assignment rules, qualification criteria, and CRM so information given to callers stays accurate and every lead reaches the right agent.",
    cards: [
      {
        title: "Active Listings",
        body: "Synced property details for accurate answers",
      },
      {
        title: "Agent Assignment",
        body: "Routing by territory, rotation, or listing owner",
      },
      {
        title: "Qualification Rules",
        body: "Budget, timeline, and financing thresholds",
      },
      {
        title: "CRM and Scheduling",
        body: "Leads and showings sync automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "real-estate",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial qualifies a buyer or seller lead and books a showing.",
  },
  cta: {
    title: "See How SkipDial Supports",
    muted: "Real Estate Agents",
    body: "Speed to lead and consistent qualification decide who wins the listing or the buyer. SkipDial provides AI call automation designed around the operational realities of agents and brokerages.",
  },
};

export default function RealEstateAgentsPage() {
  return <IndustryTemplate data={data} />;
}
