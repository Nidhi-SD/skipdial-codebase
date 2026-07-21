"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Eyebrow } from "@/components/ui/primitives";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="hero-wash relative flex min-h-dvh items-center overflow-hidden px-6 pb-20 pt-40 md:pb-32 md:pt-48">
      <div
        aria-hidden
        className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_55%_at_50%_25%,black,transparent)]"
      />
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative mx-auto w-full max-w-md"
      >
        <motion.div variants={fadeUp}>
          <Eyebrow className="mb-5 justify-center text-center">
            Welcome Back
          </Eyebrow>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="mb-3 text-center font-display text-[clamp(2.4rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-ink"
        >
          Sign <span className="text-accent">in.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mb-10 text-center text-ink-light">
          Access your SkipDial account.
        </motion.p>

        <Suspense fallback={<div className="h-[400px]" />}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </section>
  );
}
