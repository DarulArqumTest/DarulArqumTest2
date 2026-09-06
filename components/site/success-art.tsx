/**
 * What happens after you press the button, drawn.
 *
 * Five forms all landed on the same panel with the same small tick in it.
 * That is the moment of most goodwill on the whole site — somebody has just
 * enrolled their child, or offered their Saturdays — and it was the most
 * generic screen we had. Each form gets the picture of what it just did.
 *
 * Same rules as the rest of the marks: real colours per object, one ink
 * outline so a row of them reads as one hand, and nothing animated. These
 * arrive on a panel that is already fading up; a second motion on top of
 * that is fidgeting.
 */

export type SuccessScene = "register" | "chair" | "coin" | "stamp" | "envelope";

const C = {
  cream: "#f6f3ea",
  paper: "#fdfcf7",
  gold: "#e3c56a",
  goldDeep: "#c9a227",
  brass: "#a9861f",
  red: "#d63a2e",
  redDeep: "#a92c22",
  green: "#1f6a45",
  greenDeep: "#12482f",
  mint: "#7cc99a",
  steel: "#c9d0d4",
  steelDark: "#8b969c",
  wood: "#8a6a44",
  woodDeep: "#5d4128",
  ink: "#16303c",
};

const L = {
  fill: "none" as const,
  stroke: C.ink,
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeOpacity: 0.5,
};

const SCENES: Record<SuccessScene, React.ReactNode> = {
  /* the class register, a name going in, the ink still wet */
  register: (
    <>
      {/* the open book */}
      <path d="M18 96 C 46 84 78 84 100 94 C 122 84 154 84 182 96 L 182 40 C 154 28 122 28 100 38 C 78 28 46 28 18 40 Z" fill={C.paper} />
      <path d="M100 38 L100 94" stroke={C.steelDark} strokeWidth="1.2" opacity="0.6" />
      {/* ruled lines with names already on them */}
      <g stroke={C.steelDark} strokeWidth="1" opacity="0.45">
        <path d="M28 50h60M28 62h60M28 74h60M112 50h60M112 62h60" />
      </g>
      <g stroke={C.ink} strokeWidth="2" strokeLinecap="round" opacity="0.62">
        <path d="M31 48c5-3 9 2 14-1s8 2 13-1" />
        <path d="M31 60c6-3 11 2 17-1s9 2 14-1" />
        <path d="M115 48c5-3 10 2 15-1s7 2 12-1" />
      </g>
      {/* the new line, written just now */}
      <path d="M115 60c6-3 12 2 18-1s10 2 16-1" stroke={C.green} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* binding */}
      <path d="M96 34 C 98 60 98 74 96 98 L 104 98 C 102 74 102 60 104 34 Z" fill={C.green} />
      <path {...L} d="M18 96 C 46 84 78 84 100 94 C 122 84 154 84 182 96 L 182 40 C 154 28 122 28 100 38 C 78 28 46 28 18 40 Z" />
      {/* the pen, just lifted */}
      <g transform="rotate(28 150 78)">
        <rect x="128" y="74" width="46" height="6" rx="3" fill={C.ink} />
        <rect x="166" y="74" width="10" height="6" rx="2" fill={C.goldDeep} />
        <path d="M128 77 L118 77" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
        <path {...L} d="M128 74h46v6h-46z" />
      </g>
      {/* wet ink */}
      <circle cx="152" cy="63" r="2" fill={C.green} opacity="0.75" />
    </>
  ),

  /* one more chair carried into the row — the volunteer hero, one chair on */
  chair: (
    <>
      {/* three already set */}
      {[26, 66, 106].map((x) => (
        <g key={x}>
          <rect x={x} y="60" width="26" height="7" rx="2" fill={C.green} />
          <rect x={x + 2} y="34" width="22" height="26" rx="3" fill={C.greenDeep} />
          <rect x={x + 1} y="67" width="4" height="30" rx="2" fill={C.steelDark} />
          <rect x={x + 21} y="67" width="4" height="30" rx="2" fill={C.steelDark} />
          <path {...L} d={`M${x} 60h26v7h-26z`} />
          <path {...L} d={`M${x + 2} 34h22v26h-22z`} />
        </g>
      ))}
      {/* the fourth, going down now, still tilted */}
      <g transform="rotate(-11 159 66)">
        <rect x="146" y="58" width="26" height="7" rx="2" fill={C.gold} />
        <rect x="148" y="32" width="22" height="26" rx="3" fill={C.goldDeep} />
        <rect x="147" y="65" width="4" height="30" rx="2" fill={C.steel} />
        <rect x="167" y="65" width="4" height="30" rx="2" fill={C.steel} />
        <path {...L} d="M146 58h26v7h-26z" />
        <path {...L} d="M148 32h22v26h-22z" />
      </g>
      {/* the arc it came down on */}
      <path
        d="M150 22 C 162 16 176 20 182 30"
        fill="none"
        stroke={C.mint}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 7"
        opacity="0.8"
      />
      {/* the floor */}
      <path d="M12 98h176" stroke={C.cream} strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    </>
  ),

  /* a coin going into the box, and it is not the first */
  coin: (
    <>
      {/* the box */}
      <path d="M46 52h108v46a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6Z" fill={C.wood} />
      <path d="M46 52h108v10H46Z" fill={C.woodDeep} />
      <rect x="42" y="42" width="116" height="12" rx="3" fill={C.woodDeep} />
      {/* the slot */}
      <rect x="86" y="45" width="28" height="5" rx="2.5" fill="#150c05" />
      {/* a gold band, because a masjid box has one */}
      <rect x="46" y="76" width="108" height="8" fill={C.goldDeep} opacity="0.85" />
      <path {...L} d="M46 52h108v46a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6Z" />
      <path {...L} d="M42 42h116v12H42z" />
      {/* the coin, mid-drop */}
      <g transform="rotate(-16 100 22)">
        <ellipse cx="100" cy="22" rx="11" ry="11" fill={C.gold} />
        <ellipse cx="100" cy="22" rx="7.5" ry="7.5" fill="none" stroke={C.brass} strokeWidth="1.6" />
        <path d="M100 17v10M95 22h10" stroke={C.brass} strokeWidth="1.4" strokeLinecap="round" />
      </g>
      {/* the ones already in */}
      <g opacity="0.9">
        <circle cx="74" cy="92" r="7" fill={C.brass} />
        <circle cx="88" cy="95" r="6" fill={C.gold} />
        <circle cx="118" cy="93" r="7" fill={C.goldDeep} />
      </g>
      {/* the drop */}
      <path d="M100 36v6" stroke={C.gold} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </>
  ),

  /* sealed and gone: the still version of the newsletter scene */
  envelope: (
    <>
      <path d="M46 34h108v58a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6Z" fill={C.paper} />
      <path d="M46 34l54 38 54-38Z" fill={C.red} />
      <path d="M46 92l40-30M154 92l-40-30" stroke="#e08076" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path {...L} d="M46 34h108v58a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6Z" />
      {/* away it goes */}
      <g fill="#fff" opacity="0.9">
        <circle cx="160" cy="30" r="2.6" />
        <circle cx="170" cy="24" r="2.6" />
        <circle cx="180" cy="19" r="2.6" />
      </g>
      <g transform="rotate(-16 190 14)">
        <path d="M200 2 L176 22 L188 26 Z" fill={C.cream} />
        <path d="M200 2 L188 26 L194 34 Z" fill="#e5b3ac" />
      </g>
    </>
  ),

  /* the receipt, stamped, the stamp only just lifted */
  stamp: (
    <>
      {/* the paper */}
      <path d="M40 22h84v84l-10-6-10 6-11-6-11 6-11-6-10 6-11-6-10 6Z" fill={C.paper} />
      <g stroke={C.steelDark} strokeWidth="1.1" opacity="0.5">
        <path d="M52 38h60M52 50h60M52 62h36" />
      </g>
      <path d="M52 78h34" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
      <path {...L} d="M40 22h84v84l-10-6-10 6-11-6-11 6-11-6-10 6-11-6-10 6Z" />
      {/* the mark it left */}
      <g transform="rotate(-13 112 70)" opacity="0.92">
        <circle cx="112" cy="70" r="21" fill="none" stroke={C.red} strokeWidth="3" />
        <circle cx="112" cy="70" r="16" fill="none" stroke={C.red} strokeWidth="1.4" opacity="0.7" />
        <path d="M101 70h22M112 61v18" stroke={C.red} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      {/* the stamp, lifting away */}
      <g transform="rotate(9 152 34)">
        <rect x="132" y="40" width="40" height="9" rx="2" fill={C.redDeep} />
        <rect x="140" y="26" width="24" height="15" rx="3" fill={C.wood} />
        <rect x="146" y="12" width="12" height="16" rx="5" fill={C.woodDeep} />
        <path {...L} d="M132 40h40v9h-40z" />
        <path {...L} d="M140 26h24v15h-24z" />
      </g>
      {/* one speck of ink */}
      <circle cx="88" cy="96" r="1.8" fill={C.red} opacity="0.7" />
    </>
  ),
};

export function SuccessArt({ scene, className }: { scene: SuccessScene; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 118"
      aria-hidden
      focusable="false"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {SCENES[scene]}
    </svg>
  );
}
