"use client";

/**
 * Faithful, dedicated port of `Aalim Registration.dc.html` (not the shared
 * program/registration abstraction). Only the submit mechanism is real (the
 * source's static mailto: link can't carry entered field data), wired to the
 * site's shared submitForm() action instead.
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
const P = getProgram("aalim");

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

export function AalimRegister() {

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
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "saturate(1.05) brightness(1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(9,20,15,0.3) 0%, rgba(9,20,15,0.55) 52%, rgba(11,26,18,0.85) 82%, #0e2419 100%)" }} />
      </div>

      <div className="da-page-gutter" style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "-108px auto 0", padding: "0 24px 64px" }}>
        <Breadcrumbs items={[{ label: "Programs", href: R.programs }, { label: "Aalim", href: R.aalim }, { label: "Register" }]} className="mb-5" />
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

        <FactTiles
          schedule={P.facts[0].value}
          scheduleNote="Full-time, on site at Darul Arqum"
          tuition={P.facts[1].value}
          tuitionNote="Monthly, due at the start of each month"
          accent="#c9a227"
        />

        <CurriculumTrack title="The curriculum" items={P.curriculum ?? []} accent="#c9a227" />

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
          formName="aalim"
          subject="Aalim program registration"
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
