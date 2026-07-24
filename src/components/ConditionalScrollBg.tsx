"use client";

import { usePathname } from "next/navigation";
import { FullPageScrollBgCanvas } from "@/components/FullPageScrollBgCanvas";

// Routes that keep a plain background — auth and legal pages stay off-brand-motion.
const EXCLUDED_PATHS = ["/login", "/privacy-policy"];

export function ConditionalScrollBg() {
  const pathname = usePathname() ?? "";
  const isExcluded = EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isExcluded) return null;

  return <FullPageScrollBgCanvas />;
}
