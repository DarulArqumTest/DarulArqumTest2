import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { getProgram } from "@/lib/programs";

const P = getProgram("aalim");

export const alt = `${P.name} at Darul Arqum`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return pageCard({
    eyebrow: P.eyebrow,
    title: P.name,
    lede: P.lede,
    facts: P.cardFacts.map((f) => f.value),
    accent: P.accent,
  });
}
