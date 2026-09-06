"use client";

/** Literal, line-for-line port of `Prayer Times.dc.html`. */

import * as React from "react";
import { Glyph } from "@/components/site/program-glyphs";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Twinkle, Lantern, GeoMedallion } from "@/components/sections/home-literal";
import { nextPrayer, activePrayerKey } from "@/lib/prayer";
import { usePrayerTimes } from "@/components/prayer/use-prayer-times";
import { EXT } from "@/lib/links";
import { useIsDesktop } from "@/components/site/use-media-query";

function useNow(intervalMs = 30000) {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function CrescentSimple({ size, top, left, right, boxShadow, delay = 0 }: { size: number; top: string; left?: string; right?: string; boxShadow: string; delay?: number }) {
  return (
    <div
      className="da-moon-glow pointer-events-none absolute"
      style={{ top, left, right, width: size, height: size, zIndex: 1, animationDelay: `${delay}s` }}
      aria-hidden
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#e3c56a", boxShadow }} />
      <div style={{ position: "absolute", top: -size * 0.11, left: size * 0.28, width: size, height: size * 1.22, borderRadius: 999, background: "#0e2419" }} />
    </div>
  );
}

function GeoStar({ top, left, right, size, opacity, twinkle }: { top: string; left?: string; right?: string; size: number; opacity: number; twinkle?: boolean }) {
  return (
    <div
      className={twinkle ? "da-twinkle pointer-events-none absolute" : "pointer-events-none absolute"}
      style={{ top, left, right, width: size, height: size, opacity, zIndex: 1 }}
      aria-hidden
    >
      <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(201,162,39,0.16)" }} />
      <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(201,162,39,0.16)", transform: "rotate(45deg)" }} />
    </div>
  );
}

/**
 * A waxing crescent, drawn rather than approximated.
 *
 * Isha's "moon" used to be a 16px dot — the right idea at the wrong size
 * with none of the shape that makes a moon read as a moon. This carves a
 * real crescent out of a lit disc with a mask, and puts craters on the lit
 * limb where they catch the light. IDs are scoped with useId because three
 * copies of this can be in the document at once and a duplicate mask id
 * resolves to whichever one the browser saw first.
 */
function Moon() {
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg width="100%" height="100%" viewBox="0 0 40 40" aria-hidden style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 0 6px rgba(198,214,255,0.5))" }}>
      <defs>
        <mask id={`mk${uid}`}>
          <rect width="40" height="40" fill="#000" />
          <circle cx="19" cy="20" r="17" fill="#fff" />
          <circle cx="31.5" cy="13.5" r="15" fill="#000" />
        </mask>
        <radialGradient id={`gr${uid}`} cx="34%" cy="64%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#eaeefc" />
          <stop offset="100%" stopColor="#c2cae6" />
        </radialGradient>
      </defs>
      <g mask={`url(#mk${uid})`}>
        <circle cx="19" cy="20" r="17" fill={`url(#gr${uid})`} />
        <circle cx="11.5" cy="14.5" r="2.7" fill="#a9b3d2" opacity="0.5" />
        <circle cx="8.6" cy="23.5" r="1.9" fill="#a9b3d2" opacity="0.42" />
        <circle cx="14.6" cy="28.5" r="1.4" fill="#a9b3d2" opacity="0.38" />
        <circle cx="7.6" cy="18.2" r="1.05" fill="#a9b3d2" opacity="0.34" />
        <circle cx="13.4" cy="21.6" r="1.15" fill="#a9b3d2" opacity="0.3" />
      </g>
    </svg>
  );
}

/**
 * Each prayer's sky.
 *
 * The gradients are the original ones and they stay untouched, top to
 * bottom. An earlier attempt at legibility laid a heavy wash over the lower
 * half of every cell, which did make the type readable and destroyed the
 * palette doing it — Dhuhr faded to near-white, Maghrib to near-black. The
 * type is carried by a one-pixel outline in the cell's own ink plus a soft
 * glow, which is how type survives over imagery — it costs the colour
 * nothing, and it works even where cream sits on light orange at the bottom
 * of Maghrib.
 *
 * What actually made the times hard to read was never contrast: it was the
 * sun sitting behind them. Fajr's and Maghrib's discs are low, and
 * positioned against the whole cell they landed on "IQAMA". They now live in
 * a sky band above the type, and travel it as a real arc — low in the east
 * at Fajr, overhead at Dhuhr, past the meridian at Asr, low in the west at
 * Maghrib, the moon high at Isha.
 */
const TIME_LOOK: Record<string, { bg: string; skyFrac: number; skyX: string; discSize: number; disc: string; discGlow: string; moon?: boolean; textPrimary: string; textAccent: string; textSecondary: string; textMuted: string; labelShadow: string; halo: string }> = {
  fajr: {
    bg: "linear-gradient(180deg, #182238 0%, #35335c 48%, #6d4c6f 82%, #a8724f 100%)",
    skyFrac: 0.94, skyX: "50%", discSize: 38, disc: "radial-gradient(circle, #f7dfa6, #e3a25f 70%)", discGlow: "rgba(247,223,166,0.45)",
    textPrimary: "#fdf6e6", textAccent: "#ffe3a3", textSecondary: "rgba(253,246,230,0.88)", textMuted: "rgba(253,246,230,0.5)", labelShadow: "0 1px 6px rgba(0,0,0,0.75)",
    halo: "0 1px 0 rgba(10,14,30,0.95), 0 -1px 0 rgba(10,14,30,0.7), 1px 0 0 rgba(10,14,30,0.7), -1px 0 0 rgba(10,14,30,0.7), 0 0 4px rgba(10,14,30,0.95), 0 0 9px rgba(10,14,30,0.7)",
  },
  dhuhr: {
    bg: "linear-gradient(180deg, #2f6fb0 0%, #5b9bd6 55%, #a9d4ee 100%)",
    skyFrac: 0.02, skyX: "50%", discSize: 46, disc: "radial-gradient(circle, #fffbe8, #ffe9a0 70%)", discGlow: "rgba(255,251,232,0.65)",
    textPrimary: "#0e2419", textAccent: "#7a4a12", textSecondary: "rgba(14,36,25,0.8)", textMuted: "rgba(14,36,25,0.55)", labelShadow: "0 1px 5px rgba(255,255,255,0.85)",
    halo: "0 1px 0 rgba(255,255,255,0.95), 0 -1px 0 rgba(240,250,255,0.8), 1px 0 0 rgba(240,250,255,0.8), -1px 0 0 rgba(240,250,255,0.8), 0 0 4px rgba(255,255,255,0.95), 0 0 9px rgba(240,250,255,0.8)",
  },
  asr: {
    bg: "linear-gradient(180deg, #a8622c 0%, #cf9143 55%, #ecc57e 100%)",
    skyFrac: 0.4, skyX: "50%", discSize: 42, disc: "radial-gradient(circle, #fff2cf, #ffd27a 70%)", discGlow: "rgba(255,242,207,0.6)",
    textPrimary: "#2a1608", textAccent: "#5c2c0a", textSecondary: "rgba(42,22,8,0.78)", textMuted: "rgba(42,22,8,0.5)", labelShadow: "0 1px 5px rgba(255,240,214,0.8)",
    halo: "0 1px 0 rgba(255,250,238,0.95), 0 -1px 0 rgba(255,246,226,0.8), 1px 0 0 rgba(255,246,226,0.8), -1px 0 0 rgba(255,246,226,0.8), 0 0 4px rgba(255,250,238,0.95), 0 0 9px rgba(255,246,226,0.8)",
  },
  maghrib: {
    bg: "linear-gradient(180deg, #4a2a56 0%, #a83f4a 45%, #d9722f 78%, #f0a860 100%)",
    skyFrac: 0.96, skyX: "50%", discSize: 44, disc: "radial-gradient(circle, #fff0d2, #ffb35c 70%)", discGlow: "rgba(255,179,92,0.6)",
    textPrimary: "#fff3e4", textAccent: "#ffd9a0", textSecondary: "rgba(255,243,228,0.88)", textMuted: "rgba(255,243,228,0.55)", labelShadow: "0 1px 6px rgba(0,0,0,0.7)",
    halo: "0 1px 0 rgba(46,10,24,0.98), 0 -1px 0 rgba(46,10,24,0.8), 1px 0 0 rgba(46,10,24,0.8), -1px 0 0 rgba(46,10,24,0.8), 0 0 4px rgba(46,10,24,0.98), 0 0 9px rgba(46,10,24,0.8)",
  },
  isha: {
    bg: "linear-gradient(180deg, #0a1220 0%, #182642 55%, #223458 100%)",
    skyFrac: 0.16, skyX: "50%", discSize: 46, disc: "", discGlow: "", moon: true,
    textPrimary: "#f6f3ea", textAccent: "#e3c56a", textSecondary: "rgba(246,243,234,0.88)", textMuted: "rgba(246,243,234,0.45)", labelShadow: "0 1px 6px rgba(0,0,0,0.8)",
    halo: "0 1px 0 rgba(4,8,20,0.95), 0 -1px 0 rgba(4,8,20,0.7), 1px 0 0 rgba(4,8,20,0.7), -1px 0 0 rgba(4,8,20,0.7), 0 0 4px rgba(4,8,20,0.95), 0 0 9px rgba(4,8,20,0.7)",
  },
};

function IqamaTable() {
  const now = useNow(60000);
  const { prayers, shuruq, timezone } = usePrayerTimes();
  const active = now ? activePrayerKey(now, prayers, timezone) : null;
  return (
    <div className="da-iqama-wrap" style={{ maxWidth: 980, margin: "60px auto 0" }}>
      <div className="da-iqama-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", boxShadow: "0 20px 50px -25px rgba(0,0,0,0.5)" }}>
        {prayers.map((p, i) => {
          const look = TIME_LOOK[p.key];
          const isActive = active === p.key;
          const isFirst = i === 0;
          const isLast = i === prayers.length - 1;
          const scrim = isActive
            ? "linear-gradient(180deg, rgba(8,10,18,0.32), rgba(8,10,18,0.08) 45%, rgba(8,10,18,0.4)),"
            : "linear-gradient(180deg, rgba(8,10,18,0.5), rgba(8,10,18,0.22) 45%, rgba(8,10,18,0.55)),";
          return (
            <div
              key={p.key}
              className="da-iqama-cell"
              style={{
                position: "relative",
                padding: "58px 14px 30px",
                textAlign: "center",
                overflow: "visible",
                background: `${scrim} ${look.bg}`,
                borderTopLeftRadius: isFirst ? 20 : 0,
                borderBottomLeftRadius: isFirst ? 20 : 0,
                borderTopRightRadius: isLast ? 20 : 0,
                borderBottomRightRadius: isLast ? 20 : 0,
                borderLeft: "1px solid rgba(0,0,0,0.15)",
                boxShadow: isActive ? "inset 0 0 0 2px rgba(227,197,106,0.5)" : undefined,
              }}
            >
              {isActive && (
                <div className="da-iqama-now" style={{ position: "absolute", top: -17, left: "50%", transform: "translateX(-50%)", zIndex: 8 }}>
                  <div
                    className="da-live-pulse"
                    style={{ position: "absolute", top: "50%", left: "50%", width: 96, height: 44, transform: "translate(-50%,-50%)", borderRadius: 999, background: "radial-gradient(circle, rgba(227,197,106,0.85), transparent 72%)", filter: "blur(9px)" }}
                  />
                  <div className="da-iqama-now-pill" style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 999, background: "linear-gradient(135deg, #f3d98a, #c9a227)", boxShadow: "0 8px 20px -4px rgba(227,197,106,0.7), 0 0 0 3px #0d2318", whiteSpace: "nowrap" }}>
                    <span className="da-live-pulse" style={{ width: 6, height: 6, borderRadius: 999, background: "#1c2b21" }} />
                    <span className="da-iqama-now-text" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1c2b21", fontWeight: 800 }}>Now</span>
                  </div>
                </div>
              )}
              {/* The sky band: bounded to the clear space between the "Now"
                  badge and the type, so neither the badge nor the times can
                  ever be behind a sun. The disc is lerped *inside* the band —
                  `(100% - size) * f` moves its box, not its centre — so it
                  reaches the horizon and the zenith without leaving. */}
              <div
                className="da-iqama-sky"
                style={{ "--disc": `${look.discSize}px`, "--f": look.skyFrac, "--x": look.skyX } as React.CSSProperties}
                aria-hidden
              >
                <div
                  className="da-iqama-disc"
                  style={{
                    borderRadius: look.moon ? 0 : 999,
                    background: look.moon ? undefined : look.disc,
                    boxShadow: look.moon ? undefined : `0 0 26px 8px ${look.discGlow}`,
                  }}
                >
                  {look.moon && <Moon />}
                </div>
              </div>
              <div className="da-iqama-text" style={{ position: "relative", zIndex: 1 }}>
                <div dir="rtl" lang="ar" className="da-iqama-arabic" style={{ fontFamily: "'Amiri',serif", fontSize: 20, color: look.textAccent, margin: "14px 0 8px 0", textShadow: look.halo }}>{p.arabic}</div>
                <div className="da-iqama-name" style={{ fontSize: 14, fontWeight: 700, color: look.textPrimary, marginBottom: 16, textShadow: look.halo }}>{p.name}</div>
                <div className="da-iqama-label" style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: look.textSecondary, marginBottom: 3, fontWeight: 700, textShadow: look.halo }}>Adhan</div>
                <div className="da-iqama-adhan" style={{ fontSize: 13, fontWeight: 600, color: look.textPrimary, marginBottom: 12, textShadow: look.halo }}>{p.adhan}</div>
                <div className="da-iqama-label" style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: look.textSecondary, marginBottom: 3, fontWeight: 700, textShadow: look.halo }}>Iqama</div>
                <div className="da-iqama-value" style={{ fontSize: 16.5, fontWeight: 800, color: look.textAccent, textShadow: look.halo }}>{p.iqama}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Sits inside the board, on a band tinted from the twilight end of the
          prayer gradients so it reads as the board's own footer rather than a
          slab of section-green under it. */}
      <p className="da-board-note">
        <span className="da-board-note-mark" aria-hidden><Glyph name="star8" size={13} /></span>
        <span>
          Shurûq {shuruq} · Changes are announced in the{" "}
          <a
            href="#whatsapp-join"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("whatsapp-join")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            WhatsApp group
          </a>
          .
        </span>
      </p>
    </div>
  );
}

/**
 * The masjid screen: a cabinet, a bezel and a stand, desktop only.
 *
 * What used to hang in the bezel was the Mawaqit iframe. Mawaqit picks its
 * layout from the device rather than from the frame it is handed, so it
 * arrived cropped and there is nothing outside an iframe that can fix that.
 * The board below is ours, carries exactly the same times, and is legible at
 * any width — so it is what the screen shows, and Mawaqit's own calendar is
 * one link away underneath.
 *
 * Mounted behind useIsDesktop rather than hidden with CSS: the cabinet and
 * its stand are a desktop conceit, and a phone gets the bare board instead.
 */
function MasjidScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="da-tv">
      <div className="da-tv-outer">
        <div className="da-tv-glass">
          <div className="da-tv-header">
            <div className="da-tv-live">
              <span className="da-live-pulse" aria-hidden />
              Live · masjid screen
            </div>
            <a href={EXT.mawaqitLive} target="_blank" rel="noopener noreferrer" className="da-tv-full">
              Open full screen ↗
            </a>
          </div>
          <div className="da-tv-screen">{children}</div>
        </div>
        <div className="da-tv-plate">
          <span /> Darul Arqum <span />
        </div>
      </div>
      {/* the stand */}
      <div className="da-tv-neck" aria-hidden />
      <div className="da-tv-base" aria-hidden />
    </div>
  );
}

/** Jumu'ah banner, the five prayers, and the board's own footnote. */
function Board() {
  const { jumua } = usePrayerTimes();
  return (
    <div className="da-board">
      <div className="da-board-jumuah">
        <span className="da-live-pulse da-board-dot" aria-hidden />
        <span className="da-board-jumuah-label">Jumu&apos;ah</span>
        <span className="da-jumuah-text">1st Khutbah {jumua.first} &amp; 2nd Khutbah {jumua.second}</span>
      </div>
      <IqamaTable />
    </div>
  );
}

function IqamaPill() {
  const now = useNow();
  const { prayers, tomorrow, timezone } = usePrayerTimes();
  if (!now) return null;
  const next = nextPrayer(now, prayers, timezone, tomorrow);
  if (!next) return null;
  const h = Math.floor(next.minutesUntil / 60);
  const m = next.minutesUntil % 60;
  return (
    <div className="da-iqama-pill" style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 25, display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 999, background: "rgba(14,36,25,0.9)", backdropFilter: "blur(10px) saturate(140%)", border: "1px solid rgba(201,162,39,0.35)", boxShadow: "0 14px 30px -10px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
      <span className="da-live-pulse" style={{ width: 7, height: 7, borderRadius: 999, background: "#c9a227", flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: "rgba(246,243,234,0.6)" }}>Next iqama</span>
      <span style={{ fontSize: 13, color: "#f6f3ea", fontWeight: 600 }}>
        {next.prayer.name}
        {next.tomorrow ? " (tomorrow)" : ""} · {next.prayer.iqama}
      </span>
      <span style={{ fontSize: 11, color: "#e3c56a", background: "rgba(201,162,39,0.16)", padding: "4px 10px", borderRadius: 999 }}>
        in {h > 0 ? `${h}h ` : ""}
        {m}m
      </span>
    </div>
  );
}

export function PrayerTimesPage() {
  const isDesktop = useIsDesktop();

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>

      <div className="da-drift-gold" style={{ position: "fixed", width: 480, height: 480, borderRadius: 999, top: "-10%", right: "-8%", background: "radial-gradient(circle, rgba(201,162,39,0.16), transparent 70%)", filter: "blur(10px)", mixBlendMode: "screen", zIndex: 1, pointerEvents: "none" }} />
      <div className="da-drift-green" style={{ position: "fixed", width: 560, height: 560, borderRadius: 999, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.2), transparent 72%)", filter: "blur(10px)", mixBlendMode: "screen", zIndex: 1, pointerEvents: "none" }} />

      <GeoStar top="60px" right="-60px" size={260} opacity={0.5} />
      <GeoStar top="640px" left="-100px" size={220} opacity={0.4} twinkle />
      <GeoStar top="56%" left="-70px" size={220} opacity={0.35} twinkle />
      <GeoStar top="70%" right="-90px" size={240} opacity={0.35} />

      <CrescentSimple size={64} top="40px" left="12%" boxShadow="0 0 40px 8px rgba(227,197,106,0.25)" />
      <CrescentSimple size={48} top="42%" right="9%" boxShadow="0 0 32px 6px rgba(227,197,106,0.2)" delay={0.8} />
      <CrescentSimple size={40} top="78%" left="10%" boxShadow="0 0 26px 5px rgba(227,197,106,0.18)" delay={1.2} />

      <Twinkle top="90px" left="26%" size={3} duration={2.6} />
      <Twinkle top="150px" left="8%" duration={3.1} delay={0.5} />
      <Twinkle top="60px" left="38%" duration={2.3} delay={1} />
      <Twinkle top="220px" left="18%" duration={2.9} delay={1.4} />
      <Twinkle top="340px" left="90%" size={3} duration={2.7} delay={0.3} />
      <Twinkle top="420px" left="78%" duration={3.4} delay={0.8} />
      <Twinkle top="38%" left="95%" duration={2.8} delay={0.6} />
      <Twinkle top="47%" left="84%" size={3} duration={3.2} delay={1.1} />
      <Twinkle top="52%" left="6%" duration={2.5} delay={0.2} />
      <Twinkle top="82%" left="22%" duration={3} delay={0.4} />
      <Twinkle top="88%" left="86%" size={3} duration={2.6} delay={0.9} />
      <Twinkle top="92%" left="72%" duration={3.3} delay={1.3} />

      <div style={{ position: "absolute", top: 0, left: -30, zIndex: 1, pointerEvents: "none" }}>
        <Lantern stringHeight={130} bodyW={34} bodyH={46} glowSize={56} sway={4.6} />
      </div>
      <div style={{ position: "absolute", top: 0, right: "6%", zIndex: 1, pointerEvents: "none" }}>
        <Lantern stringHeight={190} bodyW={30} bodyH={40} glowSize={48} sway={4} swayDelay={0.6} />
      </div>
      <div style={{ position: "absolute", top: "36%", left: "2%", zIndex: 1, pointerEvents: "none" }}>
        <Lantern stringHeight={70} bodyW={26} bodyH={34} glowSize={44} sway={5.2} swayDelay={0.3} />
      </div>
      <div style={{ position: "absolute", top: "65%", right: "3%", zIndex: 1, pointerEvents: "none" }}>
        <Lantern stringHeight={90} bodyW={32} bodyH={42} glowSize={52} sway={4.8} swayDelay={0.9} />
      </div>

      {/* ============ HERO ============ */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "64px 24px 46px", background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,162,39,0.10), transparent 70%)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700, marginBottom: 14 }}>Darul Arqum · Ottawa</div>
          <Breadcrumbs items={[{ label: "Prayer times" }]} className="mb-5" />
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(34px,4.6vw,54px)", lineHeight: 1.08, color: "#f6f3ea", margin: "0 0 26px 0" }}>Prayer times</h1>

          <div className="da-request" style={{ position: "relative", padding: "18px 22px", borderRadius: 16, background: "linear-gradient(120deg, rgba(201,162,39,0.14), rgba(201,162,39,0.04))", border: "1px solid rgba(201,162,39,0.35)" }}>
            <div className="da-request-icon" style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 12, background: "linear-gradient(160deg, rgba(201,162,39,0.26), rgba(201,162,39,0.08))", border: "1px solid rgba(227,197,106,0.5)", color: "#f3d98a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px -8px rgba(0,0,0,0.6)" }}>
              <Glyph name="announce" size={24} />
            </div>
            <div className="da-request-label" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 800 }}>Special request</div>
            <p className="da-request-body" style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(246,243,234,0.82)" }}>Please arrive before iqama. Timing changes are announced in the community WhatsApp group.</p>
          </div>
        </div>
      </section>

      {/* ============ TV HERO ============ */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          padding: "56px 24px 70px",
          overflow: "hidden",
          background: "radial-gradient(ellipse 60% 90% at 50% 40%, rgba(201,162,39,0.10), transparent 70%), linear-gradient(180deg, rgba(8,18,13,0.5), rgba(8,18,13,0.15) 20%, rgba(8,18,13,0.15) 80%, rgba(8,18,13,0.5))",
        }}
      >
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", width: "70%", maxWidth: 640, height: 120, borderRadius: 999, background: "radial-gradient(ellipse, rgba(201,162,39,0.22), transparent 72%)", filter: "blur(6px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(246,243,234,0.5)", fontWeight: 700, marginBottom: 8 }}>Live from the masjid</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 26, color: "#f6f3ea" }}>Today&apos;s board, straight off the screen</div>
          </div>

          {/* The board is the anchor on every device: mounted in the cabinet on
              desktop, bare on a phone where a drawn television would be a
              picture frame around nothing. */}
          {isDesktop ? (
            <MasjidScreen>
              <Board />
            </MasjidScreen>
          ) : (
            <Board />
          )}

          <a
            className="da-board-link"
            href={EXT.mawaqitLive}
            target="_blank"
            rel="noopener noreferrer"
          >
            View the Mawaqit calendar <span aria-hidden="true">↗</span>
          </a>

          <div className="da-hadith" style={{ maxWidth: 980, margin: "54px auto 0", position: "relative", overflow: "hidden", textAlign: "center", borderRadius: 20, padding: "52px 32px", background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(201,162,39,0.12), transparent 70%), linear-gradient(180deg, #123321, #0d2419)", border: "1px solid rgba(201,162,39,0.22)" }}>
            <div style={{ position: "absolute", top: -70, left: -70, width: 220, height: 220, opacity: 0.3, pointerEvents: "none" }}>
              <GeoMedallion size={220} opacity={1} />
            </div>
            <div style={{ position: "absolute", bottom: -80, right: -80, width: 240, height: 240, opacity: 0.3, pointerEvents: "none" }}>
              <GeoMedallion size={240} opacity={1} />
            </div>
            <p dir="rtl" lang="ar" className="da-hadith-ar" style={{ position: "relative", fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: "clamp(22px,3vw,30px)", lineHeight: 2, margin: "0 0 26px 0", unicodeBidi: "plaintext", backgroundImage: "linear-gradient(100deg, #f3d98a, #c9a227 55%, #8a6a1e)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              مَنْ تَوَضَّأَ لِلصَّلاَةِ فَأَسْبَغَ الْوُضُوءَ ثُمَّ مَشَى إِلَى الصَّلاَةِ الْمَكْتُوبَةِ فَصَلاَّهَا مَعَ النَّاسِ أَوْ مَعَ الْجَمَاعَةِ أَوْ فِي الْمَسْجِدِ غَفَرَ اللَّهُ لَهُ ذُنُوبَهُ
            </p>
            <span className="da-hadith-rule" style={{ position: "relative", display: "block", width: 44, height: 1, background: "rgba(201,162,39,0.5)", margin: "0 auto 26px" }} />
            <p className="da-hadith-en" style={{ position: "relative", fontFamily: "'Cormorant Garamond',serif", fontSize: 21, fontStyle: "italic", lineHeight: 1.65, color: "#f6f3ea", margin: "0 auto 16px", maxWidth: 600 }}>
              &quot;Salat is the key to Paradise. Whoever performs wudu and does it well, then walks to the obligatory prayer and offers it with the congregation, or in the masjid, Allah will forgive his sins.&quot;
            </p>
            <p className="da-hadith-src" style={{ position: "relative", fontSize: 12.5, color: "rgba(246,243,234,0.5)", margin: 0 }}>Sahih Muslim, Vol 1, No. 549</p>
          </div>
        </div>
      </section>

      {/* ============ WHATSAPP HERO ============ */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "64px 24px 100px", overflow: "hidden", background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(120,190,150,0.10), transparent 72%)" }}>
        <div id="whatsapp-join" style={{ maxWidth: 760, margin: "0 auto", position: "relative", overflow: "hidden", borderRadius: 22, scrollMarginTop: 90 }}>
          <a
            href={EXT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="da-wa-hero"
            style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, padding: "34px 36px", background: "linear-gradient(120deg, #163f2c, #0d2b1e)", border: "1.5px solid rgba(120,190,150,0.4)", borderRadius: 22, flexWrap: "wrap" }}
          >
            <div style={{ position: "absolute", top: -60, left: -60, width: 220, height: 220, borderRadius: 999, background: "radial-gradient(circle, rgba(120,190,150,0.18), transparent 70%)" }} />
            <div style={{ position: "absolute", bottom: -60, right: -40, width: 200, height: 200, borderRadius: 999, background: "radial-gradient(circle, rgba(201,162,39,0.1), transparent 70%)" }} />
            <div className="da-float-slow da-wa-hero-icon" style={{ position: "relative", width: 56, height: 56, flexShrink: 0, borderRadius: 999, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/whatsapp-icon.png" alt="WhatsApp" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.16)" }} />
            </div>
            <div className="da-wa-hero-body" style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <div className="da-wa-hero-eyebrow" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700, marginBottom: 6 }}>Timing changes, announced live</div>
              <div className="da-wa-hero-title" style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 25, color: "#f6f3ea", marginBottom: 8 }}>Join the community WhatsApp group</div>
              <div className="da-wa-hero-note" style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", maxWidth: 520 }}>Get iqama change alerts, janazah announcements and event updates the moment they&apos;re posted.</div>
            </div>
            <span className="da-wa-hero-cta">Join the group <span aria-hidden="true">↗</span></span>
          </a>
        </div>
      </section>

      <IqamaPill />
    </div>
  );
}
