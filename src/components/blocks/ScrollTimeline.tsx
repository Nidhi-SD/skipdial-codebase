"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Stagger, Item } from "@/components/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   ScrollTimeline — scroll-narrated process steps. A progress line fills the
   track as the reader scrolls; each step "ignites" (chip fills, copy brightens)
   the moment the line reaches it. Native scroll only — the motion value drives
   a single scaleY transform, and React re-renders happen just at step
   boundaries. Static (all steps lit) under reduced motion.
   ──────────────────────────────────────────────────────────────────────────── */

const TRACK_MASK =
  "linear-gradient(to bottom, black calc(100% - 72px), transparent)";

export function ScrollTimeline({
  steps,
  className,
}: {
  steps: { title: string; body?: string }[];
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.78", "end 0.5"],
  });
  // Weighted follow — the fill trails the scroll with spring damping
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.6,
  });

  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.min(steps.length - 1, Math.floor(v * (steps.length - 1) + 0.08));
    setReached((prev) => (prev === idx ? prev : idx));
  });

  return (
    <Stagger as="div" className={cn("relative", className)}>
      {/* Track + scroll-driven fill (behind the chips, fading out at the tail) */}
      <span
        aria-hidden
        style={{ maskImage: TRACK_MASK, WebkitMaskImage: TRACK_MASK }}
        className="absolute bottom-0 left-[19px] top-5 w-px bg-line"
      />
      <motion.span
        aria-hidden
        style={{
          maskImage: TRACK_MASK,
          WebkitMaskImage: TRACK_MASK,
          ...(reduce ? {} : { scaleY: progress, transformOrigin: "top" }),
        }}
        className="absolute bottom-0 left-[19px] top-5 w-px bg-gradient-to-b from-accent-soft via-accent to-accent"
      />

      <ol ref={ref} className="flex flex-col gap-0">
        {steps.map((step, i) => {
          const lit = reduce || i <= reached;
          return (
            <Item
              as="li"
              key={step.title}
              className="group relative flex gap-5 pb-10 last:pb-0"
            >
              <span
                className={cn(
                  "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-[13px] font-semibold shadow-soft transition-colors duration-300",
                  lit
                    ? "border-accent bg-accent text-ink-inverse"
                    : "border-line bg-surface text-accent"
                )}
              >
                {i + 1}
              </span>
              <div
                className={cn(
                  "pt-1.5 transition-opacity duration-300",
                  lit ? "opacity-100" : "opacity-40"
                )}
              >
                <h3 className="text-[16px] font-semibold leading-snug">{step.title}</h3>
                {step.body ? (
                  <p className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-ink-light">
                    {step.body}
                  </p>
                ) : null}
              </div>
            </Item>
          );
        })}
      </ol>
    </Stagger>
  );
}
