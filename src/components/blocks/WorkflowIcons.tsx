import type { SVGProps } from "react";

/* Custom icons for the WorkflowBeam call-routing panel — replaces the raw
   lucide imports (PhoneIncoming, Users) and the stock "technical-support.png"
   agent illustration with marks drawn to the same compound-icon convention as
   PainPointIcons.tsx (a target *rendered* stroke weight compensated per group
   scale via STROKE/w, currentColor throughout so state-driven fills/colors
   in WorkflowNode still apply). The agent mark is SkipDial's own signal glyph
   — a waveform, not a headset photo — since it's standing in for the product,
   not a support-desk stock icon. */

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

/** Inbound Call — handset silhouette + two ringing arcs + a signal dot. */
export function InboundCallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(0.5, 3) scale(0.82)" strokeWidth={w(0.82)}>
        <path d="M4.5 4.8C4.2 3.8 5 3 6 3.2l3 .7c.7.2 1.1.9.9 1.6l-.9 3a1.3 1.3 0 0 1-1.9.8l-1.4-.8c-.6 2.9 1.6 6.4 4.5 7.9l.8-1.4a1.3 1.3 0 0 1 1.9-.5l2.6 1.8c.6.4.8 1.2.4 1.8l-1.7 2.5c-.4.6-1.1.9-1.8.7C6.7 19.9 2.1 12.9 4.5 4.8Z" />
      </g>
      <path d="M14.4 3.4A7.2 7.2 0 0 1 21 10" strokeWidth={STROKE * 0.75} opacity={0.5} />
      <path d="M15.2 6.7a3.9 3.9 0 0 1 3.6 3.6" strokeWidth={STROKE * 0.85} opacity={0.8} />
      <circle cx="19.5" cy="10" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** SkipDial Agent — the system's Signal Mark: a 3-bar waveform topped with a
    node dot, standing in for the product instead of a stock support icon. */
export function SkipDialAgentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g strokeWidth={STROKE * 1.15}>
        <path d="M8 15v-4" />
        <path d="M12 16.5v-9" />
        <path d="M16 15v-4" />
      </g>
      <circle cx="12" cy="6" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** CRM Sync — a people cluster: front figure solid, back figure a soft
    keyline, implying record depth rather than a flat two-person glyph. */
export function CrmSyncIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <g strokeWidth={STROKE * 0.95}>
        <circle cx="8.5" cy="8" r="3.1" />
        <path d="M3.8 19c.3-3 2.3-5 4.7-5s4.4 2 4.7 5" />
      </g>
      <g strokeWidth={STROKE * 0.95} opacity={0.6}>
        <circle cx="15.5" cy="9" r="3.1" fill="currentColor" fillOpacity={0.16} />
        <path d="M11.6 19c.3-2.7 2-4.6 3.9-4.6s3.6 1.9 3.9 4.6" />
      </g>
    </svg>
  );
}
