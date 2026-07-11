"use client";

/**
 * Faithful, dedicated port of `Aalim Registration.dc.html` (not the shared
 * program/registration abstraction). Only the submit mechanism is real (the
 * source's static mailto: link can't carry entered field data), wired to the
 * site's shared submitForm() action instead.
 */

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { submitForm } from "@/app/actions/submit";
import { ORG } from "@/lib/links";
import { isValidEmail, isValidPhone } from "@/lib/validate";

const errorStyle: React.CSSProperties = { marginTop: 5, fontSize: 12, color: "#e08a8a" };

const inputStyle: React.CSSProperties = {
  background: "rgba(246,243,234,0.06)",
  border: "1px solid rgba(246,243,234,0.2)",
  borderRadius: 8,
  padding: "11px 13px",
  color: "#f6f3ea",
  fontSize: 14,
  fontFamily: "inherit",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11.5,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "rgba(246,243,234,0.55)",
  minHeight: "2.6em",
  display: "block",
};

function GenderSelect() {
  const chevron =
    "url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22 viewBox=%220 0 10 6%22%3E%3Cpath d=%22M1 1l4 4 4-4%22 stroke=%22%23e3c56a%22 stroke-width=%221.6%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')";
  return (
    <select
      name="gender"
      required
      defaultValue=""
      style={{
        ...inputStyle,
        appearance: "none",
        WebkitAppearance: "none",
        background: `rgba(246,243,234,0.06) ${chevron} no-repeat right 14px center`,
        padding: "11px 34px 11px 13px",
        cursor: "pointer",
      }}
    >
      <option value="" disabled style={{ background: "#0e2419", color: "rgba(246,243,234,0.55)" }}>
        Select…
      </option>
      <option value="Male" style={{ background: "#0e2419", color: "#f6f3ea" }}>
        Male
      </option>
      <option value="Female" style={{ background: "#0e2419", color: "#f6f3ea" }}>
        Female
      </option>
    </select>
  );
}

const LANTERNS = [
  { top: 420, side: "left" as const, pos: "calc(50% - 380px)", stringH: 60, bodyW: 24, bodyH: 34, delay: 0.3, sway: 4.2 },
  { top: 1180, side: "right" as const, pos: "calc(50% - 380px)", stringH: 80, bodyW: 26, bodyH: 36, delay: 0.7, sway: 4.8 },
];

function Lantern({ l }: { l: (typeof LANTERNS)[number] }) {
  return (
    <div className="pointer-events-none absolute z-0" style={{ top: l.top, [l.side]: l.pos } as React.CSSProperties} aria-hidden>
      <div
        className="flex flex-col items-center"
        style={{ animation: `da-lantern-sway ${l.sway}s ease-in-out infinite`, animationDelay: `${l.delay}s`, transformOrigin: "top center" }}
      >
        <div style={{ width: 1.5, height: l.stringH, background: "rgba(201,162,39,0.35)" }} />
        <div
          className="da-lantern-glow absolute rounded-full blur-[11px]"
          style={{ top: l.stringH - 8, width: l.bodyW + 14, height: l.bodyW + 14, background: "rgba(227,197,106,0.4)" }}
        />
        <div className="relative" style={{ width: l.bodyW, height: l.bodyH }}>
          <div style={{ position: "absolute", top: 0, left: l.bodyW * 0.2, width: l.bodyW * 0.58, height: 5, background: "#c9a227", borderRadius: "3px 3px 0 0" }} />
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 0.5,
              width: l.bodyW - 1,
              height: l.bodyH - 12,
              borderRadius: 6,
              background: "linear-gradient(160deg, #e3c56a, #c9a227)",
              boxShadow: "0 0 12px 2px rgba(227,197,106,0.4)",
            }}
          />
          <div style={{ position: "absolute", top: 8, left: l.bodyW * 0.31, width: l.bodyW * 0.33, height: l.bodyH - 20, background: "#fff3c4", borderRadius: 3, opacity: 0.85 }} />
          <div style={{ position: "absolute", bottom: 0, left: l.bodyW * 0.37, width: l.bodyW * 0.25, height: 4, background: "#8a6a1e", borderRadius: "0 0 3px 3px" }} />
        </div>
      </div>
    </div>
  );
}

const CURRICULUM = ["Sarf & Nahw", "Quran", "Hadith", "Fiqh", "Aqa'id"];

export function AalimRegister() {
  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const [delivered, setDelivered] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [emailError, setEmailError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));

    const emailOk = isValidEmail(data.parentEmail ?? "");
    const phoneOk = isValidPhone(data.emergencyContact ?? "");
    setEmailError(emailOk ? "" : "Enter a valid email address.");
    setPhoneError(phoneOk ? "" : "Enter a valid phone number.");
    if (!emailOk || !phoneOk) return;

    setState("busy");
    setValues(data);
    const res = await submitForm("aalim", data);
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
  const mailto = `mailto:${ORG.email}?subject=${encodeURIComponent("Aalim program registration")}&body=${mailtoBody}`;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      {/* ambient background */}
      <div
        className="da-drift-gold pointer-events-none fixed z-0 rounded-full blur-[8px]"
        style={{ width: 460, height: 460, top: "-12%", right: "-10%", background: "radial-gradient(circle, rgba(201,162,39,0.16), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="da-drift-green pointer-events-none fixed z-0 rounded-full blur-[8px]"
        style={{ width: 400, height: 400, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.18), transparent 72%)" }}
        aria-hidden
      />
      {/* scholarly crosshatch grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: 0.3,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(201,162,39,0.07) 0 1px, transparent 1px 16px), repeating-linear-gradient(-45deg, rgba(201,162,39,0.07) 0 1px, transparent 1px 16px)",
        }}
        aria-hidden
      />

      {[
        { top: 40, side: "right" as const, pos: -70, size: 240, opacity: 0.4, twinkle: false, color: "rgba(201,162,39,0.18)" },
        { top: 640, side: "left" as const, pos: -90, size: 200, opacity: 0.35, twinkle: true, color: "rgba(120,190,150,0.18)" },
        { top: 1060, side: "right" as const, pos: -80, size: 220, opacity: 0.3, twinkle: false, color: "rgba(201,162,39,0.18)" },
      ].map((sq, i) => (
        <div
          key={i}
          className={`pointer-events-none absolute z-0 ${sq.twinkle ? "da-twinkle" : ""}`}
          style={{ top: sq.top, [sq.side]: sq.pos, width: sq.size, height: sq.size, opacity: sq.opacity } as React.CSSProperties}
          aria-hidden
        >
          <div className="absolute inset-0" style={{ border: `1.5px solid ${sq.color}` }} />
          <div className="absolute inset-0 rotate-45" style={{ border: `1.5px solid ${sq.color}` }} />
        </div>
      ))}

      {/* large faint scholarly medallion, centered behind the form */}
      <div style={{ position: "absolute", top: 920, left: "50%", transform: "translate(-50%,-50%)", width: 420, height: 420, opacity: 0.06, zIndex: 0, pointerEvents: "none" }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, border: "2px solid #e3c56a", borderRadius: 999 }} />
        <div style={{ position: "absolute", inset: 56, border: "2px solid #e3c56a" }} />
        <div style={{ position: "absolute", inset: 56, border: "2px solid #e3c56a", transform: "rotate(45deg)" }} />
      </div>

      {/* floating quill accents */}
      <div className="da-float-slow pointer-events-none absolute z-0" style={{ top: 360, left: "8%", opacity: 0.28, animationDuration: "5.2s" }} aria-hidden>
        <div style={{ width: 3, height: 56, background: "linear-gradient(180deg, #e3c56a, #c9a227)", borderRadius: 2, transform: "rotate(24deg)" }} />
      </div>
      <div className="da-float-slow pointer-events-none absolute z-0" style={{ top: 1320, right: "10%", opacity: 0.24, animationDuration: "4.8s", animationDelay: "0.4s" }} aria-hidden>
        <div style={{ width: 3, height: 48, background: "linear-gradient(180deg, #e3c56a, #c9a227)", borderRadius: 2, transform: "rotate(-20deg)" }} />
      </div>

      {LANTERNS.map((l, i) => (
        <Lantern key={i} l={l} />
      ))}

      {/* HERO PHOTO BAND */}
      <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/program-aalim.jpg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "saturate(0.8) brightness(0.75)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,20,15,0.55) 0%, rgba(9,20,15,0.75) 55%, #0e2419 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "24px 24px 0" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "rgba(246,243,234,0.8)", fontWeight: 500 }}>
            ← Back to Darul Arqum
          </Link>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "-108px auto 0", padding: "0 24px 64px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ width: 22, height: 1, background: "rgba(201,162,39,0.6)" }} />
          <span style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700 }}>Al-Arif Islamic Institute · flagship</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(32px,5vw,42px)", lineHeight: 1.1, color: "#f6f3ea", margin: "0 0 20px 0" }}
        >
          Register for the Aalim program
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}
        >
          <div style={{ padding: "18px 20px", borderRadius: 16, background: "linear-gradient(135deg, rgba(201,162,39,0.16), rgba(201,162,39,0.04))", border: "1px solid rgba(201,162,39,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="da-float-slow" style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 999, background: "rgba(201,162,39,0.2)", border: "1px solid rgba(201,162,39,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e3c56a", fontSize: 14 }}>
                ◷
              </div>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700 }}>Schedule</span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 21, color: "#f6f3ea", marginBottom: 4 }}>Monday–Friday</div>
            <div style={{ fontSize: 13, color: "rgba(246,243,234,0.7)" }}>Full-time, on site at Darul Arqum</div>
          </div>
          <div style={{ padding: "18px 20px", borderRadius: 16, background: "linear-gradient(135deg, rgba(80,160,120,0.18), rgba(80,160,120,0.04))", border: "1px solid rgba(120,190,150,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="da-float-slow" style={{ animationDelay: "0.3s", width: 30, height: 30, flexShrink: 0, borderRadius: 999, background: "rgba(80,160,120,0.22)", border: "1px solid rgba(120,190,150,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a9e0c0", fontSize: 14 }}>
                $
              </div>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Tuition</span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 21, color: "#f6f3ea", marginBottom: 4 }}>$150 / month</div>
            <div style={{ fontSize: 13, color: "rgba(246,243,234,0.7)" }}>Monthly tuition, due at the start of each month</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.14 }}
          style={{ padding: "20px 22px", borderRadius: 16, background: "linear-gradient(135deg, rgba(201,162,39,0.12), rgba(201,162,39,0.03))", border: "1px solid rgba(201,162,39,0.28)", marginBottom: 16 }}
        >
          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700, marginBottom: 14 }}>The curriculum</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <div style={{ position: "absolute", top: 8, left: 8, right: 8, height: 1.5, background: "rgba(201,162,39,0.3)" }} />
            {CURRICULUM.map((label) => (
              <div key={label} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ width: 16, height: 16, borderRadius: 999, background: "#c9a227", border: "2px solid #0e2419" }} />
                <span style={{ fontSize: 11, color: "#f6f3ea", fontWeight: 600, textAlign: "center" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 18px", borderRadius: 12, background: "rgba(246,243,234,0.04)", border: "1px solid rgba(246,243,234,0.1)", marginBottom: 36 }}
        >
          <span style={{ color: "#c9a227", fontSize: 13, marginTop: 1 }}>✦</span>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: 0 }}>
            Submitting this form starts registration. Our team will follow up by email or phone to confirm placement and fees.
          </p>
        </motion.div>

        {state === "done" ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderRadius: 20, border: "1px solid rgba(201,162,39,0.25)", background: "rgba(201,162,39,0.07)", padding: 32 }}
          >
            <CheckCircle2 className="h-6 w-6" style={{ color: "#e3c56a" }} aria-hidden />
            <p style={{ marginTop: 12, fontWeight: 500, color: "#f6f3ea" }}>{delivered ? "Registration sent" : "Registration recorded"}</p>
            <p style={{ marginTop: 6, maxWidth: 420, fontSize: 14, lineHeight: 1.6, color: "rgba(246,243,234,0.6)" }}>
              {delivered
                ? "The Darul Arqum team has received the registration and will follow up."
                : "To make sure it reaches the team right away, you can also send it directly from your email app — everything is prefilled."}
            </p>
            {!delivered && (
              <a
                href={mailto}
                style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "#c9a227", padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "#0e2419" }}
              >
                <Mail className="h-4 w-4" aria-hidden />
                Send via your email app
              </a>
            )}
          </motion.div>
        ) : (
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "rgba(246,243,234,0.035)",
              border: "1px solid rgba(246,243,234,0.12)",
              borderRadius: 20,
              padding: 8,
              boxShadow: "0 30px 70px -30px rgba(0,0,0,0.5)",
            }}
          >
            <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

            {/* Student */}
            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(201,162,39,0.1), rgba(201,162,39,0.03))", border: "1px solid rgba(201,162,39,0.2)", padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="da-float-slow" style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(201,162,39,0.2)", border: "1px solid rgba(201,162,39,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 13, height: 13 }}>
                    <div style={{ position: "absolute", top: 0, left: 3.5, width: 6, height: 6, borderRadius: 999, background: "#e3c56a" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, width: 13, height: 6.5, borderRadius: "6px 6px 0 0", background: "#e3c56a" }} />
                  </div>
                </div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700 }}>Student</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                  <span style={labelStyle}>Student&apos;s full name</span>
                  <input name="studentName" required style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Age</span>
                  <input name="age" type="number" min={13} max={60} placeholder="e.g. 17" style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Gender</span>
                  <GenderSelect />
                </label>
              </div>
            </div>

            {/* Parent / guardian & contact */}
            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(80,160,120,0.1), rgba(80,160,120,0.03))", border: "1px solid rgba(120,190,150,0.22)", padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="da-float-slow" style={{ animationDelay: "0.3s", width: 28, height: 28, borderRadius: 999, background: "rgba(80,160,120,0.2)", border: "1px solid rgba(120,190,150,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 17, height: 12 }}>
                    <div style={{ position: "absolute", top: 0, left: 0.5, width: 5, height: 5, borderRadius: 999, background: "#a9e0c0" }} />
                    <div style={{ position: "absolute", top: 0, right: 0.5, width: 5, height: 5, borderRadius: 999, background: "#a9e0c0" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, width: 6.5, height: 6, borderRadius: "5px 5px 0 0", background: "#a9e0c0" }} />
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 6.5, height: 6, borderRadius: "5px 5px 0 0", background: "#a9e0c0" }} />
                  </div>
                </div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Parent / guardian &amp; contact</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Parent / guardian name (if applicable)</span>
                  <input name="parentName" style={inputStyle} />
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={labelStyle}>Email</span>
                    <input
                      name="parentEmail"
                      type="email"
                      required
                      placeholder="you@example.com"
                      style={inputStyle}
                      onBlur={(e) => setEmailError(isValidEmail(e.currentTarget.value) ? "" : "Enter a valid email address.")}
                      onChange={() => emailError && setEmailError("")}
                    />
                    {emailError && <span style={errorStyle}>{emailError}</span>}
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={labelStyle}>Emergency contact number</span>
                    <input
                      name="emergencyContact"
                      type="tel"
                      required
                      pattern="[0-9+()\-\s]{7,15}"
                      placeholder="(613) 555-0123"
                      style={inputStyle}
                      onBlur={(e) => setPhoneError(isValidPhone(e.currentTarget.value) ? "" : "Enter a valid phone number.")}
                      onChange={() => phoneError && setPhoneError("")}
                    />
                    {phoneError && <span style={errorStyle}>{phoneError}</span>}
                  </label>
                </div>
              </div>
            </div>

            {/* Academic background */}
            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(143,180,201,0.1), rgba(143,180,201,0.03))", border: "1px solid rgba(143,180,201,0.22)", padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="da-float-slow" style={{ animationDelay: "0.6s", width: 28, height: 28, borderRadius: 999, background: "rgba(143,180,201,0.2)", border: "1px solid rgba(143,180,201,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 14, height: 11 }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: 11, background: "#8fb4c9", borderRadius: "2px 0 0 2px" }} />
                    <div style={{ position: "absolute", top: 0, right: 0, width: 6, height: 11, background: "#8fb4c9", borderRadius: "0 2px 2px 0", opacity: 0.7 }} />
                    <div style={{ position: "absolute", top: 0, left: 6.5, width: 1, height: 11, background: "#0e2419" }} />
                  </div>
                </div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8fb4c9", fontWeight: 700 }}>Academic background</span>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={labelStyle}>Prior Arabic or Islamic studies background (optional)</span>
                <textarea
                  name="background"
                  rows={3}
                  placeholder="e.g. completed Hifz, studied Nazira, prior madrasa experience..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={state === "busy"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                textAlign: "center",
                background: "linear-gradient(135deg,#e3c56a,#c9a227)",
                color: "#2e1a0d",
                fontWeight: 800,
                fontSize: 15.5,
                padding: "17px 0",
                borderRadius: 999,
                margin: "6px 8px 8px",
                boxShadow: "0 12px 28px -8px rgba(201,162,39,0.5)",
                border: "none",
                cursor: state === "busy" ? "default" : "pointer",
                opacity: state === "busy" ? 0.7 : 1,
              }}
            >
              {state === "busy" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {state === "busy" ? "Sending…" : "Submit registration"}
              {state !== "busy" && <span aria-hidden="true">→</span>}
            </button>
            {state === "error" && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#e08a8a", margin: 0 }}>Something needs attention — check the fields and try again.</p>
            )}
          </motion.form>
        )}
      </div>
    </div>
  );
}
