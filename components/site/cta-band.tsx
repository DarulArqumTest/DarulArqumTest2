"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Ambient } from "@/components/site/ambient";

export function CTABand({
  title,
  body,
  actions,
}: {
  title: string;
  body: string;
  actions: { label: string; href: string; primary?: boolean }[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-20 text-bone md:py-28">
      <Ambient dark grain />
      <div className="relative mx-auto flex max-w-wide flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/60">{body}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-3"
        >
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              className={
                a.primary
                  ? "inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
                  : "inline-flex items-center gap-2 rounded-full border border-bone/25 px-6 py-3.5 text-sm text-bone transition-colors hover:bg-bone/10"
              }
            >
              {a.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
