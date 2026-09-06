import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ORG } from "@/lib/links";

export const alt = "Prayer times at Darul Arqum";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return pageCard({
    eyebrow: "Five daily prayers",
    title: "Prayer times",
    lede: "Live iqama times straight from the masjid's own board, updated every day.",
    facts: [`Jumu'ah ${ORG.jumua.first}`, `and ${ORG.jumua.second}`, "In congregation"],
    accent: "#a9e0c0",
  });
}
