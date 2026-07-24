import type { SVGProps } from "react";

/* Custom compound icons for the homepage "pain points" grid: a primary shape
   plus a smaller secondary badge. Each pairing is hand-placed per icon (coin
   kissing the tallest bar, bubble beside the headset, briefcase at the
   clock's edge, X-badge on the ribbon) rather than forced into one shared
   slot, so every composition reads as balanced instead of identical.
   STROKE is the target *rendered* line weight; every group sets
   strokeWidth to STROKE / scale so each shape renders at the same visual
   thickness despite the group's own scale factor. */

const STROKE = 1.5;
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

/** Missed Calls = Lost Revenue — ascending bar chart + a coin badge. */
export function MissedRevenueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(-0.25, 5) scale(0.75)" strokeWidth={w(0.75)}>
        <path d="M5 20V13" />
        <path d="M12 20V8.5" />
        <path d="M19 20V4" />
      </g>
      <g transform="translate(12.4, 0.4) scale(0.467)" strokeWidth={w(0.467)}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 8.5h-4a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-4" />
        <path d="M12 5v2.5" />
        <path d="M12 16.5V19" />
      </g>
    </svg>
  );
}

/** Front Desk Bottlenecks = Inconsistent Intake — headset beside a chat bubble. */
export function FrontDeskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(0.14, 3.76) scale(0.62)" strokeWidth={w(0.62)}>
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
      </g>
      <g transform="translate(12.1, 10.08) scale(0.46)" strokeWidth={w(0.46)}>
        <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
        <path d="M8 13h.01" />
        <path d="M12 13h.01" />
        <path d="M16 13h.01" />
      </g>
    </svg>
  );
}

/** Limited Office Hours = Uncaptured Demand — clock ring + a briefcase filling its face. */
export function OfficeHoursIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(2.04, 1.84) scale(0.68)" strokeWidth={w(0.68)}>
        <circle cx="12" cy="12" r="10" />
      </g>
      <g transform="translate(3.76, 7.76) scale(0.62)" strokeWidth={w(0.62)}>
        <path d="M12 12h.01" />
        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M22 13a18.15 18.15 0 0 1-20 0" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </g>
    </svg>
  );
}

/** Manual Call Notes = Poor Visibility — award ribbon + an X-mark badge. */
export function PoorVisibilityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(-1.32, 2.56) scale(0.72)" strokeWidth={w(0.72)}>
        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
        <circle cx="12" cy="8" r="6" />
      </g>
      <g transform="translate(9.22, 1.72) scale(0.44)" strokeWidth={w(0.44)}>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </g>
    </svg>
  );
}
