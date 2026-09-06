/**
 * Lanterns strung across the top of the banner, the way they go up across a
 * hall for the month.
 *
 * Five of them on a slack line, at different drops and slightly different
 * sizes so the row does not read as a repeated element. Each one is a fanous:
 * a brass cap, coloured glass panels, a brass foot, and a flame inside. They
 * sway on a CSS animation that prefers-reduced-motion already switches off.
 */

const LANTERNS = [
  { x: 60, drop: 30, s: 1, glass: "#e3c56a", delay: 0 },
  { x: 190, drop: 48, s: 0.82, glass: "#7cc99a", delay: 0.7 },
  { x: 320, drop: 26, s: 1.1, glass: "#e08a6a", delay: 1.4 },
  { x: 450, drop: 44, s: 0.86, glass: "#e3c56a", delay: 0.4 },
  { x: 570, drop: 32, s: 0.95, glass: "#8fb4c9", delay: 1.1 },
];

function Fanous({ glass }: { glass: string }) {
  return (
    <g>
      {/* the glow it throws */}
      <ellipse cx="0" cy="30" rx="26" ry="30" fill={glass} opacity="0.14" />
      {/* cap */}
      <path d="M-13 12 L13 12 L8 4 L-8 4 Z" fill="#c9a227" />
      <rect x="-4" y="0" width="8" height="4" rx="2" fill="#a9861f" />
      {/* body: six panels of coloured glass */}
      <path d="M-13 12 L13 12 L11 44 L-11 44 Z" fill={glass} opacity="0.9" />
      <g stroke="#a9861f" strokeWidth="1.6" fill="none">
        <path d="M-13 12 L13 12 L11 44 L-11 44 Z" />
        <path d="M-4.5 12 L-4 44M4.5 12 L4 44" strokeWidth="1.1" opacity="0.8" />
      </g>
      {/* the flame */}
      <path d="M0 24c3 4 4.5 7 4.5 9a4.5 4.5 0 0 1-9 0c0-2 1.5-5 4.5-9Z" fill="#fff4cf" opacity="0.95" />
      {/* foot and tassel */}
      <path d="M-11 44 L11 44 L7 52 L-7 52 Z" fill="#c9a227" />
      <path d="M0 52v7" stroke="#a9861f" strokeWidth="1.6" />
      <circle cx="0" cy="61" r="2.6" fill="#c9a227" />
    </g>
  );
}

export function RamadanLanterns({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 120"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      {/* the line they hang from, slack in the middle */}
      <path
        d="M-10 8 C 160 34 480 34 650 8"
        fill="none"
        stroke="#c9a227"
        strokeOpacity="0.5"
        strokeWidth="1.6"
      />
      {LANTERNS.map((l) => (
        <g key={l.x} transform={`translate(${l.x} 0)`}>
          <line x1="0" y1="10" x2="0" y2={l.drop} stroke="#c9a227" strokeOpacity="0.45" strokeWidth="1.3" />
          <g
            className="da-ram-lantern"
            style={{ animationDelay: `${l.delay}s`, transformOrigin: "0px 10px" }}
            transform={`translate(0 ${l.drop}) scale(${l.s})`}
          >
            <Fanous glass={l.glass} />
          </g>
        </g>
      ))}
    </svg>
  );
}
