/**
 * Is it Ramadan, and which night is it.
 *
 * The Hijri date comes from the browser's own Umm al-Qura calendar via Intl,
 * so there is no library and no table to maintain. But a calculated calendar
 * is not what a masjid follows — Darul Arqum starts and ends the month on a
 * sighting, which can land a day either side of the arithmetic. So the
 * calculated answer is only the default, and OVERRIDE below wins over it.
 *
 * ADMIN NOTE: to shift the whole month by a day, set `dayOffset` to 1 or -1.
 * To force the banner on or off regardless of the date, set `mode`. Both are
 * one-line edits, and everything else on the site follows from them.
 */

export type RamadanOverride = {
  /** "auto" follows the calendar; "on"/"off" force it */
  mode: "auto" | "on" | "off";
  /** days to shift the calculated Hijri date by, for local sighting */
  dayOffset: number;
  /** the night to show when mode is "on" — for previewing out of season */
  forcedNight: number;
};

export const OVERRIDE: RamadanOverride = {
  mode: "auto",
  dayOffset: 0,
  forcedNight: 12,
};

export type HijriDate = { year: number; month: number; day: number };

/** the Hijri date for a moment, in the masjid's own timezone */
export function hijriDate(date: Date, timeZone: string): HijriDate | null {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(date);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value.replace(/\D/g, ""));
    const year = get("year");
    const month = get("month");
    const day = get("day");
    if (!year || !month || !day) return null;
    return { year, month, day };
  } catch {
    return null;
  }
}

export type RamadanState = {
  active: boolean;
  /** which night of the month, 1-30 */
  night: number;
  /** the Hijri year, for the label */
  year: number;
  /** the last ten nights */
  lastTen: boolean;
  /** an odd night of the last ten — when Laylat al-Qadr is sought */
  qadrNight: boolean;
  /** the day after the month ends */
  eid: boolean;
  /** how far through the lunar cycle, 0-1, for drawing the moon */
  phase: number;
};

const OFF: RamadanState = {
  active: false,
  night: 0,
  year: 0,
  lastTen: false,
  qadrNight: false,
  eid: false,
  phase: 0,
};

/**
 * The Islamic day turns at maghrib, not midnight, which is why the 27th
 * night is the evening of the 26th. `pastMaghrib` carries that in from
 * whoever knows today's maghrib time.
 */
export function ramadanState(date: Date, timeZone: string, pastMaghrib = false): RamadanState {
  if (OVERRIDE.mode === "off") return OFF;

  if (OVERRIDE.mode === "on") {
    const night = Math.min(30, Math.max(1, OVERRIDE.forcedNight));
    const h = hijriDate(date, timeZone);
    return {
      active: true,
      night,
      year: h?.year ?? 0,
      lastTen: night >= 21,
      qadrNight: night >= 21 && night % 2 === 1,
      eid: false,
      phase: ((night - 0.5) / 29.53) % 1,
    };
  }

  const h = hijriDate(date, timeZone);
  if (!h) return OFF;

  // roll the date forward for maghrib and for the local sighting
  let day = h.day + OVERRIDE.dayOffset + (pastMaghrib ? 1 : 0);
  let month = h.month;
  let year = h.year;
  if (day > 30) {
    day -= 30;
    month += 1;
  }
  if (day < 1) {
    day += 29;
    month -= 1;
  }
  if (month > 12) {
    month = 1;
    year += 1;
  }
  if (month < 1) {
    month = 12;
    year -= 1;
  }

  // Shawwal 1: Eid al-Fitr
  if (month === 10 && day === 1) {
    return { ...OFF, eid: true, year };
  }

  if (month !== 9) return OFF;

  return {
    active: true,
    night: day,
    year,
    lastTen: day >= 21,
    qadrNight: day >= 21 && day % 2 === 1,
    eid: false,
    phase: ((day - 0.5) / 29.53) % 1,
  };
}
