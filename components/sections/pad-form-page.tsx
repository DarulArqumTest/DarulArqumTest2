"use client";

/** Faithful, dedicated port of `PAD Form.dc.html` — an informational page
 * pointing donors to the downloadable Pre-Authorized Debit form. No form
 * fields on this page in the source; it's a "how it works" + PDF link. */

import Link from "next/link";
import { EXT, ORG } from "@/lib/links";

const dotGrid: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(246,243,234,0.05) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const STEPS = [
  "Download and fill out the official PAD form below with your banking and contact information.",
  "Attach a voided cheque or a pre-authorized debit form from your bank, and sign the agreement.",
];

export function PadFormPage() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      <div className="da-drift-gold pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 460, height: 460, top: "-12%", right: "-10%", background: "radial-gradient(circle, rgba(143,180,201,0.16), transparent 70%)" }} aria-hidden />
      <div className="da-drift-green pointer-events-none fixed z-0 rounded-full blur-[8px]" style={{ width: 400, height: 400, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(201,162,39,0.12), transparent 72%)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50" style={dotGrid} aria-hidden />
      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 340, left: "6%", fontFamily: "'Amiri',serif", fontSize: 44, color: "rgba(143,180,201,0.14)", animationDuration: "5.5s" }} aria-hidden>
        ص
      </div>
      <div dir="rtl" lang="ar" className="da-float-slow pointer-events-none absolute z-0" style={{ top: 900, right: "8%", fontFamily: "'Amiri',serif", fontSize: 34, color: "rgba(201,162,39,0.13)", animationDuration: "6.2s", animationDelay: "0.6s" }} aria-hidden>
        د
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

      {/* HERO: dome of barakah */}
      <div style={{ position: "relative", width: "100%", height: 340, overflow: "hidden", background: "linear-gradient(180deg, #16302280, #0e2419)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 100% at 50% 120%, rgba(201,162,39,0.24), transparent 60%)" }} />
        <Link href="/" style={{ position: "absolute", top: 20, left: 24, zIndex: 3, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(246,243,234,0.75)", fontWeight: 500 }}>
          ← Back to Darul Arqum
        </Link>

        <svg width="100%" height="100%" viewBox="0 0 900 340" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}>
          <path d="M300 340 V210 A150 150 0 0 1 600 210 V340" fill="none" stroke="#c9a227" strokeWidth={2} />
          <path d="M270 340 V198 A180 180 0 0 1 630 198 V340" fill="none" stroke="#c9a227" strokeWidth={1} opacity={0.5} />
          <g stroke="#e3c56a" strokeWidth={1.4} opacity={0.35}>
            <line x1={450} y1={70} x2={390} y2={140} />
            <line x1={450} y1={70} x2={450} y2={150} />
            <line x1={450} y1={70} x2={510} y2={140} />
            <line x1={450} y1={70} x2={350} y2={110} />
            <line x1={450} y1={70} x2={550} y2={110} />
          </g>
        </svg>

        <div className="pointer-events-none absolute" style={{ top: 14, left: "11%", display: "flex", flexDirection: "column", alignItems: "center", animation: "da-lantern-sway 4.8s ease-in-out infinite", animationDelay: "0.2s", transformOrigin: "top center", opacity: 0.9 }} aria-hidden>
          <div style={{ width: 1.4, height: 34, background: "rgba(201,162,39,0.4)" }} />
          <div className="da-lantern-glow absolute rounded-full blur-[9px]" style={{ top: 30, width: 30, height: 30, background: "rgba(227,197,106,0.4)" }} />
          <svg width={22} height={32} viewBox="0 0 24 34">
            <path d="M12 0 l5 5 h-10 z" fill="#c9a227" />
            <rect x={4} y={5} width={16} height={20} rx={5} fill="none" stroke="#e3c56a" strokeWidth={1.6} />
            <rect x={9} y={29} width={6} height={4} fill="#8a6a1e" />
          </svg>
        </div>
        <div className="da-twinkle pointer-events-none absolute" style={{ top: 30, right: "12%", opacity: 0.7 }} aria-hidden>
          <svg width={22} height={22} viewBox="0 0 20 20">
            <path d="M13 2 A8 8 0 1 0 13 18 A6.4 6.4 0 1 1 13 2 Z" fill="#e3c56a" />
          </svg>
        </div>
        <div className="da-twinkle pointer-events-none absolute" style={{ top: 78, left: "20%", fontSize: 12, color: "rgba(201,162,39,0.5)" }} aria-hidden>
          ✦
        </div>
        <div className="da-twinkle pointer-events-none absolute" style={{ top: 64, right: "22%", fontSize: 10, color: "rgba(124,201,154,0.4)", animationDelay: "0.7s" }} aria-hidden>
          ✦
        </div>

        <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 120, height: 96 }}>
            {[
              { top: 0, left: 14, size: 8, delay: 0, dur: "2.6s" },
              { top: 6, left: 52, size: 9, delay: 0.3, dur: "3s" },
              { top: 0, right: 12, size: 7, delay: 0.6, dur: "2.8s" },
              { top: 20, left: 32, size: 8, delay: 0.9, dur: "3.2s" },
            ].map((c, i) => (
              <div
                key={i}
                className="da-float-slow absolute rounded-full"
                style={{ top: c.top, left: c.left, right: (c as { right?: number }).right, width: c.size, height: c.size, background: "linear-gradient(160deg,#f3d98a,#c9a227)", animationDuration: c.dur, animationDelay: `${c.delay}s` }}
              />
            ))}
            <svg width={120} height={70} viewBox="0 0 120 70" style={{ position: "absolute", bottom: 0, left: 0 }}>
              <ellipse cx={60} cy={58} rx={50} ry={10} fill="none" stroke="#e3c56a" strokeWidth={2.4} />
              <path d="M12 40 A48 30 0 0 0 108 40" fill="none" stroke="#c9a227" strokeWidth={2.4} />
              <path d="M20 22 A40 22 0 0 0 100 22" fill="none" stroke="#e3c56a" strokeWidth={1.4} opacity={0.5} />
            </svg>
          </div>
          <div dir="rtl" lang="ar" style={{ fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: 30, color: "#f3d98a", marginTop: -4, textShadow: "0 0 16px rgba(227,197,106,0.5)" }}>
            بركة
          </div>
          <div style={{ fontSize: 12.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700 }}>Give automatically · every month · lasting barakah</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(30px,5vw,42px)", color: "#f6f3ea", margin: 0, textAlign: "center" }}>Pre-Authorized Debit (PAD) Form</h1>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", padding: "36px 24px 64px" }}>
        <div style={{ borderRadius: 16, background: "linear-gradient(135deg, rgba(201,162,39,0.1), rgba(143,180,201,0.05))", border: "1px solid rgba(201,162,39,0.28)", padding: "26px 28px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 999, background: "rgba(201,162,39,0.18)", border: "1px solid rgba(201,162,39,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e3c56a", fontSize: 15, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>?</div>
            <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700 }}>What is a PAD?</div>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontStyle: "italic", fontSize: 19, lineHeight: 1.5, color: "#f6f3ea", margin: "0 0 12px 0" }}>
            A standing agreement to give, so your sadaqah never misses a month.
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "rgba(246,243,234,0.72)", margin: 0 }}>
            A Pre-Authorized Debit lets you set up a recurring monthly donation, automatically withdrawn from your bank account. No need to remember to give each month, and no card to re-enter when it expires — just a steady, simple way to sustain Darul Arqum&apos;s monthly maintenance and programs long-term.
          </p>
        </div>

        <div style={{ borderRadius: 16, background: "rgba(246,243,234,0.035)", border: "1px solid rgba(246,243,234,0.12)", padding: 26, marginBottom: 24 }}>
          <div style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 14 }}>How it works</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: 999, background: "rgba(201,162,39,0.18)", border: "1px solid rgba(201,162,39,0.4)", color: "#c9a227", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(246,243,234,0.75)", margin: 0 }}>{s}</p>
              </div>
            ))}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: 999, background: "rgba(201,162,39,0.18)", border: "1px solid rgba(201,162,39,0.4)", color: "#c9a227", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(246,243,234,0.75)", margin: 0 }}>
                Email the completed form to <a href={ORG.emailHref} style={{ color: "#8fb4c9" }}>{ORG.email}</a>, or drop it off at the masjid — your monthly gift begins the next billing cycle.
              </p>
            </div>
          </div>
        </div>

        <div style={{ borderRadius: 18, background: "linear-gradient(160deg, #1a3a29, #122d20)", border: "1px solid rgba(201,162,39,0.3)", padding: 26, display: "flex", alignItems: "center", gap: 22, boxShadow: "0 30px 70px -30px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden", maxWidth: 440, margin: "0 auto" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: 999, background: "radial-gradient(circle, rgba(201,162,39,0.16), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ width: 72, height: 92, flexShrink: 0, position: "relative" }}>
            <svg width={72} height={92} viewBox="0 0 60 76">
              <path d="M4 2 H40 L56 18 V74 H4 Z" fill="#f6f3ea" />
              <path d="M40 2 V18 H56 Z" fill="#d8d2c2" />
              <line x1={12} y1={30} x2={48} y2={30} stroke="#16302a" strokeWidth={1.6} opacity={0.22} />
              <line x1={12} y1={38} x2={48} y2={38} stroke="#16302a" strokeWidth={1.6} opacity={0.22} />
              <line x1={12} y1={46} x2={34} y2={46} stroke="#16302a" strokeWidth={1.6} opacity={0.22} />
            </svg>
            <div style={{ position: "absolute", left: 7, right: 7, bottom: 12, background: "#e35c5c", borderRadius: 5, padding: "4px 0", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.35)" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: "0.06em" }}>PDF</span>
            </div>
          </div>
          <div style={{ flex: 1, position: "relative", marginLeft: 8 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 19, color: "#f6f3ea", marginBottom: 4 }}>Monthly Donation PAD Form</div>
            <div style={{ fontSize: 12.5, color: "rgba(246,243,234,0.6)", marginBottom: 14 }}>Official downloadable form, fillable and printable.</div>
            <a
              href={EXT.padFormPdf}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#d7ebf3,#8fb4c9)", color: "#0e2419", fontWeight: 800, fontSize: 14, padding: "11px 22px", borderRadius: 999, boxShadow: "0 14px 30px -8px rgba(143,180,201,0.45)" }}
            >
              Open PAD form (PDF) <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(246,243,234,0.5)", textAlign: "center", margin: "22px 12px 0" }}>
          Questions about your pre-authorized debit? Contact <a href={ORG.emailHref} style={{ color: "#8fb4c9" }}>{ORG.email}</a> or {ORG.phone}.
        </p>
      </div>
    </div>
  );
}
