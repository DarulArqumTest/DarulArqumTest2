import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HifzRegister } from "@/components/sections/hifz-register";

export const metadata: Metadata = {
  title: "Register for Quran Hifz",
  description: "Register for the full-time Quran Hifz program at Al-Arif Islamic Institute — Monday–Friday, $75/month.",
};

export default function HifzRegisterRoute() {
  return (
    <>
      <Navbar />
      <main>
        <HifzRegister />
      </main>
      <Footer />
    </>
  );
}
