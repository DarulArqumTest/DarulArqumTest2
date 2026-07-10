import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AalimRegister } from "@/components/sections/aalim-register";

export const metadata: Metadata = {
  title: "Register for the Aalim program",
  description: "Register for the Aalim program at Al-Arif Islamic Institute — Monday–Friday, $150/month.",
};

export default function AalimRegisterRoute() {
  return (
    <>
      <Navbar />
      <main>
        <AalimRegister />
      </main>
      <Footer />
    </>
  );
}
