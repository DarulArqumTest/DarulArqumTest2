import { cookies } from "next/headers";
import { HomePage } from "@/components/sections/home-page";
import { GoldRibbon } from "@/components/site/da-motifs";

export default async function Home() {
  const skipIntro = (await cookies()).has("da-intro-seen");
  return (
    <>
      <GoldRibbon side="left" variant="home" />
      <GoldRibbon side="right" variant="home" />
      <HomePage skipIntro={skipIntro} />
    </>
  );
}
