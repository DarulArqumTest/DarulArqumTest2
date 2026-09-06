/**
 * The community's story, as six scenes through a window.
 *
 * The first pass was objects dropped on a ground line — a key, a book, two
 * copies of the same masjid — and it looked exactly like what it was. You
 * had to squint to work out what you were looking at, and the 2026 card was
 * one building duplicated with a dotted line between it and itself.
 *
 * This is one style instead of six sketches. Every milestone is a scene seen
 * through a mihrab arch: a graded sky, a horizon, and everything in front of
 * it in silhouette, lit by one warm source. Silhouettes hold their shape at
 * card size where outlined detail turns to mush, the arch ties the set to
 * the building the story is about, and the sky carries the hour — dawn for
 * the founding, night for the first Taraweeh, sunrise for today.
 *
 * The two masjids in 2026 are two different buildings, on one horizon, with
 * the road between them actually joining them.
 */

export type StoryScene = "founding" | "home" | "worship" | "knowledge" | "second" | "today";

/** everything in front of the sky */
const DARK = "#08150f";
const DARK_SOFT = "#0d2117";
const WARM = "#f6d089";
const WARM_DEEP = "#e0a049";
const GOLD = "#e3c56a";

/** the arch the scene is seen through */
const ARCH = "M18 146 V80 C18 44 62 14 100 14 C138 14 182 44 182 80 V146 Z";

type Sky = { top: string; mid: string; low: string };

const SKIES: Record<StoryScene, Sky> = {
  founding: { top: "#1b2a52", mid: "#4a3c62", low: "#c98a54" },
  home: { top: "#132a44", mid: "#1f4a5e", low: "#5fa08c" },
  worship: { top: "#0c1734", mid: "#152a4c", low: "#2f5c6e" },
  knowledge: { top: "#151f42", mid: "#33355e", low: "#a06a5a" },
  second: { top: "#101f3a", mid: "#2a3f63", low: "#d9a05e" },
  today: { top: "#12203a", mid: "#7a5a6a", low: "#f0a86a" },
};

/** a standing figure, in silhouette */
function Person({ x, y, s = 1, fill = DARK }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="0" cy="-20" r="5.4" />
      <path d="M-6.4 -14 C-7.6 -6 -8 4 -7.6 14 L7.6 14 C8 4 7.6 -6 6.4 -14 Z" />
    </g>
  );
}

/** a seated figure, seen from behind */
function Seated({ x, y, s = 1, fill = DARK }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="0" cy="-11" r="4.6" />
      <path d="M-7 -6 C-8.6 0 -9 6 -9 10 L9 10 C9 6 8.6 0 7 -6 Z" />
    </g>
  );
}

const SCENES: Record<StoryScene, React.ReactNode> = {
  /* 2019: a table, and the people who sat at it */
  founding: (
    <>
      {/* the lamp they sat under */}
      <circle cx="100" cy="52" r="26" fill={WARM} opacity="0.16" />
      <path d="M100 14v18" stroke={GOLD} strokeWidth="1.4" opacity="0.6" />
      <path d="M90 44 L110 44 L104 32 L96 32 Z" fill={DARK} />
      <ellipse cx="100" cy="46" rx="11" ry="3" fill={WARM} opacity="0.85" />

      {/* four at the table */}
      <Person x={54} y={104} s={0.9} />
      <Person x={80} y={102} s={0.94} />
      <Person x={120} y={102} s={0.94} />
      <Person x={146} y={104} s={0.9} />

      {/* the table, and the paper on it */}
      <path d="M34 118 h132 v7 h-132 Z" fill={DARK} />
      <path d="M42 125 h5 v21 h-5 Z M153 125 h5 v21 h-5 Z" fill={DARK} />
      <path d="M86 112 h28 v6 h-28 Z" fill={WARM} opacity="0.75" />
    </>
  ),

  /* 2020: the first light on inside a building of our own */
  home: (
    <>
      <circle cx="146" cy="46" r="12" fill={WARM} opacity="0.5" />
      <circle cx="150" cy="43" r="11" fill="#1f4a5e" opacity="0.95" />

      {/* the building */}
      <path d="M46 146 V92 h20 v-10 h68 v10 h20 v54 Z" fill={DARK} />
      <path d="M84 82 c-4-9-1-16 8-22 4-3 6-5 8-8 2 3 4 5 8 8 9 6 12 13 8 22 Z" fill={DARK} />
      <path d="M52 92 h6 v-16 h-6 Z M142 92 h6 v-16 h-6 Z" fill={DARK} />

      {/* the light that went on */}
      <path d="M88 116 h24 v30 h-24 Z" fill={WARM} opacity="0.9" />
      <path d="M100 116 v30 M88 128 h24" stroke={DARK} strokeWidth="2" />
      <path d="M88 146 l-12 0 l12 -30 Z" fill={WARM} opacity="0.2" />

      <path d="M8 146 h184" stroke={DARK} strokeWidth="4" strokeLinecap="round" />

      {/* the key, held up in front of it */}
      <g transform="rotate(-28 44 122)" fill={GOLD}>
        <circle cx="36" cy="122" r="8.5" />
        <circle cx="36" cy="122" r="3.6" fill={DARK_SOFT} />
        <rect x="43" y="119.6" width="26" height="4.8" rx="2" />
        <rect x="58" y="124" width="3.6" height="6" rx="1.4" />
        <rect x="65" y="124" width="3.6" height="8" rx="1.4" />
      </g>
    </>
  ),

  /* 2021: the first rows, standing */
  worship: (
    <>
      {/* the mihrab behind them */}
      <path d="M76 146 V84 a24 24 0 0 1 48 0 v62 Z" fill={DARK_SOFT} />
      <path d="M84 146 V88 a16 16 0 0 1 32 0 v58 Z" fill={WARM} opacity="0.13" />

      {/* two lamps */}
      {[46, 154].map((x) => (
        <g key={x}>
          <path d={`M${x} 20v22`} stroke={GOLD} strokeWidth="1.2" opacity="0.55" />
          <path d={`M${x - 6} 54 L${x + 6} 54 L${x + 4} 42 L${x - 4} 42 Z`} fill={DARK} />
          <ellipse cx={x} cy="52" rx="5.4" ry="7" fill={WARM} opacity="0.8" />
          <circle cx={x} cy="50" r="15" fill={WARM} opacity="0.12" />
        </g>
      ))}

      {/* the rows */}
      <g>
        {[30, 54, 78, 102, 126, 150, 174].map((x) => (
          <Person key={`b-${x}`} x={x} y={112} s={0.72} fill={DARK_SOFT} />
        ))}
      </g>
      <g>
        {[22, 50, 78, 106, 134, 162].map((x) => (
          <Person key={`f-${x}`} x={x} y={134} s={0.92} />
        ))}
      </g>
      <path d="M8 146 h184" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
    </>
  ),

  /* 2025: sitting down to learn */
  knowledge: (
    <>
      {/* the teacher's lamp */}
      <circle cx="100" cy="60" r="24" fill={WARM} opacity="0.15" />
      <path d="M100 14v28" stroke={GOLD} strokeWidth="1.2" opacity="0.5" />
      <path d="M92 56 L108 56 L104 42 L96 42 Z" fill={DARK} />
      <ellipse cx="100" cy="57" rx="8" ry="3" fill={WARM} opacity="0.85" />

      {/* the rehl, and the book open on it */}
      <path d="M78 128 L122 100 M122 128 L78 100" stroke={DARK} strokeWidth="5" strokeLinecap="round" />
      <path d="M74 102 C86 95 96 95 100 99 C104 95 114 95 126 102 L124 114 C114 108 104 108 100 112 C96 108 86 108 76 114 Z" fill={WARM} opacity="0.92" />
      <path d="M100 99 v13" stroke={DARK} strokeWidth="1.6" opacity="0.5" />

      {/* the class, seated in rows */}
      <g>
        {[36, 62, 138, 164].map((x) => (
          <Seated key={`r-${x}`} x={x} y={116} s={0.82} fill={DARK_SOFT} />
        ))}
      </g>
      <g>
        {[26, 54, 146, 174].map((x) => (
          <Seated key={`f-${x}`} x={x} y={138} s={1} />
        ))}
      </g>
      <path d="M8 146 h184" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
    </>
  ),

  /* 2026: two buildings, one horizon, and the road that joins them */
  second: (
    <>
      <circle cx="100" cy="40" r="13" fill={WARM} opacity="0.55" />
      <circle cx="104" cy="37" r="11.5" fill="#2a3f63" />

      {/* east: the one they already had — low, domed, familiar */}
      <g fill={DARK}>
        <path d="M22 146 V104 h14 v-8 h34 v8 h14 v42 Z" />
        <path d="M46 96 c-3-7-1-12 6-17 3-2 4-4 5-6 1 2 2 4 5 6 7 5 9 10 6 17 Z" />
        <path d="M26 104 h5 v-13 h-5 Z" />
      </g>
      <path d="M48 126 h12 v20 h-12 Z" fill={WARM} opacity="0.75" />

      {/* west: the new one — taller, twin minarets, a different roofline */}
      <g fill={DARK}>
        <path d="M114 146 V92 h58 v54 Z" />
        <path d="M126 92 l17 -22 l17 22 Z" />
        <path d="M110 146 V74 h7 v72 Z" />
        <path d="M169 146 V74 h7 v72 Z" />
        <path d="M110 74 l3.5 -9 l3.5 9 Z M169 74 l3.5 -9 l3.5 9 Z" />
      </g>
      <path d="M130 118 h10 v28 h-10 Z M146 118 h10 v28 h-10 Z" fill={WARM} opacity="0.6" />

      {/* the road, running from one door to the other */}
      <path d="M8 146 h184" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
      <path
        d="M56 142 C 74 134 92 132 110 136 C 122 138 130 141 136 142"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 6"
      />
    </>
  ),

  /* today: still building, and the sun is coming up on it */
  today: (
    <>
      <circle cx="100" cy="96" r="46" fill={WARM} opacity="0.22" />
      <circle cx="100" cy="102" r="30" fill={WARM} opacity="0.55" />

      <g fill={DARK}>
        <path d="M56 146 V98 h12 v-8 h64 v8 h12 v48 Z" />
        <path d="M82 90 c-4-9-1-15 7-21 3-2 5-4 6-6 1 2 3 4 6 6 8 6 11 12 7 21 Z" />
      </g>
      <path d="M88 120 h24 v26 h-24 Z" fill={WARM} opacity="0.85" />

      {/* the scaffold that is still up */}
      <g stroke={DARK} strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M48 146 V84 M152 146 V84" />
        <path d="M48 84 h104 M48 108 h104 M48 130 h104" />
        <path d="M48 84 l104 24 M152 84 L48 108" strokeWidth="1.6" opacity="0.6" />
      </g>

      {/* two of them up there working */}
      <g fill={DARK}>
        <circle cx="70" cy="99" r="4.6" />
        <path d="M64 104 h12 v6 h-12 Z" />
        <circle cx="132" cy="77" r="4.6" />
        <path d="M126 82 h12 v6 h-12 Z" />
      </g>

      <path d="M8 146 h184" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
};

export function StoryVignette({ scene, className }: { scene: StoryScene; className?: string }) {
  const sky = SKIES[scene];
  const clipId = `da-sv-clip-${scene}`;
  const skyId = `da-sv-sky-${scene}`;

  return (
    <svg
      className={className}
      viewBox="0 0 200 150"
      aria-hidden
      focusable="false"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.top} />
          <stop offset="52%" stopColor={sky.mid} />
          <stop offset="100%" stopColor={sky.low} />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={ARCH} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <path d={ARCH} fill={`url(#${skyId})`} />
        {SCENES[scene]}
      </g>

      {/* the window frame */}
      <path d={ARCH} fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="2" />
      <path d={ARCH} fill="none" stroke="#0a1a12" strokeOpacity="0.5" strokeWidth="5" transform="translate(0 1)" style={{ mixBlendMode: "multiply" }} />
      <path d="M12 146 h176" stroke={GOLD} strokeOpacity="0.55" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
