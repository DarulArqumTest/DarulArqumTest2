"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * The masjid, filling with gold as the Qard-e-Hasan is repaid.
 *
 * The giving section stated the loan as two flat numbers in two tiles:
 * $600,000 to repay, $200,000 remaining. Both true, neither felt like
 * anything. The difference between them is four hundred thousand dollars
 * that this community has already paid off, and nothing on the page said so.
 *
 * So the numbers are drawn instead. One masjid, in outline; the gold rises
 * from the steps to the height the community has actually reached, and stops
 * there. What is left dark above the line is what is left to do. The crescent
 * on the finial stays lit the whole way, because that is the point being
 * worked towards, not a thing being earned by degrees.
 *
 * Everything comes from ORG.finances — there is no percentage written down
 * anywhere. Change the outstanding figure in one place and the gold moves.
 */

const W = 320;
const H = 250;
/** the vertical band the silhouette occupies; the gold travels through it */
const TOP = 50;
const BOTTOM = 222;

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

/**
 * The silhouette, as bare shapes.
 *
 * Rendered in three places: once inside a <g> that <use> refers to for the
 * body, the gold and the outline, and once directly inside the clip path
 * that keeps the waterline between the walls. That last one has to be the
 * shapes themselves — a <use> pointing at a container is not a valid clip
 * path child, which is why the waterline silently drew nothing at first.
 */
const SHAPES = (
  <>
    {/* the two steps it stands on */}
    <rect x="16" y="212" width="288" height="10" rx="2" />
    <rect x="32" y="200" width="256" height="12" rx="2" />
    {/* the prayer hall */}
    <rect x="76" y="126" width="168" height="74" />
    {/* the drum the dome sits on */}
    <rect x="128" y="112" width="64" height="14" />
    {/* the dome: a bulge at the shoulder, drawn in to the finial */}
    <path d="M126 112c-8-12-6-26 6-36 10-9 20-14 28-26 8 12 18 17 28 26 12 10 14 24 6 36Z" />
    {/* left minaret */}
    <rect x="44" y="106" width="20" height="94" />
    <rect x="38" y="97" width="32" height="10" rx="2" />
    <rect x="48" y="83" width="12" height="14" />
    <path d="M48 83c-1-8 3-13 6-18 3 5 7 10 6 18Z" />
    {/* right minaret */}
    <rect x="256" y="106" width="20" height="94" />
    <rect x="250" y="97" width="32" height="10" rx="2" />
    <rect x="260" y="83" width="12" height="14" />
    <path d="M260 83c-1-8 3-13 6-18 3 5 7 10 6 18Z" />
  </>
);

export function MasjidProgress({
  repaid,
  total,
  className,
}: {
  repaid: number;
  total: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();

  // ids are scoped per instance so this can also stand on /give later
  // without two copies fighting over the same clip path
  const uid = React.useId().replace(/:/g, "");
  const id = (n: string) => `da-mp-${n}-${uid}`;

  const pct = total > 0 ? Math.max(0, Math.min(1, repaid / total)) : 0;
  const level = BOTTOM - pct * (BOTTOM - TOP);

  // the figure counts up alongside the gold, so the number and the drawing
  // arrive at the same answer at the same moment
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(repaid);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 1600);
      setShown(Math.round(repaid * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, repaid]);

  const rise = reduce
    ? { y: level }
    : { y: inView ? level : BOTTOM };

  return (
    <div ref={ref} className={className ? `da-mp ${className}` : "da-mp"}>
      <p className="da-mp-eyebrow">The Qard-e-Hasan</p>

      {/* cropped tight to the drawing: the crescent tops out at 24 and the
          bottom step ends at 222, so the full box left dead bands above and
          below that made the masjid sit small in its own tile */}
      <svg className="da-mp-art" viewBox={`0 14 ${W} 216`} aria-hidden focusable="false">
        <defs>
          {/* brightest at the waterline, deepest at the steps */}
          <linearGradient id={id("gold")} gradientUnits="userSpaceOnUse" x1="0" y1={TOP} x2="0" y2={BOTTOM}>
            <stop offset="0%" stopColor="#f9ecc0" />
            <stop offset="20%" stopColor="#e3c56a" />
            <stop offset="60%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#96741a" />
          </linearGradient>
          <linearGradient id={id("sheen")} gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3c4" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff3c4" stopOpacity="0.55" />
          </linearGradient>

          {/* the building, written once and used three times: as the dark
              body, as the gold, and as the outline over the top of both */}
          <g id={id("shapes")}>{SHAPES}</g>

          {/* how far the gold has come */}
          <clipPath id={id("level")}>
            <motion.rect
              x="0"
              width={W}
              height={H}
              initial={{ y: reduce ? level : BOTTOM }}
              animate={rise}
              transition={{ duration: 1.6, ease: [0.16, 0.8, 0.4, 1] }}
            />
          </clipPath>
          {/* keeps the waterline inside the walls */}
          <clipPath id={id("body")}>{SHAPES}</clipPath>

          <mask id={id("crescent")}>
            <rect width={W} height={H} fill="#000" />
            <circle cx="160" cy="32" r="7.6" fill="#fff" />
            <circle cx="163.8" cy="29.6" r="6.2" fill="#000" />
          </mask>
        </defs>

        {/* a few stars, so the unfilled part reads as night rather than as
            an unfinished drawing */}
        <g fill="#f6f3ea" opacity="0.28">
          <circle cx="40" cy="40" r="1.3" />
          <circle cx="96" cy="26" r="1" />
          <circle cx="232" cy="34" r="1.2" />
          <circle cx="288" cy="58" r="1" />
          <circle cx="204" cy="70" r="0.9" />
        </g>

        {/* what has not been repaid yet */}
        <use href={`#${id("shapes")}`} fill="#0a1d13" />

        {/* what has */}
        <g clipPath={`url(#${id("level")})`}>
          <use href={`#${id("shapes")}`} fill={`url(#${id("gold")})`} />
        </g>

        {/* the waterline: a bright lip, with the gold catching light just
            under it. This is the moment the whole drawing turns on, so it is
            worth more than a hairline. */}
        <motion.g
          clipPath={`url(#${id("body")})`}
          initial={{ y: reduce ? level : BOTTOM }}
          animate={{ y: reduce ? level : inView ? level : BOTTOM }}
          transition={{ duration: 1.6, ease: [0.16, 0.8, 0.4, 1] }}
        >
          <rect x="0" y="0" width={W} height="11" fill={`url(#${id("sheen")})`} />
          <rect x="0" y="-1.2" width={W} height="2.4" fill="#fff8dd" opacity="0.95" />
        </motion.g>

        {/* the outline, over everything, so the whole masjid is always legible */}
        <use
          href={`#${id("shapes")}`}
          fill="none"
          stroke="#f6f3ea"
          strokeOpacity="0.42"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* the doorway and two windows, cut into whatever is behind them */}
        <g fill="#08170f" fillOpacity="0.82" stroke="#e3c56a" strokeOpacity="0.55" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M146 200v-32a14 14 0 0 1 28 0v32Z" />
          <path d="M96 194v-28a10 10 0 0 1 20 0v28Z" />
          <path d="M204 194v-28a10 10 0 0 1 20 0v28Z" />
        </g>
        {/* a cornice and a plinth, so the hall is a building rather than a
            rectangle of gold */}
        <g stroke="#f6f3ea" strokeOpacity="0.22" strokeWidth="1.1" fill="none">
          <path d="M76 132h168M76 196h168" />
          <path d="M86 196v-58M234 196v-58" strokeOpacity="0.14" />
        </g>

        {/* the finial and its crescent stay lit at every level */}
        <circle cx="160" cy="46" r="3.4" fill="#e3c56a" />
        <circle cx="54" cy="63" r="2.2" fill="#e3c56a" />
        <circle cx="266" cy="63" r="2.2" fill="#e3c56a" />
        <rect width={W} height={H} fill="#e3c56a" mask={`url(#${id("crescent")})`} />
      </svg>

      <div className="da-mp-read">
        <div className="da-mp-read-main">
          <span className="da-mp-num">{fmt(shown)}</span>
          <span className="da-mp-cap">repaid of {fmt(total)}</span>
        </div>
        <span className="da-mp-pct">
          {Math.round(pct * 100)}
          <span aria-hidden>%</span>
        </span>
      </div>
    </div>
  );
}
