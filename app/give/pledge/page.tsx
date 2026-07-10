import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PledgeForm } from "@/components/sections/pledge-form";

export const metadata: Metadata = {
  title: "Monthly pledge",
  description:
    "Set up a monthly pre-authorized donation to Darul Arqum, or give by PayPal/credit card. $60 per family per month sustains the masjid.",
};

export default function PledgePage() {
  return (
    <>
      <Navbar />
      <main className="bg-da-bg pt-20">
        <PledgeForm />
      </main>
      <Footer />
    </>
  );
}
