"use client";

/**
 * One programme's own page.
 *
 * These used to be the site's oldest layout — a cream background that looked
 * like a different website, with a full registration form sitting in the
 * right-hand column. Reading about a class and signing up for it are two
 * different intents, and putting the form on the page meant a parent who was
 * still deciding had to scroll past twenty inputs to find the schedule.
 *
 * So this page only explains: what it is, when it runs, what it costs, and
 * what is actually studied. Registering is a button that goes to the form.
 */

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { GeoMedallion } from "@/components/sections/home-literal";
import { otherPrograms, type Program } from "@/lib/programs";
import { EXT, ORG, R } from "@/lib/links";

const EASE = [0.22, 1, 0.36, 1] as const;

function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function JoinButtons({ p, size = "" }: { p: Program; size?: string }) {
  const cls = `da-btn da-btn-gold ${size}`.trim();
  if (p.registerHref) {
    return (
      <Link href={p.registerHref} className={cls}>
        Register here <span aria-hidden="true">→</span>
      </Link>
    );
  }
  return (
    <a href={p.joinUrl} target="_blank" rel="noopener noreferrer" className={cls}>
      {p.joinLabel ?? "Join"} <span aria-hidden="true">↗</span>
    </a>
  );
}

export function ProgramDetailPage({ program: p }: { program: Program }) {
  const others = otherPrograms(p.slug);

  return (
    <div className="da-pd" style={{ "--accent": p.accent } as React.CSSProperties}>
      {/* ── masthead ── */}
      <header className="da-pd-head">
        {p.photo && (
          <div
            className="da-pd-photo"
            style={{ backgroundImage: `url('${p.photo}')`, backgroundPosition: p.focus }}
            aria-hidden
          />
        )}
        <div className="da-pd-head-inner">
          <Breadcrumbs items={[{ label: "Programs", href: R.programs }, { label: p.name }]} className="mb-6" />
          <p className="da-pd-eyebrow">{p.eyebrow}</p>
          <h1 className="da-pd-title">{p.name}</h1>
          <p className="da-pd-lede">{p.lede}</p>
          <div className="da-pd-head-actions">
            <JoinButtons p={p} size="da-btn-lg" />
            <a href={ORG.phoneHref} className="da-btn da-btn-ghost da-btn-lg">
              Ask a question
            </a>
          </div>
        </div>
      </header>

      <div className="da-pd-body">
        {/* ── the facts, and the paragraph ── */}
        <div className="da-pd-split">
          <Rise>
            <h2 className="da-pd-h2">About the programme</h2>
            <p className="da-pd-copy">{p.about}</p>
            {p.notes && p.notes.length > 0 && (
              <ul className="da-pd-notes">
                {p.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </Rise>

          <Rise delay={0.08}>
            <dl className="da-pd-facts">
              {p.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd className="da-wrap-any">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Rise>
        </div>

        {/* ── what is studied ── */}
        {p.curriculum && p.curriculum.length > 0 && (
          <Rise delay={0.05} className="da-pd-section">
            <h2 className="da-pd-h2">What is studied</h2>
            <ol className="da-pd-curriculum">
              {p.curriculum.map((c, i) => (
                <li key={c.title}>
                  <span className="da-pd-num" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="da-pd-cur-body">
                    <strong>{c.title}</strong>
                    <span>{c.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Rise>
        )}

        {/* ── the ask ── */}
        <Rise delay={0.05}>
          <div className="da-pd-cta">
            <div className="da-pd-cta-medallion" aria-hidden>
              <GeoMedallion size={220} opacity={1} />
            </div>
            <div className="da-pd-cta-text">
              <p className="da-pd-eyebrow">Ready to join?</p>
              <h2 className="da-pd-cta-title">
                {p.registerHref ? "Registration takes a couple of minutes." : "The class is open — come in."}
              </h2>
              <p className="da-pd-copy">
                {p.registerHref
                  ? "The team confirms placement, timings and fees after you submit. Nothing is charged through the form."
                  : "Nothing to install beyond Zoom, and nothing to sign up for. Join the WhatsApp group to hear about schedule changes."}
              </p>
            </div>
            <div className="da-pd-cta-actions">
              <JoinButtons p={p} />
              <a href={EXT.whatsapp} target="_blank" rel="noopener noreferrer" className="da-btn da-btn-ghost da-btn-sm">
                WhatsApp group <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </Rise>

        {/* ── the rest of the programmes ── */}
        <Rise delay={0.05} className="da-pd-section">
          <div className="da-pd-others-head">
            <h2 className="da-pd-h2">Other programmes</h2>
            <Link href={R.programs} className="da-pd-all">
              All programmes <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="da-pd-others">
            {others.map((o) => (
              <Link key={o.slug} href={o.href} className="da-pd-other" style={{ "--accent": o.accent } as React.CSSProperties}>
                <span className="da-pd-other-name">{o.name}</span>
                <span className="da-pd-other-note">{o.cardFacts[0]?.value}</span>
                <span className="da-pd-other-go" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Rise>
      </div>
    </div>
  );
}
