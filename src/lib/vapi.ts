/* Vapi REST client — server-only.
 *
 * VAPI_API_KEY is a *private* key: it can read and mutate every assistant in
 * the org, so it must never reach the browser. Everything here runs inside
 * route handlers / server components, and callers are expected to have already
 * resolved the assistant id from the signed-in user's DB row rather than from
 * request input. */

const VAPI_BASE = "https://api.vapi.ai";

/* Vapi enforces a call-history retention window per subscription plan, and
   rejects `createdAtGe` values older than it with a 400. The live account is
   on a 14-day plan; override via env if the plan changes rather than editing
   this file. */
export const RETENTION_DAYS = Math.max(
  1,
  Number(process.env.VAPI_RETENTION_DAYS) || 14
);

/* ── Wire types ────────────────────────────────────────────────────────────── */

export type VapiCall = {
  id: string;
  assistantId?: string;
  /** "inboundPhoneCall" | "outboundPhoneCall" | "webCall" */
  type?: string;
  status?: string;
  endedReason?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt?: string;
  cost?: number;
  transcript?: string;
  recordingUrl?: string;
  summary?: string;
  customer?: { number?: string; name?: string };
  /* Vapi returns `[]` here when no analysis plan is configured, and an object
     when one is — hence the union; use `callAnalysis()` to read it safely. */
  analysis?:
    | { summary?: string; successEvaluation?: string; structuredData?: unknown }
    | unknown[];
};

export type VapiAssistant = {
  id: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  firstMessage?: string;
  model?: { model?: string; provider?: string };
  voice?: { voiceId?: string; provider?: string };
  transcriber?: { model?: string; provider?: string; language?: string };
};

export class VapiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "VapiError";
  }
}

/* ── Transport ─────────────────────────────────────────────────────────────── */

async function vapiFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) throw new VapiError("VAPI_API_KEY is not set", 500);

  const res = await fetch(`${VAPI_BASE}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    // Dashboard numbers must reflect calls that landed seconds ago, so this
    // opts out of Next's default fetch caching entirely.
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new VapiError(
      `Vapi ${res.status} on ${path}: ${body.slice(0, 300)}`,
      res.status
    );
  }
  return res.json() as Promise<T>;
}

/** Returns null when the assistant id is unknown to Vapi (deleted, or a typo
 *  in the client's record) so the dashboard can render an explanatory empty
 *  state instead of a 500. */
export async function getAssistant(id: string): Promise<VapiAssistant | null> {
  try {
    return await vapiFetch<VapiAssistant>(`/assistant/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof VapiError && (err.status === 404 || err.status === 400)) {
      return null;
    }
    throw err;
  }
}

/** Calls for one assistant, newest first. The assistantId filter is applied by
 *  Vapi server-side — verified against the live API — so no other client's
 *  calls can appear in the response. */
export async function listCalls(
  assistantId: string,
  { since, limit = 100 }: { since?: Date; limit?: number } = {}
): Promise<VapiCall[]> {
  const safeLimit = String(Math.min(Math.max(limit, 1), 1000));

  const query = (from?: Date) => {
    const params = new URLSearchParams({ assistantId, limit: safeLimit });
    if (from) params.set("createdAtGe", from.toISOString());
    return `/call?${params.toString()}`;
  };

  let calls: VapiCall[];
  try {
    calls = await vapiFetch<VapiCall[]>(query(since));
  } catch (err) {
    // If the requested window predates the plan's retention, Vapi 400s rather
    // than clamping. Retry unfiltered and narrow in memory, so a plan change
    // never takes the dashboard down.
    const retentionRejected =
      err instanceof VapiError &&
      err.status === 400 &&
      /retention|subscription plan/i.test(err.message);
    if (!retentionRejected) throw err;

    calls = await vapiFetch<VapiCall[]>(query());
    if (since) {
      const floor = since.getTime();
      calls = calls.filter((c) => {
        const stamp = c.createdAt ?? c.startedAt;
        return !stamp || new Date(stamp).getTime() >= floor;
      });
    }
  }

  if (!Array.isArray(calls)) return [];

  // Defence in depth: never surface a row that isn't this assistant's, even if
  // the upstream filter were to regress.
  return calls.filter((c) => !c.assistantId || c.assistantId === assistantId);
}

/** One call by id. Returns null for unknown ids so callers can answer 404
 *  without leaking whether the id exists in another client's account. */
export async function getCall(id: string): Promise<VapiCall | null> {
  try {
    return await vapiFetch<VapiCall>(`/call/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof VapiError && (err.status === 404 || err.status === 400)) {
      return null;
    }
    throw err;
  }
}

/* ── Derived values ────────────────────────────────────────────────────────── */

export function callDurationSeconds(call: VapiCall): number {
  if (!call.startedAt || !call.endedAt) return 0;
  const ms = new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime();
  return Number.isFinite(ms) && ms > 0 ? ms / 1000 : 0;
}

/** Analysis is only present when the assistant has an analysis plan; this
 *  normalises Vapi's empty-array-vs-object response into one shape. */
export function callAnalysis(
  call: VapiCall
): { summary?: string; successEvaluation?: string } | null {
  const a = call.analysis;
  if (!a || Array.isArray(a)) return null;
  return a;
}

export type CallOutcome = "connected" | "voicemail" | "missed";

/* Observed on the live account: customer-ended-call, assistant-said-end-call-
   phrase, voicemail, silence-timed-out, call.in-progress.error-*. */
const CONNECTED_REASONS = new Set([
  "customer-ended-call",
  "assistant-said-end-call-phrase",
  "assistant-ended-call",
  "assistant-forwarded-call",
  "customer-ended-call-after-transfer",
]);

const VOICEMAIL_REASONS = new Set(["voicemail", "assistant-said-message-to-voicemail"]);

/** A conversation actually happened vs. it hit an inbox vs. it never connected.
 *  Unknown reasons fall back to duration, so a new Vapi reason string degrades
 *  to a sensible answer instead of silently counting as missed. */
export function classifyCall(call: VapiCall): CallOutcome {
  const reason = call.endedReason ?? "";
  if (VOICEMAIL_REASONS.has(reason)) return "voicemail";
  if (CONNECTED_REASONS.has(reason)) return "connected";
  if (reason.includes("no-answer") || reason.includes("busy") || reason.startsWith("call.in-progress.error")) {
    return "missed";
  }
  return callDurationSeconds(call) >= 15 ? "connected" : "missed";
}

export type CallDirection = "inbound" | "outbound" | "web";

export function callDirection(call: VapiCall): CallDirection {
  if (call.type === "inboundPhoneCall") return "inbound";
  if (call.type === "outboundPhoneCall") return "outbound";
  return "web";
}

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

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Vapi calls carry both `startedAt` (set once the call connects) and
 *  `createdAt` (set the instant the call was queued); this is the one place
 *  that picks between them so every caller buckets a given call the same way. */
export function callTimestampMs(call: VapiCall): number | null {
  const stamp = call.startedAt ?? call.createdAt;
  return stamp ? new Date(stamp).getTime() : null;
}

/** Aggregates a call list into everything the dashboard renders. Cost is
 *  deliberately excluded — `call.cost` is SkipDial's vendor spend, not the
 *  client's price, and must not be exposed in the client portal. */
export function summarizeCalls(calls: VapiCall[], days: number): DashboardStats {
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
    const outcome = classifyCall(call);
    if (outcome === "connected") connected++;
    else if (outcome === "voicemail") voicemail++;
    else missed++;

    totalSeconds += callDurationSeconds(call);
    byDirection[callDirection(call)]++;

    const ts = callTimestampMs(call);
    if (ts !== null) {
      const bucket = buckets.get(dayKey(new Date(ts)));
      if (bucket) {
        bucket.total++;
        if (outcome === "connected") bucket.connected++;
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
