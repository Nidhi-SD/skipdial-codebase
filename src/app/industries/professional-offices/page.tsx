import type { Metadata } from "next";
import {
  Clock,
  Ear,
  ListChecks,
  Route,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Professional Offices | SkipDial",
  description:
    "SkipDial provides AI call automation for law firms, insurance agencies, healthcare practices, accounting firms, and advisory offices, delivering structured intake, secure data handling, and CRM-integrated workflows.",
};

const data: IndustryData = {
  breadcrumbLabel: "Professional Offices",
  heroTitle: "AI Call Automation for",
  heroMuted: "Professional Offices",
  heroBody:
    "Law firms, insurance agencies, healthcare practices, accounting firms, and advisory offices rely on phone calls to initiate high-value client relationships. These calls often involve sensitive information, detailed intake requirements, and careful routing. When calls are rushed, inconsistent, or sent to voicemail, the impact extends beyond inconvenience: incomplete documentation, delayed follow-up, and poor intake discipline can affect client experience, compliance standards, and internal workflow efficiency. SkipDial configures AI voice agents around the structured intake and routing requirements common to professional offices, ensuring every call follows an approved process.",
  breakdown: {
    title: "Where Call Handling Breaks Down",
    muted: "in Professional Offices",
    body: "Professional environments present different challenges than high-volume dispatch operations. Attorneys and advisors miss calls during meetings. Front-desk staff juggle phones and in-person clients. When intake varies from call to call, visibility and compliance discipline decline.",
    frictionLabel: "Common friction points",
    friction: [
      "Attorneys or advisors missing calls while in meetings",
      "Front-desk staff juggling phones and in-person clients",
      "Intake forms completed inconsistently",
      "Voicemail backlogs that delay response",
      "Call notes recorded manually and entered later",
      "Sensitive details captured without standardized documentation",
    ],
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "Structured Intake Workflows",
      "Practice Area Call Routing",
      "Confidential Intake Handling",
      "HIPAA-Aligned Configurations",
      "CRM and Case Management Sync",
      "Appointment Scheduling",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Client Call Comes In",
    cards: [
      {
        icon: Clock,
        title: "Answers Promptly and Consistently",
        body: "Calls are acknowledged immediately without requiring licensed professionals to interrupt active work.",
      },
      {
        icon: Ear,
        title: "Identifies the Purpose of the Call",
        body: "New client inquiry, policy question, billing matter, scheduling request, or general information.",
      },
      {
        icon: ListChecks,
        title: "Follows Structured Intake Workflows",
        body: "Required questions are asked in a defined order, ensuring essential information is collected every time.",
      },
      {
        icon: Route,
        title: "Categorizes and Routes Appropriately",
        body: "Calls directed by practice area, service line, urgency level, or client status.",
      },
      {
        icon: Database,
        title: "Logs Structured Summaries",
        body: "Call outcomes and intake details sync to your CRM or case management system for documentation and follow-up.",
      },
    ],
  },
  surge: {
    title: "Supports Confidentiality and",
    muted: "Compliance Requirements",
    body: (
      <>
        Professional offices operate within privacy expectations and regulatory
        standards. SkipDial workflows are configured to operate within defined
        boundaries rather than generating unrestricted responses, limiting
        answers to approved knowledge bases, escalating sensitive matters to
        human staff, capturing structured documentation for records, aligning
        routing rules with internal confidentiality policies, and offering{" "}
        <strong className="font-semibold text-ink">
          HIPAA-aligned configurations for healthcare environments
        </strong>
        .
      </>
    ),
  },
  reserve: {
    title: "Preserve Licensed Staff Time for",
    muted: "Work That Requires Expertise",
    intro:
      "Attorneys, physicians, advisors, and consultants should not spend time collecting basic intake information that can be structured automatically.",
    helpsLabel: "AI call automation helps by",
    helps: [
      "Routine scheduling",
      "Approved FAQ responses",
      "Standardized intake data",
      "Filtering low-priority calls",
    ],
    focusLabel: "This allows your staff to focus on",
    focus: [
      "Substantive client work",
      "Complex matters and consultations",
      "Relationship management",
      "High-value follow-up",
    ],
  },
  builtAround: {
    title: "Built Around Your Policies,",
    muted: "Systems & FAQs",
    body: "Every professional office defines its own intake priorities. SkipDial agents are configured using your approved service descriptions, client FAQs, intake criteria, scheduling policies and escalation rules so callers receive consistent, approved information and every interaction is clearly documented.",
    cards: [
      {
        title: "Service Descriptions",
        body: "Approved scope and boundaries",
      },
      {
        title: "Intake Criteria",
        body: "Questions by service line or practice area",
      },
      {
        title: "Escalation Rules",
        body: "Complex or sensitive matter routing",
      },
      {
        title: "CRM and Scheduling",
        body: "Summaries and bookings sync automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "injury-lawyers",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial handles structured intake and confidential routing for professional offices.",
  },
  cta: {
    title: "See How SkipDial Supports",
    muted: "Professional Offices",
    body: "Structured intake, controlled messaging, and documented workflows are essential for professional environments. SkipDial delivers AI call automation built around the operational standards of law firms, insurance agencies, healthcare practices, and advisory offices.",
  },
};

export default function ProfessionalOfficesPage() {
  return <IndustryTemplate data={data} />;
}
