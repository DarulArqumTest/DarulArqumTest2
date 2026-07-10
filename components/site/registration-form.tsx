"use client";

/** Shared registration page layout + form for the four programs
 * (Aalim, Hifz, Quran Classes, Kids Arabic). Parameterized by a per-program
 * config — hero illustration, pricing/schedule copy, curriculum strip,
 * background texture, and (Kids-only) health card + medical fields. */

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Mail, TriangleAlert } from "lucide-react";
import { submitForm } from "@/app/actions/submit";
import { ORG } from "@/lib/links";
import { Reveal } from "@/components/site/reveal";

export type ProgramConfig = {
  submitDestination: string;
  emailSubject: string;
  eyebrow: string;
  title: string;
  accentHex: string;
  studentLabel: string;
  parentLabel: string;
  ageMin: number;
  ageMax: number;
  agePlaceholder: string;
  ageRequired?: boolean;
  schedule: { label: string; sub: string };
  tuition: { label: string; sub: string };
  backgroundField: { label: string; placeholder: string };
  curriculum?: string[];
  extraAbout?: string;
  medical?: boolean;
  hero: React.ReactNode;
  backdrop: React.ReactNode;
  buttonTextColor?: string;
  /** Overrides accentHex for just the submit button (e.g. Quran Class uses blue accents but a gold button). */
  buttonAccentHex?: string;
};

function GenderSelect({ accent }: { accent: string }) {
  const chevron = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${accent}"><path d="M5 7l5 5 5-5" stroke="${accent}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  );
  return (
    <select
      required
      defaultValue=""
      name="gender"
      className="w-full appearance-none rounded-lg border border-da-cream/20 bg-da-cream/[0.06] bg-no-repeat px-[13px] py-[11px] text-sm text-da-cream focus:border-da-gold focus:outline-none"
      style={{ backgroundImage: `url("data:image/svg+xml,${chevron}")`, backgroundPosition: "right 12px center", backgroundSize: "14px" }}
    >
      <option value="" disabled>
        Select…
      </option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  );
}

export function RegistrationForm({ config }: { config: ProgramConfig }) {
  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const [delivered, setDelivered] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const inputCls =
    "w-full rounded-lg border border-da-cream/20 bg-da-cream/[0.06] px-[13px] py-[11px] text-sm text-da-cream placeholder:text-da-cream/35 focus:border-da-gold focus:outline-none";
  const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-da-cream/55";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));
    setValues(data);
    const res = await submitForm(config.submitDestination, data);
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
  const mailto = `mailto:${ORG.email}?subject=${encodeURIComponent(config.emailSubject)}&body=${mailtoBody}`;

  return (
    <div className="relative overflow-hidden bg-da-bg font-daBody text-da-cream">
      {config.backdrop}

      {/* Hero */}
      <div className="relative px-5 pb-10 pt-32 md:pt-40">
        <div className="relative mx-auto max-w-wide">
          <Link href="/" className="text-sm text-da-cream/60 hover:text-da-cream">
            ← Back to Darul Arqum
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: config.accentHex }}>
            {config.eyebrow}
          </p>
          <h1 className="mt-3 font-daDisplay text-[clamp(32px,4.4vw,52px)] font-medium tracking-tight text-da-cream">
            {config.title}
          </h1>
        </div>
        <Reveal className="relative mx-auto mt-10 max-w-wide">{config.hero}</Reveal>
      </div>

      {/* Schedule / tuition + curriculum */}
      <div className="relative mx-auto max-w-wide px-5">
        <Reveal className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-6" style={{ borderColor: `${config.accentHex}55`, background: `${config.accentHex}14` }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.accentHex }}>
              {config.schedule.label}
            </p>
            <p className="mt-1 text-sm text-da-cream/70">{config.schedule.sub}</p>
          </div>
          <div className="rounded-2xl border p-6" style={{ borderColor: `${config.accentHex}55`, background: `${config.accentHex}14` }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.accentHex }}>
              {config.tuition.label}
            </p>
            <p className="mt-1 text-sm text-da-cream/70">{config.tuition.sub}</p>
          </div>
        </Reveal>

        {config.curriculum && (
          <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-da-cream/10 bg-da-cream/[0.03] p-6">
            {config.curriculum.map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-full px-3 py-1.5 text-xs font-medium" style={{ background: `${config.accentHex}22`, color: config.accentHex }}>
                  {step}
                </span>
                {i < config.curriculum!.length - 1 && <span className="text-da-cream/30">→</span>}
              </React.Fragment>
            ))}
          </Reveal>
        )}
        {config.extraAbout && (
          <Reveal delay={0.05} className="mt-6 rounded-2xl border border-da-cream/10 bg-da-cream/[0.03] p-6">
            <p className="text-sm leading-relaxed text-da-cream/70">{config.extraAbout}</p>
          </Reveal>
        )}
      </div>

      {/* Form */}
      <div className="relative mx-auto max-w-3xl px-5 py-16 md:py-20">
        <Reveal>
          <div className="rounded-[20px] border border-da-cream/[0.12] bg-da-cream/[0.035] p-2 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)]">
            <div className="rounded-2xl p-6 md:p-9">
              <p className="mb-7 text-xs leading-relaxed text-da-cream/50">
                Submitting this form starts registration. Our team will follow up by email or phone to confirm
                placement and fees.
              </p>

              {state === "done" ? (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-da-mint/25 bg-da-mint/[0.07] p-8">
                  <CheckCircle2 className="h-6 w-6 text-da-mint" aria-hidden />
                  <p className="mt-3 font-medium text-da-cream">{delivered ? "Registration sent" : "Registration recorded"}</p>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-da-cream/60">
                    {delivered
                      ? "The Darul Arqum team has received the registration and will follow up."
                      : "To make sure it reaches the team right away, you can also send it directly from your email app — everything is prefilled."}
                  </p>
                  {!delivered && (
                    <a href={mailto} className="mt-5 inline-flex items-center gap-2 rounded-full bg-da-gold px-5 py-3 text-sm font-medium text-da-bg">
                      <Mail className="h-4 w-4" aria-hidden />
                      Send via your email app
                    </a>
                  )}
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-7">
                  <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  <div className="rounded-2xl p-6" style={{ background: `${config.accentHex}0f`, border: `1px solid ${config.accentHex}33` }}>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: config.accentHex }}>
                      Student
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="sm:col-span-2">
                        <span className={labelCls}>{config.studentLabel}</span>
                        <input required name="studentName" className={inputCls} />
                      </label>
                      <label>
                        <span className={labelCls}>Age</span>
                        <input
                          required={config.ageRequired}
                          type="number"
                          name="age"
                          min={config.ageMin}
                          max={config.ageMax}
                          placeholder={config.agePlaceholder}
                          className={inputCls}
                        />
                      </label>
                      <label>
                        <span className={labelCls}>Gender</span>
                        <GenderSelect accent={config.accentHex} />
                      </label>
                      {config.medical && (
                        <label className="sm:col-span-2">
                          <span className={labelCls}>Student health card number</span>
                          <input name="healthCard" className={`${inputCls} text-center`} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-da-mint/20 bg-da-mint/[0.05] p-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-da-mint">Parent / guardian</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="sm:col-span-2">
                        <span className={labelCls}>{config.parentLabel}</span>
                        <input name="parentName" className={inputCls} />
                      </label>
                      <label>
                        <span className={labelCls}>Parent email</span>
                        <input required type="email" name="parentEmail" placeholder="you@example.com" className={inputCls} />
                      </label>
                      <label>
                        <span className={labelCls}>Emergency contact number</span>
                        <input
                          required
                          type="tel"
                          name="emergencyContact"
                          pattern="[0-9+()\-\s]{7,15}"
                          placeholder="(613) 555-0123"
                          className={inputCls}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-da-blue/20 bg-da-blue/[0.05] p-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-da-blue">Background</p>
                    <label>
                      <span className={labelCls}>{config.backgroundField.label}</span>
                      <textarea name="background" rows={3} placeholder={config.backgroundField.placeholder} className={inputCls} />
                    </label>
                  </div>

                  {config.medical && (
                    <div className="rounded-2xl border border-da-orange/25 bg-da-orange/[0.06] p-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-da-orange">
                        Student medical condition(s) (if any)
                      </p>
                      <p className="mb-4 text-xs leading-relaxed text-da-cream/60">
                        It is very important that we are made aware of any medical conditions your child may have,
                        and what needs to be done in the event of an emergency other than a call to 911 (please
                        include any allergies and first aid remedies as known). We regret that we are unable to
                        accommodate any special needs at this time.
                      </p>
                      <label>
                        <span className={labelCls}>Medical conditions, allergies &amp; emergency care instructions (if any)</span>
                        <textarea
                          name="medical"
                          rows={3}
                          placeholder="e.g. peanut allergy – carries EpiPen; asthma – inhaler in backpack; none"
                          className={inputCls}
                        />
                      </label>
                    </div>
                  )}

                  {state === "error" && (
                    <p className="flex items-center gap-2 text-sm text-[#e08a8a]">
                      <TriangleAlert className="h-4 w-4" aria-hidden />
                      Something needs attention — check the fields and try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={state === "busy"}
                    className="inline-flex items-center gap-2 rounded-full px-8 py-[17px] text-[15.5px] font-extrabold disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${config.buttonAccentHex ?? config.accentHex}, ${config.buttonAccentHex ?? config.accentHex}cc)`,
                      color: config.buttonTextColor ?? "#2e1a0d",
                    }}
                  >
                    {state === "busy" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                    {state === "busy" ? "Sending…" : "Submit registration →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
