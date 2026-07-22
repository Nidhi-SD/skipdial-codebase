"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { CalendarClock, History, MessageSquareText, ShieldAlert, ArrowRight } from "lucide-react";
import { Stagger, Item } from "@/components/motion";

const flipCards = [
  {
    frontIcon: History,
    frontTitle: "Lead Reactivation",
    frontBody: "Calling old, cold leads that haven't responded to emails.",
    backTitle: "AI Handling",
    backBody: `"Hi, this is SkipDial calling for John. We noticed you requested a quote last month but we never connected. Are you still looking for help with that project?"`,
    tone: "Friendly & Direct",
  },
  {
    frontIcon: CalendarClock,
    frontTitle: "Appointment Reminders",
    frontBody: "Calling patients or clients 24 hours before their slot to confirm.",
    backTitle: "AI Handling",
    backBody: `"Hi Sarah, calling to confirm your dental appointment tomorrow at 2 PM. If you need to reschedule, I can help you find a new time right now."`,
    tone: "Helpful & Efficient",
  },
  {
    frontIcon: MessageSquareText,
    frontTitle: "Post-Sale Follow-Up",
    frontBody: "Checking in after a service is completed to ensure satisfaction.",
    backTitle: "AI Handling",
    backBody: `"Hi Mark, just calling to make sure the HVAC repair went well yesterday. Is the AC running cold, or do we need to send the tech back out?"`,
    tone: "Caring & Attentive",
  },
  {
    frontIcon: ShieldAlert,
    frontTitle: "Handling Objections",
    frontBody: "When the lead says 'I'm too busy right now' or 'Call me later'.",
    backTitle: "AI Handling",
    backBody: `"No problem at all! I know you're busy. Would it be better if I scheduled a quick 5-minute callback for tomorrow morning, or Thursday afternoon?"`,
    tone: "Persistent but Polite",
  },
];

export function ObjectionFlipCards({ className }: { className?: string }) {
  return (
    <Stagger className={cn("grid gap-5 sm:grid-cols-2", className)}>
      {flipCards.map((card, i) => (
        <Item key={i} className="group relative h-[220px] w-full" style={{ perspective: "1000px" }}>
          {/* Inner wrapper for 3D flip */}
          <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            
            {/* Front of card */}
            <div className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-line bg-surface p-6 shadow-sm [backface-visibility:hidden]">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-tint/50 text-accent">
                <card.frontIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-[17px] font-bold text-ink">{card.frontTitle}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-light">{card.frontBody}</p>
              
              <div className="absolute bottom-5 right-5 flex items-center gap-1.5 text-[12px] font-semibold text-accent opacity-0 transition-opacity delay-100 group-hover:opacity-0 sm:opacity-100">
                Hover to see AI script <ArrowRight className="h-3 w-3" />
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-accent bg-accent/5 p-6 shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                  <MessageSquareText className="h-3 w-3" />
                </div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-accent">
                  {card.backTitle}
                </span>
                <span className="ml-auto rounded-full bg-surface px-2.5 py-1 text-[10px] font-semibold text-ink-light border border-line">
                  Tone: {card.tone}
                </span>
              </div>
              <p className="mt-4 text-[14.5px] italic leading-relaxed text-ink font-medium">
                {card.backBody}
              </p>
            </div>

          </div>
        </Item>
      ))}
    </Stagger>
  );
}
