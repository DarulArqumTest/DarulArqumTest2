import "server-only";

/**
 * Telling the list that a new edition is up.
 *
 * The newsletter itself lives on the site — this only ever says "there is a
 * new one, here it is" and links to it. That is deliberate: the page is the
 * newsletter, the email is the knock on the door.
 *
 * ── Why one message per person, and not one BCC ──────────────────────────
 *
 * Every message carries an unsubscribe link that belongs to that address, so
 * they cannot be batched into a single BCC. That costs one SMTP round trip
 * per subscriber, which for a masjid mailing list is nothing, and buys a
 * one-click unsubscribe that works without asking anyone to type their own
 * address into a form to prove who they are.
 *
 * ── The law ──────────────────────────────────────────────────────────────
 *
 * Canada's anti-spam legislation applies to this and the penalties are not
 * small. Three things it requires, all of them below and none of them
 * optional:
 *
 *   1. Consent. Everyone here typed their address into the signup form
 *      themselves, which is express consent.
 *   2. Identification. The masjid's name and postal address are in the
 *      footer of every message.
 *   3. Unsubscribe. A working mechanism, honoured promptly. The link is in
 *      the footer and in a List-Unsubscribe header, and it takes effect the
 *      moment it is clicked.
 *
 * Removing any of those turns a newsletter into a liability for a registered
 * charity, so treat them as part of the send rather than decoration.
 */

import { ORG, SITE_URL } from "@/lib/links";
import { sendMail, MAIL_CONFIGURED } from "@/lib/mailer";
import { listSubscribers, unsubscribeUrl } from "@/lib/subscribers";

export type SendReport = {
  attempted: number;
  sent: number;
  failed: number;
  /** addresses that did not go, so they can be chased rather than guessed at */
  failures: string[];
  error?: string;
};

/** Workspace will take far more than this a day; the cap is against mistakes */
const MAX_RECIPIENTS = 1500;
/** a few at a time — polite to the SMTP server, and fast enough */
const CONCURRENCY = 4;

function body(opts: { title: string; blurb: string; link: string; unsubscribe: string }) {
  const { title, blurb, link, unsubscribe } = opts;
  return [
    `Assalamu alaikum,`,
    ``,
    `There's something new in the ${ORG.name} newsletter:`,
    ``,
    title,
    ...(blurb ? [``, blurb] : []),
    ``,
    `Read it here:`,
    link,
    ``,
    `—`,
    `${ORG.name} — ${ORG.tagline}`,
    ORG.address,
    `Registered charity ${ORG.charityReg}`,
    ``,
    `You're getting this because you signed up for the newsletter at ${SITE_URL.replace(/^https?:\/\//, "")}.`,
    `To stop receiving these, unsubscribe here:`,
    unsubscribe,
  ].join("\n");
}

export async function sendNewsletterAnnouncement(opts: {
  /** the edition's headline, as it will read in the email */
  title: string;
  /** one or two sentences; may be empty */
  blurb: string;
  /** absolute or site-relative link to the edition */
  link: string;
  /** when true, nothing is sent — used to check the count and the wording */
  dryRun?: boolean;
}): Promise<SendReport> {
  const empty: SendReport = { attempted: 0, sent: 0, failed: 0, failures: [] };

  if (!MAIL_CONFIGURED) return { ...empty, error: "Mail is not configured on this deployment." };

  const title = opts.title.trim();
  if (!title) return { ...empty, error: "Give the edition a title first." };

  const link = opts.link.startsWith("http")
    ? opts.link
    : `${SITE_URL.replace(/\/$/, "")}/${opts.link.replace(/^\//, "")}`;

  const people = await listSubscribers();
  if (people.length === 0) return { ...empty, error: "Nobody is on the list yet." };
  if (people.length > MAX_RECIPIENTS)
    return { ...empty, error: `${people.length} subscribers is more than this is set up to send at once.` };

  if (opts.dryRun) return { attempted: people.length, sent: 0, failed: 0, failures: [] };

  const subject = `${ORG.name} — ${title}`;
  const failures: string[] = [];
  let sent = 0;

  const queue = [...people];
  async function worker() {
    for (;;) {
      const person = queue.shift();
      if (!person) return;
      const unsub = unsubscribeUrl(SITE_URL, person.email);
      const res = await sendMail({
        to: person.email,
        subject,
        text: body({ title, blurb: opts.blurb.trim(), link, unsubscribe: unsub }),
        // so a reply reaches the masjid rather than vanishing
        replyTo: ORG.email,
        headers: {
          // lets Gmail and Outlook show their own one-click unsubscribe
          "List-Unsubscribe": `<${unsub}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      if (res.sent) sent++;
      else failures.push(person.email);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, people.length) }, worker));

  return { attempted: people.length, sent, failed: failures.length, failures };
}
