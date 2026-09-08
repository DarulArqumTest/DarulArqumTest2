"use client";

/**
 * Contact & visit.
 *
 * Every other item in the navigation has a page behind it; this one used to
 * scroll to a strip at the foot of the front page. Reaching a masjid is not
 * a strip — it is the page someone opens when they have a question nobody
 * has answered, or a child to enrol, or an afternoon to give, or they have
 * never been inside a masjid and want to know what happens if they walk in.
 *
 * The front page's contact section still exists and still does its job: a
 * map, a number, an address, for someone already scrolling. This page is for
 * someone who came looking. It does the thing that section cannot afford the
 * room for — saying which way to reach us is the right one, which is the
 * question people actually get wrong. They email about a cancelled jamaat
 * and hear back on Tuesday.
 */

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { DaForm, type Section } from "@/components/site/da-form";
import { OpenDoor } from "@/components/site/open-door";
import { Glyph } from "@/components/site/program-glyphs";
import { CrescentMoon, Twinkle } from "@/components/sections/home-literal";
import { EXT, LOCATION_LIST, ORG, R } from "@/lib/links";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── which way to reach us ────────────────────────────────────────── */

/**
 * The routing, which is the part that saves people time.
 *
 * Each channel carries its own colour and says what it is *for*, because
 * the failure everybody has is picking the slow one for the urgent thing.
 */
const CHANNELS = [
  {
    key: "call",
    tint: "#e3c56a",
    label: "Call the office",
    value: ORG.phone,
    href: ORG.phoneHref,
    action: "Call now",
    when: "When it is about today",
    note: "A cancelled jamaat, a locked door, someone waiting outside. Voices are faster than inboxes.",
    copy: ORG.phone,
  },
  {
    key: "email",
    tint: "#a9e0c0",
    label: "Email the board",
    value: ORG.email,
    href: ORG.emailHref,
    action: "Write an email",
    when: "When it needs a record",
    note: "Registrations, tax receipts, invoices, anything you may need to point back to later.",
    copy: ORG.email,
  },
  {
    key: "whatsapp",
    tint: "#5ec97f",
    label: "The WhatsApp group",
    value: "Iqama alerts & announcements",
    href: EXT.whatsapp,
    action: "Join the group",
    when: "When you want to hear first",
    note: "Iqama changes, janazah announcements and events reach the group before anywhere else.",
    copy: null,
  },
] as const;

/** Drawn marks, one per channel, each in its own colour rather than the card's. */
function ChannelMark({ kind, tint }: { kind: string; tint: string }) {
  if (kind === "call") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden focusable="false">
        {/* a handset, and the sound leaving it */}
        <path
          d="M12 8c-3 0-5 2-5 5 0 11 9 20 20 20 3 0 5-2 5-5v-3l-7-2-3 4a20 20 0 0 1-9-9l4-3-2-7Z"
          fill="none"
          stroke={tint}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <g stroke={tint} strokeOpacity="0.55" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M26 6a10 10 0 0 1 8 8" />
          <path d="M25 12a5 5 0 0 1 3 3" />
        </g>
      </svg>
    );
  }
  if (kind === "email") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden focusable="false">
        <rect x="5" y="10" width="30" height="21" rx="2.5" fill="none" stroke={tint} strokeWidth="2" />
        <path d="M5 13l15 11 15-11" fill="none" stroke={tint} strokeWidth="2" strokeLinejoin="round" />
        {/* the letter inside, written */}
        <g stroke={tint} strokeOpacity="0.4" strokeWidth="1.4" strokeLinecap="round">
          <path d="M12 20h7M12 24h5" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" aria-hidden focusable="false">
      {/* a message going out, and the reply coming back */}
      <path
        d="M6 32l2.4-6.6A13 13 0 1 1 14 31Z"
        fill="none"
        stroke={tint}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g stroke={tint} strokeOpacity="0.6" strokeWidth="1.7" strokeLinecap="round">
        <path d="M14 18h12M14 23h7" />
      </g>
    </svg>
  );
}

function CopyValue({ value, tint }: { value: string; tint: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      className="da-ct-copy"
      style={{ ["--tint" as string]: tint }}
      onClick={() => {
        navigator.clipboard
          .writeText(value)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          })
          .catch(() => {
            /* clipboard refused — the value is on screen to read anyway */
          });
      }}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

/* ── what volunteering actually involves ──────────────────────────── */

/**
 * The six areas, lifted from the volunteer form's own list so the two pages
 * cannot drift. This page describes; /community is where you sign up. Two
 * forms asking the same questions is how you end up with two half-lists.
 */
const HELP = [
  { glyph: "calendar", tint: "#e3c56a", title: "Events", note: "Setting up, running the day, packing down after." },
  { glyph: "minbar", tint: "#a9e0c0", title: "Maintenance", note: "Repairs, grounds, snow, the hundred small jobs." },
  { glyph: "student", tint: "#8fb8e8", title: "Madrasa help", note: "Assisting teachers in the weekend and weekday classes." },
  { glyph: "camera", tint: "#d9a1e0", title: "IT & media", note: "Photography, the screens, the website, live streams." },
  { glyph: "tuition", tint: "#f0b27a", title: "Fundraising", note: "Campaigns, calls, and the dinners that carry the loan." },
  { glyph: "congregation", tint: "#7fd4c1", title: "Kitchen", note: "Iftar, community lunches, hospitality for guests." },
] as const;

/* ── the message form ─────────────────────────────────────────────── */

const FORM_SECTIONS: Section[] = [
  {
    kind: "parents",
    title: "Who you are",
    glyph: "parents",
    lede: "So the board knows who they are replying to.",
    fields: [
      { name: "Full name", label: "Your name", required: true },
      { name: "email", label: "Email", type: "email", required: true, half: true, placeholder: "you@example.com" },
      { name: "phone", label: "Phone (optional)", type: "tel", half: true, placeholder: "(613) 555-0123" },
    ],
  },
  {
    kind: "background",
    title: "Your message",
    glyph: "letters",
    lede: "Pick the closest subject and it reaches the right person sooner.",
    fields: [
      {
        name: "Subject",
        label: "What is it about",
        type: "select",
        required: true,
        options: [
          "General question",
          "Prayer times / Jumu'ah",
          "Programs & registration",
          "Donations & tax receipts",
          "Volunteering",
          "Facilities / parking",
          "Visiting for the first time",
          "Other",
        ],
      },
      { name: "Message", label: "Message", type: "textarea", required: true, rows: 6, placeholder: "Tell us what you need." },
    ],
  },
];

/* ── the page ─────────────────────────────────────────────────────── */

export function ContactPage() {
  const reduce = useReducedMotion();
  const rise = (d: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 22 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay: d, ease: EASE },
  });

  return (
    <div className="da-ct">
      {/* the same drifting light every rebuilt page carries */}
      <div className="da-drift-gold da-ct-orb da-ct-orb-a" aria-hidden />
      <div className="da-drift-green da-ct-orb da-ct-orb-b" aria-hidden />
      <div className="da-ct-moon" aria-hidden>
        <CrescentMoon size={54} glowSize={0} glowOpacity={0} />
      </div>
      <Twinkle top="120px" left="18%" duration={2.8} />
      <Twinkle top="210px" left="86%" duration={3.2} delay={0.6} />

      {/* ── hero ── */}
      <section className="da-ct-hero">
        <div className="da-ct-hero-inner">
          <div className="da-ct-hero-words">
            <Breadcrumbs items={[{ label: "Contact" }]} className="mb-5" />
            <p className="da-ct-eyebrow">Contact &amp; visit</p>
            <h1 className="da-ct-h1">
              The door is <em>open.</em>
            </h1>
            <p className="da-ct-lede">
              Questions about prayers, programmes, giving, or simply coming to see the place. The
              board reads every message, and nobody needs an invitation to walk in.
            </p>
            <div className="da-ct-hero-actions">
              <a href={ORG.phoneHref} className="da-solid-btn">
                Call {ORG.phone} <span aria-hidden="true">→</span>
              </a>
              <a href="#send-a-message" className="da-solid-btn da-solid-btn-quiet">
                Send a message
              </a>
            </div>
          </div>
          <motion.div
            className="da-ct-hero-art"
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          >
            <OpenDoor />
          </motion.div>
        </div>
      </section>

      {/* ── which way to reach us ── */}
      <section className="da-ct-band">
        <motion.div {...rise(0)}>
          <p className="da-ct-eyebrow">Three ways in</p>
          <h2 className="da-ct-h2">Which one you want depends on the hurry.</h2>
          <p className="da-ct-band-lede">
            The most common mistake is emailing about something happening in an hour. Here is what
            each one is good for.
          </p>
        </motion.div>

        <div className="da-ct-channels">
          {CHANNELS.map((c, i) => (
            <motion.div key={c.key} {...rise(0.06 * (i + 1))} className="da-ct-channel" style={{ ["--tint" as string]: c.tint }}>
              <span className="da-ct-channel-mark" aria-hidden>
                <ChannelMark kind={c.key} tint={c.tint} />
              </span>
              <p className="da-ct-when">{c.when}</p>
              <h3 className="da-ct-channel-title">{c.label}</h3>
              <p className="da-ct-channel-value">{c.value}</p>
              <p className="da-ct-channel-note">{c.note}</p>
              <div className="da-ct-channel-actions">
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="da-ct-go"
                  style={{ ["--tint" as string]: c.tint }}
                >
                  {c.action} <span aria-hidden="true">{c.href.startsWith("http") ? "↗" : "→"}</span>
                </a>
                {c.copy && <CopyValue value={c.copy} tint={c.tint} />}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── the form ── */}
      <section className="da-ct-band" id="send-a-message">
        <motion.div {...rise(0)}>
          <p className="da-ct-eyebrow">Send a message</p>
          <h2 className="da-ct-h2">Write to the board.</h2>
          <p className="da-ct-band-lede">
            It reaches {ORG.email} and is kept on file either way, so nothing is lost to a bounced
            inbox. Expect a reply within a few days.
          </p>
        </motion.div>
        <div className="da-ct-form">
          <DaForm
            formName="contact"
            subject="Website contact"
            sections={FORM_SECTIONS}
            submitLabel="Send message"
            emailField="email"
            phoneField="phone"
            doneTitle="Message sent"
            doneScene="envelope"
            note="Please do not send payment details or anything confidential through this form."
          />
        </div>
      </section>

      {/* ── volunteering ── */}
      <section className="da-ct-band">
        <motion.div {...rise(0)}>
          <p className="da-ct-eyebrow">Lend a hand</p>
          <h2 className="da-ct-h2">
            The masjid runs on people who <em>turned up.</em>
          </h2>
          <p className="da-ct-band-lede">
            Nobody here is paid to set out chairs. If you have an afternoon a month, there is
            something on this list with your name on it.
          </p>
        </motion.div>

        <div className="da-ct-help">
          {HELP.map((h, i) => (
            <motion.div key={h.title} {...rise(0.05 * (i + 1))} className="da-ct-help-card" style={{ ["--tint" as string]: h.tint }}>
              <span className="da-ct-help-mark" aria-hidden style={{ color: h.tint }}>
                <Glyph name={h.glyph} size={20} />
              </span>
              <div>
                <b>{h.title}</b>
                <small>{h.note}</small>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...rise(0.2)} className="da-ct-help-cta">
          <Link href={R.community} className="da-solid-btn">
            Sign up to volunteer <span aria-hidden="true">→</span>
          </Link>
          <p>
            The form asks when you are free and what you would rather do. It takes a minute.
          </p>
        </motion.div>
      </section>

      {/* ── both masjids ── */}
      <section className="da-ct-band">
        <motion.div {...rise(0)}>
          <p className="da-ct-eyebrow">Come and see</p>
          <h2 className="da-ct-h2">Two masjids, both open.</h2>
        </motion.div>

        <div className="da-ct-places">
          {LOCATION_LIST.map((loc, i) => (
            <motion.div key={loc.key} {...rise(0.08 * (i + 1))} className="da-ct-place" style={{ ["--tint" as string]: loc.accent }}>
              <p className="da-ct-place-status">
                <span className="da-ct-dot" aria-hidden />
                {loc.statusLabel}
              </p>
              <h3 className="da-ct-place-name">{loc.name}</h3>
              <p className="da-ct-place-addr">{loc.address}</p>
              <p className="da-ct-place-blurb">{loc.blurb}</p>
              <div className="da-ct-channel-actions">
                <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="da-ct-go" style={{ ["--tint" as string]: loc.accent }}>
                  Get directions <span aria-hidden="true">↗</span>
                </a>
                <Link href={R.locations} className="da-ct-copy" style={{ ["--tint" as string]: loc.accent }}>
                  More about this masjid
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* the things people find out the hard way */}
        <motion.div {...rise(0.2)} className="da-ct-notes">
          <h3>Before you come</h3>
          <ul>
            <li>
              <b>Everyone is welcome</b>, Muslim or not. If it is your first time, come a few
              minutes early and someone will show you where to go.
            </li>
            <li>
              <b>Parking</b> is on the premises. Overnight parking needs authorisation from the
              board first.
            </li>
            <li>
              <b>Security cameras</b> are in use on both properties.
            </li>
            <li>
              <b>Prayer times change through the year.</b>{" "}
              <Link href={R.prayer}>The board shows today&apos;s</Link>, straight from the screen
              inside the masjid.
            </li>
          </ul>
        </motion.div>
      </section>

      {/* ── who you are writing to ── */}
      <section className="da-ct-band da-ct-band-last">
        <motion.div {...rise(0)}>
          <p className="da-ct-eyebrow">The board</p>
          <h2 className="da-ct-h2">The people who read it.</h2>
          <p className="da-ct-band-lede">
            Darul Arqum is run by volunteers from the community. {ORG.tagline}. CRA registered
            charity {ORG.charityReg}.
          </p>
        </motion.div>
        <div className="da-ct-board">
          {ORG.board.map((m, i) => (
            <motion.div key={m.name} {...rise(0.05 * (i + 1))} className="da-ct-board-card">
              <span className="da-ct-board-mark" aria-hidden>
                <Glyph name="star8" size={16} />
              </span>
              <b>{m.name}</b>
              <small>{m.role}</small>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
