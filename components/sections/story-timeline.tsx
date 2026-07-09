"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "@/components/site/reveal";

const MILESTONES = [
  {
    year: "2019",
    title: "A community organizes",
    body: "Darul Arqum incorporates (Feb 23, 2019) as a non-profit charitable organization — Riverside South families uniting to establish the area's first masjid, Islamic education, and community services.",
  },
  {
    year: "2020",
    title: "A home of our own",
    body: "On July 30, 2020 the community acquires 4269 Limebank Rd for CA$665,000 — an extraordinary act of collective giving through donations and an interest-free Qard-e-Hasan.",
  },
  {
    year: "2021",
    title: "Doors open for worship",
    body: "Five daily prayers in congregation, Jumu'ah with two khutbahs, and the community's first Taraweeh at home in Ramadhan 1442.",
  },
  {
    year: "2025",
    title: "A house of knowledge",
    body: "Al-Arif Islamic Institute launches the Aalim program and full-time Hifz under Mufti Taqi, joining the weekday madrasa, KidsLearnArabic and welearn online.",
  },
  {
    year: "Today",
    title: "Building, together",
    body: "The masjid carries ~$6,000/month in running costs and a $144K community loan. Sixty dollars a family, every month, finishes what we started — a destination for the National Capital Region and Canada at large, insha'Allah.",
  },
];

export function StoryTimeline() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl px-5 py-20 md:py-28">
      <div className="absolute bottom-8 left-[27px] top-8 w-px bg-line md:left-1/2" aria-hidden />
      <motion.div
        style={{ scaleY: line, transformOrigin: "top" }}
        className="absolute bottom-8 left-[27px] top-8 w-px bg-brass md:left-1/2"
        aria-hidden
      />
      <div className="space-y-16">
        {MILESTONES.map((m, i) => (
          <Reveal key={m.year} delay={0.05}>
            <div className={`relative flex gap-8 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"} pl-14 md:pl-0`}>
              <span
                className={`absolute top-1 h-3.5 w-3.5 rounded-full border-2 border-brass bg-bone ${i % 2 ? "left-[21px] md:-left-[7px]" : "left-[21px] md:-right-[7px] md:left-auto"}`}
                aria-hidden
              />
              <div>
                <p className="font-display text-3xl tracking-tight text-brass">{m.year}</p>
                <h3 className="mt-2 font-display text-xl tracking-tight text-ink">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{m.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
