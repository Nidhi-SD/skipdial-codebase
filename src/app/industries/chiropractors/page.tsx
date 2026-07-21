import type { Metadata } from "next";
import {
  Clock,
  Ear,
  CalendarCheck,
  ClipboardList,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Chiropractic Practices | SkipDial",
  description:
    "SkipDial provides AI call automation for chiropractic practices, handling new patient booking, recurring care scheduling, and insurance intake questions.",
};

const data: IndustryData = {
  breadcrumbLabel: "Chiropractors",
  heroTitle: "AI Call Automation for",
  heroMuted: "Chiropractic Practices",
  heroBody:
    "Chiropractic practices depend on two things happening consistently: new patients getting booked quickly, and existing patients staying on their recommended care schedule. Front-desk staff managing check-ins, adjustments, and billing questions simultaneously can't always give the phone the same attention, and a new patient inquiry left unanswered rarely calls back. SkipDial configures AI voice agents around your scheduling system so every call, new or returning, is booked, confirmed, and logged without disrupting the flow of your practice.",
  breakdown: {
    title: "Where Call Handling Breaks Down in",
    muted: "Chiropractic Practices",
    body: "A small front-desk team is often managing phones, check-in, and checkout at the same time, especially during back-to-back adjustment blocks.",
    frictionLabel: "Common friction points",
    friction: [
      "New patient calls going unanswered during busy treatment blocks",
      "Recurring care patients falling off their recommended schedule",
      "Insurance and billing questions that stall new patient booking",
      "Rescheduling calls creating gaps in the day's schedule",
      "Inconsistent intake between different front-desk staff",
    ],
    closing:
      "Practices that answer every call and rebook consistently keep their schedule full without adding front-desk hours.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "New Patient Booking",
      "Recurring Care Scheduling",
      "Insurance Intake Questions",
      "Appointment Reminders",
      "Practice Management Sync",
      "Rescheduling & Cancellations",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Patient Calls",
    cards: [
      {
        icon: Clock,
        title: "Answers Immediately, Every Time",
        body: "Calls are picked up whether the front desk is mid-adjustment, at lunch, or after hours.",
      },
      {
        icon: Ear,
        title: "Identifies the Reason for the Call",
        body: "New patient inquiry, recurring care visit, insurance question, or a reschedule request.",
      },
      {
        icon: CalendarCheck,
        title: "Books Into Your Care Schedule",
        body: "Appointments are placed according to visit type, provider availability, and your recommended care intervals.",
      },
      {
        icon: ClipboardList,
        title: "Captures Intake and Insurance Details",
        body: "New patient information and insurance details are collected consistently before the first visit.",
      },
      {
        icon: Database,
        title: "Logs Every Call to Your System",
        body: "Bookings and call summaries sync directly to your practice management software, ready for staff to review.",
      },
    ],
  },
  surge: {
    title: "Keeps Recurring Care",
    muted: "On Schedule Automatically",
    body: (
      <>
        Consistent care plans are central to chiropractic outcomes, but
        recall calls are easy to deprioritize when the front desk is busy.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents handle recurring scheduling and reminder calls
          automatically
        </strong>
        , keeping patients on their recommended cadence without pulling staff
        away from in-office care.
      </>
    ),
  },
  reserve: {
    title: "Reserve Your Front Desk for",
    muted: "In-Office Patient Care",
    intro:
      "Front-desk staff shouldn't have to choose between the patient in the waiting room and the phone ringing at the desk.",
    helpsLabel: "AI call automation handles",
    helps: [
      "New patient and recurring care booking",
      "Insurance intake questions",
      "Appointment reminders",
      "Rescheduling and cancellations",
    ],
    focusLabel: "This allows your team to focus on",
    focus: [
      "Checking patients in and out",
      "Supporting providers between visits",
      "Handling in-person billing questions",
      "Delivering a smooth in-office experience",
    ],
  },
  builtAround: {
    title: "Built Around Your Providers,",
    muted: "Care Plans & Insurance",
    body: "Every practice structures care plans differently. SkipDial agents are configured using your providers, visit types, recommended care intervals, and accepted insurance plans so patients receive accurate answers and every booking lands correctly.",
    cards: [
      {
        title: "Providers & Visit Types",
        body: "Booking rules matched to each provider's schedule",
      },
      {
        title: "Recurring Care Intervals",
        body: "Recall scheduling aligned to care plans",
      },
      {
        title: "Insurance Plans",
        body: "Accepted plans and intake steps you approve",
      },
      {
        title: "Practice Management Sync",
        body: "Bookings and notes sync automatically",
      },
    ],
  },
  demo: {
    defaultIndustry: "chiropractors",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial books a new patient and schedules recurring care.",
  },
  cta: {
    title: "See How SkipDial Supports",
    muted: "Chiropractic Practices",
    body: "A full schedule and consistent recurring care both depend on answering every call. SkipDial delivers AI call automation built around the operational realities of chiropractic front desks.",
  },
};

export default function ChiropractorsPage() {
  return <IndustryTemplate data={data} />;
}
