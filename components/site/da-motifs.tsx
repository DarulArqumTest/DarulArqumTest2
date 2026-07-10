import type { CSSProperties } from "react";

/**
 * Decorative Islamic-motif primitives for the 2026 redesign: crescent+lantern,
 * rotating star medallion, twinkles, and a themed ambient background layer.
 * Pure CSS/SVG (no rasters), matching the hand-built motifs from the
 * .dc.html prototypes. All motion respects prefers-reduced-motion via the
 * `amb`-style classnames defined in globals.css (da-* animation classes are
 * already gated there).
 */

/**
 * A static, non-animated version of the two edge <div>s from Darul Arqum
 * Home.dc.html's "gold motion ribbons" markup: same position:fixed/34px/
 * 100vh/pointer-events:none shell and the same dark tile background, but the
 * meander pattern, box-shadow bezel, and scroll/glow animation are
 * deliberately dropped — just a plain dark margin with a thin gold accent
 * line down the inner edge. Used site-wide (mounted once in the root
 * layout), so z-index is kept low (10) to stay under every page's own
 * sticky/fixed header regardless of that header's own z-index.
 */
const EDGE_MARGIN_TILE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="64" viewBox="0 0 36 64">` +
    `<rect width="36" height="64" fill="#12331f"/>` +
    `<rect x="2" width="32" height="64" fill="#0e2419"/>` +
    `<rect x="1" width="1.6" height="64" fill="#d9b64a" opacity="0.55"/>` +
    `<rect x="33.4" width="1.6" height="64" fill="#d9b64a" opacity="0.55"/>` +
    `</svg>`,
)}`;

export function EdgeMargin({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      style={
        {
          position: "fixed",
          top: 0,
          [side]: 0,
          width: 34,
          height: "100vh",
          zIndex: 10,
          pointerEvents: "none",
          backgroundImage: `url("${EDGE_MARGIN_TILE}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "34px 64px",
        } as CSSProperties
      }
    />
  );
}

/** Crescent moon carved from two overlapping circles, with an optional hanging lantern. */
export function CrescentLantern({
  size = 40,
  withLantern = true,
  cutColor = "#0e2419",
  glow = true,
  className = "",
}: {
  size?: number;
  withLantern?: boolean;
  cutColor?: string;
  glow?: boolean;
  className?: string;
}) {
  const moon = size * 0.55;
  return (
    <div className={`relative ${className}`} style={{ width: size, height: withLantern ? size * 1.5 : size }} aria-hidden>
      {glow && (
        <div
          className="da-moon-glow absolute rounded-full"
          style={{
            width: moon * 1.9,
            height: moon * 1.9,
            left: -moon * 0.45,
            top: -moon * 0.45,
            background: "radial-gradient(circle, rgba(201,162,39,0.32), transparent 70%)",
          }}
        />
      )}
      <div className="relative rounded-full" style={{ width: moon, height: moon, background: "#e3c56a" }}>
        <div
          className="absolute rounded-full"
          style={{ width: moon, height: moon, background: cutColor, left: moon * 0.32, top: -moon * 0.1 }}
        />
      </div>
      {withLantern && (
        <div
          className="da-lantern-sway absolute"
          style={{ left: moon * 0.78, top: moon * 0.65 }}
        >
          <div style={{ width: 1.5, height: size * 0.55, background: "rgba(201,162,39,0.4)", marginLeft: (size * 0.16) / 2 }} />
          <div
            className="da-lantern-glow absolute rounded-full blur-md"
            style={{ width: size * 0.5, height: size * 0.5, left: -size * 0.17, top: size * 0.42, background: "rgba(227,197,106,0.4)" }}
          />
          <div
            className="relative"
            style={{
              width: size * 0.16,
              height: size * 0.2,
              marginTop: size * 0.5,
              borderRadius: 2,
              background: "linear-gradient(160deg,#e3c56a,#c9a227)",
              boxShadow: "0 0 14px rgba(227,197,106,0.4)",
            }}
          >
            <div
              className="absolute rounded-[1px]"
              style={{ inset: "22% 28%", background: "#fff3c4", opacity: 0.8 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/** Two overlapping square outlines forming an 8-point star silhouette. */
export function StarMedallion({
  size = 320,
  opacity = 0.16,
  spin = true,
  color = "rgba(201,162,39,0.4)",
  className = "",
}: {
  size?: number;
  opacity?: number;
  spin?: boolean;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute ${spin ? "da-spin-slow" : ""} ${className}`}
      style={{ width: size, height: size, opacity }}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-[6px]" style={{ border: `1.5px solid ${color}` }} />
      <div className="absolute inset-0 rounded-[6px] rotate-45" style={{ border: `1.5px solid ${color}` }} />
    </div>
  );
}

/** Scattered twinkling star dots at fixed (non-random-on-render) positions. */
const TWINKLE_POSITIONS = [
  { top: "8%", left: "12%", delay: "0s" },
  { top: "18%", left: "82%", delay: "0.6s" },
  { top: "34%", left: "6%", delay: "1.2s" },
  { top: "46%", left: "92%", delay: "1.8s" },
  { top: "62%", left: "22%", delay: "0.3s" },
  { top: "72%", left: "70%", delay: "2.1s" },
  { top: "84%", left: "40%", delay: "1.5s" },
  { top: "26%", left: "55%", delay: "0.9s" },
];

export function Twinkles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {TWINKLE_POSITIONS.map((p, i) => (
        <span
          key={i}
          className="da-twinkle absolute rounded-full bg-da-cream"
          style={{ top: p.top, left: p.left, width: 2.5, height: 2.5, animationDelay: p.delay }}
        />
      ))}
    </div>
  );
}

/** Themed ambient backdrop: lattice + drifting gold/green blooms + optional twinkles. */
export function DaAmbient({ stars = false, className = "" }: { stars?: boolean; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden amb ${className}`} aria-hidden>
      <div
        className="da-drift-gold absolute -right-20 -top-24 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "rgba(201,162,39,0.14)", mixBlendMode: "screen" }}
      />
      <div
        className="da-drift-green absolute -bottom-24 -left-16 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ background: "rgba(60,140,100,0.16)", mixBlendMode: "screen" }}
      />
      {stars && <Twinkles />}
    </div>
  );
}
