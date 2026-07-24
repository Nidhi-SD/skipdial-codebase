import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { BlurTitle, Reveal } from "@/components/motion";
import type { ReactNode } from "react";

/* ── Layout ────────────────────────────────────────────────────────────────── */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-wrap px-5 md:px-8", className)}>
      {children}
    </div>
  );
}

/* ── Eyebrow — quiet 12px section label (Levity cadence: plain, no mono caps,
      no index numbers; the label names the topic and gets out of the way) ───── */

export function Eyebrow({
  children,
  className,
  tone = "accent",
}: {
  children: ReactNode;
  /** Accepted for backwards compatibility; index numbers are no longer shown. */
  index?: string;
  className?: string;
  tone?: "accent" | "inverse";
}) {
  return (
    <p
      className={cn(
        "text-[13px] font-semibold",
        tone === "accent" ? "text-accent" : "text-accent-soft",
        className
      )}
    >
      {children}
    </p>
  );
}

/* ── SectionHead — eyebrow + two-tone blur headline + supporting copy ──────── */

export function SectionHead({
  eyebrow,
  title,
  mutedTitle,
  children,
  align = "left",
  tone = "light",
  as = "h2",
  className,
}: {
  eyebrow?: string;
  index?: string;
  title: string;
  mutedTitle?: string;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <Reveal variant="fadeUp">
          <Eyebrow tone={tone === "dark" ? "inverse" : "accent"} className="mb-3">
            {eyebrow}
          </Eyebrow>
        </Reveal>
      ) : null}
      <BlurTitle
        as={as}
        text={title}
        mutedText={mutedTitle}
        className={cn(
          "text-balance",
          as === "h1" ? "text-display-xl" : "text-display-lg",
          tone === "dark" && "text-ink-inverse"
        )}
      />
      {children ? (
        <Reveal variant="fadeUp" delay={0.15}>
          <div
            className={cn(
              "mt-4 max-w-copy text-[16px] leading-relaxed",
              tone === "dark" ? "text-ink-inverse/70" : "text-ink font-medium",
              align === "center" && "mx-auto"
            )}
          >
            {children}
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ── Buttons ───────────────────────────────────────────────────────────────── */

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "accent" | "outline" | "inverse" | "ghost";
  size?: "sm" | "md" | "lg";
  arrow?: boolean;
  className?: string;
  external?: boolean;
};

/* Compact, flat buttons (Levity cadence): 8px radius, 14px label, solid brand
   fill, no glow or sheen. Elevation stays on cards, never on controls. */
const sizeClasses = {
  sm: "h-8 px-3.5 text-[13px] gap-1.5",
  md: "h-10 px-4 text-[14px] gap-1.5",
  lg: "h-11 px-5 text-[14px] gap-2",
};

const variantClasses = {
  primary: "bg-accent text-ink-inverse hover:bg-accent-deep",
  accent: "bg-accent text-ink-inverse hover:bg-accent-deep",
  outline:
    "border border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-alt",
  inverse: "bg-ink-inverse text-ink hover:bg-white/90",
  ghost: "text-ink-light hover:text-ink",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  external = false,
}: ButtonProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out-expo active:scale-[0.98]",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
      {arrow ? (
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
        />
      ) : null}
    </Link>
  );
}

/* ── Inline text link with sliding arrow ───────────────────────────────────── */

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent transition-colors hover:text-accent-deep",
        className
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-1"
      />
    </Link>
  );
}

/* ── Logo lockup ───────────────────────────────────────────────────────────── */

export function Logo({
  variant = "color",
  size = "md",
  className,
}: {
  variant?: "color" | "white";
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={variant === "color" ? "/logos/skipdial-symbol-color.svg" : "/logos/skipdial-symbol-white.svg"}
        alt=""
        className={size === "lg" ? "h-9 w-9" : "h-8 w-8"}
      />
      <span
        className={cn(
          "font-display font-bold tracking-tight",
          size === "lg" ? "text-[21px]" : "text-[19px]",
          variant === "color" ? "text-ink" : "text-ink-inverse"
        )}
      >
        SkipDial
      </span>
    </span>
  );
}
