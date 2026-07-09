import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ProgramDetail } from "@/components/site/program-page";
import { ORG } from "@/lib/links";

export const metadata: Metadata = {
  title: "Weekdays Quran classes",
  description:
    "Monday–Friday evening madrasa at Darul Arqum: Nazira, Hifz, Deeniyaat, Akhlaqiat and Seerah. Boys 6+, $75/month with sibling discount.",
};

export default function QuranClassesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Programs · weekday madrasa"
          title="Weekdays Quran classes"
          lede="Evening madrasa at the masjid, Monday to Friday, 6:00–8:00 PM — building recitation, memorization, and character."
        />
        <ProgramDetail
          about={{
            title: "Five evenings a week, one strong foundation",
            body: "Students progress through structured tracks: Nazira (reading), Hifz (memorization), Deeniyaat (Islamic studies), Akhlaqiat (character) and Seerah — with an optional Saturday class (2:30–4:30 PM, Maulana Nazrul Islam).",
          }}
          facts={[
            { label: "Schedule", value: "Mon–Fri · 6:00–8:00 PM" },
            { label: "Eligibility", value: "Boys, ages 6+" },
            { label: "Fee", value: "$75 / month" },
            { label: "Sibling discount", value: "$25 off" },
            { label: "Fee e-transfer", value: ORG.madrasaFeeEmail },
            { label: "Location", value: ORG.address },
          ]}
          extra={
            <p className="text-xs leading-relaxed text-ink/50">
              Please note: childcare is not provided — drop-off and pick-up must be punctual. Monthly fees are
              e-transferred to {ORG.madrasaFeeEmail}.
            </p>
          }
          formName="quran-classes"
          formTitle="Register a student"
          formNote="Submitting this form starts the registration — the team will confirm placement and fee details by email or phone."
          fields={[
            { name: "Student name", label: "Student's full name", required: true, half: true },
            { name: "Student age", label: "Age", required: true, half: true },
            { name: "Track", label: "Preferred track", type: "select", required: true, options: ["Nazira (reading)", "Hifz (memorization)", "Deeniyaat", "Akhlaqiat", "Seerah", "Weekend class (Saturday)", "Not sure — advise us"] },
            { name: "Parent name", label: "Parent / guardian name", required: true, half: true },
            { name: "phone", label: "Phone", type: "tel", required: true, half: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "Notes", label: "Anything we should know", type: "textarea", placeholder: "Prior Quran experience, scheduling constraints…" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
