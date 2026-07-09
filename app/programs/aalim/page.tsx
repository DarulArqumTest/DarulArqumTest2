import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ProgramDetail } from "@/components/site/program-page";
import { QuoteBlock } from "@/components/site/quote-block";
import { ORG } from "@/lib/links";

export const metadata: Metadata = {
  title: "Aalim program & Hifz — Al-Arif Islamic Institute",
  description:
    "Structured classical studies at Darul Arqum: Sarf & Nahw, Quran, Hadith, Fiqh and Aqa'id, plus a full-time Quran Hifz track led by Mufti Taqi.",
};

export default function AalimPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Programs · Al-Arif Islamic Institute"
          title="Aalim program & Quran Hifz"
          lede="Led by Mufti Taqi — a scholar trained at the Al-Rashid Institute with deep expertise in jurisprudence, Hadith, Tafsir and Arabic — Al-Arifa Madrasa pairs academic excellence with spiritual growth."
        />
        <ProgramDetail
          about={{
            title: "Two tracks, one institute",
            body: "The Quran & Hifz track (Monday–Friday) guides students to memorize the entire Quran with proper tajweed and reflection. The Aalim & Arabic track covers Sarf and Nahw grammar, understanding the Quran, the Hadith of the Prophet ﷺ, Islamic jurisprudence, and Aqa'id (creed).",
          }}
          facts={[
            { label: "Institute", value: "Al-Arif Islamic Institute" },
            { label: "Lead teacher", value: "Mufti Taqi" },
            { label: "Hifz schedule", value: "Monday – Friday" },
            { label: "Aalim curriculum", value: "Sarf & Nahw · Quran · Hadith · Fiqh · Aqa'id" },
            { label: "Running since", value: "September 2025" },
            { label: "Contact", value: `Sadrul Alim · ${ORG.phone}` },
          ]}
          formName="aalim"
          formTitle="Apply to the institute"
          formNote="Applications go to the Darul Arqum team; you'll be contacted about placement, timings and any accommodations."
          fields={[
            { name: "Track", label: "Program track", type: "select", required: true, options: ["Quran & Hifz Program", "Aalim Program & Arabic Language"] },
            { name: "Student name", label: "Student's full name", required: true, half: true },
            { name: "Student age", label: "Age", required: true, half: true },
            { name: "Parent name", label: "Parent / guardian (if under 18)", half: true },
            { name: "phone", label: "Phone", type: "tel", required: true, half: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "Address", label: "Home address", required: true },
            { name: "Quran level", label: "Current Quran level", type: "select", required: true, options: ["Beginner (learning to read)", "Reads with support", "Reads fluently", "Partial Hifz", "Completed Hifz"] },
            { name: "Accommodations", label: "Accommodations or notes", type: "textarea", placeholder: "Learning needs, schedule constraints…" },
          ]}
        />
        <QuoteBlock
          text="Whoever travels a path in search of knowledge, Allah makes easy for him a path to Paradise."
          source="Sahih Muslim"
        />
      </main>
      <Footer />
    </>
  );
}
