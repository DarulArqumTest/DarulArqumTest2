"use client";

/**
 * Megaphone mark with animated sound waves. Shared by the desktop hero
 * announcement and the mobile banner so the two read as the same object.
 *
 * The waves are three nested arcs whose opacity/scale run on a staggered
 * loop, which is cheaper than animating a filter and reads as "still
 * broadcasting" without demanding attention every frame.
 */

export function Megaphone({ size = 64, tone = "#c9a227" }: { size?: number; tone?: string }) {
  return (
    <span className="da-mega" style={{ width: size, height: size, display: "inline-block", position: "relative", flexShrink: 0 }} aria-hidden>
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="da-mega-horn" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3e2ad" />
            <stop offset="55%" stopColor={tone} />
            <stop offset="100%" stopColor="#8a6a1e" />
          </linearGradient>
        </defs>

        {/* sound waves */}
        {[
          { r: 15, cls: "da-wave-1" },
          { r: 21, cls: "da-wave-2" },
          { r: 27, cls: "da-wave-3" },
        ].map((w) => (
          <path
            key={w.r}
            className={w.cls}
            d={`M 40 ${32 - w.r} A ${w.r} ${w.r} 0 0 1 40 ${32 + w.r}`}
            fill="none"
            stroke={tone}
            strokeWidth="2.6"
            strokeLinecap="round"
            style={{ transformOrigin: "40px 32px" }}
          />
        ))}

        {/* handle */}
        <rect x="9" y="35" width="8" height="15" rx="3" fill="#6b5a2a" transform="rotate(-18 13 42)" />
        {/* body */}
        <path d="M12 24 L28 19 L28 45 L12 40 A3 3 0 0 1 12 24 Z" fill="#5f4a18" />
        {/* horn */}
        <path d="M28 15 L38 11 L38 53 L28 49 Z" fill="url(#da-mega-horn)" />
        <path d="M28 15 L38 11 L38 53 L28 49 Z" fill="none" stroke="#f7e6b4" strokeWidth="1.3" strokeLinejoin="round" opacity="0.75" />
        {/* rim highlight */}
        <ellipse cx="38" cy="32" rx="2.6" ry="21" fill="#f7e6b4" opacity="0.5" />
      </svg>
    </span>
  );
}
