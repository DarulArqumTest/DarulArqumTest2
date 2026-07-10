import type { Metadata } from "next";
import { NewsletterPage } from "@/components/sections/newsletter-page";

export const metadata: Metadata = {
  title: "Newsletters",
  description:
    "Darul Arqum community newsletters — announcements, programs and masjid updates for Riverside South, Ottawa.",
};

export default function NewslettersRoute() {
  return (
    <main>
      <NewsletterPage />
    </main>
  );
}
