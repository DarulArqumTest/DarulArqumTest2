/**
 * The 404 illustration: a lantern that has gone out.
 *
 * Drawn rather than borrowed, and drawn from the site's own vocabulary —
 * the same hanging lanterns that light the prayer-times and giving pages,
 * only this one is dark, with a curl of smoke off the vent and a moth still
 * circling a wick that isn't burning. One ember is left in the base, which
 * is the whole joke: the page isn't here, but the light hasn't gone out.
 *
 * Pure SVG, no image request, and every moving part is a CSS animation that
 * `prefers-reduced-motion` already switches off.
 */
export function LostLantern() {
  return (
    <div className="da-404-art" aria-hidden>
      <svg viewBox="0 0 240 300" width="100%" height="100%" role="presentation">
        <defs>
          <linearGradient id="da404-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e3c56a" />
            <stop offset="52%" stopColor="#a9861f" />
            <stop offset="100%" stopColor="#6d5613" />
          </linearGradient>
          <linearGradient id="da404-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14261d" />
            <stop offset="100%" stopColor="#0a1a12" />
          </linearGradient>
          <radialGradient id="da404-ember" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffd489" />
            <stop offset="45%" stopColor="#e08a3c" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#e08a3c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* night */}
        <g className="da-404-stars">
          <circle cx="34" cy="52" r="1.7" fill="#f6f3ea" opacity="0.55" />
          <circle cx="206" cy="74" r="1.3" fill="#f6f3ea" opacity="0.45" />
          <circle cx="186" cy="34" r="1" fill="#e3c56a" opacity="0.6" />
          <circle cx="52" cy="128" r="1.1" fill="#f6f3ea" opacity="0.35" />
          <circle cx="196" cy="182" r="1.5" fill="#e3c56a" opacity="0.4" />
        </g>

        {/* the smoke, still leaving */}
        <g className="da-404-smoke">
          <path
            d="M120 74 C112 60 130 52 122 38 C116 27 128 20 124 8"
            fill="none"
            stroke="#f6f3ea"
            strokeOpacity="0.3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M129 72 C136 62 124 54 132 44"
            fill="none"
            stroke="#f6f3ea"
            strokeOpacity="0.16"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>

        <g className="da-404-lamp">
          {/* the cord it still hangs from */}
          <line x1="120" y1="0" x2="120" y2="82" stroke="url(#da404-brass)" strokeWidth="2" />
          <circle cx="120" cy="84" r="4" fill="url(#da404-brass)" />

          {/* cap */}
          <path d="M120 88 L150 108 L90 108 Z" fill="url(#da404-brass)" />
          <rect x="86" y="107" width="68" height="7" rx="3" fill="url(#da404-brass)" />

          {/* body: an ogee lantern, the shape used all over the site */}
          <path
            d="M92 114 C78 140 78 176 92 206 L148 206 C162 176 162 140 148 114 Z"
            fill="url(#da404-glass)"
            stroke="url(#da404-brass)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* the girih star inside the glass, dark because nothing is lit */}
          <g stroke="#c9a227" strokeOpacity="0.3" strokeWidth="1.6" fill="none">
            <rect x="104" y="142" width="32" height="32" />
            <rect x="104" y="142" width="32" height="32" transform="rotate(45 120 158)" />
          </g>
          {/* ribs */}
          <path d="M120 114 L120 206" stroke="#c9a227" strokeOpacity="0.22" strokeWidth="1.4" />

          {/* base and finial */}
          <rect x="86" y="204" width="68" height="8" rx="3" fill="url(#da404-brass)" />
          <path d="M104 212 L136 212 L126 226 L114 226 Z" fill="url(#da404-brass)" />
          <circle cx="120" cy="232" r="4.5" fill="url(#da404-brass)" />

          {/* one ember left in the base */}
          <circle className="da-404-ember-glow" cx="120" cy="196" r="17" fill="url(#da404-ember)" />
          <circle className="da-404-ember" cx="120" cy="196" r="3.4" fill="#ffcf82" />
        </g>

        {/* the moth, still circling a wick that isn't burning */}
        <g className="da-404-moth">
          <g transform="translate(0 0)">
            <ellipse cx="0" cy="0" rx="2" ry="5" fill="#e8dfc4" opacity="0.85" />
            <path d="M-1 -3 C-11 -10 -15 -2 -8 3 C-5 5 -2 3 -1 1 Z" fill="#f2ead2" opacity="0.75" />
            <path d="M1 -3 C11 -10 15 -2 8 3 C5 5 2 3 1 1 Z" fill="#f2ead2" opacity="0.75" />
            <line x1="-1" y1="-5" x2="-4" y2="-9" stroke="#e8dfc4" strokeWidth="0.8" opacity="0.7" />
            <line x1="1" y1="-5" x2="4" y2="-9" stroke="#e8dfc4" strokeWidth="0.8" opacity="0.7" />
          </g>
        </g>

        {/* the ground it would have stood on */}
        <ellipse cx="120" cy="262" rx="62" ry="7" fill="#000" opacity="0.35" />
        <ellipse cx="120" cy="262" rx="30" ry="4" fill="#c9a227" opacity="0.08" />
      </svg>
    </div>
  );
}
