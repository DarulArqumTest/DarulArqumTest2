import { ArcRevealHero } from "@/components/ui/arc-preloader-hero";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { NextPrayerBand } from "@/components/prayer/prayer-modules";
import { CTABand } from "@/components/site/cta-band";
import {
  Hero,
  PrayerFeature,
  ProgramsSection,
  GivingSection,
  StoryTeaser,
} from "@/components/sections/home-sections";
import { EXT, R } from "@/lib/links";

const GREETINGS = [
  { text: "ٱلسَّلَامُ عَلَيْكُمْ", lang: "ar" },
  { text: "Assalamu Alaikum" },
  { text: "Peace be upon you" },
  { text: "أَهْلًا وَسَهْلًا", lang: "ar" },
  { text: "Welcome to Darul Arqum" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <ArcRevealHero
          greetings={GREETINGS}
          greetingHold={760}
          revealDuration={1400}
          storageKey="da-intro"
          className="!bg-ink text-bone [--background:#122b22]"
          introClassName="!bg-ink"
          greetingClassName="font-display font-medium !text-bone"
        >
          <Hero />
        </ArcRevealHero>

        <NextPrayerBand />
        <PrayerFeature />
        <ProgramsSection />
        <GivingSection />
        <StoryTeaser />
        <CTABand
          title="New to the community?"
          body="Join the WhatsApp group for iqama alerts and announcements, or come see the masjid — everyone is welcome."
          actions={[
            { label: "Join WhatsApp", href: EXT.whatsapp, primary: true },
            { label: "Plan a visit", href: R.contact },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
