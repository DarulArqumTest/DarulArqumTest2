import type { Metadata } from "next";
import { StoryPage } from "@/components/sections/story-page";

export const metadata: Metadata = {
  title: "The story",
  description:
    "How Riverside South got its first masjid: Darul Arqum's journey from a 2019 founding to a community-owned home at 4269 Limebank Rd.",
};

export default function StoryRoute() {
  return (
    <main>
      <StoryPage />
    </main>
  );
}
