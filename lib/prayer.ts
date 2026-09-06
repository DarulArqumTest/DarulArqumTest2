/**
 * Prayer schedule utilities.
 *
 * SOURCE OF TRUTH: the masjid's own Mawaqit schedule, read at request time
 * by lib/mawaqit.ts and served from /api/prayer-times. Components take it
 * through usePrayerTimes().
 *
 * The constants below are only a last-resort fallback for when Mawaqit is
 * unreachable, so that the board renders something rather than nothing.
 * They are a snapshot and they drift — never treat them as current.
 */

export type Prayer = {
  key: string;
  name: string;
  arabic: string;
  adhan: string; // "3:28 AM"
  iqama: string; // "4:30 AM"
};

export const FALLBACK_DATE_NOTE =
  "Iqama schedule — confirm live on the masjid screen";

export const PRAYERS: Prayer[] = [
  { key: "fajr", name: "Fajr", arabic: "الفجر", adhan: "3:28 AM", iqama: "4:30 AM" },
  { key: "dhuhr", name: "Dhuhr", arabic: "الظهر", adhan: "1:08 PM", iqama: "1:30 PM" },
  { key: "asr", name: "Asr", arabic: "العصر", adhan: "6:29 PM", iqama: "6:34 PM" },
  { key: "maghrib", name: "Maghrib", arabic: "المغرب", adhan: "8:52 PM", iqama: "8:57 PM" },
  { key: "isha", name: "Isha", arabic: "العشاء", adhan: "10:47 PM", iqama: "10:52 PM" },
];

export const SHURUQ = "5:23 AM";

/** "4:30 AM" -> minutes since midnight, or null if unparseable. */
export function toMinutes(t: string): number | null {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim());
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + parseInt(m[2], 10);
}

/**
 * Minutes since midnight *at the masjid*, not in the reader's own zone.
 *
 * Without this a visitor in Vancouver sees "NOW" on the wrong prayer and a
 * countdown three hours out, because the board describes a place, not a
 * device.
 */
export function minutesNowInZone(now: Date, timeZone: string): number {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);
    const h = Number(parts.find((p) => p.type === "hour")?.value ?? NaN);
    const m = Number(parts.find((p) => p.type === "minute")?.value ?? NaN);
    if (Number.isNaN(h) || Number.isNaN(m)) throw new Error("unparsed");
    return (h % 24) * 60 + m;
  } catch {
    return now.getHours() * 60 + now.getMinutes();
  }
}

export function nextPrayer(
  now: Date,
  list: Prayer[] = PRAYERS,
  timeZone = "America/Toronto",
  tomorrowList: Prayer[] = list,
): {
  prayer: Prayer;
  minutesUntil: number;
  tomorrow: boolean;
} | null {
  try {
    const cur = minutesNowInZone(now, timeZone);
    for (const p of list) {
      const t = toMinutes(p.iqama);
      if (t !== null && t > cur)
        return { prayer: p, minutesUntil: t - cur, tomorrow: false };
    }
    const first = tomorrowList[0] ?? list[0];
    const fajr = toMinutes(first.iqama);
    if (fajr === null) return null;
    return {
      prayer: first,
      minutesUntil: 24 * 60 - cur + fajr,
      tomorrow: true,
    };
  } catch {
    return null;
  }
}

export function activePrayerKey(
  now: Date,
  list: Prayer[] = PRAYERS,
  timeZone = "America/Toronto",
): string | null {
  const cur = minutesNowInZone(now, timeZone);
  let active: string | null = null;
  for (const p of list) {
    const t = toMinutes(p.adhan);
    if (t !== null && t <= cur) active = p.key;
  }
  return active ?? "isha";
}
