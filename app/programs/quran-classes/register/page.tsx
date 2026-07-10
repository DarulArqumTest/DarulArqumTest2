import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { QuranRegister } from "@/components/sections/quran-register";

export const metadata: Metadata = {
  title: "Register for Weekend Quran classes",
  description: "Register for weekend Quran classes at Darul Arqum — Saturday & Sunday, $50/month.",
};

export default function QuranClassRegisterRoute() {
  return (
    <>
      <Navbar />
      <main>
        <QuranRegister />
      </main>
      <Footer />
    </>
  );
}
