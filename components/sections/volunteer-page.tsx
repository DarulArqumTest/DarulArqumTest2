"use client";

/**
 * Faithful, dedicated port of `Volunteer Registration.dc.html`. Only the
 * submit mechanism is real (the source's static mailto: link can't carry
 * entered field data), wired to the shared submitForm() action instead.
 */

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { submitForm } from "@/app/actions/submit";
import { ORG } from "@/lib/links";

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

const dotGrid: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(246,243,234,0.05) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function GenderSelect() {
  const chevron =
    "url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22 viewBox=%220 0 10 6%22%3E%3Cpath d=%22M1 1l4 4 4-4%22 stroke=%22%23e8b06a%22 stroke-width=%221.6%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')";
  return (
    <select
      name="Gender"
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

function CheckboxRow({ name, label, accent }: { name: string; label: string; accent: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(246,243,234,0.14)", fontSize: 13.5, color: "rgba(246,243,234,0.85)", cursor: "pointer" }}>
      <input type="checkbox" name={name} style={{ width: 16, height: 16, accentColor: accent }} /> {label}
    </label>
  );
}

const AVAILABILITY = ["Weekday mornings", "Weekday evenings", "Weekends", "Jumu'ah & special events"];
const INTERESTS = ["Event organizing", "Maintenance & facilities", "Madrasa teaching assistant", "IT & media", "Fundraising", "Kitchen & hospitality"];

export function VolunteerPage() {
  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const [delivered, setDelivered] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => {
      data[k] = data[k] ? `${data[k]}, ${v}` : String(v);
    });
    setValues(data);
    const res = await submitForm("volunteer", data);
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
  const mailto = `mailto:${ORG.email}?subject=${encodeURIComponent("Volunteer Application")}&body=${mailtoBody}`;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      <div className="da-drift-gold pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 460, height: 460, top: "-12%", right: "-10%", background: "radial-gradient(circle, rgba(217,143,74,0.16), transparent 70%)" }} aria-hidden />
      <div className="da-drift-green pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 400, height: 400, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.16), transparent 72%)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50" style={dotGrid} aria-hidden />

      {[
        { top: 60, side: "right" as const, pos: -70, size: 240, opacity: 0.4, twinkle: false },
        { top: 900, side: "left" as const, pos: -90, size: 200, opacity: 0.32, twinkle: true },
      ].map((sq, i) => (
        <div key={i} className={`pointer-events-none absolute z-0 ${sq.twinkle ? "da-twinkle" : ""}`} style={{ top: sq.top, [sq.side]: sq.pos, width: sq.size, height: sq.size, opacity: sq.opacity } as React.CSSProperties} aria-hidden>
          <div className="absolute inset-0" style={{ border: "1.5px solid rgba(217,143,74,0.2)" }} />
          <div className="absolute inset-0 rotate-45" style={{ border: "1.5px solid rgba(217,143,74,0.2)" }} />
        </div>
      ))}

      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 340, left: "6%", fontFamily: "'Amiri',serif", fontSize: 46, color: "rgba(217,143,74,0.14)", animationDuration: "5.5s" }} aria-hidden>
        خ
      </div>
      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 780, right: "8%", fontFamily: "'Amiri',serif", fontSize: 36, color: "rgba(124,201,154,0.14)", animationDuration: "6.2s", animationDelay: "0.6s" }} aria-hidden>
        د
      </div>
      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 1300, left: "9%", fontFamily: "'Amiri',serif", fontSize: 40, color: "rgba(217,143,74,0.13)", animationDuration: "5.8s", animationDelay: "1.1s" }} aria-hidden>
        م
      </div>

      <div className="pointer-events-none absolute z-0" style={{ top: 460, right: "calc(50% - 400px)" }} aria-hidden>
        <div className="flex flex-col items-center" style={{ animation: "da-lantern-sway 4.4s ease-in-out infinite", animationDelay: "0.4s", transformOrigin: "top center" }}>
          <div style={{ width: 1.5, height: 70, background: "rgba(201,162,39,0.35)" }} />
          <div className="da-lantern-glow absolute rounded-full blur-[11px]" style={{ top: 62, width: 40, height: 40, background: "rgba(227,197,106,0.4)" }} />
          <div className="relative" style={{ width: 25, height: 35 }}>
            <div style={{ position: "absolute", top: 0, left: 5, width: 15, height: 5, background: "#c9a227", borderRadius: "3px 3px 0 0" }} />
            <div style={{ position: "absolute", top: 4, left: 0.5, width: 24, height: 22, borderRadius: 6, background: "linear-gradient(160deg, #e3c56a, #c9a227)", boxShadow: "0 0 12px 2px rgba(227,197,106,0.4)" }} />
            <div style={{ position: "absolute", top: 8, left: 8, width: 8, height: 13, background: "#fff3c4", borderRadius: 3, opacity: 0.85 }} />
            <div style={{ position: "absolute", bottom: 0, left: 9, width: 6, height: 4, background: "#8a6a1e", borderRadius: "0 0 3px 3px" }} />
          </div>
        </div>
      </div>

      {/* HERO: raised hands under a dome */}
      <div style={{ position: "relative", width: "100%", height: 300, overflow: "hidden", background: "linear-gradient(180deg, #16302280, #0e2419)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 100% at 50% 120%, rgba(217,143,74,0.22), transparent 60%)" }} />
        <Link href="/" style={{ position: "absolute", top: 20, left: 24, zIndex: 3, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(246,243,234,0.75)", fontWeight: 500 }}>
          ← Back to Darul Arqum
        </Link>

        <svg width="100%" height="100%" viewBox="0 0 900 300" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
          <path d="M300 300 V180 A150 150 0 0 1 600 180 V300" fill="none" stroke="#e8b06a" strokeWidth={2} />
          <path d="M270 300 V170 A180 180 0 0 1 630 170 V300" fill="none" stroke="#e8b06a" strokeWidth={1} opacity={0.5} />
        </svg>
        <div className="da-twinkle pointer-events-none absolute" style={{ top: 34, left: "16%", fontSize: 13, color: "rgba(232,176,106,0.5)" }} aria-hidden>
          ✦
        </div>
        <div className="da-twinkle pointer-events-none absolute" style={{ top: 56, right: "17%", fontSize: 10, color: "rgba(124,201,154,0.4)", animationDelay: "0.5s" }} aria-hidden>
          ✦
        </div>

        <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 2 }}>
            {[
              { w: 34, h: 52, color: "#e8b06a", sw: 2, dur: "4s", delay: 0, opacity: 1 },
              { w: 40, h: 60, color: "#f3c98a", sw: 2.2, dur: "4.6s", delay: 0.4, opacity: 1 },
              { w: 30, h: 46, color: "#e8b06a", sw: 1.8, dur: "4.2s", delay: 0.8, opacity: 0.8 },
            ].map((h, i) => (
              <div key={i} style={{ animation: "handRaise 4s ease-in-out infinite", animationDuration: h.dur, animationDelay: `${h.delay}s` }}>
                <svg width={h.w} height={h.h} viewBox="0 0 34 52">
                  <path
                    d="M17 52 V22 M17 22 C17 22 10 20 9 12 C8 6 12 3 15 5 C16 6 16 9 16 12 M17 22 C17 22 12 19 12 13 C12 8 15 5 17 7 C18 8 18 10 18 13 M17 22 C17 22 22 19 22 13 C22 8 19 5 17 7 C16 8 16 10 16 13 M17 22 C17 22 24 20 25 12 C26 6 22 3 19 5 C18 6 18 9 18 12"
                    fill="none"
                    stroke={h.color}
                    strokeWidth={h.sw}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={h.opacity}
                  />
                </svg>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 26, height: 1, background: "linear-gradient(90deg, transparent, rgba(232,176,106,0.7))" }} />
            <span style={{ fontSize: 13.5, letterSpacing: "0.28em", textTransform: "uppercase", color: "#f3c98a", fontWeight: 700, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>Serve your community</span>
            <span style={{ width: 26, height: 1, background: "linear-gradient(90deg, rgba(232,176,106,0.7), transparent)" }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(32px,5vw,44px)", color: "#f6f3ea", margin: 0, textAlign: "center", textShadow: "0 4px 24px rgba(0,0,0,0.55)" }}>Join Darul Arqum</h1>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 660, margin: "0 auto", padding: "36px 24px 64px" }}>
        <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(246,243,234,0.72)", textAlign: "center", margin: "0 0 30px 0" }}>
          &quot;Whoever loves the masjid, Allah loves him.&quot; Darul Arqum runs entirely on the generosity of volunteers who give their time — from teaching and events, to maintenance and hospitality. Tell us where you&apos;d like to help.
        </p>

        {state === "done" ? (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ borderRadius: 20, border: "1px solid rgba(217,143,74,0.25)", background: "rgba(217,143,74,0.07)", padding: 32 }}>
            <CheckCircle2 className="h-6 w-6" style={{ color: "#e8b06a" }} aria-hidden />
            <p style={{ marginTop: 12, fontWeight: 500, color: "#f6f3ea" }}>{delivered ? "Application sent" : "Application recorded"}</p>
            <p style={{ marginTop: 6, maxWidth: 420, fontSize: 14, lineHeight: 1.6, color: "rgba(246,243,234,0.6)" }}>
              {delivered ? "The Darul Arqum team has received your application and will follow up." : "To make sure it reaches the team right away, you can also send it directly from your email app — everything is prefilled."}
            </p>
            {!delivered && (
              <a href={mailto} style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "#e8b06a", padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "#0e2419" }}>
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

            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(217,143,74,0.14), rgba(217,143,74,0.02))", border: "1px solid rgba(217,143,74,0.3)", padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -24, right: -24, width: 80, height: 80, borderRadius: 999, background: "radial-gradient(circle, rgba(217,143,74,0.16), transparent 70%)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, position: "relative" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(217,143,74,0.2)", border: "1px solid rgba(217,143,74,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8b06a", fontSize: 13, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>1</div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e8b06a", fontWeight: 700 }}>Your details</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Full name</span>
                  <input name="Full name" required style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Gender</span>
                  <GenderSelect />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Email</span>
                  <input name="email" type="email" required placeholder="you@example.com" style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Phone number</span>
                  <input name="Phone" type="tel" required pattern="[0-9+()\-\s]{7,15}" placeholder="(613) 555-0123" style={inputStyle} />
                </label>
              </div>
            </div>

            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(80,160,120,0.12), rgba(80,160,120,0.02))", border: "1px solid rgba(120,190,150,0.3)", padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -24, left: -24, width: 80, height: 80, borderRadius: 999, background: "radial-gradient(circle, rgba(120,190,150,0.14), transparent 70%)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, position: "relative" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(80,160,120,0.2)", border: "1px solid rgba(120,190,150,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a9e0c0", fontSize: 13, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>2</div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Your availability</span>
              </div>
              <p style={{ fontSize: 12.5, color: "rgba(246,243,234,0.6)", margin: "0 0 14px 0" }}>Select every option that works for you.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {AVAILABILITY.map((a) => (
                  <CheckboxRow key={a} name="Availability" label={a} accent="#7cc99a" />
                ))}
              </div>
            </div>

            <div style={{ borderRadius: 14, background: "linear-gradient(120deg, rgba(143,180,201,0.12), rgba(143,180,201,0.02))", border: "1px solid rgba(143,180,201,0.3)", padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: -24, right: -24, width: 80, height: 80, borderRadius: 999, background: "radial-gradient(circle, rgba(143,180,201,0.14), transparent 70%)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, position: "relative" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(143,180,201,0.2)", border: "1px solid rgba(143,180,201,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8fb4c9", fontSize: 13, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>3</div>
                <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8fb4c9", fontWeight: 700 }}>Joining options</span>
              </div>
              <p style={{ fontSize: 12.5, color: "rgba(246,243,234,0.6)", margin: "0 0 14px 0" }}>Where would you like to lend a hand?</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {INTERESTS.map((it) => (
                  <CheckboxRow key={it} name="Interest" label={it} accent="#8fb4c9" />
                ))}
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
                <span style={labelStyle}>Skills or notes (optional)</span>
                <textarea name="Notes" rows={3} placeholder="Anything else you'd like us to know" style={{ ...inputStyle, resize: "vertical" }} />
              </label>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 22px", fontSize: 13.5, color: "rgba(246,243,234,0.75)", cursor: "pointer" }}>
              <input type="checkbox" name="Newsletter" style={{ width: 16, height: 16, accentColor: "#c9a227" }} /> I&apos;d also like to subscribe to the Darul Arqum newsletter
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
                background: "linear-gradient(135deg,#f3c98a,#e8b06a)",
                color: "#0e2419",
                fontWeight: 800,
                fontSize: 15.5,
                padding: "17px 0",
                borderRadius: 999,
                margin: "6px 8px 8px",
                boxShadow: "0 12px 28px -8px rgba(217,143,74,0.5)",
                border: "none",
                cursor: state === "busy" ? "default" : "pointer",
                opacity: state === "busy" ? 0.7 : 1,
              }}
            >
              {state === "busy" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {state === "busy" ? "Sending…" : "Submit application"}
              {state !== "busy" && <span aria-hidden="true">→</span>}
            </button>
            {state === "error" && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#e08a8a", margin: 0 }}>Something needs attention — check the fields and try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
