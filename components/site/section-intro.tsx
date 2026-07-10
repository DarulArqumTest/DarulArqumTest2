"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionIntro({
  eyebrow,
  title,
  lede,
  dark = false,
  align = "left",
  theme = "classic",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  dark?: boolean;
  align?: "left" | "center";
  /** "da" opts into the 2026 redesign palette/fonts (da-gold/da-cream, Cormorant Garamond). */
  theme?: "classic" | "da";
}) {
  const reduce = useReducedMotion();
  const item = (d: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 22 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-70px" },
    transition: { duration: 0.7, delay: d, ease: EASE },
  });
  const isDa = theme === "da";
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <motion.p
        {...item(0)}
        className={`text-[11px] uppercase tracking-[0.3em] ${isDa ? "text-da-goldL" : "text-brass"}`}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        {...item(0.1)}
        className={`mt-4 tracking-tight ${
          isDa
            ? `font-daDisplay text-[clamp(32px,4vw,48px)] font-medium ${dark ? "text-da-cream" : "text-da-bg"}`
            : `font-display text-4xl md:text-5xl ${dark ? "text-bone" : "text-ink"}`
        }`}
      >
        {title}
      </motion.h2>
      {lede && (
        <motion.p
          {...item(0.2)}
          className={`mt-5 max-w-copy text-sm leading-relaxed md:text-base ${
            isDa ? (dark ? "text-da-cream/65" : "text-da-bg/65") : dark ? "text-bone/65" : "text-ink/65"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
