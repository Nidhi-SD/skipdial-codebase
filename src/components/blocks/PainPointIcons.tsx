import type { SVGProps } from "react";

/* Custom compound icons for the homepage "pain points" grid — each pairs a
   primary glyph with a smaller accent mark (badge/companion icon), matching
   the more illustrative icon style used on the reference site rather than
   a single flat Lucide glyph. Same default attributes as Lucide (24x24,
   currentColor stroke, round caps/joins) so they inherit color/hover exactly
   like the icons they replace — just a touch thinner (1.6) since these carry
   more internal detail than a single-glyph icon. */

const base = {
  xmlns: "http://www.w3.org/2000/svg" as const,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Missed Calls = Lost Revenue — ascending bar chart with a dollar badge. */
export function MissedRevenueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="2.6" y="13.6" width="3.3" height="7.4" rx="1" />
      <rect x="7.6" y="9.6" width="3.3" height="11.4" rx="1" />
      <rect x="12.6" y="6.4" width="3.3" height="14.6" rx="1" />
      <circle cx="18.6" cy="6.2" r="4.1" />
      <path d="M19.9 4.7h-1.9a1.1 1.1 0 1 0 0 2.2h1.1a1.1 1.1 0 1 1 0 2.2h-2.1" />
      <path d="M18.6 9.5V3.9" />
    </svg>
  );
}

/** Front Desk Bottlenecks = Inconsistent Intake — headset + chat bubble. */
export function FrontDeskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(-0.4, 4.6) scale(0.62)">
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
      </g>
      <g transform="translate(10.5, 2) scale(0.58)">
        <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
        <path d="M7 11h10" />
        <path d="M7 15h6" />
      </g>
    </svg>
  );
}

/** Limited Office Hours = Uncaptured Demand — clock face + briefcase badge. */
export function OfficeHoursIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="10.5" r="8" />
      <path d="M11 6v4.5l3.2 1.8" />
      <path d="M11 2.6v1.4" />
      <path d="M19.4 10.5H18" />
      <path d="M3 10.5h1.4" />
      <g transform="translate(7.2, 12.6) scale(0.4)">
        <path d="M12 12h.01" />
        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </g>
    </svg>
  );
}

/** Manual Call Notes = Poor Visibility — award ribbon with a void/X mark. */
export function PoorVisibilityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
      <path d="m9.5 5.5 5 5" />
      <path d="m14.5 5.5-5 5" />
    </svg>
  );
}
