import type { Metadata } from "next";
import { ProgramsPage } from "@/components/sections/programs-page";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Quran classes, the Aalim program, Hifz, KidsLearnArabic and welearn — schedules, fees and registration for every class at Darul Arqum, Ottawa.",
};

export default function Page() {
  return (
    <main>
      <ProgramsPage />
    </main>
  );
}
