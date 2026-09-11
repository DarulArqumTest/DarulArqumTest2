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

/**
 * The band for the day something is wrong.
 *
 * Snow, a burst pipe, a jamaat that is not happening. This is the only thing
 * on the site that outranks the hero, so it is deliberately awkward to leave
 * running: `until` is a date after which it takes itself down. A closure
 * notice still up in April is worse than none at all — people stop reading
 * the band, and then miss the one that matters.
 */
export type NoticeSettings = {
  on: boolean;
  /**
   * What kind of news it is, which decides the colour and the drawing.
   *
   * "notice" is a change of plan, "urgent" is the masjid being shut. "good"
   * was added for the first Jumu'ah at the West masjid: the band was built
   * for things going wrong, and announcing a first Jumu'ah in the same amber
   * as a burst pipe reads as a warning. Same slot, same prominence, opposite
   * feeling — gold, and a minbar catching its first light rather than a door
   * with a notice taped to it.
   */
  tone: "notice" | "urgent" | "good";
  /** one line, the thing itself: "Masjid closed today" */
  title: string;
  /** one sentence of detail; may be empty */
  detail: string;
  /**
   * Somewhere to send people, for a notice that is about something rather
   * than just warning about it — the West masjid's page, a programme, the
   * prayer times. Empty for a notice with nowhere to go.
   */
  href: string;
  /** what the link says; ignored when there is no href */
  linkLabel: string;
  /** YYYY-MM-DD in the masjid's zone. Empty means no self-expiry. */
  until: string;
};

export type SiteSettings = {
  finances: FinanceSettings;
  /** keyed by prayer key: fajr, dhuhr, asr, maghrib, isha */
  prayers: Record<string, PrayerOverride>;
  notice: NoticeSettings;
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
  notice: { on: false, tone: "notice", title: "", detail: "", href: "", linkLabel: "", until: "" },
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

  const n = stored?.notice;
  const dn = DEFAULT_SETTINGS.notice;
  // falls back to the default the same way every other field here does
  const text = (v: unknown, max: number, fallback: string) =>
    typeof v === "string" ? v.trim().slice(0, max) : fallback;
  const title = text(n?.title, 90, dn.title);
  const notice: NoticeSettings = {
    // an empty headline cannot be shown, whatever the switch says
    on: (typeof n?.on === "boolean" ? n.on : dn.on) && title.length > 0,
    tone: isTone(n?.tone) ? n!.tone : dn.tone,
    title,
    detail: text(n?.detail, 220, dn.detail),
    /**
     * Only somewhere on this site. A notice is typed into a box in an admin
     * panel and rendered into an anchor on every page, so letting it carry
     * an arbitrary URL would turn that box into a way to point the whole
     * congregation at anything at all.
     */
    href: isInternalPath(n?.href) ? n!.href.trim() : "",
    linkLabel: text(n?.linkLabel, 40, dn.linkLabel),
    until: isDateStamp(n?.until) ? n!.until : isDateStamp(dn.until) ? dn.until : "",
  };

  return {
    finances,
    prayers,
    notice,
    followMawaqit: stored?.followMawaqit !== false,
    jumua,
    modes,
    updatedAt: stored?.updatedAt,
  };
}

export function isTone(v: unknown): v is NoticeSettings["tone"] {
  return v === "notice" || v === "urgent" || v === "good";
}

/**
 * A path on this site, and nothing else.
 *
 * Must start with a single "/" — which rules out "//evil.example.com",
 * a protocol-relative URL that browsers treat as another origin, and any
 * "https://…" or "javascript:" typed into the box.
 */
export function isInternalPath(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const s = v.trim();
  return s.startsWith("/") && !s.startsWith("//") && s.length <= 120;
}

/** "2026-03-14" and nothing else */
export function isDateStamp(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v.trim());
}

/**
 * Today's date where the masjid is, as YYYY-MM-DD.
 *
 * `en-CA` formats as 2026-03-14 already, which is the one locale that gives
 * this for free. Ottawa, not the reader's machine: a notice that expires
 * "today" should turn off when today ends in Ottawa.
 */
export function todayInZone(now: Date = new Date(), timeZone = "America/Toronto"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Whether the band should be on screen right now.
 *
 * Kept out of the component so the server and the browser cannot disagree
 * about it, and so the admin panel can show the same verdict it will get.
 * `todayStamp` is the masjid's local date, not the reader's — someone opening
 * the site from another timezone should see what Ottawa sees.
 */
export function noticeIsLive(n: NoticeSettings, todayStamp: string): boolean {
  if (!n.on || !n.title) return false;
  // `until` is inclusive: "until the 14th" means it is still up on the 14th
  if (n.until && todayStamp > n.until) return false;
  return true;
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
