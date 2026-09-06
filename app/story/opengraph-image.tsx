import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const alt = "The story of Darul Arqum";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return pageCard({
    eyebrow: "Since 2019",
    title: "How this masjid came to be",
    lede: "From a handful of Riverside South families to a home of worship and learning.",
    facts: ["Incorporated 2019", "Property 2020", "A second masjid"],
    accent: "#e88a6a",
  });
}
