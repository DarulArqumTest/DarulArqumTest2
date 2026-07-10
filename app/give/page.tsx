import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { GivingSection } from "@/components/sections/home-sections";
import { QuoteBlock } from "@/components/site/quote-block";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { EXT, ORG, R } from "@/lib/links";
import { ArrowUpRight, Banknote, CreditCard, FileDown, HandCoins, Landmark, Mail, Receipt, Repeat } from "lucide-react";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Support Darul Arqum: e-transfer, monthly pledge (PAD), PayPal, bank deposit, cheque, and Islamic Relief Canada campaigns. CRA registered — donations are tax-deductible.",
};

const CHANNELS = [
  {
    icon: Mail,
    title: "Interac e-transfer",
    body: `Fastest and fee-free — send to ${ORG.email}. Include your mailing address for a tax receipt.`,
    href: ORG.emailHref,
    cta: "Start an e-transfer",
  },
  {
    icon: Repeat,
    title: "Monthly pledge (PAD)",
    body: "Pre-authorized debit from your bank — the steadiest way to carry the masjid. Set up online or with the printable form.",
    href: R.pledge,
    cta: "Set up a pledge",
    featured: true,
  },
  {
    icon: CreditCard,
    title: "PayPal / card",
    body: "Give by credit card through the pledge flow — one-time or monthly (minimum $20 monthly).",
    href: R.pledge,
    cta: "Give by card",
  },
  {
    icon: Landmark,
    title: "Bank deposit",
    body: `Direct deposit at any TD branch — institution ${ORG.bank.institution}, transit ${ORG.bank.transit}, account ${ORG.bank.account}.`,
    href: R.pledge,
    cta: "See details",
  },
  {
    icon: Banknote,
    title: "Cheque or money order",
    body: `Payable to "Darul Arqum" — mail or drop off at ${ORG.address}.`,
    href: R.contact,
    cta: "Visit or mail",
  },
  {
    icon: HandCoins,
    title: "Islamic Relief Canada campaigns",
    body: "Give through IRC's matching campaign or the community crowdfunding page for Darul Arqum.",
    href: EXT.ircMatchingCampaign,
    href2: EXT.ircCrowdfunding,
    cta: "Matching campaign",
    cta2: "Crowdfunding page",
  },
] as const;

export default function GivePage() {
  return (
    <main className="bg-bone">
        <PageHero
          eyebrow="Sadaqah Jariyah"
          title="Carry the first masjid in Riverside South"
          lede="Every donation is tax-deductible — Darul Arqum is a CRA registered charity (#709549687RR0001). Receipts are issued each February to donors with a complete mailing address."
        >
          <div className="flex flex-wrap gap-3">
            <a href={ORG.emailHref} className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-4 text-sm font-medium text-ink transition-transform hover:scale-[1.03]">
              E-transfer to {ORG.email}
            </a>
            <Link href={R.pledge} className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-7 py-4 text-sm text-bone transition-colors hover:bg-bone/10">
              Monthly pledge
            </Link>
          </div>
        </PageHero>

        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-wide">
            <SectionIntro
              eyebrow="Six ways to give"
              title="Choose the channel that suits you"
            />
            <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {CHANNELS.map((c) => (
                <StaggerItem key={c.title}>
                  <div
                    className={`group flex h-full flex-col rounded-2xl border p-7 transition-colors ${
                      "featured" in c && c.featured
                        ? "border-brass/50 bg-forest text-bone"
                        : "border-line bg-white/60 hover:border-forest/30 hover:bg-white"
                    }`}
                  >
                    <c.icon className={`h-5 w-5 ${"featured" in c && c.featured ? "text-brassL" : "text-forest"}`} aria-hidden />
                    <p className="mt-4 font-display text-xl tracking-tight">{c.title}</p>
                    <p className={`mt-2 flex-1 text-sm leading-relaxed ${"featured" in c && c.featured ? "text-bone/65" : "text-ink/60"}`}>
                      {c.body}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {c.href.startsWith("/") ? (
                        <Link href={c.href} className={`inline-flex items-center gap-1.5 text-sm font-medium ${"featured" in c && c.featured ? "text-brassL" : "text-forest"}`}>
                          {c.cta} <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </Link>
                      ) : (
                        <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-sm font-medium ${"featured" in c && c.featured ? "text-brassL" : "text-forest"}`}>
                          {c.cta} <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </a>
                      )}
                      {"href2" in c && c.href2 && (
                        <a href={c.href2} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                          {c.cta2} <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </a>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <a href={EXT.padFormPdf} className="inline-flex items-center gap-2 text-forest">
                <FileDown className="h-4 w-4" aria-hidden /> Download the PAD form (PDF)
              </a>
              <Link href={R.taxReceipt} className="inline-flex items-center gap-2 text-forest">
                <Receipt className="h-4 w-4" aria-hidden /> Request / update your tax receipt details
              </Link>
            </Reveal>
          </div>
        </section>

        <GivingSection />
        <QuoteBlock
          text="The believer's shade on the Day of Resurrection will be their charity."
          source="Al-Tirmidhi"
        />
    </main>
  );
}
