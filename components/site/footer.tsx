"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { EXT, ORG, R } from "@/lib/links";
import { Reveal, DrawnRule } from "@/components/site/reveal";
import { DaAmbient } from "@/components/site/da-motifs";
import { Glyph } from "@/components/site/program-glyphs";
import { requestSectionScroll, type ScrollTargetId } from "@/components/site/use-scroll-highlight";

const COLUMNS = [
  {
    heading: "Worship",
    items: [
      { label: "Live prayer times", href: R.prayer },
      { label: "WhatsApp iqama alerts", href: EXT.whatsapp },
      { label: "Visit the masjid", href: `${R.home}#map-section`, sectionId: "map-section" as ScrollTargetId },
    ],
  },
  {
    heading: "Programs",
    items: [
      // these point at the programme pages now, not straight into a form —
      // most people want to read what a class is before signing up for it
      { label: "All programs", href: R.programs },
      { label: "Weekday Quran classes", href: R.quran },
      { label: "Aalim program", href: R.aalim },
      { label: "Quran Hifz", href: "/programs/hifz" },
      { label: "KidsLearnArabic", href: R.kidsArabic },
      { label: "welearn (online)", href: R.welearn },
    ],
  },
  {
    heading: "Give",
    items: [
      { label: "Donate", href: `${R.home}#giving-section`, sectionId: "giving-section" as ScrollTargetId },
      { label: "Monthly pledge (PAD)", href: R.pledge },
      { label: "Tax receipt", href: R.taxReceipt },
      { label: "PAD form", href: R.padForm },
    ],
  },
  {
    heading: "Community",
    items: [
      { label: "The story", href: R.story },
      { label: "Gallery", href: R.gallery },
      { label: "Volunteer & register", href: R.community },
      { label: "Newsletters", href: R.newsletters },
      { label: "YouTube", href: EXT.youtubeChannel },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-da-gold/20 bg-da-bg font-daBody text-da-cream">
      <DaAmbient />
      <div className="relative mx-auto max-w-wide px-5 py-16">
        <Reveal>
          <div className="da-foot-grid grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
            <div className="da-foot-brand">
              {/* The footer's own lockup. Where the navbar sets the emblem and
                  the name side by side inside a plate, this one stands the
                  emblem above the name on a struck rule with the locality
                  spread beneath it — the same identity, given room. */}
              <Link href={R.home} className="da-fbrand">
                <span className="da-fbrand-emblem">
                  <Image src="/assets/logo-icon.png" alt="Darul Arqum emblem" width={38} height={38} />
                </span>
                <span className="da-fbrand-rule" aria-hidden>
                  <i /><b><Glyph name="star8" size={9} /></b><i />
                </span>
                <span className="da-fbrand-name">Darul Arqum</span>
                <span className="da-fbrand-sub">Riverside South · Ottawa</span>
              </Link>
              <p className="da-foot-tagline mt-4 max-w-xs text-sm leading-relaxed text-da-cream/55">
                {ORG.tagline}. The first masjid in Riverside South. Let&apos;s build it together.
              </p>
              <ul className="da-foot-contact mt-6 space-y-2.5 text-sm text-da-cream/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-da-goldL" aria-hidden />
                  <a href={ORG.mapsUrl} className="hover:text-da-cream">{ORG.address}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-da-goldL" aria-hidden />
                  <a href={ORG.phoneHref} className="hover:text-da-cream">{ORG.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-da-goldL" aria-hidden />
                  <a href={ORG.emailHref} className="hover:text-da-cream">{ORG.email}</a>
                </li>
              </ul>
            </div>

            {COLUMNS.map((col) => (
              <nav key={col.heading} className="da-foot-col" aria-label={col.heading}>
                <p className="text-xs uppercase tracking-[0.2em] text-da-goldL">{col.heading}</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.items.map((item) => {
                    const sectionId = "sectionId" in item ? item.sectionId : undefined;
                    if (sectionId) {
                      return (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            className="u-draw text-da-cream/65 hover:text-da-cream"
                            onClick={(e) => {
                              if (window.location.pathname === "/") {
                                e.preventDefault();
                                requestSectionScroll(sectionId);
                              }
                            }}
                          >
                            {item.label}
                          </a>
                        </li>
                      );
                    }
                    return item.href.startsWith("/") ? (
                      <li key={item.label}>
                        <Link href={item.href} className="u-draw text-da-cream/65 hover:text-da-cream">
                          {item.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <a href={item.href} className="u-draw text-da-cream/65 hover:text-da-cream">
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </Reveal>

        <DrawnRule className="mt-14 bg-da-gold/15" />
        <div className="mt-7 flex flex-col gap-3 text-xs text-da-cream/45 md:flex-row md:items-center md:justify-between">
          <p>CRA approved charitable organization · Reg. #{ORG.charityReg}</p>
          <p>
            E-transfer: {ORG.email}
          </p>
        </div>
        <p className="mt-3 text-xs text-da-cream/35">
          © {new Date().getFullYear()} Darul Arqum. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
