import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ProgramDetail } from "@/components/site/program-page";
import { ORG } from "@/lib/links";

export const metadata: Metadata = {
  title: "Tax receipt",
  description:
    "Request or update your Darul Arqum donation tax receipt details. Receipts are issued end of February; a complete mailing address is required.",
};

export default function TaxReceiptPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Give · receipts"
          title="Your donations come back at tax time"
          lede="Darul Arqum is a CRA registered charity — official receipts make your donations tax-deductible."
        />
        <ProgramDetail
          about={{
            title: "How receipts work",
            body: `Receipts are issued at the end of February for the previous year's donations, only to donors with complete information including a full mailing address (PO boxes alone can't be used). Add ${ORG.email} to your contacts so the receipt doesn't land in spam — and if you can't find yours, submit this form.`,
          }}
          facts={[
            { label: "Charity registration", value: ORG.charityReg },
            { label: "Issued", value: "End of February, annually" },
            { label: "Required", value: "Full mailing address" },
            { label: "Questions", value: ORG.email },
          ]}
          formName="tax-receipt"
          formTitle="Request / update receipt details"
          fields={[
            { name: "Full name", label: "Full name (as donated)", required: true },
            { name: "email", label: "Email used for donations", type: "email", required: true },
            { name: "Mailing address", label: "Complete mailing address", required: true },
            { name: "Donation details", label: "Donation method, dates & amounts (approx.)", type: "textarea", required: true, placeholder: "e.g. Monthly e-transfer $60, Jan–Dec 2025" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
