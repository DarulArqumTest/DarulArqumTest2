"use client";

/**
 * Homepage announcement for the second masjid, Darul Arqum West.
 *
 * Themed around the megaphone so it reads as the same announcement as the
 * floating banner rather than an unrelated block: the headline sits in a
 * speech bubble coming off the horn, and the property photo and map card
 * follow underneath.
 */

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { LOCATIONS, ORG, R } from "@/lib/links";
import { LocationPhoto } from "@/components/site/location-photo";
import { Megaphone } from "@/components/site/megaphone";

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
      <div className="da-float-slow" aria-hidden style={{ position: "absolute", width: 520, height: 520, borderRadius: 999, top: "-16%", left: "-10%", background: "radial-gradient(circle, rgba(169,224,192,0.16), transparent 70%)", filter: "blur(8px)" }} />
      <div className="da-float-slow" aria-hidden style={{ position: "absolute", width: 460, height: 460, borderRadius: 999, bottom: "-18%", right: "-8%", background: "radial-gradient(circle, rgba(201,162,39,0.18), transparent 70%)", filter: "blur(8px)", animationDelay: "2.2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease }}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1180,
          margin: "0 auto",
          borderRadius: 26,
          padding: "clamp(22px,3vw,36px)",
          background: "linear-gradient(150deg, rgba(246,243,234,0.06), rgba(246,243,234,0.02))",
          border: "1px solid rgba(201,162,39,0.42)",
          boxShadow: "0 40px 90px -40px rgba(0,0,0,0.7)",
        }}
      >
        {/* ── megaphone + speech bubble ── */}
        <div className="da-west-shout">
          <Megaphone size={78} />
          <div className="da-bubble">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <span className="da-live-pulse" aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: "#e3c56a", flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#f3e2ad", fontWeight: 800 }}>
                We have a new location
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(30px,4.4vw,50px)", lineHeight: 1.08, color: "#f6f3ea", margin: "0 0 10px 0" }}>
              Introducing{" "}
              <span className="da-shine" style={{ fontStyle: "italic", backgroundImage: "linear-gradient(100deg,#c9a227,#f7e6b4,#c9a227)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                {west.name}.
              </span>
            </h2>
            <p style={{ fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.65, color: "rgba(246,243,234,0.76)", margin: 0, maxWidth: 560 }}>
              {west.blurb}
            </p>
          </div>
        </div>

        {/* ── photo + map ── */}
        <div className="da-west-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "clamp(18px,2.6vw,30px)", marginTop: "clamp(22px,3vw,32px)" }}>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(201,162,39,0.34)", boxShadow: "0 30px 70px -30px rgba(0,0,0,0.65)", aspectRatio: "8 / 5", background: "#0a1f15" }}>
            <LocationPhoto loc={west} />
            <span style={{ position: "absolute", top: 14, left: 14, display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999, background: "rgba(8,22,15,0.86)", backdropFilter: "blur(8px)", border: "1px solid rgba(169,224,192,0.5)" }}>
              <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: "#a9e0c0", flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, letterSpacing: "0.13em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 800 }}>{west.statusLabel}</span>
            </span>
          </div>

          <div style={{ borderRadius: 18, overflow: "hidden", background: "rgba(246,243,234,0.04)", border: "1px solid rgba(246,243,234,0.14)", display: "flex", flexDirection: "column" }}>
            <iframe
              title={`${west.name} map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(west.embedQuery)}&output=embed`}
              loading="lazy"
              style={{ width: "100%", flex: 1, minHeight: 168, border: 0, display: "block" }}
            />
            <div style={{ padding: "18px 20px", background: "rgba(8,22,15,0.5)", flexShrink: 0 }}>
              <div style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 800, marginBottom: 6 }}>
                Find the property
              </div>
              <div className="da-wrap-any" style={{ fontSize: "clamp(14px,1.5vw,16px)", color: "#f6f3ea", fontWeight: 700, lineHeight: 1.4, marginBottom: 14 }}>
                {west.address}
              </div>
              <div className="da-west-cta" style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                <a href={west.mapsUrl} target="_blank" rel="noopener noreferrer" className="da-btn da-btn-gold da-btn-sm">
                  Get directions <span aria-hidden="true">↗</span>
                </a>
                <Link href={R.locations} className="da-btn da-btn-ghost da-btn-sm">
                  Both locations <span aria-hidden="true">→</span>
                </Link>
                <a href={ORG.phoneHref} className="da-btn da-btn-ghost da-btn-sm">
                  {ORG.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
