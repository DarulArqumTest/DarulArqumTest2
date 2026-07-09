"use client";

import * as React from "react";
import { Lattice } from "@/components/site/ambient";

/**
 * Image that degrades gracefully: if a remote asset 404s or is blocked,
 * it renders a branded lattice tile instead of breaking the layout.
 */
export function SafeImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [err, setErr] = React.useState(false);
  if (err || !src) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-forest ${className}`} role="img" aria-label={alt}>
        <Lattice className="absolute inset-0 h-full w-full text-bone/[0.08]" />
        <span className="relative px-4 text-center text-xs text-bone/50">{alt}</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} className={className} />;
}
