/* Retell REST client — server-only, mirrors vapi.ts's public shape so
 * portal.ts and the dashboard routes can treat both voice platforms the same
 * way. Field names and behavior below were verified against a live Retell
 * account (not assumed from docs alone) — see notes inline where the real
 * response differed from what the docs implied.
 *
 * RETELL_API_KEY is a workspace-wide secret (Retell has no per-agent key
 * scoping — confirmed via docs), so — same as Vapi — every call here must be
 * explicitly filtered by the caller's own agent id; the key itself grants no
 * isolation. */

// Reused from vapi.ts rather than redefined here — one enum per concept, so
// portal.ts's PortalCall.outcome/direction has a single source of truth
// regardless of which platform produced the call.
import type { CallDirection, CallOutcome } from "@/lib/vapi";

const RETELL_BASE = "https://api.retellai.com";

/* ── Wire types (fields actually observed on a live account) ─────────────── */

export type RetellCall = {
  call_id: string;
  agent_id?: string;
  call_type?: "web_call" | "phone_call";
  /** Phone calls only. */
  direction?: "inbound" | "outbound";
  call_status?: "registered" | "not_connected" | "ongoing" | "ended" | "error";
  /** e.g. user_hangup, agent_hangup, voicemail_reached, dial_no_answer,
   *  dial_busy, call_transfer, inactivity — observed live, not exhaustive. */
  disconnection_reason?: string;
  /** Epoch milliseconds — unlike Vapi's ISO strings. */
  start_timestamp?: number;
  end_timestamp?: number;
  duration_ms?: number;
  from_number?: string;
  to_number?: string;
  /** A directly-playable URL when the agent has opt_in_signed_url off
   *  (verified: no auth needed to fetch it in that case). When the agent has
   *  opt_in_signed_url on, this may still require the same short-lived-link
   *  treatment Vapi needs — not yet observed on a live account, so
   *  getRecordingUrl() below flags that case rather than assuming. */
  recording_url?: string;
  transcript?: string;
  call_analysis?: {
    call_summary?: string;
    call_successful?: boolean;
    in_voicemail?: boolean;
  };
  /** Present on agents that inject per-call lead data (e.g. outbound
   *  campaigns) — the only place a customer name tends to live on Retell,
   *  which has no dedicated customer.name field the way Vapi does. */
  retell_llm_dynamic_variables?: Record<string, string>;
};

export type RetellAgent = {
  agent_id: string;
  agent_name?: string;
  voice_id?: string;
  language?: string;
  opt_in_signed_url?: boolean;
};

export class RetellError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "RetellError";
  }
}

/* ── Transport ─────────────────────────────────────────────────────────────── */

async function retellFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) throw new RetellError("RETELL_API_KEY is not set", 500);

  const res = await fetch(`${RETELL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    // Dashboard numbers must reflect calls that landed seconds ago.
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new RetellError(`Retell ${res.status} on ${path}: ${body.slice(0, 300)}`, res.status);
  }
  return res.json() as Promise<T>;
}

/** Returns null when the agent id is unknown to Retell (deleted, or a typo
 *  in the client's record) so the dashboard can render an explanatory empty
 *  state instead of a 500 — same contract as vapi.ts's getAssistant. */
export async function getAgent(id: string): Promise<RetellAgent | null> {
  try {
    return await retellFetch<RetellAgent>(`/get-agent/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof RetellError && (err.status === 404 || err.status === 400)) {
      return null;
    }
    throw err;
  }
}

type ListCallsResponse = {
  items: RetellCall[];
  has_more: boolean;
  pagination_key?: string;
};

/** Calls for one agent, newest first, filtered server-side by agent_id (so
 *  no other client's calls can appear) and optionally by a start_timestamp
 *  range. Paginates via pagination_key up to `limit` total — Retell caps
 *  each page at 1000 and a busy agent can exceed that in the requested
 *  window (observed: 100+ calls in under 3 days on this account), so a
 *  single request isn't always enough the way it is for Vapi. */
export async function listCalls(
  agentId: string,
  { since, limit = 1000 }: { since?: Date; limit?: number } = {}
): Promise<RetellCall[]> {
  const all: RetellCall[] = [];
  let paginationKey: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filter_criteria: {
        agent: [{ agent_id: agentId }],
        ...(since
          ? { start_timestamp: { type: "range", op: "bt", value: [since.getTime(), Date.now()] } }
          : {}),
      },
      limit: Math.min(1000, limit - all.length),
      sort_order: "descending",
      ...(paginationKey ? { pagination_key: paginationKey } : {}),
    };

    const page = await retellFetch<ListCallsResponse>("/v3/list-calls", {
      method: "POST",
      body: JSON.stringify(body),
    });

    all.push(...(page.items ?? []));
    paginationKey = page.has_more ? page.pagination_key : undefined;
  } while (paginationKey && all.length < limit);

  // Defence in depth: never surface a row that isn't this agent's, even if
  // the upstream filter were to regress.
  return all.filter((c) => !c.agent_id || c.agent_id === agentId).slice(0, limit);
}

/** One call by id. Returns null for unknown ids so callers can answer 404
 *  without leaking whether the id exists in another client's account. */
export async function getCall(id: string): Promise<RetellCall | null> {
  try {
    return await retellFetch<RetellCall>(`/v2/get-call/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof RetellError && (err.status === 404 || err.status === 400)) {
      return null;
    }
    throw err;
  }
}

/** Retell's recording_url is directly playable when the agent doesn't opt
 *  into signed URLs (verified live: no auth header needed to fetch it). If
 *  opt_in_signed_url is ever on for an agent, treat that as unsupported for
 *  now rather than silently serving a link that won't actually play — this
 *  hasn't been observed on a real account yet, so it's flagged, not guessed. */
export function getRecordingUrl(call: RetellCall, agent: RetellAgent | null): string | null {
  if (!call.recording_url) return null;
  if (agent?.opt_in_signed_url) return null;
  return call.recording_url;
}

/* ── Derived values ────────────────────────────────────────────────────────── */

const NOT_CONNECTED_REASONS = new Set([
  "dial_no_answer",
  "dial_busy",
  "dial_failed",
  "no_valid_payment",
]);

/** Mirrors vapi.ts's classifyCall for the other platform. Retell's
 *  disconnection_reason already spells out voicemail explicitly, so this
 *  needs less guessing than Vapi's version did. */
export function classifyRetellCall(call: RetellCall): CallOutcome {
  const reason = call.disconnection_reason ?? "";
  if (reason === "voicemail_reached" || call.call_analysis?.in_voicemail) return "voicemail";
  if (call.call_status === "not_connected" || NOT_CONNECTED_REASONS.has(reason)) return "missed";
  const seconds = (call.duration_ms ?? 0) / 1000;
  return seconds >= 15 ? "connected" : "missed";
}

export function callDirection(call: RetellCall): CallDirection {
  if (call.call_type !== "phone_call") return "web";
  return call.direction === "inbound" ? "inbound" : "outbound";
}

/** Retell has no dedicated customer-name field; on lead-driven outbound
 *  campaigns (the only kind seen live so far) it rides along in
 *  retell_llm_dynamic_variables instead. Falls back to null, same as Vapi
 *  calls that never had a name attached — the UI already handles that. */
export function customerName(call: RetellCall): string | null {
  const vars = call.retell_llm_dynamic_variables;
  if (!vars) return null;
  const name = [vars.first_name, vars.last_name].filter(Boolean).join(" ").trim();
  return name || null;
}

export function customerNumber(call: RetellCall): string | null {
  if (call.call_type !== "phone_call") return null;
  return callDirection(call) === "outbound" ? (call.to_number ?? null) : (call.from_number ?? null);
}
