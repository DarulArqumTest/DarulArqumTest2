"use client";

/**
 * Faithful, dedicated port of `Tax Receipt.dc.html`. Only the submit
 * mechanism is real (the source's static mailto: link can't carry entered
 * field data), wired to the shared submitForm() action instead.
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
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11.5,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "rgba(246,243,234,0.55)",
};

const dotGrid: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(246,243,234,0.05) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

export function TaxReceiptPage() {
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

    const emailOk = isValidEmail(data.email ?? "");
    const phoneOk = isValidPhone(data.Phone ?? "");
    setEmailError(emailOk ? "" : "Enter a valid email address.");
    setPhoneError(phoneOk ? "" : "Enter a valid phone number.");
    if (!emailOk || !phoneOk) return;

    setState("busy");
    setValues(data);
    const res = await submitForm("tax-receipt", data);
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
  const mailto = `mailto:${ORG.email}?subject=${encodeURIComponent("Tax Receipt Profile Update")}&body=${mailtoBody}`;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      <div className="da-drift-gold pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 460, height: 460, top: "-12%", right: "-10%", background: "radial-gradient(circle, rgba(201,162,39,0.16), transparent 70%)" }} aria-hidden />
      <div className="da-drift-green pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 400, height: 400, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.14), transparent 72%)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50" style={dotGrid} aria-hidden />
      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 340, left: "6%", fontFamily: "'Amiri',serif", fontSize: 44, color: "rgba(201,162,39,0.14)", animationDuration: "5.5s" }} aria-hidden>
        ز
      </div>
      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 900, right: "8%", fontFamily: "'Amiri',serif", fontSize: 34, color: "rgba(124,201,154,0.13)", animationDuration: "6.2s", animationDelay: "0.6s" }} aria-hidden>
        ك
      </div>

      {/* HERO: ledger / official document */}
      <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden", background: "linear-gradient(180deg, #16302280, #0e2419)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 100% at 50% 120%, rgba(201,162,39,0.22), transparent 60%)" }} />
        <Link href="/" style={{ position: "absolute", top: 20, left: 24, zIndex: 3, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(246,243,234,0.75)", fontWeight: 500 }}>
          ← Back to Darul Arqum
        </Link>
        <svg width="100%" height="100%" viewBox="0 0 900 280" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }}>
          <path d="M300 280 V170 A150 150 0 0 1 600 170 V280" fill="none" stroke="#c9a227" strokeWidth={2} />
          <path d="M270 280 V160 A180 180 0 0 1 630 160 V280" fill="none" stroke="#c9a227" strokeWidth={1} opacity={0.5} />
        </svg>
        <div className="da-twinkle pointer-events-none absolute" style={{ top: 36, left: "14%", fontSize: 15, color: "rgba(201,162,39,0.5)" }} aria-hidden>
          ✦
        </div>
        <div className="da-twinkle pointer-events-none absolute" style={{ top: 64, right: "16%", fontSize: 11, color: "rgba(124,201,154,0.45)", animationDelay: "0.6s" }} aria-hidden>
          ✦
        </div>
        <div className="pointer-events-none absolute" style={{ top: 18, right: "9%", display: "flex", flexDirection: "column", alignItems: "center", animation: "da-lantern-sway 4.6s ease-in-out infinite", animationDelay: "0.3s", transformOrigin: "top center", opacity: 0.85 }} aria-hidden>
          <div style={{ width: 1.3, height: 30, background: "rgba(201,162,39,0.4)" }} />
          <div className="da-lantern-glow absolute rounded-full blur-[8px]" style={{ top: 26, width: 26, height: 26, background: "rgba(227,197,106,0.4)" }} />
          <svg width={20} height={20} viewBox="0 0 20 20">
            <path d="M13 2 A8 8 0 1 0 13 18 A6.4 6.4 0 1 1 13 2 Z" fill="#e3c56a" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <svg width={70} height={72} viewBox="0 0 70 72">
              <rect x={6} y={4} width={58} height={64} rx={4} fill="none" stroke="#c9a227" strokeWidth={2} />
              <line x1={16} y1={20} x2={54} y2={20} stroke="#c9a227" strokeWidth={1.4} opacity={0.6} />
              <line x1={16} y1={30} x2={54} y2={30} stroke="#c9a227" strokeWidth={1.4} opacity={0.6} />
              <line x1={16} y1={40} x2={40} y2={40} stroke="#c9a227" strokeWidth={1.4} opacity={0.6} />
              <path d="M18 55 L28 63 L52 42" fill="none" stroke="#7cc99a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ position: "absolute", top: -14, right: -26, width: 46, height: 46, borderRadius: 999, background: "#16302a", border: "2px solid #e35c5c", boxShadow: "0 4px 14px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", animation: "stampIn 0.8s ease 0.3s both", color: "#f0a3a3", fontSize: 7, fontWeight: 800, letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.25 }}>
              CRA
              <br />
              APPROVED
            </div>
          </div>
          <div style={{ fontSize: 12.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700 }}>Update your donor profile</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(30px,5vw,42px)", color: "#f6f3ea", margin: 0, textAlign: "center" }}>Tax Receipt Information</h1>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", padding: "36px 24px 64px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", borderRadius: 14, background: "linear-gradient(120deg, rgba(201,162,39,0.12), rgba(201,162,39,0.03))", border: "1px solid rgba(201,162,39,0.3)", marginBottom: 24 }}>
          <span style={{ color: "#c9a227", fontSize: 16, marginTop: 1 }}>ⓘ</span>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(246,243,234,0.78)", margin: 0 }}>
            Darul Arqum is a CRA registered charitable organization <strong style={{ color: "#f6f3ea" }}>(Charitable Reg. #{ORG.charityReg})</strong>. Tax receipts are issued at the end of February each year for donations received the prior year — but only to donors with a complete, valid mailing address (a P.O. Box is not accepted by CRA). If you&apos;ve moved, or didn&apos;t receive a receipt, update your details below.
          </p>
        </div>

        {state === "done" ? (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ borderRadius: 20, border: "1px solid rgba(201,162,39,0.25)", background: "rgba(201,162,39,0.07)", padding: 32 }}>
            <CheckCircle2 className="h-6 w-6" style={{ color: "#e3c56a" }} aria-hidden />
            <p style={{ marginTop: 12, fontWeight: 500, color: "#f6f3ea" }}>{delivered ? "Details sent" : "Details recorded"}</p>
            <p style={{ marginTop: 6, maxWidth: 420, fontSize: 14, lineHeight: 1.6, color: "rgba(246,243,234,0.6)" }}>
              {delivered ? "The Darul Arqum team has received your updated donor details." : "To make sure it reaches the team right away, you can also send it directly from your email app — everything is prefilled."}
            </p>
            {!delivered && (
              <a href={mailto} style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "#c9a227", padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "#0e2419" }}>
                <Mail className="h-4 w-4" aria-hidden />
                Send via your email app
              </a>
            )}
          </motion.div>
        ) : (
          <form
            onSubmit={onSubmit}
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

            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(201,162,39,0.1), rgba(201,162,39,0.03))", border: "1px solid rgba(201,162,39,0.22)", padding: 22 }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 16 }}>Donor details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Full legal name</span>
                  <input name="Full legal name" required style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                    onBlur={(e) => setEmailError(isValidEmail(e.currentTarget.value) ? "" : "Enter a valid email address.")}
                    onChange={() => emailError && setEmailError("")}
                  />
                  {emailError && <span style={errorStyle}>{emailError}</span>}
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                  <span style={labelStyle}>Phone number</span>
                  <input
                    name="Phone"
                    type="tel"
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

            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(80,160,120,0.1), rgba(80,160,120,0.03))", border: "1px solid rgba(120,190,150,0.22)", padding: 22 }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700, marginBottom: 6 }}>Mailing address</div>
              <p style={{ fontSize: 12, color: "rgba(246,243,234,0.55)", margin: "0 0 14px 0" }}>Required by the CRA for receipt issuance. P.O. Boxes cannot be accepted.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Street address</span>
                  <input name="Street address" required style={inputStyle} />
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.85fr 1fr", gap: 10 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <span style={labelStyle}>City</span>
                    <input name="City" required style={{ ...inputStyle, padding: "11px 10px" }} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <span style={labelStyle}>Province</span>
                    <input name="Province" required placeholder="ON" style={{ ...inputStyle, padding: "11px 10px" }} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <span style={labelStyle}>Postal code</span>
                    <input name="Postal code" required placeholder="K1V 1G5" style={{ ...inputStyle, padding: "11px 8px", fontSize: 13 }} />
                  </label>
                </div>
              </div>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, padding: "20px 22px" }}>
              <span style={labelStyle}>Note (optional) — e.g. previous address, donation reference</span>
              <textarea name="Note" rows={2} style={{ ...inputStyle, resize: "vertical" }} />
            </label>

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
                color: "#0e2419",
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
              {state === "busy" ? "Sending…" : "Submit for tax receipt"}
              {state !== "busy" && <span aria-hidden="true">→</span>}
            </button>
            {state === "error" && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#e08a8a", margin: 0 }}>Something needs attention — check the fields and try again.</p>
            )}
          </form>
        )}

        <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(246,243,234,0.5)", textAlign: "center", margin: "22px 12px 0" }}>
          Please add <a href={ORG.emailHref} style={{ color: "#8fb4c9" }}>{ORG.email}</a> to your contacts so your tax receipt doesn&apos;t land in spam. May Allah accept your generosity and reward you and your family.
        </p>
      </div>
    </div>
  );
}
