import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ORG, R } from "@/lib/links";
import { checkUnsubscribeToken, normalizeEmail, removeSubscriber } from "@/lib/subscribers";
import { ClosedEnvelope } from "@/components/site/closed-envelope";

/**
 * Leaving the mailing list.
 *
 * Reached from the footer of every newsletter email. It confirms rather than
 * acting on load: the link in a message gets fetched by spam filters, link
 * scanners and mail previews long before a person clicks it, and a page that
 * unsubscribed on GET would empty the list by itself.
 *
 * So the work happens in a form POST, which nothing fetches on your behalf.
 * One button, no survey, no "are you sure" — someone who arrived here has
 * decided, and making it awkward is both rude and, under Canadian anti-spam
 * law, the thing you are specifically not allowed to do.
 */

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Stop receiving newsletter emails from Darul Arqum.",
  robots: { index: false, follow: false },
};

async function unsubscribe(formData: FormData) {
  "use server";
  const email = String(formData.get("e") ?? "");
  const token = String(formData.get("t") ?? "");
  if (email && checkUnsubscribeToken(email, token)) {
    await removeSubscriber(email);
  }
  /**
   * The done screen either way. Whether a given address was on the list is
   * not something this page should confirm to whoever is holding the link —
   * "that address was not subscribed" is an answer worth not giving out.
   *
   * redirect() throws internally, so it has to be the last thing here and
   * must not sit inside a try/catch.
   */
  redirect(`/unsubscribe?done=1&e=${encodeURIComponent(email)}`);
}

export default async function UnsubscribeRoute({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; t?: string; done?: string }>;
}) {
  const sp = await searchParams;
  const email = normalizeEmail(sp.e ?? "");
  const token = sp.t ?? "";
  const valid = Boolean(email) && checkUnsubscribeToken(email, token);
  const done = sp.done === "1";

  return (
    <main className="da-404">
      <div className="da-404-inner">
        <div className="da-404-top">
          <ClosedEnvelope sealed={done} />
          <div>
            <p className="da-404-code">Mailing list</p>

            {done ? (
              <>
                <h1 className="da-404-title">You&rsquo;re off the list.</h1>
                <p className="da-404-lede">
                  We won&rsquo;t email <strong>{email}</strong> about the newsletter again. The
                  newsletter itself stays on the site, so you can read it any time without
                  being on a list at all.
                </p>
                <div className="da-500-actions">
                  <Link href={R.newsletters} className="da-solid-btn">
                    Read the newsletter <span aria-hidden="true">→</span>
                  </Link>
                  <Link href={R.home} className="da-solid-btn da-solid-btn-quiet">
                    Back to the home page
                  </Link>
                </div>
              </>
            ) : valid ? (
              <>
                <h1 className="da-404-title">Stop the newsletter emails?</h1>
                <p className="da-404-lede">
                  This will remove <strong>{email}</strong> from the newsletter list. It takes
                  effect immediately, and it won&rsquo;t affect anything else — registrations,
                  replies from the office, or anyone else in your household.
                </p>
                <form action={unsubscribe} className="da-500-actions">
                  <input type="hidden" name="e" value={email} />
                  <input type="hidden" name="t" value={token} />
                  <button type="submit" className="da-solid-btn">
                    Unsubscribe <span aria-hidden="true">→</span>
                  </button>
                  <Link href={R.home} className="da-solid-btn da-solid-btn-quiet">
                    Keep me on the list
                  </Link>
                </form>
              </>
            ) : (
              <>
                <h1 className="da-404-title">This link has expired.</h1>
                <p className="da-404-lede">
                  We couldn&rsquo;t read that unsubscribe link — it may have been broken across
                  two lines by your email app. Email{" "}
                  <a href={ORG.emailHref}>{ORG.email}</a> or call{" "}
                  <a href={ORG.phoneHref}>{ORG.phone}</a> and we&rsquo;ll take you off the list
                  ourselves.
                </p>
                <div className="da-500-actions">
                  <Link href={R.home} className="da-solid-btn da-solid-btn-quiet">
                    Back to the home page
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="da-404-foot">
          <span className="da-404-addr">
            <span>
              <strong>{ORG.name}</strong> {ORG.address}
            </span>
            <span>Registered charity {ORG.charityReg}</span>
          </span>
        </div>
      </div>
    </main>
  );
}
