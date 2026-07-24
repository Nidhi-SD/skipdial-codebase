"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValueEvent } from "framer-motion";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion";

function AnimatedCurrency({ value, className }: { value: number; className?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const springValue = useSpring(value, { bounce: 0, duration: 600 });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useMotionValueEvent(springValue, "change", (latest) => {
    if (nodeRef.current) {
      nodeRef.current.textContent = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(latest);
    }
  });

  return <span ref={nodeRef} className={className} />;
}

export function LostRevenueCalculator({ className }: { className?: string }) {
  const [missedCalls, setMissedCalls] = useState(50);
  const [customerValue, setCustomerValue] = useState(1500);

  // Math: 20% conversion rate of missed calls to customers
  const CONVERSION_RATE = 0.2;
  const lostCustomersMonthly = missedCalls * CONVERSION_RATE;
  const lostRevenueMonthly = lostCustomersMonthly * customerValue;
  const lostRevenueAnnual = lostRevenueMonthly * 12;

  return (
    <SpotlightCard
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface shadow-sm md:flex-row",
        className
      )}
    >
      {/* Controls Section */}
      <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
        <h3 className="text-[20px] font-bold text-ink">Calculate Your Risk</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-light">
          See how quickly unanswered rings add up. We assume a conservative 20% 
          conversion rate for missed opportunities.
        </p>

        <div className="mt-10 space-y-8">
          {/* Slider 1: Missed Calls */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label htmlFor="missed-calls" className="text-[14px] font-semibold text-ink">
                Missed calls per month
              </label>
              <span className="rounded-md bg-accent-tint/50 px-2.5 py-1 text-[13.5px] font-bold text-accent">
                {missedCalls}
              </span>
            </div>
            <input
              id="missed-calls"
              type="range"
              min="10"
              max="500"
              step="10"
              value={missedCalls}
              onChange={(e) => setMissedCalls(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>

          {/* Slider 2: Average Customer Value */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label htmlFor="customer-value" className="text-[14px] font-semibold text-ink">
                Average value of a customer
              </label>
              <span className="rounded-md bg-accent-tint/50 px-2.5 py-1 text-[13.5px] font-bold text-accent">
                ${customerValue.toLocaleString()}
              </span>
            </div>
            <input
              id="customer-value"
              type="range"
              min="100"
              max="10000"
              step="100"
              value={customerValue}
              onChange={(e) => setCustomerValue(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="relative flex w-full flex-col items-center justify-center border-t border-line bg-surface-alt/50 p-8 text-center md:w-[45%] md:border-l md:border-t-0 md:p-12">
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
          style={{
            backgroundImage: "radial-gradient(rgb(var(--accent-rgb) / 0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        <div className="relative z-10">
          <p className="text-[14px] font-semibold uppercase tracking-wider text-ink-light">
            Annual Lost Revenue
          </p>
          <div className="mt-4 text-display-xl font-bold tracking-tight text-ink md:text-[56px]">
            <AnimatedCurrency value={lostRevenueAnnual} />
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-[14.5px] font-medium text-ink-light">
            <span className="h-2 w-2 rounded-full bg-warn/80" />
            <span>
              <AnimatedCurrency value={lostRevenueMonthly} className="font-bold text-ink" /> per month
            </span>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
