import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/sections/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Darul Arqum: the masjid at 4269 Limebank Rd, the March 2020 fundraising dinner, and Taraweeh in Ramadhan 2021.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="bg-da-bg">
        <PageHero
          theme="da"
          eyebrow="Darul Arqum · Ottawa"
          title="Gallery"
          lede="Moments from the masjid, our community, and the nights that built it."
        />
        <GalleryGrid />
      </main>
      <Footer />
    </>
  );
}
