"use client";

import * as React from "react";
import Link from "next/link";
import { usePrayerTimes } from "@/components/prayer/use-prayer-times";
import { minutesNowInZone, toMinutes } from "@/lib/prayer";
import { ramadanState, type RamadanState } from "@/lib/ramadan";
import { MoonPhase } from "@/components/site/moon-phase";
import { RamadanLanterns } from "@/components/site/ramadan-lanterns";
import { R } from "@/lib/links";

/**
 * Ramadan mode.
 *
 * For one month a year the question people bring to a masjid's website
 * changes completely. It stops being "when is Asr" and becomes "how long
 * until I can eat" and "how long have I got to eat". This answers both, on
 * the masjid's own times, counting down live.
 *
 * It appears on its own — nobody has to remember to switch it on. The month
 * is worked out from the Hijri calendar in lib/ramadan.ts, which is also
 * where the sighting offset lives for the years the calculation lands a day
 * off from what the masjid actually announced.
 *
 * `?ramadan=1` forces it on for a preview out of season, and `?night=27`
 * picks the night, so the board can be shown to people in September.
 */

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/** what we are counting to, and how long is left */
function useCountdown(state: RamadanState) {
  const times = usePrayerTimes();
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return React.useMemo(() => {
    if (!now || !state.active) return null;
    const cur = minutesNowInZone(now, times.timezone);
    const seconds = Number(
      new Intl.DateTimeFormat("en-GB", { timeZone: times.timezone, second: "2-digit" }).format(now),
    );

    const fajr = times.prayers.find((p) => p.key === "fajr");
    const maghrib = times.prayers.find((p) => p.key === "maghrib");
    const tomorrowFajr = times.tomorrow.find((p) => p.key === "fajr") ?? fajr;
    const fajrAt = fajr ? toMinutes(fajr.adhan) : null;
    const maghribAt = maghrib ? toMinutes(maghrib.adhan) : null;
    const nextFajrAt = tomorrowFajr ? toMinutes(tomorrowFajr.adhan) : fajrAt;
    if (fajrAt === null || maghribAt === null || nextFajrAt === null) return null;

    let label: string;
    let target: number;
    let at: string;
    if (cur < fajrAt) {
      label = "Suhoor ends in";
      target = fajrAt - cur;
      at = fajr!.adhan;
    } else if (cur < maghribAt) {
      label = "Iftar in";
      target = maghribAt - cur;
      at = maghrib!.adhan;
    } else {
      label = "Suhoor ends in";
      target = 24 * 60 - cur + nextFajrAt;
      at = tomorrowFajr!.adhan;
    }

    // `target` is whole minutes to the boundary; take the current second off
    const totalSeconds = target * 60 - seconds;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return {
      label,
      at,
      text: h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`,
      iftar: maghrib?.adhan ?? null,
      suhoor: fajr?.adhan ?? null,
      live: times.live,
    };
  }, [now, state.active, times]);
}

export function RamadanBanner() {
  const times = usePrayerTimes();
  const [forced, setForced] = React.useState<{ on: boolean; night: number } | null>(null);

  // the preview switch, read once on mount so the server render is unaffected
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("ramadan") === "1") {
      setForced({ on: true, night: Math.min(30, Math.max(1, Number(q.get("night")) || 12)) });
    }
  }, []);

  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => setNow(new Date()), []);

  const state = React.useMemo<RamadanState>(() => {
    if (forced?.on) {
      const n = forced.night;
      return {
        active: true,
        night: n,
        year: 0,
        lastTen: n >= 21,
        qadrNight: n >= 21 && n % 2 === 1,
        eid: false,
        phase: ((n - 0.5) / 29.53) % 1,
      };
    }
    if (!now) return { active: false, night: 0, year: 0, lastTen: false, qadrNight: false, eid: false, phase: 0 };
    const maghrib = times.prayers.find((p) => p.key === "maghrib");
    const mAt = maghrib ? toMinutes(maghrib.adhan) : null;
    const past = mAt !== null && minutesNowInZone(now, times.timezone) >= mAt;
    return ramadanState(now, times.timezone, past);
  }, [forced, now, times]);

  const countdown = useCountdown(state);

  // nothing at all outside the month — no placeholder, no empty strip
  if (!state.active && !state.eid) return null;

  if (state.eid) {
    return (
      <section className="da-ram da-ram-eid" aria-label="Eid al-Fitr">
        <RamadanLanterns className="da-ram-lanterns" />
        <div className="da-ram-inner">
          <div className="da-ram-moon">
            <MoonPhase phase={0.02} size={78} />
          </div>
          <div className="da-ram-mid">
            <p className="da-ram-kicker">Shawwal 1</p>
            <h2 className="da-ram-title">Eid Mubarak</h2>
            <p className="da-ram-note">
              Eid prayer times and arrangements are on the prayer times page. May Allah accept
              from us and from you.
            </p>
          </div>
          <Link href={R.prayer} className="da-solid-btn da-ram-cta">
            Eid prayer times <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`da-ram${state.lastTen ? " da-ram-last-ten" : ""}`} aria-label="Ramadan">
      <RamadanLanterns className="da-ram-lanterns" />

      <div className="da-ram-inner">
        {/* tonight's moon, at tonight's phase */}
        <div className="da-ram-moon">
          <MoonPhase phase={state.phase} size={78} />
        </div>

        <div className="da-ram-mid">
          <p className="da-ram-kicker">
            Ramadan{state.year ? ` ${state.year}` : ""}
            {state.qadrNight && <span className="da-ram-qadr">Seek Laylat al-Qadr</span>}
          </p>
          <h2 className="da-ram-title">
            Night <b>{state.night}</b> <span>of 30</span>
          </h2>
          <p className="da-ram-note">
            {state.lastTen
              ? "The last ten nights. Taraweeh and qiyam every night at the masjid."
              : "Taraweeh every night after Isha. Everyone is welcome."}
          </p>
        </div>

        {/* the number people actually came for */}
        <div className="da-ram-count">
          {countdown ? (
            <>
              <p className="da-ram-count-label">{countdown.label}</p>
              <p className="da-ram-count-time">{countdown.text}</p>
              <p className="da-ram-count-at">
                {countdown.label.startsWith("Iftar") ? "Maghrib" : "Fajr"} {countdown.at}
                {!countdown.live && " · scheduled"}
              </p>
            </>
          ) : (
            <p className="da-ram-count-label">Loading times…</p>
          )}
          <div className="da-ram-pair">
            <span>
              <b>Suhoor ends</b>
              {countdown?.suhoor ?? "—"}
            </span>
            <span>
              <b>Iftar</b>
              {countdown?.iftar ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
