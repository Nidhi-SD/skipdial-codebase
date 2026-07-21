import type { Metadata } from "next";
import {
  Clock,
  AlarmClock,
  ClipboardList,
  Lock,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Personal Injury Law Firms | SkipDial",
  description:
    "SkipDial provides AI call automation for personal injury law firms, handling new-case intake, urgency triage, confidential documentation, and disciplined callback scheduling.",
};

const data: IndustryData = {
  breadcrumbLabel: "Injury Lawyers",
  heroTitle: "AI Call Automation for",
  heroMuted: "Personal Injury Law Firms",
  heroBody:
    "A new-case call to a personal injury firm is often made within hours of an accident, from a hospital bed, a tow yard, or a parked car on the side of the road. The caller is comparing firms in real time, and the first attorney to respond with a clear, confident intake process often wins the case. Missed calls, inconsistent intake, or a slow callback don't just lose a lead, they lose a client to the next firm on the search results page. SkipDial configures AI voice agents around your intake criteria so every caller is triaged, documented, and routed without delay.",
  breakdown: {
    title: "Where Call Handling Breaks Down at",
    muted: "Injury Law Firms",
    body: "Intake staff and attorneys are often in depositions, mediations, or court when new-case calls come in. Marketing spend drives volume that front-desk capacity can't always absorb consistently.",
    frictionLabel: "Common friction points",
    friction: [
      "New-case calls arriving after hours or on weekends with no coverage",
      "Inconsistent intake questions across different staff members",
      "High-value callers waiting hours for a callback",
      "Case details recorded informally instead of documented consistently",
      "Non-viable inquiries consuming time attorneys need for active cases",
    ],
    closing:
      "In personal injury, response time and intake consistency directly affect case volume and case quality.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "New-Case Intake Workflows",
      "Urgency & Injury Triage",
      "Confidential Documentation",
      "Callback Scheduling Discipline",
      "CRM and Case Management Sync",
      "Non-Viable Call Filtering",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Prospective Client Calls",
    cards: [
      {
        icon: Clock,
        title: "Answers Immediately, Any Hour",
        body: "New-case calls are picked up around the clock instead of routing to voicemail nights and weekends.",
      },
      {
        icon: AlarmClock,
        title: "Triages Urgency First",
        body: "Injury severity, treatment status, and statute-of-limitations timing are identified before anything else.",
      },
      {
        icon: ClipboardList,
        title: "Runs a Structured Intake",
        body: "Accident details, involved parties, insurance information, and injury description are captured in a consistent, defined order.",
      },
      {
        icon: Lock,
        title: "Handles Sensitive Details Carefully",
        body: "Calls are documented within approved boundaries, with escalation to staff for anything requiring legal judgment.",
      },
      {
        icon: Database,
        title: "Logs and Routes for Fast Callback",
        body: "Complete intake summaries sync to your CRM or case management system, flagged by urgency for immediate attorney follow-up.",
      },
    ],
  },
  surge: {
    title: "Absorbs Marketing-Driven",
    muted: "Call Surges",
    body: (
      <>
        Paid advertising, billboard campaigns, and referral spikes can drive
        a sudden wave of new-case calls.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents scale automatically
        </strong>{" "}
        to answer every caller in parallel, so a strong marketing period
        never results in leads lost to slow response.
      </>
    ),
  },
  reserve: {
    title: "Preserve Attorney Time for",
    muted: "Case Strategy, Not Screening",
    intro:
      "Attorneys and paralegals shouldn't spend billable hours re-explaining intake questions to callers who could have been triaged automatically.",
    helpsLabel: "AI call automation handles",
    helps: [
      "Initial urgency and viability triage",
      "Structured accident intake",
      "Callback scheduling",
      "Filtering non-viable inquiries",
    ],
    focusLabel: "This allows your team to focus on",
    focus: [
      "Evaluating case strategy",
      "Client communication on active matters",
      "Negotiations and litigation prep",
      "High-value case development",
    ],
  },
  builtAround: {
    title: "Built Around Your Intake Criteria,",
    muted: "Practice Areas & Systems",
    body: "Every firm defines its own case criteria and escalation standards. SkipDial agents are configured using your practice areas, intake questions, viability thresholds, and case management system so every caller is documented consistently and routed to the right person fast.",
    cards: [
      {
        title: "Practice Areas",
        body: "Auto accidents, workplace injury, premises liability, and more",
      },
      {
        title: "Viability Thresholds",
        body: "Case criteria your firm actually pursues",
      },
      {
        title: "Escalation Rules",
        body: "Immediate attorney routing for urgent matters",
      },
      {
        title: "Case Management Sync",
        body: "Intake summaries logged automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "injury-lawyers",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial triages urgency and runs a new-case intake.",
  },
  cta: {
    title: "See How SkipDial Supports",
    muted: "Personal Injury Firms",
    body: "Speed and consistency in new-case intake shape both case volume and case quality. SkipDial delivers AI call automation built around the operational realities of personal injury practices.",
  },
};

export default function InjuryLawyersPage() {
  return <IndustryTemplate data={data} />;
}
