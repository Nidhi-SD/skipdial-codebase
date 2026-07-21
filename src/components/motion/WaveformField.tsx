"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  useAnimationFrame,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   WaveformField — reactive voice-waveform hero backdrop.
   A horizontal band of comb bars traces a soundwave silhouette (flat at the
   edges, an organic cluster of humps in the middle) rendered in brand purple
   with a soft glow. Bars near the cursor grow taller, as if the wave were
   picking up a live signal — a literal callback to SkipDial's product. A
   sparser layer of tall glowing "spike" hairlines with dot tips scattered
   across the band adds texture. The whole field settles and fades as the
   user scrolls past the hero. Canvas-drawn (one element, no per-bar DOM),
   DPR-aware. Reduced motion renders one static frame with no cursor reactivity.
   ──────────────────────────────────────────────────────────────────────────── */

type Bar = { t: number; envelope: number; phase: number };
type Spike = { t: number; height: number; phase: number };

const SCROLL_RANGE = 700;
const BAR_COUNT = 84;
const SPIKE_COUNT = 16;
const CURSOR_RADIUS = 130; // px falloff for the cursor-reactive boost
const CURSOR_BOOST = 0.85; // extra height multiplier at the cursor's peak

const TINTS = ["105, 70, 235", "159, 129, 252"] as const; // accent, accent-soft

const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

/* Flat at the edges, an organic multi-peak hump cluster in the middle —
   instantly reads as an audio waveform silhouette. */
function envelopeAt(t: number) {
  const mainHump = Math.exp(-Math.pow((t - 0.56) / 0.16, 2));
  const secondaryHump = 0.55 * Math.exp(-Math.pow((t - 0.32) / 0.1, 2));
  const ripple =
    0.3 *
    Math.sin(t * 34) *
    Math.exp(-Math.pow((t - 0.5) / 0.42, 2));
  const edgeFade = Math.min(1, t / 0.05) * Math.min(1, (1 - t) / 0.05);
  return Math.max(0, (mainHump + secondaryHump + ripple) * edgeFade);
}

export function WaveformField({
  className,
  centerY = 0.5,
  maxAmplitude,
}: {
  className?: string;
  /** Fraction (0–1) of the container height where the wave's baseline sits. */
  centerY?: number;
  /** Fixed pixel cap on peak half-height, independent of container height —
      keeps the wave a thin band even when it's stretched across a full,
      much-taller hero section as a background layer. */
  maxAmplitude?: number;
}) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const barsRef = useRef<Bar[]>([]);
  const spikesRef = useRef<Spike[]>([]);
  const pointerXRef = useRef<number | null>(null);
  const pointerXSmoothed = useRef<number | null>(null);
  // Mirrored into refs each render so the stable draw() callback (used inside
  // useAnimationFrame) always reads the latest prop values, not a stale closure.
  const centerYRef = useRef(centerY);
  centerYRef.current = centerY;
  const maxAmplitudeRef = useRef(maxAmplitude);
  maxAmplitudeRef.current = maxAmplitude;

  const { scrollY } = useScroll();
  const rawProgress = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], {
    clamp: true,
  });
  /* Light damper — Lenis interpolates the scroll itself; see DotMorphField. */
  const progress = useSpring(rawProgress, { stiffness: 150, damping: 28, mass: 0.5 });

  const rebuild = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (!w || !h) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { w, h };

    barsRef.current = Array.from({ length: BAR_COUNT }, (_, i) => {
      const t = i / (BAR_COUNT - 1);
      return { t, envelope: envelopeAt(t), phase: Math.random() * Math.PI * 2 };
    });

    spikesRef.current = Array.from({ length: SPIKE_COUNT }, () => {
      const t = 0.1 + Math.random() * 0.8;
      return {
        t,
        height: (0.4 + Math.random() * 0.9) * envelopeAt(t),
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  const draw = useCallback((timeMs: number, rawP: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { w, h } = sizeRef.current;
    const bars = barsRef.current;
    if (!w || !h || !bars.length) return;

    const p = Math.min(Math.max(rawP, 0), 1);
    const fieldAlpha = 1 - p * 0.8;
    const t = timeMs * 0.00055;
    const midY = h * centerYRef.current;
    const capPx = maxAmplitudeRef.current ?? h * 0.42;
    const maxAmp = capPx * (1 - p * 0.25);

    // Ease the raw cursor position toward its target so the boost glides.
    if (pointerXRef.current !== null) {
      pointerXSmoothed.current = lerp(
        pointerXSmoothed.current ?? pointerXRef.current,
        pointerXRef.current,
        0.06
      );
    } else {
      pointerXSmoothed.current = null;
    }
    const cursorX = pointerXSmoothed.current;

    ctx.clearRect(0, 0, w, h);

    // Main comb — two-pass draw per bar: a soft blurred wash, then a crisp core.
    for (const bar of bars) {
      const x = bar.t * w;
      const wobble = 0.88 + 0.12 * Math.sin(t * 1.3 + bar.phase);
      let boost = 1;
      if (cursorX !== null) {
        const dist = Math.abs(x - cursorX);
        boost = 1 + CURSOR_BOOST * Math.exp(-Math.pow(dist / CURSOR_RADIUS, 2));
      }
      const amp = bar.envelope * maxAmp * wobble * boost;
      if (amp < 0.6) continue;

      const colorMix = 0.35 + 0.5 * bar.envelope;
      const tint = colorMix > 0.6 ? TINTS[0] : TINTS[1];
      const alpha = fieldAlpha * (0.16 + 0.5 * bar.envelope);

      ctx.strokeStyle = `rgba(${tint}, ${(alpha * 0.5).toFixed(3)})`;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = `rgba(${TINTS[0]}, 0.35)`;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x, midY - amp);
      ctx.lineTo(x, midY + amp);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(${tint}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, midY - amp);
      ctx.lineTo(x, midY + amp);
      ctx.stroke();
    }

    // Sparse tall spike hairlines with glowing tip dots — reference detail.
    for (const spike of spikesRef.current) {
      const x = spike.t * w;
      const wobble = 0.9 + 0.1 * Math.sin(t * 0.9 + spike.phase);
      const amp = spike.height * maxAmp * 1.35 * wobble;
      if (amp < 4) continue;
      const alpha = fieldAlpha * 0.32;

      ctx.strokeStyle = `rgba(${TINTS[0]}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, midY - amp);
      ctx.lineTo(x, midY + amp);
      ctx.stroke();

      ctx.fillStyle = `rgba(${TINTS[0]}, ${(alpha * 1.6).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, midY - amp, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, midY + amp, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center baseline thread, tying the whole comb together.
    ctx.strokeStyle = `rgba(${TINTS[0]}, ${(fieldAlpha * 0.12).toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!parent) return;
    rebuild();
    if (reduce) draw(0, 0);
    const ro = new ResizeObserver(() => {
      rebuild();
      if (reduce) draw(0, 0);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [rebuild, draw, reduce]);

  useEffect(() => {
    if (reduce) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    const onMove = (e: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointerXRef.current = e.clientX - rect.left;
    };
    const onLeave = () => {
      pointerXRef.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  useAnimationFrame((timeMs) => {
    if (reduce) return;
    draw(timeMs, progress.get());
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none block h-full w-full", className)}
    />
  );
}
