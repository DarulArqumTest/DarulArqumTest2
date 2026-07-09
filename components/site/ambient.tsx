/**
 * Ambient layer: slow-panning 8-point star lattice + drifting light blooms
 * + optional grain. Pure CSS animations (see globals.css) — cheap, and
 * fully disabled under prefers-reduced-motion.
 */
export function Lattice({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="star8p" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M25 5 L30 20 L45 25 L30 30 L25 45 L20 30 L5 25 L20 20 Z"
            fill="none" stroke="currentColor" strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <g className="lattice-pan amb">
        <rect width="500" height="500" x="-50" y="-50" fill="url(#star8p)" />
      </g>
    </svg>
  );
}

export function Ambient({
  dark = false,
  grain = false,
}: {
  dark?: boolean;
  grain?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden amb ${grain ? "grain" : ""}`}
      aria-hidden
    >
      <Lattice className={`absolute inset-0 h-full w-full ${dark ? "text-bone/[0.045]" : "text-forest/[0.06]"}`} />
      <div
        className={`orb-a absolute -top-24 right-[8%] h-80 w-80 rounded-full blur-3xl ${dark ? "bg-brassL/10" : "bg-brass/10"}`}
      />
      <div
        className={`orb-b absolute bottom-[-10%] left-[4%] h-96 w-96 rounded-full blur-3xl ${dark ? "bg-moss/25" : "bg-moss/10"}`}
      />
    </div>
  );
}
