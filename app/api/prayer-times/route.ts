import { NextResponse } from "next/server";
import { fetchMawaqitConf, scheduleForDate, MASJID_TZ } from "@/lib/mawaqit";

/**
 * Today's and tomorrow's schedule, read from the masjid's Mawaqit page.
 *
 * The route itself is dynamic so "today" is computed per request; the
 * expensive part — the upstream page, which carries the whole year — is
 * cached by `fetchMawaqitConf` for six hours. Tomorrow ships alongside today
 * so the "next iqama" band can roll past midnight without a second call.
 *
 * On any failure this returns 200 with `source: "fallback"` and no schedule.
 * The client keeps showing the built-in constants in that case: a stale time
 * clearly labelled is better than an empty board.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const conf = await fetchMawaqitConf();
  if (!conf) {
    return NextResponse.json(
      { source: "fallback", timezone: MASJID_TZ, today: null, tomorrow: null },
      { headers: { "cache-control": "public, max-age=0, s-maxage=300" } },
    );
  }

  const now = new Date();
  const today = scheduleForDate(conf, now);
  const tomorrow = scheduleForDate(conf, new Date(now.getTime() + 86400000));

  return NextResponse.json(
    {
      source: today ? "mawaqit" : "fallback",
      timezone: conf.timezone || MASJID_TZ,
      today,
      tomorrow,
    },
    { headers: { "cache-control": "public, max-age=0, s-maxage=1800" } },
  );
}
