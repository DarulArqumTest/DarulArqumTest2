import type { Metadata } from "next";
import { NewsletterArchivePage } from "@/components/sections/newsletter-archive-page";

export const metadata: Metadata = {
  title: "The Newsletter — December 2020",
  description:
    "Darul Arqum's first community newsletter, December 2020 / Rabi-at-thani 1442 AH — reminders, community stories, and updates from the masjid.",
};

export default function NewsletterDecember2020Route() {
  return (
    <main>
      <NewsletterArchivePage />
    </main>
  );
}
