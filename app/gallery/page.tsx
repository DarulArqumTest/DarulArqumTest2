import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { CTABand } from "@/components/site/cta-band";
import { EXT, R } from "@/lib/links";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Darul Arqum: the masjid at 4269 Limebank Rd, the March 2020 fundraising dinner, and Taraweeh in Ramadhan 2021.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Gallery"
          title="A community, in pictures"
          lede="Moments from the journey — the building, the gatherings, and the nights of prayer. More photos live on the community YouTube channel."
        />
        <GalleryGrid />
        <CTABand
          title="Have photos from a masjid event?"
          body="Send them to the team and help the archive grow."
          actions={[
            { label: "Contact us", href: R.contact, primary: true },
            { label: "YouTube channel", href: EXT.youtubeChannel },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
