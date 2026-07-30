"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   LegalDoc — shared layout for Privacy Policy / Terms & Conditions.

   Long legal copy needs navigation and a measured reading column, so this
   pairs a sticky contents rail with the document body. The grid starts at the
   Container's left edge so the body's first character lines up with the
   PageHero title above it — a centered (mx-auto) column does not.
   ──────────────────────────────────────────────────────────────────────────── */

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function LegalDoc({
  blocks,
  updated,
}: {
  blocks: LegalBlock[];
  /** Human-readable revision date, e.g. "July 30, 2026". Omitted if absent. */
  updated?: string;
}) {
  const sections = useMemo(
    () =>
      blocks
        .filter((b): b is { type: "h2"; text: string } => b.type === "h2")
        .map((b) => ({ id: slugify(b.text), label: b.text })),
    [blocks]
  );

  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [showTop, setShowTop] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  /* Scroll-spy. The active section is always computed from live rects — those
     stay accurate even when a section is taller than the viewport, which a
     pure IntersectionObserver ratio cannot handle. Two independent triggers
     drive the recompute: the scroll listener (Lenis drives the *native*
     scroller, so these fire normally) and an observer that also catches
     reflows from font swaps or late layout shifts. */
  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    const sync = () => {
      const line = 140; // just below the fixed header
      let current = headings[0];
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h;
        else break;
      }
      setActiveId(current.id);
      setShowTop((topRef.current?.getBoundingClientRect().top ?? 0) < -400);
    };

    // Coalesce bursts of triggers into one measurement per frame.
    let queued = false;
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    };

    const spy = new IntersectionObserver(schedule, { threshold: [0, 1] });
    headings.forEach((h) => spy.observe(h));

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    sync();

    return () => {
      spy.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  // Section counter — h2s are numbered as they render.
  let sectionNo = 0;

  return (
    <Container className="pb-20 pt-2">
      {/* Anchor + sentinel for the back-to-top control. Riding a hash link
          means the return trip uses the site's existing Lenis glide. */}
      <div id="legal-top" ref={topRef} className="scroll-mt-28" />

      <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        {/* ── Contents rail ─────────────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          {/* Mobile: collapsed by default so the copy stays reachable. */}
          <details className="group rounded-2xl border border-line bg-surface shadow-soft lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[13px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronDown
                aria-hidden
                className="h-4 w-4 text-ink-faint transition-transform duration-200 ease-out-expo group-open:rotate-180"
              />
            </summary>
            <nav className="border-t border-line px-2 pb-2 pt-2">
              <ol className="space-y-0.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2.5 rounded-md px-2.5 py-2 text-[13px] leading-snug text-ink-light transition-colors hover:bg-accent-tint hover:text-accent-deep"
                    >
                      <span className="tabular-nums text-ink-faint">
                        {i + 1}.
                      </span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </details>

          {/* Desktop: persistent rail with scroll-spy. */}
          <nav
            aria-label="On this page"
            className="hidden max-h-[calc(100vh-9rem)] flex-col lg:flex"
          >
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
              On this page
            </p>
            <ol className="-ml-px space-y-px overflow-y-auto border-l border-line pr-1">
              {sections.map((s, i) => {
                const active = s.id === activeId;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "flex gap-2 border-l-2 py-1.5 pl-3.5 pr-2 text-[13px] leading-snug transition-colors duration-200",
                        active
                          ? "border-accent font-semibold text-accent"
                          : "border-transparent text-ink-light hover:border-line-strong hover:text-ink"
                      )}
                    >
                      <span
                        className={cn(
                          "tabular-nums",
                          active ? "text-accent" : "text-ink-faint"
                        )}
                      >
                        {i + 1}.
                      </span>
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        {/* ── Document body ─────────────────────────────────────────────── */}
        <div className="min-w-0">
          <article className="rounded-3xl border border-line bg-surface px-6 py-8 shadow-card sm:px-10 sm:py-10">
            {updated ? (
              <p className="mb-8 inline-flex items-center gap-2 rounded-md bg-accent-tint px-2.5 py-1 text-[12px] font-semibold text-accent-deep">
                Last updated {updated}
              </p>
            ) : null}

            {blocks.map((block, i) => {
              switch (block.type) {
                case "h2": {
                  sectionNo += 1;
                  const id = slugify(block.text);
                  return (
                    <h2
                      key={i}
                      id={id}
                      className="mt-14 scroll-mt-28 border-b border-line pb-3 text-display-sm font-bold text-ink first:mt-0"
                    >
                      <span className="mr-2.5 tabular-nums font-semibold text-accent">
                        {sectionNo}.
                      </span>
                      {block.text}
                    </h2>
                  );
                }
                case "h3":
                  return (
                    <h3
                      key={i}
                      className="mt-8 text-[16px] font-bold text-ink"
                    >
                      {block.text}
                    </h3>
                  );
                case "ul":
                  return (
                    <ul
                      key={i}
                      className="mt-4 max-w-copy list-disc space-y-2 pl-5 text-[15px] leading-[1.75] text-ink-light marker:text-accent"
                    >
                      {block.items.map((item) => (
                        <li key={item} className="pl-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                default:
                  return (
                    <p
                      key={i}
                      className="mt-4 max-w-copy text-[15px] leading-[1.75] text-ink-light first:mt-0"
                    >
                      {block.text}
                    </p>
                  );
              }
            })}
          </article>
        </div>
      </div>

      {/* ── Back to top ─────────────────────────────────────────────────── */}
      <a
        href="#legal-top"
        aria-label="Back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? undefined : -1}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-light shadow-lift transition-all duration-200 ease-out-expo hover:border-accent hover:text-accent",
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <ArrowUp aria-hidden className="h-4 w-4" />
      </a>
    </Container>
  );
}
