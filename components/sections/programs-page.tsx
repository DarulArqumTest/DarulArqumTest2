"use client";

/**
 * The programmes, as a page of their own.
 *
 * "Programs" in the nav used to be a scroll target: it dropped you into the
 * middle of the homepage and flashed a highlight. That is fine as a shortcut
 * and useless as a destination — you cannot link to it, share it, or come
 * back to it, and it never tells you what a class costs or when it runs.
 * Every programme is laid out here with its schedule, its fee and its way in.
 */

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { PROGRAMS, type Program } from "@/lib/programs";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { ORG } from "@/lib/links";

const EASE = [0.22, 1, 0.36, 1] as const;

function ProgramCard({ p, index }: { p: Program; index: number }) {
  const accent = p.accent;
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: Math.min(index, 3) * 0.07, ease: EASE }}
      className="da-prog-card"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div
        className={p.slug === "welearn" ? "da-prog-art da-prog-art-flat" : "da-prog-art"}
        style={{ backgroundImage: `url('${p.photo}')`, backgroundSize: "cover", backgroundPosition: p.focus }}
        aria-hidden
      />

      <div className="da-prog-body">
        <p className="da-prog-eyebrow">{p.eyebrow}</p>
        <h2 className="da-prog-title">{p.name}</h2>
        <p className="da-prog-lede">{p.lede}</p>

        <dl className="da-prog-facts">
          {p.cardFacts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="da-prog-actions">
          {p.registerHref ? (
            <Link href={p.registerHref} className="da-btn da-btn-gold da-btn-sm">
              Register <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <a href={p.joinUrl} target="_blank" rel="noopener noreferrer" className="da-btn da-btn-gold da-btn-sm">
              Join on Zoom <span aria-hidden="true">↗</span>
            </a>
          )}
          <Link href={p.href} className="da-btn da-btn-ghost da-btn-sm">
            Full details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function ProgramsPage() {
  return (
    <div className="da-prog-page">
      <div className="da-prog-head">
        <Breadcrumbs items={[{ label: "Programs" }]} />
        <p className="da-prog-kicker">Al-Arif Islamic Institute · Darul Arqum</p>
        <h1 className="da-prog-h1">
          Learning at the masjid, <em>from first surah to Aalim.</em>
        </h1>
        <p className="da-prog-intro">
          Five programmes run out of Darul Arqum: two full-time tracks at the institute, an evening
          madrasa five nights a week, an Arabic class built for young children, and live classes
          online. Schedules and fees are below — register from any card.
        </p>
      </div>

      <div className="da-prog-grid">
        {PROGRAMS.map((p, i) => (
          <ProgramCard key={p.slug} p={p} index={i} />
        ))}
      </div>

      {/* Was a yellow card holding a yellow button, with the question set as
          a caption. The question is the heading; the panel is neutral so the
          actions are the only colour in it. */}
      <div className="da-prog-help da-panel da-panel-flush">
        <div className="da-prog-help-text">
          <h2 className="da-panel-title">Not sure which one fits?</h2>
          <p className="da-panel-copy">
            Tell us the student&apos;s age and what they can already read, and the team will point you
            to the right class.
          </p>
        </div>
        <div className="da-prog-help-actions">
          <a href={ORG.phoneHref} className="da-solid-btn">
            Call {ORG.phone}
          </a>
          <WhatsAppButton label="Ask on WhatsApp" />
        </div>
      </div>
    </div>
  );
}
