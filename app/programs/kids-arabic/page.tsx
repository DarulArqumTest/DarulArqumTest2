import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ProgramDetail } from "@/components/site/program-page";

export const metadata: Metadata = {
  title: "KidsLearnArabic",
  description:
    "Arabic for ages 5–10 at Darul Arqum, Ottawa — the language of the Quran made approachable and joyful for young learners.",
};

export default function KidsArabicPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Programs · ages 5–10"
          title="KidsLearnArabic"
          lede="A dedicated Arabic track for young learners — playful, structured, and rooted in the language of the Quran."
        />
        <ProgramDetail
          about={{
            title: "Small learners, real Arabic",
            body: "Children aged 5–10 build letters, sounds, vocabulary and confidence in a nurturing environment at the masjid. Registration collects the details our teachers and safety policy require.",
          }}
          facts={[
            { label: "Ages", value: "5 – 10" },
            { label: "Location", value: "Darul Arqum, 4269 Limebank Rd." },
            { label: "Class size", value: "Small groups" },
          ]}
          formName="kids-arabic"
          formTitle="Register your child"
          formNote="Emergency and health details are collected per the program's safety requirements and shared only with the teaching team."
          fields={[
            { name: "Child name", label: "Child's full name", required: true, half: true },
            { name: "Child age", label: "Age", required: true, half: true },
            { name: "Parent 1", label: "Parent / guardian 1 — name & phone", required: true },
            { name: "Parent 2", label: "Parent / guardian 2 — name & phone" },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "Emergency contact", label: "Emergency contact — name & phone", required: true },
            { name: "Medical conditions", label: "Allergies / medical conditions", type: "textarea" },
            { name: "Health card", label: "Health card number (optional)", half: true },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
