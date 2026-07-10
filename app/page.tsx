import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HomePage } from "@/components/sections/home-page";
import { GoldRibbon } from "@/components/site/da-motifs";

export default function Home() {
  return (
    <>
      <GoldRibbon side="left" width={34} />
      <GoldRibbon side="right" width={34} />
      <Navbar />
      <HomePage />
      <Footer />
    </>
  );
}
