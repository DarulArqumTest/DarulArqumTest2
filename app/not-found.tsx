import type { Metadata } from "next";
import Link from "next/link";
import { LOCATION_LIST, R } from "@/lib/links";
import { LostLantern } from "@/components/site/lost-lantern";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404. Rebuilt in the 2026 palette so a mistyped address does not drop the
 * visitor onto a page that looks like a different website.
 *
 * The links below are the four things people actually arrive looking for,
 * plus both masjid addresses, so the page is a way onward rather than a
 * dead end.
 */
export default function NotFound() {
  const links = [
    { href: R.prayer, label: "Prayer times", note: "Daily iqama and Jumu'ah" },
    { href: R.locations, label: "Locations", note: "Both masjids and directions" },
    { href: R.programs, label: "Programs", note: "Madrasa, Hifz and weekend classes" },
    { href: R.give, label: "Give", note: "Donate or set up a monthly pledge" },
  ];

  return (
    <main className="da-404">
      <div className="da-404-inner">
        <div className="da-404-top">
          <LostLantern />
          <div>
            <p className="da-404-code">Error 404</p>
            <h1 className="da-404-title">This lantern has gone out.</h1>
            <p className="da-404-lede">
              There is no page at that address — it may have moved, or the link that
              brought you here may be out of date. One ember is still going, and these
              are the four doors most people are looking for.
            </p>
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
          <Link href={R.home} className="da-btn da-btn-gold">
            Back to the home page
          </Link>
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
