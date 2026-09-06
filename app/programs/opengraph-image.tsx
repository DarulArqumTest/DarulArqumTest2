import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const alt = "Programs at Darul Arqum";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return pageCard({
    eyebrow: "Al-Arif Islamic Institute",
    title: "Learning at the masjid",
    lede: "From first surah to Aalim: five programmes, taught at Darul Arqum.",
    facts: ["Aalim & Hifz", "Evening madrasa", "Online classes"],
    accent: "#c9a227",
  });
}
