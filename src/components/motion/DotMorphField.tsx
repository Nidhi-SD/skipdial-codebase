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
   DotMorphField — Levity-style narrative particle backdrop.
   A sparse field of tiny, faint brand-tinted dots drifts loosely, then
   settles into a regular grid as the user scrolls the section away: chaos →
   order. No connecting lines, no glow — just quiet, barely-there texture
   that never competes with foreground content. Canvas-drawn (one element,
   no per-dot DOM), DPR-aware. Reduced motion renders the ordered grid as a
   single static frame.
   ──────────────────────────────────────────────────────────────────────────── */

type Dot = {
  chaosX: number;
  chaosY: number;
  gridX: number;
  gridY: number;
  radius: number;
  phase: number;
  baseAlpha: number;
};

const SCROLL_RANGE = 700; // px of page scroll that completes the morph
const GRID_CELL = 84; // target grid spacing (CSS px) — sparse, not a busy net
const MAX_DOTS = 70;

/* Brand accent #6946EB, used at low, uniform opacity throughout */
const TINT = "105, 70, 235";

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function DotMorphField({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const { scrollY } = useScroll();
  const rawProgress = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], {
    clamp: true,
  });
  /* Light damper only — Lenis already interpolates the scroll itself, so this
     spring just softens the residual steps on paths Lenis skips (touch,
     reduced-Lenis environments) without adding visible trail. */
  const progress = useSpring(rawProgress, { stiffness: 150, damping: 28, mass: 0.5 });

  /* Build the field: grid targets with an inset margin, chaos positions as a
     loose scatter. Rebuilt whenever the canvas resizes. */
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

    const insetX = w * 0.1;
    const insetY = h * 0.1;
    const cols = Math.max(4, Math.floor((w - insetX * 2) / GRID_CELL));
    const rows = Math.max(4, Math.floor((h - insetY * 2) / GRID_CELL));
    const stepX = (w - insetX * 2) / (cols - 1);
    const stepY = (h - insetY * 2) / (rows - 1);

    const dots: Dot[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (dots.length >= MAX_DOTS) break;
        // Loose scatter across the whole field, not clumped at center
        const chaosX = insetX + Math.random() * (w - insetX * 2);
        const chaosY = insetY + Math.random() * (h - insetY * 2);
        dots.push({
          gridX: insetX + c * stepX,
          gridY: insetY + r * stepY,
          chaosX,
          chaosY,
          radius: 0.9 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          baseAlpha: 0.12 + Math.random() * 0.1,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback((timeMs: number, rawProgress: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { w, h } = sizeRef.current;
    const dots = dotsRef.current;
    if (!w || !h || !dots.length) return;

    const p = easeInOutCubic(Math.min(Math.max(rawProgress, 0), 1));
    const wobbleAmp = 5 * (1 - p * 0.8);
    const t = timeMs * 0.0004;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const x = d.chaosX + (d.gridX - d.chaosX) * p + Math.sin(t + d.phase) * wobbleAmp;
      const y =
        d.chaosY + (d.gridY - d.chaosY) * p + Math.cos(t * 0.8 + d.phase * 1.6) * wobbleAmp;
      const alpha = d.baseAlpha + 0.05 * Math.sin(t * 0.8 + d.phase);

      ctx.fillStyle = `rgba(${TINT}, ${Math.max(0.06, alpha).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, d.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!parent) return;
    rebuild();
    if (reduce) draw(0, 1); // static ordered grid
    const ro = new ResizeObserver(() => {
      rebuild();
      if (reduce) draw(0, 1);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [rebuild, draw, reduce]);

  useAnimationFrame((timeMs) => {
    if (reduce) return;
    draw(timeMs, progress.get());
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block h-full w-full", className)}
    />
  );
}
