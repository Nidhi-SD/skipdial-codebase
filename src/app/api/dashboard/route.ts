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

/** GET /api/dashboard — overview for the signed-in client's own agent, on
 *  whichever platform (Vapi or Retell) that agent lives on. Always the full
 *  window RETENTION_DAYS covers (no client-selectable range). The agent id
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

  const days = RETENTION_DAYS;
  const now = Date.now();
  const boundary = now - days * DAY_MS;

  // A trend needs a comparable prior period, but the display window already
  // spends the plan's entire retention — there's nothing further back to
  // fetch. So the trend compares the two halves of the *same* fetched
  // window (most recent half vs. the half before it) instead of asking for
  // more history than there is.
  const trendWindow = Math.floor(days / 2);
  const canCompareTrend = trendWindow >= 1;
  const recentBoundary = now - trendWindow * DAY_MS;
  const earlierBoundary = now - trendWindow * 2 * DAY_MS;

  try {
    let agentName: string;
    let agentExists: boolean;
    let voice: string | null;
    let language: string | null;
    let calls: PortalCall[];

    if (account.provider === "retell") {
      const [agent, fetchedCalls] = await Promise.all([
        getAgent(id),
        listRetellCalls(id, { since: new Date(boundary), limit: 1000 }),
      ]);
      agentName = agent?.agent_name ?? "Your agent";
      agentExists = agent !== null;
      voice = agent?.voice_id ?? null;
      language = agent?.language ?? null;
      calls = fetchedCalls.map(toPortalCallFromRetell);
    } else {
      const [assistant, fetchedCalls] = await Promise.all([
        getAssistant(id),
        listVapiCalls(id, { since: new Date(boundary), limit: 1000 }),
      ]);
      agentName = assistant?.name ?? "Your agent";
      agentExists = assistant !== null;
      voice = assistant?.voice?.voiceId ?? null;
      language = assistant?.transcriber?.language ?? null;
      calls = fetchedCalls.map(toPortalCall);
    }

    const stats = summarizeCalls(calls, days);

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
      days,
      retentionDays: RETENTION_DAYS,
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
