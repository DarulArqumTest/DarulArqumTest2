/**
 * The welearn desk — the homepage's own art, redrawn as SVG so it can fill
 * any box it is given.
 *
 * The programme card and detail page were showing the Zoom wordmark instead,
 * which is accurate and generic: it says which app the class runs on, not
 * what the class is. This is the desk you sit at for it — a mus'haf, reading
 * glasses, a pen, and the screen with the class already open on it. The
 * Zoom mark still appears where it belongs, on the button that joins.
 *
 * The original lives as absolutely positioned divs inside a fixed-height
 * card on the homepage; as SVG it scales into a 168px card banner and a
 * 380px masthead without being rebuilt for each.
 */
export function WelearnArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 120"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
      focusable="false"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="da-wl-desk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a6a44" />
          <stop offset="50%" stopColor="#6b4f30" />
          <stop offset="100%" stopColor="#55391f" />
        </linearGradient>
        <linearGradient id="da-wl-book" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a2020" />
          <stop offset="100%" stopColor="#6b1414" />
        </linearGradient>
        <linearGradient id="da-wl-screen" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#1a3c2a" />
          <stop offset="100%" stopColor="#0e2419" />
        </linearGradient>
        <pattern id="da-wl-planks" width="34" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <rect width="34" height="120" fill="none" />
          <rect width="2" height="120" fill="#000" opacity="0.09" />
        </pattern>
      </defs>

      <rect width="320" height="120" fill="url(#da-wl-desk)" />
      <rect width="320" height="120" fill="url(#da-wl-planks)" />

      {/* the mus'haf, set down at an angle */}
      <g transform="rotate(-6 44 54)">
        <rect x="22" y="24" width="46" height="58" rx="2.5" fill="url(#da-wl-book)" />
        <rect x="25.5" y="27.5" width="39" height="51" rx="1.5" fill="none" stroke="#e3c56a" strokeOpacity="0.6" />
        <path d="M28 32h34" stroke="#e3c56a" strokeOpacity="0.7" strokeWidth="1.2" strokeDasharray="3 3" />
        <rect x="66" y="26" width="3.5" height="54" rx="1.5" fill="#f2ead2" opacity="0.55" />
      </g>

      {/* a pen laid across it */}
      <g transform="rotate(-6 46 20)">
        <rect x="16" y="17" width="46" height="4" rx="2" fill="#2c333a" />
        <rect x="55" y="17" width="7" height="4" rx="1.5" fill="#c9a227" />
        <circle cx="15" cy="19" r="4" fill="#cfd4d8" />
      </g>

      {/* reading glasses */}
      <g stroke="#1c2126" strokeOpacity="0.85" strokeWidth="2.4" fill="none">
        <ellipse cx="34" cy="99" rx="12" ry="8.5" />
        <ellipse cx="62" cy="99" rx="12" ry="8.5" />
        <path d="M46 97h4" />
      </g>

      {/* the screen, class already open */}
      <g transform="rotate(3 236 52)">
        <rect x="180" y="12" width="112" height="80" rx="9" fill="#15181c" stroke="#ffffff" strokeOpacity="0.09" />
        <rect x="186" y="18" width="100" height="68" rx="6" fill="url(#da-wl-screen)" />
        <circle cx="236" cy="44" r="13" fill="#e3c56a" fillOpacity="0.16" stroke="#e3c56a" strokeOpacity="0.55" />
        <path d="M232.5 38.5 243 44l-10.5 5.5Z" fill="#e3c56a" />
        <text
          x="236"
          y="70"
          textAnchor="middle"
          fill="#f6f3ea"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="13"
          fontWeight="600"
        >
          welearn
        </text>
        <rect x="223" y="91" width="26" height="3.4" rx="1.7" fill="#ffffff" opacity="0.14" />
      </g>

      {/* a pencil, where somebody put it down */}
      <g transform="rotate(18 214 74)">
        <rect x="194" y="72" width="40" height="4.4" rx="2.2" fill="#c9a227" />
        <path d="M234 72l7 2.2-7 2.2Z" fill="#8a6a1e" />
      </g>
    </svg>
  );
}
