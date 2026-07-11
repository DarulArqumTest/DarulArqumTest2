"use client";

/** Literal, line-for-line port of `Gallery.dc.html`. */

import * as React from "react";
import Link from "next/link";
import { Twinkle, CrescentMoon } from "@/components/sections/home-literal";
import { EXT, R } from "@/lib/links";

const HOUSE_IMG = "/assets/hero-house.jpg";
const FUND1_IMG = EXT.galleryFundraising1;
const FUND2_IMG = EXT.galleryFundraising2;

export function GalleryPage() {
  const [lightboxSrc, setLightboxSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightboxSrc(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      <div style={{ position: "absolute", top: "44%", left: -70, width: 220, height: 220, zIndex: 1, pointerEvents: "none", opacity: 0.3 }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(201,162,39,0.18)" }} />
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(201,162,39,0.18)", transform: "rotate(45deg)" }} />
      </div>
      <div style={{ position: "absolute", top: "34%", right: "6%", zIndex: 1, pointerEvents: "none" }}>
        <CrescentMoon size={46} glowSize={0} glowOpacity={0} />
      </div>
      <div style={{ position: "absolute", top: "78%", right: -90, width: 230, height: 230, zIndex: 1, pointerEvents: "none", opacity: 0.3 }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(120,190,150,0.18)" }} />
        <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(120,190,150,0.18)", transform: "rotate(45deg)" }} />
      </div>
      <div style={{ position: "absolute", top: "90%", left: "12%", zIndex: 1, pointerEvents: "none" }}>
        <CrescentMoon size={40} glowSize={0} glowOpacity={0} />
      </div>

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "64px 24px 46px", textAlign: "center", background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,162,39,0.10), transparent 70%)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700, marginBottom: 14 }}>Darul Arqum · Ottawa</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(34px,4.8vw,54px)", lineHeight: 1.08, color: "#f6f3ea", margin: "0 0 20px 0" }}>Gallery</h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "rgba(246,243,234,0.68)", margin: "0 auto", maxWidth: 560 }}>Moments from the masjid, our community, and the nights that built it.</p>
        </div>
      </section>

      {/* MASJID GALLERY */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "20px 24px 60px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 10 }}>Masjid Gallery</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 28, color: "#f6f3ea", margin: "0 0 24px 0" }}>Our home at Limebank Road.</h2>
          <div
            onClick={() => setLightboxSrc(HOUSE_IMG)}
            style={{ cursor: "zoom-in", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(201,162,39,0.3)", boxShadow: "0 24px 60px -24px rgba(0,0,0,0.5)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HOUSE_IMG} alt="Darul Arqum masjid house" style={{ width: "100%", maxHeight: 560, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* FUNDRAISING EVENT */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "20px 24px 60px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 10 }}>March 7th, 2020</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 28, color: "#f6f3ea", margin: "0 0 8px 0" }}>Masjid fundraising event</h2>
          <p style={{ fontSize: 14, color: "rgba(246,243,234,0.6)", margin: "0 0 24px 0" }}>Hellenic Meeting &amp; Receptions Centre, Ottawa</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            {[FUND1_IMG, FUND2_IMG].map((src) => (
              <div
                key={src}
                onClick={() => setLightboxSrc(src)}
                style={{ cursor: "zoom-in", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(201,162,39,0.25)", aspectRatio: "1141/344", background: "#122d20" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Fundraising event, March 7 2020" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOLUNTEER CTA */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "0 24px 80px" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 24,
            borderRadius: 22,
            padding: "34px 36px",
            background: "radial-gradient(ellipse 90% 130% at 0% 0%, rgba(217,143,74,0.16), transparent 65%), linear-gradient(155deg, rgba(22,56,38,0.72), rgba(13,35,24,0.55))",
            border: "1px solid rgba(217,143,74,0.32)",
            boxShadow: "0 24px 60px -28px rgba(0,0,0,0.55)",
          }}
        >
          <span
            style={{
              flexShrink: 0,
              width: 54,
              height: 54,
              borderRadius: 999,
              background: "rgba(217,143,74,0.16)",
              border: "1.5px solid rgba(232,176,106,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden
          >
            <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
              <path
                d="M13 14 C13 14 8.3 10.2 8.3 7.1 C8.3 4.8 10.5 3.3 12.6 4.5 C12.8 4.6 13 4.8 13 4.8 C13 4.8 13.2 4.6 13.4 4.5 C15.5 3.3 17.7 4.8 17.7 7.1 C17.7 10.2 13 14 13 14 Z"
                stroke="#e8b06a"
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
              <path
                d="M4 24 C4 18.5 7.2 16.3 13 16.3 C18.8 16.3 22 18.5 22 24"
                stroke="#e8b06a"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e8b06a", fontWeight: 700, marginBottom: 6 }}>
              Every moment here took a volunteer
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 22, color: "#f6f3ea", margin: 0 }}>
              Want to be part of the next photo?
            </p>
            <p style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", maxWidth: 460 }}>
              From event setup to teaching, hospitality, and upkeep — Darul Arqum runs on people who show up. Tell us where you&apos;d like to help.
            </p>
          </div>
          <Link
            href={R.community}
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "linear-gradient(135deg,#f3c98a,#e8b06a)",
              color: "#0e2419",
              fontWeight: 700,
              fontSize: 14,
              padding: "13px 26px",
              borderRadius: 999,
              boxShadow: "0 14px 30px -8px rgba(217,143,74,0.5)",
            }}
          >
            Join as a volunteer <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* LIGHTBOX */}
      <div
        onClick={() => setLightboxSrc(null)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(6,16,11,0.88)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          opacity: lightboxSrc ? 1 : 0,
          pointerEvents: lightboxSrc ? "auto" : "none",
          transition: "opacity .25s ease",
          cursor: "zoom-out",
        }}
      >
        {lightboxSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lightboxSrc}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12, boxShadow: "0 40px 90px -20px rgba(0,0,0,0.7)", transform: "scale(1)", transition: "transform .3s cubic-bezier(.2,.8,.3,1)" }}
          />
        )}
        <button
          onClick={() => setLightboxSrc(null)}
          aria-label="Close"
          style={{ position: "absolute", top: 24, right: 28, width: 40, height: 40, borderRadius: 999, background: "rgba(246,243,234,0.1)", border: "1px solid rgba(246,243,234,0.3)", color: "#f6f3ea", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
