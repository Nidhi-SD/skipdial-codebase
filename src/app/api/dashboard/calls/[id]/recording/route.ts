import { NextResponse } from "next/server";
import { getClientAccount } from "@/lib/portal";
import { getCall, getRecordingRedirectUrl } from "@/lib/vapi";

export const dynamic = "force-dynamic";

/** GET /api/dashboard/calls/:id/recording — redirects to a short-lived signed
 *  URL for this call's recording.
 *
 *  The call object's own `recordingUrl` is just this account's private-bucket
 *  path, not something a browser can load directly; Vapi's per-call endpoint
 *  is the only way to get a link that actually plays. Kept as a redirect
 *  (rather than proxying the audio bytes) so range requests — scrubbing —
 *  still work against Vapi's signed URL.
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
  if (!account.vapiAssistantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const call = await getCall(params.id);
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
