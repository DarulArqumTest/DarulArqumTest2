import { pageCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const alt = "The Darul Arqum newsletter";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return pageCard({
    eyebrow: "Stay connected",
    title: "The Darul Arqum Newsletter",
    lede: "Programmes, events and fundraising milestones, sent when there is something worth sending.",
    facts: ["Announcements", "What is coming up", "Fundraising"],
    accent: "#f2a79d",
  });
}
