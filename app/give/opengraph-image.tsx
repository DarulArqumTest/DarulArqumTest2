import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { readSettings } from "@/lib/settings-store";

export const alt = "Give to Darul Arqum";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

export default async function Image() {
  const { finances } = await readSettings();
  return pageCard({
    eyebrow: "Sadaqah Jariyah",
    title: "Sixty dollars, one family, every month",
    lede: "The community bought this property outright and carries an interest-free Qard-e-Hasan.",
    facts: [
      `${fmt(finances.loanRemaining)} to go`,
      `of ${fmt(finances.loanTotal)}`,
      "CRA registered charity",
    ],
    accent: "#e3c56a",
  });
}
