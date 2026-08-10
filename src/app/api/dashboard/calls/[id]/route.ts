import { NextResponse } from "next/server";
import { getClientAccount, toPortalCallDetail } from "@/lib/portal";
import { getCall } from "@/lib/vapi";

export const dynamic = "force-dynamic";

/** GET /api/dashboard/calls/:id — transcript + recording for one call.
 *
 *  The id here *is* attacker-controlled, so ownership is re-checked against
 *  the signed-in user's assistant before anything is returned. A call
 *  belonging to another client is answered with 404, not 403, so this route
 *  cannot be used to probe which call ids exist in the org. */
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
    return NextResponse.json(toPortalCallDetail(call));
  } catch (err) {
    console.error("[dashboard] failed to load call:", err);
    return NextResponse.json(
      { error: "Could not load this call." },
      { status: 502 }
    );
  }
}
