import type { Metadata } from "next";
import {
  Clock,
  Ear,
  CalendarCheck,
  ShieldCheck,
  Database,
  MessageSquareText,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";
import type { TranscriptLine } from "@/components/blocks/AudioPlayer";

export const metadata: Metadata = {
  title: "AI Call Automation for Dental Practices | SkipDial",
  description:
    "SkipDial provides AI call automation for dental practices, handling appointment booking, recall and reactivation, insurance verification intake, and after-hours emergency triage.",
};

const dentalTranscript: TranscriptLine[] = [
  { time: 0, speaker: "ai", text: "Hi, this is James at Thornwell Family Dental. How can I help you today?" },
  { time: 4, speaker: "caller", text: "Hey, hi. I'm actually looking for a new dentist. I wanted to ask a few things first." },
  { time: 12, speaker: "ai", text: "Of course, I'd be happy to help with that. What would you like to know?" },
  { time: 16, speaker: "caller", text: "I wanted to ask if you guys see adults and kids, or is it more one or the other?" },
  { time: 24, speaker: "ai", text: "Yes, we see both adults and kids. We're a family dental practice, and new patients are welcome. We typically see children starting around age two. What else can I help with?" },
  { time: 36, speaker: "caller", text: "Good. And what are your hours? Are you open on Fridays?" },
  { time: 42, speaker: "ai", text: "Yes, we're open on Fridays. Our hours are Monday through Thursday from 8 a.m. to 5 p.m. and Friday from 8 a.m. to 2 p.m. We're closed on Saturdays and Sundays." },
  { time: 54, speaker: "caller", text: "Got that. And do you take insurance? I've actually got Delta Dental." },
  { time: 60, speaker: "ai", text: "We work with most major PPO insurance plans, and our team verifies your coverage before your visit. Just bring your Delta Dental insurance card with you, and the staff can confirm your benefits. If you'd like to schedule a new patient appointment, I can help with that too." },
  { time: 76, speaker: "caller", text: "Okay, but I wanted to ask: is Delta Dental specifically in network?" },
  { time: 83, speaker: "ai", text: "I can't confirm whether Delta Dental is specifically in network or provide coverage details. We work with most major PPO plans, and our team verifies insurance before your visit. If you'd like, I can take a message or help you schedule an appointment, and the staff can confirm your Delta Dental network status and benefits." },
  { time: 105, speaker: "caller", text: "Okay, fair enough. So I would like to go ahead and book something. It's been about two years since my last cleaning." },
  { time: 114, speaker: "ai", text: "Absolutely. What are you coming in for, and are you a new patient or an existing patient?" },
  { time: 120, speaker: "caller", text: "I'm a new patient, and it's just for a regular cleaning and checkup." },
  { time: 127, speaker: "ai", text: "Great, thanks. For a new patient exam and cleaning, what day works best for you?" },
  { time: 133, speaker: "caller", text: "Do you happen to have anything on Thursdays?" },
  { time: 138, speaker: "ai", text: "Let me check. For Thursday, I have 9:30 a.m., 1 p.m., or 3:45 p.m. available. Which time works best for you?" },
  { time: 149, speaker: "caller", text: "1 p.m. definitely works for me." },
  { time: 152, speaker: "ai", text: "Perfect. I have 1:00 p.m. on Thursday. Can I get your full name and the best callback number to reach you?" },
  { time: 160, speaker: "caller", text: "Yeah, it's Emily Carter. I repeat, Emily Carter, and my number is 214 triple 50147." },
  { time: 173, speaker: "ai", text: "Thank you. Just to confirm, that's Emily Carter, callback number 214-555-0147, for Thursday at 1 p.m. for a new patient exam and cleaning. Is that all correct?" },
  { time: 185, speaker: "caller", text: "Yes, that is correct. But before we lock it in, roughly, how much does the cleaning run without insurance? I'm just out of curiosity." },
  { time: 197, speaker: "ai", text: "A standard cleaning without insurance is about $125. Since you're a new patient, the first visit typically includes the exam, any needed X-rays, and the cleaning, and that usually runs about $225 to $295. The dentist will confirm exactly what's needed at your visit before any treatment beyond that. Great, I have you down for Thursday at 1 p.m. for a new patient exam and cleaning. You'll get a confirmation shortly." },
  { time: 228, speaker: "caller", text: "Got it. That's fine. Just book it in." },
  { time: 233, speaker: "ai", text: "Thanks for calling Thornwell Family Dental. Take care." },
];

const data: IndustryData = {
  breadcrumbLabel: "Dentists",
  heroTitle: "AI Call Automation for",
  heroMuted: "Dental Practices",
  heroBody:
    "A missed call is a lost new patient or a recall that never gets rebooked, and a real emergency reaching voicemail after hours is a patient you may never see again. SkipDial answers, books, and triages every call around your scheduling system.",
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
  hearItLive: {
    src: "/audio/dental_demo.wav",
    transcript: dentalTranscript,
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
      "Escalation to Your Front Desk",
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
      {
        icon: MessageSquareText,
        title: "Sends a Confirmation to the Patient",
        body: "Appointment confirmations go out automatically, so patients know their visit is booked without a follow-up call.",
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
  demo: { defaultIndustry: "dentists" },
  cta: {
    title: "See How SkipDial Supports",
    muted: "Dental Practices",
    body: "A full schedule depends on answering every call and rebooking every recall. SkipDial delivers AI call automation built around the operational realities of dental front desks.",
  },
};

export default function DentistsPage() {
  return <IndustryTemplate data={data} />;
}
