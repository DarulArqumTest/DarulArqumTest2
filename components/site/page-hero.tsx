"use client";

import { motion, useReducedMotion } from "motion/react";
import { Ambient } from "@/components/site/ambient";
import { DaAmbient } from "@/components/site/da-motifs";
import { Breadcrumbs, type Crumb } from "@/components/site/breadcrumbs";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cinematic dark masthead used by every subpage — same staging as home. */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  crumbs,
  theme = "classic",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
  /** trail back up, minus Home — omit on top-level pages */
  crumbs?: Crumb[];
  /** "da" opts into the 2026 redesign palette/fonts. */
  theme?: "classic" | "da";
}) {
  const reduce = useReducedMotion();
  const rise = (d: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 26 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d, ease: EASE },
  });
  const isDa = theme === "da";
  return (
    <div
      className={`relative overflow-hidden px-5 pb-11 pt-24 md:pb-20 md:pt-40 ${
        isDa ? "bg-da-bg font-daBody text-da-cream" : "bg-ink text-bone"
      }`}
    >
      {isDa ? <DaAmbient stars /> : <Ambient dark grain />}
      <div className="relative mx-auto max-w-wide">
        {crumbs && (
          <motion.div {...rise(0.04)} className="mb-6">
            <Breadcrumbs items={crumbs} />
          </motion.div>
        )}
        <motion.p {...rise(0.1)} className={`text-[11px] uppercase tracking-[0.3em] ${isDa ? "text-da-goldL" : "text-brassL"}`}>
          {eyebrow}
        </motion.p>
        <motion.h1
          {...rise(0.22)}
          className={`mt-4 max-w-3xl leading-[1.04] tracking-tight md:mt-5 ${
            isDa
              ? "font-daDisplay text-[clamp(30px,4.6vw,64px)] font-medium"
              : "font-display text-[34px] sm:text-5xl md:text-7xl"
          }`}
        >
          {title}
        </motion.h1>
        {lede && (
          <motion.p {...rise(0.34)} className={`mt-4 max-w-copy text-[13.5px] leading-relaxed md:mt-6 md:text-base ${isDa ? "text-da-cream/70" : "text-bone/65"}`}>
            {lede}
          </motion.p>
        )}
        {children && <motion.div {...rise(0.46)} className="mt-6 md:mt-9">{children}</motion.div>}
      </div>
      <motion.div
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
        style={{ transformOrigin: "left" }}
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r to-transparent ${
          isDa ? "from-da-gold/60 via-da-gold/20" : "from-brass/60 via-brass/20"
        }`}
      />
    </div>
  );
}
