import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { RegistrationForm, type ProgramConfig } from "@/components/site/registration-form";
import { PhotoBandHero, AalimBackdrop } from "@/components/site/registration-heroes";

export const metadata: Metadata = {
  title: "Register for the Aalim program",
  description: "Register for the Aalim program at Al-Arif Islamic Institute — Monday–Friday, $150/month.",
};

const config: ProgramConfig = {
  submitDestination: "aalim",
  emailSubject: "Aalim program registration",
  eyebrow: "Al-Arif Islamic Institute · flagship",
  title: "Register for the Aalim program",
  accentHex: "#c9a227",
  studentLabel: "Student's full name",
  parentLabel: "Parent / guardian name (if applicable)",
  ageMin: 13,
  ageMax: 60,
  agePlaceholder: "e.g. 17",
  schedule: { label: "Monday–Friday", sub: "Full-time, on site at Darul Arqum" },
  tuition: { label: "$150 / month", sub: "Monthly tuition, due at the start of each month" },
  backgroundField: {
    label: "Prior Arabic or Islamic studies background (optional)",
    placeholder: "e.g. completed Hifz, studied Nazira, prior madrasa experience...",
  },
  curriculum: ["Sarf & Nahw", "Quran", "Hadith", "Fiqh", "Aqa'id"],
  hero: <PhotoBandHero alt="Aalim program" src="/assets/program-aalim.jpg" />,
  backdrop: <AalimBackdrop />,
};

export default function AalimRegisterPage() {
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
