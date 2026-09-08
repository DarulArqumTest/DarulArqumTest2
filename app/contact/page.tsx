import type { Metadata } from "next";
import { ContactPage } from "@/components/sections/contact-page";
import { ORG } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact & visit",
  description: `Reach Darul Arqum in Ottawa: call ${ORG.phone}, email ${ORG.email}, or join the WhatsApp group. Visit either masjid, volunteer, or send the board a message. Everyone is welcome.`,
  alternates: { canonical: "/contact" },
};

export default function ContactRoute() {
  return (
    <main>
      <ContactPage />
    </main>
  );
}
