"use client";

import { useRef, type MouseEvent, type ReactNode, type ElementType } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   SpotlightCard — cursor-tracked radial glow + a thin border-light on hover.
   Wraps a card's own border/bg/radius classes (passed via className); this
   component only adds the glow layers and the group-hover hook. Extracted
   from how-it-works/page.tsx, where the same pattern is used for two card
   grids, so both places share one implementation.
   ──────────────────────────────────────────────────────────────────────────── */

export function SpotlightCard({
  children,
  className,
  as: Component = motion.div,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Component
      ref={divRef}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 30 } }}
      className={`group relative overflow-hidden ${className}`}
    >
      {/* Dynamic Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgb(var(--accent-rgb) / 0.12), transparent 40%)`,
        }}
      />
      {/* 1px Inner Border Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] border border-white/0 transition-colors duration-500 group-hover:border-white/10" />

      <div className="relative z-10">{children}</div>
    </Component>
  );
}
