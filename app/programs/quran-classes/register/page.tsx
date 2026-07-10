import type { Metadata } from "next";
import { QuranRegister } from "@/components/sections/quran-register";

export const metadata: Metadata = {
  title: "Register for Weekend Quran classes",
  description: "Register for weekend Quran classes at Darul Arqum — Saturday & Sunday, $50/month.",
};

export default function QuranClassRegisterRoute() {
  return (
    <main>
      <QuranRegister />
    </main>
  );
}
