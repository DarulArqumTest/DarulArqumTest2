/**
 * Hand-built illustration of the newly acquired Darul Arqum West property
 * (6050 Old Richmond Rd) — a red-brick bungalow with a double garage, a
 * covered entry porch, and an evergreen stand on the west side.
 *
 * Drawn rather than photographed on purpose: it renders crisply at any size,
 * carries the site's night-green/gold palette, and needs no asset pipeline.
 *
 * ADMIN-ACCESS FOLLOW-UP: swap for a real photograph of the property once
 * the masjid has one it owns the rights to — drop it in `public/assets/` and
 * replace the WestPropertyArt call sites with a plain image tag.
 */

export function WestPropertyArt({
  className,
  rounded = 18,
  label = "Illustration of a Darul Arqum property: a red-brick bungalow with a double garage.",
}: {
  className?: string;
  rounded?: number;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      role="img"
      aria-label={label}
      style={{ display: "block", width: "100%", height: "100%", borderRadius: rounded }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="wpa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b2016" />
          <stop offset="45%" stopColor="#163a28" />
          <stop offset="100%" stopColor="#2c5138" />
        </linearGradient>
        <radialGradient id="wpa-glow" cx="0.72" cy="0.24" r="0.55">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wpa-brick" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9d4630" />
          <stop offset="55%" stopColor="#8a3b28" />
          <stop offset="100%" stopColor="#6f2e1f" />
        </linearGradient>
        <linearGradient id="wpa-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b544c" />
          <stop offset="100%" stopColor="#3a352f" />
        </linearGradient>
        <linearGradient id="wpa-lawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#264a32" />
          <stop offset="100%" stopColor="#152e1f" />
        </linearGradient>
        <linearGradient id="wpa-drive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4740" />
          <stop offset="100%" stopColor="#312f2a" />
        </linearGradient>
        <linearGradient id="wpa-win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7e6b4" />
          <stop offset="100%" stopColor="#e0bb63" />
        </linearGradient>
        <pattern id="wpa-course" width="26" height="11" patternUnits="userSpaceOnUse">
          <rect width="26" height="11" fill="none" />
          <path d="M0 10.5H26" stroke="#000" strokeOpacity="0.16" strokeWidth="1" />
          <path d="M13 0V11" stroke="#000" strokeOpacity="0.1" strokeWidth="1" />
        </pattern>
      </defs>

      {/* sky + gold wash */}
      <rect width="800" height="500" fill="url(#wpa-sky)" />
      <rect width="800" height="500" fill="url(#wpa-glow)" />

      {/* crescent */}
      <g opacity="0.85">
        <circle cx="646" cy="82" r="20" fill="#e3c56a" />
        <circle cx="655" cy="75" r="19" fill="#123425" />
      </g>
      {[
        [96, 62], [168, 104], [258, 54], [330, 118], [430, 72],
        [520, 122], [578, 44], [712, 128], [762, 70],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2.1 : 1.4} fill="#f6f3ea" opacity={0.55} />
      ))}

      {/* distant tree line */}
      <path
        d="M0 292 Q60 276 108 288 Q150 268 196 286 Q240 270 288 288 Q340 272 392 288 Q450 274 512 290 Q570 276 632 290 Q700 274 800 290 L800 330 L0 330 Z"
        fill="#0f2a1c"
        opacity="0.9"
      />

      {/* ground */}
      <rect y="316" width="800" height="184" fill="url(#wpa-lawn)" />

      {/* evergreens, west side */}
      {[
        { x: 74, h: 132, w: 52 },
        { x: 140, h: 104, w: 42 },
        { x: 22, h: 92, w: 38 },
      ].map((t, i) => (
        <g key={i}>
          <rect x={t.x - 4} y={330 - 6} width="8" height="18" fill="#2a2016" />
          <path d={`M${t.x} ${330 - t.h} L${t.x + t.w / 2} ${330} L${t.x - t.w / 2} ${330} Z`} fill="#123a26" />
          <path d={`M${t.x} ${330 - t.h} L${t.x + t.w / 2.6} ${330 - t.h * 0.26} L${t.x - t.w / 2.6} ${330 - t.h * 0.26} Z`} fill="#17492f" />
        </g>
      ))}

      {/* driveway */}
      <path d="M236 500 L332 348 L520 348 L648 500 Z" fill="url(#wpa-drive)" />
      <path d="M236 500 L332 348 L520 348 L648 500 Z" fill="none" stroke="#000" strokeOpacity="0.18" />

      {/* ── house ── */}
      {/* roof */}
      <path d="M188 250 L352 186 L560 186 L692 250 Z" fill="url(#wpa-roof)" />
      <path d="M188 250 L352 186 L560 186 L692 250 Z" fill="none" stroke="#000" strokeOpacity="0.28" />
      {[206, 244, 282, 320, 358, 396, 434, 472, 510, 548, 586, 624, 662].map((x) => (
        <path key={x} d={`M${x} 250 L${x + 22} 232`} stroke="#000" strokeOpacity="0.14" strokeWidth="1.5" />
      ))}
      {/* fascia */}
      <rect x="186" y="248" width="508" height="10" rx="2" fill="#efe8d6" />

      {/* chimney */}
      <rect x="600" y="176" width="26" height="42" fill="#7d3625" />
      <rect x="596" y="170" width="34" height="9" rx="2" fill="#584038" />

      {/* body */}
      <rect x="202" y="258" width="476" height="92" fill="url(#wpa-brick)" />
      <rect x="202" y="258" width="476" height="92" fill="url(#wpa-course)" />
      {/* foundation band */}
      <rect x="202" y="336" width="476" height="14" fill="#8d8878" opacity="0.85" />

      {/* double garage */}
      <rect x="222" y="272" width="82" height="64" rx="3" fill="#f2ece0" />
      <rect x="310" y="272" width="82" height="64" rx="3" fill="#f2ece0" />
      {[222, 310].map((gx) =>
        [284, 296, 308, 320].map((gy) => (
          <path key={`${gx}-${gy}`} d={`M${gx + 4} ${gy}H${gx + 78}`} stroke="#c9c2b2" strokeWidth="1.6" />
        )),
      )}

      {/* entry porch */}
      <rect x="418" y="266" width="96" height="84" fill="#0f2a1c" opacity="0.34" />
      <rect x="446" y="288" width="34" height="62" rx="2" fill="#5f2418" />
      <circle cx="474" cy="320" r="2.4" fill="#e3c56a" />
      {/* porch posts + steps */}
      <rect x="418" y="262" width="7" height="88" fill="#efe8d6" />
      <rect x="508" y="262" width="7" height="88" fill="#efe8d6" />
      <rect x="412" y="256" width="110" height="9" rx="2" fill="#efe8d6" />
      <rect x="424" y="350" width="96" height="7" fill="#b9b2a2" />
      <rect x="432" y="357" width="80" height="7" fill="#a9a292" />

      {/* windows */}
      {[
        { x: 540, w: 54 },
        { x: 608, w: 54 },
      ].map((w) => (
        <g key={w.x}>
          <rect x={w.x - 4} y={280} width={w.w + 8} height={48} rx="2" fill="#efe8d6" />
          <rect x={w.x} y={284} width={w.w} height={40} fill="url(#wpa-win)" />
          <path d={`M${w.x + w.w / 2} 284V324`} stroke="#efe8d6" strokeWidth="3" />
        </g>
      ))}

      {/* warm spill from the windows onto the lawn */}
      <path d="M536 328 L520 396 L700 396 L672 328 Z" fill="#e3c56a" opacity="0.09" />

      {/* foreground grass edge */}
      <path d="M0 420 Q200 404 400 418 Q600 432 800 412 L800 500 L0 500 Z" fill="#102518" opacity="0.55" />
    </svg>
  );
}
