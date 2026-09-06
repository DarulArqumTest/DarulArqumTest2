/**
 * A drawn mark for each thing the masjid actually teaches.
 *
 * The registration pages used a row of identical dots for the curriculum and
 * a "◷" and a "$" for schedule and tuition, which told you nothing: five
 * subjects that differ only by their caption, and two tiles that differ only
 * by their colour. Every mark here says what it is — the Quran is a mushaf on
 * a rehl, Hadith is a chain of narration over a scroll, Fiqh is a balance,
 * Aqa'id is the eight-point star the site's own lattice is built from.
 *
 * Two layers, not one: a tonal mass under the line, so a mark reads as a
 * drawing rather than a wireframe, plus exactly one warm detail each — a gilt
 * page edge, a gold ribbon, the seal on a scroll — drawn from `--glyph-accent`
 * so no mark is ever all one tint. One 24-unit box and one line weight
 * throughout, so a row still reads as one hand. No animation: these label
 * things, and a label that bobs is just harder to read.
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
  | "congregation";

const S = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** the mass under the line — what stops a mark reading as a wireframe */
const F = { fill: "currentColor", opacity: 0.16 };
const F2 = { fill: "currentColor", opacity: 0.3 };
/** the one warm detail each mark is allowed, so it is never all one tint */
const GOLD = { fill: "var(--glyph-accent, #e3c56a)" };

const PATHS: Record<GlyphName, React.ReactNode> = {
  /* an open mushaf resting on a rehl */
  mushaf: (
    <>
      <path {...F} d="M12 7.6c-1.9-1.4-4-1.9-6.4-1.9v9.2c2.4 0 4.5.5 6.4 1.9Z" />
      <path {...F2} d="M12 7.6c1.9-1.4 4-1.9 6.4-1.9v9.2c-2.4 0-4.5.5-6.4 1.9Z" />
      <path {...S} d="M12 7.6c-1.9-1.4-4-1.9-6.4-1.9v9.2c2.4 0 4.5.5 6.4 1.9 1.9-1.4 4-1.9 6.4-1.9V5.7c-2.4 0-4.5.5-6.4 1.9Z" />
      <path {...S} d="M12 7.6v9.2" />
      <path {...S} d="M7.4 8.8h3M7.4 11h3M14 8.8h3M14 11h3" opacity={0.45} strokeWidth={1.1} />
      <path {...GOLD} d="M11.3 5.9h1.4v6.4l-.7-.9-.7.9Z" opacity={0.9} />
      <path {...S} d="M4.2 17.4 12 21l7.8-3.6" />
      <path {...S} d="M7.4 21.4 12 19.1l4.6 2.3" opacity={0.55} />
    </>
  ),
  /* a closed mushaf held to the heart — memorised, carried */
  hifz: (
    <>
      <path {...S} d="M6.6 3.8h9.2a1.6 1.6 0 0 1 1.6 1.6v13.2a1.6 1.6 0 0 1-1.6 1.6H6.6Z" />
      <path {...S} d="M6.6 3.8A1.6 1.6 0 0 0 5 5.4v13.2a1.6 1.6 0 0 0 1.6 1.6" />
      <path {...F} d="M6.6 3.8h9.2a1.6 1.6 0 0 1 1.6 1.6v13.2a1.6 1.6 0 0 1-1.6 1.6H6.6Z" />
      <path {...GOLD} d="M15.6 4.4h1.2v15.2h-1.2Z" opacity={0.75} />
      <path {...S} d="M8.6 8.2h5.2M8.6 10.6h4" opacity={0.5} strokeWidth={1.1} />
      <path {...GOLD} d="M11.9 17.7c-1.6-1.2-2.5-1.9-2.5-2.9a1.4 1.4 0 0 1 2.5-.85 1.4 1.4 0 0 1 2.5.85c0 1-.9 1.7-2.5 2.9Z" />
    </>
  ),
  /* a chain of narration above the text it carries */
  hadith: (
    <>
      <circle {...S} cx="6.2" cy="5.6" r="2.3" />
      <circle {...S} cx="12" cy="5.6" r="2.3" />
      <circle {...S} cx="17.8" cy="5.6" r="2.3" />
      <path {...S} d="M8.5 5.6h1.2M14.3 5.6h1.2" />
      <circle {...F2} cx="6.2" cy="5.6" r="2.3" />
      <circle {...F2} cx="17.8" cy="5.6" r="2.3" />
      <path {...F} d="M5 11.4h14a1.5 1.5 0 0 1 1.5 1.5v5.6a1.9 1.9 0 0 1-1.9 1.9H6.4a1.9 1.9 0 0 1-1.9-1.9v-5.6A1.5 1.5 0 0 1 5 11.4Z" />
      <path {...S} d="M5 11.4h14a1.5 1.5 0 0 1 1.5 1.5v5.6a1.9 1.9 0 0 1-1.9 1.9H6.4a1.9 1.9 0 0 1-1.9-1.9v-5.6A1.5 1.5 0 0 1 5 11.4Z" />
      <path {...S} d="M7.6 14.8h8.8M7.6 17.4h5.6" opacity={0.55} strokeWidth={1.1} />
      <circle {...GOLD} cx="17.6" cy="17.2" r="1.6" opacity={0.9} />
    </>
  ),
  /* a balance — rulings weighed */
  fiqh: (
    <>
      <path {...S} d="M12 4v16M7.4 20.4h9.2" />
      <path {...S} d="M4.4 7.6h15.2" />
      <path {...F} d="M4.4 7.6 1.9 13a2.7 2.7 0 0 0 5 0Z" />
      <path {...F} d="M19.6 7.6 17.1 13a2.7 2.7 0 0 0 5 0Z" />
      <path {...S} d="M4.4 7.6 1.9 13a2.7 2.7 0 0 0 5 0Z" />
      <path {...S} d="M19.6 7.6 17.1 13a2.7 2.7 0 0 0 5 0Z" />
      <path {...F2} d="M9.4 19.6h5.2l.6 1.2H8.8Z" />
      <circle {...GOLD} cx="12" cy="7.6" r="1.7" />
    </>
  ),
  /* the eight-point star the site's lattice is built from */
  aqaid: (
    <>
      <rect {...F} x="6.2" y="6.2" width="11.6" height="11.6" rx="1.2" />
      <rect {...F} x="6.2" y="6.2" width="11.6" height="11.6" rx="1.2" transform="rotate(45 12 12)" />
      <rect {...S} x="6.2" y="6.2" width="11.6" height="11.6" rx="1.2" />
      <rect {...S} x="6.2" y="6.2" width="11.6" height="11.6" rx="1.2" transform="rotate(45 12 12)" />
      <circle {...GOLD} cx="12" cy="12" r="2" />
    </>
  ),
  /* letterforms with their harakat — the grammar that unlocks the rest */
  grammar: (
    <>
      <path {...S} d="M4.6 15.6c0-3 1.5-4.6 3.4-4.6 1.6 0 2.6 1.1 2.6 2.7v2.5" />
      <path {...S} d="M13.4 16.2c1.9 0 3.2-1.1 3.9-2.6.6-1.4.7-2.9.7-4.3" />
      <path {...S} d="M4.6 18.6h14.8" opacity={0.5} />
      <path {...F} d="M3.6 18.2h16.8v2.4H3.6Z" />
      <circle cx="8" cy="7.4" r="1.15" {...GOLD} />
      <circle cx="16.4" cy="6.6" r="1.15" {...GOLD} />
      <path {...S} d="M11 6.6 12.6 5" opacity={0.75} />
    </>
  ),
  /* character: a heart held in an open hand */
  character: (
    <>
      <path {...S} d="M12 10.6c-1.9-2-4.6-1-4.6 1.3 0 1.9 2 3.4 4.6 5.3 2.6-1.9 4.6-3.4 4.6-5.3 0-2.3-2.7-3.3-4.6-1.3Z" />
      <path {...S} d="M4.4 14.8v3.1a3.2 3.2 0 0 0 3.2 3.2h8.8a3.2 3.2 0 0 0 3.2-3.2v-3.1" />
      <path {...S} d="M8.6 6.4 9.6 4.6M15.4 6.4l-1-1.8M12 5.4V3.4" opacity={0.6} />
    </>
  ),
  /* the road to the masjid — a life, and where it led */
  seerah: (
    <>
      <path {...S} d="M6 15.6V11a6 6 0 0 1 12 0v4.6" />
      <path {...S} d="M4.4 15.6h15.2v5.2H4.4Z" />
      <path {...S} d="M10.4 20.8v-3a1.6 1.6 0 0 1 3.2 0v3" />
      <path {...S} d="M12 5V2.6" opacity={0.6} />
      <path {...S} d="M2.6 12.6c1.4-.7 2.6-.7 4 0" opacity={0.45} />
      <path {...S} d="M17.4 12.6c1.4-.7 2.6-.7 4 0" opacity={0.45} />
    </>
  ),
  /* everyday practice: a lantern lighting an open book */
  deeniyaat: (
    <>
      <path {...S} d="M12 2.6v1.6" />
      <path {...S} d="M9.6 5.8h4.8l-.7 4.4a1.7 1.7 0 0 1-1.7 1.4h0a1.7 1.7 0 0 1-1.7-1.4Z" />
      <path {...S} d="M9.2 4.2h5.6" />
      <path {...S} d="M12 14.6c-1.8-1.2-3.8-1.6-6-1.6v6.4c2.2 0 4.2.4 6 1.6 1.8-1.2 3.8-1.6 6-1.6V13c-2.2 0-4.2.4-6 1.6Z" />
      <path {...S} d="M12 14.6V21" />
    </>
  ),
  /* alif, ba — the first blocks */
  letters: (
    <>
      <rect {...S} x="3" y="7.4" width="8" height="9.2" rx="1.6" />
      <rect {...S} x="13" y="7.4" width="8" height="9.2" rx="1.6" />
      <path {...S} d="M7 10.4v3.2" />
      <path {...S} d="M15.4 11.6c0 1.4.7 2 1.6 2s1.6-.6 1.6-2" />
      <circle cx="17" cy="9.6" r="0.95" fill="currentColor" />
    </>
  ),
  /* sound leaving the mouth */
  sounds: (
    <>
      <path {...S} d="M5 9.6h2.6L11.4 6v12L7.6 14.4H5a1.2 1.2 0 0 1-1.2-1.2v-2.4A1.2 1.2 0 0 1 5 9.6Z" />
      <path {...S} d="M14.6 9.2a4 4 0 0 1 0 5.6" />
      <path {...S} d="M17.4 6.8a7.6 7.6 0 0 1 0 10.4" opacity={0.6} />
    </>
  ),
  /* words, collected */
  vocabulary: (
    <>
      <rect {...S} x="3.4" y="6" width="12.4" height="9" rx="1.6" transform="rotate(-6 9.6 10.5)" />
      <rect {...S} x="8.2" y="9.4" width="12.4" height="9" rx="1.6" transform="rotate(5 14.4 13.9)" />
      <path {...S} d="M11 13.6h6.4M11 16h4.2" opacity={0.6} />
    </>
  ),
  /* a hand up, and a star for getting it right */
  confidence: (
    <>
      <circle {...S} cx="9.4" cy="6.6" r="2.6" />
      <path {...S} d="M4.4 20.6v-2.4a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v2.4" />
      <path {...S} d="M18.4 3.4l.9 1.9 2.1.3-1.5 1.5.36 2.1-1.86-1-1.86 1 .36-2.1-1.5-1.5 2.1-.3Z" />
    </>
  ),
  /* a week on a wall calendar */
  calendar: (
    <>
      <rect {...F} x="3.4" y="5.4" width="17.2" height="15.2" rx="2" />
      <path {...F2} d="M3.4 7.4a2 2 0 0 1 2-2h13.2a2 2 0 0 1 2 2V10H3.4Z" />
      <rect {...S} x="3.4" y="5.4" width="17.2" height="15.2" rx="2" />
      <path {...S} d="M3.4 10h17.2" />
      <path {...S} d="M8 3.4v3.4M16 3.4v3.4" />
      <circle {...GOLD} cx="8" cy="3.9" r="0.9" opacity={0.85} />
      <circle {...GOLD} cx="16" cy="3.9" r="0.9" opacity={0.85} />
      <rect x="6.6" y="12.6" width="2.6" height="2.6" rx="0.7" fill="currentColor" opacity={0.85} />
      <rect x="10.7" y="12.6" width="2.6" height="2.6" rx="0.7" fill="currentColor" opacity={0.85} />
      <rect x="14.8" y="12.6" width="2.6" height="2.6" rx="0.7" fill="currentColor" opacity={0.85} />
      <rect x="6.6" y="16.6" width="2.6" height="2.6" rx="0.7" fill="currentColor" opacity={0.85} />
      <rect x="10.7" y="16.6" width="2.6" height="2.6" rx="0.7" {...GOLD} />
    </>
  ),
  /* a stack of coins and the month they cover */
  tuition: (
    <>
      <path {...F} d="M5.4 6.4v11.2c0 1.44 2.96 2.6 6.6 2.6s6.6-1.16 6.6-2.6V6.4Z" />
      <ellipse {...GOLD} cx="12" cy="6.4" rx="6.6" ry="2.6" opacity={0.9} />
      <ellipse {...S} cx="12" cy="6.4" rx="6.6" ry="2.6" />
      <ellipse {...S} cx="12" cy="6.4" rx="3" ry="1.1" opacity={0.5} strokeWidth={1.1} />
      <path {...S} d="M5.4 6.4v4c0 1.44 2.96 2.6 6.6 2.6s6.6-1.16 6.6-2.6v-4" />
      <path {...S} d="M5.4 10.4v4c0 1.44 2.96 2.6 6.6 2.6s6.6-1.16 6.6-2.6v-4" />
      <path {...S} d="M5.4 14.4v3.2c0 1.44 2.96 2.6 6.6 2.6s6.6-1.16 6.6-2.6v-3.2" />
    </>
  ),
  student: (
    <>
      <path {...F} d="M4.6 20.6v-1.4a6 6 0 0 1 6-6h2.8a6 6 0 0 1 6 6v1.4Z" />
      <circle {...F2} cx="12" cy="9.4" r="3.4" />
      <circle {...S} cx="12" cy="9.4" r="3.4" />
      <path {...S} d="M4.6 20.6v-1.4a6 6 0 0 1 6-6h2.8a6 6 0 0 1 6 6v1.4" />
      <path {...GOLD} d="M12 1.8 20.4 5.2 12 8.6 3.6 5.2Z" opacity={0.9} />
      <path {...S} d="M18.6 6.3v3.1" opacity={0.6} strokeWidth={1.2} />
    </>
  ),
  parents: (
    <>
      <path {...F} d="M2.6 20.4v-1.2a5.2 5.2 0 0 1 5.2-5.2h1.2a5.2 5.2 0 0 1 5.2 5.2v1.2Z" />
      <path {...F} d="M15.6 14.2h.9a4.4 4.4 0 0 1 4.4 4.4v1.8h-5.3Z" />
      <circle {...F2} cx="8.4" cy="7.6" r="2.9" />
      <circle {...F2} cx="16.6" cy="8.8" r="2.4" />
      <path {...GOLD} d="M12.2 4.6c-1-1.1-2.5-.5-2.5.7 0 1 1.1 1.8 2.5 2.9 1.4-1.1 2.5-1.9 2.5-2.9 0-1.2-1.5-1.8-2.5-.7Z" opacity={0.9} />
      <circle {...S} cx="8.4" cy="7.6" r="2.9" />
      <circle {...S} cx="16.6" cy="8.8" r="2.4" />
      <path {...S} d="M2.6 20.4v-1.2a5.2 5.2 0 0 1 5.2-5.2h1.2a5.2 5.2 0 0 1 5.2 5.2v1.2" />
      <path {...S} d="M15.6 14.2h.9a4.4 4.4 0 0 1 4.4 4.4v1.8" />
    </>
  ),
  /* what has been studied before now */
  history: (
    <>
      <path {...F} d="M4.4 7.2a2 2 0 0 1 2-2h4l1.8 2.2h5.4a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2Z" />
      <path {...GOLD} d="M6.4 5.2h4l1.8 2.2H4.4v-.2a2 2 0 0 1 2-2Z" opacity={0.8} />
      <path {...S} d="M4.4 7.2a2 2 0 0 1 2-2h4l1.8 2.2h5.4a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2Z" />
      <path {...S} d="M8.4 12.6h7.2M8.4 15.4h4.6" opacity={0.6} strokeWidth={1.1} />
    </>
  ),
  /* revision: the same ground, gone over again */
  revision: (
    <>
      <path {...S} d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path {...S} d="M20.4 4.4v4.2h-4.2" />
      <path {...S} d="M12 8.2V12l2.6 1.6" opacity={0.7} />
    </>
  ),
  /* tajweed: the shape of a sound, corrected */
  tajweed: (
    <>
      <path {...S} d="M3.4 12h2.4l1.8-5 2.6 10 2.4-8 1.8 5.4 1.4-2.4h5" />
      <circle cx="19.4" cy="7" r="1.1" fill="currentColor" opacity={0.8} />
    </>
  ),
  /* assessment: heard, and checked off */
  assessment: (
    <>
      <path {...S} d="M6.4 3.6h11.2a1.8 1.8 0 0 1 1.8 1.8v13.2a1.8 1.8 0 0 1-1.8 1.8H6.4a1.8 1.8 0 0 1-1.8-1.8V5.4a1.8 1.8 0 0 1 1.8-1.8Z" />
      <path {...S} d="M9 2.6h6v3H9Z" />
      <path {...S} d="M8.4 12.4l2.2 2.2 4.8-4.8" />
    </>
  ),
  /* the quiet sibling of the homepage's cartoon megaphone */
  announce: (
    <>
      <path {...F} d="M4 9.6h3.4L15.4 5v14L7.4 14.4H4A1.6 1.6 0 0 1 2.4 12.8v-1.6A1.6 1.6 0 0 1 4 9.6Z" />
      <path {...S} d="M4 9.6h3.4L15.4 5v14L7.4 14.4H4A1.6 1.6 0 0 1 2.4 12.8v-1.6A1.6 1.6 0 0 1 4 9.6Z" />
      <path {...GOLD} d="M15.4 5c1.5 0 2.6 3.1 2.6 7s-1.1 7-2.6 7Z" opacity={0.9} />
      <path {...S} d="M6.6 14.6l1 5.2a1.4 1.4 0 0 0 2.8-.2l-.5-4.4" />
      <path {...S} d="M19.6 9.4a5 5 0 0 1 0 5.2" opacity={0.7} />
      <path {...S} d="M21.4 7.2a8.4 8.4 0 0 1 0 9.6" opacity={0.45} />
    </>
  ),
  /* the newsletter's own envelope, flap flung open — small */
  envelope: (
    <>
      <path {...F} d="M3.4 9.4h17.2v9.4a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z" />
      <path {...S} d="M3.4 9.4h17.2v9.4a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z" />
      <path {...GOLD} d="M3.4 9.4 12 2.6l8.6 6.8-1.4 1.1L12 5.1 4.8 10.5Z" />
      <path {...S} d="M3.4 9.4 12 2.6l8.6 6.8" />
      <path {...S} d="M3.9 19.9 10 14.2M20.1 19.9 14 14.2" opacity={0.55} strokeWidth={1.2} />
    </>
  ),
  /* the lattice star, drawn — the site's ornament, not a font character */
  star8: (
    <>
      <rect {...F} x="7.4" y="7.4" width="9.2" height="9.2" />
      <rect {...S} x="7.4" y="7.4" width="9.2" height="9.2" />
      <rect {...S} x="7.4" y="7.4" width="9.2" height="9.2" transform="rotate(45 12 12)" />
    </>
  ),
  /* a nib, for a note in the margin */
  note: (
    <>
      <path {...F} d="M12 3.4 16.2 12 12 20.6 7.8 12Z" />
      <path {...S} d="M12 3.4 16.2 12 12 20.6 7.8 12Z" />
      <path {...S} d="M12 8.6V15" opacity={0.6} strokeWidth={1.2} />
      <circle {...GOLD} cx="12" cy="12" r="1.5" />
    </>
  ),
  /* Jumu'ah: the minbar the khutbah is given from */
  minbar: (
    <>
      <path {...S} d="M4 8.4a5.2 5.2 0 0 1 10.4 0" />
      <path {...F} d="M4 8.4h10.4v11.4H4Z" />
      <path {...S} d="M4 19.8V8.4h10.4v11.4" />
      <path {...S} d="M14.4 19.8h5.6l-1.6-3.2h-4M16.4 16.6l-1.4-3h-.6" />
      <path {...GOLD} d="M8.4 4.4h1.6v3.2H8.4Z" opacity={0.85} />
      <path {...S} d="M9.2 4.4V2.6" opacity={0.6} strokeWidth={1.2} />
      <path {...S} d="M6.6 12.2h5.2M6.6 15.2h5.2" opacity={0.5} strokeWidth={1.1} />
    </>
  ),
  /* the five daily prayers: rows standing under one arch */
  congregation: (
    <>
      <path {...S} d="M3.6 11.4a8.4 8.4 0 0 1 16.8 0" />
      <path {...GOLD} d="M11.2 2.4h1.6v2.4h-1.6Z" opacity={0.85} />
      <path {...F} d="M3.6 14h16.8v2.4H3.6ZM3.6 18h16.8v2.4H3.6Z" />
      <path {...S} d="M3.6 14h16.8M3.6 16.4h16.8M3.6 18h16.8M3.6 20.4h16.8" opacity={0.75} strokeWidth={1.3} />
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
};
