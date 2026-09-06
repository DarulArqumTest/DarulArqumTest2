"use client";

/**
 * Faithful, dedicated port of `Hifz Registration.dc.html` (not the shared
 * program/registration abstraction) — includes the fully hand-built CSS/SVG
 * mus'haf illustration (gold medallion, arced Arabic title, draped tasbih
 * beads). Only the submit mechanism is real (the source's static mailto:
 * link can't carry entered field data), wired to the shared submitForm()
 * action instead.
 */

import * as React from "react";
import { DaForm, type Section } from "@/components/site/da-form";
import { Glyph } from "@/components/site/program-glyphs";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getProgram } from "@/lib/programs";
import { FactTiles, CurriculumTrack } from "@/components/site/program-track";
import { motion } from "motion/react";
import { ORG, R } from "@/lib/links";

const errorStyle: React.CSSProperties = { marginTop: 5, fontSize: 12, color: "#e08a8a" };




/** the one record behind this programme, so a fee cannot drift here */
const P = getProgram("hifz");

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
        <div style={{ width: 1.5, height: l.stringH, background: "rgba(217,143,74,0.35)" }} />
        <div
          className="da-lantern-glow absolute rounded-full blur-[11px]"
          style={{ top: l.stringH - 8, width: l.bodyW + 14, height: l.bodyW + 14, background: "rgba(227,177,106,0.4)" }}
        />
        <div className="relative" style={{ width: l.bodyW, height: l.bodyH }}>
          <div style={{ position: "absolute", top: 0, left: l.bodyW * 0.2, width: l.bodyW * 0.58, height: 5, background: "#d98f4a", borderRadius: "3px 3px 0 0" }} />
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 0.5,
              width: l.bodyW - 1,
              height: l.bodyH - 12,
              borderRadius: 6,
              background: "linear-gradient(160deg, #e8b06a, #d98f4a)",
              boxShadow: "0 0 12px 2px rgba(227,177,106,0.4)",
            }}
          />
          <div style={{ position: "absolute", top: 8, left: l.bodyW * 0.31, width: l.bodyW * 0.33, height: l.bodyH - 20, background: "#fff3c4", borderRadius: 3, opacity: 0.85 }} />
          <div style={{ position: "absolute", bottom: 0, left: l.bodyW * 0.37, width: l.bodyW * 0.25, height: 4, background: "#8a5a1e", borderRadius: "0 0 3px 3px" }} />
        </div>
      </div>
    </div>
  );
}

/** what this page asks for; everything else lives in DaForm */
const FORM_SECTIONS: Section[] = [
    {
      kind: "student",
      title: "Student",
      glyph: "student",
      fields: [
        { name: "studentName", label: "Student's full name", required: true },
        { name: "age", label: "Age", required: true, half: true, placeholder: "e.g. 17" },
        { name: "gender", label: "Gender", type: "select", required: true, half: true, options: ["Male", "Female"] },
      ],
    },
    {
      kind: "parents",
      title: "Parent / guardian & contact",
      glyph: "parents",
      lede: "So we can confirm placement and reach someone if we need to.",
      fields: [
        { name: "parentName", label: "Parent / guardian name (if applicable)" },
        { name: "parentEmail", label: "Email", type: "email", required: true, half: true, placeholder: "you@example.com" },
        { name: "emergencyContact", label: "Emergency contact number", type: "tel", required: true, half: true, placeholder: "(613) 555-0123" },
      ],
    },
    {
      kind: "background",
      title: "Academic background",
      glyph: "history",
      fields: [
        { name: "background", label: "Prior Arabic or Islamic studies background (optional)", type: "textarea", rows: 3, placeholder: "e.g. completed Hifz, studied Nazira, prior madrasa experience…" },
        { name: "note", label: "Anything else we should know (optional)", type: "textarea", rows: 2 },
      ],
    },
];

export function HifzRegister() {

  return (
    <div className="da-reg" style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      {/* ambient background */}
      <div
        className="da-drift-gold pointer-events-none fixed z-0 rounded-full blur-[8px]"
        style={{ width: 460, height: 460, top: "-12%", right: "-10%", background: "radial-gradient(circle, rgba(217,143,74,0.16), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="da-drift-green pointer-events-none fixed z-0 rounded-full blur-[8px]"
        style={{ width: 400, height: 400, bottom: "-14%", left: "-10%", background: "radial-gradient(circle, rgba(60,140,100,0.18), transparent 72%)" }}
        aria-hidden
      />
      {/* ruled-manuscript grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ opacity: 0.25, backgroundImage: "repeating-linear-gradient(0deg, rgba(217,143,74,0.14) 0 1px, transparent 1px 26px)" }}
        aria-hidden
      />

      {[
        { top: 40, side: "right" as const, pos: -70, size: 240, opacity: 0.4, twinkle: false, color: "rgba(217,143,74,0.2)" },
        { top: 640, side: "left" as const, pos: -90, size: 200, opacity: 0.35, twinkle: true, color: "rgba(120,190,150,0.18)" },
        { top: 1040, side: "right" as const, pos: -80, size: 220, opacity: 0.3, twinkle: false, color: "rgba(217,143,74,0.2)" },
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

      {/* large faint open-book watermark, centered behind the form */}
      <div style={{ position: "absolute", top: 900, left: "50%", transform: "translateX(-50%)", width: 420, height: 220, opacity: 0.05, zIndex: 0, pointerEvents: "none" }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, border: "3px solid #e8b06a", borderRadius: 10 }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 3, background: "#e8b06a" }} />
      </div>

      {/* floating bookmark ribbons */}
      <div className="da-float-slow pointer-events-none absolute z-0" style={{ top: 340, left: "9%", width: 20, height: 70, opacity: 0.3, animationDuration: "5s" }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #d98f4a, #e8b06a)", clipPath: "polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)" }} />
      </div>
      <div className="da-float-slow pointer-events-none absolute z-0" style={{ top: 1300, right: "11%", width: 16, height: 58, opacity: 0.26, animationDuration: "4.6s", animationDelay: "0.5s" }} aria-hidden>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #d98f4a, #e8b06a)", clipPath: "polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)" }} />
      </div>

      {LANTERNS.map((l, i) => (
        <Lantern key={i} l={l} />
      ))}

      {/* HANDCRAFTED HIFZ HERO — closed mus'haf on a lectern */}
      <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden", background: "linear-gradient(180deg, #4a3320, #2e2013)", padding: 14 }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 6,
            background: "radial-gradient(ellipse 120% 100% at 50% 15%, #3a2a17, #201509 75%)",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="absolute inset-0 rounded-[6px] opacity-40"
            style={{ backgroundImage: "radial-gradient(rgba(246,243,234,0.05) 1px, transparent 1px)", backgroundSize: "5px 5px" }}
            aria-hidden
          />


          <div className="da-twinkle absolute" style={{ top: 34, right: 56, fontSize: 20, color: "rgba(227,177,106,0.5)", fontFamily: "'Amiri',serif", transform: "rotate(-8deg)" }} aria-hidden><Glyph name="star8" size={14} /></div>
          <div className="absolute" style={{ bottom: 40, left: 64, fontSize: 14, color: "rgba(227,177,106,0.35)", fontFamily: "'Amiri',serif", transform: "rotate(10deg)" }} aria-hidden><Glyph name="star8" size={14} /></div>

          <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 180, height: 230, display: "flex", justifyContent: "center" }}>
              {/* gilt page-edge */}
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  top: 4,
                  width: 150,
                  height: 220,
                  borderRadius: 2,
                  background: "repeating-linear-gradient(90deg, #e9cd7a 0 2px, #cda84f 2px 3px)",
                  boxShadow: "2px 4px 14px rgba(0,0,0,0.4)",
                }}
              />
              {/* book cover */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 150,
                  height: 220,
                  borderRadius: 3,
                  background: "linear-gradient(155deg, #0e3324, #081f17 75%)",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ position: "absolute", inset: 9, border: "1.5px solid #cda84f", borderRadius: 1 }} />
                <div style={{ position: "absolute", inset: 12, border: "1px solid rgba(205,168,79,0.6)", borderRadius: 1 }} />
                <div style={{ position: "absolute", top: 5, left: 5, width: 13, height: 13, borderTop: "1.5px solid #cda84f", borderLeft: "1.5px solid #cda84f", borderRadius: "5px 0 0 0" }} />
                <div style={{ position: "absolute", top: 5, right: 5, width: 13, height: 13, borderTop: "1.5px solid #cda84f", borderRight: "1.5px solid #cda84f", borderRadius: "0 5px 0 0" }} />
                <div style={{ position: "absolute", bottom: 5, left: 5, width: 13, height: 13, borderBottom: "1.5px solid #cda84f", borderLeft: "1.5px solid #cda84f", borderRadius: "0 0 0 5px" }} />
                <div style={{ position: "absolute", bottom: 5, right: 5, width: 13, height: 13, borderBottom: "1.5px solid #cda84f", borderRight: "1.5px solid #cda84f", borderRadius: "0 0 5px 0" }} />

                <svg width={150} height={46} viewBox="0 0 150 46" style={{ position: "absolute", top: 24, left: 0 }}>
                  <path id="hifzTitleArc" d="M 18 40 Q 75 4 132 40" fill="none" />
                  <text style={{ direction: "rtl" }} fontFamily="'Amiri', serif" fontWeight={700} fontSize={15} fill="#e9cd7a">
                    <textPath href="#hifzTitleArc" startOffset="50%" textAnchor="middle">
                      القرآن الكريم
                    </textPath>
                  </text>
                </svg>

                <div style={{ position: "absolute", top: 88, left: "50%", transform: "translateX(-50%)", width: 92, height: 70, border: "1.5px solid #cda84f", borderRadius: "50%" }} />
                <div
                  style={{
                    position: "absolute",
                    top: 92,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 82,
                    height: 60,
                    border: "1px solid rgba(205,168,79,0.6)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <span dir="rtl" lang="ar" style={{ fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: 22, color: "#e9cd7a", textShadow: "0 1px 0 rgba(0,0,0,0.4)", lineHeight: 1 }}>
                    القرآن
                  </span>
                </div>
                <div style={{ position: "absolute", top: 78, left: "50%", transform: "translateX(-50%)", width: 1.5, height: 8, background: "#cda84f" }} />
                <div style={{ position: "absolute", top: 160, left: "50%", transform: "translateX(-50%)", width: 1.5, height: 8, background: "#cda84f" }} />

                <div
                  style={{
                    position: "absolute",
                    top: 170,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 22,
                    height: 22,
                    border: "1.5px solid #cda84f",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "#e9cd7a", fontSize: 11 }}><Glyph name="star8" size={14} /></span>
                </div>
                <div style={{ position: "relative", zIndex: 2, marginTop: 198, textAlign: "center", fontSize: 7, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(205,168,79,0.8)", fontWeight: 600 }}>
                  Al-Qur&apos;an Al-Kareem
                </div>
              </div>
              {/* tasbih beads draped diagonally */}
              <div style={{ position: "absolute", top: -10, left: -24, width: 150, height: 160, zIndex: 3 }}>
                <svg width={150} height={160} viewBox="0 0 150 160" style={{ overflow: "visible" }}>
                  <path d="M8 6 Q 60 60 40 130 Q 32 148 18 156" stroke="#2f7a4a" strokeWidth={2} fill="none" opacity={0.5} />
                  <circle cx={9} cy={7} r={4} fill="#3f9760" />
                  <circle cx={20} cy={18} r={4} fill="#4aa86c" />
                  <circle cx={30} cy={30} r={4} fill="#3f9760" />
                  <circle cx={39} cy={44} r={4} fill="#4aa86c" />
                  <circle cx={45} cy={59} r={4} fill="#3f9760" />
                  <circle cx={47} cy={76} r={4} fill="#4aa86c" />
                  <circle cx={45} cy={93} r={4} fill="#3f9760" />
                  <circle cx={40} cy={109} r={4} fill="#4aa86c" />
                  <circle cx={33} cy={124} r={4} fill="#3f9760" />
                  <circle cx={24} cy={138} r={4} fill="#4aa86c" />
                </svg>
                <div style={{ position: "absolute", top: 144, left: 12, width: 2, height: 16, background: "#2f7a4a" }} />
                <div
                  style={{
                    position: "absolute",
                    top: 158,
                    left: 8,
                    width: 11,
                    height: 15,
                    background: "linear-gradient(180deg, #4aa86c, #2f7a4a)",
                    borderRadius: "0 0 5px 5px",
                    clipPath: "polygon(0 0,100% 0,90% 100%,60% 90%,40% 100%,10% 100%)",
                  }}
                />
              </div>
              <div
                className="da-lantern-glow"
                style={{ position: "absolute", top: -24, left: "50%", transform: "translateX(-50%)", width: 180, height: 80, borderRadius: 999, background: "radial-gradient(circle, rgba(227,177,106,0.28), transparent 70%)", filter: "blur(6px)" }}
              />
            </div>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(246,243,234,0.55)", fontWeight: 600, whiteSpace: "nowrap", marginTop: 4 }}>
              Hifz · Memorizing the Qur&apos;an
            </div>
          </div>
        </div>
      </div>

      <div className="da-page-gutter" style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "32px auto 0", padding: "0 24px 64px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ width: 22, height: 1, background: "rgba(217,143,74,0.6)" }} />
          <span style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e8b06a", fontWeight: 700 }}>Al-Arif Islamic Institute · flagship</span>
        </motion.div>

        <Breadcrumbs items={[{ label: "Programs", href: R.programs }, { label: "Hifz", href: "/programs/hifz" }, { label: "Register" }]} className="mb-5" />

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(32px,5vw,42px)", lineHeight: 1.1, color: "#f6f3ea", margin: "0 0 20px 0" }}
        >
          Register for Quran Hifz
        </motion.h1>

        <FactTiles
          schedule={P.facts[0].value}
          scheduleNote="Full-time, on site at Darul Arqum"
          tuition={P.facts[1].value}
          tuitionNote="Monthly, due at the start of each month"
          accent="#d98f4a"
        />

        <CurriculumTrack title="The daily work" items={P.curriculum ?? []} accent="#d98f4a" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 18px", borderRadius: 12, background: "rgba(246,243,234,0.04)", border: "1px solid rgba(246,243,234,0.1)", marginBottom: 36 }}
        >
          <span style={{ color: "#e8b06a", display: "flex", marginTop: 1 }} aria-hidden><Glyph name="note" size={14} /></span>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: 0 }}>
            Submitting this form starts registration. Our team will follow up by email or phone to confirm placement and fees.
          </p>
        </motion.div>

        <DaForm
          formName="hifz"
          subject="Quran Hifz registration"
          submitLabel="Submit registration"
          doneTitle="Registration received"
          doneScene="register"
          emailField="parentEmail"
          phoneField="emergencyContact"
          sections={FORM_SECTIONS}
          note="Submitting this form starts registration. The team follows up by email or phone to confirm placement and fees. Nothing is charged here."
        />
      </div>
    </div>
  );
}
