/**
 * Reads the masjid's real schedule off its own Mawaqit page.
 *
 * The times used to live as constants in lib/prayer.ts. Prayer times move
 * every single day, so those constants were wrong within weeks of being
 * written and the site would state a wrong iqama with complete confidence —
 * the worst failure a masjid website can have. The schedule the imam
 * actually maintains is the one on the Mawaqit screen, so that is the one
 * the site now reads.
 *
 * Mawaqit has no public read API for a single mosque, but its own page ships
 * the whole year to the browser in a `confData` object, which is what the
 * screen at the masjid renders from. We parse the same object. The
 * constants stay in place as a fallback for the day Mawaqit is unreachable
 * or changes its page shape.
 */

import { EXT } from "@/lib/links";

/** Mosque-local time zone. Mawaqit reports it; this is the fallback. */
export const MASJID_TZ = "America/Toronto";

/** `[fajr, shuruq, dhuhr, asr, maghrib, isha]` — adhan, "HH:MM" 24h. */
type AdhanDay = [string, string, string, string, string, string];
/** `[fajr, dhuhr, asr, maghrib, isha]` — iqama, "HH:MM" or "+MM". */
type IqamaDay = [string, string, string, string, string];

export type MawaqitConf = {
  timezone?: string;
  /** today's adhan times, without shuruq */
  times?: string[];
  shuruq?: string;
  jumua?: string | null;
  jumua2?: string | null;
  /** 12 months, keyed by day-of-month as a string */
  calendar?: Record<string, AdhanDay>[];
  iqamaCalendar?: Record<string, IqamaDay>[];
};

export type DaySchedule = {
  /** ISO date in the masjid's own time zone, e.g. "2026-09-06" */
  date: string;
  timezone: string;
  shuruq: string;
  jumua: { first: string; second: string };
  prayers: { key: string; name: string; arabic: string; adhan: string; iqama: string }[];
};

const PRAYER_META = [
  { key: "fajr", name: "Fajr", arabic: "الفجر" },
  { key: "dhuhr", name: "Dhuhr", arabic: "الظهر" },
  { key: "asr", name: "Asr", arabic: "العصر" },
  { key: "maghrib", name: "Maghrib", arabic: "المغرب" },
  { key: "isha", name: "Isha", arabic: "العشاء" },
] as const;

/**
 * Pull the `confData` object literal out of the page.
 *
 * A lazy `\{[\s\S]*?\}` would stop at the first `}` inside the object, and a
 * greedy one would run to the last `}` on the page. Neither is safe, so this
 * walks the text counting braces and skipping over string literals, which is
 * the only way to find the real end of a JSON object embedded in JavaScript.
 */
export function extractConfData(html: string): MawaqitConf | null {
  const anchor = /(?:let|var|const)\s+confData\s*=\s*\{/.exec(html);
  if (!anchor) return null;

  const start = anchor.index + anchor[0].length - 1; // at the opening brace
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1)) as MawaqitConf;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

/** Fetch and parse the mosque page. Returns null on any failure. */
export async function fetchMawaqitConf(revalidateSeconds = 21600): Promise<MawaqitConf | null> {
  try {
    const res = await fetch(EXT.mawaqitLive, {
      headers: {
        // Mawaqit serves a stripped page to clients it does not recognise.
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "accept-language": "en",
      },
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    return extractConfData(await res.text());
  } catch {
    return null;
  }
}

/** "17:35" -> "5:35 PM". Passes anything it cannot parse straight through. */
export function to12h(t: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return t;
  const h24 = Number(m[1]);
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${m[2]} ${suffix}`;
}

function addMinutes(hhmm: string, minutes: number): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return hhmm;
  const total = (Number(m[1]) * 60 + Number(m[2]) + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * Some mosques store iqama as an offset from the adhan ("+10") rather than a
 * clock time. Darul Arqum stores absolute times, but the offset form is
 * common enough on Mawaqit that not handling it would be a silent wrong
 * answer the day it changed.
 */
function resolveIqama(raw: string, adhan: string): string {
  const t = raw.trim();
  if (/^[+-]?\d{1,3}$/.test(t)) return addMinutes(adhan, Number(t));
  return t;
}

/** Year, month (1-12) and day for a Date, in the given time zone. */
export function partsInZone(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [y, m, d] = fmt.format(date).split("-").map(Number);
  return { year: y, month: m, day: d, iso: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` };
}

/**
 * The schedule for one calendar day.
 *
 * Prefers the year calendar (which is correct for any date) and falls back to
 * `times`/`shuruq`, which Mawaqit only fills in for today.
 */
export function scheduleForDate(conf: MawaqitConf, date: Date): DaySchedule | null {
  const timezone = conf.timezone || MASJID_TZ;
  const { month, day, iso } = partsInZone(date, timezone);

  const adhanDay = conf.calendar?.[month - 1]?.[String(day)];
  const iqamaDay = conf.iqamaCalendar?.[month - 1]?.[String(day)];

  const today = partsInZone(new Date(), timezone).iso === iso;
  const adhan = adhanDay
    ? { fajr: adhanDay[0], shuruq: adhanDay[1], rest: [adhanDay[2], adhanDay[3], adhanDay[4], adhanDay[5]] }
    : today && conf.times?.length === 5
      ? { fajr: conf.times[0], shuruq: conf.shuruq ?? "", rest: conf.times.slice(1) }
      : null;
  if (!adhan) return null;

  const adhanList = [adhan.fajr, ...adhan.rest];
  if (adhanList.some((t) => !/^\d{1,2}:\d{2}$/.test(t ?? ""))) return null;

  const prayers = PRAYER_META.map((p, i) => ({
    ...p,
    adhan: to12h(adhanList[i]),
    iqama: to12h(iqamaDay?.[i] ? resolveIqama(iqamaDay[i], adhanList[i]) : adhanList[i]),
  }));

  return {
    date: iso,
    timezone,
    shuruq: adhan.shuruq ? to12h(adhan.shuruq) : "",
    jumua: { first: to12h(conf.jumua || "13:30"), second: to12h(conf.jumua2 || "14:30") },
    prayers,
  };
}
