import type { Metadata } from "next";
import { KidsRegister } from "@/components/sections/kids-register";

export const metadata: Metadata = {
  title: "Register for KidsLearnArabic",
  description: "Register your child (ages 5–10) for KidsLearnArabic at Darul Arqum.",
};

export default function KidsArabicRegisterPage() {
  return (
    <main>
      <KidsRegister />
    </main>
  );
}
