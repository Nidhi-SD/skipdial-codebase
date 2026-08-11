"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Loader2,
  PhoneIncoming,
  PhoneOutgoing,
  MessageSquareText,
  Search,
  Voicemail,
  X,
} from "@/components/icons/SystemIcons";
import { cn } from "@/lib/cn";
import type { PortalCall, PortalCallDetail } from "@/lib/portal";

/* ── Presentation helpers ──────────────────────────────────────────────────── */

const DIRECTION_META = {
  inbound: { icon: PhoneIncoming, label: "Inbound" },
  outbound: { icon: PhoneOutgoing, label: "Outbound" },
  web: { icon: MessageSquareText, label: "Web" },
} as const;

const OUTCOME_META = {
  connected: { label: "Connected", className: "bg-accent-tint text-accent" },
  voicemail: { label: "Voicemail", className: "bg-warn/10 text-warn" },
  missed: { label: "Not connected", className: "bg-ink/[0.06] text-ink-light" },
} as const;

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Today / Yesterday / weekday name / short date — same ladder most call and
 *  messaging apps use, so a long list stays scannable without exact dates. */
function dayGroupLabel(iso: string | null): string {
  if (!iso) return "Unknown date";
  const d = new Date(iso);
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return d.toLocaleDateString(undefined, { weekday: "long" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Groups a newest-first list into consecutive day buckets, preserving order —
 *  the input is already sorted by date, so same-label calls are contiguous. */
function groupByDay(calls: PortalCall[]): { label: string; calls: PortalCall[] }[] {
  const groups: { label: string; calls: PortalCall[] }[] = [];
  for (const call of calls) {
    const label = dayGroupLabel(call.startedAt);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.calls.push(call);
    else groups.push({ label, calls: [call] });
  }
  return groups;
}

/** Vapi and Retell both return transcripts as newline-separated
 *  "Speaker: …" lines — "AI:"/"Assistant:" on Vapi, "Agent:" on Retell.
 *  Continuation lines (no speaker prefix) fold into the previous turn. */
function parseTranscript(raw: string): { speaker: "agent" | "caller"; text: string }[] {
  const turns: { speaker: "agent" | "caller"; text: string }[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = /^(AI|Assistant|Agent|Bot|User|Customer|Human)\s*:\s*(.*)$/i.exec(trimmed);
    if (match) {
      const speaker = /^(user|customer|human)$/i.test(match[1]) ? "caller" : "agent";
      turns.push({ speaker, text: match[2] });
    } else if (turns.length) {
      turns[turns.length - 1].text += ` ${trimmed}`;
    } else {
      turns.push({ speaker: "agent", text: trimmed });
    }
  }
  return turns.filter((t) => t.text.trim().length > 0);
}

/* ── Detail drawer ─────────────────────────────────────────────────────────── */

export function CallDrawer({ call, onClose }: { call: PortalCall; onClose: () => void }) {
  const reduce = useReducedMotion();
  const [detail, setDetail] = useState<PortalCallDetail | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setFailed(false);

    fetch(`/api/dashboard/calls/${call.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: PortalCallDetail) => {
        if (!cancelled) setDetail(d);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [call.id]);

  // Escape closes; body scroll locks while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const turns = detail?.transcript ? parseTranscript(detail.transcript) : [];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <motion.button
        type="button"
        aria-label="Close call details"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px]"
      />
      <motion.aside
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label="Call details"
        initial={reduce ? { opacity: 0 } : { x: "100%" }}
        animate={reduce ? { opacity: 1 } : { x: 0 }}
        exit={reduce ? { opacity: 0 } : { x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="relative flex h-full w-full max-w-xl flex-col border-l border-line bg-surface shadow-lift"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 md:px-6">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-ink">
              {call.customerName || call.customerNumber || "Web call"}
            </p>
            <p className="mt-0.5 text-[13px] text-ink-light">
              {formatWhen(call.startedAt)} · {formatDuration(call.durationSeconds)} ·{" "}
              {DIRECTION_META[call.direction].label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-light transition-colors hover:bg-surface-alt hover:text-ink"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
          {failed ? (
            <p className="text-[14px] text-ink-light">
              Couldn&apos;t load this call. Please try again.
            </p>
          ) : !detail ? (
            <div className="flex items-center gap-2 text-[14px] text-ink-light">
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
              Loading call…
            </div>
          ) : (
            <div className="space-y-6">
              {detail.recordingUrl ? (
                <div>
                  <p className="mb-2 text-[13px] font-semibold text-ink">Recording</p>
                  {/* Native controls: a utility surface, not a marketing player.
                      `detail.recordingUrl` itself is just this account's private-
                      bucket path (not directly playable) — this route resolves it
                      to a short-lived signed URL on each play. */}
                  <audio
                    controls
                    preload="none"
                    src={`/api/dashboard/calls/${call.id}/recording`}
                    className="w-full"
                  >
                    Your browser does not support audio playback.
                  </audio>
                </div>
              ) : null}

              {detail.summary ? (
                <div>
                  <p className="mb-2 text-[13px] font-semibold text-ink">Summary</p>
                  <p className="rounded-xl border border-line bg-surface-alt p-3.5 text-[13.5px] leading-relaxed text-ink-light">
                    {detail.summary}
                  </p>
                </div>
              ) : null}

              <div>
                <p className="mb-2.5 text-[13px] font-semibold text-ink">Transcript</p>
                {turns.length === 0 ? (
                  <p className="text-[13.5px] text-ink-light">
                    No transcript was captured for this call.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {turns.map((turn, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex",
                          turn.speaker === "caller" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                            turn.speaker === "caller"
                              ? "bg-accent text-ink-inverse"
                              : "border border-line bg-surface-alt text-ink"
                          )}
                        >
                          <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide opacity-60">
                            {turn.speaker === "caller" ? "Caller" : "Agent"}
                          </span>
                          {turn.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </div>
  );
}

/* ── List ──────────────────────────────────────────────────────────────────── */

type Filter = "all" | "connected" | "voicemail" | "missed";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "connected", label: "Connected" },
  { id: "voicemail", label: "Voicemail" },
  { id: "missed", label: "Not connected" },
];

const PAGE_SIZE = 25;

export function CallList({ calls }: { calls: PortalCall[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<PortalCall | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = calls.filter((c) => {
    if (filter !== "all" && c.outcome !== filter) return false;
    if (!q) return true;
    return (
      (c.customerName ?? "").toLowerCase().includes(q) ||
      (c.customerNumber ?? "").toLowerCase().includes(q)
    );
  });
  const shown = filtered.slice(0, visible);
  const groups = groupByDay(shown);

  return (
    <div className="rounded-2xl border border-line bg-surface shadow-soft">
      <div className="border-b border-line px-5 py-4 md:px-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink">
            Recent calls
            <span className="ml-2 text-[13px] font-normal text-ink-light">
              {filtered.length}
            </span>
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  setVisible(PAGE_SIZE);
                }}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
                  filter === f.id
                    ? "bg-accent-tint text-accent"
                    : "text-ink-light hover:bg-surface-alt hover:text-ink"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search by name or number"
            className="h-9 w-full rounded-lg border border-line bg-surface-alt pl-9 pr-9 text-[13.5px] transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-surface hover:text-ink"
            >
              <X aria-hidden className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="px-6 py-12 text-center text-[14px] text-ink-light">
          {q ? "No calls match your search." : "No calls in this view yet."}
        </p>
      ) : (
        groups.map((group) => (
          <div key={group.label}>
            <p className="bg-surface-alt/70 px-5 py-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint md:px-6">
              {group.label}
            </p>
            <ul className="divide-y divide-line">
              {group.calls.map((call) => {
                const Icon = DIRECTION_META[call.direction].icon;
                const outcome = OUTCOME_META[call.outcome];
                return (
                  <li key={call.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(call)}
                      className="flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-surface-alt md:px-6"
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          outcome.className
                        )}
                      >
                        {call.outcome === "voicemail" ? (
                          <Voicemail aria-hidden className="h-4 w-4" />
                        ) : (
                          <Icon aria-hidden className="h-4 w-4" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-ink">
                          {call.customerName || call.customerNumber || "Web call"}
                        </span>
                        <span className="block truncate text-[12.5px] text-ink-light">
                          {formatWhen(call.startedAt)} ·{" "}
                          {DIRECTION_META[call.direction].label}
                        </span>
                      </span>

                      <span className="shrink-0 text-right text-[13px] tabular-nums text-ink-light">
                        {formatDuration(call.durationSeconds)}
                      </span>

                      <span
                        className={cn(
                          "hidden shrink-0 rounded-md px-2 py-1 text-[11.5px] font-semibold sm:block",
                          outcome.className
                        )}
                      >
                        {outcome.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}

      {visible < filtered.length ? (
        <div className="border-t border-line px-6 py-3.5 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="cursor-pointer text-[13px] font-semibold text-accent transition-colors hover:text-accent-deep"
          >
            Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
          </button>
        </div>
      ) : null}

      <AnimatePresence>
        {selected ? (
          <CallDrawer call={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
