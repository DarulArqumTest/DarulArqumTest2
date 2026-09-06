"use client";

/**
 * The two blocks that sit above every registration form.
 *
 * Both used to be placeholders wearing a colour: two fact tiles that differed
 * only by tint and by a "◷" or a "$", and a curriculum rendered as five
 * identical dots on a line. Five subjects that look the same are not a
 * curriculum, they are a progress bar.
 *
 * Each subject now carries its own drawn mark and its own sentence, and the
 * tiles carry a real calendar and a real stack of coins. Shared by all four
 * registration pages, so a fifth programme cannot arrive with dots again.
 */

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Glyph, SUBJECT_GLYPH, type GlyphName } from "@/components/site/program-glyphs";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FactTiles({
  schedule,
  scheduleNote,
  tuition,
  tuitionNote,
  accent = "#c9a227",
  delay = 0.1,
}: {
  schedule: string;
  scheduleNote: string;
  tuition: string;
  tuitionNote: string;
  accent?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const tiles = [
    { k: "calendar" as GlyphName, eyebrow: "Schedule", value: schedule, note: scheduleNote, tint: accent },
    { k: "tuition" as GlyphName, eyebrow: "Tuition", value: tuition, note: tuitionNote, tint: "#a9e0c0" },
  ];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className="da-facts"
    >
      {tiles.map((t) => (
        <div key={t.eyebrow} className="da-fact" style={{ "--tint": t.tint } as React.CSSProperties}>
          <span className="da-fact-mark" aria-hidden>
            <Glyph name={t.k} size={26} />
          </span>
          <span className="da-fact-eyebrow">{t.eyebrow}</span>
          <span className="da-fact-value">{t.value}</span>
          <span className="da-fact-note">{t.note}</span>
        </div>
      ))}
    </motion.div>
  );
}

export function CurriculumTrack({
  title,
  items,
  accent = "#8fb4c9",
  delay = 0.14,
}: {
  title: string;
  /** straight from a programme's `curriculum`: subject, and what it is */
  items: { title: string; body: string }[];
  accent?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className="da-track"
      style={{ "--tint": accent } as React.CSSProperties}
    >
      <p className="da-track-title">{title}</p>
      <ol className="da-track-list">
        {items.map((it, i) => (
          <li key={it.title}>
            <span className="da-track-mark" aria-hidden>
              <Glyph name={SUBJECT_GLYPH[it.title] ?? "mushaf"} size={22} />
            </span>
            <span className="da-track-body">
              <span className="da-track-label">
                <b aria-hidden>{String(i + 1).padStart(2, "0")}</b>
                {it.title}
              </span>
              <span className="da-track-note">{it.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
