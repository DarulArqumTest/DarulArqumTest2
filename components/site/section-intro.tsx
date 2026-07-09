"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionIntro({
  eyebrow,
  title,
  lede,
  dark = false,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  const reduce = useReducedMotion();
  const item = (d: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 22 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-70px" },
    transition: { duration: 0.7, delay: d, ease: EASE },
  });
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <motion.p
        {...item(0)}
        className="text-[11px] uppercase tracking-[0.3em] text-brass"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        {...item(0.1)}
        className={`mt-4 font-display text-4xl tracking-tight md:text-5xl ${dark ? "text-bone" : "text-ink"}`}
      >
        {title}
      </motion.h2>
      {lede && (
        <motion.p
          {...item(0.2)}
          className={`mt-5 max-w-copy text-sm leading-relaxed md:text-base ${dark ? "text-bone/65" : "text-ink/65"} ${align === "center" ? "mx-auto" : ""}`}
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
