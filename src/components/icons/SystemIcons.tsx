import type { SVGProps } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   SystemIcons — SkipDial's own icon set, drop-in replacements for every
   lucide-react icon used across the site. Each export matches a lucide name
   1:1 (same signature: SVGProps<SVGSVGElement>, currentColor stroke) so call
   sites never change — only the import source does.

   Same construction convention as PainPointIcons.tsx / WorkflowIcons.tsx:
   24x24 grid, round caps/joins, currentColor, and a single restrained accent
   used via currentColor rather than per-category hues. STROKE is the target
   *rendered* line weight; nested/scaled groups compensate via w(scale) so
   compound icons render at one consistent visual thickness.
   ──────────────────────────────────────────────────────────────────────────── */

const STROKE = 0.75;
const w = (scale: number) => STROKE / scale;

const base = {
  xmlns: "http://www.w3.org/2000/svg" as const,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: STROKE,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ── Chrome: arrows, chevrons, checks, form/nav affordances ─────────────── */

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20V5" />
      <path d="M6 11l6-6 6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowDownRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 7l10 10" />
      <path d="M17 8v9H8" />
    </svg>
  );
}

export function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

export function ChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function Check(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  );
}

export function CheckCircle2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5" />
    </svg>
  );
}

export function X(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function XCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
    </svg>
  );
}

export function Plus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function Loader2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

export function Eye(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function EyeOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9.3C4.2 10.6 2.5 12 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.2 3.6-.6" />
      <path d="M9.6 6.2c.8-.4 1.6-.6 2.4-.6 6 0 9.5 6.4 9.5 6.4s-.9 1.6-2.6 3.1" />
      <path d="M3.5 3.5l17 17" />
    </svg>
  );
}

export function AlertCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v6" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AlertTriangle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 21.5 20h-19Z" />
      <path d="M12 9.5v5" />
      <circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Send(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 20.5 3 12.5 20.5 10.3 13.3 3 11.5Z" />
      <path d="M10.3 13.3 20.5 3" />
    </svg>
  );
}

export function Play(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4.5 19 12 6 19.5Z" />
    </svg>
  );
}

export function Pause(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 5v14" />
      <path d="M17 5v14" />
    </svg>
  );
}

export function Menu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function LogOut(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9" />
      <path d="M20 12H10" />
      <path d="M16 8l4 4-4 4" />
    </svg>
  );
}

export function IterationCcw(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9a8 8 0 1 1 2.5 9.3" />
      <path d="M4 4v5h5" />
    </svg>
  );
}

/* ── Telephony ────────────────────────────────────────────────────────────── */

const HANDSET =
  "M4.5 4.8C4.2 3.8 5 3 6 3.2l3 .7c.7.2 1.1.9.9 1.6l-.9 3a1.3 1.3 0 0 1-1.9.8l-1.4-.8c-.6 2.9 1.6 6.4 4.5 7.9l.8-1.4a1.3 1.3 0 0 1 1.9-.5l2.6 1.8c.6.4.8 1.2.4 1.8l-1.7 2.5c-.4.6-1.1.9-1.8.7C6.7 19.9 2.1 12.9 4.5 4.8Z";

export function Phone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={HANDSET} />
    </svg>
  );
}

export function PhoneCall(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={HANDSET} />
      <path d="M14.4 3.4A7.2 7.2 0 0 1 21 10" strokeWidth={STROKE * 0.75} opacity={0.5} />
      <path d="M15.2 6.7a3.9 3.9 0 0 1 3.6 3.6" strokeWidth={STROKE * 0.85} opacity={0.8} />
    </svg>
  );
}

export function PhoneIncoming(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={HANDSET} />
      <path d="M21 3.5v5.5h-5.5" />
      <path d="M21 3.5 14.5 10" />
    </svg>
  );
}

export function PhoneOutgoing(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={HANDSET} />
      <path d="M15.5 3.5h5.5v5.5" />
      <path d="M21 3.5 14.5 10" />
    </svg>
  );
}

export function PhoneMissed(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={HANDSET} />
      <path d="M16 4l5 5" />
      <path d="M21 4l-5 5" />
    </svg>
  );
}

export function PhoneOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={HANDSET} opacity={0.55} />
      <path d="M3 3l18 18" />
    </svg>
  );
}

export function PhoneForwarded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={HANDSET} />
      <path d="M14.5 4 19 8l-4.5 4" />
      <path d="M12.5 8H19" />
    </svg>
  );
}

export function Voicemail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="10.5" width="18" height="8" rx="4" />
      <circle cx="8" cy="14.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14.5" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Calendar & time ──────────────────────────────────────────────────────── */

function CalendarBase() {
  return (
    <>
      <rect x="4.5" y="4.5" width="15" height="16" rx="2.2" />
      <path d="M4.5 9.5h15" />
      <path d="M8.3 3v3" />
      <path d="M15.7 3v3" />
    </>
  );
}

export function Calendar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <CalendarBase />
    </svg>
  );
}

export function CalendarCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <CalendarBase />
      <path d="M8.7 14.8l2.1 2.1 4.5-4.6" />
    </svg>
  );
}

export function CalendarCheck2(props: SVGProps<SVGSVGElement>) {
  return <CalendarCheck {...props} />;
}

export function CalendarClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(-1.5,-1) scale(0.82)" strokeWidth={w(0.82)}>
        <CalendarBase />
      </g>
      <g transform="translate(11.5,11.5) scale(0.46)" strokeWidth={w(0.46)}>
        <circle cx="12" cy="12" r="9.5" fill="var(--surface, #fff)" />
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 7v5l3.2 2" />
      </g>
    </svg>
  );
}

export function Clock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function AlarmClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13.5" r="7.3" />
      <path d="M12 13.5V9.8" />
      <path d="M12 13.5l2.6.9" />
      <path d="M9 6 6.6 3.8" />
      <path d="M15 6l2.4-2.2" />
      <path d="M10 3.2h4" />
    </svg>
  );
}

/* ── Clipboards & checklists ─────────────────────────────────────────────── */

function ClipboardBase() {
  return (
    <>
      <rect x="5" y="4.3" width="14" height="17" rx="2" />
      <rect x="9" y="2.3" width="6" height="3" rx="1" />
    </>
  );
}

export function ClipboardList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <ClipboardBase />
      <path d="M8 10.5h8" />
      <path d="M8 14h8" />
      <path d="M8 17.5h5" />
    </svg>
  );
}

export function ClipboardCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <ClipboardBase />
      <path d="M8.7 13.3l2 2 4.4-4.5" />
    </svg>
  );
}

export function ClipboardX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <ClipboardBase />
      <path d="M9.3 11.3l5 5" />
      <path d="M14.3 11.3l-5 5" />
    </svg>
  );
}

export function ListChecks(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="4" height="4" rx="1" />
      <path d="M4 6.5 4.8 7.3 6 5.7" strokeWidth={w(1) * 0.6} />
      <path d="M10 6.5h11" />
      <rect x="3" y="10.5" width="4" height="4" rx="1" />
      <path d="M4 12.5 4.8 13.3 6 11.7" strokeWidth={w(1) * 0.6} />
      <path d="M10 12.5h11" />
      <rect x="3" y="16.5" width="4" height="4" rx="1" opacity={0.5} />
      <path d="M10 18.5h8" />
    </svg>
  );
}

/* ── Shields & security ───────────────────────────────────────────────────── */

const SHIELD = "M12 3 19 6V12C19 17 15.5 20 12 21.5 8.5 20 5 17 5 12V6Z";

export function ShieldCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={SHIELD} />
      <path d="M8.7 12.2 10.8 14.3 15.3 9.4" />
    </svg>
  );
}

export function ShieldAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={SHIELD} />
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Lock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <circle cx="12" cy="15" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LifeBuoy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M6.2 6.2l3.5 3.5" />
      <path d="M17.8 6.2l-3.5 3.5" />
      <path d="M6.2 17.8l3.5-3.5" />
      <path d="M17.8 17.8l-3.5-3.5" />
    </svg>
  );
}

/* ── Notifications ─────────────────────────────────────────────────────────── */

const BELL = "M6 15c0-4.4 1.6-7.4 5-8 4 .5 6 3.6 6 8l1.4 2.6H4.6Z";
const CLAPPER = "M10 19.4a2.1 2.1 0 0 0 4 0";

export function BellRing(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={BELL} />
      <path d={CLAPPER} />
      <path d="M3.2 8.7a8.3 8.3 0 0 1 2.1-4.4" opacity={0.55} />
      <path d="M20.8 8.7a8.3 8.3 0 0 0-2.1-4.4" opacity={0.55} />
    </svg>
  );
}

export function BellOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d={BELL} opacity={0.55} />
      <path d={CLAPPER} opacity={0.55} />
      <path d="M3 3l18 18" />
    </svg>
  );
}

/* ── Data & infrastructure ────────────────────────────────────────────────── */

export function Database(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v6c0 1.5 3 2.8 7 2.8s7-1.3 7-2.8V6" />
      <path d="M5 12v6c0 1.5 3 2.8 7 2.8s7-1.3 7-2.8v-6" />
    </svg>
  );
}

export function Server(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4" width="17" height="6.5" rx="1.8" />
      <rect x="3.5" y="13.5" width="17" height="6.5" rx="1.8" />
      <circle cx="7" cy="7.25" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7" cy="16.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CloudLightning(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7.2 12.3a3.6 3.6 0 0 1-.5-7.15A5.1 5.1 0 0 1 16.9 6.4a3.7 3.7 0 0 1-.4 5.9Z" />
      <path d="M12.6 12.8l-2.4 4h2.2l-1.6 3.4 4-4.6h-2.2z" />
    </svg>
  );
}

export function RefreshCw(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12a8 8 0 0 1 14-5.3L20 8" />
      <path d="M20 3v5h-5" />
      <path d="M20 12a8 8 0 0 1-14 5.3L4 16" />
      <path d="M4 21v-5h5" />
    </svg>
  );
}

export function LineChart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M6.5 15l4-4 3 3 5.5-6.5" />
    </svg>
  );
}

export function TrendingUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 16l6-6 3.5 3.5L20 6" />
      <path d="M20 11V6h-5" />
    </svg>
  );
}

export function Activity(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

export function Gauge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 15a8 8 0 0 1 16 0" />
      <path d="M12 15 16 9.5" />
      <circle cx="16" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Plug(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3v5" />
      <path d="M15 3v5" />
      <path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0Z" />
      <path d="M12 16.5V21" />
    </svg>
  );
}

export function Workflow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v6" />
      <path d="M12 9 7 15" />
      <path d="M12 9l5 6" />
      <circle cx="7" cy="17" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="17" cy="17" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Communication ─────────────────────────────────────────────────────────── */

export function Mail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
  );
}

export function MessageSquare(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

export function MessageSquareText(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
      <path d="M8 9h8" strokeWidth={STROKE * 0.85} />
      <path d="M8 12.5h5" strokeWidth={STROKE * 0.85} />
    </svg>
  );
}

export function HelpCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.3a2.5 2.5 0 0 1 4.7 1.2c0 1.7-2.2 1.7-2.2 3.3" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Languages(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h9" />
      <path d="M8.5 4v2.5c0 3.5-2 6-5 7.5" />
      <path d="M5 10.5c1.5 1.7 4 2.8 6.5 3" />
      <path d="M14 20l4-9 4 9" />
      <path d="M15.3 17h5.4" />
    </svg>
  );
}

/* ── People & places ──────────────────────────────────────────────────────── */

export function User(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.5-4 3.3-6.5 7-6.5s6.5 2.5 7 6.5" />
    </svg>
  );
}

export function Home(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9.5h12V10" />
    </svg>
  );
}

export function Building2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="3" width="9" height="18" rx="1" />
      <rect x="14" y="9" width="6" height="12" rx="1" />
      <path d="M7.5 7h2" strokeWidth={STROKE * 0.85} />
      <path d="M7.5 11h2" strokeWidth={STROKE * 0.85} />
      <path d="M7.5 15h2" strokeWidth={STROKE * 0.85} />
      <path d="M16.5 12.5h1.2" strokeWidth={STROKE * 0.85} />
      <path d="M16.5 16h1.2" strokeWidth={STROKE * 0.85} />
    </svg>
  );
}

export function MapPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21.5S5.5 14.8 5.5 10a6.5 6.5 0 1 1 13 0c0 4.8-6.5 11.5-6.5 11.5Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export function Warehouse(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10 12 4l9 6" />
      <path d="M4.5 10v10h15V10" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

export function Briefcase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <rect x="2" y="8" width="20" height="14" rx="2" />
      <path d="M2 13h20" />
    </svg>
  );
}

export function Gavel(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="9.8" y="3.3" width="4.4" height="8" rx="1" transform="rotate(45 12 7.3)" />
      <path d="M6.5 12.8l4-4" />
      <path d="M3.5 21l6.5-6.5" />
      <path d="M13.5 15l4 4" />
    </svg>
  );
}

/* ── Industry & vertical glyphs ───────────────────────────────────────────── */

export function Thermometer(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="10.3" y="3" width="3.4" height="12.5" rx="1.7" />
      <circle cx="12" cy="17.5" r="3" />
      <circle cx="12" cy="17.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Stethoscope(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 4v5a4 4 0 0 0 8 0V4" />
      <path d="M10.5 13v1.5a5.5 5.5 0 0 0 11 0v-2" />
      <circle cx="20" cy="10.7" r="1.7" />
    </svg>
  );
}

export function Wind(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h11a2.3 2.3 0 1 0-2-3.5" />
      <path d="M3 13h15a2.6 2.6 0 1 1-2.2 4" />
      <path d="M3 18h8" />
    </svg>
  );
}

export function Wrench(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M14.7 6.3a4 4 0 0 0-5.6 5l-6 6L5.5 19.7l6-6a4 4 0 0 0 5-5.6l-2.8 2.8-2-2Z" />
    </svg>
  );
}

export function MoonStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M16.5 4.5a8 8 0 1 0 3 12.4A8.5 8.5 0 0 1 16.5 4.5Z" />
      <path d="M19.5 3v3.4" />
      <path d="M18 4.7h3" />
    </svg>
  );
}

export function Snowflake(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18" />
      <path d="M4.5 7.5l15 9" />
      <path d="M19.5 7.5l-15 9" />
      <path d="M9 5.5 12 3l3 2.5" strokeWidth={STROKE * 0.8} />
      <path d="M9 18.5 12 21l3-2.5" strokeWidth={STROKE * 0.8} />
    </svg>
  );
}

export function FileWarning(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h9l4 4v14H6Z" />
      <path d="M12 9.5v4" />
      <circle cx="12" cy="15.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Filter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4.5h16L14 12.5V19l-4 2v-8.5Z" />
    </svg>
  );
}

export function Route(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="18" r="2.3" />
      <circle cx="18" cy="6" r="2.3" />
      <path d="M8.3 18H15a3 3 0 0 0 3-3v-.5a3 3 0 0 0-3-3H9a3 3 0 0 1-3-3v-.5" />
    </svg>
  );
}

export function Ear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M8.2 14.2c-2.6-1.6-3.1-8.2 2-10.1 4.1-1.7 8.1 1 8.1 5.6 0 3-1.5 4-3 5.5-1 1-1.5 2-1.5 3.5a2.5 2.5 0 0 1-5 0" />
    </svg>
  );
}

export function Zap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3 5 13h5l-1 8 8-10h-5z" />
    </svg>
  );
}

export function History(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12a8 8 0 1 0 2.5-5.8" />
      <path d="M3 4v4.5h4.5" />
      <path d="M12 8v4.3l3 2" />
    </svg>
  );
}

/* ── Decorative / misc ─────────────────────────────────────────────────────── */

/** Replaces the generic 4-point sparkle glyph — see the icon system doc's
    stance against it as the industry-default AI tell. A small asymmetric
    constellation instead: uneven dot sizes, one connecting hairline. */
export function Sparkles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 8l8-2M15 6l2 9" opacity={0.35} strokeWidth={STROKE * 0.7} />
      <circle cx="7" cy="8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="17" cy="15" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Star(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5l2.4 5.3 5.8.6-4.4 4 1.2 5.7L12 16.3l-5 2.8 1.2-5.7-4.4-4 5.8-.6Z" />
    </svg>
  );
}
