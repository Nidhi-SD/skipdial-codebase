import type { Metadata } from "next";
import {
  Clock,
  CloudLightning,
  ClipboardList,
  FileWarning,
  Database,
  MessageSquareText,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Roofing Contractors | SkipDial",
  description:
    "SkipDial provides AI call automation for roofing contractors, handling storm-driven demand spikes, inspection scheduling, and insurance-claim caller intake.",
};

const data: IndustryData = {
  breadcrumbLabel: "Roofing",
  heroTitle: "AI Call Automation for",
  heroMuted: "Roofing Contractors",
  heroBody:
    "A single storm can trigger hundreds of calls overnight, and callers who can't get through simply call the next roofer on the list. SkipDial schedules, documents, and routes every caller, no matter the surge.",
  breakdown: {
    title: "Where Call Handling Breaks Down for",
    muted: "Roofing Contractors",
    body: "Roofing offices are built around a baseline call volume, not the spike that follows a storm event. When that spike hits, the same office that ran smoothly last week can't keep up.",
    frictionLabel: "Common friction points",
    friction: [
      "Storm-driven call volume overwhelming office staff within hours",
      "Inspection requests going unanswered during the highest-demand week",
      "Insurance-claim callers needing guidance office staff don't have time to give",
      "Inconsistent intake on roof type, damage description, and property details",
      "Estimate requests lost between the phone, email, and in-person visits",
    ],
    closing:
      "In storm season, the contractor who answers fastest and schedules the most inspections wins the most jobs, before a single truck is dispatched.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "Storm Surge Handling",
      "Inspection Scheduling",
      "Insurance-Claim Caller Intake",
      "Structured Damage Intake",
      "CRM and Calendar Sync",
      "Estimate Follow-Up",
      "Escalation to Your Team",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Homeowner Calls",
    cards: [
      {
        icon: Clock,
        title: "Answers Every Call During the Surge",
        body: "Calls are answered immediately even when volume multiplies overnight after a storm event.",
      },
      {
        icon: CloudLightning,
        title: "Identifies Storm vs. Standard Requests",
        body: "Storm damage inspections are distinguished from routine repairs, replacements, or general roofing questions.",
      },
      {
        icon: ClipboardList,
        title: "Captures Property and Damage Details",
        body: "Roof type, age, visible damage, and property address are collected before a crew is ever scheduled.",
      },
      {
        icon: FileWarning,
        title: "Guides Insurance-Claim Callers",
        body: "Homeowners are walked through what to expect from the inspection and claim process, using answers you've approved.",
      },
      {
        icon: Database,
        title: "Books Inspections and Logs Leads",
        body: "Appointments are scheduled directly into your calendar, and every lead syncs to your CRM with full intake context.",
      },
      {
        icon: MessageSquareText,
        title: "Sends a Confirmation to the Homeowner",
        body: "Inspection confirmations go out automatically, so homeowners know their appointment is locked in without a follow-up call.",
      },
    ],
  },
  surge: {
    title: "Built for Storm Season,",
    muted: "Not Just a Normal Week",
    body: (
      <>
        A single hail or wind event can generate more calls in three days
        than a typical month.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents scale automatically
        </strong>
        , answering every caller in parallel during the exact window when
        speed determines how many of those jobs you actually win.
      </>
    ),
  },
  reserve: {
    title: "Keep Crews and Estimators Focused on",
    muted: "Roofs, Not Phones",
    intro:
      "Estimators and crew leads shouldn't be pulled off jobs to answer calls during the busiest week of the season.",
    helpsLabel: "AI call automation handles",
    helps: [
      "Inspection request intake",
      "Storm-surge call answering",
      "Insurance-claim caller guidance",
      "Estimate follow-up scheduling",
    ],
    focusLabel: "This allows your team to focus on",
    focus: [
      "Running inspections and estimates",
      "Managing crews on active jobs",
      "Working directly with adjusters",
      "Closing larger replacement projects",
    ],
  },
  builtAround: {
    title: "Built Around Your Service Area,",
    muted: "Crews & Storm Protocols",
    body: "Every roofing company handles storm response differently. SkipDial agents are configured using your service area, crew and estimator availability, insurance-claim guidance, and pricing boundaries so every caller gets consistent, approved information.",
    cards: [
      {
        title: "Service Area & Storm Zones",
        body: "Coverage rules for active and past storm events",
      },
      {
        title: "Estimator Scheduling",
        body: "Inspection booking matched to availability",
      },
      {
        title: "Insurance-Claim Guidance",
        body: "Approved talking points for claim-related questions",
      },
      {
        title: "CRM and Scheduling",
        body: "Leads and inspections sync automatically",
      },
    ],
  },
  demo: { defaultIndustry: "roofing" },
  cta: {
    title: "See How SkipDial Works",
    muted: "for Roofing Contractors",
    body: "The week after a storm decides your quarter. SkipDial delivers structured, 24/7 call automation built around the surge realities of roofing demand.",
  },
};

export default function RoofingPage() {
  return <IndustryTemplate data={data} />;
}
