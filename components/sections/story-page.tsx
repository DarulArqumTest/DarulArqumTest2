"use client";

/** Literal, line-for-line port of `Story.dc.html`. */

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Twinkle, CrescentMoon, GeoMedallion } from "@/components/sections/home-literal";

const MILESTONES = [
  { key: "founding", year: "2019", title: "A community organizes", body: "Darul Arqum incorporates (Feb 23, 2019) as a non-profit charitable organization — Riverside South families uniting to establish the area's first masjid, Islamic education, and community services." },
  { key: "home", year: "2020", title: "A home of our own", body: "On July 30, 2020 the community acquires 4269 Limebank Rd for CA$665,000 — an extraordinary act of collective giving through donations and an interest-free Qard-e-Hasan." },
  { key: "worship", year: "2021", title: "Doors open for worship", body: "Five daily prayers in congregation, Jumu'ah with two khutbahs, and the community's first Taraweeh at home in Ramadhan 1442." },
  { key: "knowledge", year: "2025", title: "A house of knowledge", body: "Al-Arif Islamic Institute launches the Aalim program and full-time Hifz under Mufti Taqi, joining the weekday madrasa, KidsLearnArabic and WeLearn online." },
  { key: "today", year: "Today", title: "Building, together", body: "The masjid carries ~$6,000/month in running costs and a $144K community loan. Sixty dollars a family, every month, finishes what we started — a destination for the National Capital Region and Canada at large, insha'Allah.", progressPct: 42 },
] as const;

const THEMES: Record<string, { accent: string; accentSoft: string; tag: string }> = {
  founding: { accent: "#e3c56a", accentSoft: "rgba(227,197,106,0.16)", tag: "Est. 2019 · Incorporated" },
  home: { accent: "#f3d98a", accentSoft: "rgba(243,217,138,0.16)", tag: "Property acquired" },
  worship: { accent: "#a9e0c0", accentSoft: "rgba(169,224,192,0.16)", tag: "Five daily prayers" },
  knowledge: { accent: "#8ec7ff", accentSoft: "rgba(142,199,255,0.14)", tag: "Al-Arif Islamic Institute" },
  today: { accent: "#e88a6a", accentSoft: "rgba(232,138,106,0.16)", tag: "In progress" },
};

function Badge({ milestoneKey, accent, progressPct }: { milestoneKey: string; accent: string; progressPct: number }) {
  if (milestoneKey === "founding") {
    return (
      <div style={{ position: "relative", width: 20, height: 20 }}>
        <div style={{ position: "absolute", left: 0, top: 3, width: 11, height: 11, borderRadius: 999, background: "#e3c56a" }} />
        <div style={{ position: "absolute", left: 3, top: 0.5, width: 12, height: 12, borderRadius: 999, background: "#173626" }} />
        <div style={{ position: "absolute", right: 1, top: 2, width: 1, height: 5, background: "#c9a227" }} />
        <div style={{ position: "absolute", right: -1, top: 6.5, width: 6, height: 7, borderRadius: 2, background: "linear-gradient(160deg, #e3c56a, #c9a227)" }} />
        <div style={{ position: "absolute", right: 1.3, top: 8.5, width: 3.4, height: 4, background: "#fff3c4", borderRadius: 1, opacity: 0.85 }} />
      </div>
    );
  }
  if (milestoneKey === "home") {
    return (
      <div style={{ position: "relative", width: 20, height: 20 }}>
        <div style={{ position: "absolute", top: 0, left: 6, width: 13, height: 13, borderRadius: 999, border: `2.4px solid ${accent}` }} />
        <div style={{ position: "absolute", top: 11, left: 11, width: 3, height: 12, background: accent }} />
        <div style={{ position: "absolute", top: 18, left: 14, width: 5, height: 2.4, background: accent }} />
      </div>
    );
  }
  if (milestoneKey === "worship") {
    return (
      <div style={{ position: "relative", width: 18, height: 20 }}>
        <div style={{ position: "absolute", bottom: 0, width: 18, height: 20, borderRadius: "9px 9px 0 0", border: `2px solid ${accent}`, borderBottom: "none" }} />
      </div>
    );
  }
  if (milestoneKey === "knowledge") {
    return (
      <div style={{ position: "relative", width: 20, height: 14 }}>
        <div style={{ position: "absolute", left: 0, width: 10, height: 14, borderRadius: "2px 0 0 2px", border: `1.6px solid ${accent}`, transform: "skewY(-4deg)" }} />
        <div style={{ position: "absolute", right: 0, width: 10, height: 14, borderRadius: "0 2px 2px 0", border: `1.6px solid ${accent}`, transform: "skewY(4deg)" }} />
      </div>
    );
  }
  // today
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: `conic-gradient(${accent} 0% ${progressPct}%, rgba(246,243,234,0.14) ${progressPct}% 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: 999, background: "#173626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 700, color: accent }}>{progressPct}%</div>
    </div>
  );
}

function MilestoneRow({ m, index, activeIdx }: { m: (typeof MILESTONES)[number]; index: number; activeIdx: number }) {
  const isLeft = index % 2 === 0;
  const t = THEMES[m.key];
  const ref = React.useRef<HTMLDivElement>(null);
  const isDotActive = activeIdx >= index;

  return (
    <div ref={ref} data-milestone-idx={index} style={{ position: "relative", minHeight: 150, marginBottom: 56 }}>
      <div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 15,
          height: 15,
          borderRadius: 999,
          zIndex: 3,
          background: isDotActive ? "#e3c56a" : "#173626",
          border: isDotActive ? "2px solid #0e2419" : "2px solid rgba(201,162,39,0.4)",
          boxShadow: isDotActive ? "0 0 0 5px rgba(227,197,106,0.18), 0 0 16px 2px rgba(227,197,106,0.5)" : undefined,
          transition: "background .3s ease, box-shadow .3s ease",
        }}
      />
      <div style={{ width: "calc(50% - 40px)", marginRight: isLeft ? "calc(50% + 40px)" : undefined, marginLeft: !isLeft ? "calc(50% + 40px)" : undefined, textAlign: isLeft ? "right" : "left" }}>
        <motion.div
          initial={{ opacity: 0, y: 24, x: isLeft ? -16 : 16 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
          style={{
            position: "relative",
            display: "inline-block",
            textAlign: "left",
            padding: "28px 28px 26px",
            maxWidth: 420,
            borderRadius: 18,
            background: "linear-gradient(155deg, rgba(22,56,38,0.72), rgba(13,35,24,0.58))",
            border: "1px solid rgba(201,162,39,0.22)",
            borderTop: `3px solid ${t.accent}`,
            boxShadow: "0 16px 40px -20px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ position: "absolute", top: 22, right: 22, width: 44, height: 44, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: t.accentSoft, border: `1.5px solid ${t.accent}` }}>
            <Badge milestoneKey={m.key} accent={t.accent} progressPct={"progressPct" in m ? m.progressPct : 0} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, paddingRight: 56 }}>
            {m.key === "today" && <span className="da-live-pulse" style={{ width: 6, height: 6, borderRadius: 999, background: t.accent, flexShrink: 0 }} />}
            <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: t.accent, fontWeight: 800 }}>{t.tag}</span>
          </div>

          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(30px,3.6vw,40px)", color: t.accent, lineHeight: 1, marginBottom: 10 }}>{m.year}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#f6f3ea", marginBottom: 10 }}>{m.title}</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(246,243,234,0.72)", margin: 0 }}>{m.body}</p>

          {m.key === "today" && "progressPct" in m && (
            <>
              <div style={{ marginTop: 16, height: 6, borderRadius: 999, background: "rgba(246,243,234,0.12)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${m.progressPct}%`, borderRadius: 999, background: `linear-gradient(90deg, #c9a227, ${t.accent})` }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "rgba(246,243,234,0.5)" }}>$144K community loan · $6,000/mo running costs</div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function YearIndicator({ timelineRef }: { timelineRef: React.RefObject<HTMLDivElement | null> }) {
  const [fraction, setFraction] = React.useState(0);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    function update() {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      const frac = total > 0 ? scrolled / total : 0;
      const iv = rect.top < vh && rect.bottom > 0;
      let idx = Math.min(MILESTONES.length - 1, Math.floor(frac * MILESTONES.length));
      if (frac <= 0) idx = 0;
      setFraction(frac);
      setActiveIdx(idx);
      setInView(iv);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [timelineRef]);

  const pct = Math.round(Math.min(Math.max(fraction, 0), 1) * 100);
  const visible = inView && fraction > 0.015;

  return (
      <div
        className="da-year-indicator"
        style={{
          position: "fixed",
          top: "50%",
          right: 28,
          transform: "translateY(-50%)",
          zIndex: 25,
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          padding: "16px 14px",
          borderRadius: 16,
          background: "rgba(14,36,25,0.85)",
          backdropFilter: "blur(10px) saturate(140%)",
          border: "1px solid rgba(201,162,39,0.3)",
          boxShadow: "0 14px 30px -10px rgba(0,0,0,0.5)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity .3s ease",
        }}
      >
        <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(246,243,234,0.45)", fontWeight: 700 }}>Year</span>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600, color: "#e3c56a", lineHeight: 1, minWidth: 60, textAlign: "center" }}>{MILESTONES[activeIdx].year}</span>
        <div style={{ width: 3, height: 120, borderRadius: 999, background: "rgba(201,162,39,0.18)", position: "relative", overflow: "hidden", marginTop: 4 }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", background: "linear-gradient(180deg, #e3c56a, #c9a227)", borderRadius: 999, transition: "height .2s ease", height: `${pct}%` }} />
        </div>
      </div>
  );
}

function SpineFill({ fraction }: { fraction: number }) {
  const f = Math.min(Math.max(fraction, 0), 1);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", background: "linear-gradient(180deg, #e3c56a, #c9a227)", transformOrigin: "top", transform: `scaleY(${f})`, height: "100%", transition: "transform .15s linear" }} />
  );
}

export function StoryPage() {
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    function update() {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      const frac = total > 0 ? scrolled / total : 0;
      let idx = Math.min(MILESTONES.length - 1, Math.floor(frac * MILESTONES.length));
      if (frac <= 0) idx = 0;
      setActiveIdx(idx);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      <div className="da-drift-gold" style={{ position: "fixed", width: 480, height: 480, borderRadius: 999, top: "-10%", right: "-8%", background: "radial-gradient(circle, rgba(201,162,39,0.16), transparent 70%)", filter: "blur(10px)", mixBlendMode: "screen", zIndex: 1, pointerEvents: "none" }} />
      <div className="da-drift-green" style={{ position: "fixed", width: 560, height: 560, borderRadius: 999, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.2), transparent 72%)", filter: "blur(10px)", mixBlendMode: "screen", zIndex: 1, pointerEvents: "none" }} />

      <div style={{ position: "absolute", top: 40, left: "10%", zIndex: 1, pointerEvents: "none" }}>
        <CrescentMoon size={60} glowSize={0} glowOpacity={0} />
      </div>
      <Twinkle top="90px" left="24%" duration={2.6} />
      <Twinkle top="150px" left="84%" duration={3.1} delay={0.5} />
      <div style={{ position: "absolute", top: "44%", left: "6%", width: 220, height: 220, zIndex: 1, pointerEvents: "none", opacity: 0.32 }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(201,162,39,0.18)" }} />
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(201,162,39,0.18)", transform: "rotate(45deg)" }} />
      </div>
      <div style={{ position: "absolute", top: "78%", right: "4%", width: 200, height: 200, zIndex: 1, pointerEvents: "none", opacity: 0.3 }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(120,190,150,0.18)" }} />
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(120,190,150,0.18)", transform: "rotate(45deg)" }} />
      </div>

      <div style={{ position: "absolute", top: "34%", right: "8%", zIndex: 1, pointerEvents: "none" }}>
        <CrescentMoon size={46} glowSize={0} glowOpacity={0} />
      </div>
      <Twinkle top="30%" left="97%" duration={2.8} delay={0.4} />
      <Twinkle top="38%" left="86%" size={3} duration={3.2} delay={1} />
      <Twinkle top="55%" left="5%" duration={2.5} delay={0.2} />
      <Twinkle top="60%" left="11%" size={3} duration={3} delay={0.9} />

      <div style={{ position: "absolute", top: "88%", left: "9%", zIndex: 1, pointerEvents: "none" }}>
        <CrescentMoon size={42} glowSize={0} glowOpacity={0} />
      </div>
      <Twinkle top="92%" left="20%" duration={2.9} delay={0.6} />
      <Twinkle top="95%" left="84%" size={3} duration={2.6} delay={1.2} />
      <Twinkle top="90%" left="74%" duration={3.4} delay={0.3} />
      <div style={{ position: "absolute", top: "96%", left: -90, width: 230, height: 230, zIndex: 1, pointerEvents: "none", opacity: 0.3 }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(201,162,39,0.18)" }} />
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(201,162,39,0.18)", transform: "rotate(45deg)" }} />
      </div>

      <YearIndicator timelineRef={timelineRef} />

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "74px 24px 50px", textAlign: "center", background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,162,39,0.10), transparent 70%)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700, marginBottom: 14 }}>Darul Arqum · Ottawa</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(34px,4.8vw,56px)", lineHeight: 1.08, color: "#f6f3ea", margin: "0 0 20px 0" }}>Our story</h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "rgba(246,243,234,0.68)", margin: "0 auto", maxWidth: 560 }}>From a handful of Riverside South families to a home of worship and learning — scroll to watch it unfold, year by year.</p>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "20px 24px 110px" }}>
        <div ref={timelineRef} style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: 2, background: "rgba(201,162,39,0.18)" }}>
            <SpineFillTracked timelineRef={timelineRef} />
          </div>
          {MILESTONES.map((m, i) => (
            <MilestoneRow key={m.key} m={m} index={i} activeIdx={activeIdx} />
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "10px 24px 110px", textAlign: "center" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            maxWidth: 640,
            margin: "0 auto",
            padding: "48px 36px",
            borderRadius: 24,
            background: "radial-gradient(ellipse 90% 120% at 50% 0%, rgba(201,162,39,0.16), transparent 70%), linear-gradient(155deg, rgba(22,56,38,0.7), rgba(13,35,24,0.55))",
            border: "1px solid rgba(201,162,39,0.3)",
            boxShadow: "0 24px 60px -28px rgba(0,0,0,0.55)",
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52, margin: "0 auto 18px", borderRadius: 999, background: "rgba(201,162,39,0.16)", border: "1.5px solid rgba(227,197,106,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 24, height: 24 }}>
              <div style={{ position: "absolute", left: 0, top: 4, width: 13, height: 13, borderRadius: 999, background: "#e3c56a" }} />
              <div style={{ position: "absolute", left: 3.5, top: 1, width: 14, height: 14, borderRadius: 999, background: "#17331f" }} />
              <div style={{ position: "absolute", right: 1, top: 2, width: 1.2, height: 6, background: "#c9a227" }} />
              <div style={{ position: "absolute", right: -1, top: 8, width: 7, height: 8.5, borderRadius: 2.5, background: "linear-gradient(160deg, #e3c56a, #c9a227)" }} />
              <div style={{ position: "absolute", right: 1.6, top: 10.3, width: 4, height: 4.8, background: "#fff3c4", borderRadius: 1, opacity: 0.85 }} />
            </div>
          </div>
          <div style={{ position: "relative", fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 28, color: "#f6f3ea", marginBottom: 12 }}>The next chapter is still being written</div>
          <p style={{ position: "relative", fontSize: 14.5, lineHeight: 1.65, color: "rgba(246,243,234,0.7)", margin: "0 0 24px 0", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            Every family that joins, gives, or teaches adds another line to this story.
          </p>
          <Link href="/give/pledge" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 9, background: "#c9a227", color: "#0e2419", fontWeight: 600, fontSize: 14.5, padding: "13px 28px", borderRadius: 999 }}>
            Help write it →
          </Link>
        </div>
      </section>
    </div>
  );
}

function SpineFillTracked({ timelineRef }: { timelineRef: React.RefObject<HTMLDivElement | null> }) {
  const [fraction, setFraction] = React.useState(0);
  React.useEffect(() => {
    function update() {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      setFraction(total > 0 ? scrolled / total : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [timelineRef]);
  return <SpineFill fraction={fraction} />;
}
