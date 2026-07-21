"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import {
  fadeUp,
  blurUp,
  fadeIn,
  scaleIn,
  wipeReveal,
  expandX,
  staggerContainer,
  viewportOnce,
  EASE,
} from "@/lib/motion";
import type { Variants } from "framer-motion";

const variantMap = {
  fadeUp,
  blurUp,
  fadeIn,
  scaleIn,
  wipe: wipeReveal,
  expandX,
} as const;
export type RevealVariant = keyof typeof variantMap;

/* ── <Reveal> — scroll-triggered entrance for a single element ─────────────── */
export function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "header" | "figure";
}) {
  const Tag = motion[as] as typeof motion.div;
  const base = variantMap[variant];
  const variants: Variants = delay
    ? {
        ...base,
        animate: {
          ...(base.animate as object),
          transition: {
            ...((base.animate as { transition?: object }).transition ?? {}),
            delay,
          },
        },
      }
    : base;
  return (
    <Tag
      className={className}
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
    >
      {children}
    </Tag>
  );
}

/* ── <Stagger> / <Item> — orchestrated group entrances ─────────────────────── */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0.05,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      variants={{
        ...staggerContainer,
        animate: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
    >
      {children}
    </Tag>
  );
}

export function Item({
  children,
  variant = "fadeUp",
  className,
  as = "div",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
  as?: "div" | "li" | "span" | "figure";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={className} variants={variantMap[variant]}>
      {children}
    </Tag>
  );
}

/* ── <BlurTitle> — word-by-word blur-to-sharp headline (Attio signature) ───── */
export function BlurTitle({
  text,
  mutedText,
  className,
  as: Tag = "h1",
  delay = 0,
}: {
  text: string;
  /** Optional muted continuation rendered in faint ink after the lead text. */
  mutedText?: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const mutedWords = mutedText ? mutedText.split(" ") : [];
  const all = [...words, ...mutedWords];
  return (
    <Tag className={className}>
      <span className="sr-only">
        {text}
        {mutedText ? ` ${mutedText}` : ""}
      </span>
      <motion.span
        aria-hidden
        initial="initial"
        whileInView="animate"
        viewport={viewportOnce}
        transition={{ staggerChildren: 0.045, delayChildren: delay }}
        className="inline"
      >
        {all.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className={`inline-block whitespace-pre ${i >= words.length ? "headline-muted" : ""}`}
            variants={
              reduce
                ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
                : {
                    initial: { opacity: 0, y: 14, filter: "blur(8px)" },
                    animate: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.55, ease: EASE },
                    },
                  }
            }
          >
            {word}
            {i < all.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ── <Marquee> — infinite logo/text loop, pauses on hover ──────────────────── */
export function Marquee({
  children,
  className,
  duration = 36,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <div className={`group/marquee marquee-mask overflow-hidden ${className ?? ""}`}>
      <div
        className="marquee-track flex w-max items-center gap-14 pr-14"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {children}
        <span aria-hidden className="flex items-center gap-14">
          {children}
        </span>
      </div>
    </div>
  );
}

/* ── <CountUp> — numeric stat counts up when scrolled into view ────────────── */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.4,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
