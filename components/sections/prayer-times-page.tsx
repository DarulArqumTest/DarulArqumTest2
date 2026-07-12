"use client";

/** Literal, line-for-line port of `Prayer Times.dc.html`. */

import * as React from "react";
import { Twinkle, Lantern, GeoMedallion } from "@/components/sections/home-literal";
import { PRAYERS, SHURUQ, nextPrayer, activePrayerKey } from "@/lib/prayer";

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

const TIME_LOOK: Record<string, { bg: string; discTop: string; discSize: number; disc: string; discGlow: string; textPrimary: string; textAccent: string; textSecondary: string; textMuted: string }> = {
  fajr: {
    bg: "linear-gradient(180deg, #182238 0%, #35335c 48%, #6d4c6f 82%, #a8724f 100%)",
    discTop: "76%", discSize: 34, disc: "radial-gradient(circle, #f7dfa6, #e3a25f 70%)", discGlow: "rgba(247,223,166,0.4)",
    textPrimary: "#fdf6e6", textAccent: "#ffe3a3", textSecondary: "rgba(253,246,230,0.85)", textMuted: "rgba(253,246,230,0.5)",
  },
  dhuhr: {
    bg: "linear-gradient(180deg, #2f6fb0 0%, #5b9bd6 55%, #a9d4ee 100%)",
    discTop: "10%", discSize: 40, disc: "radial-gradient(circle, #fffbe8, #ffe9a0 70%)", discGlow: "rgba(255,251,232,0.6)",
    textPrimary: "#0e2419", textAccent: "#7a4a12", textSecondary: "rgba(14,36,25,0.78)", textMuted: "rgba(14,36,25,0.55)",
  },
  asr: {
    bg: "linear-gradient(180deg, #a8622c 0%, #cf9143 55%, #ecc57e 100%)",
    discTop: "30%", discSize: 38, disc: "radial-gradient(circle, #fff2cf, #ffd27a 70%)", discGlow: "rgba(255,242,207,0.55)",
    textPrimary: "#2a1608", textAccent: "#5c2c0a", textSecondary: "rgba(42,22,8,0.75)", textMuted: "rgba(42,22,8,0.5)",
  },
  maghrib: {
    bg: "linear-gradient(180deg, #4a2a56 0%, #a83f4a 45%, #d9722f 78%, #f0a860 100%)",
    discTop: "68%", discSize: 42, disc: "radial-gradient(circle, #fff0d2, #ffb35c 70%)", discGlow: "rgba(255,179,92,0.55)",
    textPrimary: "#fff3e4", textAccent: "#ffd9a0", textSecondary: "rgba(255,243,228,0.85)", textMuted: "rgba(255,243,228,0.55)",
  },
  isha: {
    bg: "linear-gradient(180deg, #0a1220 0%, #182642 55%, #223458 100%)",
    discTop: "14%", discSize: 16, disc: "radial-gradient(circle, #f4f6ff, #cfd8f5 70%)", discGlow: "rgba(244,246,255,0.35)",
    textPrimary: "#f6f3ea", textAccent: "#e3c56a", textSecondary: "rgba(246,243,234,0.85)", textMuted: "rgba(246,243,234,0.45)",
  },
};

function IqamaTable() {
  const now = useNow(60000);
  const active = now ? activePrayerKey(now) : null;
  return (
    <div style={{ maxWidth: 980, margin: "60px auto 0" }}>
      <div className="da-iqama-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", boxShadow: "0 20px 50px -25px rgba(0,0,0,0.5)" }}>
        {PRAYERS.map((p, i) => {
          const look = TIME_LOOK[p.key];
          const isActive = active === p.key;
          const isFirst = i === 0;
          const isLast = i === PRAYERS.length - 1;
          const scrim = isActive
            ? "linear-gradient(180deg, rgba(8,10,18,0.32), rgba(8,10,18,0.08) 45%, rgba(8,10,18,0.4)),"
            : "linear-gradient(180deg, rgba(8,10,18,0.5), rgba(8,10,18,0.22) 45%, rgba(8,10,18,0.55)),";
          return (
            <div
              key={p.key}
              style={{
                position: "relative",
                padding: "30px 14px 26px",
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
                <div style={{ position: "absolute", top: -17, left: "50%", transform: "translateX(-50%)", zIndex: 8 }}>
                  <div
                    className="da-live-pulse"
                    style={{ position: "absolute", top: "50%", left: "50%", width: 96, height: 44, transform: "translate(-50%,-50%)", borderRadius: 999, background: "radial-gradient(circle, rgba(227,197,106,0.85), transparent 72%)", filter: "blur(9px)" }}
                  />
                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 999, background: "linear-gradient(135deg, #f3d98a, #c9a227)", boxShadow: "0 8px 20px -4px rgba(227,197,106,0.7), 0 0 0 3px #0d2318", whiteSpace: "nowrap" }}>
                    <span className="da-live-pulse" style={{ width: 6, height: 6, borderRadius: 999, background: "#1c2b21" }} />
                    <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1c2b21", fontWeight: 800 }}>Now</span>
                  </div>
                </div>
              )}
              <div style={{ position: "absolute", top: look.discTop, left: "50%", transform: "translate(-50%,-50%)", width: look.discSize, height: look.discSize, borderRadius: 999, background: look.disc, boxShadow: `0 0 22px 6px ${look.discGlow}`, zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div dir="rtl" lang="ar" style={{ fontFamily: "'Amiri',serif", fontSize: 20, color: look.textAccent, margin: "14px 0 8px 0", textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>{p.arabic}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: look.textPrimary, marginBottom: 16, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>{p.name}</div>
                <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: look.textMuted, marginBottom: 3 }}>Adhan</div>
                <div style={{ fontSize: 13, color: look.textSecondary, marginBottom: 12, textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>{p.adhan}</div>
                <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: look.textMuted, marginBottom: 3 }}>Iqama</div>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: look.textAccent, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>{p.iqama}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ margin: "18px 0 0 0", fontSize: 12.5, color: "rgba(246,243,234,0.5)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#c9a227" }}>✦</span> Shurûq {SHURUQ} · Iqama schedule — confirm live on the masjid screen. Changes are announced in the WhatsApp group.
      </p>
    </div>
  );
}

function IqamaPill() {
  const now = useNow();
  if (!now) return null;
  const next = nextPrayer(now);
  if (!next) return null;
  const h = Math.floor(next.minutesUntil / 60);
  const m = next.minutesUntil % 60;
  return (
    <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 25, display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 999, background: "rgba(14,36,25,0.9)", backdropFilter: "blur(10px) saturate(140%)", border: "1px solid rgba(201,162,39,0.35)", boxShadow: "0 14px 30px -10px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
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
  const [loaded, setLoaded] = React.useState(false);

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
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(34px,4.6vw,54px)", lineHeight: 1.08, color: "#f6f3ea", margin: "0 0 26px 0" }}>Prayer times</h1>

          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 20, padding: "22px 28px", borderRadius: 16, background: "linear-gradient(120deg, rgba(201,162,39,0.14), rgba(201,162,39,0.04))", border: "1px solid rgba(201,162,39,0.35)" }}>
            <div style={{ width: 58, height: 58, flexShrink: 0, borderRadius: 999, background: "#f6f3ea", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
              <span style={{ fontSize: 26 }}>📢</span>
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 800, marginBottom: 8 }}>Special request</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "rgba(246,243,234,0.82)", margin: 0 }}>Please arrive before iqama. Timing changes are announced in the community WhatsApp group.</p>
            </div>
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

          <div style={{ position: "relative", zIndex: 2, maxWidth: "calc(100% - 32px)", width: "fit-content", margin: "0 auto -1px", borderRadius: "14px 14px 0 0", padding: "14px 20px", background: "linear-gradient(135deg, #7a2020, #4d1414)", border: "1px solid rgba(227,197,106,0.35)", borderBottom: "none", boxShadow: "0 -6px 24px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "6px 14px" }}>
            <span className="da-live-pulse" style={{ width: 8, height: 8, borderRadius: 999, background: "#ffd7d7", flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", fontWeight: 700 }}>Jumu&apos;ah</span>
            <span style={{ fontSize: 14.5, color: "#fff", fontWeight: 700, textAlign: "center" }}>1st Khutbah 1:30 PM &amp; 2nd Khutbah 2:30 PM</span>
          </div>

          <div style={{ borderRadius: 30, padding: "20px 20px 16px", background: "linear-gradient(155deg, #333029, #171512)", border: "1px solid rgba(0,0,0,0.5)", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "2px solid rgba(201,162,39,0.4)", background: "#08150f", boxShadow: "inset 0 0 50px rgba(0,0,0,0.6)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderBottom: "1px solid rgba(246,243,234,0.1)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(246,243,234,0.6)", fontWeight: 600 }}>
                  <span className="da-live-pulse" style={{ width: 8, height: 8, borderRadius: 999, background: "#e35c5c" }} />
                  Live · masjid screen
                </div>
                <a href="https://mawaqit.net/en/darul-arqum-ottawa-canada-ottawa-k1v-1g5-canada" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: "#e3c56a", fontWeight: 600 }}>
                  Open full screen ↗
                </a>
              </div>
              <div style={{ position: "relative" }}>
                {!loaded && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(246,243,234,0.55)", padding: 24, textAlign: "center" }}>
                    <span style={{ fontSize: 26 }}>◷</span>
                    <p style={{ fontSize: 14, margin: 0 }}>Connecting to the masjid screen…</p>
                    <p style={{ fontSize: 12, maxWidth: 340, margin: 0, color: "rgba(246,243,234,0.4)" }}>If it doesn&apos;t load, use &quot;Open full screen&quot; above — the timings below stay available either way.</p>
                  </div>
                )}
                <iframe
                  src="https://mawaqit.net/en/m/darul-arqum-ottawa-canada-ottawa-k1v-1g5-canada"
                  title="Darul Arqum live prayer times (Mawaqit)"
                  onLoad={() => setLoaded(true)}
                  loading="lazy"
                  allow="fullscreen"
                  style={{ position: "relative", width: "100%", aspectRatio: "16/7.2", minHeight: 340, border: 0, display: "block" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, paddingTop: 14 }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "rgba(201,162,39,0.4)" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(246,243,234,0.35)", fontWeight: 600 }}>Darul Arqum</span>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "rgba(201,162,39,0.4)" }} />
            </div>
          </div>
          <div style={{ width: 64, height: 24, margin: "0 auto", background: "linear-gradient(180deg, #2f2c26, #171512)", clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }} />
          <div style={{ width: 180, height: 10, margin: "0 auto", borderRadius: 6, background: "linear-gradient(180deg, #2f2c26, #171512)", boxShadow: "0 14px 26px -8px rgba(0,0,0,0.6)" }} />

          <IqamaTable />

          <div style={{ maxWidth: 980, margin: "54px auto 0", position: "relative", overflow: "hidden", textAlign: "center", borderRadius: 20, padding: "52px 32px", background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(201,162,39,0.12), transparent 70%), linear-gradient(180deg, #123321, #0d2419)", border: "1px solid rgba(201,162,39,0.22)" }}>
            <div style={{ position: "absolute", top: -70, left: -70, width: 220, height: 220, opacity: 0.3, pointerEvents: "none" }}>
              <GeoMedallion size={220} opacity={1} />
            </div>
            <div style={{ position: "absolute", bottom: -80, right: -80, width: 240, height: 240, opacity: 0.3, pointerEvents: "none" }}>
              <GeoMedallion size={240} opacity={1} />
            </div>
            <p dir="rtl" lang="ar" style={{ position: "relative", fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: "clamp(22px,3vw,30px)", lineHeight: 2, margin: "0 0 26px 0", unicodeBidi: "plaintext", backgroundImage: "linear-gradient(100deg, #f3d98a, #c9a227 55%, #8a6a1e)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              مَنْ تَوَضَّأَ لِلصَّلاَةِ فَأَسْبَغَ الْوُضُوءَ ثُمَّ مَشَى إِلَى الصَّلاَةِ الْمَكْتُوبَةِ فَصَلاَّهَا مَعَ النَّاسِ أَوْ مَعَ الْجَمَاعَةِ أَوْ فِي الْمَسْجِدِ غَفَرَ اللَّهُ لَهُ ذُنُوبَهُ
            </p>
            <span style={{ position: "relative", display: "block", width: 44, height: 1, background: "rgba(201,162,39,0.5)", margin: "0 auto 26px" }} />
            <p style={{ position: "relative", fontFamily: "'Cormorant Garamond',serif", fontSize: 21, fontStyle: "italic", lineHeight: 1.65, color: "#f6f3ea", margin: "0 auto 16px", maxWidth: 600 }}>
              &quot;Salat is the key to Paradise. Whoever performs wudu and does it well, then walks to the obligatory prayer and offers it with the congregation, or in the masjid — Allah will forgive his sins.&quot;
            </p>
            <p style={{ position: "relative", fontSize: 12.5, color: "rgba(246,243,234,0.5)", margin: 0 }}>Sahih Muslim, Vol 1, No. 549</p>
          </div>
        </div>
      </section>

      {/* ============ WHATSAPP HERO ============ */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "64px 24px 100px", overflow: "hidden", background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(120,190,150,0.10), transparent 72%)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", overflow: "hidden", borderRadius: 22 }}>
          <a
            href="https://chat.whatsapp.com/F7LaeeNTGIlBPxJndDpEny"
            target="_blank"
            rel="noopener noreferrer"
            style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, padding: "34px 36px", background: "linear-gradient(120deg, #163f2c, #0d2b1e)", border: "1.5px solid rgba(120,190,150,0.4)", borderRadius: 22, flexWrap: "wrap" }}
          >
            <div style={{ position: "absolute", top: -60, left: -60, width: 220, height: 220, borderRadius: 999, background: "radial-gradient(circle, rgba(120,190,150,0.18), transparent 70%)" }} />
            <div style={{ position: "absolute", bottom: -60, right: -40, width: 200, height: 200, borderRadius: 999, background: "radial-gradient(circle, rgba(201,162,39,0.1), transparent 70%)" }} />
            <div className="da-float-slow" style={{ position: "relative", width: 56, height: 56, flexShrink: 0, borderRadius: 999, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/whatsapp-icon.png" alt="WhatsApp" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.16)" }} />
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700, marginBottom: 6 }}>Timing changes, announced live</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 25, color: "#f6f3ea", marginBottom: 8 }}>Join the community WhatsApp group</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", maxWidth: 520 }}>Get iqama change alerts, janazah announcements and event updates the moment they&apos;re posted.</div>
            </div>
            <span style={{ position: "relative", flexShrink: 0, background: "#a9e0c0", color: "#0e2419", fontWeight: 700, fontSize: 13.5, padding: "12px 22px", borderRadius: 999, whiteSpace: "nowrap" }}>Join the group ↗</span>
          </a>
        </div>
      </section>

      <IqamaPill />
    </div>
  );
}
