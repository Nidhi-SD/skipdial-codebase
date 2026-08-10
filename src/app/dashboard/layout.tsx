import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | SkipDial",
  description: "Your SkipDial agent activity.",
  // A private client portal — keep it out of search results entirely.
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
