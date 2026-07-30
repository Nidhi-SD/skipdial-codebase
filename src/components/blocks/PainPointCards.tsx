import type { ElementType } from "react";
import { Stagger, Item } from "@/components/motion";
import { PainCardTile } from "@/components/blocks/PainCardTile";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   PainPointCards — homepage "problem" grid. A dedicated, more tactile sibling
   of IconCardGrid: cursor-tilt in 3D, a numbered index badge, and a small
   looping drip beneath each icon that visualizes the section's "revenue
   leaks out quietly" copy. Kept separate from IconCardGrid (used elsewhere
   for plainer card grids) so this treatment doesn't leak into other pages.

   Stays a server component so `card.icon` (a plain function reference) can
   be resolved to JSX here — the interactive bits live in PainCardTile
   ("use client"), which receives the already-rendered icon as a prop.
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
    <Stagger className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)} as="ul">
      {cards.map((card, index) => (
        <Item as="li" key={card.title}>
          <PainCardTile
            index={index}
            title={card.title}
            body={card.body}
            icon={
              <card.icon
                aria-hidden
                className="h-12 w-12 transition-transform duration-500 ease-out-expo group-hover:scale-105"
              />
            }
          />
        </Item>
      ))}
    </Stagger>
  );
}
