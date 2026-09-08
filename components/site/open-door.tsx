/**
 * The door, standing open.
 *
 * The contact page's own mark. Every rebuilt page has one drawing that
 * belongs to it and nowhere else — the fallen lantern on the 500, the
 * envelope on the newsletter, the minbar on Friday — and this is the
 * contact page's: a masjid doorway with one leaf swung out and the light
 * from inside falling across the step.
 *
 * It is drawn from the outside, at night, which is the position of the
 * person the page is for: someone standing at the edge of a community
 * wondering whether to knock. The light is already on and the door is
 * already open, which is the whole message of the page and saves the
 * heading from having to say it twice.
 */
export function OpenDoor({ size = 220 }: { size?: number }) {
  return (
    <svg
      className="da-ct-door"
      viewBox="0 0 220 210"
      width={size}
      height={size * (210 / 220)}
      aria-hidden
      focusable="false"
    >
      <defs>
        {/* the warmth coming from inside */}
        <linearGradient id="da-ct-inside" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f6d089" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#e3c56a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.18" />
        </linearGradient>
        {/* the same light, pooling on the ground */}
        <linearGradient id="da-ct-spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d089" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#f6d089" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="da-ct-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a6a44" />
          <stop offset="100%" stopColor="#5d4128" />
        </linearGradient>
      </defs>

      {/* the light on the step, drawn first so everything sits in it */}
      <path d="M76 172 L144 172 L196 206 L24 206 Z" fill="url(#da-ct-spill)" />

      {/* the wall */}
      <path
        d="M34 172V78a76 76 0 0 1 152 0v94Z"
        fill="#102419"
        stroke="#c9a227"
        strokeOpacity="0.3"
        strokeWidth="1.6"
      />
      {/* a course of brick, just enough to read as built */}
      <g stroke="#c9a227" strokeOpacity="0.14" strokeWidth="1">
        <path d="M40 116h34M146 116h34M40 140h30M150 140h30" />
      </g>

      {/* the opening: a pointed arch, lit from within */}
      <path
        d="M76 172V112Q76 72 110 60Q144 72 144 112V172Z"
        fill="url(#da-ct-inside)"
      />
      <path
        d="M76 172V112Q76 72 110 60Q144 72 144 112V172Z"
        fill="none"
        stroke="#e3c56a"
        strokeOpacity="0.55"
        strokeWidth="1.6"
      />

      {/* the leaf that is open, hinged on the left and swung towards us */}
      <g>
        <path d="M76 174 L40 190 L40 116 Q54 96 76 88 Z" fill="url(#da-ct-wood)" />
        <path
          d="M76 174 L40 190 L40 116 Q54 96 76 88 Z"
          fill="none"
          stroke="#c9a227"
          strokeOpacity="0.5"
          strokeWidth="1.4"
        />
        {/* two sunk panels, following the lean */}
        <path
          d="M48 122 Q60 110 70 105 L70 132 Q60 137 48 143 Z"
          fill="#0e2419"
          fillOpacity="0.34"
        />
        <path d="M48 152 L70 143 L70 168 L48 178 Z" fill="#0e2419" fillOpacity="0.34" />
        {/* the ring you would actually pull */}
        <circle cx="45" cy="150" r="4.6" fill="none" stroke="#e3c56a" strokeOpacity="0.75" strokeWidth="1.6" />
      </g>

      {/* the lantern over the door, lit */}
      <g>
        <path d="M110 20v12" stroke="#c9a227" strokeOpacity="0.5" strokeWidth="1.3" />
        <path d="M104 32h12l4 16h-20Z" fill="#12482f" stroke="#e3c56a" strokeOpacity="0.6" strokeWidth="1.2" />
        <circle cx="110" cy="41" r="3" fill="#f6d089" />
        <path d="M106 48h8l-4 5Z" fill="#c9a227" />
      </g>

      {/* the step */}
      <path d="M62 172h96" stroke="#f6f3ea" strokeOpacity="0.22" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
