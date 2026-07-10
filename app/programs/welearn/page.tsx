import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { QuoteBlock } from "@/components/site/quote-block";
import { CTABand } from "@/components/site/cta-band";
import { SectionIntro } from "@/components/site/section-intro";
import { Reveal } from "@/components/site/reveal";
import { EXT, R } from "@/lib/links";
import { Video } from "lucide-react";

export const metadata: Metadata = {
  title: "welearn — online with Sheikh Saud Hasan",
  description:
    "Live online Islamic learning from Darul Arqum with Sheikh Saud Hasan — join the class over Zoom from anywhere.",
};

export default function WelearnPage() {
  return (
    <main className="bg-bone">
        <PageHero
          eyebrow="Programs · online"
          title="welearn"
          lede="Learn with Sheikh Saud Hasan — live sessions over Zoom, open to the community wherever you are."
        >
          <a
            href={EXT.welearnZoom}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-4 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            <Video className="h-4 w-4" aria-hidden />
            Join the live Zoom class
          </a>
        </PageHero>
        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-wide">
            <SectionIntro
              eyebrow="How it works"
              title="Open your laptop, join the circle"
              lede="Sessions run live — no software beyond Zoom needed. Class announcements, schedule changes and recordings are shared through the community WhatsApp group, so join it to stay in step."
            />
            <Reveal delay={0.15} className="mt-8">
              <a href={EXT.whatsapp} target="_blank" rel="noopener noreferrer" className="u-draw text-sm font-medium text-forest">
                Get schedule updates on WhatsApp
              </a>
            </Reveal>
          </div>
        </section>
        <QuoteBlock
          text="Seeking knowledge is an obligation upon every Muslim."
          source="Sunan Ibn Majah"
        />
        <CTABand
          title="Prefer learning in person?"
          body="The masjid runs weekday Quran classes, the Aalim program, Hifz and kids' Arabic on site."
          actions={[{ label: "See all programs", href: R.programs, primary: true }]}
        />
    </main>
  );
}
