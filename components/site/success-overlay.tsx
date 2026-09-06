"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { NewsletterEnvelopeArt } from "@/components/site/newsletter-envelope-art";
import type { SuccessScene } from "@/components/site/success-art";

/**
 * What happens after you press the button, played over the whole screen.
 *
 * The success panels were drawn but still: a picture of a thing that had
 * happened rather than the thing happening. Worse, they sat where the form
 * had been, which on a phone is most of a page-length below the fold — so
 * the people most likely to miss the moment entirely were the ones on the
 * smallest screens.
 *
 * So it takes the screen. The page blurs back, the scene plays in the
 * middle of it, and then it fades and hands you back to the page you were
 * on, where the panel is waiting with the details. Escape, a click, or the
 * skip button end it early; reduced motion skips straight to the last frame
 * and holds it.
 */

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

/* ── easing and windows ───────────────────────────────────────────── */

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** progress within a slice of the timeline, 0 before it and 1 after */
const span = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t: number) => t * t;
/** one settling bounce */
const settle = (t: number) => 1 - Math.cos(t * Math.PI * 1.5) * Math.pow(1 - t, 2);

const DURATION: Record<SuccessScene, number> = {
  register: 3000,
  chair: 2700,
  coin: 2700,
  stamp: 2600,
  envelope: 3400,
};

const CAPTION: Record<SuccessScene, string> = {
  register: "Registration received",
  chair: "Application received",
  coin: "Pledge received",
  stamp: "Details recorded",
  envelope: "Successfully subscribed",
};

/* ── the scenes ───────────────────────────────────────────────────── */

/** a name going into the class register: the pen writes it, then lifts */
function Register({ t }: { t: number }) {
  const enter = easeOut(span(t, 0, 0.16));
  const write = easeInOut(span(t, 0.2, 0.72));
  const lift = easeOut(span(t, 0.72, 1));

  // the line being written, revealed as the pen crosses it
  const LINE = "M115 60c6-3 12 2 18-1s10 2 16-1";
  const lineLen = 42;

  // the pen rides the line, then rises off the page
  const penX = 108 + write * 44;
  const penY = 62 - lift * 26;
  const penRot = 28 - lift * 16;

  return (
    <g opacity={enter} transform={`translate(${(1 - enter) * -8} ${(1 - enter) * 10})`}>
      <path
        d="M18 96 C 46 84 78 84 100 94 C 122 84 154 84 182 96 L 182 40 C 154 28 122 28 100 38 C 78 28 46 28 18 40 Z"
        fill={C.paper}
      />
      <path d="M100 38 L100 94" stroke={C.steelDark} strokeWidth="1.2" opacity="0.6" />
      <g stroke={C.steelDark} strokeWidth="1" opacity="0.45">
        <path d="M28 50h60M28 62h60M28 74h60M112 50h60M112 62h60M112 74h60" />
      </g>
      {/* names already on the page */}
      <g stroke={C.ink} strokeWidth="2" strokeLinecap="round" opacity="0.62">
        <path d="M31 48c5-3 9 2 14-1s8 2 13-1" />
        <path d="M31 60c6-3 11 2 17-1s9 2 14-1" />
        <path d="M31 72c5-3 10 2 15-1s8 2 13-1" />
        <path d="M115 48c5-3 10 2 15-1s7 2 12-1" />
      </g>

      {/* the new one, arriving */}
      <path
        d={LINE}
        stroke={C.green}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={lineLen}
        strokeDashoffset={lineLen * (1 - write)}
      />

      <path d="M96 34 C 98 60 98 74 96 98 L 104 98 C 102 74 102 60 104 34 Z" fill={C.green} />
      <path
        {...L}
        d="M18 96 C 46 84 78 84 100 94 C 122 84 154 84 182 96 L 182 40 C 154 28 122 28 100 38 C 78 28 46 28 18 40 Z"
      />

      {/* the ink, still wet where the pen just left */}
      <circle cx={115 + write * 40} cy="60" r="2.2" fill={C.green} opacity={0.8 * write * (1 - lift * 0.4)} />
      <circle cx={115 + write * 40} cy="59" r="0.9" fill={C.cream} opacity={0.7 * write * (1 - lift)} />

      {/* the pen */}
      <g transform={`translate(${penX} ${penY}) rotate(${penRot})`} opacity={1}>
        <rect x="-2" y="-3" width="46" height="6" rx="3" fill={C.ink} />
        <rect x="36" y="-3" width="10" height="6" rx="2" fill={C.goldDeep} />
        <path d="M-2 0 L-12 0" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
        <path {...L} d="M-2 -3h46v6h-46z" />
      </g>
    </g>
  );
}

/** one more chair carried in: the row shifts along to make space */
function Chair({ t }: { t: number }) {
  const enter = easeOut(span(t, 0, 0.18));
  const shift = easeInOut(span(t, 0.22, 0.7)) * 24;
  const drop = span(t, 0.28, 0.78);
  const land = settle(drop);
  const y = -70 + land * 70;
  const tilt = -16 * (1 - land);

  const seat = (x: number, top: string, body: string, leg: string, key: number) => (
    <g key={key}>
      <rect x={x} y="60" width="26" height="7" rx="2" fill={top} />
      <rect x={x + 2} y="34" width="22" height="26" rx="3" fill={body} />
      <rect x={x + 1} y="67" width="4" height="30" rx="2" fill={leg} />
      <rect x={x + 21} y="67" width="4" height="30" rx="2" fill={leg} />
      <path {...L} d={`M${x} 60h26v7h-26z`} />
      <path {...L} d={`M${x + 2} 34h22v26h-22z`} />
    </g>
  );

  return (
    <g opacity={enter}>
      <g transform={`translate(${-shift} 0)`}>
        {[38, 78, 118].map((x, i) => seat(x, C.green, C.greenDeep, C.steelDark, i))}
      </g>

      {/* the one being set down */}
      <g transform={`translate(${152 - shift} ${y}) rotate(${tilt} 13 66)`} opacity={drop > 0 ? 1 : 0}>
        {seat(0, C.gold, C.goldDeep, C.steel, 9)}
      </g>

      {/* the arc it came in on */}
      <path
        d="M150 18 C 166 8 184 14 192 28"
        fill="none"
        stroke={C.mint}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 7"
        opacity={0.85 * (1 - land)}
      />

      <path d="M12 98h176" stroke={C.cream} strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/** a coin into a box that already has a few in it */
function Coin({ t }: { t: number }) {
  const enter = easeOut(span(t, 0, 0.18));
  const fall = easeIn(span(t, 0.2, 0.62));
  const y = -78 + fall * 110;
  // it turns as it falls, so it reads as a coin rather than a disc
  const spin = Math.abs(Math.cos(span(t, 0.2, 0.62) * Math.PI * 2.2));
  const gone = span(t, 0.6, 0.68);
  const jolt = Math.sin(span(t, 0.62, 0.86) * Math.PI * 3) * (1 - span(t, 0.62, 0.86)) * 2.6;

  return (
    <g opacity={enter}>
      <g transform={`translate(0 ${jolt})`}>
        <path d="M46 52h108v46a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6Z" fill={C.wood} />
        <path d="M46 52h108v10H46Z" fill={C.woodDeep} />
        <rect x="42" y="42" width="116" height="12" rx="3" fill={C.woodDeep} />
        <rect x="86" y="45" width="28" height="5" rx="2.5" fill="#150c05" />
        <rect x="46" y="76" width="108" height="8" fill={C.goldDeep} opacity="0.85" />
        <path {...L} d="M46 52h108v46a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6Z" />
        <path {...L} d="M42 42h116v12H42z" />

        {/* the ones already in, jostled by the new arrival */}
        <g opacity="0.9" transform={`translate(0 ${jolt * 0.5})`}>
          <circle cx="74" cy="92" r="7" fill={C.brass} />
          <circle cx="88" cy="95" r="6" fill={C.gold} />
          <circle cx="118" cy="93" r="7" fill={C.goldDeep} />
        </g>
      </g>

      {/* the coin, turning as it drops */}
      <g transform={`translate(100 ${y})`} opacity={1 - gone}>
        <g transform={`scale(${0.18 + spin * 0.82} 1)`}>
          <circle cx="0" cy="0" r="11" fill={C.gold} />
          <circle cx="0" cy="0" r="7.5" fill="none" stroke={C.brass} strokeWidth="1.6" />
          <path d="M0 -5v10M-5 0h10" stroke={C.brass} strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** the receipt, stamped */
function Stamp({ t }: { t: number }) {
  const enter = easeOut(span(t, 0, 0.18));
  const down = easeIn(span(t, 0.2, 0.5));
  const up = easeOut(span(t, 0.56, 1));
  const hit = span(t, 0.48, 0.56);
  const y = -96 + down * 96 - up * 104;
  const squash = 1 + Math.sin(hit * Math.PI) * 0.06;

  return (
    <g opacity={enter}>
      <path d="M40 22h84v84l-10-6-10 6-11-6-11 6-11-6-10 6-11-6-10 6Z" fill={C.paper} />
      <g stroke={C.steelDark} strokeWidth="1.1" opacity="0.5">
        <path d="M52 38h60M52 50h60M52 62h36" />
      </g>
      <path d="M52 78h34" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
      <path {...L} d="M40 22h84v84l-10-6-10 6-11-6-11 6-11-6-10 6-11-6-10 6Z" />

      {/* the mark, left behind the moment it lands */}
      <g transform={`rotate(-13 112 70) scale(${0.86 + hit * 0.14})`} opacity={hit} style={{ transformOrigin: "112px 70px" }}>
        <circle cx="112" cy="70" r="21" fill="none" stroke={C.red} strokeWidth="3" />
        <circle cx="112" cy="70" r="16" fill="none" stroke={C.red} strokeWidth="1.4" opacity="0.7" />
        <path d="M101 70h22M112 61v18" stroke={C.red} strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* the stamp itself */}
      <g transform={`translate(0 ${y}) rotate(9 152 34) scale(1 ${squash})`} style={{ transformOrigin: "152px 60px" }}>
        <rect x="112" y="48" width="40" height="9" rx="2" fill={C.redDeep} />
        <rect x="120" y="34" width="24" height="15" rx="3" fill={C.wood} />
        <rect x="126" y="20" width="12" height="16" rx="5" fill={C.woodDeep} />
        <path {...L} d="M112 48h40v9h-40z" />
        <path {...L} d="M120 34h24v15h-24z" />
      </g>
    </g>
  );
}

/* ── the overlay ──────────────────────────────────────────────────── */

export function SuccessOverlay({ scene, onClose }: { scene: SuccessScene; onClose: () => void }) {
  const reduce = useReducedMotion();
  const [t, setT] = React.useState(reduce ? 1 : 0);
  const [leaving, setLeaving] = React.useState(false);
  /**
   * It has to leave the page's own tree. The success panel it is rendered
   * beside animates on `y`, which makes a transform, which makes a
   * containing block — so `position: fixed` was measuring itself against
   * that panel and the navbar was sitting on top of the blur.
   */
  const [host, setHost] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setHost(document.body), []);

  React.useEffect(() => {
    if (reduce) {
      const id = window.setTimeout(() => setLeaving(true), 1600);
      return () => window.clearTimeout(id);
    }
    const t0 = performance.now();
    let raf = 0;
    let hold = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION[scene]);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(step);
      // a beat to look at the finished picture before handing the page back
      else hold = window.setTimeout(() => setLeaving(true), 1000);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hold);
    };
  }, [reduce, scene]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLeaving(true);
    };
    window.addEventListener("keydown", onKey);
    // the page behind must not scroll while this is up
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  if (!host) return null;

  return createPortal(
    <motion.div
      className="da-sx"
      role="dialog"
      aria-live="polite"
      aria-label={CAPTION[scene]}
      onClick={() => setLeaving(true)}
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: leaving ? 0.45 : 0.3 }}
      onAnimationComplete={() => {
        if (leaving) onClose();
      }}
    >
      <motion.div
        className="da-sx-stage"
        initial={reduce ? false : { scale: 0.9, y: 14 }}
        animate={{ scale: leaving ? 0.97 : 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 0.8, 0.4, 1] }}
      >
        {scene === "envelope" ? (
          /* closed, then the flap folds open, then the plane leaves */
          <NewsletterEnvelopeArt
            className="da-sx-env"
            fold={-1 + 2 * easeInOut(span(t, 0.18, 0.46))}
            flight={t < 0.48 ? -1 : easeInOut(span(t, 0.48, 1))}
          />
        ) : (
          <svg className="da-sx-art" viewBox="0 0 200 118" aria-hidden focusable="false">
            {scene === "register" && <Register t={t} />}
            {scene === "chair" && <Chair t={t} />}
            {scene === "coin" && <Coin t={t} />}
            {scene === "stamp" && <Stamp t={t} />}
          </svg>
        )}

        <motion.p
          className="da-sx-caption"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: t > 0.82 ? 1 : 0, y: t > 0.82 ? 0 : 8 }}
          transition={{ duration: 0.45 }}
        >
          {CAPTION[scene]}
        </motion.p>
      </motion.div>

      <button type="button" className="da-sx-skip" onClick={() => setLeaving(true)}>
        Skip
      </button>
    </motion.div>,
    host,
  );
}
