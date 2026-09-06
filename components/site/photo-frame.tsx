"use client";

import * as React from "react";

/**
 * A photograph, hung rather than tiled.
 *
 * Everything else on this site is drawn, and then the gallery put three
 * photographs in a CSS grid with a hairline border each — the one page that
 * looked like a template. They hang on the wall now: a nail, a wire, a brass
 * moulding, a cream mount, and the picture inside it.
 *
 * The frame is CSS rather than an image so it stays sharp at any width and
 * costs nothing to download; only the wire and the nail are drawn, because
 * a straight CSS line does not sag.
 */
export function PhotoFrame({
  src,
  alt,
  caption,
  onClick,
  tilt = 0,
  aspect,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  onClick?: () => void;
  /** a degree or two, so a row of them is not machine-straight */
  tilt?: number;
  aspect?: string;
  className?: string;
}) {
  return (
    <figure className={className ? `da-frame ${className}` : "da-frame"}>
      <svg className="da-frame-hang" viewBox="0 0 200 46" aria-hidden focusable="false" preserveAspectRatio="none">
        {/* the wire, sagging from the nail to the two eyelets */}
        <path d="M46 44 C 78 16 122 16 154 44" fill="none" stroke="#6d5613" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M46 44 C 78 16 122 16 154 44" fill="none" stroke="#e3c56a" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
        {/* the nail it hangs on */}
        <circle cx="100" cy="20" r="4.4" fill="#3a3a3a" />
        <circle cx="98.6" cy="18.6" r="1.7" fill="#9aa0a4" />
      </svg>

      <div
        className="da-frame-body"
        style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        <div className="da-frame-mount">
          <div className="da-frame-plate" style={aspect ? { aspectRatio: aspect } : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} loading="lazy" decoding="async" />
            {/* the glass, catching the light across one corner */}
            <span className="da-frame-glass" aria-hidden />
          </div>
          {caption && <figcaption className="da-frame-caption">{caption}</figcaption>}
        </div>
      </div>
    </figure>
  );
}
