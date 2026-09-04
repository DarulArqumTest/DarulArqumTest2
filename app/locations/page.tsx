import type { Metadata } from "next";
import { LocationsPage } from "@/components/sections/locations-page";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Darul Arqum has two masjids in Ottawa: Darul Arqum East at 4269 Limebank Rd in Riverside South, and Darul Arqum West at 6050 Old Richmond Rd.",
};

export default function Locations() {
  return <LocationsPage />;
}
