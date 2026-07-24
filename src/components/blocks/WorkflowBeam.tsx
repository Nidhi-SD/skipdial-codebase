"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Bot,
  Check,
  Users,
  Loader2,
  PhoneIncoming,
  type LucideIcon,
} from "lucide-react";
import { EASE, springPhysics } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   WorkflowBeam — the call-routing story told as motion.

   A call lands, the agent picks up and reasons out loud, the CRM writes the
   record, and context flows back down the wire. Every moving part maps to a
   step in that sequence; nothing here moves purely for decoration.

   The loop is driven by one phase clock (TIMELINE). Beam travel, copy cycling
   and card state all read from it, so retiming the story means editing one
   array. The clock only runs while the panel is on screen.
   ──────────────────────────────────────────────────────────────────────────── */

type Phase =
  | "idle"
  | "ringing"
  | "answering"
  | "thinking"
  | "syncing"
  | "synced"
  | "returning"
  | "resolved";

/* One pass of the story. Each phase outlasts the beam it fires so packets
   always land before the next phase takes over. ~11.9s round trip. */
const TIMELINE: readonly { phase: Phase; ms: number }[] = [
  { phase: "idle", ms: 600 },
  { phase: "ringing", ms: 1600 },
  { phase: "answering", ms: 900 },
  { phase: "thinking", ms: 2200 },
  { phase: "syncing", ms: 2200 },
  { phase: "synced", ms: 1200 },
  { phase: "returning", ms: 1800 },
  { phase: "resolved", ms: 1400 },
];

/* Reduced motion parks the panel here — the finished state tells the whole
   story in one frame, which is the point of the animation anyway. */
const RESOLVED_INDEX = TIMELINE.length - 1;

/* Cycled copy. Lines are crossfaded, never swapped. */
const AGENT_THINKING = [
  "Understanding customer…",
  "Detecting intent…",
  "Retrieving CRM data…",
  "Generating response…",
  "Speaking naturally…",
];
const CRM_SYNCING = ["Syncing…", "Updating customer…", "Saving interaction…"];
const AGENT_CONTEXT = ["Customer found", "History loaded", "Context ready"];

/* Packets ease in and out of travel — linear movement reads mechanical. */
const PACKET_EASE = [0.4, 0, 0.2, 1] as const;

const BEAM_MS = { call: 1.3, sync: 1.5, back: 1.4 } as const;

/* ── Entrance ──────────────────────────────────────────────────────────────
   Plays once. Cards rise 20px on a 120ms stagger, with the connector rails
   drawing themselves in behind.

   The panel itself deliberately never animates its own opacity: it only
   orchestrates the stagger. Fading the root would put the background, border
   and header behind the viewport observer too, so a single undelivered
   callback (HMR remount, backgrounded tab, hydration timing) would leave a
   blank hole where the showpiece belongs. Chrome always paints; the entrance
   is a bonus on top. */

const panelIn: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
};

const rowIn: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
};

const headerIn: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const nodeRise: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: springPhysics },
};

const connectorIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
};

const railDraw: Variants = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1, transition: { duration: 0.65, ease: EASE } },
};

/* ── Hooks ────────────────────────────────────────────────────────────────── */

/** Page visibility. A background tab still fires timers but freezes rAF, so
    the clock would keep advancing while framer's exit animations stall —
    stacking outgoing status lines until the tab is refocused.
    Starts optimistic so the server and first client render agree. */
function useDocumentVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return visible;
}

/** Steps an index while `active`, resetting to 0 the moment it goes quiet.
    `hold` rests on the final item instead of wrapping — used where the list is
    a sequence that completes (context receipts) rather than an idle loop. */
function useCycle(active: boolean, length: number, ms: number, hold = false) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!active) {
      setI(0);
      return;
    }
    const id = window.setInterval(
      () =>
        setI((prev) =>
          hold ? Math.min(prev + 1, length - 1) : (prev + 1) % length
        ),
      ms
    );
    return () => window.clearInterval(id);
  }, [active, length, ms, hold]);

  return i;
}

/** A single line of status copy that blur-dissolves between values.

    The outgoing and incoming lines overlap rather than queueing (no
    `mode="wait"`): on an 800ms cycle, waiting for exit before entering would
    burn ~0.5s of every step and leave the copy barely readable. Both lines are
    absolutely positioned inside a reserved line box, so overlapping them costs
    no layout shift. */
function CyclingLine({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={cn("relative block", className)}>
      <span aria-hidden className="invisible block">
        {text || "\u00A0"}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.28, ease: EASE },
          }}
          exit={{
            opacity: 0,
            y: -4,
            filter: "blur(3px)",
            transition: { duration: 0.2, ease: EASE },
          }}
          className="absolute inset-0 block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Beams ────────────────────────────────────────────────────────────────── */

/** A glowing data packet travelling one connector path.

    Three stacked strokes sell it: a long blurred trail (the smear), a short
    bright head (the packet), and a trace that lights the rail progressively
    as the packet passes, rather than switching the whole line on at once.
    `d` arrives pre-oriented, so a return trip is just a reversed path.

    Mounting *is* firing — Connector only renders a beam for the phase that
    owns it, so the travel plays from `initial` on mount and unmounts after. */
function Beam({
  d,
  axis,
  duration,
  small = false,
}: {
  d: string;
  axis: "h" | "v";
  duration: number;
  small?: boolean;
}) {
  const head = small ? 0.1 : 0.15;
  const trail = small ? 0.26 : 0.36;
  const width = small ? 1.5 : 2;

  const stroke = `url(#wf-packet-${axis})`;

  const packet = (
    length: number,
    strokeWidth: number,
    opacity: number,
    blurred: boolean
  ) => (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      style={{ stroke }}
      filter={blurred ? `url(#wf-bloom-${axis})` : undefined}
      initial={{
        pathLength: length,
        pathSpacing: 1 - length,
        pathOffset: 0,
        opacity: 0,
      }}
      animate={{ pathOffset: 1, opacity: [0, opacity, opacity, 0] }}
      transition={{
        pathOffset: { duration, ease: PACKET_EASE },
        opacity: { duration, times: [0, 0.12, 0.82, 1], ease: "linear" },
      }}
    />
  );

  return (
    <>
      {/* Rail lighting up under the packet */}
      <motion.path
        d={d}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        style={{ stroke }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.75, 0.75, 0] }}
        transition={{
          pathLength: { duration, ease: PACKET_EASE },
          opacity: {
            duration: duration + 0.4,
            times: [0, 0.14, 0.7, 1],
            ease: "linear",
          },
        }}
      />
      {packet(trail, width * 3, 0.4, true)}
      {packet(head, width, 1, false)}
    </>
  );
}

/** One gap between nodes: a resting rail plus whichever packets are in flight.
    Renders horizontally from md up and vertically on mobile. */
function Connector({
  reduce,
  forward = false,
  backward = false,
  forwardMs = BEAM_MS.call,
}: {
  reduce: boolean;
  forward?: boolean;
  backward?: boolean;
  forwardMs?: number;
}) {
  const railStyle = { stroke: "rgb(var(--accent-rgb) / 0.18)" };

  /* Reverse trips get a reversed path so the trace also lights right-to-left. */
  const paths = {
    h: { fwd: "M0 12 H96", rev: "M96 12 H0" },
    v: { fwd: "M12 0 V48", rev: "M12 48 V0" },
  };

  const beams = (axis: "h" | "v") => (
    <>
      {forward && (
        <Beam d={paths[axis].fwd} axis={axis} duration={forwardMs} />
      )}
      {backward && (
        <Beam d={paths[axis].rev} axis={axis} duration={BEAM_MS.back} small />
      )}
    </>
  );

  /* A quiet, always-on marching-dash tick so the connector reads as directional
     flow even between beam events — the packet above only fires for ~1.5s of
     the ~12s loop, which otherwise leaves the rail looking inert. */
  const flowTick = (axis: "h" | "v") => (
    <path
      d={paths[axis].fwd}
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      className="wf-rail-flow"
      style={{ stroke: "rgb(var(--accent-rgb) / 0.5)" }}
    />
  );

  return (
    <motion.div
      aria-hidden
      variants={reduce ? undefined : connectorIn}
      className="flex shrink-0 items-center justify-center md:w-24"
    >
      {/* Horizontal (md+) */}
      <motion.svg
        viewBox="0 0 96 24"
        fill="none"
        className="hidden h-6 w-full md:block"
      >
        <motion.path
          d={paths.h.fwd}
          strokeWidth={1.5}
          style={railStyle}
          variants={reduce ? undefined : railDraw}
        />
        {flowTick("h")}
        {!reduce && beams("h")}
      </motion.svg>

      {/* Vertical (mobile) */}
      <motion.svg
        viewBox="0 0 24 48"
        fill="none"
        className="block h-12 w-6 md:hidden"
      >
        <motion.path
          d={paths.v.fwd}
          strokeWidth={1.5}
          style={railStyle}
          variants={reduce ? undefined : railDraw}
        />
        {flowTick("v")}
        {!reduce && beams("v")}
      </motion.svg>
    </motion.div>
  );
}

/* ── Nodes ────────────────────────────────────────────────────────────────── */

type NodeState = "idle" | "live" | "done";

/** A workflow card. Hover lift lives on the outer shell and the "processing"
    swell on the inner one, so the two transforms compose instead of fighting. */
function WorkflowNode({
  icon: Icon,
  iconClass,
  title,
  state,
  center = false,
  badge,
  children,
}: {
  icon: LucideIcon | string;
  iconClass?: string;
  title: string;
  state: NodeState;
  center?: boolean;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const live = state === "live";
  const done = state === "done";

  const frameStyle = live
    ? center
      ? {
          borderColor: "rgb(var(--signal-rgb) / 0.45)",
          boxShadow:
            "0 0 46px -10px rgb(var(--signal-rgb) / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.9)",
        }
      : {
          borderColor: "rgb(var(--ink-rgb) / 0.16)",
          boxShadow:
            "0 12px 30px -18px rgb(var(--ink-rgb) / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.9)",
        }
    : done
      ? {
          borderColor: "rgb(var(--signal-rgb) / 0.4)",
          boxShadow:
            "0 0 32px -12px rgb(var(--signal-rgb) / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.9)",
        }
      : {
          borderColor: "rgb(var(--line-rgb))",
          boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.7)",
        };

  const iconStyle = live
    ? center
      ? {
          borderColor: "rgb(var(--signal-rgb) / 0.4)",
          background: "rgb(var(--signal-rgb))",
          color: "#fff",
          boxShadow: "0 0 20px rgb(var(--signal-rgb) / 0.5)",
        }
      : {
          borderColor: "rgb(var(--ink-rgb) / 0.18)",
          background: "rgb(var(--ink-rgb) / 0.05)",
          color: "rgb(var(--ink-rgb))",
        }
    : done
      ? {
          borderColor: "rgb(var(--signal-rgb))",
          background: "rgb(var(--signal-rgb))",
          color: "#fff",
          boxShadow: "0 0 16px rgb(var(--signal-rgb) / 0.4)",
        }
      : {
          borderColor: "rgb(var(--line-rgb))",
          background: "rgb(var(--surface-alt-rgb))",
          color: "rgb(var(--ink-faint-rgb))",
        };

  return (
    <motion.div
      variants={nodeRise}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={springPhysics}
      className="group relative md:flex-1"
    >
      <motion.div
        animate={{ scale: live && center ? 1.03 : 1 }}
        transition={springPhysics}
        className={cn(
          "relative flex h-full items-start gap-3.5 rounded-2xl border bg-surface/75 p-4 backdrop-blur-md md:p-5",
          "transition-[opacity,filter,border-color,box-shadow] duration-700 ease-out",
          state === "idle" && "opacity-60 grayscale-[45%]"
        )}
        style={frameStyle}
      >
        {/* Breathing halo — the agent card idles like something switched on */}
        {center && (
          <span
            aria-hidden
            className="wf-breathe pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              boxShadow: "0 0 0 1px rgb(var(--accent-rgb) / 0.28)",
            }}
          />
        )}

        {/* Hover glow, kept on its own layer so it never fights state colours */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow:
              "0 0 0 1px rgb(var(--accent-rgb) / 0.35), 0 18px 40px -22px rgb(var(--accent-rgb) / 0.55)",
          }}
        />

        {badge && (
          <span aria-hidden className="absolute -top-2.5 right-4 z-10">
            {badge}
          </span>
        )}

        <span className="relative shrink-0">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-[transform,background,border-color,box-shadow,color] duration-500 group-hover:rotate-6"
            style={iconStyle}
          >
            {typeof Icon === "string" ? (
              <img src={Icon} alt="" className={cn("h-[28px] w-[28px] object-contain drop-shadow-md", iconClass)} />
            ) : (
              <Icon aria-hidden className={cn("h-[18px] w-[18px]", iconClass)} />
            )}
          </span>

          {/* Motes drifting off the agent icon */}
          {center &&
            [
              { left: "-6px", top: "2px", delay: "0s", duration: "7s" },
              { left: "38px", top: "-4px", delay: "2.4s", duration: "9s" },
              { left: "30px", top: "34px", delay: "4.1s", duration: "8s" },
            ].map((mote) => (
              <span
                key={mote.delay}
                aria-hidden
                className="wf-mote pointer-events-none absolute h-1 w-1 rounded-full"
                style={{
                  left: mote.left,
                  top: mote.top,
                  background: "rgb(var(--accent-rgb))",
                  ["--wf-delay" as string]: mote.delay,
                  ["--wf-duration" as string]: mote.duration,
                }}
              />
            ))}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[14.5px] font-bold leading-snug transition-colors duration-500",
              state === "idle" ? "text-ink-light" : "text-ink"
            )}
          >
            {title}
          </p>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Panel atmosphere ─────────────────────────────────────────────────────── */

/** Background life: drifting glows, light streaks, fiber filaments and motes.
    All CSS-driven on 18–34s loops and paused wholesale when off screen. */
function PanelAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="wf-drift-a absolute -left-[10%] top-[-30%] h-[70%] w-[45%] rounded-full blur-3xl"
        style={{ background: "rgb(var(--accent-soft-rgb) / 0.22)" }}
      />
      <div
        className="wf-drift-b absolute -right-[8%] bottom-[-35%] h-[75%] w-[45%] rounded-full blur-3xl"
        style={{ background: "rgb(var(--accent-rgb) / 0.14)" }}
      />

      {/* Fiber-optic filaments threading behind the nodes */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
        fill="none"
      >
        {[
          { d: "M-40 76 C 240 26, 520 128, 1240 58", delay: "0s", o: 0.16 },
          { d: "M-40 168 C 300 210, 700 104, 1240 178", delay: "-8s", o: 0.12 },
          { d: "M-40 258 C 260 300, 640 196, 1240 268", delay: "-15s", o: 0.1 },
        ].map((fiber) => (
          <path
            key={fiber.delay}
            className="wf-fiber"
            d={fiber.d}
            strokeWidth={1}
            strokeDasharray="3 14"
            style={{
              stroke: "rgb(var(--accent-rgb))",
              opacity: fiber.o,
              ["--wf-delay" as string]: fiber.delay,
            }}
          />
        ))}
      </svg>

      {/* Light streaks */}
      {[
        { top: "8%", delay: "0s" },
        { top: "62%", delay: "-11s" },
      ].map((streak) => (
        <span
          key={streak.delay}
          className="wf-streak absolute h-px w-[38%]"
          style={{
            top: streak.top,
            background:
              "linear-gradient(90deg, transparent, rgb(var(--accent-rgb) / 0.45), transparent)",
            ["--wf-delay" as string]: streak.delay,
          }}
        />
      ))}

      {/* Drifting motes */}
      {[
        { left: "12%", top: "24%", delay: "0s", duration: "13s" },
        { left: "28%", top: "72%", delay: "-3s", duration: "16s" },
        { left: "47%", top: "16%", delay: "-6s", duration: "11s" },
        { left: "64%", top: "80%", delay: "-9s", duration: "15s" },
        { left: "81%", top: "32%", delay: "-4s", duration: "12s" },
        { left: "92%", top: "64%", delay: "-7s", duration: "17s" },
      ].map((mote) => (
        <span
          key={mote.left}
          className="wf-mote absolute h-1 w-1 rounded-full"
          style={{
            left: mote.left,
            top: mote.top,
            background: "rgb(var(--accent-rgb))",
            ["--wf-delay" as string]: mote.delay,
            ["--wf-duration" as string]: mote.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ── Panel ────────────────────────────────────────────────────────────────── */

export function WorkflowBeam({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "0px 0px -10% 0px" });
  const visible = useDocumentVisible();

  /* The story only runs when someone can actually see it. */
  const running = inView && visible && !reduce;

  /* One latch drives the entrance, off the same observer as the loop — two
     observers on one element is a second thing that can fail independently.
     Latched rather than live so the reveal plays once and never rewinds. */
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  /* Belt and braces. If that observer never delivers — no IntersectionObserver,
     a remount while the tab is backgrounded, a hydration edge — the cards would
     sit at opacity 0 forever and the section would read as broken. So poll the
     geometry as a backup until the panel has entered.

     Gated on the panel genuinely being on screen (mirroring the observer's -10%
     margin) rather than on a bare timer, so the reveal is never spent before
     the reader actually arrives. Stops the moment it has fired. */
  useEffect(() => {
    if (entered) return;
    const check = () => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) setEntered(true);
    };
    const id = window.setInterval(check, 700);
    return () => window.clearInterval(id);
  }, [entered]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % TIMELINE.length),
      TIMELINE[index].ms
    );
    return () => window.clearTimeout(id);
  }, [index, running]);

  const phase = TIMELINE[reduce ? RESOLVED_INDEX : index].phase;

  /* Agent narrates from pickup through to the CRM write. */
  const agentTalking =
    phase === "thinking" || phase === "syncing" || phase === "synced";

  const agentMsg = useCycle(running && agentTalking, AGENT_THINKING.length, 800);
  const crmMsg = useCycle(running && phase === "syncing", CRM_SYNCING.length, 800);
  const ctxChip = useCycle(
    running && phase === "returning",
    AGENT_CONTEXT.length,
    560,
    true
  );

  /* ── Card states ── */
  const callState: NodeState =
    phase === "idle" ? "idle" : phase === "ringing" ? "live" : "done";

  const agentState: NodeState =
    phase === "idle" || phase === "ringing"
      ? "idle"
      : phase === "resolved"
        ? "done"
        : "live";

  const crmState: NodeState =
    phase === "syncing"
      ? "live"
      : phase === "synced" || phase === "returning" || phase === "resolved"
        ? "done"
        : "idle";

  const callLive = phase !== "idle" && phase !== "resolved";

  const agentMeta = (() => {
    switch (phase) {
      case "idle":
      case "ringing":
        return "Standby";
      case "answering":
        return "Connecting…";
      case "returning":
        return "Context received · resuming call";
      case "resolved":
        return "Call handled · summary sent";
      default:
        return AGENT_THINKING[agentMsg];
    }
  })();

  const crmMeta = (() => {
    switch (phase) {
      case "syncing":
        return CRM_SYNCING[crmMsg];
      case "synced":
        return "Synced successfully";
      case "returning":
        return "Returning customer context…";
      case "resolved":
        return "Record updated · follow-up queued";
      default:
        return "Awaiting data sync";
    }
  })();

  return (
    <motion.div
      ref={rootRef}
      variants={reduce ? undefined : panelIn}
      initial={reduce ? undefined : "initial"}
      animate={reduce ? undefined : entered ? "animate" : "initial"}
      className={cn(
        "band-zinc relative overflow-hidden rounded-3xl border border-line p-5 md:p-8",
        !running && "wf-paused",
        className
      )}
    >
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="wf-packet-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: "rgb(var(--accent-rgb))" }} />
            <stop
              offset="60%"
              style={{ stopColor: "rgb(var(--accent-soft-rgb))" }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "rgb(var(--accent-tint-rgb))" }}
            />
          </linearGradient>
          <linearGradient id="wf-packet-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "rgb(var(--accent-rgb))" }} />
            <stop
              offset="60%"
              style={{ stopColor: "rgb(var(--accent-soft-rgb))" }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "rgb(var(--accent-tint-rgb))" }}
            />
          </linearGradient>
          {/* userSpaceOnUse is required, not stylistic: these paths are dead
              straight, so their object bounding box is zero-height (or
              zero-width) and a percentage filter region would collapse to
              nothing, dropping the bloom entirely. Regions below are the two
              connector viewBoxes, padded for the blur. */}
          <filter
            id="wf-bloom-h"
            filterUnits="userSpaceOnUse"
            x="-12"
            y="-12"
            width="120"
            height="48"
          >
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter
            id="wf-bloom-v"
            filterUnits="userSpaceOnUse"
            x="-12"
            y="-12"
            width="48"
            height="72"
          >
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
      </svg>

      {!reduce && <PanelAtmosphere />}

      <div
        aria-hidden
        className="dot-grid-inverse absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_30%,black,transparent)]"
      />

      {/* Panel header */}
      <motion.div
        variants={reduce ? undefined : headerIn}
        className="relative flex items-center justify-between"
      >
        <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-light">
          <span
            className={cn(
              "relative inline-block h-2 w-2 rounded-full transition-colors duration-500",
              callLive ? "bg-signal pulse-dot" : "bg-ink-faint"
            )}
          />
          Live call routing
        </p>
        <p className="hidden font-mono text-[11px] tabular-nums text-ink-faint sm:block">
          handoff &lt; 400 ms
        </p>
      </motion.div>

      {/* Nodes + beams */}
      <motion.div
        variants={reduce ? undefined : rowIn}
        className="relative mt-6 flex flex-col items-stretch md:flex-row"
      >
        {/* 1 · Inbound call */}
        <WorkflowNode
          icon={PhoneIncoming}
          iconClass={phase === "idle" ? undefined : "wf-float"}
          title="Inbound Call"
          state={callState}
        >
          <CyclingLine
            text={
              phase === "idle"
                ? "Waiting for call…"
                : phase === "ringing"
                  ? "Incoming · (602) 555-0117"
                  : "Connected · (602) 555-0117"
            }
            className="mt-0.5 text-[12px] leading-relaxed text-ink-light"
          />
          <span
            aria-hidden
            className="mt-2 flex h-4 items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider"
          >
            <span
              className={cn(
                "relative inline-block h-1.5 w-1.5 rounded-full transition-colors duration-500",
                phase === "ringing" ? "bg-signal pulse-dot" : "bg-line"
              )}
            />
            <span
              className={cn(
                "transition-colors duration-500",
                phase === "ringing" ? "text-signal" : "text-ink-faint"
              )}
            >
              {phase === "ringing" ? "Ringing" : "Line open"}
            </span>
          </span>
        </WorkflowNode>

        <Connector
          reduce={reduce}
          forward={phase === "ringing"}
          forwardMs={BEAM_MS.call}
        />

        {/* 2 · SkipDial AI agent */}
        <WorkflowNode
          icon="/technical-support.png"
          title="SkipDial AI Agent"
          state={agentState}
          center
          badge={
            agentState === "live" ? (
              <span
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10.5px] font-semibold text-accent"
                style={{
                  boxShadow: "0 4px 16px rgb(var(--accent-rgb) / 0.18)",
                }}
              >
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-accent pulse-dot" />
                {phase === "answering" ? "Connecting…" : "Processing…"}
              </span>
            ) : null
          }
        >
          <CyclingLine
            text={agentMeta}
            className="mt-0.5 text-[12px] leading-relaxed text-ink-light"
          />

          {/* Waveform while talking, context receipts while the CRM answers */}
          <span aria-hidden className="mt-2 block h-4">
            <AnimatePresence mode="wait" initial={false}>
              {phase === "returning" ? (
                <motion.span
                  key="context"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.24, ease: EASE }}
                  className="flex h-4 items-center gap-1.5 text-[10.5px] font-semibold text-signal"
                >
                  <Check className="h-3 w-3 shrink-0" strokeWidth={3} />
                  <CyclingLine
                    text={AGENT_CONTEXT[ctxChip]}
                    className="min-w-0 flex-1"
                  />
                </motion.span>
              ) : (
                <motion.span
                  key="wave"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24, ease: EASE }}
                  className="flex h-4 items-center gap-[3px]"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-[3px] rounded-full transition-all duration-300",
                        agentTalking
                          ? "waveform-bar bg-accent/80"
                          : "h-[4px] bg-line"
                      )}
                      style={
                        agentTalking
                          ? {
                              height: `${45 + ((i * 29) % 50)}%`,
                              animationDelay: `${i * 0.14}s`,
                            }
                          : undefined
                      }
                    />
                  ))}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </WorkflowNode>

        <Connector
          reduce={reduce}
          forward={phase === "syncing"}
          backward={phase === "returning"}
          forwardMs={BEAM_MS.sync}
        />

        {/* 3 · CRM */}
        <WorkflowNode
          icon={Users}
          iconClass={crmState === "idle" ? undefined : "wf-tilt"}
          title="CRM Sync"
          state={crmState}
          badge={
            phase === "syncing" ? (
              <span
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10.5px] font-semibold text-ink"
                style={{ boxShadow: "0 4px 16px rgb(var(--ink-rgb) / 0.05)" }}
              >
                <Loader2
                  className="h-2.5 w-2.5 animate-spin text-ink-light"
                  strokeWidth={3}
                />
                Syncing
              </span>
            ) : crmState === "done" ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springPhysics}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10.5px] font-semibold text-signal"
                style={{
                  boxShadow: "0 4px 16px rgb(var(--signal-rgb) / 0.18)",
                }}
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                Qualified
              </motion.span>
            ) : null
          }
        >
          <CyclingLine
            text={crmMeta}
            className="mt-0.5 text-[12px] leading-relaxed text-ink-light"
          />
          <span aria-hidden className="mt-2 block h-4">
            <AnimatePresence initial={false}>
              {crmState === "done" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={springPhysics}
                  className="inline-flex h-4 items-center gap-1 rounded-md bg-signal/15 px-1.5 text-[10.5px] font-semibold text-signal"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                  Lead captured
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </WorkflowNode>
      </motion.div>
    </motion.div>
  );
}
