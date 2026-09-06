import { EXT } from "@/lib/links";

/**
 * The Zoom join button, as it already exists on the homepage's welearn card.
 *
 * The programme pages had a gold "Join on Zoom ↗" that looked like every
 * other call to action on the site, so nothing about it said what pressing
 * it would do. This is Zoom's blue with Zoom's camera mark and two lines —
 * what happens, and where. It was the right button; it was only ever on one
 * page.
 */
export function ZoomJoinButton({
  label = "Join the live class",
  sub = "via Zoom ↗",
  className,
}: {
  label?: string;
  sub?: string;
  className?: string;
}) {
  return (
    <a
      href={EXT.welearnZoom}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? `da-zoom-btn ${className}` : "da-zoom-btn"}
    >
      <span className="da-zoom-btn-sheen" aria-hidden />
      <span className="da-zoom-btn-mark" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="14" height="12" rx="3" fill="#ffffff" />
          <path d="M17 9.5 22 6.5v11L17 14.5Z" fill="#ffffff" />
        </svg>
      </span>
      <span className="da-zoom-btn-text">
        <span className="da-zoom-btn-label">{label}</span>
        <span className="da-zoom-btn-sub">{sub}</span>
      </span>
    </a>
  );
}
