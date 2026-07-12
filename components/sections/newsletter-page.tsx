"use client";

/**
 * Faithful, dedicated port of `Newsletter Signup.dc.html`. Only the submit
 * mechanism is real (the source's static mailto: link can't carry entered
 * field data), wired to the shared submitForm() action instead.
 */

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { submitForm } from "@/app/actions/submit";
import { ORG, R } from "@/lib/links";
import { isValidEmail } from "@/lib/validate";

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

const dotGrid: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(246,243,234,0.05) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

export function NewsletterPage() {
  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const [delivered, setDelivered] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [emailError, setEmailError] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));

    if (!isValidEmail(data.email ?? "")) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError("");

    setState("busy");
    setValues(data);
    const res = await submitForm("mailing-list", data);
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
  const mailto = `mailto:${ORG.email}?subject=${encodeURIComponent("Newsletter Subscription")}&body=${mailtoBody}`;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      <div className="da-drift-gold pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 460, height: 460, top: "-12%", right: "-10%", background: "radial-gradient(circle, rgba(124,201,154,0.18), transparent 70%)" }} aria-hidden />
      <div className="da-drift-green pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 400, height: 400, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(201,162,39,0.14), transparent 72%)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50" style={dotGrid} aria-hidden />

      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 340, left: "6%", fontFamily: "'Amiri',serif", fontSize: 44, color: "rgba(124,201,154,0.13)", animationDuration: "5.5s" }} aria-hidden>
        ن
      </div>
      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 820, right: "8%", fontFamily: "'Amiri',serif", fontSize: 34, color: "rgba(201,162,39,0.14)", animationDuration: "6.2s", animationDelay: "0.6s" }} aria-hidden>
        ك
      </div>

      <div className="pointer-events-none absolute z-0" style={{ top: 480, right: "calc(50% - 400px)" }} aria-hidden>
        <div className="flex flex-col items-center" style={{ animation: "da-lantern-sway 4.4s ease-in-out infinite", animationDelay: "0.4s", transformOrigin: "top center" }}>
          <div style={{ width: 1.5, height: 66, background: "rgba(201,162,39,0.35)" }} />
          <div className="da-lantern-glow absolute rounded-full blur-[11px]" style={{ top: 58, width: 38, height: 38, background: "rgba(227,197,106,0.4)" }} />
          <div className="relative" style={{ width: 24, height: 34 }}>
            <div style={{ position: "absolute", top: 0, left: 5, width: 14, height: 5, background: "#c9a227", borderRadius: "3px 3px 0 0" }} />
            <div style={{ position: "absolute", top: 4, left: 0.5, width: 23, height: 22, borderRadius: 6, background: "linear-gradient(160deg, #e3c56a, #c9a227)", boxShadow: "0 0 12px 2px rgba(227,197,106,0.4)" }} />
            <div style={{ position: "absolute", top: 8, left: 7.5, width: 8, height: 13, background: "#fff3c4", borderRadius: 3, opacity: 0.85 }} />
            <div style={{ position: "absolute", bottom: 0, left: 9, width: 6, height: 4, background: "#8a6a1e", borderRadius: "0 0 3px 3px" }} />
          </div>
        </div>
      </div>

      {/* HERO: wax-seal envelope */}
      <div style={{ position: "relative", width: "100%", height: 300, overflow: "hidden", background: "linear-gradient(180deg, #16302280, #0e2419)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 100% at 50% 120%, rgba(124,201,154,0.22), transparent 60%)" }} />
        <Link href="/" style={{ position: "absolute", top: 20, left: 24, zIndex: 3, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(246,243,234,0.75)", fontWeight: 500 }}>
          ← Back to Darul Arqum
        </Link>

        <svg width="100%" height="100%" viewBox="0 0 900 300" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, opacity: 0.32, pointerEvents: "none" }}>
          <path d="M300 300 V185 A150 150 0 0 1 600 185 V300" fill="none" stroke="#7cc99a" strokeWidth={2} />
          <path d="M270 300 V172 A180 180 0 0 1 630 172 V300" fill="none" stroke="#7cc99a" strokeWidth={1} opacity={0.5} />
        </svg>
        <div className="da-float-slow pointer-events-none absolute" style={{ top: 34, left: "13%", opacity: 0.35, animationDuration: "5s" }}>
          <svg width={26} height={18} viewBox="0 0 26 18">
            <rect x={1} y={1} width={24} height={16} rx={2} fill="none" stroke="#a9e0c0" strokeWidth={1.4} />
            <path d="M1 2 L13 11 L25 2" fill="none" stroke="#a9e0c0" strokeWidth={1.4} />
          </svg>
        </div>
        <div className="da-float-slow pointer-events-none absolute" style={{ top: 64, right: "14%", opacity: 0.3, animationDuration: "6s", animationDelay: "0.5s" }}>
          <svg width={20} height={14} viewBox="0 0 26 18">
            <rect x={1} y={1} width={24} height={16} rx={2} fill="none" stroke="#c9a227" strokeWidth={1.4} />
            <path d="M1 2 L13 11 L25 2" fill="none" stroke="#c9a227" strokeWidth={1.4} />
          </svg>
        </div>
        <div className="da-twinkle pointer-events-none absolute" style={{ top: 44, right: "24%", fontSize: 11, color: "rgba(201,162,39,0.5)" }} aria-hidden>
          ✦
        </div>

        <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div className="da-float-slow relative" style={{ width: 96, height: 70, animationDuration: "4.5s" }}>
            <svg width={96} height={70} viewBox="0 0 96 70">
              <rect x={2} y={2} width={92} height={66} rx={5} fill="#123a2a" stroke="#a9e0c0" strokeWidth={2} />
              <path d="M4 6 L48 42 L92 6" fill="none" stroke="#a9e0c0" strokeWidth={2} strokeLinejoin="round" />
              <path d="M4 64 L36 34" stroke="#a9e0c0" strokeWidth={1.4} opacity={0.45} />
              <path d="M92 64 L60 34" stroke="#a9e0c0" strokeWidth={1.4} opacity={0.45} />
            </svg>
            <div style={{ position: "absolute", top: 26, left: "50%", transform: "translateX(-50%)", width: 34, height: 34, borderRadius: 999, background: "radial-gradient(circle at 35% 30%, #e35c5c, #a83232)", boxShadow: "0 4px 10px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={18} height={18} viewBox="0 0 20 20">
                <path d="M13 2 A8 8 0 1 0 13 18 A6.4 6.4 0 1 1 13 2 Z" fill="#f6e6c8" />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 12.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Stay connected</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(32px,5vw,44px)", color: "#f6f3ea", margin: 0, padding: "0 20px", textAlign: "center" }}>The Darul Arqum Newsletter</h1>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 620, margin: "0 auto", padding: "36px 24px 64px" }}>
        <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(246,243,234,0.72)", textAlign: "center", margin: "0 0 30px 0" }}>
          <span style={{ color: "#a9e0c0", fontWeight: 600 }}>Get news on programs, events, and fundraising milestones</span> delivered straight to your inbox — no spam, just what matters to our community.
        </p>

        {state === "done" ? (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ borderRadius: 20, border: "1px solid rgba(124,201,154,0.3)", background: "rgba(124,201,154,0.08)", padding: 28, marginBottom: 40, textAlign: "center" }}>
            <CheckCircle2 className="mx-auto h-6 w-6" style={{ color: "#a9e0c0" }} aria-hidden />
            <p style={{ marginTop: 12, fontWeight: 500, color: "#f6f3ea" }}>{delivered ? "You're subscribed" : "Subscription recorded"}</p>
            <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "rgba(246,243,234,0.6)" }}>
              {delivered ? "The Darul Arqum team has added you to the newsletter list." : "To make sure it reaches the team right away, you can also send it directly from your email app."}
            </p>
            {!delivered && (
              <a href={mailto} style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "#7cc99a", padding: "10px 18px", fontSize: 14, fontWeight: 600, color: "#0e2419" }}>
                <Mail className="h-4 w-4" aria-hidden />
                Send via your email app
              </a>
            )}
          </motion.div>
        ) : (
          <form
            onSubmit={onSubmit}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "linear-gradient(160deg, rgba(124,201,154,0.1), rgba(246,243,234,0.03))",
              border: "1px solid rgba(124,201,154,0.3)",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 30px 70px -30px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,201,154,0.05)",
              marginBottom: 40,
              overflow: "hidden",
            }}
          >
            <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />
            <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: 999, background: "radial-gradient(circle, rgba(124,201,154,0.18), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(124,201,154,0.2)", border: "1px solid rgba(124,201,154,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a9e0c0", fontSize: 13 }}>✉</div>
              <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Subscribe</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, position: "relative" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={labelStyle}>Full name</span>
                <input name="Full name" required style={inputStyle} />
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
            </div>
            <button
              type="submit"
              disabled={state === "busy"}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                textAlign: "center",
                background: "linear-gradient(135deg,#c8f0d8,#7cc99a)",
                color: "#0e2419",
                fontWeight: 800,
                fontSize: 15,
                padding: "15px 0",
                borderRadius: 999,
                marginTop: 6,
                boxShadow: "0 14px 30px -8px rgba(124,201,154,0.55)",
                border: "none",
                cursor: state === "busy" ? "default" : "pointer",
                opacity: state === "busy" ? 0.7 : 1,
              }}
            >
              {state === "busy" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {state === "busy" ? "Sending…" : "✉ Subscribe"}
              {state !== "busy" && <span aria-hidden="true">→</span>}
            </button>
            {state === "error" && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#e08a8a", margin: 0 }}>Something needs attention — check the fields and try again.</p>
            )}
          </form>
        )}

        <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 14 }}>Past editions</div>
        <Link
          href={R.newsletterDec2020}
          style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 14, background: "linear-gradient(120deg, rgba(201,162,39,0.14), rgba(201,162,39,0.03))", border: "1px solid rgba(201,162,39,0.35)", textDecoration: "none", boxShadow: "0 16px 34px -18px rgba(201,162,39,0.5)" }}
        >
          <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, background: "rgba(201,162,39,0.2)", border: "1px solid rgba(201,162,39,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e3c56a", fontSize: 19 }}>✉</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 17, color: "#f6f3ea" }}>December 2020 — The First Edition</div>
            <div style={{ fontSize: 12.5, color: "rgba(246,243,234,0.6)" }}>Read the archived newsletter</div>
          </div>
          <span style={{ color: "#e3c56a", fontSize: 16 }}>→</span>
        </Link>
      </div>
    </div>
  );
}
