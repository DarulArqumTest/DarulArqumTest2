import type { Metadata } from "next";
import { GalleryPage } from "@/components/sections/gallery-page";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Darul Arqum: the masjid at 4269 Limebank Rd, the March 2020 fundraising dinner, and Taraweeh in Ramadhan 2021.",
};

export default function GalleryRoute() {
  return (
    <main>
      <GalleryPage />
    </main>
  );
}
