import type { Metadata } from "next";
import {
  Clock,
  Ear,
  Wrench,
  MoonStar,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Property Managers | SkipDial",
  description:
    "SkipDial provides AI call automation for property management companies, handling tenant maintenance requests, leasing inquiries, and after-hours emergency routing.",
};

const data: IndustryData = {
  breadcrumbLabel: "Property Management",
  heroTitle: "AI Call Automation for",
  heroMuted: "Property Managers",
  heroBody:
    "Property managers field two very different kinds of calls: prospective tenants asking about availability and pricing, and current residents reporting a maintenance issue that may or may not be an emergency. Both require a fast, accurate response, and both suffer when office staff are stretched across move-ins, inspections, and owner reporting. A leasing call left unanswered is a vacancy that sits longer. A maintenance emergency left on voicemail overnight is a liability. SkipDial configures AI voice agents around your property portfolio so every call is answered, categorized, and routed correctly.",
  breakdown: {
    title: "Where Call Handling Breaks Down for",
    muted: "Property Managers",
    body: "Property management offices manage phones alongside move-ins, unit turns, vendor coordination, and owner communication, all with a small on-site team.",
    frictionLabel: "Common friction points",
    friction: [
      "Leasing inquiries going unanswered while staff handle in-person tours",
      "Maintenance calls with no clear emergency vs. routine distinction",
      "After-hours plumbing, electrical, or lockout calls left on voicemail",
      "Inconsistent intake on unit number, issue description, and access details",
      "Owner and vendor calls competing for the same phone lines as tenants",
    ],
    closing:
      "A missed leasing call extends a vacancy. A missed emergency maintenance call becomes a liability issue and a resident retention problem.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "Leasing Inquiry Handling",
      "Maintenance Request Intake",
      "Emergency vs. Routine Triage",
      "After-Hours Emergency Routing",
      "Property Management Software Sync",
      "Vendor & Owner Call Routing",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Tenant or Prospect Calls",
    cards: [
      {
        icon: Clock,
        title: "Answers Immediately, Day or Night",
        body: "Calls are picked up whether staff are on-site conducting tours, off for the day, or it's 2 a.m. on a weekend.",
      },
      {
        icon: Ear,
        title: "Identifies the Type of Caller",
        body: "Prospective tenant, current resident with a maintenance issue, vendor, or property owner.",
      },
      {
        icon: Wrench,
        title: "Captures Structured Maintenance Details",
        body: "Unit number, issue description, access instructions, and urgency level are collected before dispatch.",
      },
      {
        icon: MoonStar,
        title: "Escalates True Emergencies After Hours",
        body: "Flooding, no heat, lockouts, and safety issues are routed to your on-call process immediately, while routine requests are queued for business hours.",
      },
      {
        icon: Database,
        title: "Logs Everything to Your Systems",
        body: "Leasing inquiries and maintenance tickets sync directly to your property management software for staff to act on.",
      },
    ],
  },
  surge: {
    title: "Designed for Move-In Season",
    muted: "and Weather Emergencies",
    body: (
      <>
        Leasing inquiries spike during peak moving months, and maintenance
        calls spike after storms, freezes, or major weather events.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents scale automatically
        </strong>{" "}
        to handle both kinds of surges without leaving tenants or prospects
        waiting on hold.
      </>
    ),
  },
  reserve: {
    title: "Free Your On-Site Team for",
    muted: "Tours, Turns & Resident Relations",
    intro:
      "Leasing agents and maintenance coordinators shouldn't be pulled off in-person work to triage every incoming call themselves.",
    helpsLabel: "AI call automation handles",
    helps: [
      "Leasing inquiry qualification",
      "Maintenance request intake",
      "Emergency vs. routine triage",
      "After-hours on-call routing",
    ],
    focusLabel: "This allows your team to focus on",
    focus: [
      "Conducting property tours",
      "Managing unit turns and move-ins",
      "Resolving resident concerns in person",
      "Reporting to property owners",
    ],
  },
  builtAround: {
    title: "Built Around Your Portfolio,",
    muted: "Vendors & Escalation Rules",
    body: "Every management company runs differently across its portfolio. SkipDial agents are configured using your unit availability, maintenance vendor list, emergency escalation rules, and leasing criteria so every caller gets accurate, approved information.",
    cards: [
      {
        title: "Unit Availability",
        body: "Synced data for accurate leasing answers",
      },
      {
        title: "Maintenance Vendors",
        body: "Routing rules by issue type and property",
      },
      {
        title: "Emergency Escalation",
        body: "Clear after-hours on-call protocols",
      },
      {
        title: "Property Management Sync",
        body: "Tickets and leads sync automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "property-management",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial handles a tenant maintenance request and an after-hours emergency.",
  },
  cta: {
    title: "See How SkipDial Supports",
    muted: "Property Managers",
    body: "Filled units and satisfied residents depend on fast, accurate call handling. SkipDial delivers AI call automation built around the day-to-day realities of property management offices.",
  },
};

export default function PropertyManagementPage() {
  return <IndustryTemplate data={data} />;
}
