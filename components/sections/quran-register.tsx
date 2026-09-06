"use client";

/**
 * Faithful, dedicated port of `Quran Class Registration.dc.html` (not the
 * shared program/registration abstraction). Only the submit mechanism is
 * real (the source's static mailto: link can't carry entered field data),
 * wired to the shared submitForm() action instead.
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




function CrescentMoon({ top, left, right, size, glowSize, glowOpacity, delay = 0 }: { top: number; left?: string; right?: string; size: number; glowSize: number; glowOpacity: number; delay?: number }) {
  return (
    <div className="da-moon-glow pointer-events-none absolute z-0" style={{ top, left, right, width: size, height: size, animationDelay: `${delay}s` }} aria-hidden>
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#e3c56a", boxShadow: `0 0 ${glowSize}px 5px rgba(227,197,106,${glowOpacity})` }} />
      <div style={{ position: "absolute", top: -size * 0.09, left: size * 0.27, width: size, height: size * 1.18, borderRadius: 999, background: "#0e2419" }} />
    </div>
  );
}

/** the one record behind this programme, so a fee cannot drift here */
const P = getProgram("quran-classes");

const LANTERNS = [
  { top: 420, side: "left" as const, pos: "calc(50% - 380px)", stringH: 60, bodyW: 24, bodyH: 34, glow: 38, delay: 0.3, sway: 4.2 },
  { top: 760, side: "right" as const, pos: "calc(50% - 380px)", stringH: 80, bodyW: 26, bodyH: 36, glow: 42, delay: 0.7, sway: 4.8 },
  { top: 1180, side: "left" as const, pos: "calc(50% - 380px)", stringH: 55, bodyW: 22, bodyH: 32, glow: 36, delay: 1.1, sway: 4 },
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
          style={{ top: l.stringH - 8, width: l.glow, height: l.glow, background: "rgba(227,197,106,0.4)" }}
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

export function QuranRegister() {

  return (
    <div className="da-reg" style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
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

      {[
        { top: 40, side: "right" as const, pos: -70, size: 240, opacity: 0.4, twinkle: false, color: "rgba(201,162,39,0.18)" },
        { top: 640, side: "left" as const, pos: -90, size: 200, opacity: 0.35, twinkle: true, color: "rgba(120,190,150,0.18)" },
        { top: 1040, side: "right" as const, pos: -80, size: 220, opacity: 0.3, twinkle: false, color: "rgba(201,162,39,0.18)" },
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

      {/* crescent moons + twinkling stars, evening/weekend theme */}
      <CrescentMoon top={360} right="10%" size={44} glowSize={26} glowOpacity={0.2} />
      <CrescentMoon top={1200} left="8%" size={34} glowSize={20} glowOpacity={0.18} delay={0.6} />
      {[
        { top: 400, left: "14%", size: 2, dur: 2.8, delay: 0 },
        { top: 460, right: "22%", size: 2, dur: 3.2, delay: 0.5 },
        { top: 1240, right: "16%", size: 2, dur: 2.6, delay: 0.9 },
        { top: 8, left: "10px", size: 3, dur: 2.6, delay: 0 },
        { top: 60, left: "70px", size: 2, dur: 3.2, delay: 0.6 },
        { top: 120, right: "120px", size: 2, dur: 2.8, delay: 1 },
      ].map((s, i) => (
        <div
          key={i}
          className="da-twinkle pointer-events-none absolute z-0 rounded-full"
          style={{ top: s.top, left: s.left, right: s.right, width: s.size, height: s.size, background: "#f6f3ea", animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` } as React.CSSProperties}
          aria-hidden
        />
      ))}

      {LANTERNS.map((l, i) => (
        <Lantern key={i} l={l} />
      ))}

      {/* HERO PHOTO BAND */}
      <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/program-quran.jpg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "saturate(1.05) brightness(1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,20,15,0.3) 0%, rgba(9,20,15,0.55) 52%, rgba(11,26,18,0.85) 82%, #0e2419 100%)" }} />
      </div>

      <div className="da-page-gutter" style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "-108px auto 0", padding: "0 24px 64px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ width: 22, height: 1, background: "rgba(201,162,39,0.6)" }} />
          <span style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700 }}>{P.eyebrow}</span>
        </motion.div>

        <Breadcrumbs items={[{ label: "Programs", href: R.programs }, { label: "Quran classes", href: R.quran }, { label: "Register" }]} className="mb-5" />

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(32px,5vw,42px)", lineHeight: 1.1, color: "#f6f3ea", margin: "0 0 20px 0" }}
        >
          Register for {P.name}
        </motion.h1>

        <FactTiles
          schedule={P.facts[0].value}
          scheduleNote="Evening madrasa at the masjid"
          tuition={P.facts[2].value}
          tuitionNote="$25 off for each additional child of the same parents"
          accent="#d98f4a"
        />

        <CurriculumTrack title="The learning track" items={P.curriculum ?? []} accent="#d98f4a" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 18px", borderRadius: 12, background: "rgba(246,243,234,0.04)", border: "1px solid rgba(246,243,234,0.1)", marginBottom: 36 }}
        >
          <span style={{ color: "#c9a227", display: "flex", marginTop: 1 }} aria-hidden><Glyph name="note" size={14} /></span>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: 0 }}>
            Submitting this form starts registration. Our team will follow up by email or phone to confirm placement and fees.
          </p>
        </motion.div>

        <DaForm
          formName="quran-classes"
          subject="Quran classes registration"
          submitLabel="Submit registration"
          doneTitle="Registration received"
          doneScene="register"
          emailField="parentEmail"
          phoneField="emergencyContact"
          sections={FORM_SECTIONS}
          note="Submitting this form starts registration. The team follows up by email or phone to confirm placement and fees. Monthly fees are sent separately by e-transfer."
        />
      </div>
    </div>
  );
}
