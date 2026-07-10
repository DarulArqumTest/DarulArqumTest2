import { cookies } from "next/headers";
import { HomePage } from "@/components/sections/home-page";

export default async function Home() {
  const skipIntro = (await cookies()).has("da-intro-seen");
  return <HomePage skipIntro={skipIntro} />;
}
