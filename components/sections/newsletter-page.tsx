"use client";

/**
 * The newsletter, and the way onto it.
 *
 * This page used to undo the card that led to it. The homepage shows a
 * white envelope with its flap thrown open and a paper aeroplane leaving on
 * a dotted loop; clicking it arrived at a flat green outline envelope with a
 * wax seal, a form in a tinted box with a matching tinted border and a soft
 * blur behind it, two pill-shaped buttons, and an envelope glyph sitting in
 * a green chip in the same green as the glyph. Premium card, disappointing
 * room.
 *
 * Same envelope now, at the top, the size it deserves. Subscribing folds its
 * flap shut and sends the aeroplane out along the dotted path and off the
 * page, and the page says so in words underneath.
 *
 * The form is the site's form system, and the panels are the site's panels:
 * opaque surfaces, hard dark edges, accents as solid bars rather than washes.
 */

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Glyph } from "@/components/site/program-glyphs";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { DaForm, type Section } from "@/components/site/da-form";
import { NewsletterEnvelopeArt } from "@/components/site/newsletter-envelope-art";
import { R } from "@/lib/links";

const FORM_SECTIONS: Section[] = [
  {
    kind: "parents",
    title: "Where to send it",
    glyph: "envelope",
    fields: [
      { name: "Full name", label: "Full name", required: true, half: true },
      { name: "email", label: "Email", type: "email", required: true, half: true, placeholder: "you@example.com" },
    ],
  },
];

/** what actually turns up in the inbox, so the ask is not a blank cheque */
const CONTENTS = [
  { glyph: "announce" as const, label: "Announcements", note: "Closures, new locations, community notices" },
  { glyph: "calendar" as const, label: "What is coming up", note: "Programmes, events and registration windows" },
  { glyph: "tuition" as const, label: "Fundraising", note: "Where the masjid stands and what is still needed" },
];

export function NewsletterPage() {
  const [sent, setSent] = React.useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="da-nl">
      {/* ── the envelope, at the size it was drawn for ── */}
      <header className="da-nl-hero">
        {/* Shut, and nothing in the air. The letter has not been sent yet —
            an open envelope with a plane already leaving was the end of the
            story printed at the top of the page. */}
        <div className="da-nl-hero-art">
          <NewsletterEnvelopeArt fold={-1} flight={-1} />
        </div>
        <div className="da-nl-hero-text">
          <Breadcrumbs items={[{ label: "Newsletters" }]} className="mb-4" />
          <p className="da-nl-kicker">Stay connected</p>
          <h1 className="da-nl-h1">The Darul Arqum Newsletter</h1>
          <p className="da-nl-lede">
            Programmes, events and fundraising milestones, written by the team and sent when there is
            something worth sending. No more often than that.
          </p>
        </div>
      </header>

      <div className="da-nl-body">
        {/* ── what you are actually signing up for ── */}
        <ul className="da-nl-contents">
          {CONTENTS.map((c) => (
            <li key={c.label} className="da-nl-content">
              <span className="da-nl-content-mark" aria-hidden>
                <Glyph name={c.glyph} size={20} />
              </span>
              <span>
                <b>{c.label}</b>
                <span>{c.note}</span>
              </span>
            </li>
          ))}
        </ul>

        <DaForm
          formName="mailing-list"
          subject="Newsletter Subscription"
          submitLabel="Subscribe"
          emailField="email"
          phoneField={null}
          sections={FORM_SECTIONS}
          doneScene="envelope"
          note="One list, run by the masjid. Your address is not shared with anyone, and every issue has a way off it."
          onSuccess={() => setSent(true)}
          renderDone={({ delivered, mailto }) => (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              /* the aeroplane is mid-flight up in the hero; let it get away
                 before the words land underneath it */
              transition={{ duration: 0.6, delay: reduce ? 0 : 1.5 }}
              className="da-panel da-panel-flush da-nl-done"
              style={{ ["--tint" as string]: "#f2a79d" }}
            >
              <p className="da-panel-eyebrow">{delivered ? "On its way" : "Recorded"}</p>
              <h2 className="da-panel-title">Successfully subscribed</h2>
              <p className="da-panel-copy">
                {delivered
                  ? "You are on the list. The next issue comes to you the day it goes out."
                  : "Your details are saved. To be certain they reach the team today, send them from your own email app as well — everything is prefilled."}
              </p>
              {!delivered && (
                <a href={mailto} className="da-solid-btn" style={{ marginTop: 16 }}>
                  <Glyph name="envelope" size={17} /> Send from my email app
                </a>
              )}
            </motion.div>
          )}
        />

        {/* ── the archive ── */}
        <h2 className="da-nl-h2">Past editions</h2>
        <Link href={R.newsletterDec2020} className="da-panel da-panel-flush da-nl-past" style={{ ["--tint" as string]: "#e3c56a" }}>
          <span className="da-nl-past-mark" aria-hidden>
            <Glyph name="envelope" size={26} />
          </span>
          <span className="da-nl-past-text">
            <b>December 2020 — the first edition</b>
            <span>Rabi-at-thani 1442. Reminders, community stories and updates from the masjid.</span>
          </span>
          <span className="da-nl-past-go" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
