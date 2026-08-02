import type { ElementType } from "react";
import { PainCardTile } from "@/components/blocks/PainCardTile";
import { PainGridActiveProvider } from "@/components/blocks/PainGridActive";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   PainPointCards — homepage "problem" grid. A dedicated, more tactile sibling
   of IconCardGrid: cursor-tilt in 3D, a numbered index badge, and a small
   looping drip beneath each icon that visualizes the section's "revenue
   leaks out quietly" copy. Kept separate from IconCardGrid (used elsewhere
   for plainer card grids) so this treatment doesn't leak into other pages.

   Stays a server component so `card.icon` (a plain function reference) can
   be resolved to JSX here — the interactive bits live in PainCardTile
   ("use client"), which receives the already-rendered icon as a prop and
   also owns this grid's entire entrance animation (its own viewport trigger,
   stagger delay, and shadow ramp) — plain <ul>/<li> here, not the shared
   <Stagger>/<Item>, so that timing isn't laid on top of a second, competing
   fadeUp.

   Wrapped in PainGridActiveProvider (client) so the grid's "nearest to
   viewport center" card can be tracked and shared across the sibling
   PainCardTile leaves without lifting icon resolution into a client
   component.
   ──────────────────────────────────────────────────────────────────────────── */

export type PainCard = {
  icon: ElementType;
  title: string;
  body: string;
};

export function PainPointCards({
  cards,
  className,
}: {
  cards: PainCard[];
  className?: string;
}) {
  return (
    <PainGridActiveProvider>
      <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {cards.map((card, index) => (
          <li key={card.title}>
            <PainCardTile
              index={index}
              title={card.title}
              body={card.body}
              icon={
                <card.icon
                  aria-hidden
                  className="h-12 w-12 transition-[transform,filter] duration-300 ease-out-expo motion-safe:group-hover:rotate-[8deg] motion-safe:group-hover:scale-[1.08] group-hover:drop-shadow-[0_0_10px_rgba(105,70,235,0.55)]"
                />
              }
            />
          </li>
        ))}
      </ul>
    </PainGridActiveProvider>
  );
}
