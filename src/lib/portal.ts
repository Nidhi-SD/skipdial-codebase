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
  type VapiCall,
} from "@/lib/vapi";
import {
  callDirection as retellDirection,
  classifyRetellCall,
  customerName as retellCustomerName,
  customerNumber as retellCustomerNumber,
  type RetellCall,
} from "@/lib/retell";

// Re-exported so existing server-side imports (API routes) keep working
// unchanged. The actual definitions live in dashboard-stats.ts, which has no
// server-only imports (no auth, no Prisma) — that's what lets client
// components import the *same* aggregation logic directly, to re-derive
// stats from an already-fetched, filtered call list without a round-trip.
export {
  type PortalCall,
  type PortalCallDetail,
  type DashboardStats,
  type Trend,
  trendFor,
  summarizeCalls,
} from "@/lib/dashboard-stats";
import type { PortalCall, PortalCallDetail } from "@/lib/dashboard-stats";

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

/* ── Raw provider call → wire shape ──────────────────────────────────────────
   Raw provider call objects carry vendor-internal fields (orgId, cost, full
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
