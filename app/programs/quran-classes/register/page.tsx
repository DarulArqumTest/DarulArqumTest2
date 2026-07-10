import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { RegistrationForm, type ProgramConfig } from "@/components/site/registration-form";
import { PhotoBandHero, QuranClassBackdrop } from "@/components/site/registration-heroes";

export const metadata: Metadata = {
  title: "Register for Weekend Quran classes",
  description: "Register for weekend Quran classes at Darul Arqum — Saturday & Sunday, $50/month.",
};

const config: ProgramConfig = {
  submitDestination: "quran-classes",
  emailSubject: "Quran class registration",
  eyebrow: "Weekend madrasa · ages 6+",
  title: "Register for Weekend Quran classes",
  accentHex: "#8fb4c9",
  buttonAccentHex: "#c9a227",
  studentLabel: "Student's full name",
  parentLabel: "Parent / guardian name",
  ageMin: 6,
  ageMax: 18,
  ageRequired: true,
  agePlaceholder: "6–18",
  schedule: { label: "Weekends", sub: "Saturday & Sunday, at the masjid" },
  tuition: { label: "$50 / month", sub: "Monthly tuition, due at the start of each month" },
  backgroundField: {
    label: "What has your child read or memorized so far? (optional)",
    placeholder: "e.g. currently reading with tashkeel, memorized Juz Amma, attended classes before...",
  },
  curriculum: ["Nazira", "Hifz", "Deeniyaat", "Akhlaqiat", "Seerah"],
  hero: <PhotoBandHero alt="Weekend Quran classes" />,
  backdrop: <QuranClassBackdrop />,
};

export default function QuranClassRegisterPage() {
  return (
    <>
      <Navbar />
      <main>
        <RegistrationForm config={config} />
      </main>
      <Footer />
    </>
  );
}
