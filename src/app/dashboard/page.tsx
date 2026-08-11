import { redirect } from "next/navigation";
import { accountLabel, agentId, getClientAccount } from "@/lib/portal";
import { DashboardView } from "@/components/dashboard/DashboardView";

// The session is read per-request; nothing here may be prerendered.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const account = await getClientAccount();

  // Middleware already guards this path, but a session can expire between the
  // middleware check and the render — and this is the only guard that survives
  // if the matcher is ever edited.
  if (!account) redirect("/login?callbackUrl=%2Fdashboard");

  return (
    <DashboardView
      clientLabel={accountLabel(account)}
      email={account.email}
      hasAgent={Boolean(agentId(account))}
    />
  );
}
