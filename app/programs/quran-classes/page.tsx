import type { Metadata } from "next";
import { ProgramDetailPage } from "@/components/sections/program-detail-page";
import { getProgram } from "@/lib/programs";

const program = getProgram("quran-classes");

export const metadata: Metadata = {
  title: program.metaTitle,
  description: program.metaDescription,
};

export default function Page() {
  return (
    <main>
      <ProgramDetailPage program={program} />
    </main>
  );
}
