/**
 * The community's own story, drawn.
 *
 * The timeline was six paragraphs of text with a small badge in the corner
 * of each — which is the actual history of this masjid rendered as a list.
 * Every milestone gets the picture of what happened: the table it was
 * decided at, the key that changed hands, the first rows standing for
 * Taraweeh, the books that arrived, the second building, and the scaffold
 * still up.
 *
 * Same rules as the rest of the marks: each object in its own colours, one
 * ink outline across the set so six drawings read as one hand.
 */

export type StoryScene = "founding" | "home" | "worship" | "knowledge" | "second" | "today";

const C = {
  cream: "#f6f3ea",
  paper: "#fdfcf7",
  gold: "#e3c56a",
  goldDeep: "#c9a227",
  brass: "#a9861f",
  red: "#d63a2e",
  redDeep: "#a92c22",
  green: "#1f6a45",
  greenMid: "#2c8557",
  greenDeep: "#12482f",
  mint: "#7cc99a",
  steel: "#c9d0d4",
  steelDark: "#8b969c",
  slate: "#2f5c6e",
  wood: "#8a6a44",
  woodDeep: "#5d4128",
  amber: "#d98f4a",
  ink: "#0b1c14",
};

const L = {
  fill: "none" as const,
  stroke: C.ink,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeOpacity: 0.55,
};

/** the masjid silhouette, reused wherever a building is needed */
function Masjid({ x = 0, y = 0, s = 1, fill = C.cream }: { x?: number; y?: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="14" y="34" width="60" height="38" fill={fill} />
      <rect x="34" y="24" width="20" height="10" fill={fill} />
      <path d="M32 24c-3-6-1-12 5-17 3-3 5-5 7-9 2 4 4 6 7 9 6 5 8 11 5 17Z" fill={fill} />
      <rect x="2" y="28" width="9" height="44" fill={fill} />
      <rect x="77" y="28" width="9" height="44" fill={fill} />
      <path d="M28 72V54a10 10 0 0 1 20 0v18Z" fill={C.ink} fillOpacity="0.5" />
      <circle cx="44" cy="-6" r="2.6" fill={C.gold} />
    </g>
  );
}

const SCENES: Record<StoryScene, React.ReactNode> = {
  /* 2019: a table, a document, and the people who signed it */
  founding: (
    <>
      <ellipse cx="100" cy="66" rx="72" ry="42" fill={C.wood} />
      <ellipse cx="100" cy="63" rx="64" ry="36" fill="#a07f52" />
      {/* the charter */}
      <g transform="rotate(-5 100 62)">
        <rect x="72" y="42" width="56" height="40" rx="2" fill={C.paper} />
        <g stroke={C.steelDark} strokeWidth="1.1" opacity="0.5">
          <path d="M79 52h42M79 60h42M79 68h26" />
        </g>
        <circle cx="118" cy="74" r="6" fill={C.red} />
        <path d="M118 80l-3 8h6Z" fill={C.redDeep} />
        <path {...L} d="M72 42h56v40H72z" />
      </g>
      {/* four places set around it */}
      {[
        [40, 44],
        [160, 44],
        [40, 84],
        [160, 84],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <ellipse cx={cx} cy={cy} rx="13" ry="9" fill={C.steel} />
          <ellipse cx={cx} cy={cy} rx="8" ry="5.5" fill={C.green} />
          <path {...L} d={`M${cx - 13} ${cy}a13 9 0 1 0 26 0a13 9 0 1 0-26 0`} />
        </g>
      ))}
      <path d="M52 30l14 8" stroke={C.ink} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M64 36l4-2" stroke={C.goldDeep} strokeWidth="3" strokeLinecap="round" />
    </>
  ),

  /* 2020: the key to the building */
  home: (
    <>
      <Masjid x={56} y={24} s={0.86} fill={C.cream} />
      {/* the key, gold and enormous, because it is the point */}
      <g transform="rotate(-24 46 76)">
        <circle cx="30" cy="76" r="15" fill="none" stroke={C.gold} strokeWidth="7" />
        <rect x="42" y="72.5" width="46" height="7" rx="3" fill={C.gold} />
        <rect x="76" y="79" width="6" height="9" rx="2" fill={C.gold} />
        <rect x="86" y="79" width="6" height="12" rx="2" fill={C.gold} />
        <circle cx="30" cy="76" r="6" fill={C.ink} fillOpacity="0.55" />
      </g>
      <path d="M14 108h172" stroke={C.cream} strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
    </>
  ),

  /* 2021: the first rows, standing */
  worship: (
    <>
      {/* the mihrab */}
      <path d="M78 96V50a22 22 0 0 1 44 0v46Z" fill={C.greenDeep} />
      <path {...L} d="M78 96V50a22 22 0 0 1 44 0v46Z" />
      <g stroke={C.gold} strokeOpacity="0.5" strokeWidth="1.4" fill="none">
        <rect x="90" y="56" width="20" height="20" />
        <rect x="90" y="56" width="20" height="20" transform="rotate(45 100 66)" />
      </g>
      {/* two lanterns */}
      {[52, 148].map((x) => (
        <g key={x}>
          <path d={`M${x} 14v14`} stroke={C.brass} strokeWidth="1.6" />
          <rect x={x - 6} y="28" width="12" height="16" rx="4" fill={C.gold} />
          <rect x={x - 2.5} y="32" width="5" height="9" rx="2" fill="#fff3c4" />
        </g>
      ))}
      {/* rows of mats */}
      {[76, 90, 104].map((y, i) => (
        <g key={y}>
          <rect x={30 - i * 6} y={y} width={140 + i * 12} height="9" rx="3" fill={i === 0 ? C.mint : C.greenMid} opacity={0.9 - i * 0.14} />
          <path
            {...L}
            strokeOpacity={0.4}
            d={`M${30 - i * 6} ${y}h${140 + i * 12}`}
          />
        </g>
      ))}
      <path d="M14 116h172" stroke={C.cream} strokeOpacity="0.24" strokeWidth="2" strokeLinecap="round" />
    </>
  ),

  /* 2025: the books arrive */
  knowledge: (
    <>
      {/* the rehl */}
      <path d="M62 104L138 68M138 104L62 68" stroke={C.woodDeep} strokeWidth="7" strokeLinecap="round" />
      {/* the mus'haf open on it */}
      <path d="M52 74C72 64 92 64 100 71c8-7 28-7 48 3l-4 22c-20-9-38-9-44-3-6-6-24-6-44 3Z" fill={C.paper} />
      <path d="M100 71v22" stroke={C.steelDark} strokeWidth="1.2" opacity="0.6" />
      <g stroke={C.steelDark} strokeWidth="1" opacity="0.45">
        <path d="M62 78h28M62 85h28M110 78h28M110 85h28" />
      </g>
      <path d="M96 62h8v14l-4-4-4 4Z" fill={C.red} />
      <path {...L} d="M52 74C72 64 92 64 100 71c8-7 28-7 48 3l-4 22c-20-9-38-9-44-3-6-6-24-6-44 3Z" />
      {/* a stack beside it */}
      <g>
        <rect x="18" y="94" width="40" height="8" rx="2" fill={C.green} />
        <rect x="22" y="86" width="40" height="8" rx="2" fill={C.slate} />
        <rect x="20" y="78" width="40" height="8" rx="2" fill={C.redDeep} />
        <path {...L} d="M18 94h40v8H18zM22 86h40v8H22zM20 78h40v8H20z" />
      </g>
      {/* a lamp over the whole thing */}
      <g>
        <path d="M162 12v16" stroke={C.brass} strokeWidth="1.6" />
        <rect x="153" y="28" width="18" height="22" rx="6" fill={C.gold} />
        <rect x="158" y="34" width="8" height="12" rx="3" fill="#fff3c4" />
        <circle cx="162" cy="56" r="16" fill={C.gold} opacity="0.14" />
      </g>
    </>
  ),

  /* 2026: a second building */
  second: (
    <>
      <Masjid x={6} y={30} s={0.72} fill={C.cream} />
      <Masjid x={110} y={26} s={0.78} fill={C.gold} />
      {/* the road between them */}
      <path
        d="M78 104C92 96 104 96 118 100"
        fill="none"
        stroke={C.cream}
        strokeOpacity="0.45"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="2 9"
      />
      <path d="M10 112h180" stroke={C.cream} strokeOpacity="0.26" strokeWidth="2" strokeLinecap="round" />
      {/* the new one is new */}
      <path d="M186 20l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7Z" fill={C.gold} />
    </>
  ),

  /* today: the scaffold is still up */
  today: (
    <>
      <Masjid x={58} y={26} s={0.9} fill={C.cream} />
      {/* scaffolding */}
      <g stroke={C.amber} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M44 108V44M156 108V44" />
        <path d="M44 44h112M44 68h112M44 92h112" />
        <path d="M44 44l112 24M156 44L44 68" strokeWidth="1.6" opacity="0.55" />
      </g>
      {/* somebody up there */}
      <g transform="translate(140 56)">
        <circle cx="0" cy="0" r="5" fill={C.mint} />
        <path d="M0 5v12M0 9l-7 5M0 9l7 5M0 17l-5 9M0 17l5 9" stroke={C.mint} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
      <path d="M10 112h180" stroke={C.cream} strokeOpacity="0.26" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export function StoryVignette({ scene, className }: { scene: StoryScene; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      aria-hidden
      focusable="false"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {SCENES[scene]}
    </svg>
  );
}
