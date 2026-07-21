"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhoneIncoming, CalendarCheck } from "lucide-react";
import { DashboardCard } from "@/components/blocks/DashboardCard";
import { springPhysics } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   HeroShowcase — the hero's right-hand product visual. An oversized dashboard
   tilts back in 3D and bleeds past the column edge so it reads as a window
   into something larger, with two cards floating in front of it surfacing the
   two moments that matter: a call being answered, and the booking it produced.

   Motion sits in three layers, deliberately separated so they compose instead
   of fighting over one transform:
     1. entrance  — framer, one-shot: cards fly in after the frame lands
     2. hover     — CSS group-hover: the frame straightens toward the reader
                    and the cards step aside, so hovering actually *reveals*
                    the dashboard the cards were overlapping
     3. drift     — framer, endless: a ≤7px sway on differing phases so the
                    composition breathes instead of freezing
   Offsets stay small and everything is transform/opacity only, so all three
   ride the compositor. Under reduced motion the entrance and drift drop out,
   and the global transition override collapses hover to an instant state
   change rather than a slide.

   Entirely decorative — the numbers are illustrative, so the whole block is
   aria-hidden and carries no focusable targets. The tilt is dropped below lg
   where there's no room for it to read as depth rather than damage.
   ──────────────────────────────────────────────────────────────────────────── */

/** Endless drift shared by the frame and its cards — amplitude/period per use. */
function Drift({
  children,
  y = 7,
  duration = 6,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -y, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/** One-shot entrance for the floating cards. */
function CardEntrance({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, x: -28, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ ...springPhysics, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

export function HeroShowcase({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("group relative", className)}>
      {/* Glow pooled behind the frame — swells slightly as the frame turns */}
      <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-accent-soft/20 blur-3xl transition-all duration-500 ease-out-expo group-hover:-inset-10 group-hover:bg-accent-soft/30" />

      <div className="relative [perspective:1800px]">
        <Drift y={6} duration={9}>
          <div
            className={cn(
              "origin-left transition-transform duration-500 ease-out-expo",
              "lg:[transform:rotateY(-13deg)_rotateX(5deg)_rotate(1deg)]",
              // Straightens toward the reader on hover
              "lg:group-hover:[transform:rotateY(-5deg)_rotateX(2deg)_rotate(0deg)_scale(1.02)]"
            )}
          >
            {/* Oversized on lg+ so the right edge runs off-column like a real screen */}
            <div className="lg:w-[132%]">
              <DashboardCard className="shadow-[0_40px_90px_-30px_rgba(105,70,235,0.45)] transition-shadow duration-500 ease-out-expo group-hover:shadow-[0_54px_110px_-28px_rgba(105,70,235,0.55)]" />
            </div>
          </div>
        </Drift>

        {/* Floating card — the call landing. Sits off the frame's left edge so
            it frames the dashboard rather than burying its content. */}
        <CardEntrance
          delay={0.5}
          // Rides the frame's top edge: high enough to clear the first stat
          // tile's value, so no headline number is hidden at rest.
          className="absolute -left-4 top-[4%] hidden w-[224px] sm:block lg:-left-10 lg:-top-7"
        >
          {/* Hover layer — steps out of the dashboard's way. Separate element
              so CSS hover and framer's drift each own one transform. */}
          <div className="transition-transform duration-500 ease-out-expo lg:group-hover:-translate-x-9 lg:group-hover:-translate-y-3">
          <Drift y={7} duration={6}>
            <div className="rounded-2xl border border-line bg-surface/95 p-3.5 shadow-[0_24px_60px_-18px_rgba(19,19,22,0.28)] backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-ink-inverse">
                  G
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-tight text-ink">
                    Grace answered
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[11.5px] text-ink-faint">
                    <PhoneIncoming className="h-3 w-3 shrink-0" />
                    Inbound · 1st ring
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 self-start rounded-full bg-signal/10 px-2 py-0.5 text-[10px] font-bold text-signal">
                  <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                  Live
                </span>
              </div>
              <div className="mt-3 flex items-center gap-[3px]">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <span
                    key={i}
                    className="waveform-bar w-[3px] rounded-full bg-accent/70"
                    style={{
                      height: `${10 + ((i * 37) % 18)}px`,
                      animationDelay: `${i * 0.11}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </Drift>
          </div>
        </CardEntrance>

        {/* Floating card — the outcome */}
        <CardEntrance
          delay={0.72}
          className="absolute -bottom-8 left-6 hidden w-[236px] sm:block lg:-left-4"
        >
          <div className="transition-transform duration-500 ease-out-expo lg:group-hover:-translate-x-10 lg:group-hover:translate-y-3">
          <Drift y={6} duration={7.5} delay={0.8}>
            <div className="rounded-2xl border border-line bg-surface/95 p-3.5 shadow-[0_24px_60px_-18px_rgba(19,19,22,0.28)] backdrop-blur-md">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal">
                  <CalendarCheck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-tight text-ink">
                    Appointment booked
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-ink-faint">
                    Tue · 9:30 AM · synced to CRM
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
                  Handled in
                </p>
                <p className="font-mono text-[13px] font-bold tabular-nums text-accent">
                  0:52
                </p>
              </div>
            </div>
          </Drift>
          </div>
        </CardEntrance>
      </div>
    </div>
  );
}
