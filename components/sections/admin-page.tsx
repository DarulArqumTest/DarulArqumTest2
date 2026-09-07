"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { adminLogin, adminLogout, saveSettings } from "@/app/actions/admin";
import { usePrayerTimes } from "@/components/prayer/use-prayer-times";
import { applyPrayerOverrides, repaidFraction, type SiteSettings } from "@/lib/settings";
import { MasjidProgress } from "@/components/site/masjid-progress";
import { Glyph } from "@/components/site/program-glyphs";
import { ORG } from "@/lib/links";
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

/* ── the panel ────────────────────────────────────────────────────── */

type Tab = "prayer" | "money";

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
      </nav>

      {tab === "prayer" ? (
        <PrayerEditor draft={draft} setDraft={setDraft} />
      ) : (
        <MoneyEditor draft={draft} setDraft={setDraft} />
      )}

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
