"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   PainGridActive — scroll-spy for the homepage pain-point grid. One shared
   IntersectionObserver watches every card against a 1px line pinned to the
   viewport's vertical center (rootMargin -50%/-50%); whichever card(s)
   currently straddle that line are "active" for the section's active-card
   highlight. A row of cards on wide screens shares one scroll position, so
   they light up together — expected, since they're equally near center.

   Lives in a context (rather than lifting state into PainPointCards) because
   PainPointCards must stay a server component to resolve card.icon into
   JSX; a plain client wrapper around its <ul> can still carry this without
   forcing that resolution to happen client-side.
   ──────────────────────────────────────────────────────────────────────────── */

type PainGridContextValue = {
  activeIndices: Set<number>;
  register: (index: number, el: HTMLElement | null) => void;
};

const PainGridContext = createContext<PainGridContextValue | null>(null);

export function PainGridActiveProvider({ children }: { children: ReactNode }) {
  const [activeIndices, setActiveIndices] = useState<Set<number>>(() => new Set());
  const elsRef = useRef<Map<number, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setActiveIndices((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const index = Number((entry.target as HTMLElement).dataset.painIndex);
            if (entry.isIntersecting) next.add(index);
            else next.delete(index);
          }
          return next;
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    observerRef.current = observer;
    elsRef.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const register = (index: number, el: HTMLElement | null) => {
    const prevEl = elsRef.current.get(index);
    if (prevEl && prevEl !== el) observerRef.current?.unobserve(prevEl);
    if (el) {
      elsRef.current.set(index, el);
      observerRef.current?.observe(el);
    } else {
      elsRef.current.delete(index);
    }
  };

  return <PainGridContext.Provider value={{ activeIndices, register }}>{children}</PainGridContext.Provider>;
}

/** Per-card hook: attach `ref` to the card's outer element, read back whether
    it's the active one and whether it should mute for a sibling being active. */
export function usePainCardActive(index: number) {
  const ctx = useContext(PainGridContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctx) return;
    ctx.register(index, ref.current);
    return () => ctx.register(index, null);
  }, [ctx, index]);

  const isActive = ctx?.activeIndices.has(index) ?? false;
  const isMuted = !isActive && (ctx?.activeIndices.size ?? 0) > 0;
  return { ref, isActive, isMuted };
}
