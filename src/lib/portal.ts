/* Client-portal account resolution — the single place that answers
   "which Vapi assistant is this request allowed to read?".

   Every dashboard route funnels through here, so the answer always comes from
   the signed-in user's DB row and never from a query param or request body.
   One client owns exactly one assistant. */

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

export type ClientAccount = {
  name: string | null;
  email: string;
  company: string | null;
  role: string;
  vapiAssistantId: string | null;
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
      vapiAssistantId: true,
    },
  });

  return user ?? null;
}

/** Human label for the portal header — company if we have one, else the
 *  person's name, else the local part of their email. */
export function accountLabel(account: ClientAccount): string {
  return account.company || account.name || account.email.split("@")[0];
}

/* ── Wire shape sent to the browser ────────────────────────────────────────── */

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

/* Raw Vapi call objects carry orgId, cost, vendor cost breakdowns and the full
   assistant config — none of which belongs in a client's browser. These two
   projections are the only shapes that leave the server. */

/** Vapi sends "" rather than omitting empty text fields; collapsing those to
 *  null keeps "is there a summary?" a single check in the UI. */
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
