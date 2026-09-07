"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, checkPassword, createSession, isConfigured, readSession } from "@/lib/admin-auth";
import { readSettings, writeSettings, STORE_IS_PERSISTENT } from "@/lib/settings-store";
import { mergeSettings, type SiteSettings } from "@/lib/settings";
import {
  readSubmissions,
  trashSubmission,
  restoreSubmission,
  purgeSubmission,
  SUBMISSIONS_PERSISTENT,
  TRASH_DAYS,
  type Submission,
} from "@/lib/submissions-store";
import { countSubscribers, listSubscribers, type Subscriber } from "@/lib/subscribers";
import { sendNewsletterAnnouncement, type SendReport } from "@/lib/newsletter-send";
import { MAIL_CONFIGURED } from "@/lib/mailer";

/**
 * Everything the admin panel is allowed to do, and nothing else.
 *
 * Each action re-checks the session itself. A server action is a public
 * endpoint — anyone who knows its id can call it — so "the UI only shows
 * this to signed-in people" is not a check.
 */

async function signedIn() {
  return readSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function adminStatus() {
  return {
    signedIn: await signedIn(),
    configured: isConfigured(),
    persistent: STORE_IS_PERSISTENT,
  };
}

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) {
    return {
      ok: false,
      error: "No password is set for this site yet. Add ADMIN_PASSWORD and ADMIN_SECRET in Vercel.",
    };
  }
  // a small delay on every attempt, so the endpoint is not worth grinding at
  await new Promise((r) => setTimeout(r, 400));
  if (!checkPassword(password)) return { ok: false, error: "That password is not right." };

  const s = createSession();
  (await cookies()).set(s.name, s.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: s.maxAge,
  });
  return { ok: true };
}

export async function adminLogout() {
  (await cookies()).delete(ADMIN_COOKIE);
  return { ok: true };
}

export async function loadSettings(): Promise<SiteSettings> {
  return readSettings();
}

/**
 * Form submissions, for the panel.
 *
 * Gated on the session because these are people's names, emails, phone
 * numbers and, on the kids form, health details. A server action is a
 * public endpoint, so the check happens here and not in the component that
 * calls it.
 */
export async function loadSubmissions(): Promise<{
  ok: boolean;
  rows: Submission[];
  persistent: boolean;
  trashDays: number;
}> {
  if (!(await signedIn()))
    return { ok: false, rows: [], persistent: SUBMISSIONS_PERSISTENT, trashDays: TRASH_DAYS };
  return {
    ok: true,
    rows: await readSubmissions(150),
    persistent: SUBMISSIONS_PERSISTENT,
    trashDays: TRASH_DAYS,
  };
}

/**
 * Moving a submission in and out of the bin, and emptying it.
 *
 * All three re-check the session. These are somebody's registration — a
 * child's name, a parent's phone number, health notes on the kids' form —
 * and a server action is a public endpoint whatever the panel is showing.
 */
export async function trashSubmissionAction(id: string): Promise<{ ok: boolean }> {
  if (!(await signedIn())) return { ok: false };
  return { ok: await trashSubmission(id) };
}

export async function restoreSubmissionAction(id: string): Promise<{ ok: boolean }> {
  if (!(await signedIn())) return { ok: false };
  return { ok: await restoreSubmission(id) };
}

/** irreversible; only offered from inside the bin */
export async function purgeSubmissionAction(id: string): Promise<{ ok: boolean }> {
  if (!(await signedIn())) return { ok: false };
  return { ok: await purgeSubmission(id) };
}

/* ── the mailing list ─────────────────────────────────────────────── */

export async function loadSubscribers(): Promise<{
  ok: boolean;
  count: number;
  rows: Subscriber[];
  mailReady: boolean;
}> {
  if (!(await signedIn())) return { ok: false, count: 0, rows: [], mailReady: MAIL_CONFIGURED };
  return { ok: true, count: await countSubscribers(), rows: await listSubscribers(), mailReady: MAIL_CONFIGURED };
}

/**
 * Email the list that a new edition is up.
 *
 * The only action in this panel that reaches people outside the masjid, and
 * the only one that cannot be undone — a sent email cannot be recalled. So it
 * is deliberately two steps: the panel calls this with `dryRun` to find out
 * how many it would reach and to show the wording back, and only a second,
 * explicit press sends. `confirm` has to be the literal recipient count, so
 * an accidental double-submit cannot get through.
 */
export async function sendNewsletterEmail(input: {
  title: string;
  blurb: string;
  link: string;
  /** the recipient count as shown in the preview; omit for a dry run */
  confirm?: number;
}): Promise<SendReport> {
  const denied: SendReport = { attempted: 0, sent: 0, failed: 0, failures: [], error: "Not signed in." };
  if (!(await signedIn())) return denied;

  const dryRun = typeof input.confirm !== "number";
  if (!dryRun) {
    const actual = await countSubscribers();
    if (actual !== input.confirm) {
      return {
        attempted: 0,
        sent: 0,
        failed: 0,
        failures: [],
        error: `The list changed while you were reading it — it is now ${actual}, not ${input.confirm}. Check the preview again.`,
      };
    }
  }

  return sendNewsletterAnnouncement({
    title: input.title,
    blurb: input.blurb,
    link: input.link,
    dryRun,
  });
}

export async function saveSettings(next: SiteSettings): Promise<{ ok: boolean; persisted: boolean; error?: string }> {
  if (!(await signedIn())) return { ok: false, persisted: false, error: "Not signed in." };

  const clean = mergeSettings(next);
  const res = await writeSettings(clean);
  if (!res.ok) return { ok: false, persisted: false, error: "Could not save. Try again." };

  /**
   * The closure band is in the root layout, so it is on every page — not
   * just the handful that show money. Revalidating the layout covers the
   * whole tree in one go, which is what a site-wide notice needs: a closure
   * that only appeared on five pages would be worse than none.
   */
  revalidatePath("/", "layout");

  return { ok: true, persisted: res.persisted };
}
