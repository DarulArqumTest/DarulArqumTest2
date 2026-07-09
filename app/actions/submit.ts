"use server";

/**
 * Shared form submission action for every form on the site.
 *
 * Delivery: if RESEND_API_KEY is set, submissions are emailed to the
 * destination address via Resend's REST API. Without the key (e.g. local
 * preview), the action still validates and succeeds gracefully, and the
 * client offers a prefilled "send via your email app" fallback — so the
 * form is never dead UI.
 *
 * ADMIN-ACCESS FOLLOW-UP: set RESEND_API_KEY (and verify the sending
 * domain) in the hosting environment to activate direct email delivery.
 */

export type SubmitResult =
  | { ok: true; delivered: boolean }
  | { ok: false; error: string };

const DESTINATIONS: Record<string, string> = {
  contact: "admin@darularqum.org",
  "quran-classes": "admin@darularqum.org",
  aalim: "admin@darularqum.org",
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

    const key = process.env.RESEND_API_KEY;
    if (!key) return { ok: true, delivered: false };

    const body = entries
      .filter(([k]) => !k.startsWith("_"))
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Darul Arqum Website <forms@darularqum.org>",
        to: [to],
        reply_to: data.email || undefined,
        subject: `[darularqum.org] ${formName} submission`,
        text: body,
      }),
    });
    return { ok: true, delivered: res.ok };
  } catch {
    return { ok: true, delivered: false };
  }
}
