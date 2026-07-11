"use client";

/**
 * Faithful port of `Kids Registration.dc.html` — a dedicated, literal
 * implementation (not the shared program/registration abstraction) so this
 * page matches the design source exactly: same colors, spacing, copy,
 * decorative elements. Only the submit mechanism is real (the source's
 * static mailto: link can't actually carry the entered field data), wired
 * to the site's shared submitForm() action instead.
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
};

function GenderSelect() {
  const chevron =
    "url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22 viewBox=%220 0 10 6%22%3E%3Cpath d=%22M1 1l4 4 4-4%22 stroke=%22%23a9e0c0%22 stroke-width=%221.6%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')";
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

const LETTERS: { top: number; side: "left" | "right"; pos: string; size: number; color: string; delay: number; ch: string }[] = [
  { top: 360, side: "left", pos: "6%", size: 46, color: "rgba(124,201,154,0.16)", delay: 0, ch: "ا" },
  { top: 520, side: "right", pos: "8%", size: 36, color: "rgba(201,162,39,0.16)", delay: 0.6, ch: "ب" },
  { top: 900, side: "left", pos: "9%", size: 40, color: "rgba(124,201,154,0.15)", delay: 1.1, ch: "ت" },
  { top: 1220, side: "right", pos: "10%", size: 34, color: "rgba(201,162,39,0.15)", delay: 0.4, ch: "ث" },
  { top: 1500, side: "left", pos: "7%", size: 38, color: "rgba(124,201,154,0.14)", delay: 0.8, ch: "ج" },
];

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

export function KidsRegister() {
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
    const res = await submitForm("kids-arabic", data);
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
  const mailto = `mailto:${ORG.email}?subject=${encodeURIComponent("KidsLearnArabic registration")}&body=${mailtoBody}`;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      {/* ambient background */}
      <div
        className="da-drift-gold pointer-events-none fixed z-0 rounded-full blur-[8px]"
        style={{ width: 460, height: 460, top: "-12%", right: "-10%", background: "radial-gradient(circle, rgba(124,201,154,0.18), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="da-drift-green pointer-events-none fixed z-0 rounded-full blur-[8px]"
        style={{ width: 400, height: 400, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.18), transparent 72%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{ backgroundImage: "radial-gradient(rgba(246,243,234,0.05) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        aria-hidden
      />
      {[
        { top: 40, side: "right" as const, pos: -70, size: 240, opacity: 0.4, twinkle: false },
        { top: 640, side: "left" as const, pos: -90, size: 200, opacity: 0.35, twinkle: true },
        { top: 1020, side: "right" as const, pos: -80, size: 220, opacity: 0.32, twinkle: false },
      ].map((sq, i) => (
        <div
          key={i}
          className={`pointer-events-none absolute z-0 ${sq.twinkle ? "da-twinkle" : ""}`}
          style={{ top: sq.top, [sq.side]: sq.pos, width: sq.size, height: sq.size, opacity: sq.opacity } as React.CSSProperties}
          aria-hidden
        >
          <div className="absolute inset-0" style={{ border: "1.5px solid rgba(124,201,154,0.2)" }} />
          <div className="absolute inset-0 rotate-45" style={{ border: "1.5px solid rgba(124,201,154,0.2)" }} />
        </div>
      ))}

      {LETTERS.map((l, i) => (
        <div
          key={i}
          dir="rtl"
          lang="ar"
          aria-hidden
          className="da-float-slow pointer-events-none absolute z-0 font-arabic"
          style={{ top: l.top, [l.side]: l.pos, fontSize: l.size, color: l.color, animationDelay: `${l.delay}s` } as React.CSSProperties}
        >
          {l.ch}
        </div>
      ))}

      {[
        { top: 300, side: "right" as const, pos: "16%", size: 10, color: "#e35c5c", opacity: 0.45 },
        { top: 760, side: "left" as const, pos: "14%", size: 8, color: "#5cb8e3", opacity: 0.4 },
        { top: 1360, side: "right" as const, pos: "20%", size: 9, color: "#e3c25c", opacity: 0.4 },
      ].map((d, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full"
          style={{ top: d.top, [d.side]: d.pos, width: d.size, height: d.size, background: d.color, opacity: d.opacity } as React.CSSProperties}
        />
      ))}

      {LANTERNS.map((l, i) => (
        <Lantern key={i} l={l} />
      ))}

      {/* chalkboard hero */}
      <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden", background: "linear-gradient(180deg, #4a3320, #2e2013)", padding: 14 }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 6,
            background: "radial-gradient(ellipse 120% 100% at 30% 20%, #24382c, #16241c 70%)",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="absolute inset-0 rounded-[6px] opacity-50"
            style={{ backgroundImage: "radial-gradient(rgba(246,243,234,0.06) 1px, transparent 1px)", backgroundSize: "5px 5px" }}
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 10, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.35))" }}
            aria-hidden
          />

          <Link
            href="/"
            style={{ position: "absolute", top: 14, left: 18, zIndex: 3, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(246,243,234,0.75)", fontWeight: 500 }}
          >
            ← Back to Darul Arqum
          </Link>

          <div
            aria-hidden
            className="da-twinkle absolute"
            style={{ top: 36, right: 52, fontSize: 22, color: "rgba(246,243,234,0.55)", fontFamily: "'Amiri',serif", transform: "rotate(-8deg)" }}
          >
            ✦
          </div>
          <div
            aria-hidden
            className="absolute"
            style={{ bottom: 44, left: 60, fontSize: 16, color: "rgba(246,243,234,0.4)", fontFamily: "'Amiri',serif", transform: "rotate(10deg)" }}
          >
            ✦
          </div>

          <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: "'Amiri',serif",
                fontWeight: 700,
                fontSize: "clamp(48px,8vw,72px)",
                color: "rgba(246,243,234,0.92)",
                textShadow: "0 0 1px rgba(246,243,234,0.5), 0 0 14px rgba(246,243,234,0.12)",
                letterSpacing: "0.01em",
              }}
            >
              العربية
            </div>
            <svg width="220" height="14" viewBox="0 0 220 14" style={{ opacity: 0.55 }} aria-hidden>
              <path d="M4 8 Q 60 2, 110 7 T 216 6" stroke="#f6f3ea" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 12.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(246,243,234,0.5)", fontWeight: 600 }}>
              Arabic, for children
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", padding: "32px 24px 64px" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}
        >
          <span style={{ width: 22, height: 1, background: "rgba(124,201,154,0.6)" }} />
          <span style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Ages 5–10</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(32px,5vw,42px)", lineHeight: 1.1, color: "#f6f3ea", margin: "0 0 20px 0" }}
        >
          Register for KidsLearnArabic
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}
        >
          <div style={{ padding: "18px 20px", borderRadius: 16, background: "linear-gradient(135deg, rgba(124,201,154,0.16), rgba(124,201,154,0.04))", border: "1px solid rgba(124,201,154,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="da-float-slow" style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 999, background: "rgba(124,201,154,0.2)", border: "1px solid rgba(124,201,154,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a9e0c0", fontSize: 14 }}>
                ◷
              </div>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Age group</span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 21, color: "#f6f3ea", marginBottom: 4 }}>Ages 5–10</div>
            <div style={{ fontSize: 13, color: "rgba(246,243,234,0.7)" }}>On site at Darul Arqum</div>
          </div>
          <div style={{ padding: "18px 20px", borderRadius: 16, background: "linear-gradient(135deg, rgba(80,160,120,0.18), rgba(80,160,120,0.04))", border: "1px solid rgba(120,190,150,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="da-float-slow" style={{ animationDelay: "0.3s", width: 30, height: 30, flexShrink: 0, borderRadius: 999, background: "rgba(80,160,120,0.22)", border: "1px solid rgba(120,190,150,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a9e0c0", fontSize: 14 }}>
                $
              </div>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Tuition</span>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 19, color: "#f6f3ea", marginBottom: 4 }}>Contact us for tuition</div>
            <div style={{ fontSize: 13, color: "rgba(246,243,234,0.7)" }}>Our team will confirm fees when you register</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.14 }}
          style={{ padding: "20px 22px", borderRadius: 16, background: "linear-gradient(135deg, rgba(124,201,154,0.12), rgba(124,201,154,0.03))", border: "1px solid rgba(124,201,154,0.28)", marginBottom: 16 }}
        >
          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700, marginBottom: 14 }}>How your child learns</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <div style={{ position: "absolute", top: 8, left: 8, right: 8, height: 1.5, background: "rgba(124,201,154,0.3)" }} />
            {["Letters", "Sounds", "Vocabulary", "Confidence"].map((label) => (
              <div key={label} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ width: 16, height: 16, borderRadius: 999, background: "#7cc99a", border: "2px solid #0e2419" }} />
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
          <span style={{ color: "#a9e0c0", fontSize: 13, marginTop: 1 }}>✦</span>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: 0 }}>
            Submitting this form starts registration. Our team will follow up by email or phone to confirm placement and fees.
          </p>
        </motion.div>

        {state === "done" ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderRadius: 20, border: "1px solid rgba(124,201,154,0.25)", background: "rgba(124,201,154,0.07)", padding: 32 }}
          >
            <CheckCircle2 className="h-6 w-6" style={{ color: "#a9e0c0" }} aria-hidden />
            <p style={{ marginTop: 12, fontWeight: 500, color: "#f6f3ea" }}>
              {delivered ? "Registration sent" : "Registration recorded"}
            </p>
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
            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(124,201,154,0.1), rgba(124,201,154,0.03))", border: "1px solid rgba(124,201,154,0.2)", padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="da-float-slow" style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(124,201,154,0.2)", border: "1px solid rgba(124,201,154,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 13, height: 13 }}>
                    <div style={{ position: "absolute", top: 0, left: 3.5, width: 6, height: 6, borderRadius: 999, background: "#a9e0c0" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, width: 13, height: 6.5, borderRadius: "6px 6px 0 0", background: "#a9e0c0" }} />
                  </div>
                </div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Student</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                  <span style={labelStyle}>Child&apos;s full name</span>
                  <input name="studentName" required style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Age</span>
                  <input name="age" type="number" min={5} max={10} required placeholder="5–10" style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Gender</span>
                  <GenderSelect />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                  <span style={labelStyle}>Student health card number</span>
                  <input name="healthCard" style={inputStyle} />
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
                  <span style={labelStyle}>Parent / guardian name</span>
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

            {/* Medical condition */}
            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(217,143,74,0.1), rgba(217,143,74,0.03))", border: "1px solid rgba(217,143,74,0.22)", padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(217,143,74,0.2)", border: "1px solid rgba(217,143,74,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#e8b06a", fontSize: 14, fontWeight: 700 }}>+</span>
                </div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e8b06a", fontWeight: 700 }}>Student medical condition (if any)</span>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "rgba(246,243,234,0.65)", margin: "0 0 16px 0" }}>
                It is very important that we are made aware of any medical conditions your child may have, and what needs to
                be done in the event of an emergency other than a call to 911 (please include any allergies and first aid
                remedies as known). We regret that we are unable to accommodate any special needs at this time.
              </p>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={labelStyle}>Medical conditions, allergies &amp; emergency care instructions (if any)</span>
                <textarea
                  name="medical"
                  rows={3}
                  placeholder="e.g. peanut allergy – carries EpiPen; asthma – inhaler in backpack; none"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>
            </div>

            {/* Learning background */}
            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(143,180,201,0.1), rgba(143,180,201,0.03))", border: "1px solid rgba(143,180,201,0.22)", padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="da-float-slow" style={{ animationDelay: "0.6s", width: 28, height: 28, borderRadius: 999, background: "rgba(143,180,201,0.2)", border: "1px solid rgba(143,180,201,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 14, height: 11 }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: 11, background: "#8fb4c9", borderRadius: "2px 0 0 2px" }} />
                    <div style={{ position: "absolute", top: 0, right: 0, width: 6, height: 11, background: "#8fb4c9", borderRadius: "0 2px 2px 0", opacity: 0.7 }} />
                    <div style={{ position: "absolute", top: 0, left: 6.5, width: 1, height: 11, background: "#0e2419" }} />
                  </div>
                </div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8fb4c9", fontWeight: 700 }}>Learning background</span>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={labelStyle}>Has your child attended Arabic or Quran classes before? (optional)</span>
                <textarea
                  name="background"
                  rows={3}
                  placeholder="e.g. knows some letters, attended a class before, complete beginner..."
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
                background: "linear-gradient(135deg,#a9e0c0,#7cc99a)",
                color: "#0e2419",
                fontWeight: 800,
                fontSize: 15.5,
                padding: "17px 0",
                borderRadius: 999,
                margin: "6px 8px 8px",
                boxShadow: "0 12px 28px -8px rgba(124,201,154,0.5)",
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
              <p style={{ textAlign: "center", fontSize: 13, color: "#e08a8a", margin: 0 }}>
                Something needs attention — check the fields and try again.
              </p>
            )}
          </motion.form>
        )}
      </div>
    </div>
  );
}
