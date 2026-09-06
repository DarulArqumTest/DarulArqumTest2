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
import { EXT, ORG, R } from "@/lib/links";

const EASE = [0.22, 1, 0.36, 1] as const;

/** welearn has no photograph, so it gets a drawn one: a lit screen at night. */
function WelearnArt({ accent }: { accent: string }) {
  return (
    <div className="da-prog-art" aria-hidden>
      <svg viewBox="0 0 200 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="da-wl-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12283a" />
            <stop offset="100%" stopColor="#0d2419" />
          </linearGradient>
          <linearGradient id="da-wl-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#da-wl-sky)" />
        {[
          [24, 22],
          [48, 14],
          [160, 26],
          [178, 46],
          [36, 92],
          [150, 96],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 1.1 : 1.6} fill="#f6f3ea" opacity={0.5} />
        ))}
        <rect x="62" y="34" width="76" height="46" rx="4" fill="url(#da-wl-screen)" />
        <rect x="66" y="38" width="68" height="38" rx="2" fill="#0b1f16" opacity="0.72" />
        {[44, 52, 60].map((y, i) => (
          <rect key={y} x="72" y={y} width={i === 1 ? 44 : 56} height="3" rx="1.5" fill={accent} opacity={0.55} />
        ))}
        <rect x="92" y="80" width="16" height="6" fill={accent} opacity="0.5" />
        <rect x="78" y="86" width="44" height="4" rx="2" fill={accent} opacity="0.65" />
      </svg>
    </div>
  );
}

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
      {p.photo ? (
        <div
          className="da-prog-art"
          style={{ backgroundImage: `url('${p.photo}')`, backgroundSize: "cover", backgroundPosition: p.focus }}
          aria-hidden
        />
      ) : (
        <WelearnArt accent={accent} />
      )}

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

      <div className="da-prog-help">
        <div>
          <p className="da-prog-eyebrow">Not sure which one fits?</p>
          <p className="da-prog-help-copy">
            Tell us the student&apos;s age and what they can already read, and the team will point you
            to the right class.
          </p>
        </div>
        <div className="da-prog-help-actions">
          <a href={ORG.phoneHref} className="da-btn da-btn-gold da-btn-sm">
            Call {ORG.phone}
          </a>
          <a href={EXT.whatsapp} target="_blank" rel="noopener noreferrer" className="da-btn da-btn-ghost da-btn-sm">
            Ask in the WhatsApp group <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
