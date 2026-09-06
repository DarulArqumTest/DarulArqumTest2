/**
 * The moon, at the phase it is actually at tonight.
 *
 * Not a crescent glyph reused for thirty nights. Ramadan begins and ends on
 * a thin crescent and is full in the middle, and a masjid's own page ought
 * to know that — on the fourteenth night the moon on the page is the moon
 * outside.
 *
 * Drawn the standard way: the lit region is a semicircle joined to a half
 * ellipse whose width is the cosine of the phase angle. When that cosine is
 * positive the terminator curves inward and you get a crescent; when it goes
 * negative the ellipse bulges the other way and you get a gibbous.
 */
export function MoonPhase({
  phase,
  size = 64,
  className,
}: {
  /** 0 to 1 through the lunar cycle: 0 new, 0.5 full */
  phase: number;
  size?: number;
  className?: string;
}) {
  const r = 46;
  const cx = 50;
  const cy = 50;

  const f = ((phase % 1) + 1) % 1;
  const theta = 2 * Math.PI * f;
  const cos = Math.cos(theta);
  const rx = Math.abs(cos) * r;
  const waxing = f < 0.5;

  // right semicircle when waxing, left when waning, then back along the
  // terminator; the sweep flips once the moon is more than half lit
  const outerSweep = waxing ? 1 : 0;
  const innerSweep = cos < 0 ? (waxing ? 1 : 0) : waxing ? 0 : 1;

  const lit = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${outerSweep} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${innerSweep} ${cx} ${cy - r} Z`;

  /**
   * How much of the disc is actually lit. The halo follows it, because a
   * two-day crescent that glows as hard as a full moon reads as a logo
   * rather than as the sky.
   */
  const k = (1 - cos) / 2;
  const halo = 0.1 + 0.3 * k;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient id="da-moon-lit" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#fffaeb" />
          <stop offset="62%" stopColor="#f3e2ac" />
          <stop offset="100%" stopColor="#dcc27c" />
        </radialGradient>
        <radialGradient id="da-moon-halo" cx="50%" cy="50%">
          <stop offset="55%" stopColor="#e3c56a" stopOpacity={halo} />
          <stop offset="100%" stopColor="#e3c56a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="da-moon-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r={r + 16} fill="url(#da-moon-halo)" />
      {/* the unlit part, faintly there against the night rather than absent */}
      <circle cx={cx} cy={cy} r={r} fill="#16202c" opacity="0.5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e3c56a" strokeOpacity="0.14" strokeWidth="1" />
      <path d={lit} fill="url(#da-moon-lit)" />

      {/* craters, clipped to the disc so they only show where there is moon */}
      <g clipPath="url(#da-moon-clip)" fill="#c9ab63" opacity="0.42">
        <circle cx="38" cy="34" r="7" />
        <circle cx="60" cy="56" r="9" />
        <circle cx="34" cy="66" r="5" />
        <circle cx="66" cy="28" r="4" />
      </g>
    </svg>
  );
}
