import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { ORG } from "@/lib/links";

export const alt = "Contact Darul Arqum";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return pageCard({
    eyebrow: "Contact & visit",
    title: "The door is open",
    lede: "Call, email, or join the group. Visit either masjid — everyone is welcome.",
    facts: [ORG.phone, ORG.email, "Riverside South · Ottawa"],
    accent: "#e3c56a",
  });
}
