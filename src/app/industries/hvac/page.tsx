import type { Metadata } from "next";
import {
  Clock,
  Thermometer,
  ClipboardList,
  Route,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for HVAC Contractors | SkipDial",
  description:
    "SkipDial provides AI call automation for HVAC contractors, handling emergency vs. routine dispatch, seasonal call surges, and technician routing with CRM-integrated intake.",
};

const data: IndustryData = {
  breadcrumbLabel: "HVAC",
  heroTitle: "AI Call Automation for",
  heroMuted: "HVAC Contractors",
  heroBody:
    "HVAC calls are rarely convenient. A no-cooling call in July or a no-heat call in January arrives the moment a system fails, and the customer is already comparing you to whoever else answers first. Dispatchers juggling phones, technician schedules, and walk-ins can't always give every call the same speed or consistency, especially when a heat wave or cold snap triples the call volume overnight. SkipDial configures AI voice agents around your dispatch rules so every call is answered, triaged by urgency, and routed to the right technician.",
  breakdown: {
    title: "Where Call Handling Breaks Down for",
    muted: "HVAC Contractors",
    body: "Most HVAC companies run lean on office staff relative to call volume, and that gap widens fast during seasonal peaks when every customer's system seems to fail at once.",
    frictionLabel: "Common friction points",
    friction: [
      "No-heat or no-cool emergencies going to voicemail during peak season",
      "After-hours calls that wait until morning for a callback",
      "Inconsistent intake on system type, symptoms, and unit age",
      "Technician schedules double-booked from manual dispatch",
      "Maintenance plan renewals falling through the cracks",
    ],
    closing:
      "When temperatures spike or drop, call volume follows immediately. Offices that can't absorb that surge lose jobs to whichever competitor answers.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "Emergency vs. Routine Triage",
      "Structured System Intake",
      "Technician Routing",
      "Seasonal Surge Handling",
      "CRM and Dispatch Sync",
      "Maintenance Plan Reminders",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Service Call Comes In",
    cards: [
      {
        icon: Clock,
        title: "Answers Immediately, Any Season",
        body: "No-heat and no-cool calls are picked up instantly, including nights, weekends, and the middle of a heat wave.",
      },
      {
        icon: Thermometer,
        title: "Triages Emergency vs. Routine",
        body: "No-heat, no-cool, and safety concerns are separated from routine maintenance or estimate requests from the first question.",
      },
      {
        icon: ClipboardList,
        title: "Captures System and Symptom Details",
        body: "Equipment type, age, symptoms, and property access details are collected before a technician is ever dispatched.",
      },
      {
        icon: Route,
        title: "Routes to the Right Technician",
        body: "Calls are matched to technician availability, service area, and job type based on the rules you define.",
      },
      {
        icon: Database,
        title: "Syncs Every Job to Dispatch",
        body: "Job details and customer information flow directly into your dispatch or field service software, ready for the assigned tech.",
      },
    ],
  },
  surge: {
    title: "Built for Heat Waves,",
    muted: "Cold Snaps & Peak Season",
    body: (
      <>
        A single stretch of extreme weather can multiply call volume for
        days.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents scale automatically
        </strong>
        , answering every no-heat and no-cool call the moment it comes in
        instead of forcing customers into a queue during the exact week your
        business needs to convert the most calls.
      </>
    ),
  },
  reserve: {
    title: "Free Your Dispatchers for",
    muted: "Coordination, Not Intake",
    intro:
      "Dispatchers and technicians shouldn't spend peak-season hours re-asking the same intake questions on every call.",
    helpsLabel: "AI call automation handles",
    helps: [
      "Emergency vs. routine triage",
      "Structured system intake",
      "Technician scheduling",
      "Maintenance plan reminders",
    ],
    focusLabel: "This allows your team to focus on",
    focus: [
      "Coordinating technician routes",
      "Managing same-day emergencies",
      "Supporting techs on complex jobs",
      "Closing larger system replacements",
    ],
  },
  builtAround: {
    title: "Built Around Your Service Area,",
    muted: "Technicians & Pricing",
    body: "Every HVAC company dispatches differently. SkipDial agents are configured using your service area, technician rosters, emergency thresholds, and pricing boundaries so callers get accurate answers and every job routes correctly.",
    cards: [
      {
        title: "Service Area & Hours",
        body: "Coverage zones and after-hours emergency rules",
      },
      {
        title: "Technician Rosters",
        body: "Routing by availability, skillset, and territory",
      },
      {
        title: "Pricing Boundaries",
        body: "The agent quotes only what you approve",
      },
      {
        title: "Dispatch Software Sync",
        body: "Jobs and customer details sync automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "hvac",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial triages a no-heat emergency and dispatches a technician.",
  },
  cta: {
    title: "See How SkipDial Works",
    muted: "for HVAC Contractors",
    body: "Every missed no-heat or no-cool call is a job for a competitor. SkipDial delivers structured, 24/7 call automation built around the seasonal realities of HVAC dispatch.",
  },
};

export default function HvacPage() {
  return <IndustryTemplate data={data} />;
}
