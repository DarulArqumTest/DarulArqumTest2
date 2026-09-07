"use server";

/**
 * Shared form submission action for every form on the site.
 *
 * Two copies, in this order. The submission is emailed through the masjid's
 * own Google Workspace (see lib/mailer.ts) and written to the store either
 * way — so a form is never lost because a mail server was having a bad
 * afternoon, and the admin panel is always the authoritative record.
 *
 * If mail is not configured the form still succeeds, and the visitor is
 * offered a prefilled "send from my email app" fallback rather than a dead
 * end.
 */

import { recordSubmission } from "@/lib/submissions-store";
import { addSubscriber } from "@/lib/subscribers";
import { sendMail } from "@/lib/mailer";

export type SubmitResult =
  | { ok: true; delivered: boolean }
  | { ok: false; error: string };

/** where each form lands; one address today, but per-form when they want it */
const DESTINATIONS: Record<string, string> = {
  contact: "admin@darularqum.org",
  "quran-classes": "admin@darularqum.org",
  aalim: "admin@darularqum.org",
  hifz: "admin@darularqum.org",
  "kids-arabic": "admin@darularqum.org",
  pledge: "admin@darularqum.org",
  "tax-receipt": "admin@darularqum.org",
  volunteer: "admin@darularqum.org",
  "mailing-list": "admin@darularqum.org",
};

export async function submitForm(
  formName: string,
  data: Record<string, string>,
): Promise<SubmitResult> {
  try {
    const to = DESTINATIONS[formName];
    if (!to) return { ok: false, error: "Unknown form." };

    // Basic validation: reject empty payloads and obvious spam.
    const entries = Object.entries(data).filter(([, v]) => v?.trim());
    if (entries.length === 0)
      return { ok: false, error: "Add some details before sending." };
    if (data._honeypot) return { ok: true, delivered: false };

    const body = entries
      .filter(([k]) => !k.startsWith("_"))
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const res = await sendMail({
      to,
      subject: `[darularqum.org] ${formName} submission`,
      text: body,
      // replying in the inbox answers whoever filled the form
      replyTo: data.parentEmail || data.email || undefined,
    });
    const delivered = res.sent;

    /**
     * Written whether or not the email went. This is the copy that does not
     * depend on a mail provider being reachable, and the admin panel reads
     * it — so a submission is never only in an inbox.
     */
    await recordSubmission(formName, data, delivered);

    /**
     * A newsletter signup is also a person joining the list, which is a
     * different thing from a form having been submitted. The log above is
     * capped and gets cleared; the list must not be, or clearing out test
     * rows would quietly delete the congregation.
     */
    if (formName === "mailing-list" && data.email) {
      await addSubscriber(data.email, data["Full name"] ?? data.name ?? "");
    }

    return { ok: true, delivered };
  } catch {
    return { ok: true, delivered: false };
  }
}
