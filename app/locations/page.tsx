import type { Metadata } from "next";
import { LocationsPage } from "@/components/sections/locations-page";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Darul Arqum is at 4269 Limebank Rd in Riverside South, Ottawa. Directions, hours and how to find us.",
};

export default function Locations() {
  return <LocationsPage />;
}
