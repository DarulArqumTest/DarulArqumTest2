import type { Metadata } from "next";
import { QuranRegister } from "@/components/sections/quran-register";

export const metadata: Metadata = {
  title: "Register for Weekday Quran classes",
  description: "Register for the weekday evening madrasa at Darul Arqum — Monday to Friday, 6:00–8:00 PM, boys 6 and up, $75/month.",
};

export default function QuranClassRegisterRoute() {
  return (
    <main>
      <QuranRegister />
    </main>
  );
}
