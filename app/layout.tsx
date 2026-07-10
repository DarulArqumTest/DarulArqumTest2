import type { Metadata } from "next";
import { Fraunces, Figtree, Amiri, Cormorant_Garamond, Work_Sans } from "next/font/google";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.darularqum.org"),
  title: { default: "Darul Arqum · Masjid in Riverside South, Ottawa", template: "%s · Darul Arqum" },
  description:
    "The first masjid in Riverside South, Ottawa. Live prayer times, Jumu'ah, Quran classes, the Aalim program, and community programs. CRA registered charity #709549687RR0001.",
  openGraph: {
    title: "Darul Arqum · Masjid in Riverside South, Ottawa",
    description: "Prayer times, programs, and community — the first masjid in Riverside South.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${arabic.variable} ${daDisplay.variable} ${daBody.variable}`}
    >
      <body className="bg-bone font-body text-ink antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
