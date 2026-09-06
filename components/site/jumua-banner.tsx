"use client";

import * as React from "react";
import Link from "next/link";
import { usePrayerTimes } from "@/components/prayer/use-prayer-times";
import { minutesNowInZone, toMinutes } from "@/lib/prayer";
import { ramadanState } from "@/lib/ramadan";
import { LOCATION_LIST, R } from "@/lib/links";

/**
 * Friday.
 *
 * The busiest few hours of the masjid's week, and the site said nothing
 * about them that it did not also say on a Tuesday. This appears on Fridays
 * only: both khutbah times, which one is next, and the thing people actually
 * get wrong, which is parking.
 *
 * It stands down during Ramadan — that band is already saying something more
 * urgent, and two coloured strips stacked under the hero is a mess.
 *
 * `?jumua=1` forces it on for a preview.
 */

function Minbar() {
  return (
    <svg className="da-jm-art" viewBox="0 0 120 110" aria-hidden focusable="false">
      <defs>
        <linearGradient id="da-jm-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a6a44" />
          <stop offset="100%" stopColor="#5d4128" />
        </linearGradient>
      </defs>
      {/* the arch behind it */}
      <path d="M26 96V44a34 34 0 0 1 68 0v52Z" fill="#0d2117" />
      <path d="M34 96V46a26 26 0 0 1 52 0v50Z" fill="#f6d089" opacity="0.12" />
      <g stroke="#e3c56a" strokeOpacity="0.45" strokeWidth="1.3" fill="none">
        <rect x="48" y="46" width="24" height="24" />
        <rect x="48" y="46" width="24" height="24" transform="rotate(45 60 58)" />
      </g>
      {/* the steps */}
      <path d="M40 96V84h14v12Z" fill="url(#da-jm-wood)" />
      <path d="M54 96V72h14v24Z" fill="url(#da-jm-wood)" />
      <path d="M68 96V60h14v36Z" fill="url(#da-jm-wood)" />
      {/* the rail, and the canopy over the top step */}
      <path d="M40 84 L82 54" stroke="#c9a227" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M68 60V44h14v16Z" fill="#12482f" />
      <path d="M66 44h18l-9-11Z" fill="#c9a227" />
      <path d="M12 98h96" stroke="#f6f3ea" strokeOpacity="0.28" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function JumuaBanner({ jumua }: { jumua: { first: string; second: string } }) {
  const times = usePrayerTimes();
  const [now, setNow] = React.useState<Date | null>(null);
  const [forced, setForced] = React.useState(false);

  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).get("jumua") === "1") setForced(true);
  }, []);

  const state = React.useMemo(() => {
    if (!now) return null;

    // Friday in the masjid's own zone, not the reader's
    const weekday = new Intl.DateTimeFormat("en-GB", { timeZone: times.timezone, weekday: "short" }).format(now);
    const isFriday = weekday === "Fri";
    if (!isFriday && !forced) return null;

    // Ramadan's band already owns this slot
    const maghrib = times.prayers.find((p) => p.key === "maghrib");
    const mAt = maghrib ? toMinutes(maghrib.adhan) : null;
    const cur = minutesNowInZone(now, times.timezone);
    const past = mAt !== null && cur >= mAt;
    if (ramadanState(now, times.timezone, past).active) return null;

    const first = toMinutes(times.jumua.first);
    const second = toMinutes(times.jumua.second);
    const next = first !== null && cur < first ? "first" : second !== null && cur < second ? "second" : "done";
    return { next, cur };
  }, [now, forced, times]);

  if (!state) return null;

  return (
    <section className="da-jm" aria-label="Jumu'ah">
      <div className="da-jm-inner">
        <Minbar />

        <div className="da-jm-mid">
          <p className="da-jm-kicker">Friday</p>
          <h2 className="da-jm-title">Jumu&apos;ah today</h2>
          <p className="da-jm-note">
            Two khutbahs, both at {LOCATION_LIST[0]?.street ?? "the masjid"}. The lot fills for the
            first — come early, or park on the street and walk in.
          </p>
        </div>

        <div className="da-jm-times">
          {(
            [
              { key: "first", label: "First khutbah", at: times.jumua.first },
              { key: "second", label: "Second khutbah", at: times.jumua.second },
            ] as const
          ).map((k) => (
            <div key={k.key} className={`da-jm-slot${state.next === k.key ? " da-jm-slot-next" : ""}`}>
              <span className="da-jm-slot-label">
                {k.label}
                {state.next === k.key && <b>Next</b>}
              </span>
              <span className="da-jm-slot-at">{k.at}</span>
            </div>
          ))}
          <Link href={R.prayer} className="da-jm-link">
            All prayer times <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
