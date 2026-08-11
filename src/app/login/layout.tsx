import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SkipDial",
  description: "Login to your SkipDial account.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
