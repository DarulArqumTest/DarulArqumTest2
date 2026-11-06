import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { readSettings } from "@/lib/settings-store";

export const alt = "Prayer times at Darul Arqum";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const { jumua } = await readSettings();
  return pageCard({
    eyebrow: "Five daily prayers",
    title: "Prayer times",
    lede: "Live iqama times straight from the masjid's own board, updated every day.",
    facts: [`Jumu'ah ${jumua.first}`, `and ${jumua.second}`, "In congregation"],
    accent: "#a9e0c0",
  });
}
