"use client";


import * as React from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { FormSystem, type Field } from "@/components/site/form-system";

/** Shared split layout for program detail pages: facts rail + registration. */
export function ProgramDetail({
  facts,
  about,
  formName,
  fields,
  formTitle,
  formNote,
  extra,
}: {
  facts: { label: string; value: string }[];
  about: { title: string; body: string };
  formName?: string;
  fields?: Field[];
  formTitle?: string;
  formNote?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-wide items-start gap-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-28">
          <SectionIntro eyebrow="About the program" title={about.title} lede={about.body} />
          <motion.dl
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="mt-9 divide-y divide-line border-y border-line"
          >
            {facts.map((f) => (
              <motion.div
                key={f.label}
                variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
                className="flex justify-between gap-6 py-3.5 text-sm"
              >
                <dt className="text-ink/55">{f.label}</dt>
                <dd className="text-right font-medium text-ink">{f.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
          {extra && <Reveal delay={0.15} className="mt-8">{extra}</Reveal>}
        </div>

        {formName && fields && (
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-line bg-white/50 p-7 md:p-10">
              <h2 className="font-display text-2xl tracking-tight text-ink">{formTitle ?? "Register"}</h2>
              <div className="mt-7">
                <FormSystem formName={formName} fields={fields} submitLabel="Submit registration" note={formNote} />
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
