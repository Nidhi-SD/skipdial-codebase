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

const DAY_MS = 86_400_000;

/** GET /api/dashboard — overview for the signed-in client's own agent.
 *  Always the full window the plan retains (no client-selectable range —
 *  Vapi's retention is the real ceiling, so a picker just invited requests
 *  that silently clamped anyway). The assistant id comes from the user's DB
 *  row; nothing here is caller-influenced. */
export async function GET() {
  const account = await getClientAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!account.vapiAssistantId) {
    // Provisioned login, but no agent linked yet — a real state during
    // onboarding, so it is a 200 the UI can explain rather than an error.
    return NextResponse.json({ configured: false });
  }

  const days = RETENTION_DAYS;
  const now = Date.now();
  const boundary = now - days * DAY_MS;

  // A trend needs a comparable prior period, but the display window already
  // spends the plan's entire retention — there's nothing further back to
  // fetch. So the trend compares the two halves of the *same* fetched
  // window (most recent half vs. the half before it) instead of asking Vapi
  // for more history than it has.
  const trendWindow = Math.floor(days / 2);
  const canCompareTrend = trendWindow >= 1;
  const recentBoundary = now - trendWindow * DAY_MS;
  const earlierBoundary = now - trendWindow * 2 * DAY_MS;

  try {
    const [assistant, fetchedCalls] = await Promise.all([
      getAssistant(account.vapiAssistantId),
      listCalls(account.vapiAssistantId, { since: new Date(boundary), limit: 1000 }),
    ]);

    const stats = summarizeCalls(fetchedCalls, days);

    const trend = canCompareTrend
      ? (() => {
          const recent: VapiCall[] = [];
          const earlier: VapiCall[] = [];
          for (const call of fetchedCalls) {
            const ts = callTimestampMs(call);
            if (ts === null) continue;
            if (ts >= recentBoundary) recent.push(call);
            else if (ts >= earlierBoundary) earlier.push(call);
            // else: older than the comparable window — still counted in
            // `stats` above, just excluded from the trend comparison.
          }
          const cur = summarizeCalls(recent, trendWindow);
          const prev = summarizeCalls(earlier, trendWindow);
          return {
            totalCalls: trendFor(cur.totalCalls, prev.totalCalls),
            connected: trendFor(cur.connected, prev.connected),
            totalMinutes: trendFor(cur.totalMinutes, prev.totalMinutes),
          };
        })()
      : null;

    return NextResponse.json({
      configured: true,
      days,
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
      calls: fetchedCalls.map(toPortalCall),
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
