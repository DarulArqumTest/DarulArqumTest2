"use client";

/**
 * Homepage announcement for the second masjid, Darul Arqum West.
 *
 * Sits directly under the hero so it is the first thing a returning visitor
 * meets. Deliberately the loudest block on the page — a pulsing "newly
 * acquired" badge, a gold hairline frame and the property illustration —
 * because it is a one-off community milestone, not evergreen chrome.
 */

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { LOCATIONS, R } from "@/lib/links";
import { WestPropertyArt } from "@/components/site/west-property-art";

const ease = [0.16, 0.8, 0.4, 1] as const;

export function WestAnnouncement() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const west = LOCATIONS.west;

  return (
    <section
      ref={ref}
      id="west-announcement"
      style={{
        position: "relative",
        width: "100%",
        padding: "clamp(64px,9vw,110px) clamp(16px,4vw,28px)",
        overflow: "hidden",
        background: "linear-gradient(170deg, #0e2419 0%, #10301f 50%, #0a1f15 100%)",
        scrollMarginTop: 80,
      }}
    >
      <div
        className="da-float-slow"
        aria-hidden
        style={{ position: "absolute", width: 520, height: 520, borderRadius: 999, top: "-16%", left: "-10%", background: "radial-gradient(circle, rgba(169,224,192,0.16), transparent 70%)", filter: "blur(8px)" }}
      />
      <div
        className="da-float-slow"
        aria-hidden
        style={{ position: "absolute", width: 460, height: 460, borderRadius: 999, bottom: "-18%", right: "-8%", background: "radial-gradient(circle, rgba(201,162,39,0.18), transparent 70%)", filter: "blur(8px)", animationDelay: "2.2s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease }}
        className="da-west-frame"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1180,
          margin: "0 auto",
          borderRadius: 26,
          padding: "clamp(20px,3vw,34px)",
          background: "linear-gradient(150deg, rgba(246,243,234,0.06), rgba(246,243,234,0.02))",
          border: "1px solid rgba(201,162,39,0.42)",
          boxShadow: "0 40px 90px -40px rgba(0,0,0,0.7)",
        }}
      >
        <div className="da-west-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(22px,3.4vw,44px)", alignItems: "center" }}>
          {/* ── copy ── */}
          <div style={{ minWidth: 0 }}>
            <div className="da-west-badge" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 16px", borderRadius: 999, background: "linear-gradient(120deg, rgba(201,162,39,0.28), rgba(169,224,192,0.18))", border: "1px solid rgba(227,197,106,0.55)", marginBottom: 20 }}>
              <span className="da-live-pulse" aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: "#e3c56a", flexShrink: 0 }} />
              <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#f3e2ad", fontWeight: 800 }}>
                Newly acquired
              </span>
            </div>

            <h2
              className="da-west-title"
              style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.08, color: "#f6f3ea", margin: "0 0 8px 0" }}
            >
              A second masjid.{" "}
              <span className="da-shine" style={{ fontStyle: "italic", backgroundImage: "linear-gradient(100deg,#c9a227,#f3e2ad,#c9a227)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                Darul Arqum West.
              </span>
            </h2>

            <p style={{ fontSize: "clamp(14.5px,1.5vw,16.5px)", lineHeight: 1.7, color: "rgba(246,243,234,0.76)", margin: "0 0 24px 0", maxWidth: 520 }}>
              {west.blurb}
            </p>

            <div className="da-west-addr" style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "16px 18px", borderRadius: 14, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(246,243,234,0.14)", marginBottom: 24 }}>
              <span aria-hidden style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 999, background: "rgba(169,224,192,0.16)", border: "1px solid rgba(169,224,192,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="18" viewBox="0 0 15 18" aria-hidden>
                  <path d="M7.5 1C4.46 1 2 3.46 2 6.5c0 4.1 5.5 10 5.5 10S13 10.6 13 6.5C13 3.46 10.54 1 7.5 1Z" fill="none" stroke="#a9e0c0" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="7.5" cy="6.4" r="2.1" fill="#a9e0c0" />
                </svg>
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 800, marginBottom: 4 }}>
                  {west.statusLabel}
                </div>
                <div style={{ fontSize: "clamp(14px,1.6vw,17px)", color: "#f6f3ea", fontWeight: 700, lineHeight: 1.35, overflowWrap: "anywhere" }}>
                  {west.street}
                </div>
                <div style={{ fontSize: 13, color: "rgba(246,243,234,0.6)" }}>{west.city}</div>
              </div>
            </div>

            <div className="da-west-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a
                href={west.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="da-btn da-btn-gold"
              >
                See on Google Maps <span aria-hidden="true">↗</span>
              </a>
              <Link href={R.locations} className="da-btn da-btn-ghost">
                Both locations <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* ── artwork ── */}
          <div className="da-west-art" style={{ position: "relative", minWidth: 0 }}>
            <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(201,162,39,0.34)", boxShadow: "0 30px 70px -30px rgba(0,0,0,0.65)", aspectRatio: "8 / 5" }}>
              <WestPropertyArt />
              <div
                aria-hidden
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 18px 13px", background: "linear-gradient(180deg, transparent, rgba(6,18,12,0.85))", fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(246,243,234,0.72)", fontWeight: 700 }}
              >
                {west.name} · {west.street}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
