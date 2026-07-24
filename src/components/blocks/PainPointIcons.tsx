import type { SVGProps } from "react";

/* Custom compound icons for the homepage "pain points" grid: a primary shape
   plus a smaller secondary badge. Each pairing is hand-placed per icon (coin
   kissing the tallest bar, bubble beside the headset, briefcase at the
   clock's edge, X-badge on the ribbon) rather than forced into one shared
   slot, so every composition reads as balanced instead of identical.
   STROKE is the target *rendered* line weight; every group sets
   strokeWidth to STROKE / scale so each shape renders at the same visual
   thickness despite the group's own scale factor. */

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

/** Missed Calls = Lost Revenue — ascending bar chart + a coin badge. */
export function MissedRevenueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      {/* Bar chart */}
      <g transform="translate(0, 4) scale(0.8)" strokeWidth={w(0.8)}>
        <path d="M6 20v-5" />
        <path d="M12 20v-9" />
        <path d="M18 20V6" />
      </g>
      {/* Coin badge */}
      <g transform="translate(10, -1) scale(0.55)" strokeWidth={w(0.55)}>
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
}

/** Front Desk Bottlenecks = Inconsistent Intake — headset beside a chat bubble. */
export function FrontDeskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      {/* Headset User */}
      <g transform="translate(-2, 3) scale(0.8)" strokeWidth={w(0.8)}>
        <circle cx="12" cy="8" r="5" />
        <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
        <path d="M4 9a8 8 0 0 1 16 0" /> {/* band */}
        <path d="M20 12v2a3 3 0 0 1-3 3h-3" /> {/* mic boom */}
        <circle cx="13" cy="17" r="1.5" fill="currentColor" stroke="none" /> {/* mic tip */}
      </g>
      {/* Speech Bubble with Waveform */}
      <g transform="translate(10.5, -2) scale(0.6)" strokeWidth={w(0.6)}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M9 9v4" />
        <path d="M12 7v8" />
        <path d="M15 9v4" />
      </g>
    </svg>
  );
}

/** Limited Office Hours = Uncaptured Demand — clock ring + a briefcase filling its face. */
export function OfficeHoursIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      {/* Clock with ticks */}
      <g transform="translate(1, 1) scale(0.9)" strokeWidth={w(0.9)}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        {/* Briefcase inside */}
        <g transform="translate(6, 6) scale(0.5)" strokeWidth={w(0.5 * 0.9)}>
          <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <rect x="2" y="8" width="20" height="14" rx="2" />
        </g>
      </g>
    </svg>
  );
}

/** Manual Call Notes = Poor Visibility — award ribbon + an X-mark badge. */
export function PoorVisibilityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(1, 1) scale(0.9)" strokeWidth={w(0.9)}>
        {/* Ribbons from award */}
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
        
        {/* Scalloped badge replacing the circle, scaled to r=7 and centered at 12,8 */}
        <g transform="translate(3.6, -0.4) scale(0.7)">
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          {/* X inside (centered at 12,12 in this local space) */}
          <path d="M9 9 l6 6" />
          <path d="M15 9 l-6 6" />
        </g>
      </g>
    </svg>
  );
}
