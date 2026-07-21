import type { Metadata } from "next";
import {
  Clock,
  Ear,
  CalendarCheck,
  ShieldCheck,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Dental Practices | SkipDial",
  description:
    "SkipDial provides AI call automation for dental practices, handling appointment booking, recall and reactivation, insurance verification intake, and after-hours emergency triage.",
};

const data: IndustryData = {
  breadcrumbLabel: "Dentists",
  heroTitle: "AI Call Automation for",
  heroMuted: "Dental Practices",
  heroBody:
    "Dental front desks answer phones between checking in patients, verifying insurance, and coordinating with the back office, all while the schedule is actively filling or falling apart. A missed call is a lost new patient or a recall that never gets rebooked, and a real dental emergency reaching voicemail after hours is a patient your practice may never see again. SkipDial configures AI voice agents around your scheduling system and front-desk protocols so every call is answered, booked, and triaged correctly.",
  breakdown: {
    title: "Where Call Handling Breaks Down in",
    muted: "Dental Practices",
    body: "Front-desk teams are typically one or two people managing phones, check-in, checkout, and insurance questions simultaneously. When call volume rises, something has to give, and it's usually the phone.",
    frictionLabel: "Common friction points",
    friction: [
      "New patient calls going to voicemail during busy check-in windows",
      "Recall and reactivation lists that never get called consistently",
      "Insurance verification questions that stall booking",
      "After-hours emergency calls with no clear triage path",
      "Rescheduling and cancellation calls creating scheduling gaps",
    ],
    closing:
      "A practice that answers consistently and rebooks reliably keeps its chairs filled without adding front-desk headcount.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "New Patient Booking",
      "Recall & Reactivation Calls",
      "Insurance Verification Intake",
      "After-Hours Emergency Triage",
      "Practice Management Sync",
      "Cancellation & Rescheduling",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Patient Calls",
    cards: [
      {
        icon: Clock,
        title: "Answers Immediately, Day or Night",
        body: "Calls are picked up without hold music, including evenings, weekends, and lunch coverage gaps.",
      },
      {
        icon: Ear,
        title: "Identifies the Reason for the Call",
        body: "New patient inquiry, recall booking, insurance question, cancellation, or a dental emergency.",
      },
      {
        icon: CalendarCheck,
        title: "Books Directly Into Your Schedule",
        body: "Appointments are placed into open chair time based on the visit type and provider availability you define.",
      },
      {
        icon: ShieldCheck,
        title: "Triages Emergencies Correctly",
        body: "Urgent pain, trauma, or swelling calls are flagged and routed per your after-hours protocol instead of sitting in a voicemail box.",
      },
      {
        icon: Database,
        title: "Captures Insurance and Contact Details",
        body: "Plan information and patient details are collected up front and synced to your practice management system.",
      },
    ],
  },
  surge: {
    title: "Keeps Recall and Reactivation",
    muted: "Running Without Manual Calling",
    body: (
      <>
        Hygiene recall, treatment reactivation, and post-appointment
        follow-up are high-value but easy to let slip when front-desk time is
        limited.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents handle outbound recall calls automatically
        </strong>
        , rebooking patients on a consistent cadence without pulling staff off
        the phones they&apos;re already managing.
      </>
    ),
  },
  reserve: {
    title: "Reserve Your Front Desk for",
    muted: "In-Office Patient Experience",
    intro:
      "Front-desk staff shouldn't be choosing between the patient standing in front of them and the phone ringing behind them.",
    helpsLabel: "AI call automation handles",
    helps: [
      "Routine appointment booking",
      "Recall and reactivation outreach",
      "Insurance intake questions",
      "After-hours emergency triage",
    ],
    focusLabel: "This allows your team to focus on",
    focus: [
      "Checking patients in and out",
      "Coordinating with clinical staff",
      "Handling in-person billing questions",
      "Delivering a smooth in-office visit",
    ],
    closing: "Consistent booking discipline keeps the schedule full without adding staff.",
  },
  builtAround: {
    title: "Built Around Your Schedule,",
    muted: "Providers & Protocols",
    body: "Every practice runs its schedule differently. SkipDial agents are configured using your providers, visit types, insurance plans accepted, and emergency protocols so patients get accurate answers and every booking lands correctly.",
    cards: [
      {
        title: "Providers & Visit Types",
        body: "Booking rules matched to each provider's schedule",
      },
      {
        title: "Insurance Plans",
        body: "Accepted plans and verification steps you approve",
      },
      {
        title: "Emergency Protocols",
        body: "Clear triage and on-call routing rules",
      },
      {
        title: "Practice Management Sync",
        body: "Bookings and notes sync automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "dentists",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial books a new patient and triages an after-hours emergency.",
  },
  cta: {
    title: "See How SkipDial Supports",
    muted: "Dental Practices",
    body: "A full schedule depends on answering every call and rebooking every recall. SkipDial delivers AI call automation built around the operational realities of dental front desks.",
  },
};

export default function DentistsPage() {
  return <IndustryTemplate data={data} />;
}
