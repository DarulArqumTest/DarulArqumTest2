import { HomePage } from "@/components/sections/home-page";
import { GoldRibbon } from "@/components/site/da-motifs";

export default function Home() {
  return (
    <>
      <GoldRibbon side="left" width={34} />
      <GoldRibbon side="right" width={34} />
      <HomePage />
    </>
  );
}
