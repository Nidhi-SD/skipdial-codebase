"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Clock,
  Gauge,
  Loader2,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  RefreshCw,
  MessageSquareText,
  TrendingUp,
  TrendingDown,
} from "@/components/icons/SystemIcons";
import type { IconComponent } from "@/components/icons/SystemIcons";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { CallVolumeChart, type DailyBucket } from "@/components/dashboard/CallVolumeChart";
import { PeakHoursChart } from "@/components/dashboard/PeakHoursChart";
import { MissedCallsPanel } from "@/components/dashboard/MissedCallsPanel";
import { CallList } from "@/components/dashboard/CallList";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { PortalCall } from "@/lib/portal";

type Trend = { current: number; previous: number; changePct: number | null };

type DashboardPayload = {
  configured: true;
  /** Window actually queried, after clamping to the plan's retention. */
  days: number;
  requestedDays: number;
  retentionDays: number;
  agent: {
    name: string;
    exists: boolean;
    voice: string | null;
    language: string | null;
  };
  stats: {
    totalCalls: number;
    connected: number;
    voicemail: number;
    missed: number;
    connectRate: number;
    totalMinutes: number;
    avgDurationSeconds: number;
    byDirection: { inbound: number; outbound: number; web: number };
    daily: DailyBucket[];
  };
  /** null when the selected range leaves no room for a same-length prior
   *  period inside the plan's retention window (see vapi.ts RETENTION_DAYS). */
  trend: {
    totalCalls: Trend;
    connected: Trend;
    totalMinutes: Trend;
  } | null;
  calls: PortalCall[];
};

type ApiResponse = DashboardPayload | { configured: false };

/* Vapi retains call history per subscription plan (14 days on the current
   one), so offering a 90-day range would just render an empty chart. */
const RANGES = [
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days" },
  { days: 30, label: "30 days" },
];

function formatAvg(seconds: number): string {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/* ── Stat card ─────────────────────────────────────────────────────────────── */

/** ↑/↓ vs the prior period of equal length. Silent (renders nothing) whenever
 *  a reading would be noise rather than signal: no trend data, or both
 *  periods flat at zero. */
function TrendBadge({ trend }: { trend?: Trend }) {
  if (!trend) return null;
  if (trend.changePct === null) {
    if (trend.current === 0) return null;
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-signal">
        New activity
      </span>
    );
  }
  if (trend.changePct === 0) {
    return <span className="text-[12px] font-medium text-ink-faint">No change</span>;
  }
  const up = trend.changePct > 0;
  const TrendIcon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[12px] font-semibold",
        up ? "text-signal" : "text-ink-light"
      )}
    >
      <TrendIcon aria-hidden className="h-3 w-3" />
      {Math.abs(trend.changePct)}%
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
}: {
  icon: IconComponent;
  label: string;
  value: string;
  hint?: string;
  trend?: Trend;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-line bg-surface p-5 shadow-soft"
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-tint text-accent">
        <Icon aria-hidden className="h-[18px] w-[18px]" />
      </div>
      <p className="text-[13px] text-ink-light">{label}</p>
      <p className="mt-1 font-display text-[28px] font-bold leading-none tracking-tight text-ink">
        {value}
      </p>
      {hint || trend ? (
        <div className="mt-1.5 flex items-center gap-2">
          {hint ? <p className="text-[12.5px] text-ink-faint">{hint}</p> : null}
          <TrendBadge trend={trend} />
        </div>
      ) : null}
    </motion.div>
  );
}

/* ── Empty / error panels ──────────────────────────────────────────────────── */

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: IconComponent;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-accent">
        <Icon aria-hidden className="h-5 w-5" />
      </div>
      <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
      <div className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-light">
        {children}
      </div>
    </div>
  );
}

/* ── View ──────────────────────────────────────────────────────────────────── */

export function DashboardView({
  clientLabel,
  email,
  hasAgent,
}: {
  clientLabel: string;
  email: string;
  hasAgent: boolean;
}) {
  const [days, setDays] = useState(14);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (range: number, signal?: AbortSignal) => {
      setRefreshing(true);
      setError(null);
      try {
        const res = await fetch(`/api/dashboard?days=${range}`, { signal });
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error ?? "Request failed");
        setData(body as ApiResponse);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Something went wrong loading your data."
        );
      } finally {
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    load(days, controller.signal);
    return () => controller.abort();
  }, [days, load]);

  const payload = data && data.configured ? data : null;
  const loading = !data && !error;

  return (
    <section className="min-h-dvh bg-wash px-5 pb-24 pt-28 md:px-8 md:pt-32">
      <Container className="px-0 md:px-0">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="mb-8 flex flex-wrap items-end justify-between gap-5"
        >
          <div>
            <motion.div variants={fadeUp}>
              <Eyebrow className="mb-2">Client Portal</Eyebrow>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display text-[clamp(1.9rem,3.4vw,2.55rem)] font-bold leading-[1.1] tracking-tight text-ink"
            >
              {clientLabel}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-1.5 text-[14px] text-ink-light">
              {payload ? (
                <>
                  Agent: <span className="font-medium text-ink">{payload.agent.name}</span>
                </>
              ) : (
                email
              )}
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <div className="flex rounded-lg border border-line bg-surface p-1">
              {RANGES.map((r) => {
                /* Ranges past the plan's retention stay selectable: the server
                   clamps the window and the notice below the stats explains
                   why. Disabling them would hide the reason on touch devices,
                   where the tooltip never appears. */
                const beyondPlan = payload ? r.days > payload.retentionDays : false;
                return (
                  <button
                    key={r.days}
                    type="button"
                    onClick={() => setDays(r.days)}
                    title={
                      beyondPlan
                        ? `Your plan retains ${payload?.retentionDays} days of call history`
                        : undefined
                    }
                    className={cn(
                      "cursor-pointer rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                      days === r.days
                        ? "bg-accent-tint text-accent"
                        : beyondPlan
                          ? "text-ink-faint hover:text-ink-light"
                          : "text-ink-light hover:text-ink"
                    )}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => load(days)}
              disabled={refreshing}
              aria-label="Refresh"
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-light transition-colors hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                aria-hidden
                className={cn("h-4 w-4", refreshing && "animate-spin")}
              />
            </button>
          </motion.div>
        </motion.div>

        {/* States */}
        {!hasAgent ? (
          <Panel icon={Phone} title="Your agent is being set up">
            Your account is active, but no voice agent is linked to it yet. The SkipDial
            team will connect your agent shortly — reach us at{" "}
            <a
              href="mailto:info@skipdial.ai"
              className="font-medium text-accent hover:text-accent-deep"
            >
              info@skipdial.ai
            </a>{" "}
            if you were expecting it to be live.
          </Panel>
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-20 text-[14px] text-ink-light shadow-soft">
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            Loading your call data…
          </div>
        ) : error ? (
          <Panel icon={AlertCircle} title="Couldn't load your data">
            {error}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => load(days)}
                className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-ink-inverse transition-colors hover:bg-accent-deep"
              >
                Try again
              </button>
            </div>
          </Panel>
        ) : !payload ? (
          <Panel icon={Phone} title="Your agent is being set up">
            No voice agent is linked to this account yet.
          </Panel>
        ) : !payload.agent.exists ? (
          <Panel icon={AlertCircle} title="Agent not found">
            The agent linked to your account is no longer available on the voice
            platform. Please contact{" "}
            <a
              href="mailto:info@skipdial.ai"
              className="font-medium text-accent hover:text-accent-deep"
            >
              info@skipdial.ai
            </a>
            .
          </Panel>
        ) : (
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                icon={Phone}
                label="Total calls"
                value={String(payload.stats.totalCalls)}
                hint={`Last ${payload.days} days`}
                trend={payload.trend?.totalCalls}
              />
              <StatCard
                icon={Gauge}
                label="Connect rate"
                value={`${payload.stats.connectRate}%`}
                hint={`${payload.stats.connected} connected`}
                trend={payload.trend?.connected}
              />
              <StatCard
                icon={Clock}
                label="Talk time"
                value={`${payload.stats.totalMinutes}m`}
                hint="Total across all calls"
                trend={payload.trend?.totalMinutes}
              />
              <StatCard
                icon={Activity}
                label="Avg call length"
                value={formatAvg(payload.stats.avgDurationSeconds)}
                hint={
                  payload.stats.voicemail > 0
                    ? `${payload.stats.voicemail} hit voicemail`
                    : undefined
                }
              />
            </div>

            {payload.requestedDays > payload.days ? (
              <motion.p
                variants={fadeUp}
                className="-mt-2 text-[12.5px] text-ink-faint"
              >
                Showing the last {payload.days} days — your voice platform plan
                retains {payload.retentionDays} days of call history.
              </motion.p>
            ) : null}

            <motion.div variants={fadeUp}>
              <MissedCallsPanel calls={payload.calls} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <CallVolumeChart daily={payload.stats.daily} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <PeakHoursChart calls={payload.calls} />
            </motion.div>

            <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
              {(
                [
                  { key: "inbound", label: "Inbound", icon: PhoneIncoming },
                  { key: "outbound", label: "Outbound", icon: PhoneOutgoing },
                  { key: "web", label: "Web calls", icon: MessageSquareText },
                ] as const
              ).map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-accent">
                    <Icon aria-hidden className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block text-[13px] text-ink-light">{label}</span>
                    <span className="block font-display text-[20px] font-bold leading-tight text-ink">
                      {payload.stats.byDirection[key]}
                    </span>
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <CallList calls={payload.calls} />
            </motion.div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
