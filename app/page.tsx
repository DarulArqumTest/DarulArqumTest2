import { ArcRevealHero } from "@/components/ui/arc-preloader-hero";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import {
  Hero,
  PrayerFeature,
  ProgramsSection,
  CommunitySection,
  GivingSection,
  StoryTeaser,
  ContactSection,
  HomeHighlightProvider,
} from "@/components/sections/home-sections";

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
      <HomeHighlightProvider>
        <main>
          <ArcRevealHero
            greetings={GREETINGS}
            greetingHold={760}
            revealDuration={1400}
            storageKey="da-intro"
            className="!bg-da-bg text-da-cream [--background:#0e2419]"
            introClassName="!bg-da-bg"
            greetingClassName="font-daDisplay font-medium !text-da-cream"
          >
            <Hero />
          </ArcRevealHero>

          <PrayerFeature />
          <ProgramsSection />
          <StoryTeaser />
          <CommunitySection />
          <GivingSection />
          <ContactSection />
        </main>
      </HomeHighlightProvider>
      <Footer />
    </>
  );
}
