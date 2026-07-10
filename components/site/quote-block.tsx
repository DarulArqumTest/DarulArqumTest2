"use client";

import { motion } from "motion/react";
import { Ambient } from "@/components/site/ambient";
import { DaAmbient } from "@/components/site/da-motifs";

export function QuoteBlock({
  arabic,
  text,
  source,
  theme = "classic",
}: {
  arabic?: string;
  text: string;
  source: string;
  /** "da" opts into the 2026 redesign palette/fonts. */
  theme?: "classic" | "da";
}) {
  const isDa = theme === "da";
  return (
    <section
      className={`relative overflow-hidden px-5 py-24 md:py-32 ${
        isDa ? "bg-da-bg2 font-daBody text-da-cream" : "bg-forest text-bone"
      }`}
    >
      {isDa ? <DaAmbient /> : <Ambient dark grain />}
      <div className="relative mx-auto max-w-4xl text-center">
        {arabic && (
          <motion.p
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            lang="ar"
            dir="rtl"
            className={`font-arabic text-3xl leading-relaxed md:text-4xl ${isDa ? "text-da-goldL" : "text-brassL"}`}
          >
            {arabic}
          </motion.p>
        )}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-6 text-2xl leading-relaxed tracking-tight md:text-4xl md:leading-snug ${
            isDa ? "font-daDisplay italic" : "font-display"
          }`}
        >
          &ldquo;{text}&rdquo;
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className={`mt-4 text-sm ${isDa ? "text-da-cream/55" : "text-bone/55"}`}
        >
          {source}
        </motion.p>
      </div>
    </section>
  );
}
