"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/cn";

function fmt(t: number) {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  label = "Listen to a Sample:",
  className,
}: {
  src: string;
  label?: string;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnd = () => setPlaying(false);
    if (el.readyState >= 1 && isFinite(el.duration)) setDuration(el.duration);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setCurrent(t);
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className={cn("w-full", className)}>
      <p className="mb-3 text-[13px] font-semibold text-ink-light">
        {label}
      </p>
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 pr-5 shadow-card">
        <audio ref={audioRef} src={src} preload="metadata" />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause sample call" : "Play sample call"}
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-ink-inverse shadow-card transition-all duration-200 ease-out-expo hover:bg-accent-deep active:scale-95"
        >
          {playing ? (
            <Pause aria-hidden className="h-5 w-5" />
          ) : (
            <Play aria-hidden className="ml-0.5 h-5 w-5" />
          )}
        </button>

        {/* Ambient bars — animate while playing */}
        <div aria-hidden className="hidden h-8 items-center gap-[3px] sm:flex">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-[3px] rounded-full bg-accent/60 transition-transform",
                playing && "waveform-bar"
              )}
              style={{
                height: `${35 + ((i * 43) % 55)}%`,
                animationDelay: `${(i % 7) * 0.13}s`,
                ...(playing ? {} : { transform: "scaleY(0.5)" }),
              }}
            />
          ))}
        </div>

        <div className="flex flex-1 items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={current}
            onChange={seek}
            aria-label="Seek within sample call"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
            style={{
              background: `linear-gradient(90deg, var(--accent) ${progress}%, var(--line) ${progress}%)`,
            }}
          />
          <span className="shrink-0 font-mono text-[12px] tabular-nums text-ink-light">
            {fmt(current)} / {fmt(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
