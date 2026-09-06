"use client";

import * as React from "react";

/**
 * Subscribe to a media query.
 *
 * The site's layout is already device-adaptive through CSS, but CSS can only
 * hide an element, not stop it existing: a hidden iframe still loads its
 * third-party page and still costs the visitor the request. This hook lets a
 * component be left out of the tree entirely on the devices it is not for.
 *
 * Returns false on the server and on the first client render so the markup
 * matches and hydration cannot mismatch; the real value lands immediately
 * after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True from the tablet breakpoint up, where the wide layouts are used. */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
