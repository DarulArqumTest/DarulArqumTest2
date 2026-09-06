import { ORG } from "@/lib/links";

/**
 * The number, on a plate.
 *
 * The old version was `Call 613-709-2329` on the site's standard gold button,
 * which made the single most useful action on the page look exactly like
 * "Register", "View details" and every other yellow slab — same shape, same
 * fill, same weight, nothing about it saying what it is.
 *
 * This is the plaque screwed to an office door instead: brass, bevelled, with
 * the number engraved into it and a red handset on a dark ground beside it.
 * The handset is red because a handset is red — it is not another piece of the
 * brass.
 */
export function CallPlate({
  label = "Talk to the office",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <a href={ORG.phoneHref} className={className ? `da-callplate ${className}` : "da-callplate"}>
      <span className="da-callplate-mark" aria-hidden>
        <svg viewBox="0 0 24 24" width="21" height="21" focusable="false">
          {/* the cord, looping back to the wall */}
          <path
            d="M15.5 4.6c2.6.6 4.4 2.5 4.9 5"
            fill="none"
            stroke="#e3c56a"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* the receiver */}
          <path
            fill="#d63a2e"
            stroke="#5c120c"
            strokeWidth="0.9"
            strokeLinejoin="round"
            d="M6.1 3.5c1.2-.7 2.7-.3 3.4.8l1.4 2c.7 1 .4 2.3-.5 3.1l-1 .8c-.3.3-.4.7-.2 1.1a10.9 10.9 0 0 0 4.1 4.1c.4.2.8.1 1.1-.2l.8-1c.8-.9 2.1-1.2 3.1-.5l2 1.4c1.1.7 1.5 2.2.8 3.4l-.8 1.4c-.7 1.1-2 1.7-3.2 1.3C11 19.4 4.5 12.9 3.4 6.5c-.3-1.2.3-2.4 1.4-3.1Z"
          />
          {/* earpiece and mouthpiece, catching the light */}
          <ellipse cx="7.6" cy="6.4" rx="1.5" ry="1.1" fill="#f6f3ea" opacity="0.85" transform="rotate(-32 7.6 6.4)" />
          <ellipse cx="17.4" cy="17.3" rx="1.5" ry="1.1" fill="#f6f3ea" opacity="0.85" transform="rotate(-32 17.4 17.3)" />
        </svg>
      </span>
      <span className="da-callplate-text">
        <span className="da-callplate-label">{label}</span>
        <span className="da-callplate-num">{ORG.phone}</span>
      </span>
    </a>
  );
}
