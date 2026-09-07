import { ORG } from "@/lib/links";
import { PRAYERS, type Prayer } from "@/lib/prayer";

/**
 * The handful of numbers the masjid changes, and where they live.
 *
 * Everything here has a default in lib/links.ts or lib/prayer.ts. The admin
 * panel stores only what has actually been overridden, so a value nobody has
 * touched keeps following the code, and clearing an override puts it back.
 *
 * One shape, read in one place, so a figure cannot say $60 on the homepage
 * and $70 on the pledge page.
 */

export type FinanceSettings = {
  /** total Qard-e-Hasan taken across both properties */
  loanTotal: number;
  /** how much of it is still outstanding */
  loanRemaining: number;
  /** what the masjid costs to run each month */
  monthlyExpenses: number;
  /** the parking lot project */
  parkingLot: number;
  /** the "if every family gave this much" figure, and the pledge default */
  perFamily: number;
};

/** an iqama override for one prayer; adhan times stay with Mawaqit */
export type PrayerOverride = { adhan?: string; iqama?: string };

/** both khutbahs; these do not come from Mawaqit, the masjid sets them */
export type JumuaSettings = { first: string; second: string };

/**
 * The two bands that appear on their own, and the switches for them.
 *
 * "auto" is the real behaviour — Friday for Jumu'ah, the Hijri month for
 * Ramadan. "on" and "off" exist so the band can be looked at in September,
 * and so it can be pulled down in a hurry if something is wrong with it.
 */
export type ModeSettings = {
  jumua: "auto" | "on" | "off";
  ramadan: "auto" | "on" | "off";
  /** which night to show while Ramadan is forced on */
  ramadanNight: number;
  /** shift the calculated Hijri date to match the local sighting */
  ramadanDayOffset: number;
};

export type SiteSettings = {
  finances: FinanceSettings;
  /** keyed by prayer key: fajr, dhuhr, asr, maghrib, isha */
  prayers: Record<string, PrayerOverride>;
  /**
   * While true, Mawaqit is the schedule and the overrides above are ignored
   * entirely — they are kept, not deleted, so turning the switch back off
   * restores whatever was typed rather than losing it.
   */
  followMawaqit: boolean;
  jumua: JumuaSettings;
  modes: ModeSettings;
  /** who changed it last and when, so a wrong number can be traced */
  updatedAt?: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  finances: {
    loanTotal: ORG.finances.loanTotal,
    loanRemaining: ORG.finances.loanRemaining,
    monthlyExpenses: ORG.finances.monthlyExpenses,
    parkingLot: ORG.finances.parkingLot,
    perFamily: ORG.finances.perFamily,
  },
  prayers: {},
  followMawaqit: true,
  jumua: { first: ORG.jumua.first, second: ORG.jumua.second },
  modes: { jumua: "auto", ramadan: "auto", ramadanNight: 12, ramadanDayOffset: 0 },
};

/** stored overrides on top of the defaults, with anything invalid ignored */
export function mergeSettings(stored: Partial<SiteSettings> | null | undefined): SiteSettings {
  const f: Partial<FinanceSettings> = stored?.finances ?? {};
  const num = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.round(v) : fallback;

  const finances: FinanceSettings = {
    loanTotal: num(f.loanTotal, DEFAULT_SETTINGS.finances.loanTotal),
    loanRemaining: num(f.loanRemaining, DEFAULT_SETTINGS.finances.loanRemaining),
    monthlyExpenses: num(f.monthlyExpenses, DEFAULT_SETTINGS.finances.monthlyExpenses),
    parkingLot: num(f.parkingLot, DEFAULT_SETTINGS.finances.parkingLot),
    perFamily: num(f.perFamily, DEFAULT_SETTINGS.finances.perFamily),
  };
  // outstanding can never exceed the loan; a typo here would draw a masjid
  // filled past full
  if (finances.loanRemaining > finances.loanTotal) finances.loanRemaining = finances.loanTotal;

  const prayers: Record<string, PrayerOverride> = {};
  for (const [key, v] of Object.entries(stored?.prayers ?? {})) {
    if (!v || typeof v !== "object") continue;
    const out: PrayerOverride = {};
    if (isClockTime(v.adhan)) out.adhan = v.adhan;
    if (isClockTime(v.iqama)) out.iqama = v.iqama;
    if (out.adhan || out.iqama) prayers[key] = out;
  }

  const j = stored?.jumua;
  const jumua: JumuaSettings = {
    first: isClockTime(j?.first) ? j!.first : DEFAULT_SETTINGS.jumua.first,
    second: isClockTime(j?.second) ? j!.second : DEFAULT_SETTINGS.jumua.second,
  };

  const m = stored?.modes;
  const mode = (v: unknown): ModeSettings["jumua"] =>
    v === "on" || v === "off" || v === "auto" ? v : "auto";
  const modes: ModeSettings = {
    jumua: mode(m?.jumua),
    ramadan: mode(m?.ramadan),
    ramadanNight: num(m?.ramadanNight, DEFAULT_SETTINGS.modes.ramadanNight),
    // a sighting is a day either side at most; anything else is a typo
    ramadanDayOffset:
      typeof m?.ramadanDayOffset === "number" && Math.abs(m.ramadanDayOffset) <= 1
        ? Math.round(m.ramadanDayOffset)
        : 0,
  };
  modes.ramadanNight = Math.min(30, Math.max(1, modes.ramadanNight));

  return {
    finances,
    prayers,
    followMawaqit: stored?.followMawaqit !== false,
    jumua,
    modes,
    updatedAt: stored?.updatedAt,
  };
}

/** "1:30 PM" and nothing else */
export function isClockTime(v: unknown): v is string {
  return typeof v === "string" && /^(1[0-2]|[1-9]):[0-5]\d\s(AM|PM)$/.test(v.trim());
}

/** how much of the loan is repaid, 0-1 */
export function repaidFraction(f: FinanceSettings) {
  if (f.loanTotal <= 0) return 0;
  return Math.max(0, Math.min(1, (f.loanTotal - f.loanRemaining) / f.loanTotal));
}

/** the schedule with any admin overrides applied over the live times */
export function applyPrayerOverrides(list: Prayer[], overrides: Record<string, PrayerOverride>): Prayer[] {
  const base = list.length ? list : PRAYERS;
  return base.map((p) => {
    const o = overrides[p.key];
    if (!o) return p;
    return { ...p, adhan: o.adhan ?? p.adhan, iqama: o.iqama ?? p.iqama };
  });
}
