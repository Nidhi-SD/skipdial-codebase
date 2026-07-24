import type { SVGProps } from "react";

/* Custom compound icons for the homepage "pain points" grid.
   Original concepts, restyled to match the Front Desk icon exactly: every
   icon is a primary shape + a smaller companion/badge shape, each dropped
   into the SAME two transform "slots" Front Desk uses (PRIMARY_SLOT /
   SECONDARY_SLOT) at the same stroke width. Reusing identical slots — not
   just matching the stroke width — is what keeps every icon at the same
   footprint, padding, and visual weight. Never hand-tune a size/position per
   icon; both shapes are drawn in the same native ~2–22 coordinate space Lucide
   itself uses, so the shared slot transform lands them consistently. */

const base = {
  xmlns: "http://www.w3.org/2000/svg" as const,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PRIMARY_SLOT = "translate(-0.6, 4.8) scale(0.64)";
const SECONDARY_SLOT = "translate(11, 1.8) scale(0.6)";

/** Missed Calls = Lost Revenue — ascending bar chart + a dollar badge. */
export function MissedRevenueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform={PRIMARY_SLOT}>
        <path d="M5 20V13" />
        <path d="M12 20V8.5" />
        <path d="M19 20V4" />
      </g>
      <g transform={SECONDARY_SLOT}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 8.5h-4a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-4" />
        <path d="M12 5v2.5" />
        <path d="M12 16.5V19" />
      </g>
    </svg>
  );
}

/** Front Desk Bottlenecks = Inconsistent Intake — headset + chat bubble. Master reference. */
export function FrontDeskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform={PRIMARY_SLOT}>
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
      </g>
      <g transform={SECONDARY_SLOT}>
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
      <g transform={PRIMARY_SLOT}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </g>
      <g transform={SECONDARY_SLOT}>
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
      <g transform={PRIMARY_SLOT}>
        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
        <circle cx="12" cy="8" r="6" />
      </g>
      <g transform={SECONDARY_SLOT}>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </g>
    </svg>
  );
}
