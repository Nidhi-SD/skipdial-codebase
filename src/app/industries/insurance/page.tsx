import type { Metadata } from "next";
import {
  Clock,
  Ear,
  FileWarning,
  ShieldCheck,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Insurance Agencies | SkipDial",
  description:
    "SkipDial provides AI call automation for insurance agencies, handling quote requests, claims intake triage, and policy service calls with CRM-integrated workflows.",
};

const data: IndustryData = {
  breadcrumbLabel: "Insurance",
  heroTitle: "AI Call Automation for",
  heroMuted: "Insurance Agencies",
  heroBody:
    "Insurance agencies field three very different kinds of calls: new prospects requesting a quote, existing policyholders with a service question, and clients reporting a claim who need to be triaged and guided immediately. Each requires a different response, and each suffers when agents are on other calls or out of the office. A quote request left unanswered goes to the next agency in the search results. A claim call left waiting adds stress to an already difficult moment. SkipDial configures AI voice agents around your agency's workflows so every caller is identified, handled, and routed correctly.",
  breakdown: {
    title: "Where Call Handling Breaks Down at",
    muted: "Insurance Agencies",
    body: "Agents split time between active client meetings, underwriting follow-up, and renewals, leaving inconsistent phone coverage during the exact hours prospects and policyholders are calling.",
    frictionLabel: "Common friction points",
    friction: [
      "Quote requests going to voicemail during busy periods",
      "Claims calls with no consistent first-response triage",
      "Policy service questions competing with new-business calls",
      "Inconsistent intake on coverage type and policy details",
      "After-hours calls receiving no response until the next business day",
    ],
    closing:
      "In insurance, the agency that responds fastest to a quote request or a claims call usually keeps the relationship.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "Quote Request Intake",
      "Claims Triage & Guidance",
      "Policy Service Call Routing",
      "Structured Coverage Intake",
      "CRM and Agency Management Sync",
      "Renewal & Follow-Up Reminders",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Caller Reaches Your Agency",
    cards: [
      {
        icon: Clock,
        title: "Answers Immediately, Any Time",
        body: "Calls are picked up whether agents are in client meetings, on other lines, or the office is closed for the day.",
      },
      {
        icon: Ear,
        title: "Identifies the Purpose of the Call",
        body: "New quote request, existing policy question, billing matter, or a claim that needs to be reported.",
      },
      {
        icon: FileWarning,
        title: "Triages and Guides Claims Calls",
        body: "Claim details are captured and callers are walked through next steps using answers you've approved, with urgent matters escalated immediately.",
      },
      {
        icon: ShieldCheck,
        title: "Captures Structured Quote Details",
        body: "Coverage type, property or vehicle details, and current policy status are collected consistently for every quote request.",
      },
      {
        icon: Database,
        title: "Logs and Routes Every Call",
        body: "Quotes, service requests, and claims sync automatically to your agency management system or CRM for follow-up.",
      },
    ],
  },
  surge: {
    title: "Handles Renewal Season and",
    muted: "Storm-Driven Claims Spikes",
    body: (
      <>
        Renewal periods and severe weather events can drive sharp increases
        in both quote requests and claims calls at the same time.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents scale automatically
        </strong>
        , answering every caller in parallel so neither new business nor
        existing clients experience delays during your busiest periods.
      </>
    ),
  },
  reserve: {
    title: "Preserve Agent Time for",
    muted: "Coverage Advice and Retention",
    intro:
      "Licensed agents shouldn't spend their day on intake questions that can be structured automatically before a call ever reaches them.",
    helpsLabel: "AI call automation handles",
    helps: [
      "Quote request intake",
      "First-response claims triage",
      "Routine policy service questions",
      "Renewal reminder calls",
    ],
    focusLabel: "This allows your agents to focus on",
    focus: [
      "Advising clients on coverage",
      "Closing new policies",
      "Managing complex claims",
      "Retaining renewal business",
    ],
  },
  builtAround: {
    title: "Built Around Your Carriers,",
    muted: "Coverage Lines & FAQs",
    body: "Every agency writes different lines and works with different carriers. SkipDial agents are configured using your coverage lines, carrier appointments, claims guidance, and approved FAQs so callers get accurate information and every lead or claim is routed correctly.",
    cards: [
      {
        title: "Coverage Lines",
        body: "Auto, home, commercial, and life configured to your agency",
      },
      {
        title: "Carrier Appointments",
        body: "Routing aligned to the carriers you write with",
      },
      {
        title: "Claims Guidance",
        body: "Approved first-response talking points",
      },
      {
        title: "CRM and Agency Sync",
        body: "Quotes, service calls, and claims sync automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "insurance",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial handles a quote request and triages a claim.",
  },
  cta: {
    title: "See How SkipDial Supports",
    muted: "Insurance Agencies",
    body: "Fast response on quotes and claims keeps clients and grows the book. SkipDial delivers AI call automation built around the operational realities of insurance agencies.",
  },
};

export default function InsurancePage() {
  return <IndustryTemplate data={data} />;
}
