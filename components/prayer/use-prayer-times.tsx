"use client";

import * as React from "react";
import { PRAYERS, SHURUQ, type Prayer } from "@/lib/prayer";
import { ORG } from "@/lib/links";

/**
 * The masjid's live schedule, with the built-in constants as a floor.
 *
 * Every board on the site draws from this. It returns the fallback
 * immediately so nothing ever renders empty or shifts layout, then swaps in
 * the real times once /api/prayer-times answers — usually within a few
 * hundred milliseconds, and the numbers are in the same slots either way.
 *
 * `live` says which of the two you are looking at, so a component can label
 * the fallback honestly instead of presenting a stale time as today's.
 */

type Payload = {
  source: string;
  timezone: string;
  today: { date: string; shuruq: string; jumua: { first: string; second: string }; prayers: Prayer[] } | null;
  tomorrow: { prayers: Prayer[] } | null;
};

type PrayerTimes = {
  prayers: Prayer[];
  tomorrow: Prayer[];
  shuruq: string;
  jumua: { first: string; second: string };
  timezone: string;
  live: boolean;
};

const FALLBACK: PrayerTimes = {
  prayers: PRAYERS,
  tomorrow: PRAYERS,
  shuruq: SHURUQ,
  jumua: ORG.jumua,
  timezone: "America/Toronto",
  live: false,
};

// One fetch per page load however many boards ask for it, and the answer is
// kept so a later mount does not go back to the network.
let cache: PrayerTimes | null = null;
let inFlight: Promise<PrayerTimes | null> | null = null;

async function load(): Promise<PrayerTimes | null> {
  if (cache) return cache;
  if (!inFlight) {
    inFlight = fetch("/api/prayer-times")
      .then((r) => (r.ok ? (r.json() as Promise<Payload>) : null))
      .then((j) => {
        if (!j?.today?.prayers?.length) return null;
        cache = {
          prayers: j.today.prayers,
          tomorrow: j.tomorrow?.prayers ?? j.today.prayers,
          shuruq: j.today.shuruq || SHURUQ,
          jumua: j.today.jumua ?? ORG.jumua,
          timezone: j.timezone || FALLBACK.timezone,
          live: true,
        };
        return cache;
      })
      .catch(() => null)
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export function usePrayerTimes(): PrayerTimes {
  const [times, setTimes] = React.useState<PrayerTimes>(cache ?? FALLBACK);

  React.useEffect(() => {
    let alive = true;
    load().then((t) => {
      if (alive && t) setTimes(t);
    });

    // The schedule changes at midnight in the masjid's zone. Rather than
    // work out when that is on the client, drop the cache hourly and ask
    // again; the upstream page is cached server-side so this is nearly free.
    const id = setInterval(() => {
      cache = null;
      load().then((t) => {
        if (alive && t) setTimes(t);
      });
    }, 3600000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return times;
}
