"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/** Route-transition wrapper — remounts per navigation for a soft page enter. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  /* Next's own scroll restoration on client-side nav sometimes targets the
     wrong element and lands partway down the new page instead of at top
     (reproducible site-wide, unrelated to Lenis or this file's animation).
     Template remounts on every route change, so this corrects it after
     Next's own attempt already ran — skipped when the URL carries a hash,
     so cross-page anchor links still land on their target section. */
  useEffect(() => {
    if (window.location.hash) return;
    const id = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(id);
  }, []);

  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
