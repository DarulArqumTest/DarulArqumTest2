"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  adminLogin,
  adminLogout,
  saveSettings,
  loadSubmissions,
  loadSubscribers,
  sendNewsletterEmail,
  trashSubmissionAction,
  restoreSubmissionAction,
  purgeSubmissionAction,
} from "@/app/actions/admin";
import type { Submission } from "@/lib/submissions-store";
import { usePrayerTimes } from "@/components/prayer/use-prayer-times";
import {
  applyPrayerOverrides,
  noticeIsLive,
  repaidFraction,
  todayInZone,
  type SiteSettings,
} from "@/lib/settings";
import { MasjidProgress } from "@/components/site/masjid-progress";
import { NoticeDoor } from "@/components/site/closure-notice";
import { Glyph } from "@/components/site/program-glyphs";
import { ORG, R } from "@/lib/links";
import { TIME_LOOK, PrayerSky } from "@/components/prayer/prayer-look";

/**
 * The admin panel.
 *
 * It is meant to feel like getting in somewhere — a terminal waking up, a
 * scanline, a green cursor — without becoming a costume. The people using it
 * are the masjid's organisers, so every screen it actually asks you to work
 * in is plain, large and unambiguous, and nothing destructive happens
 * without showing you the old value beside the new one first.
 *
 * Nothing here decides whether you are allowed in. The password goes to a
 * server action and comes back as a signed httpOnly cookie; this component
 * only knows yes or no.
 */

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

/* ── the terminal that greets you ─────────────────────────────────── */

const BOOT = [
  "darul arqum // administration",
  "verifying terminal .......... ok",
  "secure channel .............. ok",
  "awaiting credentials",
];

function Boot({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState<string[]>(reduce ? BOOT : []);

  React.useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(BOOT.slice(0, i));
      if (i >= BOOT.length) {
        clearInterval(id);
        setTimeout(onDone, 260);
      }
    }, 220);
    return () => clearInterval(id);
  }, [reduce, onDone]);

  return (
    <div className="da-adm-boot" aria-hidden>
      {shown.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <span className="da-adm-caret" />
    </div>
  );
}

/* ── sign in ──────────────────────────────────────────────────────── */

function SignIn({ onIn, configured }: { onIn: () => void; configured: boolean }) {
  const [booted, setBooted] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await adminLogin(password);
    setBusy(false);
    if (res.ok) onIn();
    else setError(res.error ?? "That did not work.");
    setPassword("");
  }

  return (
    <div className="da-adm-gate">
      <div className="da-adm-term">
        <div className="da-adm-term-bar">
          <span />
          <span />
          <span />
          <b>secure terminal</b>
        </div>
        <div className="da-adm-term-body">
          {!booted ? (
            <Boot onDone={() => setBooted(true)} />
          ) : (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} method="post">
              <div className="da-adm-boot" aria-hidden>
                {BOOT.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              <label className="da-adm-field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  /* Enter submits. Implicit form submission ought to cover
                     this on its own, but this is the one control on the
                     site where a person types and presses Enter without
                     looking, so it is worth not leaving to the browser. */
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && password && !busy) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  autoFocus
                  autoComplete="current-password"
                  className="da-adm-input"
                  placeholder="••••••••••"
                />
              </label>
              {!configured && (
                <p className="da-adm-warn">
                  No password is set for this site yet. Add <code>ADMIN_PASSWORD</code> and{" "}
                  <code>ADMIN_SECRET</code> in Vercel, then reload.
                </p>
              )}
              {error && <p className="da-adm-error">{error}</p>}
              <button type="submit" className="da-adm-go" disabled={busy || !password}>
                {busy ? "Checking…" : "Enter"}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── the before / after step ──────────────────────────────────────── */

type Change = { label: string; from: string; to: string };

function Confirm({
  changes,
  onCancel,
  onConfirm,
  busy,
}: {
  changes: Change[];
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  return (
    <div className="da-adm-confirm" role="dialog" aria-label="Confirm changes">
      <div className="da-adm-confirm-box">
        <p className="da-adm-eyebrow">Check before saving</p>
        <h2 className="da-adm-h2">
          {changes.length} change{changes.length === 1 ? "" : "s"}
        </h2>

        <ul className="da-adm-diff">
          {changes.map((c) => (
            <li key={c.label}>
              <span className="da-adm-diff-label">{c.label}</span>
              <span className="da-adm-diff-row">
                <b className="da-adm-was">{c.from}</b>
                <span className="da-adm-arrow" aria-label="becomes">
                  →
                </span>
                <b className="da-adm-now">{c.to}</b>
              </span>
            </li>
          ))}
        </ul>

        <div className="da-adm-confirm-actions">
          <button type="button" className="da-adm-ghost" onClick={onCancel} disabled={busy}>
            Go back
          </button>
          <button type="button" className="da-adm-go" onClick={onConfirm} disabled={busy}>
            {busy ? "Saving…" : "Yes, save these"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── prayer times ─────────────────────────────────────────────────── */

const PRAYER_LABEL: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function PrayerEditor({ setDraft, draft }: { draft: SiteSettings; setDraft: (s: SiteSettings) => void }) {
  const times = usePrayerTimes();
  const [warning, setWarning] = React.useState(false);
  const locked = draft.followMawaqit;
  // while locked the board shows Mawaqit; unlocked it shows what you typed
  const shown = applyPrayerOverrides(times.prayers, locked ? {} : draft.prayers);

  function set(key: string, field: "adhan" | "iqama", value: string) {
    const next = { ...draft, prayers: { ...draft.prayers } };
    const entry = { ...(next.prayers[key] ?? {}) };
    const base = times.prayers.find((p) => p.key === key);
    // typing the live value back in is the same as no override at all
    if (!value.trim() || value.trim() === base?.[field]) delete entry[field];
    else entry[field] = value.trim();
    if (Object.keys(entry).length) next.prayers[key] = entry;
    else delete next.prayers[key];
    setDraft(next);
  }

  return (
    <div className="da-adm-panel da-adm-panel-sky">
      <div className="da-adm-panel-head">
        <div>
          <p className="da-adm-eyebrow">Prayer times</p>
          <h2 className="da-adm-h2">The board</h2>
          <p className="da-adm-copy">
            This is the board as the website shows it. While the switch is on, the masjid&apos;s
            Mawaqit schedule is the schedule and nothing here can be typed over.
          </p>
        </div>

        {/* the switch, and the whole point of it */}
        <div className="da-adm-switch-wrap">
          <button
            type="button"
            role="switch"
            aria-checked={locked}
            className={`da-adm-switch${locked ? " on" : ""}`}
            onClick={() => {
              if (locked) setWarning(true);
              else setDraft({ ...draft, followMawaqit: true });
            }}
          >
            <span className="da-adm-switch-track">
              <span className="da-adm-switch-knob" />
            </span>
            <span className="da-adm-switch-text">
              <b>Follow the Mawaqit schedule</b>
              <small>{locked ? "On — times update themselves" : "Off — you are setting them by hand"}</small>
            </span>
          </button>
        </div>
      </div>

      <div className={`da-adm-sky-board${locked ? " is-locked" : ""}`}>
        {shown.map((p) => {
          const look = TIME_LOOK[p.key];
          const base = times.prayers.find((x) => x.key === p.key);
          const o = draft.prayers[p.key] ?? {};
          const changed = !locked && Boolean(o.adhan || o.iqama);
          return (
            <div
              key={p.key}
              className={`da-adm-sky-cell${changed ? " is-changed" : ""}`}
              style={{
                background: `linear-gradient(180deg, rgba(8,10,18,0.42), rgba(8,10,18,0.16) 45%, rgba(8,10,18,0.52)), ${look.bg}`,
              }}
            >
              <PrayerSky look={look} />
              <div className="da-adm-sky-text">
                <div dir="rtl" lang="ar" style={{ fontFamily: "'Amiri',serif", fontSize: 19, color: look.textAccent, textShadow: look.halo }}>
                  {p.arabic}
                </div>
                <div className="da-adm-sky-name" style={{ color: look.textPrimary, textShadow: look.halo }}>
                  {PRAYER_LABEL[p.key] ?? p.key}
                </div>

                {(["adhan", "iqama"] as const).map((field) => (
                  <label key={field} className="da-adm-sky-field">
                    <span style={{ color: look.textSecondary, textShadow: look.halo }}>{field}</span>
                    <input
                      className="da-adm-sky-input"
                      value={locked ? (base?.[field] ?? p[field]) : (o[field] ?? "")}
                      placeholder={base?.[field] ?? p[field]}
                      onChange={(e) => set(p.key, field, e.target.value)}
                      disabled={locked}
                      inputMode="text"
                      aria-label={`${PRAYER_LABEL[p.key]} ${field}`}
                    />
                  </label>
                ))}

                {changed && (
                  <button
                    type="button"
                    className="da-adm-sky-clear"
                    onClick={() => {
                      const next = { ...draft, prayers: { ...draft.prayers } };
                      delete next.prayers[p.key];
                      setDraft(next);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="da-adm-hint">
        Times go in as they read on the board: <code>1:30 PM</code>. Anything else is ignored.
        {!times.live && " Mawaqit is not answering right now, so these are the built-in fallback times."}
      </p>

      {/* Jumu'ah is never Mawaqit's to give, so it sits outside the switch */}
      <div className="da-adm-jumua">
        <div>
          <p className="da-adm-eyebrow">Friday</p>
          <h3 className="da-adm-h3">Jumu&apos;ah</h3>
          <p className="da-adm-copy" style={{ marginBottom: 0 }}>
            Both khutbahs. These are always the masjid&apos;s own — the switch above does not
            touch them.
          </p>
        </div>
        <div className="da-adm-jumua-fields">
          {(["first", "second"] as const).map((k) => (
            <label key={k} className="da-adm-field">
              <span>{k === "first" ? "First khutbah" : "Second khutbah"}</span>
              <input
                className="da-adm-input da-adm-input-time"
                value={draft.jumua[k]}
                onChange={(e) => setDraft({ ...draft, jumua: { ...draft.jumua, [k]: e.target.value } })}
                inputMode="text"
              />
            </label>
          ))}
        </div>
      </div>

      {warning && (
        <div className="da-adm-confirm" role="dialog" aria-label="Take over the prayer times">
          <div className="da-adm-confirm-box">
            <p className="da-adm-eyebrow">Before you switch this off</p>
            <h2 className="da-adm-h2">You will be setting the times by hand</h2>
            <p className="da-adm-copy" style={{ marginBottom: 0 }}>
              Any time you type will show on the website instead of the Mawaqit one, and it will
              keep showing even when Mawaqit changes — through Ramadan, and every time the
              schedule shifts with the season. It stays that way until you turn this switch back
              on. Anything you leave blank keeps following Mawaqit.
            </p>
            <div className="da-adm-confirm-actions">
              <button type="button" className="da-adm-ghost" onClick={() => setWarning(false)}>
                Leave it on
              </button>
              <button
                type="button"
                className="da-adm-go da-adm-go-warn"
                onClick={() => {
                  setDraft({ ...draft, followMawaqit: false });
                  setWarning(false);
                }}
              >
                I understand, let me set them
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── the loan and the rest of the money ───────────────────────────── */

const MONEY_FIELDS = [
  { key: "loanTotal", label: "Total loan to repay", note: "The whole Qard-e-Hasan across both properties." },
  { key: "loanRemaining", label: "Qard-e-Hasan remaining", note: "What is still outstanding. Drives the gold." },
  { key: "monthlyExpenses", label: "Monthly maintenance target", note: "What the masjid costs to run each month." },
  { key: "parkingLot", label: "Parking lot renovation", note: "The parking project total." },
  { key: "perFamily", label: "Per family, monthly", note: "The fun-fact figure, the button, and the pledge default." },
] as const;

function MoneyEditor({ draft, setDraft }: { draft: SiteSettings; setDraft: (s: SiteSettings) => void }) {
  const f = draft.finances;
  const pct = Math.round(repaidFraction(f) * 100);

  function setField(key: (typeof MONEY_FIELDS)[number]["key"], value: number) {
    setDraft({ ...draft, finances: { ...f, [key]: Math.max(0, Math.round(value || 0)) } });
  }

  /** the slider moves what is left, which is what the drawing reads */
  function setPct(next: number) {
    const remaining = Math.round(f.loanTotal * (1 - next / 100));
    setDraft({ ...draft, finances: { ...f, loanRemaining: remaining } });
  }

  return (
    <div className="da-adm-panel">
      <p className="da-adm-eyebrow">Giving</p>
      <h2 className="da-adm-h2">The loan, and the rest of the money</h2>
      <p className="da-adm-copy">
        Everything here shows up across the whole website — the homepage, the giving page, the
        pledge page and the story page all read these same five numbers.
      </p>

      <div className="da-adm-money">
        <div className="da-adm-money-art">
          <div className="da-adm-tile">
            <MasjidProgress repaid={f.loanTotal - f.loanRemaining} total={f.loanTotal} />
          </div>
          <label className="da-adm-slider">
            <span>
              Repaid <b>{pct}%</b>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              aria-label="Percentage of the loan repaid"
            />
            <span className="da-adm-slider-ends">
              <em>{fmt(f.loanTotal - f.loanRemaining)} repaid</em>
              <em>{fmt(f.loanRemaining)} to go</em>
            </span>
          </label>
        </div>

        <div className="da-adm-money-fields">
          {MONEY_FIELDS.map((m) => (
            <label key={m.key} className="da-adm-field">
              <span>{m.label}</span>
              <div className="da-adm-money-input">
                <i>$</i>
                <input
                  className="da-adm-input"
                  inputMode="numeric"
                  value={String(f[m.key])}
                  onChange={(e) => setField(m.key, Number(e.target.value.replace(/[^\d]/g, "")))}
                />
              </div>
              <small>{m.note}</small>
            </label>
          ))}
        </div>
      </div>

      <div className="da-adm-preview">
        <p className="da-adm-eyebrow">How it will read</p>
        <p className="da-adm-preview-line">
          If every family gave just <b>{fmt(f.perFamily)}</b> a month, it would cover the loan and
          running costs, together.
        </p>
        <span className="da-adm-preview-btn">I can do that: give {fmt(f.perFamily)}/month</span>
      </div>
    </div>
  );
}

/* ── the two bands that come and go ───────────────────────────────── */

const MODE_CHOICES = [
  { v: "auto", label: "Automatic", note: "The normal behaviour" },
  { v: "on", label: "Force on", note: "Show it now, whatever the date" },
  { v: "off", label: "Force off", note: "Hide it, even when it is due" },
] as const;

function ModesEditor({ draft, setDraft }: { draft: SiteSettings; setDraft: (s: SiteSettings) => void }) {
  const m = draft.modes;
  const set = (patch: Partial<SiteSettings["modes"]>) => setDraft({ ...draft, modes: { ...m, ...patch } });

  return (
    <div className="da-adm-panel">
      <p className="da-adm-eyebrow">Seasons</p>
      <h2 className="da-adm-h2">The bands that come and go</h2>
      <p className="da-adm-copy">
        Both of these appear on their own — Friday for Jumu&apos;ah, the Hijri month for Ramadan.
        The switches are here so you can look at either one out of season, and pull it down in a
        hurry if something is wrong with it.
      </p>

      <div className="da-adm-modes">
        <div className="da-adm-mode da-adm-mode-jumua">
          <div className="da-adm-mode-head">
            <span className="da-adm-mode-mark" aria-hidden>
              <Glyph name="minbar" size={20} />
            </span>
            <div>
              <b>Friday band</b>
              <small>Both khutbah times and the parking note</small>
            </div>
          </div>
          <div className="da-adm-choices">
            {MODE_CHOICES.map((c) => (
              <button
                key={c.v}
                type="button"
                className={m.jumua === c.v ? "on" : ""}
                onClick={() => set({ jumua: c.v })}
              >
                <b>{c.label}</b>
                <small>{c.note}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="da-adm-mode da-adm-mode-ramadan">
          <div className="da-adm-mode-head">
            <span className="da-adm-mode-mark" aria-hidden>
              <Glyph name="star8" size={20} />
            </span>
            <div>
              <b>Ramadan band</b>
              <small>The moon, the night, and the countdown to iftar</small>
            </div>
          </div>
          <div className="da-adm-choices">
            {MODE_CHOICES.map((c) => (
              <button
                key={c.v}
                type="button"
                className={m.ramadan === c.v ? "on" : ""}
                onClick={() => set({ ramadan: c.v })}
              >
                <b>{c.label}</b>
                <small>{c.note}</small>
              </button>
            ))}
          </div>

          {m.ramadan === "on" && (
            <label className="da-adm-slider">
              <span>
                Show night <b>{m.ramadanNight}</b> of 30
                {m.ramadanNight >= 21 && m.ramadanNight % 2 === 1 && <em className="da-adm-qadr"> Laylat al-Qadr</em>}
              </span>
              <input
                type="range"
                min={1}
                max={30}
                value={m.ramadanNight}
                onChange={(e) => set({ ramadanNight: Number(e.target.value) })}
              />
            </label>
          )}

          <div className="da-adm-offset">
            <span>
              <b>Moon sighting</b>
              <small>
                The calendar is arithmetic. If the masjid announced Ramadan a day either side of
                it, shift it here and every night number follows.
              </small>
            </span>
            <div className="da-adm-offset-btns">
              {[-1, 0, 1].map((o) => (
                <button
                  key={o}
                  type="button"
                  className={m.ramadanDayOffset === o ? "on" : ""}
                  onClick={() => set({ ramadanDayOffset: o })}
                >
                  {o === 0 ? "As calculated" : o > 0 ? "A day later" : "A day earlier"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── what people have sent in ─────────────────────────────────────── */

const FORM_LABEL: Record<string, string> = {
  aalim: "Aalim program",
  hifz: "Quran Hifz",
  "quran-classes": "Quran classes",
  "kids-arabic": "KidsLearnArabic",
  volunteer: "Volunteer",
  "mailing-list": "Newsletter",
  pledge: "Monthly pledge",
  "tax-receipt": "Tax receipt",
  contact: "Contact",
};

function when(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Toronto",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function SubmissionsEditor() {
  const [rows, setRows] = React.useState<Submission[] | null>(null);
  const [persistent, setPersistent] = React.useState(true);
  const [trashDays, setTrashDays] = React.useState(30);
  const [filter, setFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState<string | null>(null);
  /** the id awaiting a second press before it is destroyed for good */
  const [confirmPurge, setConfirmPurge] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const refresh = React.useCallback(() => {
    return loadSubmissions().then((r) => {
      setRows(r.rows);
      setPersistent(r.persistent);
      setTrashDays(r.trashDays);
    });
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const live = (rows ?? []).filter((r) => !r.deletedAt);
  const binned = (rows ?? []).filter((r) => r.deletedAt);

  const forms = React.useMemo(() => {
    const set = new Set(live.map((r) => r.form));
    return ["all", ...Array.from(set)];
  }, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

  const inBin = filter === "bin";
  const shown = inBin ? binned : live.filter((r) => filter === "all" || r.form === filter);

  /* how long this one has left before the bin empties itself */
  const daysLeft = (deletedAt: string) => {
    const gone = Date.parse(deletedAt);
    if (!Number.isFinite(gone)) return trashDays;
    const used = (Date.now() - gone) / 86_400_000;
    return Math.max(0, Math.ceil(trashDays - used));
  };

  async function act(id: string, fn: (id: string) => Promise<{ ok: boolean }>) {
    setBusy(id);
    await fn(id);
    await refresh();
    setBusy(null);
    setConfirmPurge(null);
    setOpen(null);
  }

  return (
    <div className="da-adm-panel">
      <p className="da-adm-eyebrow">Submissions</p>
      <h2 className="da-adm-h2">What people have sent in</h2>
      <p className="da-adm-copy">
        Every form on the site is written here the moment it is submitted, whether or not the
        email went out. This is the copy that does not depend on an inbox.
      </p>

      {!persistent && (
        <p className="da-adm-warn">
          <b>Nothing is being kept yet.</b> Without a settings store connected, submissions live
          only until the server restarts. Connect Vercel KV and this fills up on its own.
        </p>
      )}

      {rows === null ? (
        <p className="da-adm-hint">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="da-adm-empty">
          <span aria-hidden>
            <Glyph name="envelope" size={26} />
          </span>
          <div>
            <b>Nothing yet</b>
            <small>Registrations, volunteer applications and newsletter signups turn up here.</small>
          </div>
        </div>
      ) : (
        <>
          <div className="da-adm-filters">
            {forms.map((f) => (
              <button key={f} type="button" className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                {f === "all" ? `All (${live.length})` : `${FORM_LABEL[f] ?? f} (${live.filter((r) => r.form === f).length})`}
              </button>
            ))}
            {/* the bin sits apart from the form filters — it is a different
                place, not another slice of the same list */}
            <button
              type="button"
              className={`da-adm-filter-bin ${inBin ? "on" : ""}`}
              onClick={() => setFilter("bin")}
            >
              Deleted ({binned.length})
            </button>
          </div>

          {inBin && (
            <p className="da-adm-copy">
              These are kept for {trashDays} days and then removed for good. Restoring one puts it
              back exactly where it was, with its original date.
            </p>
          )}

          {shown.length === 0 ? (
            <div className="da-adm-empty">
              <span aria-hidden>
                <Glyph name="envelope" size={26} />
              </span>
              <div>
                <b>{inBin ? "The bin is empty" : "Nothing here"}</b>
                <small>
                  {inBin
                    ? "Deleted submissions wait here before they go for good."
                    : "Nothing matches this filter."}
                </small>
              </div>
            </div>
          ) : (
            <ul className="da-adm-subs">
              {shown.map((r) => {
                const name = r.fields.studentName || r.fields["Full name"] || r.fields.parentName || r.fields.name || "—";
                const contact = r.fields.parentEmail || r.fields.email || r.fields.Phone || r.fields.emergencyContact || "";
                const isOpen = open === r.id;
                const working = busy === r.id;
                return (
                  <li key={r.id} className={isOpen ? "is-open" : undefined}>
                    {/* the head is a button, so the actions cannot live inside
                        it — they sit beside it on the same row */}
                    <div className="da-adm-sub-row">
                      <button type="button" className="da-adm-sub-head" onClick={() => setOpen(isOpen ? null : r.id)}>
                        <span className="da-adm-sub-form">{FORM_LABEL[r.form] ?? r.form}</span>
                        <span className="da-adm-sub-name">{name}</span>
                        <span className="da-adm-sub-contact">{contact}</span>
                        <span className="da-adm-sub-when">{when(r.at)}</span>
                        {r.deletedAt ? (
                          <span className="da-adm-sub-flag da-adm-sub-flag-bin">
                            {daysLeft(r.deletedAt)} day{daysLeft(r.deletedAt) === 1 ? "" : "s"} left
                          </span>
                        ) : (
                          !r.delivered && (
                            <span className="da-adm-sub-flag" title="The email did not go out; this is the only copy">
                              Not emailed
                            </span>
                          )
                        )}
                        <span className="da-adm-sub-chevron" aria-hidden>
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      <div className="da-adm-sub-actions">
                        {r.deletedAt ? (
                          <>
                            <button
                              type="button"
                              className="da-adm-row-btn"
                              disabled={working}
                              onClick={() => act(r.id, restoreSubmissionAction)}
                            >
                              Restore
                            </button>
                            {confirmPurge === r.id ? (
                              <button
                                type="button"
                                className="da-adm-row-btn da-adm-row-btn-danger is-armed"
                                disabled={working}
                                onClick={() => act(r.id, purgeSubmissionAction)}
                              >
                                {working ? "Deleting…" : "Yes, delete for good"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="da-adm-row-btn da-adm-row-btn-danger"
                                disabled={working}
                                onClick={() => setConfirmPurge(r.id)}
                              >
                                Delete for good
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            className="da-adm-row-btn"
                            disabled={working}
                            onClick={() => act(r.id, trashSubmissionAction)}
                          >
                            {working ? "Deleting…" : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <dl className="da-adm-sub-body">
                        {Object.entries(r.fields).map(([k, v]) => (
                          <div key={k}>
                            <dt>{k}</dt>
                            <dd>{v || "—"}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

/* ── the closure band ─────────────────────────────────────────────── */

/**
 * Where a notice is allowed to send people.
 *
 * A list rather than a free text box. The value ends up as an anchor on
 * every page of the site, so it is chosen from the pages that exist instead
 * of typed — which also means nobody can put a link to somewhere else
 * entirely in front of the whole congregation. The server re-checks it.
 */
const NOTICE_LINKS = [
  { href: "", name: "Nowhere — no button", label: "" },
  { href: R.locations, name: "Both masjids", label: "See the masjid" },
  { href: R.prayer, name: "Prayer times", label: "Prayer times" },
  { href: R.programs, name: "Programmes", label: "See programmes" },
  { href: R.community, name: "Community & volunteering", label: "Get involved" },
  { href: R.contact, name: "Contact & visit", label: "Contact us" },
  { href: R.newsletters, name: "Newsletters", label: "Read it" },
  { href: R.pledge, name: "Monthly pledge", label: "Give" },
];

const TONE_CHOICES = [
  { v: "good" as const, label: "Good news", note: "Something is happening" },
  { v: "notice" as const, label: "Notice", note: "A change of plan" },
  { v: "urgent" as const, label: "Urgent", note: "The masjid is closed" },
];

/** a handful of openings, so nobody has to invent wording in a hurry */
const NOTICE_PRESETS = [
  {
    tone: "good" as const,
    title: "First Jumu'ah at Darul Arqum West",
    /* the day and the time are deliberately left as blanks: nobody should
       publish a prayer time the website guessed at */
    detail: "Our second masjid holds its first Jumu'ah this Friday. Khutbah at —:— PM at 6050 Old Richmond Rd. Everyone is welcome.",
    href: R.locations,
    linkLabel: "See the masjid",
  },
  {
    tone: "urgent" as const,
    title: "Masjid closed today",
    detail: "The building is closed due to weather. All jamaat are cancelled. Follow the WhatsApp group for updates.",
  },
  {
    tone: "urgent" as const,
    title: "No Fajr jamaat tomorrow",
    detail: "Fajr jamaat is cancelled tomorrow morning only. Every other prayer is at its usual time.",
  },
  {
    tone: "notice" as const,
    title: "Iqama times have changed",
    detail: "New iqama times start this week. The prayer times page has the full schedule.",
  },
];

function NoticeEditor({ draft, setDraft }: { draft: SiteSettings; setDraft: (s: SiteSettings) => void }) {
  const n = draft.notice;
  const set = (patch: Partial<SiteSettings["notice"]>) =>
    setDraft({ ...draft, notice: { ...n, ...patch } });

  const today = todayInZone();
  const live = noticeIsLive(n, today);
  const expired = n.on && Boolean(n.title) && Boolean(n.until) && today > n.until;

  return (
    <div className="da-adm-panel">
      <p className="da-adm-eyebrow">Notice</p>
      <h2 className="da-adm-h2">The band for the day something is wrong</h2>
      <p className="da-adm-copy">
        Snow, a burst pipe, a jamaat that is not happening. This sits above everything on
        every page and stays put until the reader dismisses it — it is the only thing on the
        site that outranks the front page, so switch it on for things that actually change
        somebody&apos;s morning.
      </p>

      <div className="da-adm-notice-grid">
        <div className="da-adm-field">
          <label htmlFor="da-nt-title">
            The headline <small>One line. What is happening.</small>
          </label>
          <input
            id="da-nt-title"
            type="text"
            maxLength={90}
            value={n.title}
            placeholder="Masjid closed today"
            onChange={(e) => set({ title: e.target.value })}
          />
        </div>

        <div className="da-adm-field">
          <label htmlFor="da-nt-detail">
            The detail <small>One sentence. Optional.</small>
          </label>
          <textarea
            id="da-nt-detail"
            rows={3}
            maxLength={220}
            value={n.detail}
            placeholder="The building is closed due to weather. All jamaat are cancelled."
            onChange={(e) => set({ detail: e.target.value })}
          />
        </div>

        <div className="da-adm-field">
          <span className="da-adm-field-label">How serious</span>
          <div className="da-adm-choices">
            {TONE_CHOICES.map((c) => (
              <button
                key={c.v}
                type="button"
                className={n.tone === c.v ? "on" : ""}
                onClick={() => set({ tone: c.v })}
              >
                <b>{c.label}</b>
                <small>{c.note}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="da-adm-field">
          <label htmlFor="da-nt-href">
            Send people to <small>A page on this site. Leave empty for no button.</small>
          </label>
          <select
            id="da-nt-href"
            value={n.href}
            onChange={(e) => {
              const href = e.target.value;
              const match = NOTICE_LINKS.find((l) => l.href === href);
              // the label follows the destination unless one was typed
              set({ href, linkLabel: href ? n.linkLabel || match?.label || "Details" : "" });
            }}
          >
            {NOTICE_LINKS.map((l) => (
              <option key={l.href || "none"} value={l.href}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className="da-adm-field">
          <label htmlFor="da-nt-linklabel">
            What the button says <small>Two or three words.</small>
          </label>
          <input
            id="da-nt-linklabel"
            type="text"
            maxLength={40}
            value={n.linkLabel}
            placeholder="See the masjid"
            disabled={!n.href}
            onChange={(e) => set({ linkLabel: e.target.value })}
          />
        </div>

        <div className="da-adm-field">
          <label htmlFor="da-nt-until">
            Take it down after <small>Leave empty and it stays until you switch it off.</small>
          </label>
          <input
            id="da-nt-until"
            type="date"
            value={n.until}
            min={today}
            onChange={(e) => set({ until: e.target.value })}
          />
          <p className="da-adm-hint">
            The band removes itself the day after this. A closure notice still up in April is
            worse than none at all — people stop reading the band, and then miss the one that
            matters.
          </p>
        </div>
      </div>

      <div className="da-adm-notice-switch">
        <button
          type="button"
          className={n.on ? "da-adm-go" : "da-adm-ghost"}
          onClick={() => set({ on: !n.on })}
          disabled={!n.title.trim()}
        >
          {n.on ? "Band is on — switch it off" : "Switch the band on"}
        </button>
        {!n.title.trim() && <span className="da-adm-hint">Write a headline first.</span>}
        {expired && (
          <span className="da-adm-hint">
            The end date has passed, so this is switched on but not showing. Change the date to
            bring it back.
          </span>
        )}
      </div>

      <p className="da-adm-eyebrow" style={{ marginTop: 26 }}>
        {live ? "On the site right now" : "Not showing — this is how it would look"}
      </p>
      {/* the real band, same classes, so what is approved is what ships */}
      <div className="da-adm-notice-preview">
        <div className="da-cn" data-tone={n.tone} style={{ position: "static" }}>
          <div className="da-cn-inner">
            <NoticeDoor tone={n.tone} />
            <div className="da-cn-text">
              <p className="da-cn-title">{n.title || "Your headline goes here"}</p>
              {n.detail && <p className="da-cn-detail">{n.detail}</p>}
            </div>
            {n.href && (
              <span className="da-cn-link">
                {n.linkLabel || "Details"} <span aria-hidden="true">→</span>
              </span>
            )}
            <span className="da-cn-x" aria-hidden>
              <svg viewBox="0 0 16 16">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <p className="da-adm-eyebrow" style={{ marginTop: 26 }}>Starting points</p>
      <div className="da-adm-presets">
        {NOTICE_PRESETS.map((p) => (
          <button
            key={p.title}
            type="button"
            onClick={() =>
              set({
                tone: p.tone,
                title: p.title,
                detail: p.detail,
                // a preset without a link must clear whatever was there
                href: "href" in p ? (p.href as string) : "",
                linkLabel: "linkLabel" in p ? (p.linkLabel as string) : "",
              })
            }
          >
            <b>{p.title}</b>
            <small>{TONE_CHOICES.find((t) => t.v === p.tone)?.label ?? p.tone}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── telling the list ─────────────────────────────────────────────── */

/**
 * The one thing in this panel that leaves the building.
 *
 * A saved prayer time can be corrected in thirty seconds. A sent email
 * cannot be recalled from four hundred inboxes, so this is two presses with
 * the recipient count spelled out in between, and the second press carries
 * that count back to the server — if somebody signs up while the preview is
 * on screen, the send is refused rather than going to a list the sender did
 * not agree to.
 */
function NewsletterSender() {
  const [count, setCount] = React.useState<number | null>(null);
  const [mailReady, setMailReady] = React.useState(true);
  const [title, setTitle] = React.useState("");
  const [blurb, setBlurb] = React.useState("");
  // R.newsletters is a literal type, so the state has to be widened or the
  // field cannot be edited
  const [link, setLink] = React.useState<string>(R.newsletters);
  const [stage, setStage] = React.useState<"edit" | "confirm" | "done">("edit");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [report, setReport] = React.useState<{ sent: number; failed: number; failures: string[] } | null>(null);

  React.useEffect(() => {
    loadSubscribers().then((r) => {
      if (!r.ok) return;
      setCount(r.count);
      setMailReady(r.mailReady);
    });
  }, []);

  const preview = async () => {
    setError("");
    setBusy(true);
    const r = await sendNewsletterEmail({ title, blurb, link });
    setBusy(false);
    if (r.error) {
      setError(r.error);
      return;
    }
    setCount(r.attempted);
    setStage("confirm");
  };

  const send = async () => {
    if (count === null) return;
    setError("");
    setBusy(true);
    const r = await sendNewsletterEmail({ title, blurb, link, confirm: count });
    setBusy(false);
    if (r.error) {
      setError(r.error);
      setStage("edit");
      return;
    }
    setReport({ sent: r.sent, failed: r.failed, failures: r.failures });
    setStage("done");
  };

  if (stage === "done" && report) {
    return (
      <div className="da-adm-panel">
        <p className="da-adm-eyebrow">Newsletter</p>
        <h2 className="da-adm-h2">Sent to {report.sent} {report.sent === 1 ? "person" : "people"}</h2>
        {report.failed > 0 ? (
          <>
            <p className="da-adm-copy">
              {report.failed} did not go through. These addresses are still on the list — nothing
              was removed — so they can be tried again or checked for typos.
            </p>
            <ul className="da-adm-fail-list">
              {report.failures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="da-adm-copy">Every address went through. Nothing else to do.</p>
        )}
        <button type="button" className="da-adm-ghost" onClick={() => { setStage("edit"); setReport(null); }}>
          Write another
        </button>
      </div>
    );
  }

  return (
    <div className="da-adm-panel">
      <p className="da-adm-eyebrow">Newsletter</p>
      <h2 className="da-adm-h2">Tell the list there&apos;s a new edition</h2>
      <p className="da-adm-copy">
        The newsletter itself lives on the site. This only says &ldquo;there is a new one, here
        it is&rdquo; and links to it — so put the edition up first, then send this.
      </p>

      {!mailReady && (
        <p className="da-adm-warn da-adm-warn-wide">
          <b>Mail is not configured on this deployment.</b> Nothing can be sent until SMTP_USER
          and SMTP_PASS are set.
        </p>
      )}

      <p className="da-adm-copy">
        <b>{count === null ? "Counting…" : `${count} ${count === 1 ? "person is" : "people are"} on the list.`}</b>{" "}
        Everyone here typed their address into the signup form themselves. Every message carries
        the masjid&apos;s address and a working unsubscribe link, which the law requires and
        which this sends automatically.
      </p>

      {stage === "edit" ? (
        <>
          <div className="da-adm-notice-grid">
            <div className="da-adm-field">
              <label htmlFor="da-nl-title">
                What&apos;s new <small>Becomes the subject line.</small>
              </label>
              <input
                id="da-nl-title"
                type="text"
                maxLength={120}
                value={title}
                placeholder="March 2026 newsletter is up"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="da-adm-field">
              <label htmlFor="da-nl-blurb">
                A line or two <small>Optional. What&apos;s in it.</small>
              </label>
              <textarea
                id="da-nl-blurb"
                rows={3}
                maxLength={400}
                value={blurb}
                placeholder="Ramadan timetable, the new Hifz intake, and an update on the West masjid."
                onChange={(e) => setBlurb(e.target.value)}
              />
            </div>
            <div className="da-adm-field">
              <label htmlFor="da-nl-link">
                Where it is <small>The page to send them to.</small>
              </label>
              <input
                id="da-nl-link"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="da-adm-warn da-adm-warn-wide">{error}</p>}

          <button
            type="button"
            className="da-adm-go"
            onClick={preview}
            disabled={busy || !title.trim() || !mailReady || count === 0}
          >
            {busy ? "Checking…" : "Review before sending"}
          </button>
        </>
      ) : (
        <div className="da-adm-send-confirm">
          <p className="da-adm-eyebrow">This is what they get</p>
          <div className="da-adm-mail-preview">
            <p className="da-adm-mail-subject">
              <span>Subject</span> {ORG.name} — {title}
            </p>
            <pre className="da-adm-mail-body">{`Assalamu alaikum,

There's something new in the ${ORG.name} newsletter:

${title}${blurb.trim() ? `\n\n${blurb.trim()}` : ""}

Read it here:
${link}

—
${ORG.name} — ${ORG.tagline}
${ORG.address}
Registered charity ${ORG.charityReg}

You're getting this because you signed up for the newsletter.
To stop receiving these, unsubscribe here:
(a link that belongs to their address)`}</pre>
          </div>

          <p className="da-adm-copy">
            <b>
              This goes to {count} {count === 1 ? "person" : "people"} and cannot be taken back.
            </b>{" "}
            Read the subject line once more — it is the part everybody sees.
          </p>

          {error && <p className="da-adm-warn da-adm-warn-wide">{error}</p>}

          <div className="da-adm-send-actions">
            <button type="button" className="da-adm-ghost" onClick={() => setStage("edit")} disabled={busy}>
              Go back and edit
            </button>
            <button type="button" className="da-adm-go" onClick={send} disabled={busy}>
              {busy ? "Sending…" : `Send it to ${count}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── the panel ────────────────────────────────────────────────────── */

type Tab = "prayer" | "money" | "modes" | "notice" | "news" | "subs";

export function AdminPage({
  initial,
  signedIn: initialSignedIn,
  configured,
  persistent,
}: {
  initial: SiteSettings;
  signedIn: boolean;
  configured: boolean;
  persistent: boolean;
}) {
  const [signedIn, setSignedIn] = React.useState(initialSignedIn);
  const [saved, setSaved] = React.useState<SiteSettings>(initial);
  const [draft, setDraft] = React.useState<SiteSettings>(initial);
  const [tab, setTab] = React.useState<Tab>("prayer");
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [flash, setFlash] = React.useState("");
  const times = usePrayerTimes();

  const changes = React.useMemo<Change[]>(() => {
    const out: Change[] = [];
    for (const m of MONEY_FIELDS) {
      if (saved.finances[m.key] !== draft.finances[m.key]) {
        out.push({ label: m.label, from: fmt(saved.finances[m.key]), to: fmt(draft.finances[m.key]) });
      }
    }
    for (const k of ["first", "second"] as const) {
      if (saved.jumua[k] !== draft.jumua[k]) {
        out.push({
          label: k === "first" ? "First khutbah" : "Second khutbah",
          from: saved.jumua[k],
          to: draft.jumua[k],
        });
      }
    }

    const modeWord = (v: string) => (v === "auto" ? "Automatic" : v === "on" ? "Forced on" : "Forced off");
    if (saved.modes.jumua !== draft.modes.jumua) {
      out.push({ label: "Friday band", from: modeWord(saved.modes.jumua), to: modeWord(draft.modes.jumua) });
    }
    if (saved.modes.ramadan !== draft.modes.ramadan) {
      out.push({ label: "Ramadan band", from: modeWord(saved.modes.ramadan), to: modeWord(draft.modes.ramadan) });
    }
    if (draft.modes.ramadan === "on" && saved.modes.ramadanNight !== draft.modes.ramadanNight) {
      out.push({
        label: "Ramadan night shown",
        from: `Night ${saved.modes.ramadanNight}`,
        to: `Night ${draft.modes.ramadanNight}`,
      });
    }
    if (saved.modes.ramadanDayOffset !== draft.modes.ramadanDayOffset) {
      const word = (o: number) => (o === 0 ? "As calculated" : o > 0 ? "A day later" : "A day earlier");
      out.push({
        label: "Moon sighting",
        from: word(saved.modes.ramadanDayOffset),
        to: word(draft.modes.ramadanDayOffset),
      });
    }

    /* The closure band. Listed before the Mawaqit early return below, or a
       closure edited while the schedule switch is on would be saved without
       ever appearing on the confirm screen. */
    const sn = saved.notice;
    const dn = draft.notice;
    if (sn.on !== dn.on) {
      out.push({ label: "Closure band", from: sn.on ? "Showing" : "Hidden", to: dn.on ? "Showing" : "Hidden" });
    }
    if (sn.tone !== dn.tone) {
      const toneWord = (t: string) => TONE_CHOICES.find((c) => c.v === t)?.label ?? t;
      out.push({ label: "Notice tone", from: toneWord(sn.tone), to: toneWord(dn.tone) });
    }
    if (sn.href !== dn.href) {
      const where = (h: string) => NOTICE_LINKS.find((l) => l.href === h)?.name ?? h ?? "Nowhere";
      out.push({ label: "Notice button goes to", from: where(sn.href), to: where(dn.href) });
    }
    if (sn.linkLabel !== dn.linkLabel) {
      out.push({ label: "Notice button says", from: sn.linkLabel || "—", to: dn.linkLabel || "—" });
    }
    if (sn.title !== dn.title) {
      out.push({ label: "Notice headline", from: sn.title || "—", to: dn.title || "—" });
    }
    if (sn.detail !== dn.detail) {
      out.push({ label: "Notice detail", from: sn.detail || "—", to: dn.detail || "—" });
    }
    if (sn.until !== dn.until) {
      out.push({ label: "Notice ends after", from: sn.until || "No end date", to: dn.until || "No end date" });
    }

    if (saved.followMawaqit !== draft.followMawaqit) {
      out.push({
        label: "Follow the Mawaqit schedule",
        from: saved.followMawaqit ? "On" : "Off",
        to: draft.followMawaqit ? "On" : "Off",
      });
    }
    // while the switch is on the overrides are dormant, so listing them as
    // changes would be describing something the website will not do
    if (draft.followMawaqit) return out;

    const keys = new Set([...Object.keys(saved.prayers), ...Object.keys(draft.prayers)]);
    for (const k of keys) {
      const base = times.prayers.find((p) => p.key === k);
      for (const field of ["adhan", "iqama"] as const) {
        const a = saved.prayers[k]?.[field] ?? base?.[field] ?? "—";
        const b = draft.prayers[k]?.[field] ?? base?.[field] ?? "—";
        if (a !== b) out.push({ label: `${PRAYER_LABEL[k] ?? k} ${field}`, from: a, to: b });
      }
    }
    return out;
  }, [saved, draft, times.prayers]);

  async function commit() {
    setBusy(true);
    const res = await saveSettings(draft);
    setBusy(false);
    setConfirming(false);
    if (res.ok) {
      setSaved(draft);
      setFlash(res.persisted ? "Saved. The website is showing these now." : "Saved for this session only — see the notice above.");
      setTimeout(() => setFlash(""), 6000);
    } else {
      setFlash(res.error ?? "Could not save.");
    }
  }

  if (!signedIn) return <SignIn onIn={() => setSignedIn(true)} configured={configured} />;

  return (
    <div className="da-adm">
      <div className="da-adm-scan" aria-hidden />

      <header className="da-adm-head">
        <div>
          <p className="da-adm-eyebrow">Darul Arqum · administration</p>
          <h1 className="da-adm-h1">What would you like to change?</h1>
        </div>
        <button
          type="button"
          className="da-adm-ghost"
          onClick={async () => {
            await adminLogout();
            setSignedIn(false);
          }}
        >
          Sign out
        </button>
      </header>

      {!persistent && (
        <p className="da-adm-warn da-adm-warn-wide">
          <b>Changes will not stick yet.</b> This site has no settings store connected, so anything
          you save here lasts until the server restarts. Add the Vercel KV integration and the
          panel starts saving for real — nothing else has to change.
        </p>
      )}

      <nav className="da-adm-tabs">
        <button type="button" className={tab === "prayer" ? "on" : ""} onClick={() => setTab("prayer")}>
          <Glyph name="calendar" size={17} /> Prayer times
        </button>
        <button type="button" className={tab === "money" ? "on" : ""} onClick={() => setTab("money")}>
          <Glyph name="tuition" size={17} /> Giving &amp; the loan
        </button>
        <button type="button" className={tab === "modes" ? "on" : ""} onClick={() => setTab("modes")}>
          <Glyph name="star8" size={17} /> Seasons
        </button>
        <button type="button" className={tab === "notice" ? "on" : ""} onClick={() => setTab("notice")}>
          <Glyph name="minbar" size={17} /> Notice
          {/* a live closure is the one state worth flagging on the tab itself */}
          {noticeIsLive(saved.notice, todayInZone()) && <i className="da-adm-tab-live" aria-label="live" />}
        </button>
        <button type="button" className={tab === "news" ? "on" : ""} onClick={() => setTab("news")}>
          <Glyph name="envelope" size={17} /> Newsletter
        </button>
        <button type="button" className={tab === "subs" ? "on" : ""} onClick={() => setTab("subs")}>
          <Glyph name="calendar" size={17} /> Submissions
        </button>
      </nav>

      {tab === "prayer" && <PrayerEditor draft={draft} setDraft={setDraft} />}
      {tab === "money" && <MoneyEditor draft={draft} setDraft={setDraft} />}
      {tab === "modes" && <ModesEditor draft={draft} setDraft={setDraft} />}
      {tab === "notice" && <NoticeEditor draft={draft} setDraft={setDraft} />}
      {tab === "news" && <NewsletterSender />}
      {tab === "subs" && <SubmissionsEditor />}

      <div className="da-adm-bar">
        <span className="da-adm-bar-count">
          {changes.length === 0 ? "Nothing changed yet" : `${changes.length} unsaved change${changes.length === 1 ? "" : "s"}`}
        </span>
        {flash && <span className="da-adm-flash">{flash}</span>}
        <button type="button" className="da-adm-ghost" onClick={() => setDraft(saved)} disabled={!changes.length}>
          Undo all
        </button>
        <button type="button" className="da-adm-go" onClick={() => setConfirming(true)} disabled={!changes.length}>
          Review and save
        </button>
      </div>

      {confirming && (
        <Confirm changes={changes} busy={busy} onCancel={() => setConfirming(false)} onConfirm={commit} />
      )}

      <p className="da-adm-foot">
        Signed in to {ORG.name}. This page is not linked from anywhere and is not indexed.
      </p>
    </div>
  );
}
