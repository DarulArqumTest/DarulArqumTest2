import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { SectionIntro } from "@/components/site/section-intro";
import { Reveal } from "@/components/site/reveal";
import { FormSystem } from "@/components/site/form-system";
import { QuoteBlock } from "@/components/site/quote-block";
import { EXT, ORG } from "@/lib/links";
import { CalendarHeart, Clock3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Volunteer with Darul Arqum, log volunteer hours, join the mailing list, and stay tuned for Eid and community events in Riverside South, Ottawa.",
};

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Community"
          title="This masjid runs on its people"
          lede="Every program, every Jumu'ah, every Eid — carried by volunteers. Join Darul Arqum, lend your hours, and stay in the loop."
        />

        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto grid max-w-wide items-start gap-14 lg:grid-cols-2">
            <div>
              <SectionIntro
                eyebrow="Join Darul Arqum"
                title="Volunteer & register"
                lede="Tell us who you are and how you'd like to help — setup, teaching support, events, maintenance, tech, youth. The team will reach out with next steps."
              />
              <Reveal delay={0.15} className="mt-8 rounded-3xl border border-line bg-white/50 p-7 md:p-9">
                <FormSystem
                  formName="volunteer"
                  submitLabel="Join / volunteer"
                  fields={[
                    { name: "Full name", label: "Full name", required: true, half: true },
                    { name: "phone", label: "Phone", type: "tel", required: true, half: true },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "Interest", label: "I'd like to", type: "select", required: true, options: ["Volunteer at events", "Help with programs / teaching", "Maintenance & setup", "Tech / media", "Register as a community member", "Log volunteer hours"] },
                    { name: "Hours or details", label: "Details (or hours to log)", type: "textarea", placeholder: "e.g. Logged 3 hours — Jumu'ah setup, July 3" },
                  ]}
                  note="Volunteer hours submitted here are recorded for students needing signed confirmation — mention the school form if you need one."
                />
              </Reveal>
            </div>

            <div className="space-y-6 lg:sticky lg:top-28">
              <Reveal>
                <div className="relative overflow-hidden rounded-3xl border border-brass/25 bg-forest p-8 text-bone">
                  <CalendarHeart className="h-6 w-6 text-brassL" aria-hidden />
                  <h3 className="mt-4 font-display text-2xl tracking-tight">Eid at Darul Arqum</h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone/65">
                    Eid salah times and celebrations are announced each season. No events are scheduled at the
                    moment — announcements land first in the WhatsApp group and the newsletter.
                  </p>
                  <a
                    href={EXT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex rounded-full bg-brass px-5 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
                  >
                    Get Eid announcements
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-3xl border border-line bg-white/60 p-8">
                  <Clock3 className="h-6 w-6 text-forest" aria-hidden />
                  <h3 className="mt-4 font-display text-2xl tracking-tight text-ink">Mailing list</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    Newsletters, program registrations and community notices — straight to your inbox.
                  </p>
                  <div className="mt-5">
                    <FormSystem
                      formName="mailing-list"
                      submitLabel="Subscribe"
                      fields={[
                        { name: "Full name", label: "Name", required: true, half: true },
                        { name: "email", label: "Email", type: "email", required: true, half: true },
                      ]}
                    />
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-xs leading-relaxed text-ink/50">
                  A community note: for safety, security cameras are in use on the premises, and overnight parking
                  requires authorization — unauthorized vehicles interfere with snow clearing and may be ticketed or
                  towed. Questions: {ORG.phone} · {ORG.email}.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <QuoteBlock
          text="The most beloved of people to Allah are those who are most beneficial to people."
          source="Al-Mu'jam al-Awsat"
        />
      </main>
      <Footer />
    </>
  );
}
