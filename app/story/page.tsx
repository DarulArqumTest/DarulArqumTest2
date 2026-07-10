import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { StoryTimeline } from "@/components/sections/story-timeline";
import { QuoteBlock } from "@/components/site/quote-block";
import { EXT } from "@/lib/links";

export const metadata: Metadata = {
  title: "The story",
  description:
    "How Riverside South got its first masjid: Darul Arqum's journey from a 2019 founding to a community-owned home at 4269 Limebank Rd.",
};

export default function StoryPage() {
  return (
    <>
      <Navbar />
      <main className="bg-da-bg">
        <PageHero
          theme="da"
          eyebrow="The story"
          title="Seeking the pleasure of Allah, serving a community"
          lede="Darul Arqum is a non-profit charitable organization based in Gloucester South, aiming to seek the pleasure of Allah ﷻ by serving the needs of the Muslim community in Ottawa and Canada at large."
        >
          <a
            href={EXT.youtubeIntro}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-da-cream/25 px-6 py-3.5 text-sm text-da-cream transition-colors hover:bg-da-cream/10"
          >
            Watch the community introduction
          </a>
        </PageHero>
        <StoryTimeline />
        <QuoteBlock
          theme="da"
          arabic="مَن بَنى مَسجِدًا لِلَّهِ بَنى اللَّهُ لَهُ بَيتًا في الجَنَّةِ"
          text="Whoever builds a masjid for Allah, Allah will build for him a house like it in Paradise."
          source="Sahih Muslim"
        />
      </main>
      <Footer />
    </>
  );
}
