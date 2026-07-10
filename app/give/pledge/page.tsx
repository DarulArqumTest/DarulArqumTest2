import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PledgePage } from "@/components/sections/pledge-page";

export const metadata: Metadata = {
  title: "Monthly pledge",
  description:
    "Set up a monthly pre-authorized donation to Darul Arqum, or give by PayPal/credit card. $60 per family per month sustains the masjid.",
};

export default function PledgeRoute() {
  return (
    <>
      <Navbar />
      <main>
        <PledgePage />
      </main>
      <Footer />
    </>
  );
}
