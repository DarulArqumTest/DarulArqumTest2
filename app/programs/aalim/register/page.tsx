import type { Metadata } from "next";
import { AalimRegister } from "@/components/sections/aalim-register";

export const metadata: Metadata = {
  title: "Register for the Aalim program",
  description: "Register for the Aalim program at Al-Arif Islamic Institute — Monday–Friday, $150/month.",
};

export default function AalimRegisterRoute() {
  return (
    <main>
      <AalimRegister />
    </main>
  );
}
