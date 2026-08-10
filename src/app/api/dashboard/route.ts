import { NextResponse } from "next/server";
import { getClientAccount, toPortalCall } from "@/lib/portal";
import {
  callTimestampMs,
  getAssistant,
  listCalls,
  RETENTION_DAYS,
  summarizeCalls,
  trendFor,
  type VapiCall,
} from "@/lib/vapi";

// Live agent data — must never be cached at build time or between clients.
export const dynamic = "force-dynamic";

const ALLOWED_RANGES = [7, 14, 30, 90] as const;
const DAY_MS = 86_400_000;

/** GET /api/dashboard?days=30 — overview for the signed-in client's own agent.
 *  The assistant id comes from the user's DB row, so `days` is the only thing
 *  a caller can influence. */
export async function GET(request: Request) {
  const account = await getClientAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!account.vapiAssistantId) {
    // Provisioned login, but no agent linked yet — a real state during
    // onboarding, so it is a 200 the UI can explain rather than an error.
    return NextResponse.json({ configured: false });
  }

  const requested = Number(new URL(request.url).searchParams.get("days"));
  const requestedDays = (ALLOWED_RANGES as readonly number[]).includes(requested)
    ? requested
    : 14;

  // Asking for more history than the plan retains yields nothing but an error,
  // so the window is clamped and the UI is told why the axis is shorter.
  const days = Math.min(requestedDays, RETENTION_DAYS);
  const now = Date.now();
  const boundary = now - days * DAY_MS;

  // A trend needs a full prior period of the same length, and both periods
  // must fit inside the plan's retention — otherwise "previous period" would
  // be partial (missing its earliest days) and the % change would be a lie.
  const canCompareTrend = days * 2 <= RETENTION_DAYS;
  const fetchSince = new Date(canCompareTrend ? now - days * 2 * DAY_MS : boundary);

  try {
    const [assistant, fetchedCalls] = await Promise.all([
      getAssistant(account.vapiAssistantId),
      listCalls(account.vapiAssistantId, { since: fetchSince, limit: 1000 }),
    ]);

    const currentCalls: VapiCall[] = [];
    const previousCalls: VapiCall[] = [];
    for (const call of fetchedCalls) {
      const ts = callTimestampMs(call);
      if (ts === null || ts >= boundary) currentCalls.push(call);
      else if (canCompareTrend) previousCalls.push(call);
    }

    const stats = summarizeCalls(currentCalls, days);
    const trend = canCompareTrend
      ? (() => {
          const prev = summarizeCalls(previousCalls, days);
          return {
            totalCalls: trendFor(stats.totalCalls, prev.totalCalls),
            connected: trendFor(stats.connected, prev.connected),
            totalMinutes: trendFor(stats.totalMinutes, prev.totalMinutes),
          };
        })()
      : null;

    return NextResponse.json({
      configured: true,
      days,
      requestedDays,
      retentionDays: RETENTION_DAYS,
      agent: {
        // The Vapi id itself is intentionally withheld; the client has no use
        // for it and it is an org-internal handle.
        name: assistant?.name ?? "Your agent",
        exists: assistant !== null,
        voice: assistant?.voice?.voiceId ?? null,
        language: assistant?.transcriber?.language ?? null,
      },
      stats,
      trend,
      calls: currentCalls.map(toPortalCall),
    });
  } catch (err) {
    // Upstream detail (bad key, rate limit) stays in the server log; the client
    // gets one neutral message either way.
    console.error("[dashboard] failed to load Vapi data:", err);
    return NextResponse.json(
      { error: "Could not reach the voice platform. Please try again." },
      { status: 502 }
    );
  }
}
