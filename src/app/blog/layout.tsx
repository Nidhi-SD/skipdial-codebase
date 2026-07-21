import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | SkipDial",
  description: "Insights, guides, and news about AI voice agents and call automation.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
