import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        "surface-alt": "rgb(var(--surface-alt-rgb) / <alpha-value>)",
        wash: "rgb(var(--wash-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        "ink-light": "rgb(var(--ink-light-rgb) / <alpha-value>)",
        "ink-faint": "rgb(var(--ink-faint-rgb) / <alpha-value>)",
        "ink-inverse": "rgb(var(--ink-inverse-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        "accent-deep": "rgb(var(--accent-deep-rgb) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft-rgb) / <alpha-value>)",
        "accent-tint": "rgb(var(--accent-tint-rgb) / <alpha-value>)",
        signal: "rgb(var(--signal-rgb) / <alpha-value>)",
        warn: "rgb(var(--warn-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
        line: "rgb(var(--line-rgb) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong-rgb) / <alpha-value>)",
        "band-dark": "rgb(var(--band-dark-rgb) / <alpha-value>)",
        "band-dark-elevated":
          "rgb(var(--band-dark-elevated-rgb) / <alpha-value>)",
        "band-dark-line": "rgb(var(--band-dark-line-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        /* Compact display scale — Levity cadence: H1 caps near 52px with a
           deep -0.045em track; hierarchy comes from weight + color, not size. */
        "display-xl": [
          "clamp(2.35rem, 4.6vw, 3.3rem)",
          { lineHeight: "1.08", letterSpacing: "-0.045em" },
        ],
        "display-lg": [
          "clamp(1.9rem, 3.4vw, 2.55rem)",
          { lineHeight: "1.12", letterSpacing: "-0.035em" },
        ],
        "display-md": [
          "clamp(1.55rem, 2.6vw, 2.05rem)",
          { lineHeight: "1.18", letterSpacing: "-0.025em" },
        ],
        "display-sm": [
          "clamp(1.3rem, 2vw, 1.6rem)",
          { lineHeight: "1.28", letterSpacing: "-0.015em" },
        ],
      },
      borderRadius: {
        /* Tight radius system: chips 6px · buttons/inputs 8px · cards 10-12px.
           2xl/3xl are remapped down so existing rounded-2xl cards tighten
           site-wide without touching every component. */
        "2xl": "0.75rem",
        "3xl": "1rem",
      },
      boxShadow: {
        /* Near-flat elevation — hairline borders carry structure, shadows only
           whisper. No colored glows. */
        soft: "0 1px 2px rgb(19 19 22 / 0.03)",
        card: "0 1px 2px rgb(19 19 22 / 0.04), 0 4px 12px -6px rgb(19 19 22 / 0.06)",
        lift: "0 2px 4px rgb(19 19 22 / 0.04), 0 12px 28px -16px rgb(19 19 22 / 0.12)",
        frame:
          "0 0 0 1px rgb(19 19 22 / 0.05), 0 1px 3px rgb(19 19 22 / 0.05), 0 16px 40px -20px rgb(19 19 22 / 0.12)",
        "inner-line": "inset 0 0 0 1px rgb(var(--line-rgb))",
        "spotlight-glow":
          "0 0 24px -6px rgb(var(--accent-rgb) / 0.14), inset 0 0 0 1px rgb(255 255 255 / 0.08)",
      },
      maxWidth: {
        wrap: "72rem",
        copy: "42rem",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      // NEW: Attio & Linear Background Grids and Micro-Animations
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgb(var(--line-rgb) / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--line-rgb) / 0.1) 1px, transparent 1px)",
        "radial-spotlight":
          "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgb(var(--accent-rgb) / 0.12), transparent 40%)",
      },
      backgroundSize: {
        "grid-size": "24px 24px",
      },
      keyframes: {
        "audio-pulse": {
          "0%, 100%": { transform: "scaleY(0.3)", opacity: "0.6" },
          "50%": { transform: "scaleY(1)", opacity: "1" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
      },
      animation: {
        "waveform-fast": "audio-pulse 0.8s ease-in-out infinite",
        "waveform-slow": "audio-pulse 1.2s ease-in-out infinite",
        "waveform-mid": "audio-pulse 1.0s ease-in-out infinite",
        "border-beam": "border-beam 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
