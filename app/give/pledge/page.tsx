import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ProgramDetail } from "@/components/site/program-page";
import { EXT, ORG } from "@/lib/links";
import { CreditCard, FileDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Monthly pledge",
  description:
    "Set up a monthly pre-authorized donation to Darul Arqum, or give by PayPal/credit card. $60 per family per month sustains the masjid.",
};

export default function PledgePage() {
  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <PageHero
          eyebrow="Give · monthly"
          title="The steady hands that hold the masjid"
          lede="A pre-authorized monthly donation covers the ~$6,000 running costs and repays the community's $144K Qard-e-Hasan. You can cancel any time with 30 days' notice."
        >
          <div className="flex flex-wrap gap-3">
            {/* ADMIN-ACCESS FOLLOW-UP: replace this with the exact hosted
                PayPal button URL (paypal.com/donate?hosted_button_id=…)
                once retrieved from Wix admin. Until then this routes to the
                live public pledge flow, which works today. */}
            <a
              href={EXT.paypalPledgeLegacy}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-4 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              <CreditCard className="h-4 w-4" aria-hidden />
              Give by PayPal / card
            </a>
            <a
              href={EXT.padFormPdf}
              className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-7 py-4 text-sm text-bone transition-colors hover:bg-bone/10"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              Printable PAD form (PDF)
            </a>
          </div>
        </PageHero>
        <ProgramDetail
          about={{
            title: "Donation authorization (PAD)",
            body: "Complete the authorization below to set up pre-authorized debit from your bank account — one-time or monthly on your chosen day. The team will confirm before any debit begins; a void cheque can be provided at the masjid or by email.",
          }}
          facts={[
            { label: "Suggested amount", value: `$${ORG.finances.perFamily} / family / month` },
            { label: "PayPal monthly minimum", value: "$20" },
            { label: "E-transfer (any amount)", value: ORG.email },
            { label: "Bank deposit", value: `TD · ${ORG.bank.transit} · ${ORG.bank.account}` },
            { label: "Cancellation", value: "Any time, 30 days' notice" },
            { label: "Tax receipts", value: "Issued end of February" },
          ]}
          formName="pledge"
          formTitle="Donation authorization"
          formNote="By submitting, you authorize Darul Arqum to arrange the pre-authorized donation described above; the team will contact you to verify banking details securely (do not enter full banking credentials here). You may cancel at any time with 30 days' notice."
          fields={[
            { name: "Full name", label: "Full name", required: true, half: true },
            { name: "phone", label: "Phone", type: "tel", required: true, half: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "Address", label: "Mailing address (required for tax receipt)", required: true },
            { name: "Frequency", label: "Frequency", type: "select", required: true, options: ["Monthly", "One-time"] },
            { name: "Amount", label: "Amount (CAD)", required: true, half: true },
            { name: "Charge day", label: "Preferred charge day of month", half: true },
            { name: "Notes", label: "Notes", type: "textarea", placeholder: "Anything the team should know" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
