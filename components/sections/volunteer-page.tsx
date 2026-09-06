"use client";

/**
 * Faithful, dedicated port of `Volunteer Registration.dc.html`. Only the
 * submit mechanism is real (the source's static mailto: link can't carry
 * entered field data), wired to the shared submitForm() action instead.
 */

import * as React from "react";
import { DaForm, type Section } from "@/components/site/da-form";

const dotGrid: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(246,243,234,0.05) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};
import { Glyph } from "@/components/site/program-glyphs";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { VolunteerHero } from "@/components/site/volunteer-hero";
import Link from "next/link";
import { motion } from "motion/react";
import { ORG } from "@/lib/links";



function CheckboxRow({ name, label, accent }: { name: string; label: string; accent: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(246,243,234,0.14)", fontSize: 13.5, color: "rgba(246,243,234,0.85)", cursor: "pointer" }}>
      <input type="checkbox" name={name} style={{ width: 16, height: 16, accentColor: accent }} /> {label}
    </label>
  );
}

const AVAILABILITY = ["Weekday mornings", "Weekday evenings", "Weekends", "Jumu'ah & special events"];
const INTERESTS = ["Event organizing", "Maintenance & facilities", "Madrasa teaching assistant", "IT & media", "Fundraising", "Kitchen & hospitality"];

/** what this page asks for; everything else lives in DaForm */
const FORM_SECTIONS: Section[] = [
  {
    kind: "student",
    title: "Your details",
    glyph: "student",
    fields: [
      { name: "Full name", label: "Full name", required: true, half: true },
      { name: "Gender", label: "Gender", type: "select", required: true, half: true, options: ["Male", "Female"] },
      { name: "email", label: "Email", type: "email", required: true, half: true, placeholder: "you@example.com" },
      { name: "Phone", label: "Phone number", type: "tel", required: true, half: true, placeholder: "(613) 555-0123" },
    ],
  },
  {
    kind: "parents",
    title: "Your availability",
    glyph: "calendar",
    lede: "Select every option that works for you.",
    fields: [
      { name: "Availability", label: "When you are free", type: "checkboxes", options: ["Weekday mornings", "Weekday evenings", "Weekends", "Jumu'ah & special events"] },
    ],
  },
  {
    kind: "background",
    title: "Where you'd like to help",
    glyph: "character",
    lede: "Pick as many as you like — the team will find you a place.",
    fields: [
      { name: "Interest", label: "Areas of interest", type: "checkboxes", options: ["Event organizing", "Maintenance & facilities", "Madrasa teaching assistant", "IT & media", "Fundraising", "Kitchen & hospitality"] },
      { name: "Notes", label: "Skills or notes (optional)", type: "textarea", rows: 3, placeholder: "Anything else you'd like us to know" },
      { name: "Newsletter", label: "Newsletter", type: "checkboxes", options: ["Subscribe me to the Darul Arqum newsletter"] },
    ],
  },
];

export function VolunteerPage() {

  return (
    <div className="da-reg" style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
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

      {/* HERO: the hall being set up, the night before */}
      <div className="da-vol-hero-wrap">
        <VolunteerHero />
        <Link href="/" className="da-vol-back">
          <span aria-hidden="true">←</span> Back to Darul Arqum
        </Link>
        <div className="da-vol-hero-text">
          <div className="da-vol-kicker">
            <span aria-hidden />
            Serve your community
            <span aria-hidden />
          </div>
          <Breadcrumbs items={[{ label: "Community" }]} className="mb-4" />
          <h1 className="da-vol-h1">Join Darul Arqum</h1>
          <p className="da-vol-sub">
            Somebody put the chairs out before you arrived. Come and be that somebody.
          </p>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 660, margin: "0 auto", padding: "36px 24px 64px" }}>
        <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(246,243,234,0.72)", textAlign: "center", margin: "0 0 30px 0" }}>
          &quot;Whoever loves the masjid, Allah loves him.&quot; The masjid runs on people who
          give their time — teaching, events, maintenance, hospitality. Tell us where
          you&apos;d like to help and the team will find you a place.
        </p>

        <DaForm
          formName="volunteer"
          subject="Volunteer application"
          submitLabel="Submit application"
          doneTitle="Application received"
          emailField="email"
          phoneField="Phone"
          sections={FORM_SECTIONS}
          note="We'll be in touch about what is coming up and where an extra pair of hands would help most."
        />
      </div>
    </div>
  );
}
