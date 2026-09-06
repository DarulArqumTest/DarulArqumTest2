"use client";

import * as React from "react";
import { motion } from "motion/react";

/**
 * The newsletter envelope — one drawing, used in both places it belongs.
 *
 * It was drawn for the homepage card: a white envelope with its flap flung
 * open on a red field, a paper aeroplane leaving on a dotted loop, speed
 * ticks behind it. Clicking it landed you on a signup page fronted by a
 * completely different envelope — a flat green outline with a wax seal — so
 * the best drawing on the homepage introduced a page that then disowned it.
 *
 * Now the card and the page show the same envelope, and on the page it can
 * move: the flap folds shut, and the aeroplane leaves the mouth and flies
 * the dotted path out of frame, laying the dots down as it goes.
 *
 * The flight is measured off the path itself rather than keyframed, so the
 * plane sits on the curve and banks with it. Before measurement (and during
 * server render) it falls back to the resting position the card has always
 * drawn, which is why the homepage card looks identical either way.
 */

/** the dotted loop, as drawn on the card */
const TRAIL =
  "M170 132 C 200 124 216 104 212 84 C 209 66 188 64 184 82 C 179 104 204 116 228 108 C 252 100 264 80 266 58";
/** the same loop, carried on past the frame so the plane can actually leave */
const FLIGHT = `${TRAIL} C 268 40 278 18 306 -16`;

/** where the plane rests on the card: the end of the visible trail */
const REST_FALLBACK = { x: 276, y: 34, a: -12 };

type Pos = { x: number; y: number; a: number };

export function NewsletterEnvelopeArt({
  className,
  flying = false,
  onFlightEnd,
}: {
  className?: string;
  /** fold the flap shut and send the plane */
  flying?: boolean;
  onFlightEnd?: () => void;
}) {
  const trailRef = React.useRef<SVGPathElement>(null);
  const flightRef = React.useRef<SVGPathElement>(null);

  const [dots, setDots] = React.useState<{ x: number; y: number; t: number }[]>([]);
  const [pos, setPos] = React.useState<Pos | null>(null);
  /** how far along FLIGHT the plane is, 0-1 */
  const [prog, setProg] = React.useState(1);
  /** where the visible trail ends, as a fraction of the whole flight */
  const [trailFrac, setTrailFrac] = React.useState(1);
  /**
   * rest → the card's drawing exactly, plane parked where it was drawn
   * fold → the flap shutting; the plane and its trail clear out of the way
   * fly  → the plane runs the path from the envelope's mouth and leaves
   *
   * The clearing matters: the parked plane sits past the end of the trail at
   * an angle of its own, so moving it straight to the path start would be a
   * visible jump. It goes while the flap is folding instead.
   */
  const [phase, setPhase] = React.useState<"rest" | "fold" | "fly">("rest");

  /** read a point and its heading off the flight path */
  const read = React.useCallback((t: number): Pos | null => {
    const p = flightRef.current;
    if (!p) return null;
    const len = p.getTotalLength();
    if (!len) return null;
    const at = p.getPointAtLength(t * len);
    const ahead = p.getPointAtLength(Math.min(len, t * len + 2));
    const behind = p.getPointAtLength(Math.max(0, t * len - 2));
    const a = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
    return { x: at.x, y: at.y, a };
  }, []);

  // measure once: the dots along the visible trail, and the resting position
  React.useEffect(() => {
    const trail = trailRef.current;
    const flight = flightRef.current;
    if (!trail || !flight) return;
    const tLen = trail.getTotalLength();
    const fLen = flight.getTotalLength();
    if (!tLen || !fLen) return;

    const n = 15;
    const next: { x: number; y: number; t: number }[] = [];
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      const pt = trail.getPointAtLength(t * tLen);
      next.push({ x: pt.x, y: pt.y, t });
    }
    setDots(next);
    setTrailFrac(tLen / fLen);
    setProg(tLen / fLen);
  }, [read]);

  // fold first, then fly
  React.useEffect(() => {
    if (!flying) return;
    setPhase("fold");
    const handoff = window.setTimeout(() => setPhase("fly"), 480);
    return () => window.clearTimeout(handoff);
  }, [flying]);

  /**
   * The flap, 1 open through 0 flat to -1 shut.
   *
   * Driven here and written into the SVG transform rather than handed to
   * Motion: the flap lives inside a rotated group, and a CSS transform on an
   * SVG child composes against the viewport rather than the parent's own
   * frame, which sent the flap off to one side instead of folding it.
   */
  const [fold, setFold] = React.useState(1);
  React.useEffect(() => {
    if (!flying) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 480);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setFold(1 - 2 * e);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [flying]);

  React.useEffect(() => {
    if (phase !== "fly") return;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      // eases out of the envelope, then away
      const t = Math.min(1, (now - t0) / 1500);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setProg(e);
      const p = read(e);
      if (p) setPos(p);
      if (t < 1) raf = requestAnimationFrame(step);
      else onFlightEnd?.();
    };
    setProg(0);
    const start = read(0);
    if (start) setPos(start);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, read, onFlightEnd]);

  // at rest the plane keeps the transform it was drawn with, so the card and
  // the page's hero are the same picture down to the pixel
  const planeTransform =
    pos === null
      ? undefined
      : `translate(${pos.x - REST_FALLBACK.x} ${pos.y - REST_FALLBACK.y}) rotate(${pos.a - REST_FALLBACK.a} ${REST_FALLBACK.x} ${REST_FALLBACK.y})`;

  return (
    <svg className={className} viewBox="0 0 320 270" aria-hidden focusable="false">
      {/* measured, never painted */}
      <path ref={trailRef} d={TRAIL} fill="none" stroke="none" />
      <path ref={flightRef} d={FLIGHT} fill="none" stroke="none" />

      {/* speed ticks */}
      <g stroke="#fff" strokeWidth="7" strokeLinecap="round">
        <path d="M12 138 L40 110" />
        <path d="M42 88 L60 70" />
        <path d="M6 182 L26 164" />
      </g>

      <g transform="rotate(-6 150 190)">
        {/* The flap as drawn, open behind the body. It squashes towards the
            hinge through the first half of the fold, which is what a flap
            folding forward actually does. */}
        {fold > 0 && (
          <g transform={`translate(0 146) scale(1 ${fold}) translate(0 -146)`}>
            <path d="M58 146 C 96 136 206 136 244 146 L 158 52 Z" fill="#d1281c" />
            <path
              d="M58 146 L 158 52 L 244 146"
              fill="none"
              stroke="#f2a79d"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* pillowy white body */}
        <path
          d="M56 146 C 94 137 208 137 246 146 C 255 184 253 230 243 258
             C 202 273 100 273 59 258 C 49 230 47 184 56 146 Z"
          fill="#fff"
        />
        {/* shadow of the open flap falling inside the mouth */}
        <path d="M60 148 C 96 140 206 140 242 148 C 206 158 96 158 60 148 Z" fill="#e7ded6" />

        {/* front panel, peak tucked up under the flap */}
        <path d="M59 258 C 100 273 202 273 243 258 L 158 186 Z" fill="#fff" />
        <path
          d="M59 258 L 158 186 L 243 258"
          fill="none"
          stroke="#e08076"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* hand-drawn creases */}
        <g stroke="#e08076" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M74 254 C 104 262 150 264 176 260" />
          <path d="M96 266 C 118 270 146 271 164 269" />
        </g>

        {/* the same flap completing the fold, now in front of the body where
            a closed flap belongs. The swap happens at the flat moment, so
            there is nothing on screen to see it. */}
        {fold <= 0 && (
          <g transform={`translate(0 146) scale(1 ${fold}) translate(0 -146)`}>
            <path d="M58 146 C 96 136 206 136 244 146 L 158 52 Z" fill="#d1281c" />
            <path
              d="M58 146 L 158 52 L 244 146"
              fill="none"
              stroke="#f2a79d"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>

      {/* the dotted flight path, laid down as the plane passes over it */}
      {dots.length > 0 ? (
        <g fill="#fff">
          {dots.map((d) => (
            <circle
              key={d.t}
              cx={d.x}
              cy={d.y}
              r="3.25"
              opacity={phase === "fold" ? 0 : prog >= d.t * trailFrac ? 1 : 0}
              style={{ transition: phase === "fold" ? "opacity .3s ease" : "opacity .18s linear" }}
            />
          ))}
        </g>
      ) : (
        /* until measurement lands, the card's original dashed stroke */
        <path d={TRAIL} fill="none" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" strokeDasharray="0.5 15" />
      )}

      {/* paper aeroplane */}
      <motion.g
        transform={planeTransform}
        initial={false}
        animate={{ opacity: phase === "fold" ? 0 : 1 }}
        transition={{ duration: phase === "fold" ? 0.28 : 0.22 }}
      >
        <g transform="rotate(-12 276 34)">
          <path d="M310 2 L252 52 L280 60 Z" fill="#fff" />
          <path d="M310 2 L280 60 L296 80 Z" fill="#e5b3ac" />
        </g>
      </motion.g>
    </svg>
  );
}
