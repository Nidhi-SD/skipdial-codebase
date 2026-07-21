"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { springPhysics, viewportOnce } from "@/lib/motion";
import { DotMorphField } from "@/components/motion/DotMorphField";
import { WaveformField } from "@/components/motion/WaveformField";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   Section-entrance primitives — small client leaves composed inside server
   blocks. Each is a variants CHILD: it fires when its parent Stagger/Item
   reaches the "animate" state, so choreography stays orchestrated from one
   place. All transform/opacity; all static under reduced motion.
   ──────────────────────────────────────────────────────────────────────────── */

/* ── RingPulse — one expanding "unanswered ring" fired as the parent lands ──── */

const ringVariants: Variants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: 1.5,
    opacity: [0, 0.55, 0],
    transition: { duration: 0.9, ease: "easeOut", delay: 0.3, times: [0, 0.25, 1] },
  },
};

export function RingPulse({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden
      variants={ringVariants}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-accent",
        className
      )}
    />
  );
}

/* ── PopChip — number/check chips spring in with a small overshoot ─────────── */

const popVariants: Variants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: springPhysics },
};

export function PopChip({
  children,
  className,
  as = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "div";
}) {
  const reduce = useReducedMotion();
  const Tag = as === "div" ? motion.div : motion.span;
  return (
    <Tag variants={reduce ? undefined : popVariants} className={className}>
      {children}
    </Tag>
  );
}

/* ── DrawLineV — vertical connector draws downward after the chip lands ────── */

const drawVariants: Variants = {
  initial: { scaleY: 0 },
  animate: { scaleY: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.18 } },
};

export function DrawLineV({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      variants={reduce ? undefined : drawVariants}
      style={{ transformOrigin: "top" }}
      className={className}
    />
  );
}

/* ── Magnetic — a few pixels of spring attraction toward the cursor ────────── */
/* Reserved for the primary CTA. Pointer-fine devices only; inert under
   reduced motion. Pull is capped so it reads as responsiveness, not a toy. */

const MAX_PULL = 5;
/* House spring as bare SpringOptions — useSpring rejects the `type` field */
const PULL_SPRING = { stiffness: 350, damping: 25 };

export function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PULL_SPRING);
  const y = useSpring(rawY, PULL_SPRING);

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (reduce || !finePointer) return <div className={className}>{children}</div>;

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    rawX.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, dx * 0.15)));
    rawY.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, dy * 0.15)));
  };
  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

/* ── ScrollDrift — backdrop layer drifts with scroll for depth parallax ────── */
/* Maps the first stretch of page scroll to a vertical offset. Different
   `distance` values per layer make the hero backdrop separate into planes as
   the user scrolls. Scroll-linked motion value → compositor transform only;
   no re-renders. Static under reduced motion. */

const SCROLL_RANGE = 700;

export function ScrollDrift({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, SCROLL_RANGE], [0, distance], { clamp: true });

  if (reduce) {
    return (
      <div aria-hidden className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div aria-hidden style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── HeroBackdrop — scroll-choreographed hero background ───────────────────── */
/* A reactive voice-waveform (WaveformField) sits behind the whole hero as a
   quiet watermark — its amplitude is capped in pixels (not container-height
   relative) so it reads as a thin band even stretched across the full
   section, and its opacity is low enough that headline/CTA text stays
   legible on top. A faint dot field drifts-to-grid beneath it for depth,
   and one soft top glow lifts up and out behind the headline. Scroll-linked
   motion values → compositor transforms and canvas drawing only; fully
   static under reduced motion. */

const HERO_RANGE = 700;

export function HeroBackdrop() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const glowY = useTransform(scrollY, [0, HERO_RANGE], [0, -90], { clamp: true });
  const glowOpacity = useTransform(scrollY, [0, HERO_RANGE * 0.6], [1, 0], { clamp: true });

  const dots = (
    <DotMorphField className="[mask-image:radial-gradient(90%_80%_at_50%_30%,black_55%,transparent)]" />
  );
  const wave = (
    <WaveformField
      className="opacity-[0.28]"
      centerY={0.45}
      maxAmplitude={170}
    />
  );
  const glow = (
    <div className="h-[320px] w-[calc(100vw-2rem)] max-w-[680px] rounded-[100%] bg-gradient-to-b from-accent-soft/[0.16] via-accent/[0.04] to-transparent blur-3xl" />
  );

  if (reduce) {
    return (
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">{dots}</div>
        <div className="absolute inset-0">{wave}</div>
        <div className="absolute left-1/2 top-[-200px] -translate-x-1/2">{glow}</div>
      </div>
    );
  }

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">{dots}</div>
      <div className="absolute inset-0">{wave}</div>
      <div className="absolute left-1/2 top-[-200px] -translate-x-1/2">
        <motion.div style={{ y: glowY, opacity: glowOpacity }}>{glow}</motion.div>
      </div>
    </div>
  );
}

/* ── HeroRecede — hero frame settles into a deeper plane on scroll ─────────── */
/* The simulator lags the page slightly (y) and eases back in scale as the
   reader scrolls on, so the hero visual reads as a plane sitting behind the
   page flow rather than pinned to it. Same scroll range as the backdrop
   choreography. Transform-only; static under reduced motion. */

export function HeroRecede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, HERO_RANGE], [0, 44], { clamp: true });
  const scale = useTransform(scrollY, [0, HERO_RANGE], [1, 0.97], { clamp: true });

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div style={{ y, scale }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── ParallaxY — frame drifts against the scroll while in view ─────────────── */
/* Target-based: progress spans the element's full viewport transit and maps
   to a ±distance drift, so product frames feel seated a plane deeper than
   the copy around them. Transform-only, no re-renders; static under
   reduced motion. */

export function ParallaxY({
  children,
  className,
  distance = 26,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── ParallaxDrift — a few pixels of pointer-tracked float ─────────────────── */
/* Ambient cousin of Magnetic: tracks the pointer across the whole viewport
   (not just the element), so the wrapped frame drifts gently as the cursor
   moves anywhere over the hero. Capped low so it reads as depth, not motion.
   Pointer-fine devices only; inert under reduced motion. */

const DRIFT_MAX = 7;
const DRIFT_SPRING = { stiffness: 60, damping: 20 };

export function ParallaxDrift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, DRIFT_SPRING);
  const y = useSpring(rawY, DRIFT_SPRING);

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (reduce || !finePointer) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2 * DRIFT_MAX);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2 * DRIFT_MAX);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, finePointer, rawX, rawY]);

  if (reduce || !finePointer) return <div className={className}>{children}</div>;

  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── CallArrivalFrame — widget lands like an incoming call ─────────────────── */
/* Spring settle with a soft ring radiating outward once — the "buzz" of a
   phone arriving, without literal shake. */

export function CallArrivalFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      variants={{
        initial: { opacity: 0, scale: 0.95, y: 16 },
        animate: { opacity: 1, scale: 1, y: 0, transition: springPhysics },
      }}
      className={cn("relative", className)}
    >
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          variants={{
            initial: { opacity: 0, scale: 0.96 },
            animate: {
              opacity: [0, 0.5, 0],
              scale: 1.05,
              transition: { duration: 1.1, ease: "easeOut", delay: 0.25 + i * 0.35, times: [0, 0.25, 1] },
            },
          }}
          className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-accent/50"
        />
      ))}
      {children}
    </motion.div>
  );
}
