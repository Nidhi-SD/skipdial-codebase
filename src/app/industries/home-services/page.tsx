import type { Metadata } from "next";
import {
  Clock,
  Filter,
  ClipboardList,
  Route,
  Database,
} from "lucide-react";
import { IndustryTemplate, type IndustryData } from "@/components/blocks/IndustryTemplate";

export const metadata: Metadata = {
  title: "AI Call Automation for Home Services | SkipDial",
  description:
    "SkipDial provides AI call automation for HVAC, plumbing, roofing, electrical, and other home service companies, delivering 24/7 call coverage, structured intake, and CRM-integrated scheduling.",
};

const data: IndustryData = {
  breadcrumbLabel: "Home Services",
  heroTitle: "AI Call Automation Built for",
  heroMuted: "Home Service Companies",
  heroBody:
    "In home services, phone calls are not casual inquiries. They are often tied to urgent problems, high-value jobs, and time-sensitive scheduling. Missed calls during peak periods, storm events, or after hours can mean lost revenue, especially when a caller can choose from a dozen other local providers offering identical services. SkipDial configures AI voice agents around the realities of home service operations, ensuring every call is answered, structured, and routed according to your business rules.",
  breakdown: {
    title: "Where Traditional Call Handling",
    muted: "Breaks Down in Home Services",
    body: "Home service companies typically rely on a mix of front-office staff, answering services, or basic IVR systems. All of those options have weaknesses that force home services businesses to compromise on call handling.",
    frictionLabel: "Common challenges",
    friction: [
      "Calls going unanswered during busy dispatch windows",
      "After-hours voicemails that are returned too late",
      "Incomplete intake details that slow technicians down",
      "Generic answering services unfamiliar with your services",
      "IVR systems that frustrate callers with rigid menus",
    ],
    closing:
      "When call volume spikes, these weaknesses become more visible. Storms, heat waves, and seasonal surges can overwhelm even well-staffed offices.",
  },
  checklist: {
    heading: "What Happens on Every Call",
    items: [
      "24/7 Call Answering",
      "Emergency Call Routing",
      "Structured Job Intake",
      "Appointment Booking",
      "After-Hours Coverage",
      "CRM and Dispatch Sync",
      "Surge Call Handling",
    ],
  },
  callCards: {
    title: "What SkipDial Does When a",
    muted: "Service Call Comes In",
    cards: [
      {
        icon: Clock,
        title: "Answers Immediately, 24/7",
        body: "Calls are answered without hold queues or voicemail deferrals, including after hours and during peak demand.",
      },
      {
        icon: Filter,
        title: "Identifies the Type of Request",
        body: "Emergency vs. standard service. Maintenance vs. installation. New customer vs. existing client.",
      },
      {
        icon: ClipboardList,
        title: "Captures Complete Job Details",
        body: "The agent collects structured intake information such as location, issue description, equipment type, urgency level, and contact details.",
      },
      {
        icon: Route,
        title: "Routes Based on Defined Rules",
        body: "Emergency calls can be transferred immediately. Standard appointments can be scheduled directly. Messages can be categorized by service line.",
      },
      {
        icon: Database,
        title: "Logs Everything Automatically",
        body: "Call summaries and intake data sync to your CRM or scheduling system so dispatch teams have full context.",
      },
    ],
  },
  surge: {
    title: "Designed for Peak Demand",
    muted: "and Seasonal Surges",
    body: (
      <>
        Virtually every home service provider faces seasonal elasticity or
        weather-driven call spikes. Extreme weather, promotional campaigns, and
        maintenance seasons can overwhelm traditional call handling systems.{" "}
        <strong className="font-semibold text-ink">
          AI voice agents scale automatically
        </strong>
        , answering multiple calls simultaneously without degrading intake
        quality or response time.
      </>
    ),
  },
  reserve: {
    title: "Reserve Your Team's Time for What",
    muted: "Actually Requires Human Judgment",
    intro:
      "Dispatchers, service managers, and technicians should not spend time collecting basic information that can be structured automatically.",
    helpsLabel: "AI call automation helps by",
    helps: [
      "Handling routine scheduling",
      "Gathering standardized intake data",
      "Confirming appointment details",
      "Filtering non-service inquiries",
    ],
    focusLabel: "This allows your paid staff to focus on",
    focus: [
      "Coordinating emergency response",
      "Managing complex customer concerns",
      "Supporting technicians in the field",
      "Closing high-value opportunities",
    ],
    closing: "Automation reduces interruptions while improving call consistency.",
  },
  builtAround: {
    title: "Built Around Your Service Lines,",
    muted: "Systems & FAQs",
    body: "Every home service company operates differently. SkipDial agents are configured using your service offerings, service areas, dispatch priorities, pricing boundaries, and FAQs so the agent provides accurate, approved information and escalates when necessary.",
    cards: [
      {
        title: "Service Lines",
        body: "Configured to your offerings, service areas, and job types",
      },
      {
        title: "Dispatch Priorities",
        body: "Emergency vs. standard routing built to your rules",
      },
      {
        title: "Pricing Boundaries",
        body: "The agent only quotes what you approve. Nothing improvised",
      },
      {
        title: "FAQs & Knowledge Base",
        body: "Approved answers for the questions your callers actually ask",
      },
    ],
  },
  demo: {
    defaultIndustry: "hvac",
    title: "Try It for",
    muted: "Yourself",
    body: "Pick your industry and language, then get a live demo call. Hear exactly how SkipDial answers a home service call, captures job details, and routes emergencies.",
  },
  cta: {
    title: "See How SkipDial Works",
    muted: "for Home Services",
    body: "If your business depends on phone calls to drive revenue, consistent intake and immediate response are critical. SkipDial delivers structured, 24/7 call automation built around the operational realities of home service companies.",
  },
};

export default function HomeServicesPage() {
  return <IndustryTemplate data={data} />;
}
