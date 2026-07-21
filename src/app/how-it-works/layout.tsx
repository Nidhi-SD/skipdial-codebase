import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How AI Call Handling Works | SkipDial",
  description:
    "Learn how SkipDial configures AI voice agents to answer calls, follow structured workflows, integrate with your systems, and deliver consistent call handling with full visibility.",
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
