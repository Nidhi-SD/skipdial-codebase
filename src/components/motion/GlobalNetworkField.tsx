"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { geoNaturalEarth1, geoPath, geoContains, type GeoProjection } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, MultiPolygon, MultiLineString } from "geojson";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   GlobalNetworkField — real-world-map constellation backdrop for dark bands.
   An actual coastline (Natural Earth 110m land data via world-atlas) is
   projected and stroked as fine line art, then a network mesh of nodes is
   scattered *only across real landmasses* and connected to their nearest
   neighbors, with a few long arcs sweeping overhead carrying a flowing
   dashed signal — "every call, connected, everywhere." Canvas-drawn, DPR-
   aware, static frame under reduced motion. Map data is fetched once from
   /public and memoized module-wide so every instance shares it.
   ──────────────────────────────────────────────────────────────────────────── */

type LandFeature = Feature<MultiPolygon>;
type LandMesh = MultiLineString;
type Node = { x: number; y: number; r: number; phase: number };
type Edge = { a: number; b: number };
type Arc = { x1: number; y1: number; x2: number; y2: number; bow: number; phase: number };

const NODE_COUNT = 60;
const NEIGHBOR_LINKS = 2;
const ARC_COUNT = 3;

type LandData = { land: LandFeature; coastline: LandMesh };
let landCache: LandData | null = null;
let landPromise: Promise<LandData | null> | null = null;

function loadLand() {
  if (landCache) return Promise.resolve(landCache);
  if (!landPromise) {
    landPromise = fetch("/data/world-land-110m.json")
      .then((r) => r.json())
      .then((topology: Topology) => {
        const landObj = topology.objects.land as GeometryCollection;
        const land = feature(topology, landObj) as unknown as LandFeature;
        const coastline = mesh(topology, landObj) as LandMesh;
        landCache = { land, coastline };
        return landCache;
      })
      .catch(() => null);
  }
  return landPromise;
}

export function GlobalNetworkField({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const arcsRef = useRef<Arc[]>([]);
  const coastlineRef = useRef<LandMesh | null>(null);
  const projectionRef = useRef<GeoProjection | null>(null);

  const [land, setLand] = useState(landCache);
  useEffect(() => {
    if (land) return;
    let cancelled = false;
    loadLand().then((result) => {
      if (!cancelled && result) setLand(result);
    });
    return () => {
      cancelled = true;
    };
  }, [land]);

  const rebuild = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent || !land) return;

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

    // Fit the map into a band vertically centered in the section, capped so
    // it never stretches to fill a very tall (mobile) container awkwardly.
    const mapHeight = Math.min(h * 0.86, w * 0.52);
    const topY = h * 0.42 - mapHeight / 2;
    const projection = geoNaturalEarth1().fitExtent(
      [
        [w * 0.03, Math.max(0, topY)],
        [w * 0.97, Math.max(0, topY) + mapHeight],
      ],
      land.land
    );
    projectionRef.current = projection;
    coastlineRef.current = land.coastline;

    // Scatter nodes only where they land on real ground.
    const nodes: Node[] = [];
    let attempts = 0;
    while (nodes.length < NODE_COUNT && attempts < NODE_COUNT * 60) {
      attempts++;
      const x = Math.random() * w;
      const y = Math.random() * h;
      const lonlat = projection.invert?.([x, y]);
      if (!lonlat) continue;
      if (!geoContains(land.land, lonlat)) continue;
      nodes.push({ x, y, r: 1.2 + Math.random() * 1.3, phase: Math.random() * Math.PI * 2 });
    }

    const edges: Edge[] = [];
    const seen = new Set<string>();
    nodes.forEach((n, i) => {
      const nearest = nodes
        .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, NEIGHBOR_LINKS);
      nearest.forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ a: i, b: j });
        }
      });
    });

    const arcs: Arc[] = Array.from({ length: ARC_COUNT }, (_, i) => ({
      x1: w * (0.06 + Math.random() * 0.22),
      y1: h * (0.3 + Math.random() * 0.18),
      x2: w * (0.58 + Math.random() * 0.34),
      y2: h * (0.24 + Math.random() * 0.22),
      bow: h * (0.15 + i * 0.055),
      phase: i * 900,
    }));

    nodesRef.current = nodes;
    edgesRef.current = edges;
    arcsRef.current = arcs;
  }, [land]);

  const draw = useCallback(
    (timeMs: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const { w, h } = sizeRef.current;
      if (!w || !h) return;

      const t = timeMs * 0.001;

      ctx.clearRect(0, 0, w, h);

      // Real coastline — the actual world map
      const projection = projectionRef.current;
      const coastline = coastlineRef.current;
      if (projection && coastline) {
        const path = geoPath(projection, ctx);
        ctx.beginPath();
        path(coastline);
        ctx.strokeStyle = "rgba(105,70,235,0.22)";
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      const nodes = nodesRef.current;
      if (!nodes.length) return;

      // Mesh lines between nodes
      ctx.strokeStyle = "rgba(105,70,235,0.12)";
      ctx.lineWidth = 1;
      for (const e of edgesRef.current) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Overhead arcs — a flowing dashed signal, "every call, connected"
      for (const arc of arcsRef.current) {
        const midX = (arc.x1 + arc.x2) / 2;
        const midY = Math.min(arc.y1, arc.y2) - arc.bow;
        ctx.strokeStyle = "rgba(159,129,252,0.45)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([1, 6]);
        ctx.lineDashOffset = reduce ? 0 : -((t * 30 + arc.phase) % 6000);
        ctx.beginPath();
        ctx.moveTo(arc.x1, arc.y1);
        ctx.quadraticCurveTo(midX, midY, arc.x2, arc.y2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "rgba(159,129,252,0.75)";
        ctx.beginPath();
        ctx.arc(arc.x1, arc.y1, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(arc.x2, arc.y2, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes, gently twinkling
      for (const n of nodes) {
        const twinkle = reduce ? 1 : 0.55 + 0.45 * Math.sin(t * 0.8 + n.phase);
        ctx.fillStyle = `rgba(105, 70, 235, ${(0.55 * twinkle).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [reduce]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!parent) return;
    rebuild();
    draw(0);
    const ro = new ResizeObserver(() => {
      rebuild();
      draw(0);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [rebuild, draw]);

  useAnimationFrame((timeMs) => {
    if (reduce) return;
    draw(timeMs);
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none block h-full w-full", className)}
    />
  );
}
