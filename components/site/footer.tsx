"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { EXT, ORG, R } from "@/lib/links";
import { Reveal, DrawnRule } from "@/components/site/reveal";
import { DaAmbient } from "@/components/site/da-motifs";
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
      { label: "Weekdays Quran classes", href: R.quran + "/register" },
      { label: "Aalim program & Hifz", href: R.aalim + "/register" },
      { label: "KidsLearnArabic", href: R.kidsArabic + "/register" },
      { label: "welearn (online)", href: `${R.home}#welearn-card`, sectionId: "welearn-card" as ScrollTargetId },
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
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <Image
                  src={EXT.logo}
                  alt="Darul Arqum logo"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-da-gold/40"
                />
                <p className="font-daDisplay text-2xl tracking-tight text-da-cream">Darul Arqum</p>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-da-cream/55">
                {ORG.tagline}. The first masjid in Riverside South — let&apos;s build it together.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-da-cream/70">
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
              <nav key={col.heading} aria-label={col.heading}>
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
            E-transfer: {ORG.email} · Bank: {ORG.bank.institution}, transit {ORG.bank.transit}, account {ORG.bank.account}
          </p>
        </div>
        <p className="mt-3 text-xs text-da-cream/35">
          © {new Date().getFullYear()} Darul Arqum. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
