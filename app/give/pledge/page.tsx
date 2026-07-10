import type { Metadata } from "next";
import { PledgePage } from "@/components/sections/pledge-page";

export const metadata: Metadata = {
  title: "Monthly pledge",
  description:
    "Set up a monthly pre-authorized donation to Darul Arqum, or give by PayPal/credit card. $60 per family per month sustains the masjid.",
};

export default function PledgeRoute() {
  return (
    <main>
      <PledgePage />
    </main>
  );
}
