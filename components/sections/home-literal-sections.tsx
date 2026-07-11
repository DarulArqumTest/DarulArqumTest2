"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { X, Copy, Check } from "lucide-react";
import { ORG } from "@/lib/links";
import {
  PROGRAM_INFO,
  PROGRAM_ACCENT,
  PROGRAM_ACCENT_SOFT,
  PROGRAM_MODAL_BG,
  GeoMedallion,
  type ProgramKey,
} from "@/components/sections/home-literal";
import { SectionSpotlight, HomeHighlightContext } from "@/components/site/use-scroll-highlight";

/* ── animated counter ─────────────────────────────────────────── */

function useCountUp(targets: number[], start: boolean) {
  const [counted, setCounted] = React.useState(targets.map(() => 0));
  const started = React.useRef(false);
  React.useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    const duration = 1500;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    function step(now: number) {
      const t = Math.min(1, (now - t0) / duration);
      const e = ease(t);
      setCounted(targets.map((target) => Math.round(target * e)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);
  return counted;
}

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

/* ── Give modal (One-time/Monthly + 3 methods) ───────────────────── */

export type GiveModalState = {
  open: boolean;
  freq: "once" | "monthly";
  amount: string;
  method: "paypal" | "bank" | "etransfer" | null;
  etransferOnly: boolean;
};

export function useGiveModal() {
  const [state, setState] = React.useState<GiveModalState>({ open: false, freq: "monthly", amount: "", method: null, etransferOnly: false });
  const openOnce = React.useCallback(() => setState((s) => ({ ...s, open: true, freq: "once", method: null, etransferOnly: false })), []);
  const openMonthly = React.useCallback((amount?: number) => setState((s) => ({ ...s, open: true, freq: "monthly", method: null, etransferOnly: false, amount: amount != null ? String(amount) : s.amount })), []);
  const openEtransferOnly = React.useCallback(() => setState((s) => ({ ...s, open: true, method: "etransfer", etransferOnly: true })), []);
  const close = React.useCallback(() => setState((s) => ({ ...s, open: false, method: null, etransferOnly: false })), []);
  return { state, setState, openOnce, openMonthly, openEtransferOnly, close };
}

export function GiveModal({ state, setState, close }: { state: GiveModalState; setState: React.Dispatch<React.SetStateAction<GiveModalState>>; close: () => void }) {
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const amountMin = state.freq === "monthly" ? 20 : 1;
  const amountTooLow = state.amount !== "" && Number(state.amount) < amountMin;

  function copyEmail() {
    navigator.clipboard.writeText(ORG.email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  }

  const paypalContinueUrl = `/give/pledge?method=paypal&amount=${encodeURIComponent(state.amount || "0")}&freq=${state.freq}`;
  const padContinueUrl = `/give/pledge?method=bank&amount=${encodeURIComponent(state.amount || "0")}&freq=${state.freq}`;

  return (
    <AnimatePresence>
      {state.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: "rgba(6,16,11,0.7)", backdropFilter: "blur(6px)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "88vh", overflowY: "auto", background: "#122d20", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: 32, boxShadow: "0 30px 60px -12px rgba(0,0,0,0.5)" }}
          >
            <button onClick={close} aria-label="Close" style={{ position: "absolute", top: 18, right: 18, width: 32, height: 32, borderRadius: 999, background: "rgba(246,243,234,0.08)", border: "1px solid rgba(246,243,234,0.2)", color: "#f6f3ea", fontSize: 16, cursor: "pointer", lineHeight: 1 }}>
              ✕
            </button>

            <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a227", fontWeight: 600, marginBottom: 10 }}>
              {state.etransferOnly ? "Pay via Interac e-Transfer" : "Give to Darul Arqum"}
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 26, color: "#f6f3ea", margin: "0 0 22px 0" }}>Choose how you&apos;d like to give.</h3>

            <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 999, background: "rgba(246,243,234,0.06)", border: "1px solid rgba(246,243,234,0.14)", marginBottom: 16 }}>
              {(["once", "monthly"] as const).map((f) => (
                <div
                  key={f}
                  onClick={() => setState((s) => ({ ...s, freq: f }))}
                  style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 999, fontSize: 13.5, fontWeight: 600, cursor: "pointer", background: state.freq === f ? "#c9a227" : "transparent", color: state.freq === f ? "#0e2419" : "#f6f3ea" }}
                >
                  {f === "once" ? "One-time" : "Monthly"}
                </div>
              ))}
            </div>

            <label style={{ display: "block", fontSize: 11.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(246,243,234,0.55)", marginBottom: 8 }}>Amount</label>
            <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 24, background: "rgba(246,243,234,0.06)", border: "1px solid rgba(246,243,234,0.2)", borderRadius: 12, padding: "4px 16px" }}>
              <span style={{ fontSize: 20, color: "#c9a227", fontWeight: 600, fontFamily: "'Cormorant Garamond',serif" }}>$</span>
              <input
                value={state.amount}
                onChange={(e) => setState((s) => ({ ...s, amount: e.target.value.replace(/[^0-9]/g, "") }))}
                inputMode="numeric"
                placeholder={state.freq === "monthly" ? "20.00" : "1.00"}
                style={{ border: "none", background: "transparent", color: "#f6f3ea", fontSize: 20, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", padding: "10px 6px", width: "100%", outline: "none" }}
              />
            </div>
            {amountTooLow && (
              <div style={{ margin: "-16px 0 20px 4px", fontSize: 12, color: "#e08a8a" }}>
                Minimum amount is ${amountMin} or higher{state.freq === "monthly" ? " for monthly giving" : ""}.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!state.etransferOnly && (
                <>
                  <div style={{ borderRadius: 14, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(246,243,234,0.14)", overflow: "hidden" }}>
                    <div onClick={() => setState((s) => ({ ...s, method: s.method === "paypal" ? null : "paypal" }))} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", cursor: "pointer" }}>
                      <span style={{ width: 40, height: 26, flexShrink: 0, borderRadius: 6, background: "#003087", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>Pay</span>
                      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: "#f6f3ea" }}>Credit card via PayPal</span>
                      <span style={{ color: "rgba(246,243,234,0.5)", fontSize: 13 }}>＋</span>
                    </div>
                    {state.method === "paypal" && (
                      <div style={{ padding: "0 18px 18px" }}>
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: "0 0 14px 0" }}>
                          Opens the secure PayPal donate form in a new tab. For monthly giving, check &quot;Make this monthly donation&quot; once you&apos;re there.
                        </p>
                        <a href={paypalContinueUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#c9a227", color: "#0e2419", fontWeight: 600, fontSize: 13.5, padding: "11px 20px", borderRadius: 999 }}>
                          Continue to PayPal ↗
                        </a>
                      </div>
                    )}
                  </div>

                  <div style={{ borderRadius: 14, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(246,243,234,0.14)", overflow: "hidden" }}>
                    <div onClick={() => setState((s) => ({ ...s, method: s.method === "bank" ? null : "bank" }))} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", cursor: "pointer" }}>
                      <span style={{ width: 40, height: 28, flexShrink: 0, borderRadius: 6, background: "#2b2b2b", position: "relative", overflow: "hidden" }}>
                        <span style={{ position: "absolute", top: 6, left: 0, right: 0, height: 5, background: "#e8e8e8" }} />
                        <span style={{ position: "absolute", bottom: 5, left: 5, width: 12, height: 8, borderRadius: 2, background: "linear-gradient(135deg,#c9a227,#e3c56a)" }} />
                      </span>
                      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: "#f6f3ea" }}>Pre-authorized bank debit</span>
                      <span style={{ color: "rgba(246,243,234,0.5)", fontSize: 13 }}>＋</span>
                    </div>
                    {state.method === "bank" && (
                      <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: 0 }}>
                          Pre-authorized bank debit needs your banking details and a void cheque photo — you&apos;ll fill that out on the pledge page next.
                        </p>
                        <a href={padContinueUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#c9a227", color: "#0e2419", fontWeight: 600, fontSize: 13.5, padding: "11px 20px", borderRadius: 999 }}>
                          Continue to pledge page ↗
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div style={{ borderRadius: 14, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(246,243,234,0.14)", overflow: "hidden" }}>
                <div onClick={() => setState((s) => ({ ...s, method: s.method === "etransfer" ? null : "etransfer" }))} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", cursor: "pointer" }}>
                  <span style={{ width: 40, height: 26, flexShrink: 0, borderRadius: 6, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/interac-logo.png" alt="Interac" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </span>
                  <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: "#f6f3ea" }}>Interac e-Transfer</span>
                  <span style={{ color: "rgba(246,243,234,0.5)", fontSize: 13 }}>＋</span>
                </div>
                {(state.method === "etransfer" || state.etransferOnly) && (
                  <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "rgba(246,243,234,0.65)", margin: 0 }}>
                      Open your banking app and send an Interac e-Transfer for <strong style={{ color: "#c9a227" }}>${state.amount || "0"}</strong> to the email below. Autodeposit is enabled, so no security question is needed — just add your name in the message so we can match your donation to a tax receipt.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13.5, color: "rgba(246,243,234,0.8)", fontFamily: "monospace", background: "rgba(246,243,234,0.06)", padding: "8px 12px", borderRadius: 8 }}>{ORG.email}</span>
                      <button onClick={copyEmail} style={{ background: "transparent", color: "#a9e0c0", border: "1px solid rgba(120,190,150,0.4)", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 999, cursor: "pointer" }}>
                        {copiedEmail ? "Copied ✓" : "Copy email"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Program info modal ──────────────────────────────────────── */

function ProgramHero({ program }: { program: ProgramKey }) {
  const base: React.CSSProperties = { position: "relative", height: 150, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderBottom: "1px solid rgba(246,243,234,0.1)" };
  if (program === "aalim") {
    return (
      <div style={{ ...base, background: "radial-gradient(circle at 50% 40%, rgba(227,197,106,0.28), transparent 65%), #0e2419" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "repeating-linear-gradient(45deg, rgba(227,197,106,0.1) 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, rgba(227,197,106,0.1) 0 1px, transparent 1px 14px)" }} />
        <div style={{ position: "relative", width: 78, height: 78, borderRadius: 999, border: "1.5px solid rgba(227,197,106,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 6, borderRadius: 999, border: "1px solid rgba(227,197,106,0.3)" }} />
          <div style={{ position: "relative", width: 52, height: 52, zIndex: 1 }}>
            <div style={{ position: "absolute", left: 0, top: 9, width: 28, height: 28, borderRadius: 999, background: "#e3c56a" }} />
            <div style={{ position: "absolute", left: 8, top: 2, width: 30, height: 30, borderRadius: 999, background: "#0e2419" }} />
            <div style={{ position: "absolute", right: 2, top: 4, width: 2, height: 13, background: "#c9a227" }} />
            <div style={{ position: "absolute", right: -3, top: 17, width: 15, height: 18, borderRadius: 5, background: "linear-gradient(160deg, #e3c56a, #c9a227)", boxShadow: "0 0 14px 2px rgba(227,197,106,0.35)" }} />
            <div style={{ position: "absolute", right: 2.5, top: 21.5, width: 8, height: 10, background: "#fff3c4", borderRadius: 2, opacity: 0.85 }} />
          </div>
        </div>
      </div>
    );
  }
  if (program === "hifz" || program === "quran") {
    return (
      <div style={{ ...base, background: program === "hifz" ? "linear-gradient(180deg, rgba(217,143,74,0.3), rgba(14,36,25,0.85) 80%), #0e2419" : undefined, backgroundImage: program === "quran" ? "linear-gradient(180deg, rgba(8,16,12,0.3), rgba(8,16,12,0.94)), url('/assets/program-quran.jpg')" : undefined, backgroundSize: program === "quran" ? "cover" : undefined, backgroundPosition: program === "quran" ? "center 28%" : undefined }}>
        {program === "hifz" && (
          <>
            <div style={{ position: "absolute", inset: 0, opacity: 0.4, backgroundImage: "repeating-linear-gradient(0deg, rgba(217,143,74,0.18) 0 1px, transparent 1px 12px)" }} />
            <div style={{ position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)", width: 200, height: 100, opacity: 0.14 }}>
              <div style={{ position: "absolute", left: 0, width: 96, height: 90, border: "2px solid #d98f4a", borderRight: "none", borderRadius: "6px 0 0 0", transform: "skewY(3deg)" }} />
              <div style={{ position: "absolute", right: 0, width: 96, height: 90, border: "2px solid #d98f4a", borderLeft: "none", borderRadius: "0 6px 0 0", transform: "skewY(-3deg)" }} />
            </div>
          </>
        )}
        {program === "quran" && (
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f3d6a8", fontWeight: 700, background: "rgba(8,16,12,0.55)", padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(217,143,74,0.4)" }}>
            Evenings · in person
          </div>
        )}
        <div style={{ position: "relative", width: 42, height: 56, zIndex: 1, perspective: 340 }}>
          <div style={{ position: "relative", width: "100%", height: "100%", transform: "rotateY(-22deg) rotateX(4deg) rotate(-3deg)", transformStyle: "preserve-3d", filter: "drop-shadow(4px 10px 10px rgba(0,0,0,0.55))" }}>
            <div style={{ position: "absolute", top: 1, right: -4, width: 4, height: 54, background: "linear-gradient(90deg,#e8e2d0,#cfc8b2)", borderRadius: "0 2px 2px 0" }} />
            <div style={{ position: "absolute", top: 1.5, right: -3, width: 3, height: 53, background: "linear-gradient(90deg,#f3efe2,#ddd6c0)" }} />
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "2px 3px 3px 2px", overflow: "hidden", boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/quran-cover.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.06) 22%, transparent 45%)" }} />
              <div style={{ position: "absolute", top: 0, left: 0, width: 5, height: "100%", background: "linear-gradient(90deg, rgba(0,0,0,0.5), transparent)" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (program === "kids") {
    return (
      <div style={{ ...base, background: "radial-gradient(circle at 30% 30%, rgba(124,201,154,0.3), transparent 60%), #0e2419", borderRadius: "0 0 40% 40% / 0 0 24px 24px" }}>
        {[
          { top: 18, left: 36, size: 9, color: "rgba(124,201,154,0.5)" },
          { top: 64, left: 70, size: 6, color: "rgba(227,197,106,0.5)" },
          { top: 26, right: 52, size: 7, color: "rgba(124,201,154,0.4)" },
          { bottom: 20, right: 84, size: 10, color: "rgba(227,197,106,0.4)" },
          { bottom: 30, left: 90, size: 6, color: "rgba(124,201,154,0.4)" },
          { top: 44, left: 120, size: 5, color: "rgba(124,201,154,0.5)" },
        ].map((d, i) => (
          <div key={i} style={{ position: "absolute", top: d.top, left: d.left, right: d.right, bottom: d.bottom, width: d.size, height: d.size, borderRadius: 999, background: d.color }} />
        ))}
        <div className="da-float-slow" style={{ position: "relative", width: 64, height: 64, borderRadius: 999, background: "rgba(124,201,154,0.18)", border: "2px dashed rgba(124,201,154,0.6)", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span dir="rtl" lang="ar" style={{ fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: 20, color: "#7cc99a", lineHeight: 1, letterSpacing: -1, whiteSpace: "nowrap" }}>
            ا ب ت
          </span>
        </div>
      </div>
    );
  }
  // welearn
  return (
    <div style={{ ...base, background: "linear-gradient(160deg, rgba(45,140,255,0.24), transparent 72%), #0e2419" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: "linear-gradient(rgba(143,180,201,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(143,180,201,0.18) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <div style={{ position: "relative", width: 130, height: 88, borderRadius: 10, background: "#0d1f2a", border: "1px solid rgba(143,180,201,0.35)", boxShadow: "0 14px 30px -10px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ height: 16, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 4, padding: "0 8px" }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "#e35c5c" }} />
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "#e3c56a" }} />
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "#7cc99a" }} />
        </div>
        <div style={{ position: "absolute", top: 16, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 26, height: 26, borderRadius: 999, background: "#2D8CFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "9px solid #fff", marginLeft: 2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProgramModal({ program, onClose }: { program: ProgramKey | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!program) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [program, onClose]);

  const info = program ? PROGRAM_INFO[program] : null;
  const accent = program ? PROGRAM_ACCENT[program] : "#8fb4c9";
  const accentSoft = program ? PROGRAM_ACCENT_SOFT[program] : "rgba(143,180,201,0.16)";
  const modalBg = program ? PROGRAM_MODAL_BG[program] : PROGRAM_MODAL_BG.welearn;

  const registerHref = program === "aalim" ? "/programs/aalim/register" : program === "hifz" ? "/programs/hifz/register" : program === "kids" ? "/programs/kids-arabic/register" : "#";
  const registerLabel = program === "aalim" ? "Register for Aalim Program →" : program === "hifz" ? "Register for Quran Hifz →" : "Register for KidsLearnArabic →";
  const needsRegisterCta = program === "aalim" || program === "hifz" || program === "kids";

  return (
    <AnimatePresence>
      {info && program && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: "rgba(6,16,11,0.7)", backdropFilter: "blur(6px)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto", background: modalBg, border: `1px solid ${accent}55`, borderRadius: 20, boxShadow: "0 30px 60px -12px rgba(0,0,0,0.5)" }}
          >
            <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 18, right: 18, zIndex: 2, width: 32, height: 32, borderRadius: 999, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(246,243,234,0.3)", color: "#f6f3ea", fontSize: 16, cursor: "pointer", lineHeight: 1 }}>
              ✕
            </button>

            <ProgramHero program={program} />

            <div style={{ position: "relative", padding: "28px 32px 32px", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -50, width: 180, height: 180, opacity: 0.08, pointerEvents: "none" }}>
                <GeoMedallion size={180} opacity={1} />
              </div>

              <div style={{ position: "relative", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, fontWeight: 700, marginBottom: 12 }}>{info.eyebrow}</div>
              <h3 style={{ position: "relative", fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 30, color: "#f6f3ea", margin: "0 0 20px 0" }}>{info.title}</h3>

              <div style={{ position: "relative", padding: "2px 0 2px 18px", marginBottom: 22, borderLeft: `2.5px solid ${accent}` }}>
                <p style={{ fontSize: 16, lineHeight: 1.65, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontStyle: "italic", color: "#f6f3ea", margin: 0 }}>{info.lede}</p>
              </div>

              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 14, background: accentSoft, border: `1px solid ${accent}33`, marginBottom: 22 }}>
                <span style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 999, background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ position: "relative", width: 14, height: 14, borderRadius: 999, border: `1.6px solid ${accent}`, display: "block" }}>
                    <span style={{ position: "absolute", top: 1, left: 6, width: 1.4, height: 5, background: accent }} />
                    <span style={{ position: "absolute", top: 5.5, left: 6, width: 4, height: 1.4, background: accent }} />
                  </span>
                </span>
                <span style={{ fontSize: 13.5, color: "#f6f3ea", fontWeight: 600, lineHeight: 1.5 }}>{info.logistics}</span>
              </div>

              <div style={{ position: "relative", borderRadius: 14, background: "rgba(0,0,0,0.16)", border: "1px solid rgba(246,243,234,0.08)", padding: "18px 20px", marginBottom: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, fontWeight: 700, marginBottom: 10 }}>
                  <span style={{ width: 14, height: 1.5, background: accent, display: "inline-block" }} />
                  About the program
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(246,243,234,0.72)", margin: 0 }}>{info.body}</p>
              </div>

              {program === "welearn" && (
                <a href={info.zoomUrl} target="_blank" rel="noopener noreferrer" style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 14, width: "100%", background: "#2D8CFF", color: "#fff", padding: "14px 20px", borderRadius: 16, boxShadow: "0 10px 22px -10px rgba(45,140,255,0.6)", boxSizing: "border-box" }}>
                  <span style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: 999, background: "rgba(255,255,255,0.08)" }} />
                  <span style={{ position: "relative", width: 38, height: 38, flexShrink: 0, borderRadius: 10, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="6" width="14" height="12" rx="3" fill="#ffffff" />
                      <path d="M17 9.5L22 6.5V17.5L17 14.5V9.5Z" fill="#ffffff" />
                    </svg>
                  </span>
                  <span style={{ position: "relative", textAlign: "left", lineHeight: 1.3 }}>
                    <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>Join the live class</span>
                    <span style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>via Zoom ↗</span>
                  </span>
                </a>
              )}
              {program === "quran" && (
                <a href="/programs/quran-classes/register" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: "#1c1206", fontWeight: 700, fontSize: 14.5, padding: "16px 0", borderRadius: 16, boxShadow: `0 10px 22px -10px ${accent}80`, boxSizing: "border-box" }}>
                  Go to registration page <span aria-hidden="true">→</span>
                </a>
              )}
              {needsRegisterCta && (
                <a href={registerHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: "#1c1206", fontWeight: 700, fontSize: 14.5, padding: "16px 0", borderRadius: 16, boxShadow: `0 10px 22px -10px ${accent}80`, boxSizing: "border-box" }}>
                  {registerLabel}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── welearn desk-scene illustration ─────────────────────────── */

function WelearnDesk({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ cursor: "pointer", position: "relative", minHeight: 220, padding: 0, borderRadius: 16, overflow: "hidden", background: "linear-gradient(100deg, #8a6a44 0%, #6b4f30 50%, #55391f 100%)", border: "1px solid rgba(201,162,39,0.3)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(100deg, rgba(0,0,0,0.08) 0px, transparent 2px, transparent 34px, rgba(0,0,0,0.08) 36px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 20, left: 20, width: 64, height: 80, borderRadius: 3, background: "linear-gradient(115deg, #8a2020, #6b1414)", boxShadow: "0 6px 14px rgba(0,0,0,0.35)", transform: "rotate(-6deg)" }}>
        <div style={{ position: "absolute", inset: 4, border: "1px solid rgba(227,197,106,0.6)" }} />
        <div style={{ position: "absolute", left: 6, top: 6, right: 6, height: 1, background: "repeating-linear-gradient(90deg, #e3c56a 0 4px, transparent 4px 8px)", opacity: 0.7 }} />
      </div>
      <div style={{ position: "absolute", top: 34, left: 14, width: 58, height: 5, borderRadius: 3, background: "linear-gradient(90deg, #1c2126, #3a4048)", transform: "rotate(-6deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", top: 32, left: 10, width: 9, height: 9, borderRadius: 999, background: "#cfd4d8", transform: "rotate(-6deg)" }} />
      <div style={{ position: "absolute", bottom: 18, left: 16, width: 70, height: 26 }}>
        <div style={{ position: "absolute", left: 0, top: 4, width: 26, height: 20, borderRadius: 999, border: "2.5px solid #1c2126", opacity: 0.85 }} />
        <div style={{ position: "absolute", right: 0, top: 4, width: 26, height: 20, borderRadius: 999, border: "2.5px solid #1c2126", opacity: 0.85 }} />
        <div style={{ position: "absolute", left: 24, top: 10, width: 22, height: 2.5, background: "#1c2126", opacity: 0.85 }} />
      </div>
      <div style={{ position: "absolute", top: 16, right: 18, width: 132, height: 96, borderRadius: 12, background: "#15181c", boxShadow: "0 14px 30px -8px rgba(0,0,0,0.5)", transform: "rotate(3deg)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ position: "absolute", inset: 6, borderRadius: 8, background: "linear-gradient(160deg, #1a3c2a, #0e2419)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <div style={{ width: 26, height: 26, borderRadius: 999, background: "rgba(227,197,106,0.18)", border: "1px solid rgba(227,197,106,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "9px solid #e3c56a", marginLeft: 2 }} />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 13, color: "#f6f3ea", letterSpacing: "0.01em" }}>welearn</span>
        </div>
        <div style={{ position: "absolute", bottom: -3, left: "50%", transform: "translateX(-50%)", width: 26, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.12)" }} />
      </div>
      <div style={{ position: "absolute", top: 70, right: 24, width: 44, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #c9a227, #8a6a1e)", transform: "rotate(18deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "relative", background: "rgba(20,14,8,0.55)", marginTop: "auto", padding: "16px 24px 20px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700, marginBottom: 4 }}>Online · Zoom</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 19, color: "#fff", margin: "0 0 4px 0" }}>welearn</h3>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", margin: 0 }}>Live classes with Sheikh Saud Hasan.</p>
      </div>
    </div>
  );
}

/* ── Giving section ──────────────────────────────────────────── */

export function GivingSection({ onOpenOnce, onOpenMonthly, onOpenMonthly60 }: { onOpenOnce: () => void; onOpenMonthly: () => void; onOpenMonthly60: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [parking, qard] = useCountUp([20000, 144000], inView);
  const ease = [0.16, 0.8, 0.4, 1] as const;
  const ctx = React.useContext(HomeHighlightContext);

  return (
    <section ref={ref} id="giving-section" style={{ position: "relative", width: "100%", padding: "120px 28px", overflow: "hidden", background: "#0a1f15", scrollMarginTop: 80 }}>
      <div className="da-float-slow" style={{ position: "absolute", width: 460, height: 460, borderRadius: 999, top: "10%", right: "-10%", background: "radial-gradient(circle, rgba(201,162,39,0.14), transparent 72%)", filter: "blur(6px)" }} />
      <div className="da-float-slow" style={{ position: "absolute", width: 380, height: 380, borderRadius: 999, bottom: "-10%", left: "-6%", background: "radial-gradient(circle, rgba(60,140,100,0.18), transparent 72%)", filter: "blur(6px)", animationDelay: "2s" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", display: "flex", gap: 56, flexWrap: "wrap", alignItems: "center" }}>
        {ctx && <SectionSpotlight id="giving-section" nonce={ctx.nonce} active={ctx.isHighlighted("giving-section")} />}
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease }} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 26, height: 1, background: "rgba(201,162,39,0.6)" }} />
            <span style={{ fontSize: 12.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 600 }}>Sadaqah Jariyah</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1, ease }} style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.12, color: "#f6f3ea", margin: "0 0 22px 0", maxWidth: 520 }}>
            Sixty dollars, one family, <span style={{ color: "#c9a227", fontStyle: "italic" }}>every month.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease }} style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(246,243,234,0.72)", maxWidth: 480, margin: "0 0 36px 0" }}>
            The community purchased this property outright in 2020 and carries a Qard-e-Hasan.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3, ease }} style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <button onClick={onOpenOnce} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#c9a227", color: "#0e2419", fontWeight: 600, fontSize: 15, padding: "15px 28px", borderRadius: 999, border: "none", cursor: "pointer" }}>
              Donate now <span aria-hidden="true">↗</span>
            </button>
            <button onClick={onOpenMonthly} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "transparent", color: "#f6f3ea", fontWeight: 500, fontSize: 15, padding: "15px 28px", borderRadius: 999, border: "1px solid rgba(246,243,234,0.3)", cursor: "pointer" }}>
              Set up a monthly pledge
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          style={{ flex: "1 1 320px", minWidth: 280, display: "flex", flexDirection: "column", gap: 1, background: "rgba(246,243,234,0.12)", border: "1px solid rgba(201,162,39,0.28)", borderRadius: 16, overflow: "hidden" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(246,243,234,0.12)" }}>
            <div style={{ background: "#0e2419", padding: "32px 28px" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(26px,2.6vw,34px)", color: "#c9a227", marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>{fmt(parking)}</div>
              <div style={{ fontSize: 12.5, color: "rgba(246,243,234,0.6)" }}>Parking lot renovation</div>
            </div>
            <div style={{ background: "#0e2419", padding: "32px 28px" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(26px,2.6vw,34px)", color: "#c9a227", marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>{fmt(qard)}</div>
              <div style={{ fontSize: 12.5, color: "rgba(246,243,234,0.6)" }}>Qard-e-Hasan remaining</div>
            </div>
          </div>
          <div style={{ background: "linear-gradient(120deg, rgba(201,162,39,0.22), rgba(201,162,39,0.1))", padding: "26px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700 }}>Fun fact</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: "clamp(30px,3vw,38px)", color: "#f6f3ea", whiteSpace: "nowrap" }}>$60</div>
              <div style={{ width: 1, alignSelf: "stretch", background: "rgba(201,162,39,0.35)" }} />
              <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "rgba(246,243,234,0.85)", fontWeight: 500 }}>If every family gave just $60 a month, it would cover the loan and running costs — together.</div>
            </div>
            <button onClick={onOpenMonthly60} style={{ alignSelf: "flex-start", background: "#0e2419", color: "#f6f3ea", border: "1px solid rgba(201,162,39,0.4)", fontSize: 12.5, fontWeight: 600, padding: "9px 18px", borderRadius: 999, cursor: "pointer" }}>
              I can do that — give $60/month
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Programs section (institute frame + whatsapp) ───────────── */

export function ProgramsSection({ onOpen }: { onOpen: (p: ProgramKey) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const ease = [0.16, 0.8, 0.4, 1] as const;
  const ctx = React.useContext(HomeHighlightContext);
  const welearnHighlighted = ctx?.isHighlighted("welearn-card") ?? false;

  // The footer's "welearn" link scrolls straight to this card and should
  // also open its program modal, rather than just landing on the section.
  React.useEffect(() => {
    if (welearnHighlighted) onOpen("welearn");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welearnHighlighted]);

  return (
    <section ref={ref} id="programs-section" style={{ position: "relative", width: "100%", padding: "120px 28px", overflow: "hidden", background: "#0e2419", scrollMarginTop: 80 }}>
      <div className="da-float-slow" style={{ position: "absolute", width: 520, height: 520, borderRadius: 999, top: "-14%", left: "-8%", background: "radial-gradient(circle, rgba(201,162,39,0.12), transparent 72%)", filter: "blur(6px)" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease }} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ width: 26, height: 1, background: "rgba(201,162,39,0.6)" }} />
            <span style={{ fontSize: 12.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 600 }}>Programs &amp; news</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1, ease }} style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.12, color: "#f6f3ea", margin: "0 0 52px 0", maxWidth: 640 }}>
            We offer learning for every age, <span style={{ color: "#c9a227", fontStyle: "italic" }}>every week.</span>
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.18, ease }} style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(201,162,39,0.3)", background: "#0e2419", padding: 8 }}>
            <div style={{ position: "relative", padding: "26px 30px 24px" }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a227", fontWeight: 600, marginBottom: 10 }}>Al-Arif Islamic Institute</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 30, color: "#f6f3ea", margin: "0 0 4px 0" }}>Five programs, one madrasa</h3>
              <p style={{ fontSize: 13.5, color: "rgba(246,243,234,0.55)", margin: 0 }}>Led by Mufti Taqi and our teaching team — choose the track that fits, at any age.</p>
            </div>

            <div style={{ padding: "0 6px 6px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Aalim — flagship */}
              <div
                onClick={() => onOpen("aalim")}
                style={{ cursor: "pointer", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 220, padding: "28px 34px", overflow: "hidden", borderRadius: 16, backgroundImage: "linear-gradient(100deg, rgba(8,18,13,0.92) 0%, rgba(9,18,13,0.6) 45%, rgba(9,18,13,0.25) 100%), url('/assets/program-aalim.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%" }}
              >
                <div style={{ position: "absolute", top: 26, right: 30, width: 48, height: 48, borderRadius: 999, background: "rgba(14,36,25,0.6)", border: "1.5px solid rgba(201,162,39,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 22, height: 22 }}>
                    <div style={{ position: "absolute", left: 0, top: 3, width: 12, height: 12, borderRadius: 999, background: "#e3c56a" }} />
                    <div style={{ position: "absolute", left: 3.5, top: 0.5, width: 13, height: 13, borderRadius: 999, background: "#0e2419" }} />
                  </div>
                </div>
                <div style={{ position: "relative", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 8 }}>Al-Arif Islamic Institute · flagship</div>
                <h4 style={{ position: "relative", fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 24, color: "#f6f3ea", margin: "0 0 6px 0" }}>Aalim program</h4>
                <p style={{ position: "relative", fontSize: 13.5, lineHeight: 1.6, color: "rgba(246,243,234,0.75)", margin: "0 0 10px", maxWidth: 520 }}>Classical studies — Sarf &amp; Nahw, Quran, Hadith, Fiqh and Aqa&apos;id — a full academic path toward becoming a scholar.</p>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "#e3c56a", fontWeight: 600, background: "rgba(201,162,39,0.16)", border: "1px solid rgba(201,162,39,0.35)", padding: "6px 14px", borderRadius: 999, width: "fit-content" }}>
                  Monday–Friday <span style={{ opacity: 0.5 }}>·</span> $150/mo
                </div>
              </div>

              {/* Quran Studies split hero */}
              <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", minHeight: 260, display: "flex", flexDirection: "column", backgroundImage: "linear-gradient(190deg, rgba(8,18,13,0.45) 0%, rgba(9,18,13,0.8) 65%, #0e2419 95%), url('/assets/program-quran.jpg')", backgroundSize: "cover", backgroundPosition: "center 26%" }}>
                <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "24px 16px 0", pointerEvents: "none" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d98f4a", fontWeight: 700, marginBottom: 6 }}>Al-Arif Islamic Institute</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 24, color: "#f6f3ea", margin: 0 }}>Quran studies</h3>
                </div>
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", flex: 1, marginTop: 20 }}>
                  <div onClick={() => onOpen("hifz")} style={{ flex: "1 1 200px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "22px 24px", background: "rgba(0,0,0,0.22)", borderRight: "1px solid rgba(255,255,255,0.14)", boxShadow: "inset 3px 0 0 rgba(217,143,74,0.5)" }}>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d98f4a", fontWeight: 700, marginBottom: 6 }}>Full-time · flagship</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 20, color: "#f6f3ea", marginBottom: 6 }}>Hifz program</div>
                    <p style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(246,243,234,0.75)", margin: "0 0 8px 0" }}>Full-time memorization of the Qur&apos;an with tajweed and Islamic studies.</p>
                    <div style={{ fontSize: 11, color: "#f3d6a8", fontWeight: 600, marginBottom: 10 }}>Monday–Friday · $75/mo</div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#f6f3ea", fontSize: 12.5, fontWeight: 700 }}>Learn more →</span>
                  </div>
                  <div onClick={() => onOpen("quran")} style={{ flex: "1 1 200px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "22px 24px", background: "rgba(0,0,0,0.36)" }}>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(246,243,234,0.6)", fontWeight: 700, marginBottom: 6 }}>Weekends</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 20, color: "#f6f3ea", marginBottom: 6 }}>Weekend classes</div>
                    <p style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(246,243,234,0.7)", margin: "0 0 8px 0" }}>Quran reading &amp; tajweed for all ages.</p>
                    <div style={{ fontSize: 11, color: "rgba(246,243,234,0.65)", fontWeight: 600, marginBottom: 10 }}>Saturday &amp; Sunday · $50/mo</div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#f6f3ea", fontSize: 12.5, fontWeight: 600 }}>Learn more →</span>
                  </div>
                </div>
              </div>

              {/* Kids + welearn */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div
                  onClick={() => onOpen("kids")}
                  style={{ cursor: "pointer", position: "relative", minHeight: 220, padding: 22, borderRadius: 16, overflow: "hidden", backgroundImage: "linear-gradient(160deg, rgba(10,20,15,0.5) 0%, rgba(9,18,13,0.8) 40%, rgba(8,16,12,0.98) 65%, rgba(8,16,12,0.98) 100%), url('/assets/program-kids.jpg')", backgroundSize: "cover", backgroundPosition: "center 20%", border: "1px solid rgba(120,190,150,0.25)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
                >
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700, marginBottom: 4 }}>Ages 5–10</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 19, color: "#fff", margin: "0 0 4px 0" }}>KidsLearnArabic</h3>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", margin: 0 }}>Playful, structured Arabic for young learners.</p>
                </div>
                <div id="welearn-card" style={{ position: "relative" }}>
                  {ctx && <SectionSpotlight id="welearn-card" nonce={ctx.nonce} active={ctx.isHighlighted("welearn-card")} />}
                  <WelearnDesk onClick={() => onOpen("welearn")} />
                </div>
              </div>
            </div>
          </motion.div>

          <div id="whatsapp-section" style={{ position: "relative", marginTop: 20, display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", padding: "26px 30px", borderRadius: 20, background: "linear-gradient(120deg, rgba(80,160,120,0.14), rgba(80,160,120,0.04))", border: "1px solid rgba(120,190,150,0.25)" }}>
            <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 999, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/whatsapp-icon.png" alt="WhatsApp" style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.16)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 19, color: "#f6f3ea", margin: "0 0 4px 0" }}>New to the community?</h3>
              <p style={{ fontSize: 13.5, color: "rgba(246,243,234,0.68)", margin: 0 }}>Join the WhatsApp group for Iqama alerts and announcements — or come see the masjid. Everyone is welcome.</p>
            </div>
            <a href="https://chat.whatsapp.com/F7LaeeNTGIlBPxJndDpEny" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, background: "#25D366", color: "#0e2419", fontWeight: 600, fontSize: 13.5, padding: "12px 22px", borderRadius: 999 }}>
              Join the group ↗
            </a>
            {ctx && <SectionSpotlight id="whatsapp-section" nonce={ctx.nonce} active={ctx.isHighlighted("whatsapp-section")} />}
          </div>
          {ctx && <SectionSpotlight id="programs-section" nonce={ctx.nonce} active={ctx.isHighlighted("programs-section")} />}
        </div>
      </div>
    </section>
  );
}

/* ── Contact section ──────────────────────────────────────────── */

function CopyBtn({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      style={{ background: "transparent", color: "#a9e0c0", border: "1px solid rgba(120,190,150,0.4)", fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap" }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export function ContactSection() {
  const ctx = React.useContext(HomeHighlightContext);
  return (
    <section id="contact-us" style={{ position: "relative", width: "100%", padding: "120px 28px", overflow: "hidden", background: "#0a1f15", scrollMarginTop: 80 }}>
      <div className="da-float-slow" style={{ position: "absolute", width: 460, height: 460, borderRadius: 999, top: "-12%", right: "-8%", background: "radial-gradient(circle, rgba(201,162,39,0.14), transparent 72%)", filter: "blur(6px)" }} />
      <div className="da-float-slow" style={{ position: "absolute", width: 380, height: 380, borderRadius: 999, bottom: "-14%", left: "-8%", background: "radial-gradient(circle, rgba(60,140,100,0.18), transparent 72%)", filter: "blur(6px)", animationDelay: "2s" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ position: "relative" }}>
          {ctx && <SectionSpotlight id="contact-us" nonce={ctx.nonce} active={ctx.isHighlighted("contact-us")} />}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ width: 26, height: 1, background: "rgba(201,162,39,0.6)" }} />
            <span style={{ fontSize: 12.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 600 }}>Contact us</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.12, color: "#f6f3ea", margin: "0 0 52px 0", maxWidth: 640 }}>
            Come <span style={{ color: "#c9a227", fontStyle: "italic" }}>visit us,</span> or reach out anytime.
          </h2>

          <div style={{ display: "grid", gap: 20 }} className="da-contact-grid">
            <div id="map-section" style={{ position: "relative", height: "100%" }}>
              {ctx && <SectionSpotlight id="map-section" nonce={ctx.nonce} active={ctx.isHighlighted("map-section")} />}
              <div style={{ borderRadius: 20, overflow: "hidden", background: "rgba(246,243,234,0.04)", border: "1px solid rgba(246,243,234,0.12)", display: "flex", flexDirection: "column", height: "100%" }}>
                <iframe
                  title="Darul Arqum location"
                  src="https://www.google.com/maps?q=Darul+Arqum+Markaz+of+Ottawa,+4269+Limebank+Rd,+Ottawa,+ON+K1V+1G5&output=embed"
                  style={{ width: "100%", flex: 1, minHeight: 180, border: 0, display: "block" }}
                  loading="lazy"
                />
                <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", flexShrink: 0 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 6 }}>Visit the masjid</div>
                    <div style={{ fontSize: 16, color: "#f6f3ea", fontWeight: 600 }}>4269 Limebank Rd, Ottawa, ON K1V 1G5</div>
                  </div>
                  <a href="https://maps.app.goo.gl/7WWyowUrajYGgNv16" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, background: "#c9a227", color: "#0e2419", fontWeight: 700, fontSize: 13, padding: "11px 20px", borderRadius: 999 }}>
                    Get directions ↗
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
              <div style={{ borderRadius: 20, padding: 22, background: "linear-gradient(150deg, rgba(80,160,120,0.22), rgba(80,160,120,0.06))", border: "1px solid rgba(120,190,150,0.35)", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 999, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/phone-icon.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a9e0c0", fontWeight: 700, marginBottom: 6 }}>Call us</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 15, color: "#f6f3ea", fontWeight: 700 }}>613-709-2329</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                      <CopyBtn label="Copy" value="613-709-2329" />
                      <a href="tel:+16137092329" style={{ display: "inline-flex", alignItems: "center", background: "#7cc99a", color: "#0e2419", fontWeight: 700, fontSize: 11, padding: "6px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>
                        Call ↗
                      </a>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 6 }}>
                    <span style={{ fontSize: 13, color: "rgba(246,243,234,0.75)", fontWeight: 600 }}>819-360-5936</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                      <CopyBtn label="Copy" value="819-360-5936" />
                      <a href="tel:+18193605936" style={{ display: "inline-flex", alignItems: "center", background: "#7cc99a", color: "#0e2419", fontWeight: 700, fontSize: 11, padding: "6px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>
                        Call ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <a href="mailto:admin@darularqum.org" style={{ borderRadius: 20, padding: 22, background: "linear-gradient(150deg, rgba(201,162,39,0.22), rgba(201,162,39,0.06))", border: "1px solid rgba(227,197,106,0.35)", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 999, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/email-icon.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700, marginBottom: 4 }}>Email us</div>
                  <div style={{ fontSize: 16, color: "#f6f3ea", fontWeight: 700, whiteSpace: "nowrap" }}>admin@darularqum.org</div>
                </div>
              </a>

              <div style={{ borderRadius: 20, padding: "24px 26px", background: "linear-gradient(120deg, #2b210c, #1a1508)", border: "1px solid rgba(201,162,39,0.45)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 999, background: "rgba(201,162,39,0.25)", border: "1.5px solid rgba(227,197,106,0.6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e3c56a", fontSize: 18 }}>✦</div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700, marginBottom: 3 }}>CRA registered charity</div>
                    <span style={{ fontSize: 19, color: "#f6f3ea", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.02em" }}>709549687RR0001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
