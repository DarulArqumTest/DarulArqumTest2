import type { Metadata } from "next";
import { Fraunces, Figtree, Amiri, Cormorant_Garamond, Work_Sans } from "next/font/google";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { EdgeMargin } from "@/components/site/da-motifs";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", axes: ["opsz"] });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });
const arabic = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-arabic" });

// Redesign (2026) typeface pair — used by rebuilt pages + shared chrome only.
const daDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-da-display",
});
const daBody = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-da-body" });

/**
 * Absolute URLs for og:image and canonical are built from this. It must point
 * at the host actually serving the page: hard-coding the production domain
 * meant preview deployments advertised an image URL on a domain that does not
 * serve them yet, so Discord, WhatsApp and iMessage fetched nothing and showed
 * no preview at all.
 */
/* the one definition now lives in lib/links.ts, where the sitemap, the
   robots file and the structured data all read it too */
import { SITE_URL } from "@/lib/links";
import { StructuredData } from "@/components/site/structured-data";
import { SettingsProvider } from "@/components/site/settings-provider";
import { readSettings } from "@/lib/settings-store";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Darul Arqum · Masjid in Riverside South, Ottawa", template: "%s · Darul Arqum" },
  description:
    "The first masjid in Riverside South, Ottawa. Live prayer times, Jumu'ah, Quran classes, the Aalim program, and community programs. CRA registered charity #709549687RR0001.",
  openGraph: {
    title: "Darul Arqum · Masjid in Riverside South, Ottawa",
    description:
      "Prayer times, programs and community across our two masjids in Ottawa.",
    type: "website",
    siteName: "Darul Arqum",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darul Arqum · Masjid in Riverside South, Ottawa",
    description:
      "Prayer times, programs and community across our two masjids in Ottawa.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // read once per request, handed to every component that shows money
  const settings = await readSettings();
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${arabic.variable} ${daDisplay.variable} ${daBody.variable}`}
    >
      <body className="bg-da-bg font-body text-ink antialiased">
        <StructuredData />
        <SettingsProvider value={settings}>
          <EdgeMargin side="left" />
          <EdgeMargin side="right" />
          <Navbar />
          {children}
          <Footer />
        </SettingsProvider>
      </body>
    </html>
  );
}
