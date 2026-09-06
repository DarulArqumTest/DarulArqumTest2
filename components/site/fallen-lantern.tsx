/**
 * The 500 illustration: the same lantern, down but still burning.
 *
 * The 404's lantern has gone out — the page genuinely is not there. This is
 * the other failure: the page exists and something broke on the way to it,
 * so the lantern has come off its cord and is lying tilted on the ground
 * with a cracked pane. The flame is still going, because the thing to say
 * here is "try again", not "give up". The moth has followed it down.
 *
 * Same lantern, same brass, same girih star in the glass as the 404, so the
 * two pages read as a pair rather than two unrelated drawings.
 */
export function FallenLantern() {
  return (
    <div className="da-404-art" aria-hidden>
      <svg viewBox="0 0 240 300" width="100%" height="100%" role="presentation">
        <defs>
          <linearGradient id="da500-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e3c56a" />
            <stop offset="52%" stopColor="#a9861f" />
            <stop offset="100%" stopColor="#6d5613" />
          </linearGradient>
          <linearGradient id="da500-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#17352a" />
            <stop offset="100%" stopColor="#0a1a12" />
          </linearGradient>
          <radialGradient id="da500-flame" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffe6a8" />
            <stop offset="42%" stopColor="#e8a63c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e8a63c" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="da-404-stars">
          <circle cx="38" cy="46" r="1.7" fill="#f6f3ea" opacity="0.5" />
          <circle cx="202" cy="66" r="1.3" fill="#f6f3ea" opacity="0.4" />
          <circle cx="180" cy="30" r="1" fill="#e3c56a" opacity="0.55" />
          <circle cx="58" cy="120" r="1.1" fill="#f6f3ea" opacity="0.3" />
        </g>

        {/* the cord it came off, frayed where it gave way */}
        <g>
          <line x1="120" y1="0" x2="120" y2="58" stroke="url(#da500-brass)" strokeWidth="2" />
          <g stroke="#c9a227" strokeOpacity="0.75" strokeWidth="1.3" strokeLinecap="round">
            <path d="M120 58 L116 68" />
            <path d="M120 58 L123 69" />
            <path d="M120 58 L127 66" />
          </g>
        </g>

        {/* the lantern, tipped and resting on the ground */}
        <g transform="rotate(-17 120 250)">
          <g transform="translate(0 42)">
            {/* the broken hanger */}
            <circle cx="120" cy="84" r="4" fill="url(#da500-brass)" />
            <path d="M120 88 L150 108 L90 108 Z" fill="url(#da500-brass)" />
            <rect x="86" y="107" width="68" height="7" rx="3" fill="url(#da500-brass)" />

            <path
              d="M92 114 C78 140 78 176 92 206 L148 206 C162 176 162 140 148 114 Z"
              fill="url(#da500-glass)"
              stroke="url(#da500-brass)"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* the girih star, lit from inside this time */}
            <g stroke="#e3c56a" strokeOpacity="0.5" strokeWidth="1.6" fill="none">
              <rect x="104" y="142" width="32" height="32" />
              <rect x="104" y="142" width="32" height="32" transform="rotate(45 120 158)" />
            </g>

            {/* the crack across the pane */}
            <g stroke="#f6f3ea" strokeOpacity="0.55" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <path d="M96 132 L118 152 L108 170 L124 192" />
              <path d="M118 152 L138 146" />
              <path d="M108 170 L90 178" />
            </g>

            <rect x="86" y="204" width="68" height="8" rx="3" fill="url(#da500-brass)" />
            <path d="M104 212 L136 212 L126 226 L114 226 Z" fill="url(#da500-brass)" />
            <circle cx="120" cy="232" r="4.5" fill="url(#da500-brass)" />

            {/* still burning */}
            <circle className="da-404-ember-glow" cx="120" cy="180" r="26" fill="url(#da500-flame)" />
            <path
              className="da-500-flame"
              d="M120 162 C 128 172 132 179 132 185 a12 12 0 0 1-24 0 c0-7 6-13 12-23 Z"
              fill="#ffcf82"
            />
            <path d="M120 174 c4 5 6 9 6 12a6 6 0 0 1-12 0c0-3 3-7 6-12Z" fill="#fff4cf" />
          </g>
        </g>

        {/* two pieces of the pane, where they landed */}
        <g fill="#cfe3d6" opacity="0.5">
          <path d="M64 258 L78 250 L74 262 Z" />
          <path d="M176 262 L188 254 L190 265 Z" />
        </g>

        {/* the moth came down with it */}
        <g className="da-404-moth">
          <g transform="translate(0 0)">
            <ellipse cx="0" cy="0" rx="2" ry="5" fill="#e8dfc4" opacity="0.85" />
            <path d="M-1 -3 C-11 -10 -15 -2 -8 3 C-5 5 -2 3 -1 1 Z" fill="#f2ead2" opacity="0.75" />
            <path d="M1 -3 C11 -10 15 -2 8 3 C5 5 2 3 1 1 Z" fill="#f2ead2" opacity="0.75" />
            <line x1="-1" y1="-5" x2="-4" y2="-9" stroke="#e8dfc4" strokeWidth="0.8" opacity="0.7" />
            <line x1="1" y1="-5" x2="4" y2="-9" stroke="#e8dfc4" strokeWidth="0.8" opacity="0.7" />
          </g>
        </g>

        <ellipse cx="120" cy="268" rx="66" ry="7" fill="#000" opacity="0.38" />
        <ellipse cx="120" cy="268" rx="34" ry="4" fill="#e8a63c" opacity="0.12" />
      </svg>
    </div>
  );
}
