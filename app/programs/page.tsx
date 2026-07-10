import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { ProgramsSection } from "@/components/sections/home-sections";
import { QuoteBlock } from "@/components/site/quote-block";
import { CTABand } from "@/components/site/cta-band";
import { EXT, ORG, R } from "@/lib/links";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Quran classes, the Aalim program, Hifz, KidsLearnArabic and welearn — Islamic education for every age at Darul Arqum, Ottawa.",
};

export default function ProgramsPage() {
  return (
    <main className="bg-bone">
        <PageHero
          eyebrow="Education"
          title="Programs at Darul Arqum"
          lede="From a child's first surah to the classical sciences of the Aalim course — taught in person at the masjid and live online. A weekend Quran class also runs Saturdays 2:30–4:30 PM with Maulana Nazrul Islam."
        >
          <p className="text-sm text-bone/55">
            Questions? Call <a className="u-draw text-bone" href={ORG.phoneHref}>{ORG.phone}</a> or{" "}
            <Link className="u-draw text-bone" href={R.contact}>write to the team</Link>.
          </p>
        </PageHero>
        <div className="pt-10">
          <ProgramsSection />
        </div>
        <QuoteBlock
          arabic="خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
          text="The best of you are those who learn the Quran and teach it."
          source="Sahih al-Bukhari"
        />
        <CTABand
          title="Not sure which program fits?"
          body="Tell us the student's age and goals and we'll point you to the right class."
          actions={[
            { label: "Contact the team", href: R.contact, primary: true },
            { label: "WhatsApp group", href: EXT.whatsapp },
          ]}
        />
    </main>
  );
}
