/* Platform-agnostic dashboard aggregation — deliberately has zero server-only
 * imports (no auth, no Prisma) so it can be shared between the API routes
 * (via portal.ts, which re-exports this) and client components, which need
 * the exact same math to re-aggregate a filtered subset of already-fetched
 * calls without a round-trip to the server.
 *
 * `PortalCall` is the one wire shape every route funnels through regardless
 * of platform (Vapi/Retell); everything here operates on that shape only. */

import type { CallDirection, CallOutcome } from "@/lib/vapi";

export type PortalCall = {
  id: string;
  direction: CallDirection;
  outcome: CallOutcome;
  startedAt: string | null;
  durationSeconds: number;
  customerNumber: string | null;
  customerName: string | null;
  hasRecording: boolean;
  summary: string | null;
};

export type PortalCallDetail = PortalCall & {
  recordingUrl: string | null;
  transcript: string | null;
  endedReason: string | null;
};

export type DashboardStats = {
  totalCalls: number;
  connected: number;
  voicemail: number;
  missed: number;
  /** connected / total, 0–100, rounded. */
  connectRate: number;
  totalMinutes: number;
  avgDurationSeconds: number;
  byDirection: Record<CallDirection, number>;
  /** One bucket per day in range, oldest → newest, for the volume chart. */
  daily: { date: string; label: string; connected: number; missed: number; total: number }[];
};

export type Trend = {
  current: number;
  previous: number;
  /** null when there's no prior period to compare against (previous === 0) —
   *  a % change against zero is undefined, not "∞%" or "0%". */
  changePct: number | null;
};

export function trendFor(current: number, previous: number): Trend {
  return {
    current,
    previous,
    changePct: previous > 0 ? Math.round(((current - previous) / previous) * 100) : null,
  };
}

export const DAY_MS = 86_400_000;

/* SkipDial's own business timezone (Phoenix, AZ — fixed UTC-7, no DST), used
   to bucket the volume chart by the calendar day a client actually
   experienced a call on. Individual clients aren't necessarily in Arizona,
   but there's no per-client timezone on the User row today, and this is a
   sharper default than UTC, which lines up with no one's clock. */
export const DASHBOARD_TIME_ZONE = "America/Phoenix";

export function dayKey(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DASHBOARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Aggregates a call list into everything the dashboard renders — the stat
 *  cards, the outcome/channel composition, and the daily-volume chart's
 *  buckets. `days` governs only how many day-buckets the chart pre-seeds
 *  (ending "today"); every call in `calls` still counts toward the summary
 *  totals regardless of whether its date falls inside that window — a call
 *  older than the chart's range is simply not its own bar.
 *
 *  Cost is deliberately excluded — vendor spend is not the client's price,
 *  and must not be exposed in the client portal (PortalCall never carries it). */
export function summarizeCalls(calls: PortalCall[], days: number): DashboardStats {
  let connected = 0;
  let voicemail = 0;
  let missed = 0;
  let totalSeconds = 0;

  const byDirection: Record<CallDirection, number> = { inbound: 0, outbound: 0, web: 0 };

  // Pre-seed one bucket per day so quiet days render as gaps in the chart
  // rather than disappearing and compressing the time axis.
  const buckets = new Map<string, { connected: number; missed: number; total: number }>();
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    buckets.set(dayKey(new Date(today.getTime() - i * DAY_MS)), {
      connected: 0,
      missed: 0,
      total: 0,
    });
  }

  for (const call of calls) {
    if (call.outcome === "connected") connected++;
    else if (call.outcome === "voicemail") voicemail++;
    else missed++;

    totalSeconds += call.durationSeconds;
    byDirection[call.direction]++;

    const ts = call.startedAt ? new Date(call.startedAt).getTime() : null;
    if (ts !== null) {
      const bucket = buckets.get(dayKey(new Date(ts)));
      if (bucket) {
        bucket.total++;
        if (call.outcome === "connected") bucket.connected++;
        else bucket.missed++;
      }
    }
  }

  const totalCalls = calls.length;

  return {
    totalCalls,
    connected,
    voicemail,
    missed,
    connectRate: totalCalls ? Math.round((connected / totalCalls) * 100) : 0,
    totalMinutes: Math.round(totalSeconds / 60),
    avgDurationSeconds: totalCalls ? Math.round(totalSeconds / totalCalls) : 0,
    byDirection,
    daily: Array.from(buckets.entries()).map(([date, v]) => ({
      date,
      label: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      ...v,
    })),
  };
}
