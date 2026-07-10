import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { SectionIntro } from "@/components/site/section-intro";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { FormSystem } from "@/components/site/form-system";
import { CTABand } from "@/components/site/cta-band";
import { EXT, ORG, R } from "@/lib/links";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & visit",
  description:
    "Reach the Darul Arqum board, plan a visit to 4269 Limebank Rd in Ottawa, or send a message — everyone is welcome.",
};

export default function ContactPage() {
  return (
    <main className="bg-bone">
        <PageHero
          eyebrow="Contact & visit"
          title="The door is open"
          lede="Questions about prayers, programs, giving, or visiting the masjid — the board reads every message."
        />

        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto grid max-w-wide items-start gap-14 lg:grid-cols-[1fr_1.3fr]">
            <div className="space-y-10 lg:sticky lg:top-28">
              <div>
                <SectionIntro eyebrow="Visit" title="Find the masjid" />
                <ul className="mt-6 space-y-3 text-sm text-ink/70">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden />
                    <a href={ORG.mapsUrl} target="_blank" rel="noopener noreferrer" className="u-draw hover:text-ink">
                      {ORG.address} — open in Maps
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-brass" aria-hidden />
                    <a href={ORG.phoneHref} className="u-draw hover:text-ink">{ORG.phone}</a>
                    <span className="text-ink/45">· {ORG.phoneAlt}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-brass" aria-hidden />
                    <a href={ORG.emailHref} className="u-draw hover:text-ink">{ORG.email}</a>
                  </li>
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-ink/50">
                  Parking: overnight parking on masjid premises requires authorization. Security cameras are in use.
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-brass">The board</p>
                <Stagger className="mt-5 grid grid-cols-2 gap-3">
                  {ORG.board.map((b) => (
                    <StaggerItem key={b.name}>
                      <div className="rounded-2xl border border-line bg-white/60 p-5">
                        <p className="font-medium text-ink">{b.name}</p>
                        <p className="mt-0.5 text-xs uppercase tracking-wider text-brass">{b.role}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>

            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-line bg-white/50 p-7 md:p-10">
                <h2 className="font-display text-2xl tracking-tight text-ink">Send a message</h2>
                <div className="mt-7">
                  <FormSystem
                    formName="contact"
                    submitLabel="Send message"
                    fields={[
                      { name: "Full name", label: "Full name", required: true, half: true },
                      { name: "phone", label: "Phone", type: "tel", half: true },
                      { name: "email", label: "Email", type: "email", required: true },
                      { name: "Subject", label: "Subject", type: "select", required: true, options: ["General question", "Prayer times / Jumu'ah", "Programs & registration", "Donations & tax receipts", "Volunteering", "Facilities / parking", "Other"] },
                      { name: "Message", label: "Message", type: "textarea", required: true },
                    ]}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <CTABand
          title="Coming for salah?"
          body="Check today's iqama before you head out — times shift through the year."
          actions={[
            { label: "Live prayer times", href: R.prayer, primary: true },
            { label: "WhatsApp alerts", href: EXT.whatsapp },
          ]}
        />
    </main>
  );
}
