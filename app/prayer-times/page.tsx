import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { PrayerTimesLive } from "@/components/sections/prayer-times-live";

export const metadata: Metadata = {
  title: "Prayer times",
  description:
    "Live daily prayer and iqama timings at Darul Arqum, 4269 Limebank Rd, Ottawa — mirrored from the masjid's Mawaqit screen.",
};

export default function PrayerTimesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-da-bg">
        <PageHero
          theme="da"
          eyebrow="Darul Arqum · Ottawa"
          title="Prayer times"
        />
        <PrayerTimesLive />
      </main>
      <Footer />
    </>
  );
}
