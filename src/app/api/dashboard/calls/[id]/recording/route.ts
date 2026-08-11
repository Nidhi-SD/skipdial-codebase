import { NextResponse } from "next/server";
import { getClientAccount } from "@/lib/portal";
import { getCall as getVapiCall, getRecordingRedirectUrl } from "@/lib/vapi";
import { getAgent, getCall as getRetellCall, getRecordingUrl } from "@/lib/retell";

export const dynamic = "force-dynamic";

/** GET /api/dashboard/calls/:id/recording — redirects to a URL the browser
 *  can actually play, on whichever platform the signed-in client's agent
 *  lives on.
 *
 *  Vapi: the call object's own `recordingUrl` is just this account's
 *  private-bucket path, so a dedicated per-call endpoint is the only way to
 *  get a short-lived signed URL. Retell: `recording_url` is directly
 *  playable when the agent doesn't opt into signed URLs (verified live) —
 *  so it's used as-is; getRecordingUrl() withholds it otherwise rather than
 *  serving a link that won't actually play.
 *
 *  Same ownership check as the call-detail route: unknown/foreign call ids
 *  answer 404, never 403, so this can't be used to probe which ids exist. */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const account = await getClientAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (account.provider === "retell") {
      if (!account.retellAgentId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const call = await getRetellCall(params.id);
      if (!call || call.agent_id !== account.retellAgentId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const agent = await getAgent(account.retellAgentId);
      const url = getRecordingUrl(call, agent);
      if (!url) {
        return NextResponse.json({ error: "No recording for this call." }, { status: 404 });
      }
      return NextResponse.redirect(url, 302);
    }

    if (!account.vapiAssistantId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const call = await getVapiCall(params.id);
    if (!call || call.assistantId !== account.vapiAssistantId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const signedUrl = await getRecordingRedirectUrl(params.id);
    if (!signedUrl) {
      return NextResponse.json({ error: "No recording for this call." }, { status: 404 });
    }

    return NextResponse.redirect(signedUrl, 302);
  } catch (err) {
    console.error("[dashboard] failed to load recording:", err);
    return NextResponse.json(
      { error: "Could not load this recording." },
      { status: 502 }
    );
  }
}
