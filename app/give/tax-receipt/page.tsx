import type { Metadata } from "next";
import { TaxReceiptPage } from "@/components/sections/tax-receipt-page";

export const metadata: Metadata = {
  title: "Tax receipt",
  description:
    "Request or update your Darul Arqum donation tax receipt details. Receipts are issued end of February; a complete mailing address is required.",
};

export default function TaxReceiptRoute() {
  return (
    <main>
      <TaxReceiptPage />
    </main>
  );
}
