"use client";

import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, type Variants } from "framer-motion";
import { PopChip } from "@/components/motion/entrances";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { usePainCardActive } from "@/components/blocks/PainGridActive";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   PainCardTile — the interactive leaf for PainPointCards. Split into its own
   "use client" file because the icon element itself is resolved server-side
   (PainPointCards.tsx renders <card.icon /> before handing it down) — a raw
   icon *function* can't cross the server/client boundary as a prop, only an
   already-rendered element can.

   Three nested motion layers, each owning one concern so nothing fights for
   the same transform on the same element:
     A (outer)  — scroll-reveal entrance: opacity/rise/rotate, once, driven by
                  whileInView variants that propagate down to the icon/number.
     B (middle) — ambient float + cursor tilt. Both live on `style` motion
                  values (not the `animate` prop) so this layer stays a
                  transparent passthrough for A's variant context — an actual
                  `animate={...}` here would otherwise replace what A
                  propagates to the icon below, and it would just stop
                  animating in.
     C (inner)  — SpotlightCard: hover lift/scale + cursor spotlight glow.
   Active-card highlighting (border/shadow/number/icon) is plain conditional
   className from usePainCardActive — colour/shadow only, so it's left
   unaffected by prefers-reduced-motion (that gates movement, not this).
   ──────────────────────────────────────────────────────────────────────────── */

const TILT_MAX = 7; // degrees, capped small — tactile, not gimmicky
const TILT_SPRING = { stiffness: 300, damping: 22 };

const ENTRANCE_DURATION = 0.7;
const ENTRANCE_STAGGER = 0.12;

const FLOAT_DISTANCE = 4; // px — "almost unnoticeable"
const FLOAT_DURATION = 7;
const FLOAT_STAGGER = 0.6;

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
  const floatY = useMotionValue(0);

  const { ref: activeRef, isActive, isMuted } = usePainCardActive(index);

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(floatY, [0, -FLOAT_DISTANCE, 0], {
      duration: FLOAT_DURATION,
      repeat: Infinity,
      ease: "easeInOut",
      delay: index * FLOAT_STAGGER,
    });
    return () => controls.stop();
  }, [reduce, floatY, index]);

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

  const cardVariants: Variants = useMemo(() => {
    if (reduce) {
      const settled = { opacity: 1, y: 0, rotate: 0 };
      return { initial: settled, animate: settled };
    }
    return {
      initial: { opacity: 0, y: 40, rotate: 2 },
      animate: (i: number) => ({
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: { duration: ENTRANCE_DURATION, delay: i * ENTRANCE_STAGGER, ease: "easeOut" },
      }),
    };
  }, [reduce]);

  const iconVariants: Variants = useMemo(() => {
    if (reduce) return { initial: { scale: 1 }, animate: { scale: 1 } };
    return {
      initial: { scale: 0.8 },
      animate: (i: number) => ({
        scale: 1,
        transition: { duration: 0.5, delay: i * ENTRANCE_STAGGER + 0.15, ease: "easeOut" },
      }),
    };
  }, [reduce]);

  return (
    <motion.div
      className="h-full"
      custom={index}
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.div
        ref={activeRef}
        data-pain-index={index}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={tiltEnabled ? { y: floatY, rotateX, rotateY, transformPerspective: 900 } : { y: floatY }}
        className="h-full"
      >
        <SpotlightCard
          hoverLift={10}
          hoverScale={1.03}
          hoverTransition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "group flex h-full flex-col rounded-[20px] border bg-surface p-7 cursor-pointer",
            "transition-[border-color,box-shadow,opacity] duration-300 ease-out-expo",
            "hover:border-accent/55 hover:shadow-[0_18px_44px_-12px_rgba(105,70,235,0.26)] hover:opacity-100",
            isActive
              ? "border-accent/45 shadow-[0_14px_34px_-10px_rgba(105,70,235,0.2)]"
              : "border-line shadow-sm",
            isMuted && "opacity-90"
          )}
        >
          <PopChip
            className={cn(
              "absolute right-0 top-0 font-mono text-[12px] font-semibold tabular-nums transition-colors duration-300",
              isActive ? "text-accent" : "text-ink-faint/60"
            )}
          >
            <span aria-hidden>0{index + 1}</span>
          </PopChip>
          <motion.div
            variants={iconVariants}
            className={cn(
              "relative flex h-12 w-12 items-center justify-center text-accent transition-[filter] duration-300 ease-out-expo",
              isActive && "brightness-110 drop-shadow-[0_0_6px_rgba(105,70,235,0.35)]"
            )}
          >
            {icon}
            <Drip delay={index * 0.5} />
          </motion.div>
          <h3 className="mt-6 text-[16px] font-bold leading-snug">{title}</h3>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-light">{body}</p>
        </SpotlightCard>
      </motion.div>
    </motion.div>
  );
}
