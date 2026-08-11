import { NextResponse } from "next/server";
import { getClientAccount, toPortalCallDetail, toPortalCallDetailFromRetell } from "@/lib/portal";
import { getCall as getVapiCall } from "@/lib/vapi";
import { getCall as getRetellCall } from "@/lib/retell";

export const dynamic = "force-dynamic";

/** GET /api/dashboard/calls/:id — transcript + recording for one call, on
 *  whichever platform the signed-in client's agent lives on.
 *
 *  The id here *is* attacker-controlled, so ownership is re-checked against
 *  the signed-in user's own agent before anything is returned. A call
 *  belonging to another client (or the wrong platform) is answered with 404,
 *  not 403, so this route cannot be used to probe which call ids exist. */
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
      return NextResponse.json(toPortalCallDetailFromRetell(call));
    }

    if (!account.vapiAssistantId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const call = await getVapiCall(params.id);
    if (!call || call.assistantId !== account.vapiAssistantId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(toPortalCallDetail(call));
  } catch (err) {
    console.error("[dashboard] failed to load call:", err);
    return NextResponse.json(
      { error: "Could not load this call." },
      { status: 502 }
    );
  }
}
