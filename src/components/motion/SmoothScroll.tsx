"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* ─────────────────────────────────────────────────────────────────────────────
   SmoothScroll — site-wide Lenis scroll interpolation. Wheel input arrives in
   ~100px notches; Lenis turns it into a per-frame glide on the *native*
   scroller, so every scroll-linked animation (timeline fill, dot morph,
   waveform amplitude, parallax planes) samples smooth values for free.
   Touch scrolling stays native (syncTouch off). In-page anchor clicks ride
   the same easing instead of jumping. Never initialized under reduced motion.
   Companion CSS lives in globals.css under "Lenis".
   ──────────────────────────────────────────────────────────────────────────── */

/** Fixed header is 64px; leave breathing room above the scroll target. */
const ANCHOR_OFFSET = -88;

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.12, autoRaf: false });

    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    /* Same-page hash links glide via Lenis. Capture phase so preventDefault
       lands before Next's <Link> handler; the skip link keeps its instant
       native jump for keyboard users. */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.(
        "a[href*='#']"
      ) as HTMLAnchorElement | null;
      if (!link || link.getAttribute("href") === "#main-content") return;
      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      )
        return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      window.history.pushState(null, "", url.hash);
      lenis.scrollTo(target, {
        offset: ANCHOR_OFFSET,
        /* Re-aim once on arrival: content above the target (looping demo
           panels, late images) can change height mid-glide, so the landing
           recomputed from the element's final position stays exact. */
        onComplete: () =>
          lenis.scrollTo(target, { offset: ANCHOR_OFFSET, duration: 0.35 }),
      });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
