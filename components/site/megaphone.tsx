"use client";

/**
 * Megaphone, coloured from the emoji reference: red grip and rear body, a
 * pale grey/white cone with a dark teal throat, pointing right. The sound
 * arcs are white — the "speaking" lines, not part of the horn — and run on a
 * staggered loop so it reads as actively broadcasting.
 *
 * Shared by the hero announcement and the phone dock so the two are plainly
 * the same object at two sizes.
 */

export function Megaphone({ size = 72, facing = "left" }: { size?: number; facing?: "left" | "right" }) {
  return (
    <span
      className="da-mega"
      style={{
        width: size,
        height: size,
        display: "inline-block",
        flexShrink: 0,
        // drawn pointing right; flip the whole mark to aim it at the bubble
        transform: facing === "left" ? "scaleX(-1)" : undefined,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 96 96" width={size} height={size} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="da-mg-cone" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#eceff1" />
            <stop offset="100%" stopColor="#c9d0d4" />
          </linearGradient>
          <linearGradient id="da-mg-mouth" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2f5c6e" />
            <stop offset="100%" stopColor="#16303c" />
          </linearGradient>
          <linearGradient id="da-mg-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2564a" />
            <stop offset="100%" stopColor="#d63a2e" />
          </linearGradient>
        </defs>

        {/* ── white speaking lines ── */}
        <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="4.4">
          <path className="da-wave-1" d="M74 40 A 11 11 0 0 1 74 56" style={{ transformOrigin: "70px 48px" }} />
          <path className="da-wave-2" d="M82 32 A 20 20 0 0 1 82 64" style={{ transformOrigin: "70px 48px" }} />
          <path className="da-wave-3" d="M90 24 A 29 29 0 0 1 90 72" style={{ transformOrigin: "70px 48px" }} />
        </g>

        {/* ── grip ── */}
        <path d="M22 60 L34 66 L28 84 A 6 6 0 0 1 16 80 Z" fill="#d63a2e" />
        <rect x="27" y="61" width="9" height="12" rx="3" fill="#4a5157" transform="rotate(22 31 67)" />

        {/* ── rear body (red) ── */}
        <path d="M14 36 H40 V62 H14 A 5 5 0 0 1 14 36 Z" fill="url(#da-mg-red)" />
        <path d="M14 36 H40 V45 H14 Z" fill="#ff7a6b" opacity="0.55" />

        {/* ── cone ── */}
        <path d="M40 30 C 52 32 58 22 66 18 L66 78 C 58 74 52 64 40 66 Z" fill="url(#da-mg-cone)" />
        <path d="M40 30 C 52 32 58 22 66 18 L66 78 C 58 74 52 64 40 66 Z" fill="none" stroke="#b6bfc4" strokeWidth="1.6" strokeLinejoin="round" />

        {/* ── mouth ── */}
        <ellipse cx="66" cy="48" rx="7" ry="30" fill="url(#da-mg-mouth)" />
        <ellipse cx="67.5" cy="48" rx="3.4" ry="15" fill="#dfe5e8" opacity="0.85" />

        {/* highlight down the cone */}
        <path d="M52 30 C 56 34 57 60 52 66" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      </svg>
    </span>
  );
}
