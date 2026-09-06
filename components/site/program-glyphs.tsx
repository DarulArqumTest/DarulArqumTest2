/**
 * A drawn mark for each thing the masjid teaches, in the colours that thing
 * actually is.
 *
 * The first version of these was a mistake worth naming: every mark was drawn
 * in `currentColor`, so a megaphone sitting in a gold tile came out gold, an
 * envelope in a gold tile came out gold, and a row of them was one tint
 * pretending to be five different objects. That is an icon set, not
 * illustration — the same fault as five identical dots, one layer down.
 *
 * Every mark carries its own palette now. The megaphone's horn is red because
 * a megaphone's horn is red; the mus'haf is bound in green with a gilt edge;
 * the coins are gold; the balance is brass; the heart is red. The colours are
 * taken from the site's own art — the homepage megaphone's red, the newsletter
 * envelope's cream and gold — so the marks are colourful without looking like
 * they came from somewhere else.
 *
 * One 24-unit box, one outline weight, no animation: these label things, and a
 * label that bobs is just harder to read.
 */

export type GlyphName =
  | "mushaf"
  | "hifz"
  | "hadith"
  | "fiqh"
  | "aqaid"
  | "grammar"
  | "character"
  | "seerah"
  | "deeniyaat"
  | "letters"
  | "sounds"
  | "vocabulary"
  | "confidence"
  | "calendar"
  | "tuition"
  | "student"
  | "parents"
  | "history"
  | "revision"
  | "tajweed"
  | "assessment"
  | "announce"
  | "envelope"
  | "star8"
  | "note"
  | "minbar"
  | "congregation"
  | "camera";

/* ── the palette, taken from the site's own art ───────────────────── */
const C = {
  cream: "#f6f3ea",
  paper: "#fdfcf7",
  gold: "#e3c56a",
  goldDeep: "#c9a227",
  brass: "#a9861f",
  red: "#d63a2e",
  redLight: "#f2564a",
  green: "#1f6a45",
  greenDeep: "#12482f",
  mint: "#7cc99a",
  steel: "#c9d0d4",
  steelDark: "#8b969c",
  slate: "#2f5c6e",
  blue: "#8fb4c9",
  amber: "#d98f4a",
  ink: "#16303c",
};

/** the outline, shared by every mark so a row still reads as one hand */
const L = {
  fill: "none" as const,
  stroke: C.ink,
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeOpacity: 0.55,
};

const PATHS: Record<GlyphName, React.ReactNode> = {
  /* an open mus'haf on a rehl: green binding, cream leaves, a red ribbon */
  mushaf: (
    <>
      <path fill={C.paper} d="M12 7.6c-1.9-1.4-4-1.9-6.4-1.9v9.2c2.4 0 4.5.5 6.4 1.9Z" />
      <path fill={C.cream} d="M12 7.6c1.9-1.4 4-1.9 6.4-1.9v9.2c-2.4 0-4.5.5-6.4 1.9Z" />
      <path fill={C.green} d="M12 7.6c-1.9-1.4-4-1.9-6.4-1.9v1.5c2.2 0 4.2.5 6.4 1.8 2.2-1.3 4.2-1.8 6.4-1.8V5.7c-2.4 0-4.5.5-6.4 1.9Z" />
      <path {...L} d="M12 7.6c-1.9-1.4-4-1.9-6.4-1.9v9.2c2.4 0 4.5.5 6.4 1.9 1.9-1.4 4-1.9 6.4-1.9V5.7c-2.4 0-4.5.5-6.4 1.9Z" />
      <path stroke={C.steelDark} strokeWidth={0.9} strokeLinecap="round" d="M7.4 9.6h3M7.4 11.4h3M14 9.6h3M14 11.4h3" opacity={0.7} />
      <path fill={C.red} d="M11.4 6.1h1.2v6.2l-.6-.8-.6.8Z" />
      <path fill={C.brass} d="M4.2 16.8 12 20.4l7.8-3.6.7 1.2L12 21.8 3.5 18Z" />
    </>
  ),
  /* memorised and carried: green board, gilt edge, a red heart */
  hifz: (
    <>
      <path fill={C.green} d="M6.6 3.8h9.2a1.6 1.6 0 0 1 1.6 1.6v13.2a1.6 1.6 0 0 1-1.6 1.6H6.6Z" />
      <path fill={C.greenDeep} d="M6.6 3.8A1.6 1.6 0 0 0 5 5.4v13.2a1.6 1.6 0 0 0 1.6 1.6Z" />
      <path fill={C.gold} d="M15.7 4.4h1.4v15.2h-1.4Z" />
      <path {...L} d="M6.6 3.8h9.2a1.6 1.6 0 0 1 1.6 1.6v13.2a1.6 1.6 0 0 1-1.6 1.6H6.6Z" />
      <path {...L} d="M6.6 3.8A1.6 1.6 0 0 0 5 5.4v13.2a1.6 1.6 0 0 0 1.6 1.6" />
      <path stroke={C.gold} strokeWidth={0.9} strokeLinecap="round" d="M8.6 8h5M8.6 10.2h3.6" opacity={0.75} />
      <path fill={C.red} d="M11.9 17.8c-1.7-1.2-2.6-2-2.6-3a1.45 1.45 0 0 1 2.6-.9 1.45 1.45 0 0 1 2.6.9c0 1-.9 1.8-2.6 3Z" />
    </>
  ),
  /* the chain of narration in brass, over a cream scroll with a red seal */
  hadith: (
    <>
      <circle fill={C.gold} cx="6.2" cy="5.6" r="2.3" />
      <circle fill={C.brass} cx="12" cy="5.6" r="2.3" />
      <circle fill={C.gold} cx="17.8" cy="5.6" r="2.3" />
      <circle fill={C.ink} cx="6.2" cy="5.6" r="1.05" opacity={0.5} />
      <circle fill={C.ink} cx="12" cy="5.6" r="1.05" opacity={0.5} />
      <circle fill={C.ink} cx="17.8" cy="5.6" r="1.05" opacity={0.5} />
      <path fill={C.paper} d="M5 11.4h14a1.5 1.5 0 0 1 1.5 1.5v5.6a1.9 1.9 0 0 1-1.9 1.9H6.4a1.9 1.9 0 0 1-1.9-1.9v-5.6A1.5 1.5 0 0 1 5 11.4Z" />
      <path {...L} d="M5 11.4h14a1.5 1.5 0 0 1 1.5 1.5v5.6a1.9 1.9 0 0 1-1.9 1.9H6.4a1.9 1.9 0 0 1-1.9-1.9v-5.6A1.5 1.5 0 0 1 5 11.4Z" />
      <path stroke={C.steelDark} strokeWidth={0.9} strokeLinecap="round" d="M7.4 14.6h8M7.4 16.9h5.2" opacity={0.8} />
      <circle fill={C.red} cx="17.4" cy="17.2" r="1.7" />
    </>
  ),
  /* a brass balance with cream pans */
  fiqh: (
    <>
      <path stroke={C.brass} strokeWidth={1.8} strokeLinecap="round" d="M12 4.6v15.4M4.4 7.6h15.2" />
      <path fill={C.cream} d="M4.4 7.6 1.9 13a2.7 2.7 0 0 0 5 0Z" />
      <path fill={C.cream} d="M19.6 7.6 17.1 13a2.7 2.7 0 0 0 5 0Z" />
      <path {...L} d="M4.4 7.6 1.9 13a2.7 2.7 0 0 0 5 0Z" />
      <path {...L} d="M19.6 7.6 17.1 13a2.7 2.7 0 0 0 5 0Z" />
      <path fill={C.brass} d="M7.4 19.6h9.2l.8 1.4H6.6Z" />
      <circle fill={C.gold} cx="12" cy="7.6" r="2" />
      <circle fill={C.ink} cx="12" cy="7.6" r="0.75" opacity={0.5} />
    </>
  ),
  /* the lattice star: gold on the site's own green */
  aqaid: (
    <>
      <rect fill={C.greenDeep} x="6.2" y="6.2" width="11.6" height="11.6" rx="1.2" />
      <rect fill={C.greenDeep} x="6.2" y="6.2" width="11.6" height="11.6" rx="1.2" transform="rotate(45 12 12)" />
      <rect fill="none" stroke={C.gold} strokeWidth={1.3} x="6.2" y="6.2" width="11.6" height="11.6" rx="1.2" />
      <rect fill="none" stroke={C.gold} strokeWidth={1.3} x="6.2" y="6.2" width="11.6" height="11.6" rx="1.2" transform="rotate(45 12 12)" />
      <circle fill={C.gold} cx="12" cy="12" r="2.1" />
    </>
  ),
  /* cream letterforms, gold harakat, on a slate rule */
  grammar: (
    <>
      <path fill={C.slate} d="M3.6 18.4h16.8v2.2H3.6Z" opacity={0.75} />
      <path fill="none" stroke={C.cream} strokeWidth={1.9} strokeLinecap="round" d="M4.8 16c0-3.1 1.6-4.8 3.5-4.8 1.7 0 2.7 1.1 2.7 2.8V16" />
      <path fill="none" stroke={C.cream} strokeWidth={1.9} strokeLinecap="round" d="M13.6 16c1.9 0 3.2-1.1 3.9-2.6.6-1.4.7-2.9.7-4.3" />
      <circle fill={C.gold} cx="8.1" cy="7.6" r="1.25" />
      <circle fill={C.gold} cx="16.5" cy="6.6" r="1.25" />
      <path stroke={C.red} strokeWidth={1.5} strokeLinecap="round" d="M10.9 6.8 12.7 5" />
    </>
  ),
  /* a red heart held in cream hands */
  character: (
    <>
      <path fill={C.cream} d="M4.4 14.4v3.5a3.2 3.2 0 0 0 3.2 3.2h8.8a3.2 3.2 0 0 0 3.2-3.2v-3.5Z" />
      <path {...L} d="M4.4 14.4v3.5a3.2 3.2 0 0 0 3.2 3.2h8.8a3.2 3.2 0 0 0 3.2-3.2v-3.5" />
      <path fill={C.red} d="M12 10.4c-2-2.1-4.8-1.05-4.8 1.35 0 2 2.1 3.55 4.8 5.55 2.7-2 4.8-3.55 4.8-5.55 0-2.4-2.8-3.45-4.8-1.35Z" />
      <path stroke={C.gold} strokeWidth={1.3} strokeLinecap="round" d="M8.6 6.2 9.6 4.4M15.4 6.2l-1-1.8M12 5.2V3.2" />
    </>
  ),
  /* a green dome on cream walls, gold finial, the road up to it */
  seerah: (
    <>
      <path fill={C.green} d="M6 15.2V11a6 6 0 0 1 12 0v4.2Z" />
      <path fill={C.cream} d="M4.4 15.2h15.2v5.6H4.4Z" />
      <path fill={C.greenDeep} d="M10.4 20.8v-3.1a1.6 1.6 0 0 1 3.2 0v3.1Z" />
      <path {...L} d="M6 15.2V11a6 6 0 0 1 12 0v4.2" />
      <path {...L} d="M4.4 15.2h15.2v5.6H4.4Z" />
      <path fill={C.gold} d="M11.4 2.2h1.2v3h-1.2Z" />
      <circle fill={C.gold} cx="12" cy="1.9" r="1.15" />
      <path stroke={C.brass} strokeWidth={1.2} strokeLinecap="round" d="M2.4 12.8c1.4-.8 2.7-.8 4.1 0M17.5 12.8c1.4-.8 2.7-.8 4.1 0" opacity={0.85} />
    </>
  ),
  /* a gold lantern lighting a cream book */
  deeniyaat: (
    <>
      <path stroke={C.brass} strokeWidth={1.2} strokeLinecap="round" d="M12 2.4v1.6" />
      <path fill={C.gold} d="M9.6 5.8h4.8l-.7 4.4a1.7 1.7 0 0 1-1.7 1.4 1.7 1.7 0 0 1-1.7-1.4Z" />
      <path fill={C.paper} d="M11 7h2l-.4 2.6a.6.6 0 0 1-1.2 0Z" opacity={0.9} />
      <path fill={C.brass} d="M9 3.8h6v1.4H9Z" />
      <path fill={C.paper} d="M12 14.6c-1.8-1.2-3.8-1.6-6-1.6v6.4c2.2 0 4.2.4 6 1.6Z" />
      <path fill={C.cream} d="M12 14.6c1.8-1.2 3.8-1.6 6-1.6v6.4c-2.2 0-4.2.4-6 1.6Z" />
      <path {...L} d="M12 14.6c-1.8-1.2-3.8-1.6-6-1.6v6.4c2.2 0 4.2.4 6 1.6 1.8-1.2 3.8-1.6 6-1.6V13c-2.2 0-4.2.4-6 1.6Z" />
      <path {...L} d="M12 14.6V21" />
    </>
  ),
  /* two letter blocks, each its own colour */
  letters: (
    <>
      <rect fill={C.green} x="3" y="7.4" width="8" height="9.2" rx="1.6" />
      <rect fill={C.amber} x="13" y="7.4" width="8" height="9.2" rx="1.6" />
      <path stroke={C.cream} strokeWidth={1.9} strokeLinecap="round" d="M7 10.2v3.6" />
      <path fill="none" stroke={C.cream} strokeWidth={1.7} strokeLinecap="round" d="M15.4 11.4c0 1.5.7 2.2 1.6 2.2s1.6-.7 1.6-2.2" />
      <circle fill={C.ink} cx="17" cy="9.4" r="0.95" opacity={0.75} />
    </>
  ),
  /* a cream speaker, blue sound */
  sounds: (
    <>
      <path fill={C.cream} d="M5 9.6h2.6L11.4 6v12L7.6 14.4H5a1.2 1.2 0 0 1-1.2-1.2v-2.4A1.2 1.2 0 0 1 5 9.6Z" />
      <path {...L} d="M5 9.6h2.6L11.4 6v12L7.6 14.4H5a1.2 1.2 0 0 1-1.2-1.2v-2.4A1.2 1.2 0 0 1 5 9.6Z" />
      <path fill="none" stroke={C.blue} strokeWidth={1.6} strokeLinecap="round" d="M14.6 9.2a4 4 0 0 1 0 5.6" />
      <path fill="none" stroke={C.blue} strokeWidth={1.4} strokeLinecap="round" d="M17.4 6.8a7.6 7.6 0 0 1 0 10.4" opacity={0.65} />
    </>
  ),
  /* word cards, two colours */
  vocabulary: (
    <>
      <rect fill={C.cream} x="3.4" y="6" width="12.4" height="9" rx="1.6" transform="rotate(-6 9.6 10.5)" />
      <rect fill={C.mint} x="8.2" y="9.4" width="12.4" height="9" rx="1.6" transform="rotate(5 14.4 13.9)" />
      <rect {...L} x="3.4" y="6" width="12.4" height="9" rx="1.6" transform="rotate(-6 9.6 10.5)" />
      <rect {...L} x="8.2" y="9.4" width="12.4" height="9" rx="1.6" transform="rotate(5 14.4 13.9)" />
      <path stroke={C.greenDeep} strokeWidth={1.1} strokeLinecap="round" d="M11.4 13.6h6.2M11.2 16h4" opacity={0.7} />
    </>
  ),
  /* a child, and a gold star for getting it right */
  confidence: (
    <>
      <path fill={C.mint} d="M4.4 20.6v-2.4a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2.4Z" />
      <circle fill={C.cream} cx="9.4" cy="6.6" r="2.7" />
      <path {...L} d="M4.4 20.6v-2.4a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2.4" />
      <circle {...L} cx="9.4" cy="6.6" r="2.7" />
      <path fill={C.gold} d="m18.4 3.2 1 2.1 2.3.3-1.65 1.6.4 2.3-2.05-1.1-2.05 1.1.4-2.3L14.7 5.6l2.3-.3Z" />
    </>
  ),
  /* a wall calendar: cream page, red header, gold today */
  calendar: (
    <>
      <rect fill={C.paper} x="3.4" y="5.4" width="17.2" height="15.2" rx="2" />
      <path fill={C.red} d="M5.4 5.4h13.2a2 2 0 0 1 2 2V10H3.4V7.4a2 2 0 0 1 2-2Z" />
      <rect {...L} x="3.4" y="5.4" width="17.2" height="15.2" rx="2" />
      <path stroke={C.brass} strokeWidth={1.4} strokeLinecap="round" d="M8 2.8v3.4M16 2.8v3.4" />
      <rect fill={C.steel} x="6.6" y="12.4" width="2.6" height="2.4" rx="0.6" />
      <rect fill={C.steel} x="10.7" y="12.4" width="2.6" height="2.4" rx="0.6" />
      <rect fill={C.steel} x="14.8" y="12.4" width="2.6" height="2.4" rx="0.6" />
      <rect fill={C.steel} x="6.6" y="16.2" width="2.6" height="2.4" rx="0.6" />
      <rect fill={C.gold} x="10.7" y="16.2" width="2.6" height="2.4" rx="0.6" />
    </>
  ),
  /* a stack of gold coins */
  tuition: (
    <>
      <path fill={C.brass} d="M5.4 6.4v11.2c0 1.44 2.96 2.6 6.6 2.6s6.6-1.16 6.6-2.6V6.4Z" />
      <ellipse fill={C.gold} cx="12" cy="10.4" rx="6.6" ry="2.6" />
      <ellipse fill={C.gold} cx="12" cy="14.4" rx="6.6" ry="2.6" />
      <ellipse fill={C.gold} cx="12" cy="6.4" rx="6.6" ry="2.6" />
      <ellipse {...L} cx="12" cy="6.4" rx="6.6" ry="2.6" />
      <ellipse fill="none" stroke={C.brass} strokeWidth={1} cx="12" cy="6.4" rx="3" ry="1.1" />
      <path {...L} d="M5.4 6.4v11.2c0 1.44 2.96 2.6 6.6 2.6s6.6-1.16 6.6-2.6V6.4" />
    </>
  ),
  /* a student under a gold cap */
  student: (
    <>
      <path fill={C.blue} d="M4.6 20.6v-1.4a6 6 0 0 1 6-6h2.8a6 6 0 0 1 6 6v1.4Z" />
      <circle fill={C.cream} cx="12" cy="9.6" r="3.3" />
      <path {...L} d="M4.6 20.6v-1.4a6 6 0 0 1 6-6h2.8a6 6 0 0 1 6 6v1.4" />
      <circle {...L} cx="12" cy="9.6" r="3.3" />
      <path fill={C.gold} d="M12 2 20.4 5.2 12 8.4 3.6 5.2Z" />
      <path stroke={C.red} strokeWidth={1.2} strokeLinecap="round" d="M18.6 6.2v3.2" />
    </>
  ),
  /* two guardians, and a red heart between them */
  parents: (
    <>
      <path fill={C.mint} d="M2.6 20.4v-1.2a5.2 5.2 0 0 1 5.2-5.2h1.2a5.2 5.2 0 0 1 5.2 5.2v1.2Z" />
      <path fill={C.blue} d="M15.6 14.2h.9a4.4 4.4 0 0 1 4.4 4.4v1.8h-5.3Z" />
      <circle fill={C.cream} cx="8.4" cy="7.6" r="2.8" />
      <circle fill={C.cream} cx="16.6" cy="8.8" r="2.3" />
      <path {...L} d="M2.6 20.4v-1.2a5.2 5.2 0 0 1 5.2-5.2h1.2a5.2 5.2 0 0 1 5.2 5.2v1.2" />
      <circle {...L} cx="8.4" cy="7.6" r="2.8" />
      <circle {...L} cx="16.6" cy="8.8" r="2.3" />
      <path fill={C.red} d="M12.4 4.4c-.95-1.05-2.4-.5-2.4.7 0 1 1.05 1.75 2.4 2.8 1.35-1.05 2.4-1.8 2.4-2.8 0-1.2-1.45-1.75-2.4-.7Z" />
    </>
  ),
  /* an amber folder of what came before */
  history: (
    <>
      <path fill={C.paper} d="M6.8 7.6h10.4v10.8H6.8Z" />
      <path fill={C.amber} d="M4.4 7.2a2 2 0 0 1 2-2h4l1.8 2.2h5.4a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2Z" />
      <path {...L} d="M4.4 7.2a2 2 0 0 1 2-2h4l1.8 2.2h5.4a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2Z" />
      <path stroke={C.ink} strokeWidth={1.1} strokeLinecap="round" d="M8.4 12.6h7.2M8.4 15.2h4.6" opacity={0.4} />
    </>
  ),
  /* going over the same ground again */
  revision: (
    <>
      <path fill="none" stroke={C.mint} strokeWidth={2} strokeLinecap="round" d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path fill={C.gold} d="M15.8 3.8h5.2v5.2l-2-1.8-1.6 1.4-1.4-1.6 1.6-1.4Z" />
      <path fill="none" stroke={C.cream} strokeWidth={1.4} strokeLinecap="round" d="M12 8.4V12l2.4 1.5" />
    </>
  ),
  /* the shape of a sound, corrected */
  tajweed: (
    <>
      <path fill="none" stroke={C.blue} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" d="M3.4 12h2.4l1.8-5 2.6 10 2.4-8 1.8 5.4 1.4-2.4h2.4" />
      <circle fill={C.gold} cx="19.8" cy="12" r="1.5" />
      <path stroke={C.red} strokeWidth={1.2} strokeLinecap="round" d="M7.6 19.6h8.8" opacity={0.7} />
    </>
  ),
  /* heard, and checked off */
  assessment: (
    <>
      <path fill={C.paper} d="M6.4 3.6h11.2a1.8 1.8 0 0 1 1.8 1.8v13.2a1.8 1.8 0 0 1-1.8 1.8H6.4a1.8 1.8 0 0 1-1.8-1.8V5.4a1.8 1.8 0 0 1 1.8-1.8Z" />
      <path {...L} d="M6.4 3.6h11.2a1.8 1.8 0 0 1 1.8 1.8v13.2a1.8 1.8 0 0 1-1.8 1.8H6.4a1.8 1.8 0 0 1-1.8-1.8V5.4a1.8 1.8 0 0 1 1.8-1.8Z" />
      <path fill={C.brass} d="M9 2.4h6v3.2H9Z" />
      <path fill="none" stroke={C.green} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" d="m8.4 12.4 2.2 2.2 4.8-4.8" />
    </>
  ),
  /* a megaphone: red horn, steel body, gold sound */
  announce: (
    <>
      <path fill={C.steel} d="M4 9.6h3.4L15.4 5v14L7.4 14.4H4A1.6 1.6 0 0 1 2.4 12.8v-1.6A1.6 1.6 0 0 1 4 9.6Z" />
      <path fill={C.steelDark} d="M6.6 14.4h3.2l.6 5.2a1.5 1.5 0 0 1-3 .3Z" />
      <path fill={C.red} d="M15.4 5c1.55 0 2.8 3.15 2.8 7s-1.25 7-2.8 7Z" />
      <path fill={C.redLight} d="M15.4 5c.9 0 1.7 1.1 2.2 2.8-.5-.5-1.3-.8-2.2-.8Z" />
      <path {...L} d="M4 9.6h3.4L15.4 5v14L7.4 14.4H4A1.6 1.6 0 0 1 2.4 12.8v-1.6A1.6 1.6 0 0 1 4 9.6Z" />
      <path fill="none" stroke={C.gold} strokeWidth={1.5} strokeLinecap="round" d="M19.8 9.4a5 5 0 0 1 0 5.2" />
      <path fill="none" stroke={C.gold} strokeWidth={1.3} strokeLinecap="round" d="M21.8 7.2a8.4 8.4 0 0 1 0 9.6" opacity={0.6} />
    </>
  ),
  /* the newsletter's envelope: cream body, red flap, gold seal */
  envelope: (
    <>
      <path fill={C.paper} d="M3.4 9.4h17.2v9.4a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z" />
      <path fill={C.red} d="M3.4 9.4 12 2.6l8.6 6.8-1.5 1.2L12 5.1 4.9 10.6Z" />
      <path {...L} d="M3.4 9.4h17.2v9.4a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z" />
      <path stroke={C.steelDark} strokeWidth={1.1} strokeLinecap="round" d="M4.1 19.8 10.2 14.4M19.9 19.8 13.8 14.4" opacity={0.75} />
      <circle fill={C.gold} cx="12" cy="13.8" r="1.6" />
    </>
  ),
  /* the lattice star, gold */
  star8: (
    <>
      <rect fill={C.gold} x="8.2" y="8.2" width="7.6" height="7.6" opacity={0.35} />
      <rect fill="none" stroke={C.gold} strokeWidth={1.4} x="7.4" y="7.4" width="9.2" height="9.2" />
      <rect fill="none" stroke={C.gold} strokeWidth={1.4} x="7.4" y="7.4" width="9.2" height="9.2" transform="rotate(45 12 12)" />
    </>
  ),
  /* a nib, for a note in the margin */
  note: (
    <>
      <path fill={C.cream} d="M12 3.4 16.2 12 12 20.6 7.8 12Z" />
      <path {...L} d="M12 3.4 16.2 12 12 20.6 7.8 12Z" />
      <path stroke={C.ink} strokeWidth={1.1} strokeLinecap="round" d="M12 8.4V15" opacity={0.4} />
      <circle fill={C.red} cx="12" cy="12" r="1.6" />
    </>
  ),
  /* Jumu'ah: the minbar the khutbah is given from */
  minbar: (
    <>
      <path fill={C.green} d="M4 8.4a5.2 5.2 0 0 1 10.4 0Z" />
      <path fill={C.cream} d="M4 8.4h10.4v11.4H4Z" />
      <path fill={C.amber} d="M14.4 19.8h5.6l-1.6-3.2h-4Z" />
      <path {...L} d="M4 8.4a5.2 5.2 0 0 1 10.4 0" />
      <path {...L} d="M4 19.8V8.4h10.4v11.4" />
      <path {...L} d="M14.4 19.8h5.6l-1.6-3.2h-4" />
      <path fill={C.gold} d="M8.5 4.2h1.4v3.4H8.5Z" />
      <circle fill={C.gold} cx="9.2" cy="3.4" r="1.05" />
      <path stroke={C.brass} strokeWidth={1.1} strokeLinecap="round" d="M6.6 12.2h5.2M6.6 15h5.2" opacity={0.8} />
    </>
  ),
  /* a camera: charcoal body, brass ring, blue-green glass, a live red light */
  camera: (
    <>
      <path fill={C.slate} d="M9.4 3.8h5.2l1.3 2.3h3.5A2.2 2.2 0 0 1 21.6 8.3v9.5a2.2 2.2 0 0 1-2.2 2.2H4.6a2.2 2.2 0 0 1-2.2-2.2V8.3a2.2 2.2 0 0 1 2.2-2.2h3.5Z" />
      <path fill={C.ink} d="M2.4 8.3a2.2 2.2 0 0 1 2.2-2.2h3.5l.5-.9H4.6a2.2 2.2 0 0 0-2.2 2.2v9.5a2.2 2.2 0 0 0 2.2 2.2h1Z" opacity={0.55} />
      <circle fill={C.brass} cx="12" cy="13" r="5.2" />
      <circle fill={C.ink} cx="12" cy="13" r="4" />
      <circle fill={C.slate} cx="12" cy="13" r="3" />
      <circle fill={C.blue} cx="12" cy="13" r="1.9" />
      <path fill={C.paper} d="M10.7 11.5a2 2 0 0 1 1.6-.8.55.55 0 0 1 0 1.1 .9.9 0 0 0-.75.4Z" opacity={0.9} />
      <circle fill={C.red} cx="18.4" cy="9.2" r="1.05" />
      <rect fill={C.gold} x="4.4" y="8.6" width="2.6" height="1.4" rx="0.7" />
      <path {...L} d="M9.4 3.8h5.2l1.3 2.3h3.5A2.2 2.2 0 0 1 21.6 8.3v9.5a2.2 2.2 0 0 1-2.2 2.2H4.6a2.2 2.2 0 0 1-2.2-2.2V8.3a2.2 2.2 0 0 1 2.2-2.2h3.5Z" />
    </>
  ),
  /* the five daily prayers: rows standing under one green arch */
  congregation: (
    <>
      <path fill="none" stroke={C.green} strokeWidth={2.1} strokeLinecap="round" d="M3.6 11.4a8.4 8.4 0 0 1 16.8 0" />
      <path fill={C.gold} d="M11.3 2.2h1.4v2.6h-1.4Z" />
      <circle fill={C.gold} cx="12" cy="1.8" r="1.05" />
      <path fill={C.cream} d="M3.6 13.8h16.8v1.7H3.6Z" />
      <path fill={C.mint} d="M3.6 16.6h16.8v1.7H3.6Z" />
      <path fill={C.cream} d="M3.6 19.4h16.8v1.7H3.6Z" />
    </>
  ),
};

export function Glyph({ name, size = 22, className }: { name: GlyphName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      focusable="false"
      className={className}
      style={{ display: "block", flexShrink: 0 }}
    >
      {PATHS[name]}
    </svg>
  );
}

/** Curriculum labels map to marks here, so a page only names its subjects. */
export const SUBJECT_GLYPH: Record<string, GlyphName> = {
  "Sarf & Nahw": "grammar",
  Quran: "mushaf",
  Hadith: "hadith",
  Fiqh: "fiqh",
  "Aqa'id": "aqaid",
  Nazira: "mushaf",
  Hifz: "hifz",
  Deeniyaat: "deeniyaat",
  Akhlaqiat: "character",
  Seerah: "seerah",
  "New memorization": "hifz",
  Revision: "revision",
  Tajweed: "tajweed",
  Assessment: "assessment",
  Letters: "letters",
  Sounds: "sounds",
  Vocabulary: "vocabulary",
  Confidence: "confidence",
  "Darsul Quran": "mushaf",
  "Qasas-un-Nabiyyeen": "seerah",
};
