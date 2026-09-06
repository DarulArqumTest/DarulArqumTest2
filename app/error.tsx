"use client";

import * as React from "react";
import Link from "next/link";
import { LOCATION_LIST, ORG, R } from "@/lib/links";
import { FallenLantern } from "@/components/site/fallen-lantern";

/**
 * The 500. Next's own error boundary, which without this file is a bare
 * white page with black system type on it — the one screen on the whole
 * site that would look like it belonged to nobody.
 *
 * The 404 says the page is not there. This one says the page is there and
 * something broke reaching it, so the lantern is down but still lit and the
 * first thing offered is trying again. The phone number is on it because a
 * broken page is exactly when someone gives up on the website and wants a
 * person.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const links = [
    { href: R.prayer, label: "Prayer times", note: "Daily iqama and Jumu'ah" },
    { href: R.programs, label: "Programs", note: "Madrasa, Hifz and weekend classes" },
    { href: R.give, label: "Give", note: "Donate or set up a monthly pledge" },
    { href: R.contact, label: "Contact", note: "Reach the team directly" },
  ];

  return (
    <main className="da-404">
      <div className="da-404-inner">
        <div className="da-404-top">
          <FallenLantern />
          <div>
            <p className="da-404-code">Error 500</p>
            <h1 className="da-404-title">This lantern has come down.</h1>
            <p className="da-404-lede">
              Something went wrong on our side loading that page — it is not anything you
              did. The flame is still going: try it again, and if it keeps happening,
              call the office on <a href={ORG.phoneHref}>{ORG.phone}</a> and someone will
              help.
            </p>
            <div className="da-500-actions">
              <button type="button" onClick={reset} className="da-solid-btn">
                Try that again <span aria-hidden="true">→</span>
              </button>
              <Link href={R.home} className="da-solid-btn da-solid-btn-quiet">
                Back to the home page
              </Link>
            </div>
          </div>
        </div>

        <nav className="da-404-grid" aria-label="Popular pages">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="da-404-card">
              <span className="da-404-card-label">{l.label}</span>
              <span className="da-404-card-note">{l.note}</span>
              <span className="da-404-card-go" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </nav>

        <div className="da-404-foot">
          <span className="da-404-addr">
            {LOCATION_LIST.map((loc) => (
              <span key={loc.key}>
                <strong>{loc.name}</strong> {loc.street}
              </span>
            ))}
          </span>
        </div>
      </div>
    </main>
  );
}
