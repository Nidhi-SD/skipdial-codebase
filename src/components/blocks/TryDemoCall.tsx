"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Home,
  Stethoscope,
  Gavel,
  Wind,
  Warehouse,
  Building2,
  Activity,
  ShieldCheck,
  ChevronDown,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Status = "idle" | "loading" | "success" | "error";

const AGENT_NAME = "James";

const industries: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "real-estate", label: "Real Estate", icon: Home },
  { value: "dentists", label: "Dentists", icon: Stethoscope },
  { value: "injury-lawyers", label: "Injury Lawyers", icon: Gavel },
  { value: "hvac", label: "HVAC", icon: Wind },
  { value: "roofing", label: "Roofing", icon: Warehouse },
  { value: "property-management", label: "Property Management", icon: Building2 },
  { value: "chiropractors", label: "Chiropractors", icon: Activity },
  { value: "insurance", label: "Insurance", icon: ShieldCheck },
];

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
];

const pillSelectClasses =
  "h-9 cursor-pointer appearance-none rounded-full border border-line/70 bg-surface/90 pl-8 pr-7 text-[12.5px] font-semibold text-ink shadow-soft backdrop-blur-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

const inputClasses =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function TryDemoCall({
  className,
  defaultIndustry,
}: {
  className?: string;
  defaultIndustry?: string;
}) {
  const reduce = useReducedMotion();
  const initialIdx = Math.max(
    0,
    industries.findIndex((ind) => ind.value === defaultIndustry)
  );
  const [industryIdx, setIndustryIdx] = useState(initialIdx);
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  /* number | undefined, not the inferred setTimeout return type: this repo
     pulls in both DOM and @types/node globals, whose overloaded setTimeout
     signatures TS resolves inconsistently (NodeJS.Timeout vs number)
     depending on call form. window.setTimeout always returns a number at
     runtime, so we pin the ref type and assert past the ambiguity below. */
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const industry = industries[industryIdx];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    const next: Record<string, string> = {};
    if (!name) next.name = "Please enter your name.";
    if (!company) next.company = "Please enter your company name.";
    if (!/^[\d\s()+.-]{7,20}$/.test(phone))
      next.phone = "Please enter a valid phone number.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstInvalid = form.querySelector<HTMLElement>(
        `[name="${Object.keys(next)[0]}"]`
      );
      firstInvalid?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/demo-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, phone, email, industry: industry.value, language }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
      // The call itself isn't tracked live (no status polling), so the
      // success state resets on its own after a call would realistically
      // have ended, instead of sitting there indefinitely.
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setStatus("idle"), 60_000) as unknown as number;
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-line bg-surface shadow-frame",
        className
      )}
    >
      {/* Incoming-call hero zone — tinted gradient, pill selectors, ripple avatar */}
      <div className="relative overflow-hidden bg-gradient-to-b from-accent-tint/70 via-accent-soft/15 to-surface px-5 pb-10 pt-5 sm:px-6">
        <div
          aria-hidden
          className="grid-overlay-light absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(60%_70%_at_50%_0%,black,transparent)]"
        />

        {/* Pill selectors */}
        <div className="relative flex items-center justify-between gap-3">
          <div className="relative">
            <industry.icon
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-accent"
            />
            <select
              aria-label="Choose an industry"
              value={industryIdx}
              onChange={(e) => setIndustryIdx(Number(e.target.value))}
              className={pillSelectClasses}
            >
              {industries.map((ind, i) => (
                <option key={ind.value} value={i}>
                  {ind.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint"
            />
          </div>

          <div className="relative">
            <select
              aria-label="Choose a language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={cn(pillSelectClasses, "pl-4")}
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint"
            />
          </div>
        </div>

        {/* Ripple call preview */}
        <div className="relative mt-8 flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            {!reduce && (
              <>
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-accent/40"
                  animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-accent/40"
                  animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
                />
              </>
            )}
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent text-[22px] font-bold text-ink-inverse shadow-lift">
              J
            </span>
            <span
              aria-hidden
              className="pulse-dot absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-signal ring-2 ring-surface"
            />
          </div>

          <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
            <PhoneCall aria-hidden className="h-3 w-3" />
            Incoming demo call
          </p>
          <h3 className="mt-1.5 text-xl font-bold text-ink">{AGENT_NAME} is calling…</h3>
          <AnimatePresence mode="wait">
            <motion.p
              key={industry.value}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="mt-1 max-w-xs text-[13px] text-ink-light"
            >
              as your <span className="font-semibold text-ink">{industry.label}</span> front-desk
              agent
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Lead capture sheet — overlaps the hero zone */}
      <div className="relative -mt-5 rounded-t-[28px] bg-surface p-5 shadow-[0_-12px_28px_-20px_rgb(19_19_22_/_0.25)] sm:p-6">
        <div className="mb-5 text-center sm:text-left">
          <h3 className="text-display-sm font-bold text-ink">
            Receive a Call From Our AI Agent!
          </h3>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-start gap-3 rounded-xl border border-signal/25 bg-signal/5 p-4"
              role="status"
            >
              <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
              <div>
                <p className="text-[15px] font-semibold text-ink">
                  Thanks! Your call is on its way.
                </p>
                <p className="mt-1 text-[14px] text-ink-light">
                  Keep your phone nearby. Our {industry.label.toLowerCase()} agent will call
                  you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.clearTimeout(resetTimer.current);
                    setStatus("idle");
                  }}
                  className="mt-3 cursor-pointer text-[13px] font-semibold text-accent underline-offset-2 hover:underline"
                >
                  Try another call
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={false}
              exit={{ opacity: 0 }}
              onSubmit={onSubmit}
              noValidate
              className="space-y-3"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="try-name" className="sr-only">
                    Name
                  </label>
                  <input
                    id="try-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your Name…"
                    className={cn(inputClasses, errors.name && "border-danger")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1.5 text-[12.5px] text-danger">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="try-company" className="sr-only">
                    Company name
                  </label>
                  <input
                    id="try-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Enter your Company Name…"
                    className={cn(inputClasses, errors.company && "border-danger")}
                    aria-invalid={!!errors.company}
                  />
                  {errors.company && (
                    <p role="alert" className="mt-1.5 text-[12.5px] text-danger">
                      {errors.company}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="try-phone" className="sr-only">
                    Phone number
                  </label>
                  <input
                    id="try-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter your Number…"
                    className={cn(inputClasses, errors.phone && "border-danger")}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p role="alert" className="mt-1.5 text-[12.5px] text-danger">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="try-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="try-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your Email…"
                    className={cn(inputClasses, errors.email && "border-danger")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1.5 text-[12.5px] text-danger">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {status === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger/5 p-3.5 text-[13.5px] text-ink"
                >
                  <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  Oops, there was an error placing your call. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-semibold text-ink-inverse shadow-card transition-all duration-200 ease-out-expo hover:bg-accent-deep hover:shadow-lift active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                    Placing your call…
                  </>
                ) : (
                  <>
                    <PhoneCall aria-hidden className="h-4 w-4" />
                    Get a Call
                  </>
                )}
              </button>

              <p className="text-center text-[11.5px] leading-relaxed text-ink-light">
                By submitting, you authorize SkipDial AI to contact you by phone, which may
                include AI-generated calls. Standard rates may apply.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
