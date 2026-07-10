"use client";

/** Per-program hero illustrations + decorative backdrops for the four
 * registration pages. Aalim/Quran Class share a photo-band pattern; Hifz gets
 * a hand-built Quran-cover illustration; Kids gets a chalkboard hero. */

import { SafeImage } from "@/components/site/safe-image";
import { DaAmbient, CrescentLantern, Twinkles } from "@/components/site/da-motifs";

/* ── Aalim / Quran Class: photo band ─────────────────────────── */

export function PhotoBandHero({ alt, src = "" }: { alt: string; src?: string }) {
  return (
    <div className="relative h-[280px] overflow-hidden rounded-2xl">
      <SafeImage src={src} alt={alt} className="h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(9,20,15,0.55) 0%, rgba(9,20,15,0.75) 55%, #0e2419 100%)" }}
      />
    </div>
  );
}

/* ── Hifz: hand-built Qur'an cover illustration ──────────────── */

export function HifzHero() {
  return (
    <div
      className="relative h-[280px] overflow-hidden rounded-2xl p-3.5"
      style={{ background: "linear-gradient(180deg,#4a3320,#2e2013)" }}
    >
      <div
        className="relative flex h-full items-center justify-center rounded-md"
        style={{ background: "radial-gradient(ellipse 120% 100% at 50% 15%, #3a2a17, #201509 75%)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)" }}
      >
        <span className="absolute left-6 top-5 text-xs text-da-gold/40">✦</span>
        <span className="absolute right-8 top-10 text-xs text-da-gold/30">✦</span>

        <div className="relative h-[190px] w-[132px]">
          <div className="absolute -right-1.5 h-full w-full rounded-[3px]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #e9cd7a 0 2px, #cda84f 2px 3px)" }} />
          <div className="relative h-full w-full rounded-[3px] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.6)]" style={{ background: "linear-gradient(155deg, #0e3324, #081f17 75%)" }}>
            <div className="absolute inset-[9px] rounded-[2px] border border-[#cda84f]" />
            <div className="absolute inset-[12px] rounded-[2px] border border-[#cda84f]/60" />

            <svg viewBox="0 0 150 50" className="absolute left-1/2 top-3 w-[85%] -translate-x-1/2">
              <path id="hifzArc" d="M 12 40 Q 75 4 138 40" fill="none" />
              <text fontSize="15" fontWeight="700" fill="#e9cd7a" fontFamily="Amiri, serif">
                <textPath href="#hifzArc" startOffset="50%" textAnchor="middle">
                  القرآن الكريم
                </textPath>
              </text>
            </svg>

            <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-[#cda84f] px-4 py-3 text-center" style={{ boxShadow: "inset 0 0 0 3px rgba(205,168,79,0.35)" }}>
              <p className="font-arabic text-lg text-[#e9cd7a]">القرآن</p>
            </div>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-[0.2em] text-[#e9cd7a]/80">
              Al-Qur&apos;an Al-Kareem
            </p>

            {/* tasbih beads */}
            <div className="absolute -right-3 top-6 flex rotate-[30deg] gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="h-2 w-2 rounded-full" style={{ background: i % 2 ? "#4aa86c" : "#3f9760" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] tracking-wide text-da-cream/50">
        Hifz · Memorizing the Qur&apos;an
      </p>
    </div>
  );
}

/* ── Kids: chalkboard hero ────────────────────────────────────── */

export function KidsHero() {
  return (
    <div className="relative h-[280px] overflow-hidden rounded-2xl p-3.5" style={{ background: "linear-gradient(180deg,#4a3320,#2e2013)" }}>
      <div
        className="relative flex h-full flex-col items-center justify-center rounded-md"
        style={{ background: "radial-gradient(ellipse 120% 100% at 30% 20%, #24382c, #16241c 70%)" }}
      >
        <span className="absolute left-8 top-6 text-sm text-da-cream/20">✦</span>
        <span className="absolute right-10 top-10 text-sm text-da-cream/15">✦</span>
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic font-bold text-da-cream/90"
          style={{ fontSize: "clamp(48px,8vw,72px)", textShadow: "0 0 24px rgba(246,243,234,0.25)" }}
        >
          العربية
        </p>
        <svg viewBox="0 0 216 12" className="mt-1 w-40">
          <path d="M4 8 Q 60 2, 110 7 T 216 6" fill="none" stroke="#f6f3ea" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
        <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-da-cream/50">Arabic, for children</p>
      </div>
    </div>
  );
}

/* ── Backdrops (per-program ambient texture) ─────────────────── */

export function AalimBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30" aria-hidden>
      <DaAmbient />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(201,162,39,0.06) 0px, transparent 1px, transparent 26px, rgba(201,162,39,0.06) 27px), repeating-linear-gradient(-45deg, rgba(201,162,39,0.06) 0px, transparent 1px, transparent 26px, rgba(201,162,39,0.06) 27px)",
        }}
      />
    </div>
  );
}

export function HifzBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30" aria-hidden>
      <DaAmbient />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(217,143,74,0.1) 0 1px, transparent 1px 26px)" }}
      />
    </div>
  );
}

export function QuranClassBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40" aria-hidden>
      <DaAmbient stars />
      <CrescentLantern size={30} withLantern={false} className="absolute right-[12%] top-[18%]" />
      <CrescentLantern size={24} withLantern={false} className="absolute left-[8%] top-[38%]" />
    </div>
  );
}

export function KidsBackdrop() {
  const letters = ["ا", "ب", "ت", "ث", "ج"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40" aria-hidden>
      <DaAmbient />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(246,243,234,0.06) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      {letters.map((l, i) => (
        <span
          key={l}
          className="da-float-slow absolute font-arabic text-3xl"
          style={{ left: `${12 + i * 18}%`, top: `${15 + (i % 3) * 22}%`, color: i % 2 ? "#a9e0c0" : "#e3c56a", opacity: 0.25, animationDelay: `${i * 0.6}s` }}
        >
          {l}
        </span>
      ))}
      <Twinkles />
    </div>
  );
}
