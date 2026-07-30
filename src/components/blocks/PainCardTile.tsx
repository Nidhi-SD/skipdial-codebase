"use client";

import { useEffect, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { PopChip } from "@/components/motion/entrances";
import { SpotlightCard } from "@/components/motion/SpotlightCard";

/* ─────────────────────────────────────────────────────────────────────────────
   PainCardTile — the interactive leaf for PainPointCards. Split into its own
   "use client" file because the icon element itself is resolved server-side
   (PainPointCards.tsx renders <card.icon /> before handing it down) — a raw
   icon *function* can't cross the server/client boundary as a prop, only an
   already-rendered element can.
   ──────────────────────────────────────────────────────────────────────────── */

const TILT_MAX = 7; // degrees, capped small — tactile, not gimmicky
const TILT_SPRING = { stiffness: 300, damping: 22 };

function Drip({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent/60"
      animate={{ y: [0, 20, 24], opacity: [0, 1, 0], scale: [0.7, 1, 0.5] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeIn", delay, repeatDelay: 0.5 }}
    />
  );
}

export function PainCardTile({
  icon,
  title,
  body,
  index,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, TILT_SPRING);
  const rotateY = useSpring(rawY, TILT_SPRING);

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const tiltEnabled = !reduce && finePointer;

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    rawX.set(-py * TILT_MAX * 2);
    rawY.set(px * TILT_MAX * 2);
  };
  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={tiltEnabled ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className="h-full"
    >
      <SpotlightCard className="group flex h-full flex-col rounded-[20px] border border-line bg-surface p-7 shadow-sm transition-colors duration-300 ease-out-expo hover:border-accent/30 hover:shadow-[0_8px_30px_rgba(105,70,235,0.08)]">
        <PopChip className="absolute right-0 top-0 font-mono text-[12px] font-semibold tabular-nums text-ink-faint/60">
          <span aria-hidden>0{index + 1}</span>
        </PopChip>
        <div className="relative flex h-12 w-12 items-center justify-center text-accent">
          {icon}
          <Drip delay={index * 0.5} />
        </div>
        <h3 className="mt-6 text-[16px] font-bold leading-snug">{title}</h3>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-light">{body}</p>
      </SpotlightCard>
    </motion.div>
  );
}
