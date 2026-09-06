import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const alt = "Volunteer at Darul Arqum";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return pageCard({
    eyebrow: "Serve your community",
    title: "Join Darul Arqum",
    lede: "Somebody put the chairs out before you arrived. Come and be that somebody.",
    facts: ["Events", "Teaching", "Hospitality"],
    accent: "#7cc99a",
  });
}
