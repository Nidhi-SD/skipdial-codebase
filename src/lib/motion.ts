import { Variants, Transition } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   Motion language — Attio-inspired: fast, weighty ease-out curves, small
   distances, blur-to-sharp entrances. One rhythm shared across the site.
   ──────────────────────────────────────────────────────────────────────────── */

export const EASE = [0.16, 1, 0.3, 1] as const; // ease-out-expo feel

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 340,
  damping: 32,
  mass: 0.9,
};

/** House spring for the dark product surfaces — tactile, a touch of bounce.
    Movement on these components uses this exclusively (never linear/CSS eases). */
export const springPhysics: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 25,
};

/** Standard entrance — rise + fade. Attio cadence: small distance, ~0.45s. */
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: EASE } },
};

/** Attio signature — blur-to-sharp rise, for headlines and hero widgets. */
export const blurUp: Variants = {
  initial: { opacity: 0, y: 18, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
  exit: { opacity: 0, transition: { duration: 0.3, ease: EASE } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: EASE } },
};

/** Card/frame entrance — slight scale settle. */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.97, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: EASE } },
};

/** Left→right wipe for product frames (Attio "infra-reveal-to-right"). */
export const wipeReveal: Variants = {
  initial: { clipPath: "inset(0% 100% 0% 0%)" },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.8, ease: EASE },
  },
  exit: { opacity: 0, transition: { duration: 0.3, ease: EASE } },
};

/** Center-out horizontal expansion — audio emerging from a flat line.
    Reserved for sound/waveform frames so the motif stays recognizable. */
export const expandX: Variants = {
  initial: { clipPath: "inset(0% 50% 0% 50%)", opacity: 0 },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: { duration: 0.7, ease: EASE },
  },
  exit: { opacity: 0, transition: { duration: 0.3, ease: EASE } },
};

/** Parent orchestrator — pair with fadeUp/blurUp children. */
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
  exit: {},
};

/** Slide-in from the side, for alternating feature rows. */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Shared viewport config — trigger once, slightly before fully on screen. */
export const viewportOnce = { once: true, margin: "-80px 0px" } as const;
