"use client";

/**
 * Literal, line-for-line port of `Darul Arqum Home.dc.html` — every section,
 * color, animation and interaction transcribed directly from the source
 * (not reinterpreted through a shared design system). The only addition
 * beyond the source is the site footer (the source has none).
 */

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { R } from "@/lib/links";

const GREETINGS: { text: string; lang?: "ar" }[] = [
  { text: "السَّلَامُ عَلَيْكُمْ", lang: "ar" },
  { text: "Assalamu Alaikum" },
  { text: "Peace be upon you" },
  { text: "أَهْلًا وَسَهْلًا", lang: "ar" },
  { text: "Welcome to Darul Arqum" },
];

type ProgramKey = "aalim" | "hifz" | "quran" | "kids" | "welearn";

const PROGRAM_INFO: Record<ProgramKey, { eyebrow: string; title: string; lede: string; body: string; logistics: string; zoomUrl?: string }> = {
  aalim: {
    eyebrow: "Al-Arif Islamic Institute",
    title: "Aalim program",
    lede: "Led by Mufti Taqi — trained in jurisprudence, Hadith, Tafsir and Arabic — Al-Arif Madrasa pairs academic excellence with spiritual grounding.",
    body: "Structured classical studies: Sarf & Nahw, Quran, Hadith, Fiqh and Aqa'id — a full academic path toward becoming a scholar of Islamic sciences.",
    logistics: "Full-time program, Monday–Friday, on site at Darul Arqum · $150/month.",
  },
  hifz: {
    eyebrow: "Al-Arif Islamic Institute",
    title: "Quran Hifz",
    lede: "A dedicated, full-time track for students pursuing memorization of the Quran as their primary focus, under Mufti Taqi.",
    body: "Structured daily hours for revision and new memorization, paired with tajweed correction and continuous assessment, until the Quran is completed and preserved by heart.",
    logistics: "Full-time program, Monday–Friday, on site at Darul Arqum · $75/month.",
  },
  quran: {
    eyebrow: "Weekend madrasa · ages 6+",
    title: "Weekend Quran classes",
    lede: "Building recitation, memorization, and character — one structured track at a time.",
    body: "Students progress through five tracks: Nazira (reading), Hifz (memorization), Deeniyaat (Islamic studies), Akhlaqiat (character) and Seerah.",
    logistics: "Saturday & Sunday, at the masjid · $50/month.",
  },
  kids: {
    eyebrow: "Ages 5–10",
    title: "KidsLearnArabic",
    lede: "A dedicated Arabic track for young learners — playful, structured, and rooted in the language of the Quran.",
    body: "Children aged 5–10 build letters, sounds, vocabulary and confidence in a nurturing environment at the masjid, taught by teachers experienced with young learners.",
    logistics: "Ages 5–10, on site at Darul Arqum.",
  },
  welearn: {
    eyebrow: "Online · Zoom",
    title: "welearn",
    lede: "Live online Islamic learning from Darul Arqum with Sheikh Saud Hasan — join the class over Zoom from anywhere.",
    body: "Sessions run live — no software beyond Zoom needed. Class announcements, schedule changes and recordings are shared through the community WhatsApp group.",
    logistics: "Live over Zoom — link shared with registered students.",
    zoomUrl: "https://zoom.us/j/93194466159",
  },
};

const PROGRAM_ACCENT: Record<ProgramKey, string> = { aalim: "#c9a227", hifz: "#d98f4a", quran: "#d98f4a", kids: "#7cc99a", welearn: "#8fb4c9" };
const PROGRAM_ACCENT_SOFT: Record<ProgramKey, string> = { aalim: "rgba(201,162,39,0.16)", hifz: "rgba(217,143,74,0.16)", quran: "rgba(217,143,74,0.16)", kids: "rgba(124,201,154,0.16)", welearn: "rgba(143,180,201,0.16)" };
const PROGRAM_MODAL_BG: Record<ProgramKey, string> = {
  aalim: "linear-gradient(165deg, #1a2e1c, #122d20)",
  hifz: "linear-gradient(165deg, #2e2216, #122d20)",
  quran: "linear-gradient(165deg, #2a2116, #122d20)",
  kids: "linear-gradient(165deg, #16302a, #122d20)",
  welearn: "linear-gradient(165deg, #16222e, #122d20)",
};

/* ── small shared decorative bits ─────────────────────────────── */

function Twinkle({ top, left, size = 2, delay = 0, duration = 2.6 }: { top: string; left: string; size?: number; delay?: number; duration?: number }) {
  return (
    <div
      aria-hidden
      className="da-twinkle absolute rounded-full bg-[#f6f3ea]"
      style={{ width: size, height: size, top, left, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
    />
  );
}

function ShootingStar({ top, left, delay, duration }: { top: string; left: string; delay: number; duration: number }) {
  return (
    <div
      aria-hidden
      className="absolute rounded-full bg-[#f6f3ea]"
      style={{
        top,
        left,
        width: 2,
        height: 2,
        boxShadow: "0 0 6px 1px rgba(246,243,234,0.8)",
        animation: `da-shooting-star ${duration}s linear infinite ${delay}s`,
      }}
    />
  );
}

function CrescentMoon({ size, glowSize, glowOpacity = 0.3 }: { size: number; glowSize: number; glowOpacity?: number }) {
  return (
    <div style={{ position: "absolute", width: glowSize + size, height: glowSize + size, display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden>
      <div
        className="da-moon-glow absolute rounded-full"
        style={{ width: glowSize, height: glowSize, background: `radial-gradient(circle, rgba(201,162,39,${glowOpacity}), transparent 70%)` }}
      />
      <div style={{ position: "relative", width: size, height: size, borderRadius: 999, overflow: "hidden", boxShadow: `0 0 ${size * 0.7}px ${size * 0.1}px rgba(227,197,106,0.4)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#e3c56a" }} />
        <div style={{ position: "absolute", top: -size * 0.11, left: size * 0.28, width: size, height: size * 1.2, borderRadius: 999, background: "#0a1a12" }} />
      </div>
    </div>
  );
}

function Lantern({
  stringHeight,
  bodyW,
  bodyH,
  glowSize,
  sway = 5,
  swayDelay = 0,
  glowDur = 2.8,
  glowDelay = 0,
  dropAnim,
}: {
  stringHeight: number;
  bodyW: number;
  bodyH: number;
  glowSize: number;
  sway?: number;
  swayDelay?: number;
  glowDur?: number;
  glowDelay?: number;
  dropAnim?: string;
}) {
  return (
    <div style={dropAnim ? { animation: dropAnim } : undefined} aria-hidden>
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: `da-lantern-sway ${sway}s ease-in-out infinite`, animationDelay: `${swayDelay}s`, transformOrigin: "top center" }}
      >
        <div style={{ width: 1.5, height: stringHeight, background: "rgba(201,162,39,0.4)" }} />
        <div
          className="da-lantern-glow"
          style={{ position: "absolute", top: stringHeight - 10, width: glowSize, height: glowSize, borderRadius: 999, background: "rgba(227,197,106,0.5)", filter: "blur(16px)", animationDelay: `${glowDelay}s` }}
        />
        <div style={{ position: "relative", width: bodyW, height: bodyH }}>
          <div style={{ position: "absolute", top: 0, left: bodyW * 0.21, width: bodyW * 0.58, height: bodyH * 0.15, background: "#c9a227", borderRadius: "3px 3px 0 0" }} />
          <div
            style={{
              position: "absolute",
              top: bodyH * 0.13,
              left: bodyW * 0.05,
              width: bodyW * 0.89,
              height: bodyH * 0.65,
              borderRadius: 8,
              background: "linear-gradient(160deg, #e3c56a, #c9a227)",
              boxShadow: "0 0 18px 2px rgba(227,197,106,0.5)",
            }}
          />
          <div style={{ position: "absolute", top: bodyH * 0.27, left: bodyW * 0.32, width: bodyW * 0.37, height: bodyH * 0.38, background: "#fff3c4", borderRadius: 3, opacity: 0.85 }} />
          <div style={{ position: "absolute", bottom: 0, left: bodyW * 0.37, width: bodyW * 0.26, height: bodyH * 0.12, background: "#8a6a1e", borderRadius: "0 0 3px 3px" }} />
        </div>
      </div>
    </div>
  );
}

function GeoMedallion({ size, opacity = 0.16 }: { size: number; opacity?: number }) {
  return (
    <div className="da-spin-slow" style={{ position: "absolute", width: size, height: size, opacity }} aria-hidden>
      <div style={{ position: "absolute", inset: 0, border: "1.5px solid #e3c56a", borderRadius: 999 }} />
      <div style={{ position: "absolute", inset: size * 0.13, border: "1.5px solid #e3c56a" }} />
      <div style={{ position: "absolute", inset: size * 0.13, border: "1.5px solid #e3c56a", transform: "rotate(45deg)" }} />
    </div>
  );
}

/* ── Greeting splash ──────────────────────────────────────────── */

const SPLASH_TWINKLES = [
  { top: "14%", left: "18%", duration: 2.4, delay: 0 },
  { top: "22%", left: "32%", duration: 3.1, delay: 0.4 },
  { top: "10%", left: "62%", duration: 2.8, delay: 0.8 },
  { top: "30%", left: "74%", duration: 2.2, delay: 1.1 },
  { top: "66%", left: "12%", duration: 2.6, delay: 0.3 },
  { top: "74%", left: "82%", duration: 3.4, delay: 0.6 },
  { top: "46%", left: "88%", duration: 2.9, delay: 0.2 },
  { top: "55%", left: "6%", duration: 2.3, delay: 0.9 },
  { top: "38%", left: "44%", duration: 3.2, delay: 1.4 },
  { top: "82%", left: "48%", duration: 2.5, delay: 0.5 },
];

export type IntroPhase = "intro" | "reveal" | "done";

/**
 * `skipIntro` comes from the server (a cookie check in app/page.tsx), so the
 * very first paint already reflects the right answer — no flash of the
 * splash on refresh for a visitor who already saw it this session. A
 * client-only sessionStorage check can't do this: the server-rendered HTML
 * (and therefore the browser's first paint) is always produced before any
 * client JS runs, so it would show the splash for a frame every time
 * regardless of what a layout effect decides afterward.
 */
export function useIntroPhase(skipIntro: boolean) {
  const [phase, setPhase] = React.useState<IntroPhase>(skipIntro ? "done" : "intro");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (skipIntro) return;
    document.cookie = "da-intro-seen=1; path=/; SameSite=Lax";
    const hold = 1050;
    const timers = GREETINGS.map((_, i) => window.setTimeout(() => setIndex(i), i * hold));
    timers.push(window.setTimeout(() => setPhase("reveal"), GREETINGS.length * hold));
    timers.push(window.setTimeout(() => setPhase("done"), GREETINGS.length * hold + 900));
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { phase, index };
}

function GreetingSplash({ phase, index }: { phase: IntroPhase; index: number }) {
  if (phase === "done") return null;
  const current = GREETINGS[index];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#070f0b",
        opacity: phase === "reveal" ? 0 : 1,
        transition: "opacity 0.85s ease",
        pointerEvents: phase === "reveal" ? "none" : "auto",
      }}
    >
      {SPLASH_TWINKLES.map((s, i) => (
        <Twinkle key={i} top={s.top} left={s.left} size={i % 3 === 0 ? 3 : 2} delay={s.delay} duration={s.duration} />
      ))}
      <ShootingStar top="16%" left="78%" delay={1.2} duration={3.6} />
      <ShootingStar top="36%" left="88%" delay={3} duration={4.4} />

      <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)" }}>
        <CrescentMoon size={56} glowSize={150} glowOpacity={0.35} />
      </div>

      <div style={{ position: "absolute", left: "8%", top: 0, animation: "da-lantern-drop 1.4s cubic-bezier(.25,.85,.35,1) 1 forwards" }}>
        <Lantern stringHeight={120} bodyW={38} bodyH={52} glowSize={60} sway={4.6} swayDelay={1.4} />
      </div>
      <div style={{ position: "absolute", right: "8%", top: 0, animation: "da-lantern-drop-b 1.6s cubic-bezier(.25,.85,.35,1) 1 forwards 0.15s" }}>
        <Lantern stringHeight={170} bodyW={32} bodyH={44} glowSize={52} sway={4} swayDelay={1.75} />
      </div>

      <div
        key={index}
        dir="auto"
        style={{
          position: "relative",
          zIndex: 2,
          color: "#f6f3ea",
          textAlign: "center",
          padding: "0 24px",
          animation: "da-greet-fade 0.5s ease both",
          ...(current.lang === "ar"
            ? { fontFamily: "'Amiri',serif", fontSize: "clamp(38px,6vw,64px)" }
            : { fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" as const, fontSize: "clamp(30px,4.4vw,48px)" }),
        }}
      >
        {current.text}
      </div>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */

function Hero({ revealed }: { revealed: boolean }) {
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hero-house.jpg"
          alt="Darul Arqum masjid house"
          className="da-kenburns"
          style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "center", filter: "saturate(0.75) brightness(0.78) blur(2.5px)" }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,26,18,0.45)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,24,17,0.93) 0%, rgba(13,34,24,0.88) 38%, rgba(14,40,27,0.95) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 55% at 22% 30%, rgba(20,60,42,0.5), transparent 70%)" }} />

      <div className="da-drift-gold" style={{ position: "absolute", width: 520, height: 520, borderRadius: 999, top: "-8%", right: "6%", background: "radial-gradient(circle, rgba(201,162,39,0.20), transparent 70%)", filter: "blur(10px)", mixBlendMode: "screen" }} />
      <div className="da-drift-green" style={{ position: "absolute", width: 640, height: 640, borderRadius: 999, bottom: "-14%", left: "-6%", background: "radial-gradient(circle, rgba(60,140,100,0.28), transparent 72%)", filter: "blur(10px)", mixBlendMode: "screen" }} />

      <Twinkle top="12%" left="56%" duration={2.6} />
      <Twinkle top="20%" left="70%" duration={3.1} delay={0.4} />
      <Twinkle top="9%" left="84%" size={3} duration={2.4} delay={0.8} />
      <Twinkle top="30%" left="92%" duration={2.8} delay={1.1} />
      <Twinkle top="6%" left="66%" duration={3.4} delay={0.3} />
      <Twinkle top="40%" left="78%" duration={2.9} delay={0.6} />
      <ShootingStar top="14%" left="88%" delay={1.5} duration={5.5} />
      <ShootingStar top="32%" left="96%" delay={4} duration={6.5} />

      <div style={{ position: "absolute", top: "6%", right: "9%", width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, pointerEvents: "none" }}>
        <CrescentMoon size={46} glowSize={120} />
      </div>

      <div style={{ position: "absolute", right: "5%", top: 0, zIndex: 1, pointerEvents: "none" }}>
        <Lantern stringHeight={150} bodyW={32} bodyH={44} glowSize={52} sway={5} glowDur={2.8} />
      </div>
      <div style={{ position: "absolute", right: "16%", top: 0, zIndex: 1, pointerEvents: "none" }}>
        <Lantern stringHeight={210} bodyW={26} bodyH={36} glowSize={42} sway={4.4} swayDelay={0.5} glowDelay={0.4} />
      </div>

      <div style={{ position: "absolute", bottom: "-8%", right: "-6%", zIndex: 1, pointerEvents: "none" }}>
        <GeoMedallion size={340} />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1320,
          margin: "0 auto",
          width: "100%",
          padding: "150px 28px 90px",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(18px)",
          transition: revealed ? "opacity 1s ease 0.1s, transform 1s ease 0.1s" : undefined,
        }}
      >
        <div style={{ maxWidth: 820 }}>
          <motion.div
            id="hero-logo"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}
          >
            <span style={{ width: 46, height: 46, borderRadius: 10, overflow: "hidden", background: "#f6f3ea", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-icon.png" alt="Darul Arqum emblem" style={{ width: "84%", height: "84%", objectFit: "contain", display: "block" }} />
            </span>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: "#f6f3ea", letterSpacing: "0.01em" }}>Darul Arqum</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.03 }} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
            <span style={{ width: 26, height: 1, background: "rgba(201,162,39,0.6)" }} />
            <span style={{ fontSize: 12.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 600 }}>Riverside South Muslim Community Association</span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.05 }} dir="rtl" lang="ar" style={{ fontFamily: "'Amiri',serif", fontSize: 26, textAlign: "left", color: "rgba(246,243,234,0.85)", margin: "0 0 18px 0" }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(40px,6vw,74px)", lineHeight: 1.05, color: "#f6f3ea", margin: "0 0 26px 0", maxWidth: 820 }}
          >
            A house of Allah rising in <span style={{ color: "#c9a227", fontStyle: "italic" }}>Riverside South.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.16 }} style={{ fontSize: 17, lineHeight: 1.65, color: "rgba(246,243,234,0.78)", maxWidth: 560, margin: "0 0 40px 0" }}>
            The first masjid in the community — 4269 Limebank Rd, Ottawa. Acquired by its people in 2020, sustained by its people every month since. Let&apos;s build it together.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.22 }} style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 56 }}>
            <a
              href="#programs-section"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("da:scroll-highlight", { detail: { id: "programs-section" } }));
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#c9a227", color: "#0e2419", fontWeight: 600, fontSize: 15, padding: "15px 28px", borderRadius: 999 }}
            >
              Programs &amp; news <span aria-hidden="true">→</span>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.28 }} style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {[
              { title: "Jumu'ah", sub: "1:30 PM & 2:30 PM" },
              { title: "Daily prayers", sub: "In congregation, every day", href: R.prayer },
              { title: "CRA charity", sub: "709549687RR0001", mono: true },
            ].map((c) => {
              const cardStyle: React.CSSProperties = {
                flex: "1 1 220px",
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "16px 18px",
                borderRadius: 12,
                background: "rgba(246,243,234,0.045)",
                border: "1px solid rgba(246,243,234,0.12)",
                transition: "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
              };
              const inner = (
                <>
                  <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 999, background: "rgba(201,162,39,0.16)", border: "1px solid rgba(201,162,39,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f6f3ea", fontSize: 14 }}>
                    ✦
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f6f3ea", marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 12.5, color: "rgba(246,243,234,0.62)", fontFamily: c.mono ? "monospace" : undefined }}>{c.sub}</div>
                  </div>
                  {"href" in c && c.href && (
                    <span style={{ marginLeft: "auto", color: "#e3c56a", fontSize: 15, flexShrink: 0 }} aria-hidden="true">
                      →
                    </span>
                  )}
                </>
              );
              if ("href" in c && c.href) {
                return (
                  <Link
                    key={c.title}
                    href={c.href}
                    className="da-stat-card-link"
                    style={cardStyle}
                  >
                    {inner}
                  </Link>
                );
              }
              return (
                <div key={c.title} style={cardStyle}>
                  {inner}
                </div>
              );
            })}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.34 }} style={{ marginTop: 14 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 13, padding: "16px 18px", borderRadius: 12, background: "rgba(201,162,39,0.07)", border: "1px solid rgba(201,162,39,0.25)" }}>
              <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 999, background: "rgba(201,162,39,0.16)", border: "1px solid rgba(201,162,39,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={16} height={13} viewBox="0 0 26 18" aria-hidden>
                  <rect x={1} y={1} width={24} height={16} rx={2.5} fill="none" stroke="#e3c56a" strokeWidth={1.8} />
                  <path d="M1.5 2.5 L13 11 L24.5 2.5" fill="none" stroke="#e3c56a" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: "1 1 240px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f6f3ea", marginBottom: 2 }}>Don&apos;t miss what&apos;s next</div>
                <div style={{ fontSize: 12.5, color: "rgba(246,243,234,0.62)" }}>Programs, fundraising milestones &amp; masjid news — a few times a year.</div>
              </div>
              <Link
                href={R.newsletters}
                style={{ flexShrink: 0, fontSize: 12.5, fontWeight: 600, color: "#e3c56a", padding: "8px 6px", whiteSpace: "nowrap" }}
              >
                Subscribe →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { GREETINGS, PROGRAM_INFO, PROGRAM_ACCENT, PROGRAM_ACCENT_SOFT, PROGRAM_MODAL_BG, Twinkle, ShootingStar, CrescentMoon, Lantern, GeoMedallion, GreetingSplash, Hero };
export type { ProgramKey };
