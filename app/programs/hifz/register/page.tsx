import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { RegistrationForm, type ProgramConfig } from "@/components/site/registration-form";
import { HifzHero, HifzBackdrop } from "@/components/site/registration-heroes";

export const metadata: Metadata = {
  title: "Register for Quran Hifz",
  description: "Register for the full-time Quran Hifz program at Al-Arif Islamic Institute — Monday–Friday, $75/month.",
};

const config: ProgramConfig = {
  submitDestination: "hifz",
  emailSubject: "Quran Hifz registration",
  eyebrow: "Al-Arif Islamic Institute · flagship",
  title: "Register for Quran Hifz",
  accentHex: "#d98f4a",
  studentLabel: "Student's full name",
  parentLabel: "Parent / guardian name (if applicable)",
  ageMin: 6,
  ageMax: 60,
  agePlaceholder: "e.g. 12",
  schedule: { label: "Monday–Friday", sub: "Full-time, on site at Darul Arqum" },
  tuition: { label: "$75 / month", sub: "Monthly tuition, due at the start of each month" },
  backgroundField: {
    label: "Qur'an memorized so far (optional)",
    placeholder: "e.g. memorized Juz Amma, previously enrolled in a hifz program...",
  },
  extraAbout:
    "Structured daily hours for revision and new memorization, paired with tajweed correction and continuous assessment, under Mufti Taqi — until the Qur'an is completed and preserved by heart.",
  hero: <HifzHero />,
  backdrop: <HifzBackdrop />,
};

export default function HifzRegisterPage() {
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
