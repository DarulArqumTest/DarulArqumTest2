import type { Metadata } from "next";
import { VolunteerPage } from "@/components/sections/volunteer-page";

export const metadata: Metadata = {
  title: "Volunteer & register",
  description:
    "Join Darul Arqum — volunteer for events, teaching, maintenance, IT/media, fundraising and hospitality in Riverside South, Ottawa.",
};

export default function CommunityRoute() {
  return (
    <main>
      <VolunteerPage />
    </main>
  );
}
