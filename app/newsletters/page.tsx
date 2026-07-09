import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { SectionIntro } from "@/components/site/section-intro";
import { Reveal } from "@/components/site/reveal";
import { FormSystem } from "@/components/site/form-system";
import { CTABand } from "@/components/site/cta-band";
import { EXT, R } from "@/lib/links";

export const metadata: Metadata = {
  title: "Newsletters",
  description:
    "Darul Arqum community newsletters — announcements, programs and masjid updates for Riverside South, Ottawa.",
};

/**
 * ADMIN-ACCESS FOLLOW-UP: migrate individual newsletter issues from the
 * legacy Wix archive into `ISSUES` below (title, date, link/summary).
 * Until then this page carries the subscription flow and the channels
 * where every announcement is published first.
 */
const ISSUES: { title: string; date: string; href: string }[] = [];

export default function NewslettersPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Community"
          title="Newsletters"
          lede="Program launches, Ramadhan and Eid schedules, fundraising milestones — the masjid's announcements, archived and delivered."
        />
        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto grid max-w-wide items-start gap-14 lg:grid-cols-2">
            <div>
              <SectionIntro
                eyebrow="Archive"
                title="Recent issues"
                lede={
                  ISSUES.length
                    ? "Browse past announcements."
                    : "The newsletter archive is being migrated from the legacy site. Until it lands here, every announcement is published in the WhatsApp group and on YouTube the moment it goes out."
                }
              />
              {ISSUES.length > 0 && (
                <ul className="mt-8 divide-y divide-line border-y border-line">
                  {ISSUES.map((i) => (
                    <li key={i.title}>
                      <a href={i.href} className="flex justify-between gap-6 py-4 text-sm hover:bg-sand/30">
                        <span className="font-medium text-ink">{i.title}</span>
                        <span className="text-ink/50">{i.date}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <a href={EXT.whatsapp} target="_blank" rel="noopener noreferrer" className="u-draw font-medium text-forest">
                  WhatsApp announcements
                </a>
                <a href={EXT.youtubeChannel} target="_blank" rel="noopener noreferrer" className="u-draw font-medium text-forest">
                  YouTube channel
                </a>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-line bg-white/50 p-7 md:p-9">
                <h2 className="font-display text-2xl tracking-tight text-ink">Subscribe</h2>
                <p className="mt-2 text-sm text-ink/60">One email list. No noise. Unsubscribe anytime.</p>
                <div className="mt-6">
                  <FormSystem
                    formName="mailing-list"
                    submitLabel="Subscribe"
                    fields={[
                      { name: "Full name", label: "Name", required: true },
                      { name: "email", label: "Email", type: "email", required: true },
                    ]}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <CTABand
          title="Something to announce?"
          body="Community members can submit announcements for review by the board."
          actions={[{ label: "Contact the team", href: R.contact, primary: true }]}
        />
      </main>
      <Footer />
    </>
  );
}
