"use client";

import * as React from "react";
import { Hero, GreetingSplash, useIntroPhase, type ProgramKey } from "@/components/sections/home-literal";
import { GivingSection, GiveModal, useGiveModal, ProgramModal, ProgramsSection, ContactSection } from "@/components/sections/home-literal-sections";
import { WestAnnounceDock } from "@/components/site/west-announce-banner";
import { HomeHighlightProvider } from "@/components/site/use-scroll-highlight";
import { RamadanBanner } from "@/components/site/ramadan-banner";
import { JumuaBanner } from "@/components/site/jumua-banner";

export function HomePage({ skipIntro }: { skipIntro: boolean }) {
  const { phase, index } = useIntroPhase(skipIntro);
  const give = useGiveModal();
  const [openProgram, setOpenProgram] = React.useState<ProgramKey | null>(null);

  return (
    <HomeHighlightProvider>
      <GreetingSplash phase={phase} index={index} />
      <main style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
        {/* Above the hero, not under it.
            Both of these render nothing at all on an ordinary day, so they
            cost the front page nothing. On the days they do appear they are
            the reason someone opened the site — how long until iftar, which
            khutbah is next — and that answer should not be a scroll below a
            hero they have already seen. */}
        <RamadanBanner />
        <JumuaBanner />
        <Hero revealed={phase !== "intro"} />
        <GivingSection onOpenOnce={give.openOnce} onOpenMonthly={() => give.openMonthly()} onOpenMonthly60={(amount) => give.openMonthly(amount)} />
        <ProgramsSection onOpen={setOpenProgram} />
        <ContactSection />
      </main>
      <WestAnnounceDock />
      <GiveModal state={give.state} setState={give.setState} close={give.close} />
      <ProgramModal program={openProgram} onClose={() => setOpenProgram(null)} />
    </HomeHighlightProvider>
  );
}
