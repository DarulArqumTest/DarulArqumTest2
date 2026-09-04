"use client";

/**
 * Comic-book speech bubble.
 *
 * The body is a CSS rounded box so the text lays out normally — an actual
 * ellipse clips its own corners, which pushed the eyebrow and the button
 * outside the ink line. The tail is a separate SVG that overlaps the body's
 * border by a few pixels.
 *
 * The seam is handled by splitting the tail into two paths: a fill that runs
 * back INTO the body (covering the border underneath it) and a stroke that
 * traces only the two outer edges. The outline therefore reads as one
 * continuous line around body and tail, with no join line across the base.
 */

import type { ReactNode } from "react";

export function ComicBubble({
  children,
  tail = "right",
  className = "",
}: {
  children: ReactNode;
  /** Side the tail points toward, or none for a plain bubble. */
  tail?: "right" | "none";
  className?: string;
}) {
  return (
    <div className={`da-cb ${className}`}>
      <div className="da-cb-body">{children}</div>
      {tail === "right" && (
        <svg className="da-cb-tail" viewBox="0 0 64 66" aria-hidden>
          {/* fill runs back past the body's edge so it hides the border */}
          <path d="M-6 4 C 14 24 32 42 60 62 C 34 50 12 38 -6 34 Z" fill="#fdfcf7" />
          {/* stroke traces only the two outer edges */}
          <path
            d="M2 6 C 18 25 34 42 60 62"
            fill="none"
            stroke="#16301f"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M60 62 C 34 50 14 39 0 35"
            fill="none"
            stroke="#16301f"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
