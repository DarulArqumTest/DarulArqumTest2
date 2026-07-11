"use client";

/**
 * Shared working-form system for all 8 site forms.
 * Submits through the server action (Resend delivery when configured);
 * always offers a prefilled email fallback so no submission is ever lost.
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2, Mail, TriangleAlert } from "lucide-react";
import { submitForm } from "@/app/actions/submit";
import { ORG } from "@/lib/links";
import { isValidEmail, isValidPhone } from "@/lib/validate";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "date";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  half?: boolean;
};

const input =
  "w-full rounded-xl border border-line bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-moss focus:outline-none transition-colors";

export function FormSystem({
  formName,
  fields,
  submitLabel = "Submit",
  note,
}: {
  formName: string;
  fields: Field[];
  submitLabel?: string;
  note?: string;
}) {
  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const [delivered, setDelivered] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  function checkField(f: Field, value: string) {
    if (f.type === "email" && !isValidEmail(value)) return "Enter a valid email address.";
    if (f.type === "tel" && !isValidPhone(value)) return "Enter a valid phone number.";
    return "";
  }

  function onFieldBlur(f: Field, value: string) {
    const msg = checkField(f, value);
    setFieldErrors((prev) => ({ ...prev, [f.name]: msg }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));

    const errors: Record<string, string> = {};
    for (const f of fields) {
      const msg = checkField(f, data[f.name] ?? "");
      if (msg) errors[f.name] = msg;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setState("busy");
    setValues(data);
    const res = await submitForm(formName, data);
    if (res.ok) {
      setDelivered(res.delivered);
      setState("done");
    } else setState("error");
  }

  const mailtoBody = encodeURIComponent(
    Object.entries(values)
      .filter(([k, v]) => !k.startsWith("_") && v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
  );
  const mailto = `mailto:${ORG.email}?subject=${encodeURIComponent(
    `[darularqum.org] ${formName}`,
  )}&body=${mailtoBody}`;

  return (
    <div>
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-moss/25 bg-moss/[0.07] p-8"
          >
            <CheckCircle2 className="h-6 w-6 text-moss" aria-hidden />
            <p className="mt-3 font-medium text-ink">
              {delivered ? "Submission sent" : "Submission recorded"}
            </p>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink/60">
              {delivered
                ? "The Darul Arqum team has received your details and will follow up."
                : "To make sure it reaches the team right away, you can also send it directly from your email app — everything is prefilled."}
            </p>
            {!delivered && (
              <a
                href={mailto}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-medium text-bone transition-colors hover:bg-moss"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Send via your email app
              </a>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={false}
            onSubmit={onSubmit}
            className="grid gap-4 sm:grid-cols-2"
          >
            <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {fields.map((f) => (
              <label key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink/55">
                  {f.label}
                  {f.required && <span className="text-brass"> *</span>}
                </span>
                {f.type === "textarea" ? (
                  <textarea name={f.name} required={f.required} placeholder={f.placeholder} rows={5} className={input} />
                ) : f.type === "select" ? (
                  <select name={f.name} required={f.required} defaultValue="" className={input}>
                    <option value="" disabled>
                      Choose…
                    </option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={f.name}
                    type={f.type ?? "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    className={input}
                    onBlur={(e) => onFieldBlur(f, e.currentTarget.value)}
                    onChange={() => fieldErrors[f.name] && setFieldErrors((prev) => ({ ...prev, [f.name]: "" }))}
                  />
                )}
                {fieldErrors[f.name] && (
                  <span className="mt-1.5 block text-xs text-red-700">{fieldErrors[f.name]}</span>
                )}
              </label>
            ))}
            {note && <p className="text-xs leading-relaxed text-ink/50 sm:col-span-2">{note}</p>}
            {state === "error" && (
              <p className="flex items-center gap-2 text-sm text-red-800 sm:col-span-2">
                <TriangleAlert className="h-4 w-4" aria-hidden />
                Something needs attention — check the fields and try again.
              </p>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={state === "busy"}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-bone transition-all hover:bg-moss disabled:opacity-60"
              >
                {state === "busy" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {state === "busy" ? "Sending…" : submitLabel}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
