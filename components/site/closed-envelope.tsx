/**
 * The envelope, put down.
 *
 * The newsletter page has an envelope that springs open and launches a paper
 * plane. This is the same envelope at the other end of the relationship: flap
 * shut, and once it is done, sealed. Not sad about it — the seal carries the
 * masjid's arch, so it reads as closed properly rather than thrown away.
 *
 * No animation. This page is the last thing someone sees on their way out;
 * making it perform would be the wrong note.
 */
export function ClosedEnvelope({ sealed = false }: { sealed?: boolean }) {
  const gold = "#c9a227";
  const light = "#e3c56a";
  return (
    <div className="da-404-art da-unsub-art" aria-hidden>
      <svg viewBox="0 0 112 112" focusable="false">
      {/* the shadow it is resting on */}
      <ellipse cx="56" cy="96" rx="34" ry="5" fill="#000" opacity="0.28" />

      {/* body */}
      <rect x="18" y="34" width="76" height="52" rx="4" fill="#12281c" />
      <rect
        x="18"
        y="34"
        width="76"
        height="52"
        rx="4"
        fill="none"
        stroke={gold}
        strokeOpacity="0.5"
        strokeWidth="1.6"
      />

      {/* the two creases running up to the flap */}
      <path
        d="M18 86 L52 58 M94 86 L60 58"
        stroke={gold}
        strokeOpacity="0.26"
        strokeWidth="1.2"
        fill="none"
      />

      {/* the flap, closed */}
      <path d="M18 38 L56 66 L94 38" fill="none" stroke={gold} strokeOpacity="0.55" strokeWidth="1.6" />
      <path d="M18 36 L56 64 L94 36 L94 34 L18 34 Z" fill={light} fillOpacity="0.09" />

      {sealed ? (
        /* wax, with the arch on it */
        <g>
          <circle cx="56" cy="63" r="11" fill="#8f2f2f" />
          <circle cx="56" cy="63" r="11" fill="none" stroke="#c25b5b" strokeOpacity="0.7" strokeWidth="1.1" />
          <path
            d="M50 69V60a6 6 0 0 1 12 0v9Z"
            fill="none"
            stroke="#f6d9d9"
            strokeOpacity="0.85"
            strokeWidth="1.3"
          />
        </g>
      ) : (
        /* not yet: the corner of the letter still showing */
        <path
          d="M40 60h32"
          stroke={light}
          strokeOpacity="0.5"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      )}
      </svg>
    </div>
  );
}
