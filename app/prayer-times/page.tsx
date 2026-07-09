import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { PrayerTimesLive } from "@/components/sections/prayer-times-live";
import { CTABand } from "@/components/site/cta-band";
import { EXT, R } from "@/lib/links";

export const metadata: Metadata = {
  title: "Prayer times",
  description:
    "Live daily prayer and iqama timings at Darul Arqum, 4269 Limebank Rd, Ottawa — mirrored from the masjid's Mawaqit screen.",
};

export default function PrayerTimesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Salat · iqamah timings"
          title="Live from the masjid screen"
          lede="The exact display running inside Darul Arqum — five daily prayers with adhan and iqama, Hijri date, Shurûq and Jumu'ah — mirrored here in real time."
        />
        <PrayerTimesLive />
        <CTABand
          title="Never miss an iqama change"
          body="Times shift through the year. The WhatsApp group is where changes are announced first."
          actions={[
            { label: "Join WhatsApp", href: EXT.whatsapp, primary: true },
            { label: "Explore programs", href: R.programs },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
