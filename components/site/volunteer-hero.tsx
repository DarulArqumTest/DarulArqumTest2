/**
 * The volunteer page's hero: the masjid on the night of an event, being set up.
 *
 * What was here before was three abstract line-drawings of raised hands under
 * an arch — which reads as prayer, not as volunteering, and did not say what
 * the page is for. Volunteering at a masjid is a concrete thing: the tables
 * are out, the chairs are being carried in, the urn is on, the lights are
 * strung, and somebody is up a ladder doing it before anyone else arrives.
 *
 * Drawn rather than photographed, because the site has no photograph of that
 * and a stock one would be a lie. Inline SVG, one scene, no request. The only
 * motion is the strung lights and the steam, both of which stop under
 * prefers-reduced-motion.
 */
export function VolunteerHero() {
  return (
    <div className="da-vol-hero" aria-hidden>
      <svg viewBox="0 0 900 300" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" role="presentation">
        <defs>
          <linearGradient id="da-vh-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b1f16" />
            <stop offset="100%" stopColor="#14311f" />
          </linearGradient>
          <linearGradient id="da-vh-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4029" />
            <stop offset="100%" stopColor="#0e2419" />
          </linearGradient>
          <radialGradient id="da-vh-warm" cx="50%" cy="90%" r="62%">
            <stop offset="0%" stopColor="#e8b06a" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#e8b06a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="900" height="300" fill="url(#da-vh-night)" />
        <rect width="900" height="300" fill="url(#da-vh-warm)" />

        {/* the hall: an arcade of arches behind everything */}
        <g stroke="#2f5c3f" strokeWidth="2" fill="none" opacity="0.85">
          {[110, 300, 490, 680].map((x) => (
            <path key={x} d={`M${x} 232 V150 a55 55 0 0 1 110 0 V232`} />
          ))}
        </g>
        <g fill="#122c1d" opacity="0.55">
          {[110, 300, 490, 680].map((x) => (
            <path key={x} d={`M${x} 232 V150 a55 55 0 0 1 110 0 V232 Z`} />
          ))}
        </g>

        {/* the strung lights, already up */}
        <path d="M0 44 Q225 92 450 60 T900 44" fill="none" stroke="#c9a227" strokeOpacity="0.45" strokeWidth="1.6" />
        <g className="da-vh-lights">
          {[
            [70, 66], [160, 78], [255, 84], [350, 80], [450, 70], [548, 76], [645, 80], [740, 72], [832, 58],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="9" fill="#e8b06a" opacity="0.16" />
              <circle cx={x} cy={y} r="3.4" fill={i % 3 === 0 ? "#f3d98a" : i % 3 === 1 ? "#a9e0c0" : "#f2a08a"} />
            </g>
          ))}
        </g>

        <rect y="232" width="900" height="68" fill="url(#da-vh-floor)" />

        {/* a trestle table, cloth on, cups out */}
        <g>
          <rect x="232" y="196" width="188" height="9" rx="2" fill="#f6f3ea" />
          <path d="M240 205h172l-9 27H249Z" fill="#e6e0cd" />
          <path d="M240 205h172l-3 9H243Z" fill="#d63a2e" opacity="0.85" />
          <path d="M258 232v-8M394 232v-8" stroke="#8b969c" strokeWidth="4" strokeLinecap="round" />
          {[268, 292, 316, 340].map((x) => (
            <rect key={x} x={x} y="186" width="12" height="10" rx="2" fill="#fdfcf7" />
          ))}
          {/* the urn, on */}
          <rect x="356" y="172" width="30" height="24" rx="4" fill="#c9d0d4" />
          <rect x="360" y="177" width="22" height="6" rx="2" fill="#8b969c" />
          <circle cx="371" cy="190" r="2.6" fill="#d63a2e" />
          <g className="da-vh-steam" stroke="#f6f3ea" strokeOpacity="0.5" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path d="M366 168c-4-6 4-9 0-15" />
            <path d="M377 168c-4-6 4-9 0-15" />
          </g>
        </g>

        {/* someone carrying a stack of chairs in */}
        <g>
          <rect x="516" y="176" width="42" height="8" rx="2" fill="#2f5c6e" />
          <rect x="516" y="188" width="42" height="8" rx="2" fill="#3a6b7e" />
          <rect x="516" y="200" width="42" height="8" rx="2" fill="#2f5c6e" />
          <path d="M522 208v24M552 208v24" stroke="#1d3a45" strokeWidth="4" strokeLinecap="round" />
          <circle cx="580" cy="182" r="11" fill="#f6f3ea" />
          <path d="M569 232v-30a11 11 0 0 1 22 0v30Z" fill="#1f6a45" />
          <path d="M569 202h-14" stroke="#f6f3ea" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* someone up a ladder, hanging the last of the lights */}
        <g>
          <path d="M700 232V128M736 232V128" stroke="#a9861f" strokeWidth="4" strokeLinecap="round" />
          {[144, 168, 192, 216].map((y) => (
            <path key={y} d={`M700 ${y}h36`} stroke="#a9861f" strokeWidth="3.4" strokeLinecap="round" />
          ))}
          <circle cx="718" cy="112" r="11" fill="#f6f3ea" />
          <path d="M707 152v-28a11 11 0 0 1 22 0v28Z" fill="#d98f4a" />
          <path d="M729 124l16-22" stroke="#f6f3ea" strokeWidth="6" strokeLinecap="round" />
          <circle cx="748" cy="98" r="4.4" fill="#f3d98a" />
        </g>

        {/* a broom left against the wall, and a folded prayer mat */}
        <g>
          <path d="M158 232v-64" stroke="#a9861f" strokeWidth="4" strokeLinecap="round" />
          <path d="M146 168h24l-5 -16h-14Z" fill="#d98f4a" />
          <rect x="60" y="212" width="58" height="10" rx="3" fill="#1f6a45" />
          <rect x="60" y="222" width="58" height="10" rx="3" fill="#2a8055" />
        </g>
      </svg>
    </div>
  );
}
