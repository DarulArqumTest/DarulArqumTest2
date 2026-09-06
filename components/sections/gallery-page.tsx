"use client";

/** Literal, line-for-line port of `Gallery.dc.html`. */

import * as React from "react";
import { Glyph } from "@/components/site/program-glyphs";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import Link from "next/link";
import { Twinkle, CrescentMoon } from "@/components/sections/home-literal";
import { EXT, R } from "@/lib/links";

import { PhotoFrame } from "@/components/site/photo-frame";

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
          <Breadcrumbs items={[{ label: "Gallery" }]} className="mb-5" />
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(34px,4.8vw,54px)", lineHeight: 1.08, color: "#f6f3ea", margin: "0 0 20px 0" }}>Gallery</h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "rgba(246,243,234,0.68)", margin: "0 auto", maxWidth: 560 }}>Moments from the masjid, our community, and the nights that built it.</p>
        </div>
      </section>

      {/* MASJID GALLERY */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "20px 24px 60px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 10 }}>Masjid Gallery</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 28, color: "#f6f3ea", margin: "0 0 24px 0" }}>Our home at Limebank Road.</h2>
          <div className="da-wall">
            <PhotoFrame
              src={HOUSE_IMG}
              alt="Darul Arqum masjid house"
              caption="4269 Limebank Road, Ottawa"
              aspect="1360 / 900"
              onClick={() => setLightboxSrc(HOUSE_IMG)}
            />
          </div>
        </div>
      </section>

      {/* FUNDRAISING EVENT */}
      <section style={{ position: "relative", zIndex: 2, width: "100%", padding: "20px 24px 60px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 10 }}>March 7th, 2020</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 28, color: "#f6f3ea", margin: "0 0 8px 0" }}>Masjid fundraising event</h2>
          <p style={{ fontSize: 14, color: "rgba(246,243,234,0.6)", margin: "0 0 24px 0" }}>Hellenic Meeting &amp; Receptions Centre, Ottawa</p>
          <div className="da-wall">
            <div className="da-wall-row">
              {[FUND1_IMG, FUND2_IMG].map((src, i) => (
                <PhotoFrame
                  key={src}
                  src={src}
                  alt="Fundraising event, March 7 2020"
                  caption="Hellenic Meeting & Receptions Centre"
                  aspect="4 / 3"
                  /* a degree either way, so two frames side by side do not
                     read as one machine-straight row */
                  tilt={i === 0 ? -1.1 : 1.1}
                  onClick={() => setLightboxSrc(src)}
                />
              ))}
            </div>
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
            ["--tint" as string]: "#e8b06a",
          }}
          className="da-panel da-panel-flush da-gal-cta"
        >
          <span className="da-gal-cta-mark" aria-hidden>
            <Glyph name="camera" size={30} />
          </span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p className="da-panel-eyebrow">Every moment here took a volunteer</p>
            <h2 className="da-panel-title">Want to be part of the next photo?</h2>
            <p className="da-panel-copy" style={{ marginTop: 6, maxWidth: 460 }}>
              From event setup to teaching, hospitality, and upkeep — Darul Arqum runs on people who show up. Tell us where you&apos;d like to help.
            </p>
          </div>
          {/* was a pill; solid, hard-edged and squared off now */}
          <Link href={R.community} className="da-solid-btn" style={{ ["--btn" as string]: "linear-gradient(180deg,#f3c98a,#e0a45c)", flexShrink: 0 }}>
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
        <button type="button"
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
