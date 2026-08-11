/* Client-portal account resolution — the single place that answers
   "which voice-platform agent is this request allowed to read?".

   Every dashboard route funnels through here, so the answer always comes from
   the signed-in user's DB row and never from a query param or request body.
   One client owns exactly one agent, on exactly one platform. */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  callAnalysis,
  callDirection,
  callDurationSeconds,
  classifyCall,
  type CallDirection,
  type CallOutcome,
  type VapiCall,
} from "@/lib/vapi";
import {
  callDirection as retellDirection,
  classifyRetellCall,
  customerName as retellCustomerName,
  customerNumber as retellCustomerNumber,
  type RetellCall,
} from "@/lib/retell";

export type ClientAccount = {
  name: string | null;
  email: string;
  company: string | null;
  role: string;
  /** "vapi" | "retell" — picks which of the two id columns below is
   *  authoritative; the other stays null. */
  provider: string;
  vapiAssistantId: string | null;
  retellAgentId: string | null;
};

/** Returns null when there is no valid session or the user row has vanished. */
export async function getClientAccount(): Promise<ClientAccount | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      email: true,
      company: true,
      role: true,
      provider: true,
      vapiAssistantId: true,
      retellAgentId: true,
    },
  });

  return user ?? null;
}

/** The one agent id this account owns, regardless of platform — the value
 *  every dashboard route actually needs to decide "is an agent linked yet." */
export function agentId(account: ClientAccount): string | null {
  return account.provider === "retell" ? account.retellAgentId : account.vapiAssistantId;
}

/** Human label for the portal header — company if we have one, else the
 *  person's name, else the local part of their email. */
export function accountLabel(account: ClientAccount): string {
  return account.company || account.name || account.email.split("@")[0];
}

/* ── Wire shape sent to the browser — identical regardless of platform ──────── */

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

/* Raw provider call objects carry vendor-internal fields (orgId, cost, full
   agent config, etc.) — none of which belongs in a client's browser. These
   projections are the only shapes that leave the server, and every route
   converts through one of them before responding. */

/** Vapi/Retell both send "" rather than omitting empty text fields;
 *  collapsing those to null keeps "is there a summary?" a single check in
 *  the UI. */
function orNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toPortalCall(call: VapiCall): PortalCall {
  return {
    id: call.id,
    direction: callDirection(call),
    outcome: classifyCall(call),
    startedAt: call.startedAt ?? call.createdAt ?? null,
    durationSeconds: Math.round(callDurationSeconds(call)),
    customerNumber: orNull(call.customer?.number),
    customerName: orNull(call.customer?.name),
    hasRecording: Boolean(call.recordingUrl),
    summary: orNull(call.summary) ?? orNull(callAnalysis(call)?.summary),
  };
}

export function toPortalCallDetail(call: VapiCall): PortalCallDetail {
  return {
    ...toPortalCall(call),
    recordingUrl: orNull(call.recordingUrl),
    transcript: orNull(call.transcript),
    endedReason: orNull(call.endedReason),
  };
}

export function toPortalCallFromRetell(call: RetellCall): PortalCall {
  return {
    id: call.call_id,
    direction: retellDirection(call),
    outcome: classifyRetellCall(call),
    startedAt: call.start_timestamp ? new Date(call.start_timestamp).toISOString() : null,
    durationSeconds: Math.round((call.duration_ms ?? 0) / 1000),
    customerNumber: retellCustomerNumber(call),
    customerName: retellCustomerName(call),
    hasRecording: Boolean(call.recording_url),
    summary: orNull(call.call_analysis?.call_summary),
  };
}

export function toPortalCallDetailFromRetell(call: RetellCall): PortalCallDetail {
  return {
    ...toPortalCallFromRetell(call),
    // The presence check the UI gates the recording player on — not
    // necessarily a directly-playable link (see the /recording route, which
    // resolves the actual URL, same as it does for Vapi's private-bucket
    // path).
    recordingUrl: orNull(call.recording_url),
    transcript: orNull(call.transcript),
    endedReason: orNull(call.disconnection_reason),
  };
}

/* ── Dashboard aggregation — platform-agnostic ───────────────────────────────
   Lived in vapi.ts until a second platform existed; it only ever touched
   fields PortalCall already normalizes, so it operates on PortalCall[] here
   and produces identical results regardless of which platform the calls
   came from. */

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

const DAY_MS = 86_400_000;

/* SkipDial's own business timezone (Phoenix, AZ — fixed UTC-7, no DST), used
   to bucket the volume chart by the calendar day a client actually
   experienced a call on. Individual clients aren't necessarily in Arizona,
   but there's no per-client timezone on the User row today, and this is a
   sharper default than UTC, which lines up with no one's clock. */
const DASHBOARD_TIME_ZONE = "America/Phoenix";

function dayKey(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DASHBOARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Aggregates a call list into everything the dashboard renders. Cost is
 *  deliberately excluded — vendor spend is not the client's price, and must
 *  not be exposed in the client portal (PortalCall never carries it). */
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
