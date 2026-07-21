"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, useReducedMotion } from "framer-motion";
import { scaleIn } from "@/lib/motion";
import { cn } from "@/lib/cn";
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* Open-redirect guard — only same-origin paths are honored; absolute and
   protocol-relative URLs fall back to home. */
function safeCallbackUrl(raw: string | null): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

type Status = "idle" | "submitting" | "invalid" | "failed";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const hasError = status === "invalid" || status === "failed";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setStatus("invalid");
        return;
      }
      router.push(safeCallbackUrl(searchParams.get("callbackUrl")));
      router.refresh();
    } catch {
      setStatus("failed");
    }
  };

  return (
    <motion.form
      variants={scaleIn}
      onSubmit={handleSubmit}
      className="ai-glow-border relative rounded-2xl border border-line bg-surface p-6 shadow-soft md:p-8"
    >
      {/* One short lateral shake on rejection — the pre-verbal "no" */}
      <motion.div
        animate={
          hasError && !reduce
            ? { x: [0, -7, 7, -4, 4, 0], transition: { duration: 0.4 } }
            : { x: 0 }
        }
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-ink/70"
          >
            Email
          </label>
          <input
            required
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (hasError) setStatus("idle");
            }}
            className="h-11 w-full rounded-xl border border-line bg-surface-alt px-4 transition-all hover:border-line-strong focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-ink/70"
          >
            Password
          </label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (hasError) setStatus("idle");
              }}
              className="h-11 w-full rounded-xl border border-line bg-surface-alt px-4 pr-12 transition-all hover:border-line-strong focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink/50 transition-colors hover:text-ink"
            >
              {showPassword ? (
                <EyeOff aria-hidden className="h-4 w-4" />
              ) : (
                <Eye aria-hidden className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {hasError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/10 px-3.5 py-2.5 text-[13.5px] leading-snug text-danger"
          >
            <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            {status === "invalid"
              ? "Invalid email or password."
              : "Couldn't reach the server. Check your connection and try again."}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "btn-sheen group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-semibold text-ink-inverse shadow-card transition-all duration-200 ease-out-expo hover:bg-accent-deep hover:shadow-lift active:scale-[0.98]",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {status === "submitting" ? (
              <>
                <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </div>

        <p className="pt-1 text-center text-[12.5px] text-ink-light">
          Trouble signing in?{" "}
          <a
            href="mailto:info@skipdial.ai"
            className="font-medium text-accent transition-colors hover:text-accent-deep"
          >
            info@skipdial.ai
          </a>
        </p>
      </motion.div>
    </motion.form>
  );
}
