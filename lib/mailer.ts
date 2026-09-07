import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Sending mail, through the masjid's own Google Workspace.
 *
 * The site used to point at Resend, which was never set up. Workspace is
 * already paying for itself and already owns the domain's reputation, so
 * mail from the website goes out the same way mail from a person does.
 *
 * SETUP, in the order it has to happen:
 *
 *   1. Pick the mailbox that sends. Something like admin@darularqum.org.
 *   2. Turn on 2-Step Verification for that account. Google will not issue
 *      an app password without it.
 *   3. Create an app password at myaccount.google.com/apppasswords, named
 *      something recognisable like "Website forms".
 *   4. Put these in Vercel:
 *
 *        SMTP_USER   the full address, e.g. admin@darularqum.org
 *        SMTP_PASS   the 16-character app password, spaces removed
 *        SMTP_FROM   optional; defaults to SMTP_USER
 *
 * Workspace allows roughly 2,000 messages a day from a mailbox, which is
 * several hundred times what this site will ever send.
 *
 * Gmail will only let you send *as* an address the account owns. Using a
 * different SMTP_FROM than SMTP_USER needs that alias configured in Gmail
 * first, or Google silently rewrites the sender.
 */

const HOST = "smtp.gmail.com";
/** 465 with TLS from the start; 587 upgrades mid-conversation and some
 *  serverless egress paths are unhappy with that */
const PORT = 465;

export const MAIL_CONFIGURED = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

let cached: Transporter | null = null;

function transporter() {
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      // app passwords are shown with spaces for readability and Google
      // does not want them; strip rather than make anyone remember
      pass: (process.env.SMTP_PASS ?? "").replace(/\s+/g, ""),
    },
  });
  return cached;
}

export async function sendMail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!MAIL_CONFIGURED) return { sent: false, error: "not configured" };
  try {
    await transporter().sendMail({
      from: `Darul Arqum Website <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      // so hitting reply in the inbox answers the person who filled the form
      replyTo: replyTo || undefined,
    });
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
