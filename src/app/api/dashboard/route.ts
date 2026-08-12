import { NextResponse } from "next/server";
import {
  agentId,
  getClientAccount,
  summarizeCalls,
  toPortalCall,
  toPortalCallFromRetell,
  trendFor,
  type PortalCall,
} from "@/lib/portal";
import { getAssistant, listCalls as listVapiCalls, RETENTION_DAYS } from "@/lib/vapi";
import { getAgent, listCalls as listRetellCalls } from "@/lib/retell";

// Live agent data — must never be cached at build time or between clients.
export const dynamic = "force-dynamic";

const DAY_MS = 86_400_000;

/* Retell has no plan-level retention limit the way Vapi does — verified
   live: a month-plus of history came back with no complaint — so its fetch
   below is intentionally unbounded by date. "All logs" means all logs;
   `limit` is a safety cap against an unbounded account timing out the
   function, not a display window.

   The daily-volume chart still needs *some* bounded number of day-columns
   to stay readable — an all-time chart spanning months would just be an
   unreadable wall of bars — so CHART_WINDOW_DAYS caps the chart and the
   trend comparison specifically, without touching the totals below them,
   which reflect everything fetched.

   Vapi doesn't get this treatment: RETENTION_DAYS already *is* its full
   history (the platform itself won't return anything older), so requesting
   that window already fetches "all logs" for that platform — nothing to
   separate there. */
const CHART_WINDOW_DAYS = 30;

/** GET /api/dashboard — overview for the signed-in client's own agent, on
 *  whichever platform (Vapi or Retell) that agent lives on. The agent id
 *  comes from the user's DB row; nothing here is caller-influenced. */
export async function GET() {
  const account = await getClientAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = agentId(account);
  if (!id) {
    // Provisioned login, but no agent linked yet — a real state during
    // onboarding, so it is a 200 the UI can explain rather than an error.
    return NextResponse.json({ configured: false });
  }

  const now = Date.now();

  try {
    let agentName: string;
    let agentExists: boolean;
    let voice: string | null;
    let language: string | null;
    let calls: PortalCall[];
    /** Only governs the chart/trend window below — never the fetch or the
     *  totals, both of which always reflect everything available. */
    let chartWindowDays: number;

    if (account.provider === "retell") {
      const [agent, fetchedCalls] = await Promise.all([
        getAgent(id),
        // 3000 comfortably covers this account's real total (2,143, verified
        // live) with room to grow. Each extra page costs ~2s against
        // Retell's API — on Vercel's Hobby plan (10s function timeout) that
        // ceiling is real: if an account's history keeps climbing, this cap
        // (or the plan itself) will need revisiting rather than just
        // raised again.
        listRetellCalls(id, { limit: 3000 }),
      ]);
      agentName = agent?.agent_name ?? "Your agent";
      agentExists = agent !== null;
      voice = agent?.voice_id ?? null;
      language = agent?.language ?? null;
      calls = fetchedCalls.map(toPortalCallFromRetell);
      chartWindowDays = CHART_WINDOW_DAYS;
    } else {
      const boundary = now - RETENTION_DAYS * DAY_MS;
      const [assistant, fetchedCalls] = await Promise.all([
        getAssistant(id),
        listVapiCalls(id, { since: new Date(boundary), limit: 1000 }),
      ]);
      agentName = assistant?.name ?? "Your agent";
      agentExists = assistant !== null;
      voice = assistant?.voice?.voiceId ?? null;
      language = assistant?.transcriber?.language ?? null;
      calls = fetchedCalls.map(toPortalCall);
      chartWindowDays = RETENTION_DAYS;
    }

    const stats = summarizeCalls(calls, chartWindowDays);

    // Trend needs a comparable prior period — split the chart window in
    // half (most recent half vs. the half before it) rather than the whole
    // fetched history, so the percentage stays meaningful regardless of how
    // far back the underlying data actually goes.
    const trendWindow = Math.floor(chartWindowDays / 2);
    const canCompareTrend = trendWindow >= 1;
    const recentBoundary = now - trendWindow * DAY_MS;
    const earlierBoundary = now - trendWindow * 2 * DAY_MS;

    const trend = canCompareTrend
      ? (() => {
          const recent: PortalCall[] = [];
          const earlier: PortalCall[] = [];
          for (const call of calls) {
            const ts = call.startedAt ? new Date(call.startedAt).getTime() : null;
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
      agent: {
        // The platform-internal id is intentionally withheld; the client has
        // no use for it and it is an org-internal handle either way.
        name: agentName,
        exists: agentExists,
        voice,
        language,
      },
      stats,
      trend,
      calls,
    });
  } catch (err) {
    // Upstream detail (bad key, rate limit) stays in the server log; the client
    // gets one neutral message either way.
    console.error("[dashboard] failed to load voice-platform data:", err);
    return NextResponse.json(
      { error: "Could not reach the voice platform. Please try again." },
      { status: 502 }
    );
  }
}
