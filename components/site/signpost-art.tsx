/**
 * A fingerpost, for the panel that asks which class you belong in.
 *
 * "Not sure which one fits?" is a question about direction, so the mark is
 * the thing you look at when you don't know which way to go: a post in the
 * ground with three painted boards on it, each pointing somewhere different.
 * Green, gold and red are the site's own three, so the boards read as the
 * programmes without having to name them.
 *
 * Drawn rather than iconified — the post has grain, the boards have nail
 * heads and worn paint, and there is a star over it — because the panel it
 * sits in is meant to feel like somebody offering to help, not a form field.
 */
export function SignpostArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 116"
      className={className}
      aria-hidden
      focusable="false"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="da-sp-post" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a6a44" />
          <stop offset="45%" stopColor="#6b4f30" />
          <stop offset="100%" stopColor="#4d3620" />
        </linearGradient>
        <linearGradient id="da-sp-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c8557" />
          <stop offset="100%" stopColor="#1a5c3b" />
        </linearGradient>
        <linearGradient id="da-sp-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d888" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
        <linearGradient id="da-sp-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e35244" />
          <stop offset="100%" stopColor="#bc3125" />
        </linearGradient>
      </defs>

      {/* the ground it stands in */}
      <ellipse cx="48" cy="104" rx="29" ry="6.5" fill="#0b2015" opacity="0.85" />
      <ellipse cx="48" cy="102.5" rx="20" ry="4" fill="#1b4a30" opacity="0.7" />
      <path
        d="M28 101c1.5-4 2.4-6 2.4-6M33 102c.6-3 .4-5.2.4-5.2M63 102c1.1-3.4 2.3-5.4 2.3-5.4M69 100.6c.5-2.4 1.6-4 1.6-4"
        stroke="#7cc99a"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
        fill="none"
      />

      {/* the post */}
      <rect x="43.5" y="20" width="9" height="83" rx="1.5" fill="url(#da-sp-post)" />
      <path d="M46.4 24v76M49.6 26v72" stroke="#38260f" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
      <path d="M43.5 20h9l-1.6-3.4h-5.8Z" fill="#8a6a44" />

      {/* top board, pointing right */}
      <g>
        <path d="M50 27h30l7 7.5-7 7.5H50Z" fill="url(#da-sp-green)" stroke="#0a1a12" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M55 32h20M55 37h14" stroke="#eaf6ee" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* middle board, pointing left */}
      <g>
        <path d="M46 49H16l-7 7.5 7 7.5h30Z" fill="url(#da-sp-gold)" stroke="#0a1a12" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M20 54h21M20 59h13" stroke="#3a2b06" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* bottom board, pointing right */}
      <g>
        <path d="M50 71h26l7 7.5-7 7.5H50Z" fill="url(#da-sp-red)" stroke="#0a1a12" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M55 76h16M55 81h11" stroke="#fdeeec" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* nail heads holding the boards on */}
      <circle cx="48" cy="34.5" r="1.6" fill="#d9dde0" />
      <circle cx="48" cy="56.5" r="1.6" fill="#d9dde0" />
      <circle cx="48" cy="78.5" r="1.6" fill="#d9dde0" />

      {/* one star over the whole thing */}
      <path
        d="M76 9.5 77.6 13l3.9.5-2.8 2.7.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.7 3.9-.5Z"
        fill="#e3c56a"
        opacity="0.9"
      />
    </svg>
  );
}
