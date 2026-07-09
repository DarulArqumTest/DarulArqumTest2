"use client";

import { motion, useReducedMotion } from "motion/react";
import { Ambient } from "@/components/site/ambient";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cinematic dark masthead used by every subpage — same staging as home. */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const rise = (d: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 26 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d, ease: EASE },
  });
  return (
    <div className="relative overflow-hidden bg-ink px-5 pb-16 pt-32 text-bone md:pb-20 md:pt-40">
      <Ambient dark grain />
      <div className="relative mx-auto max-w-wide">
        <motion.p {...rise(0.1)} className="text-[11px] uppercase tracking-[0.3em] text-brassL">
          {eyebrow}
        </motion.p>
        <motion.h1
          {...rise(0.22)}
          className="mt-5 max-w-3xl font-display text-5xl leading-[1.04] tracking-tight md:text-7xl"
        >
          {title}
        </motion.h1>
        {lede && (
          <motion.p {...rise(0.34)} className="mt-6 max-w-copy text-sm leading-relaxed text-bone/65 md:text-base">
            {lede}
          </motion.p>
        )}
        {children && <motion.div {...rise(0.46)} className="mt-9">{children}</motion.div>}
      </div>
      <motion.div
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
        style={{ transformOrigin: "left" }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-brass/60 via-brass/20 to-transparent"
      />
    </div>
  );
}
