import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { KidsRegister } from "@/components/sections/kids-register";

export const metadata: Metadata = {
  title: "Register for KidsLearnArabic",
  description: "Register your child (ages 5–10) for KidsLearnArabic at Darul Arqum.",
};

export default function KidsArabicRegisterPage() {
  return (
    <>
      <Navbar />
      <main>
        <KidsRegister />
      </main>
      <Footer />
    </>
  );
}
