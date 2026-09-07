"use client";

import * as React from "react";

/**
 * Evicting the old Wix site from people's phones.
 *
 * darularqum.org ran on Wix for years, and Wix registers a service worker.
 * A service worker outlives the site that installed it: it is stored against
 * the origin, not the server, so moving the domain to a new host does not
 * remove it. Anyone who had visited the old site can keep being served the
 * old page from their own device — DNS, hosting and caching headers all
 * correct, and still the wrong website.
 *
 * That is what the board saw the morning after the cutover: the old home
 * page, with a live prayer widget inside it, because the shell came from a
 * stale cache on the phone while the third-party iframe fetched fresh.
 *
 * This site registers no service worker and creates no caches, so anything
 * found here belongs to the old site and can go. It runs once, costs nothing
 * when there is nothing to remove, and can be deleted from this codebase
 * once nobody is still carrying a 2026 cache around.
 */
export function LegacySwCleanup() {
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          if (cancelled) return;
          // a registration here is not ours; nothing on this site installs one
          await Promise.all(regs.map((r) => r.unregister()));
        }
        if ("caches" in window) {
          const keys = await caches.keys();
          if (cancelled) return;
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        /* private mode, or the browser refuses — nothing here is load-bearing */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
