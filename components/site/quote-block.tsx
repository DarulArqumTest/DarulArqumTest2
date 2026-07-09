"use client";

import { motion } from "motion/react";
import { Ambient } from "@/components/site/ambient";

export function QuoteBlock({
  arabic,
  text,
  source,
}: {
  arabic?: string;
  text: string;
  source: string;
}) {
  return (
    <section className="relative overflow-hidden bg-forest px-5 py-24 text-bone md:py-32">
      <Ambient dark grain />
      <div className="relative mx-auto max-w-4xl text-center">
        {arabic && (
          <motion.p
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            lang="ar"
            dir="rtl"
            className="font-arabic text-3xl leading-relaxed text-brassL md:text-4xl"
          >
            {arabic}
          </motion.p>
        )}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-2xl leading-relaxed tracking-tight md:text-4xl md:leading-snug"
        >
          &ldquo;{text}&rdquo;
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-4 text-sm text-bone/55"
        >
          {source}
        </motion.p>
      </div>
    </section>
  );
}
