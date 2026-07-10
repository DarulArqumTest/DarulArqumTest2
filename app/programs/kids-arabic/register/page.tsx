import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { RegistrationForm, type ProgramConfig } from "@/components/site/registration-form";
import { KidsHero, KidsBackdrop } from "@/components/site/registration-heroes";

export const metadata: Metadata = {
  title: "Register for KidsLearnArabic",
  description: "Register your child (ages 5–10) for KidsLearnArabic at Darul Arqum.",
};

const config: ProgramConfig = {
  submitDestination: "kids-arabic",
  emailSubject: "KidsLearnArabic registration",
  eyebrow: "Ages 5–10",
  title: "Register for KidsLearnArabic",
  accentHex: "#7cc99a",
  buttonTextColor: "#0e2419",
  studentLabel: "Child's full name",
  parentLabel: "Parent / guardian name",
  ageMin: 5,
  ageMax: 10,
  ageRequired: true,
  agePlaceholder: "5–10",
  schedule: { label: "Ages 5–10", sub: "On site at Darul Arqum" },
  tuition: { label: "Contact us for tuition", sub: "Our team will confirm fees when you register" },
  backgroundField: {
    label: "Has your child attended Arabic or Quran classes before? (optional)",
    placeholder: "e.g. knows some letters, attended a class before, complete beginner...",
  },
  medical: true,
  hero: <KidsHero />,
  backdrop: <KidsBackdrop />,
};

export default function KidsArabicRegisterPage() {
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
