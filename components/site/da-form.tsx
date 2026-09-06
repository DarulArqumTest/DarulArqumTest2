"use client";

/**
 * One form system for the whole site.
 *
 * Five pages each carried their own hand-written form: their own submit
 * handler, their own validation, their own success panel, their own field
 * markup. They drifted the way duplicated things do — one validated a phone
 * number and another did not, one had a honeypot in a different place, the
 * success copy differed on every page — and fixing anything meant fixing it
 * five times and missing one.
 *
 * A page declares its sections and fields now. Everything else — submission,
 * validation, the honeypot, the delivered/recorded distinction, the email
 * fallback when delivery is not configured, the busy and error states — lives
 * here once.
 *
 * Field `name`s are passed straight through, so what reaches the server action
 * is byte-for-byte what the old forms sent.
 */

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { submitForm } from "@/app/actions/submit";
import { ORG } from "@/lib/links";
import { isValidEmail, isValidPhone } from "@/lib/validate";
import { Glyph, type GlyphName } from "@/components/site/program-glyphs";

/* ── what a page declares ─────────────────────────────────────────── */

export type FieldType = "text" | "email" | "tel" | "date" | "textarea" | "select" | "checkboxes";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  /** share a row with the next field */
  half?: boolean;
  /** a line under the input */
  help?: string;
  rows?: number;
  max?: string;
  /**
   * Derive a note — and optionally a second value — from what is typed.
   * Used by the date of birth, which shows the age it works out to and
   * still sends that age along, so a submission reads the same to whoever
   * receives it as it did before the date picker replaced the age box.
   */
  derive?: (value: string) => { text: string; ok: boolean; value?: string } | null;
  /** the hidden field the derived value travels in */
  deriveTo?: string;
};

/** the four section identities, each with its own colour and motif in CSS */
export type SectionKind = "student" | "parents" | "care" | "background";

export type Section = {
  kind: SectionKind;
  title: string;
  glyph: GlyphName;
  /** a line under the section title */
  lede?: string;
  fields: Field[];
};

const SECTION_GLYPH_FALLBACK: Record<SectionKind, GlyphName> = {
  student: "student",
  parents: "parents",
  care: "character",
  background: "history",
};

/* ── field rendering ──────────────────────────────────────────────── */

function FieldControl({
  f,
  error,
  onBlur,
  onChange,
  value,
}: {
  f: Field;
  error?: string;
  onBlur: (v: string) => void;
  onChange: (v: string) => void;
  value: string;
}) {
  const common = {
    name: f.name,
    required: f.required,
    placeholder: f.placeholder,
    "aria-invalid": error ? true : undefined,
    className: "da-input",
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onBlur(e.currentTarget.value),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(e.currentTarget.value),
  };

  if (f.type === "textarea") return <textarea {...common} rows={f.rows ?? 3} defaultValue={undefined} />;

  if (f.type === "select") {
    return (
      <select {...common} defaultValue="">
        <option value="" disabled>
          Select…
        </option>
        {f.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (f.type === "checkboxes") {
    return (
      <div className="da-checks">
        {f.options?.map((o) => (
          <label key={o} className="da-check">
            <input type="checkbox" name={f.name} value={o} />
            <span className="da-check-box" aria-hidden />
            <span>{o}</span>
          </label>
        ))}
      </div>
    );
  }

  return <input {...common} type={f.type ?? "text"} max={f.max} value={f.derive ? value : undefined} />;
}

/* ── the form ─────────────────────────────────────────────────────── */

export function DaForm({
  formName,
  sections,
  submitLabel = "Submit",
  subject,
  /** the field whose value must be a valid email, if any */
  emailField = "parentEmail",
  /** the field whose value must be a valid phone number, if any */
  phoneField = "emergencyContact",
  note,
  extra,
  doneTitle = "Registration received",
  onSuccess,
  renderDone,
}: {
  formName: string;
  sections: Section[];
  submitLabel?: string;
  subject: string;
  emailField?: string | null;
  phoneField?: string | null;
  note?: React.ReactNode;
  /** anything to render between the last section and the submit row */
  extra?: React.ReactNode;
  doneTitle?: string;
  /**
   * Told when the form goes through, so a page can react somewhere else —
   * the newsletter page uses it to send the paper aeroplane in its hero.
   */
  onSuccess?: (delivered: boolean) => void;
  /**
   * Replaces the standard success panel. A page only reaches for this when
   * it has a better thing to say than "received"; everything else keeps the
   * shared panel so five forms cannot drift apart again.
   */
  renderDone?: (args: { delivered: boolean; mailto: string }) => React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const [delivered, setDelivered] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [live, setLive] = React.useState<Record<string, string>>({});

  function validate(name: string, value: string) {
    if (name === emailField) return isValidEmail(value) ? "" : "Enter a valid email address.";
    if (name === phoneField) return isValidPhone(value) ? "" : "Enter a valid phone number.";
    return "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    // checkbox groups arrive once per checked box; join them so the server
    // action receives one readable value per field, as it did before
    fd.forEach((v, k) => {
      const s = String(v);
      data[k] = data[k] ? `${data[k]}, ${s}` : s;
    });

    const next: Record<string, string> = {};
    for (const key of [emailField, phoneField]) {
      if (!key) continue;
      const msg = validate(key, data[key] ?? "");
      if (msg) next[key] = msg;
    }
    setErrors(next);
    if (Object.keys(next).length) {
      const first = document.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setState("busy");
    setValues(data);
    const res = await submitForm(formName, data);
    if (res.ok) {
      setDelivered(res.delivered);
      setState("done");
      onSuccess?.(res.delivered);
    } else setState("error");
  }

  const mailto = `mailto:${ORG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    Object.entries(values)
      .filter(([k, v]) => !k.startsWith("_") && v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
  )}`;

  if (state === "done" && renderDone) return <>{renderDone({ delivered, mailto })}</>;

  if (state === "done") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="da-panel da-panel-flush da-form-done"
        style={{ ["--tint" as string]: "#7cc99a" }}
      >
        <span className="da-form-done-mark" aria-hidden>
          <Glyph name="assessment" size={26} />
        </span>
        <div>
          <p className="da-panel-eyebrow">{delivered ? "Sent" : "Recorded"}</p>
          <h2 className="da-panel-title">{doneTitle}</h2>
          <p className="da-panel-copy">
            {delivered
              ? "The Darul Arqum team has your details and will follow up by email or phone."
              : "Your details are saved. To be certain they reach the team today, send them from your own email app as well — everything is prefilled."}
          </p>
          {!delivered && (
            <a href={mailto} className="da-solid-btn" style={{ marginTop: 16 }}>
              <Glyph name="envelope" size={17} /> Send from my email app
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.16 }}
      className="da-form"
    >
      <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" className="da-honeypot" aria-hidden="true" />

      {sections.map((sec, si) => (
        <fieldset key={sec.kind + si} className={`da-formsec da-formsec-${sec.kind}`}>
          <legend className="da-formsec-head">
            <span className="da-sec-mark">
              <Glyph name={sec.glyph ?? SECTION_GLYPH_FALLBACK[sec.kind]} size={17} />
            </span>
            <span className="da-formsec-title">{sec.title}</span>
          </legend>
          {sec.lede && <p className="da-formsec-lede">{sec.lede}</p>}

          <div className="da-form-grid">
            {sec.fields.map((f) => {
              const derived = f.derive ? f.derive(live[f.name] ?? "") : null;
              return (
                <label
                  key={f.name + f.label}
                  className={`da-field${f.half ? " da-field-half" : ""}${errors[f.name] ? " da-field-bad" : ""}`}
                >
                  <span className="da-field-label">
                    {f.label}
                    {f.required && <b aria-hidden> *</b>}
                  </span>
                  <FieldControl
                    f={f}
                    error={errors[f.name]}
                    value={live[f.name] ?? ""}
                    onChange={(v) => {
                      setLive((p) => ({ ...p, [f.name]: v }));
                      if (errors[f.name]) setErrors((p) => ({ ...p, [f.name]: "" }));
                    }}
                    onBlur={(v) => {
                      const msg = validate(f.name, v);
                      if (msg || errors[f.name]) setErrors((p) => ({ ...p, [f.name]: msg }));
                    }}
                  />
                  {f.deriveTo && <input type="hidden" name={f.deriveTo} value={derived?.value ?? ""} />}
                  {errors[f.name] ? (
                    <span className="da-field-error">{errors[f.name]}</span>
                  ) : derived ? (
                    <span className={derived.ok ? "da-field-help" : "da-field-warn"}>{derived.text}</span>
                  ) : f.help ? (
                    <span className="da-field-help">{f.help}</span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {extra}
      {note && <p className="da-form-note">{note}</p>}

      <div className="da-form-submit">
        <button type="submit" disabled={state === "busy"} className="da-solid-btn da-form-go">
          {state === "busy" ? "Sending…" : submitLabel}
          {state !== "busy" && <span aria-hidden="true">→</span>}
        </button>
        {state === "error" && (
          <p className="da-form-error" role="alert">
            That didn&apos;t go through. Check the highlighted fields and try again — or call{" "}
            <a href={ORG.phoneHref}>{ORG.phone}</a>.
          </p>
        )}
      </div>
    </motion.form>
  );
}
