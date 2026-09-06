import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ORG } from "@/lib/links";

export const alt = "Give to Darul Arqum";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

export default function Image() {
  return pageCard({
    eyebrow: "Sadaqah Jariyah",
    title: "Sixty dollars, one family, every month",
    lede: "The community bought this property outright and carries an interest-free Qard-e-Hasan.",
    facts: [
      `${fmt(ORG.finances.loanRemaining)} to go`,
      `of ${fmt(ORG.finances.loanTotal)}`,
      "CRA registered charity",
    ],
    accent: "#e3c56a",
  });
}
