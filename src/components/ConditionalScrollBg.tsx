"use client";

import { usePathname } from "next/navigation";
import { FullPageScrollBgCanvas } from "@/components/FullPageScrollBgCanvas";

// Routes that keep a plain background — auth/legal pages stay off-brand-motion,
// and conversion pages stay quiet so the ask (try it, book it) isn't competing
// with a cinematic scroll animation built for the long homepage scroll.
const EXCLUDED_PATHS = ["/login", "/privacy-policy", "/request-a-free-demo"];

export function ConditionalScrollBg() {
  const pathname = usePathname() ?? "";
  const isExcluded = EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isExcluded) return null;

  return <FullPageScrollBgCanvas />;
}
