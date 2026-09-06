import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { LOCATION_LIST } from "@/lib/links";

export const alt = "Darul Arqum locations in Ottawa";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return pageCard({
    eyebrow: "Two masjids in Ottawa",
    title: "Find us",
    lede: "Darul Arqum East in Riverside South, and Darul Arqum West on Old Richmond Road.",
    facts: LOCATION_LIST.map((l) => l.street),
    accent: "#8fb4c9",
  });
}
