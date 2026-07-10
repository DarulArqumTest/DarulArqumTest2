import type { Metadata } from "next";
import { HifzRegister } from "@/components/sections/hifz-register";

export const metadata: Metadata = {
  title: "Register for Quran Hifz",
  description: "Register for the full-time Quran Hifz program at Al-Arif Islamic Institute — Monday–Friday, $75/month.",
};

export default function HifzRegisterRoute() {
  return (
    <main>
      <HifzRegister />
    </main>
  );
}
