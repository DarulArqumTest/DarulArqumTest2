import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { EXT, ORG, R } from "@/lib/links";
import { Reveal, DrawnRule } from "@/components/site/reveal";
import { Lattice } from "@/components/site/ambient";

const COLUMNS = [
  {
    heading: "Worship",
    items: [
      { label: "Live prayer times", href: R.prayer },
      { label: "Jumu'ah — 1:30 & 2:30 PM", href: R.prayer },
      { label: "WhatsApp iqama alerts", href: EXT.whatsapp },
      { label: "Visit the masjid", href: R.contact },
    ],
  },
  {
    heading: "Programs",
    items: [
      { label: "Weekdays Quran classes", href: R.quran },
      { label: "Aalim program & Hifz", href: R.aalim },
      { label: "KidsLearnArabic", href: R.kidsArabic },
      { label: "welearn (online)", href: R.welearn },
    ],
  },
  {
    heading: "Give",
    items: [
      { label: "Donate", href: R.give },
      { label: "Monthly pledge (PAD)", href: R.pledge },
      { label: "Tax receipt", href: R.taxReceipt },
      { label: "PAD form (PDF)", href: EXT.padFormPdf },
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
    <footer className="relative overflow-hidden border-t border-bone/10 bg-ink text-bone">
      <Lattice className="pointer-events-none absolute inset-0 text-bone/[0.03]" />
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
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-brass/40"
                />
                <p className="font-display text-2xl tracking-tight">Darul Arqum</p>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone/55">
                {ORG.tagline}. The first masjid in Riverside South — let&apos;s build it together.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-bone/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brassL" aria-hidden />
                  <a href={ORG.mapsUrl} className="hover:text-bone">{ORG.address}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-brassL" aria-hidden />
                  <a href={ORG.phoneHref} className="hover:text-bone">{ORG.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-brassL" aria-hidden />
                  <a href={ORG.emailHref} className="hover:text-bone">{ORG.email}</a>
                </li>
              </ul>
            </div>

            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="text-xs uppercase tracking-[0.2em] text-brassL">{col.heading}</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.items.map((item) =>
                    item.href.startsWith("/") ? (
                      <li key={item.label}>
                        <Link href={item.href} className="u-draw text-bone/65 hover:text-bone">
                          {item.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <a href={item.href} className="u-draw text-bone/65 hover:text-bone">
                          {item.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            ))}
          </div>
        </Reveal>

        <DrawnRule className="mt-14 bg-bone/10" />
        <div className="mt-7 flex flex-col gap-3 text-xs text-bone/45 md:flex-row md:items-center md:justify-between">
          <p>CRA approved charitable organization · Reg. #{ORG.charityReg}</p>
          <p>
            E-transfer: {ORG.email} · Bank: {ORG.bank.institution}, transit {ORG.bank.transit}, account {ORG.bank.account}
          </p>
        </div>
        <p className="mt-3 text-xs text-bone/35">
          © {new Date().getFullYear()} Darul Arqum. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
