"use client";

/**
 * Photograph of a masjid property, with the drawn illustration as a fallback.
 *
 * The photographs are dropped into `public/assets/` by hand (they are the
 * masjid's own images). Until a file is present the request 404s, so rather
 * than shipping a broken tile we fall back to WestPropertyArt — the page
 * always looks finished either way.
 */

import * as React from "react";
import type { Location } from "@/lib/links";
import { WestPropertyArt } from "@/components/site/west-property-art";

export function LocationPhoto({ loc, rounded = 0 }: { loc: Location; rounded?: number }) {
  const [failed, setFailed] = React.useState(false);
  const ref = React.useRef<HTMLImageElement>(null);

  /**
   * `onError` alone is not enough. The server renders the tag, so a missing
   * file can 404 before React has hydrated and attached the handler — the
   * error event fires into the void and we ship a broken-image box. After
   * mount, ask the element directly: a finished load with zero intrinsic
   * width is a failed load.
   */
  React.useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed || !loc.photo) {
    return (
      <WestPropertyArt
        rounded={rounded}
        label={`Illustration of ${loc.name} at ${loc.street} — a photograph is coming.`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={loc.photo}
      alt={`${loc.name} at ${loc.street}`}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: rounded }}
    />
  );
}
