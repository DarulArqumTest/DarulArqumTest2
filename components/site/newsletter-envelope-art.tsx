"use client";

import * as React from "react";

/**
 * The newsletter envelope, drawn once and driven from outside.
 *
 * Two numbers control it, so the same drawing can be a still card, a closed
 * envelope waiting on a form, and a full animation:
 *
 *   fold    1 = flap thrown open, -1 = flap shut over the front, and every
 *           value between is the fold in progress. It passes through 0 flat,
 *           which is where the flap swaps from behind the body to in front
 *           of it, because a closed flap belongs on top.
 *   flight  0-1 along the dotted loop, or -1 for "no plane, no trail".
 *
 * The plane finishes exactly at the end of the trail. It used to be parked
 * past the end of it at an angle of its own, which read as the plane having
 * overshot. It banks with the curve while it travels and eases back to the
 * angle it was drawn at as it arrives, so it lands looking like the drawing
 * rather than like a plane pointing at the sky.
 */

const TRAIL =
  "M170 132 C 200 124 216 104 212 84 C 209 66 188 64 184 82 C 179 104 204 116 228 108 C 252 100 264 80 266 58";

/** where the plane is drawn, before it is moved anywhere */
const DRAWN = { x: 276, y: 34, a: -12 };

export function NewsletterEnvelopeArt({
  className,
  fold = 1,
  flight = 1,
}: {
  className?: string;
  fold?: number;
  flight?: number;
}) {
  const trailRef = React.useRef<SVGPathElement>(null);
  const [dots, setDots] = React.useState<{ x: number; y: number; t: number }[]>([]);
  const [len, setLen] = React.useState(0);

  React.useEffect(() => {
    const p = trailRef.current;
    if (!p) return;
    const total = p.getTotalLength();
    if (!total) return;
    const n = 15;
    const next: { x: number; y: number; t: number }[] = [];
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      const pt = p.getPointAtLength(t * total);
      next.push({ x: pt.x, y: pt.y, t });
    }
    setDots(next);
    setLen(total);
  }, []);

  const flying = flight >= 0;
  const t = Math.max(0, Math.min(1, flight));

  // where the plane is, and which way it is facing
  const plane = React.useMemo(() => {
    const p = trailRef.current;
    if (!p || !len) return null;
    const at = p.getPointAtLength(t * len);
    const ahead = p.getPointAtLength(Math.min(len, t * len + 3));
    const behind = p.getPointAtLength(Math.max(0, t * len - 3));
    const tangent = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
    // bank with the curve on the way, arrive at the drawn angle
    const settle = 1 - t * t;
    const a = DRAWN.a + (tangent - DRAWN.a) * settle;
    return { x: at.x, y: at.y, a };
  }, [t, len]);

  const planeTransform = plane
    ? `translate(${plane.x - DRAWN.x} ${plane.y - DRAWN.y}) rotate(${plane.a - DRAWN.a} ${DRAWN.x} ${DRAWN.y})`
    : undefined;

  const flapPaths = (
    <>
      <path d="M58 146 C 96 136 206 136 244 146 L 158 52 Z" fill="#d1281c" />
      <path
        d="M58 146 L 158 52 L 244 146"
        fill="none"
        stroke="#f2a79d"
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  );

  return (
    <svg className={className} viewBox="0 0 320 270" aria-hidden focusable="false">
      {/* measured, never painted */}
      <path ref={trailRef} d={TRAIL} fill="none" stroke="none" />

      {/* speed ticks */}
      <g stroke="#fff" strokeWidth="7" strokeLinecap="round">
        <path d="M12 138 L40 110" />
        <path d="M42 88 L60 70" />
        <path d="M6 182 L26 164" />
      </g>

      <g transform="rotate(-6 150 190)">
        {/* the flap while it is open, behind the body */}
        {fold > 0 && <g transform={`translate(0 146) scale(1 ${fold}) translate(0 -146)`}>{flapPaths}</g>}

        {/* pillowy white body */}
        <path
          d="M56 146 C 94 137 208 137 246 146 C 255 184 253 230 243 258
             C 202 273 100 273 59 258 C 49 230 47 184 56 146 Z"
          fill="#fff"
        />
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

        <g stroke="#e08076" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M74 254 C 104 262 150 264 176 260" />
          <path d="M96 266 C 118 270 146 271 164 269" />
        </g>

        {/* the flap once it is past flat, in front where a shut flap belongs */}
        {fold <= 0 && <g transform={`translate(0 146) scale(1 ${fold}) translate(0 -146)`}>{flapPaths}</g>}
      </g>

      {/* the trail, laid down as the plane passes over it */}
      {flying && dots.length > 0 && (
        <g fill="#fff">
          {dots.map((d) => (
            <circle key={d.t} cx={d.x} cy={d.y} r="3.25" opacity={t >= d.t ? 1 : 0} style={{ transition: "opacity .16s linear" }} />
          ))}
        </g>
      )}

      {/* paper aeroplane */}
      {flying && (
        <g transform={planeTransform}>
          <g transform="rotate(-12 276 34)">
            <path d="M310 2 L252 52 L280 60 Z" fill="#fff" />
            <path d="M310 2 L280 60 L296 80 Z" fill="#e5b3ac" />
          </g>
        </g>
      )}
    </svg>
  );
}
