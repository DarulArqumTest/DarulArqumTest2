/**
 * Prayer schedule utilities.
 *
 * SOURCE OF TRUTH: the live Mawaqit screen (iframed on /prayer-times).
 * The constants below are a safe FALLBACK so native modules (next-prayer
 * band, iqama cards) always render even if the embed is blocked or offline.
 * The UI labels them "confirm on the live screen".
 *
 * ADMIN-ACCESS FOLLOW-UP: replace with a small server proxy to Mawaqit's
 * mosque data (or a JSON the admin updates) for exact daily adhan times.
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

export function nextPrayer(now: Date): {
  prayer: Prayer;
  minutesUntil: number;
  tomorrow: boolean;
} | null {
  try {
    const cur = now.getHours() * 60 + now.getMinutes();
    for (const p of PRAYERS) {
      const t = toMinutes(p.iqama);
      if (t !== null && t > cur)
        return { prayer: p, minutesUntil: t - cur, tomorrow: false };
    }
    const fajr = toMinutes(PRAYERS[0].iqama);
    if (fajr === null) return null;
    return {
      prayer: PRAYERS[0],
      minutesUntil: 24 * 60 - cur + fajr,
      tomorrow: true,
    };
  } catch {
    return null;
  }
}

export function activePrayerKey(now: Date): string | null {
  const cur = now.getHours() * 60 + now.getMinutes();
  let active: string | null = null;
  for (const p of PRAYERS) {
    const t = toMinutes(p.adhan);
    if (t !== null && t <= cur) active = p.key;
  }
  return active ?? "isha";
}
