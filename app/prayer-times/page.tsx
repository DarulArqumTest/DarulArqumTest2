import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PrayerTimesPage } from "@/components/sections/prayer-times-page";

export const metadata: Metadata = {
  title: "Prayer times",
  description:
    "Live daily prayer and iqama timings at Darul Arqum, 4269 Limebank Rd, Ottawa — mirrored from the masjid's Mawaqit screen.",
};

export default function PrayerTimesRoute() {
  return (
    <>
      <Navbar />
      <main>
        <PrayerTimesPage />
      </main>
      <Footer />
    </>
  );
}
