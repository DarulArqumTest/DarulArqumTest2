"use client";

import * as React from "react";
import { Hero, GreetingSplash, useIntroPhase, type ProgramKey } from "@/components/sections/home-literal";
import { GivingSection, GiveModal, useGiveModal, ProgramModal, ProgramsSection, ContactSection } from "@/components/sections/home-literal-sections";
import { HomeHighlightProvider } from "@/components/site/use-scroll-highlight";

export function HomePage({ skipIntro }: { skipIntro: boolean }) {
  const { phase, index } = useIntroPhase(skipIntro);
  const give = useGiveModal();
  const [openProgram, setOpenProgram] = React.useState<ProgramKey | null>(null);

  return (
    <HomeHighlightProvider>
      <GreetingSplash phase={phase} index={index} />
      <main style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
        <Hero revealed={phase !== "intro"} />
        <GivingSection onOpenOnce={give.openOnce} onOpenMonthly={() => give.openMonthly()} onOpenMonthly60={() => give.openMonthly(60)} />
        <ProgramsSection onOpen={setOpenProgram} />
        <ContactSection />
      </main>
      <GiveModal state={give.state} setState={give.setState} close={give.close} />
      <ProgramModal program={openProgram} onClose={() => setOpenProgram(null)} />
    </HomeHighlightProvider>
  );
}
