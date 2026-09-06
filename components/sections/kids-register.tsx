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
import { DaForm, type Section } from "@/components/site/da-form";
import { Glyph } from "@/components/site/program-glyphs";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getProgram } from "@/lib/programs";
import { FactTiles, CurriculumTrack } from "@/components/site/program-track";
import { motion } from "motion/react";
import { ORG, R } from "@/lib/links";

const errorStyle: React.CSSProperties = { marginTop: 5, fontSize: 12, color: "#e08a8a" };




/** the one record behind this programme, so a fee cannot drift here */
const P = getProgram("kids-arabic");

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

const TODAY = new Date().toISOString().slice(0, 10);

/**
 * Whole years completed, counted the way a birthday is: the month and day
 * have to have come round, not just the year. Out-of-range ages are noted,
 * never blocked — a family with a nine- and an eleven-year-old should not
 * hit a wall.
 */
function deriveAge(dob: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const [y, m, d] = dob.split("-").map(Number);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age -= 1;
  if (age < 0 || age > 130) return null;
  const ok = age >= 5 && age <= 10;
  return {
    ok,
    value: String(age),
    text: ok
      ? `Age ${age} — inside the 5–10 range.`
      : `Age ${age}. The class is built for 5–10; send it anyway and the team will advise.`,
  };
}

/** what this page asks for; everything else lives in DaForm */
const FORM_SECTIONS: Section[] = [
    {
      kind: "student",
      title: "Student",
      glyph: "student",
      fields: [
        { name: "studentName", label: "Child's full name", required: true },
        {
          name: "dateOfBirth",
          label: "Date of birth",
          type: "date",
          required: true,
          half: true,
          max: TODAY,
          derive: deriveAge,
          deriveTo: "age",
        },
        { name: "gender", label: "Gender", type: "select", required: true, half: true, options: ["Male", "Female"] },
      ],
    },
    {
      kind: "parents",
      title: "Parent / guardian & contact",
      glyph: "parents",
      lede: "So we can confirm a place and reach someone quickly if we need to.",
      fields: [
        { name: "parentName", label: "Parent / guardian name", required: true },
        { name: "parentEmail", label: "Email", type: "email", required: true, half: true, placeholder: "you@example.com" },
        { name: "emergencyContact", label: "Emergency contact number", type: "tel", required: true, half: true, placeholder: "(613) 555-0123" },
      ],
    },
    {
      kind: "care",
      title: "Care & safety",
      glyph: "character",
      lede: "Shared only with the teaching team, and only used if it is needed.",
      fields: [
        { name: "medical", label: "Allergies or medical conditions (if any)", type: "textarea", rows: 2 },
        { name: "healthCard", label: "Student health card number (optional)", half: true },
      ],
    },
    {
      kind: "background",
      title: "Before now",
      glyph: "history",
      fields: [
        { name: "background", label: "Has your child attended Arabic or Quran classes before? (optional)", type: "textarea", rows: 2 },
        { name: "note", label: "Anything else we should know (optional)", type: "textarea", rows: 2 },
      ],
    },
];

export function KidsRegister() {

  return (
    <div className="da-reg" style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
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


          <div
            aria-hidden
            className="da-twinkle absolute"
            style={{ top: 36, right: 52, fontSize: 22, color: "rgba(246,243,234,0.55)", fontFamily: "'Amiri',serif", transform: "rotate(-8deg)" }}
          ><Glyph name="star8" size={14} /></div>
          <div
            aria-hidden
            className="absolute"
            style={{ bottom: 44, left: 60, fontSize: 16, color: "rgba(246,243,234,0.4)", fontFamily: "'Amiri',serif", transform: "rotate(10deg)" }}
          ><Glyph name="star8" size={14} /></div>

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

      <div className="da-page-gutter" style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "0 auto", padding: "32px 24px 64px" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}
        >
          <span style={{ width: 22, height: 1, background: "rgba(124,201,154,0.6)" }} />
          <span style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700 }}>Ages 5–10</span>
        </motion.div>

        <Breadcrumbs items={[{ label: "Programs", href: R.programs }, { label: "KidsLearnArabic", href: R.kidsArabic }, { label: "Register" }]} className="mb-5" />

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(32px,5vw,42px)", lineHeight: 1.1, color: "#f6f3ea", margin: "0 0 20px 0" }}
        >
          Register for KidsLearnArabic
        </motion.h1>

        <FactTiles
          schedule={`Ages ${P.facts[0].value}`}
          scheduleNote={P.facts[2].value}
          tuition="Contact us for tuition"
          tuitionNote="The team confirms fees when you register"
          accent="#7cc99a"
        />

        <CurriculumTrack title="How your child learns" items={P.curriculum ?? []} accent="#7cc99a" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 18px", borderRadius: 12, background: "rgba(246,243,234,0.04)", border: "1px solid rgba(246,243,234,0.1)", marginBottom: 36 }}
        >
          <span style={{ color: "#a9e0c0", display: "flex", marginTop: 1 }} aria-hidden><Glyph name="note" size={14} /></span>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: 0 }}>
            Submitting this form starts registration. Our team will follow up by email or phone to confirm placement and fees.
          </p>
        </motion.div>

        <DaForm
          formName="kids-arabic"
          subject="KidsLearnArabic registration"
          submitLabel="Submit registration"
          doneTitle="Registration received"
          emailField="parentEmail"
          phoneField="emergencyContact"
          sections={FORM_SECTIONS}
          note="Emergency and health details are collected per the programme\u2019s safety policy and shared only with the teaching team."
        />
      </div>
    </div>
  );
}
