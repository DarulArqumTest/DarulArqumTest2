"use client";

/**
 * Locations page — one panel per masjid, each with its own map, address,
 * status and directions link. Built to take a third site without changes:
 * everything renders from LOCATION_LIST in lib/links.ts.
 */

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { LOCATION_LIST, ORG, R, type Location } from "@/lib/links";
import { WestPropertyArt } from "@/components/site/west-property-art";
import { Twinkle, CrescentMoon, GeoMedallion } from "@/components/sections/home-literal";

const ease = [0.16, 0.8, 0.4, 1] as const;

function LocationPanel({ loc, index }: { loc: Location; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const isOpen = loc.status === "open";

  return (
    <motion.section
      ref={ref}
      id={loc.key}
      initial={{ opacity: 0, y: 34 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08, ease }}
      className="da-loc-panel"
      style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${isOpen ? "rgba(201,162,39,0.36)" : "rgba(169,224,192,0.36)"}`,
        background: "linear-gradient(155deg, rgba(246,243,234,0.055), rgba(246,243,234,0.015))",
        boxShadow: "0 36px 80px -40px rgba(0,0,0,0.7)",
        scrollMarginTop: 96,
      }}
    >
      <div className="da-loc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* ── visual ── */}
        <div style={{ position: "relative", minHeight: 260, background: "#0a1f15" }}>
          {loc.key === "west" ? (
            <WestPropertyArt rounded={0} />
          ) : (
            <iframe
              title={`${loc.name} map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(loc.embedQuery)}&output=embed`}
              loading="lazy"
              style={{ width: "100%", height: "100%", minHeight: 260, border: 0, display: "block" }}
            />
          )}
          <span
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              borderRadius: 999,
              background: "rgba(8,22,15,0.86)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${loc.accent}66`,
            }}
          >
            <span
              aria-hidden
              className={isOpen ? "da-live-pulse" : undefined}
              style={{ width: 7, height: 7, borderRadius: 999, background: loc.accent, flexShrink: 0 }}
            />
            <span style={{ fontSize: 10.5, letterSpacing: "0.13em", textTransform: "uppercase", color: loc.accent, fontWeight: 800 }}>
              {loc.statusLabel}
            </span>
          </span>
        </div>

        {/* ── copy ── */}
        <div className="da-loc-body" style={{ padding: "clamp(24px,3.2vw,40px)", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: loc.accent, fontWeight: 800, marginBottom: 10 }}>
            {loc.short} campus
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(28px,3.6vw,42px)", lineHeight: 1.1, color: "#f6f3ea", margin: "0 0 14px 0" }}>
            {loc.name}
          </h2>
          <p style={{ fontSize: "clamp(14px,1.4vw,15.5px)", lineHeight: 1.7, color: "rgba(246,243,234,0.72)", margin: "0 0 22px 0" }}>
            {loc.blurb}
          </p>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "15px 17px", borderRadius: 13, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(246,243,234,0.13)", marginBottom: 22 }}>
            <svg width="15" height="18" viewBox="0 0 15 18" aria-hidden style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M7.5 1C4.46 1 2 3.46 2 6.5c0 4.1 5.5 10 5.5 10S13 10.6 13 6.5C13 3.46 10.54 1 7.5 1Z" fill="none" stroke={loc.accent} strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="7.5" cy="6.4" r="2.1" fill={loc.accent} />
            </svg>
            <div style={{ minWidth: 0 }}>
              <div className="da-wrap-any" style={{ fontSize: "clamp(14px,1.5vw,16px)", color: "#f6f3ea", fontWeight: 700, lineHeight: 1.4 }}>
                {loc.street}
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(246,243,234,0.6)" }}>
                {loc.city}
                {loc.postal ? ` ${loc.postal}` : ""}
              </div>
            </div>
          </div>

          <div className="da-loc-cta" style={{ display: "flex", flexWrap: "wrap", gap: 11 }}>
            <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="da-btn da-btn-gold da-btn-sm">
              See on Google Maps <span aria-hidden="true">↗</span>
            </a>
            {isOpen && (
              <Link href={R.prayer} className="da-btn da-btn-ghost da-btn-sm">
                Prayer times <span aria-hidden="true">→</span>
              </Link>
            )}
            <a href={ORG.phoneHref} className="da-btn da-btn-ghost da-btn-sm">
              {ORG.phone}
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function LocationsPage() {
  return (
    <main style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      <div className="da-drift-gold" aria-hidden style={{ position: "fixed", width: 480, height: 480, borderRadius: 999, top: "-10%", right: "-8%", background: "radial-gradient(circle, rgba(201,162,39,0.16), transparent 70%)", filter: "blur(10px)", mixBlendMode: "screen", zIndex: 1, pointerEvents: "none" }} />
      <div className="da-drift-green" aria-hidden style={{ position: "fixed", width: 560, height: 560, borderRadius: 999, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.2), transparent 72%)", filter: "blur(10px)", mixBlendMode: "screen", zIndex: 1, pointerEvents: "none" }} />

      <section className="da-section" style={{ position: "relative", zIndex: 2, padding: "clamp(96px,12vw,150px) clamp(16px,4vw,28px) clamp(40px,5vw,60px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <div aria-hidden style={{ position: "absolute", top: -40, right: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <CrescentMoon size={40} glowSize={110} />
          </div>
          <Twinkle top="6%" left="42%" duration={2.6} />
          <Twinkle top="18%" left="66%" size={3} duration={3.2} delay={0.5} />

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ width: 26, height: 1, background: "rgba(201,162,39,0.6)" }} />
            <span style={{ fontSize: 12.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 600 }}>Our locations</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.06, ease }}
            style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(36px,6vw,68px)", lineHeight: 1.06, color: "#f6f3ea", margin: "0 0 20px 0", maxWidth: 760 }}
          >
            Two masjids, <span style={{ color: "#c9a227", fontStyle: "italic" }}>one community.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease }}
            style={{ fontSize: "clamp(15px,1.7vw,17.5px)", lineHeight: 1.7, color: "rgba(246,243,234,0.76)", maxWidth: 620, margin: 0 }}
          >
            Darul Arqum East has served Riverside South since 2020. Darul Arqum West is our second
            masjid, newly acquired on Old Richmond Road.
          </motion.p>
        </div>
      </section>

      <section className="da-section" style={{ position: "relative", zIndex: 2, padding: "0 clamp(16px,4vw,28px) clamp(80px,10vw,130px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: "clamp(22px,3vw,34px)" }}>
          {LOCATION_LIST.map((loc, i) => (
            <LocationPanel key={loc.key} loc={loc} index={i} />
          ))}
        </div>

        <div aria-hidden style={{ position: "absolute", bottom: "-6%", left: "-8%", zIndex: -1, pointerEvents: "none" }}>
          <GeoMedallion size={300} opacity={0.1} />
        </div>
      </section>
    </main>
  );
}
