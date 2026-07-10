import type { Metadata } from "next";
import { PrayerTimesPage } from "@/components/sections/prayer-times-page";

export const metadata: Metadata = {
  title: "Prayer times",
  description:
    "Live daily prayer and iqama timings at Darul Arqum, 4269 Limebank Rd, Ottawa — mirrored from the masjid's Mawaqit screen.",
};

export default function PrayerTimesRoute() {
  return (
    <main>
      <PrayerTimesPage />
    </main>
  );
}
