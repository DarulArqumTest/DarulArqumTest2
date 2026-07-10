"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useInView } from "motion/react";
import { KeyRound, Landmark, BookOpen } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { CrescentLantern } from "@/components/site/da-motifs";

const MILESTONES = [
  {
    key: "founding",
    year: "2019",
    tag: "Est. 2019 · Incorporated",
    accent: "#e3c56a",
    title: "A community organizes",
    body: "Darul Arqum incorporates (Feb 23, 2019) as a non-profit charitable organization — Riverside South families uniting to establish the area's first masjid, Islamic education, and community services.",
  },
  {
    key: "home",
    year: "2020",
    tag: "Property acquired",
    accent: "#f3d98a",
    title: "A home of our own",
    body: "On July 30, 2020 the community acquires 4269 Limebank Rd for CA$665,000 — an extraordinary act of collective giving through donations and an interest-free Qard-e-Hasan.",
  },
  {
    key: "worship",
    year: "2021",
    tag: "Five daily prayers",
    accent: "#a9e0c0",
    title: "Doors open for worship",
    body: "Five daily prayers in congregation, Jumu'ah with two khutbahs, and the community's first Taraweeh at home in Ramadhan 1442.",
  },
  {
    key: "knowledge",
    year: "2025",
    tag: "Al-Arif Islamic Institute",
    accent: "#8ec7ff",
    title: "A house of knowledge",
    body: "Al-Arif Islamic Institute launches the Aalim program and full-time Hifz under Mufti Taqi, joining the weekday madrasa, KidsLearnArabic and welearn online.",
  },
  {
    key: "today",
    year: "Today",
    tag: "In progress",
    accent: "#e88a6a",
    title: "Building, together",
    body: "The masjid carries ~$6,000/month in running costs and a $144K community loan. Sixty dollars a family, every month, finishes what we started — a destination for the National Capital Region and Canada at large, insha'Allah.",
    progressPct: 42,
    caption: "$144K community loan · $6,000/mo running costs",
  },
] as const;

const BADGE: Record<string, React.ReactNode> = {
  founding: <CrescentLantern size={22} withLantern glow={false} />,
  home: <KeyRound className="h-5 w-5" />,
  worship: <Landmark className="h-5 w-5" />,
  knowledge: <BookOpen className="h-5 w-5" />,
};

function ProgressRing({ pct, accent }: { pct: number; accent: string }) {
  return (
    <div
      className="da-live-pulse relative flex h-11 w-11 items-center justify-center rounded-full text-[10px] font-bold"
      style={{ background: `conic-gradient(${accent} ${pct * 3.6}deg, rgba(246,243,234,0.12) 0deg)` }}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-da-modal text-da-cream">{pct}%</div>
    </div>
  );
}

function MilestoneCard({ m, index }: { m: (typeof MILESTONES)[number]; index: number }) {
  const isLeft = index % 2 === 0;
  const isToday = m.key === "today";
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className={`relative w-full pl-14 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.3,1)] md:w-[calc(50%-40px)] md:pl-0 ${
        isLeft ? "md:mr-[calc(50%+40px)] md:text-left" : "md:ml-[calc(50%+40px)] md:text-left"
      }`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0,0)" : `translateY(24px) translateX(${isLeft ? "-16px" : "16px"})`,
      }}
    >
      <span
        className="absolute left-[21px] top-1 h-3.5 w-3.5 rounded-full border-2 bg-da-bg md:-left-[47px]"
        style={{ borderColor: m.accent }}
        aria-hidden
      />
      <div
        className="relative max-w-[420px] rounded-[18px] p-7 pb-6 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.5)]"
        style={{
          background: "linear-gradient(155deg, rgba(22,56,38,0.72), rgba(13,35,24,0.58))",
          border: "1px solid rgba(201,162,39,0.22)",
          borderTop: `3px solid ${m.accent}`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: m.accent }}>
              {isToday && <span className="da-live-pulse h-1.5 w-1.5 rounded-full" style={{ background: m.accent }} />}
              {m.tag}
            </p>
            <p className="mt-1 font-daDisplay text-3xl font-medium tracking-tight" style={{ color: m.accent }}>
              {m.year}
            </p>
          </div>
          {isToday ? (
            <ProgressRing pct={m.progressPct} accent={m.accent} />
          ) : (
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ border: `1px solid ${m.accent}55`, background: `${m.accent}1a`, color: m.accent }}
            >
              {BADGE[m.key]}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-daDisplay text-xl font-semibold text-da-cream">{m.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-da-cream/72">{m.body}</p>
        {isToday && (
          <>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-da-cream/10">
              <div className="h-full rounded-full" style={{ width: `${m.progressPct}%`, background: `linear-gradient(90deg, #c9a227, ${m.accent})` }} />
            </div>
            <p className="mt-2 text-xs text-da-cream/50">{m.caption}</p>
          </>
        )}
      </div>
    </div>
  );
}

export function StoryTimeline() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <div ref={ref} className="relative overflow-hidden bg-da-bg px-5 py-20 font-daBody md:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-14 flex justify-center">
          <CrescentLantern size={40} />
        </Reveal>

        <div className="relative">
          <div className="absolute bottom-8 left-[27px] top-8 w-px bg-da-cream/10 md:left-1/2" aria-hidden />
          <motion.div
            style={{ scaleY: line, transformOrigin: "top" }}
            className="absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-da-goldL to-da-gold md:left-1/2"
            aria-hidden
          />
          <div className="space-y-14">
            {MILESTONES.map((m, i) => (
              <MilestoneCard key={m.key} m={m} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
