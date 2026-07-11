"use client";

/**
 * Literal, line-for-line port of `Pledge.dc.html` — the most behaviorally
 * complex page in the redesign. Deviation from source: the Bank/PAD
 * "submit" button goes through the real `submitForm("pledge", ...)` server
 * action instead of the prototype's raw `mailto:` link (visually identical).
 */

import * as React from "react";
import Link from "next/link";
import { ORG, R } from "@/lib/links";
import { submitForm } from "@/app/actions/submit";
import { isValidEmail, isValidPhone } from "@/lib/validate";

const errorStyle: React.CSSProperties = { marginTop: 5, fontSize: 12, color: "#e08a8a" };

type Method = "paypal" | "bank" | "etransfer" | null;
type Freq = "once" | "monthly";

function PledgeLantern({
  width,
  height,
  top,
  left,
  right,
  stringHeight,
  glowSize,
  glowBlur,
  fillOpacity,
  circleR,
  circleOpacity = 0.85,
  svgOpacity = 1,
  swing,
  swingDelay = 0,
  floatDur,
  floatDelay = 0,
}: {
  width: number;
  height: number;
  top: string;
  left?: string;
  right?: string;
  stringHeight?: number;
  glowSize: number;
  glowBlur: number;
  fillOpacity: number;
  circleR: number;
  circleOpacity?: number;
  svgOpacity?: number;
  swing?: number;
  swingDelay?: number;
  floatDur?: number;
  floatDelay?: number;
}) {
  const anim = swing
    ? { animation: "da-lantern-sway 6s ease-in-out infinite", animationDuration: `${swing}s`, animationDelay: `${swingDelay}s`, transformOrigin: "top center" as const }
    : { animation: "da-float-slow 8s ease-in-out infinite", animationDuration: `${floatDur}s`, animationDelay: `${floatDelay}s` };
  return (
    <div style={{ position: "absolute", top, left, right, ...anim }} aria-hidden>
      {stringHeight != null && <div style={{ width: 1, height: stringHeight, background: "rgba(201,162,39,0.35)", margin: "0 auto" }} />}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: stringHeight != null ? 8 : 4,
            left: "50%",
            transform: "translateX(-50%)",
            width: glowSize,
            height: glowSize,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(227,197,106,0.5), transparent 72%)",
            filter: `blur(${glowBlur}px)`,
          }}
        />
        <svg width={width} height={height} viewBox="0 0 26 34" style={{ position: "relative", opacity: svgOpacity }}>
          <path d="M6 4 H20 L23 10 V24 L20 30 H6 L3 24 V10 Z" fill={`rgba(201,162,39,${fillOpacity})`} stroke="#c9a227" strokeWidth={1} />
          <line x1="6" y1="10" x2="20" y2="10" stroke="#c9a227" strokeWidth={0.75} />
          <line x1="6" y1="24" x2="20" y2="24" stroke="#c9a227" strokeWidth={0.75} />
          <circle cx="13" cy="17" r={circleR} fill="#e3c56a" opacity={circleOpacity} />
          <path d="M9 30 L13 34 L17 30 Z" fill="#c9a227" />
        </svg>
      </div>
    </div>
  );
}

const TWINKLES = [
  { top: "5%", left: "22%", size: 4, dur: 3.4, delay: 0 },
  { top: "9%", left: "44%", size: 3, dur: 2.6, delay: 0.6 },
  { top: "14%", right: "26%", size: 4, dur: 4, delay: 1.1 },
  { top: "22%", left: "8%", size: 3, dur: 3, delay: 0.3 },
  { top: "30%", right: "15%", size: 3, dur: 3.6, delay: 1.6 },
  { top: "36%", left: "30%", size: 3, dur: 2.8, delay: 0.9 },
  { top: "46%", right: "32%", size: 3, dur: 3.2, delay: 1.4 },
  { top: "52%", left: "16%", size: 4, dur: 3.8, delay: 0.2 },
  { top: "60%", left: "40%", size: 3, dur: 2.9, delay: 1.2 },
  { top: "68%", right: "20%", size: 4, dur: 3.5, delay: 0.5 },
  { top: "74%", left: "22%", size: 3, dur: 3.1, delay: 1.7 },
  { top: "82%", right: "36%", size: 3, dur: 2.7, delay: 0.7 },
  { top: "92%", left: "48%", size: 4, dur: 3.9, delay: 1.3 },
  { top: "96%", right: "12%", size: 3, dur: 3.3, delay: 0.4 },
];

export function PledgePage() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [amountFocused, setAmountFocused] = React.useState(false);
  const [freq, setFreq] = React.useState<Freq>("once");
  const [method, setMethod] = React.useState<Method>(null);
  const [anonymous, setAnonymous] = React.useState(false);
  const [bankAnonNotice, setBankAnonNotice] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [highlight, setHighlight] = React.useState(false);

  const [padBankName, setPadBankName] = React.useState("");
  const [padInstitution, setPadInstitution] = React.useState("");
  const [padTransit, setPadTransit] = React.useState("");
  const [padAccount, setPadAccount] = React.useState("");
  const [padDay, setPadDay] = React.useState("");
  const [padAddress, setPadAddress] = React.useState("");
  const [padSignature, setPadSignature] = React.useState("");
  const [padComments, setPadComments] = React.useState("");
  const [padState, setPadState] = React.useState<"idle" | "busy" | "done">("idle");
  const [padDelivered, setPadDelivered] = React.useState(false);

  const fillTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const m = q.get("method");
    if (m === "paypal" || m === "bank" || m === "etransfer") setMethod(m);
    const a = (q.get("amount") || "").replace(/[^0-9]/g, "");
    if (a && a !== "0") setAmount(a);
    if (q.get("freq") === "monthly") setFreq("monthly");
  }, []);

  const fillSixtyMonthly = () => {
    if (fillTimer.current) clearInterval(fillTimer.current);
    document.getElementById("pledge-amount-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFreq("monthly");
    setHighlight(true);
    setAmount("0");
    const target = 60;
    const startTime = Date.now();
    const duration = 700;
    fillTimer.current = setInterval(() => {
      const t = Math.min(1, (Date.now() - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAmount(String(Math.round(eased * target)));
      if (t >= 1) {
        if (fillTimer.current) clearInterval(fillTimer.current);
        fillTimer.current = null;
        setTimeout(() => setHighlight(false), 900);
      }
    }, 25);
  };

  const setMethodPaypal = () => setMethod((m) => (m === "paypal" ? null : "paypal"));
  const setMethodBank = () => {
    const willOpen = method !== "bank";
    const wasAnonymous = anonymous;
    setMethod(willOpen ? "bank" : null);
    setAnonymous(willOpen ? false : anonymous);
    setBankAnonNotice(willOpen && wasAnonymous);
  };
  const setMethodEtransfer = () => setMethod((m) => (m === "etransfer" ? null : "etransfer"));
  const resetMethod = () => setMethod(null);
  const dismissBankAnonNotice = () => setBankAnonNotice(false);
  const onToggleAnonymous = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (method === "bank") return;
    setAnonymous(e.target.checked);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(ORG.email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitPad = async () => {
    const emailOk = isValidEmail(email);
    const phoneOk = isValidPhone(phone);
    setEmailError(emailOk ? "" : "Enter a valid email address.");
    setPhoneError(phoneOk ? "" : "Enter a valid phone number.");
    if (!emailOk || !phoneOk) return;

    setPadState("busy");
    const res = await submitForm("pledge", {
      "First name": firstName,
      "Last name": lastName,
      Email: email,
      Phone: phone,
      Amount: `$${amount || "?"} (${freq})`,
      "Bank name": padBankName,
      Institution: padInstitution,
      Transit: padTransit,
      Account: padAccount,
      "Charge day": padDay,
      Address: padAddress,
      Signature: padSignature,
      Comments: padComments,
      Note: "Please attach a photo of a VOID cheque to this email before sending.",
    });
    if (res.ok) setPadDelivered(res.delivered);
    setPadState("done");
  };

  const showIdentityFields = !anonymous || method === "bank";
  const amountMin = freq === "monthly" ? 20 : 1;
  const amountNum = amount === "" ? null : parseInt(amount, 10);
  const amountTooLow = amountNum !== null && amountNum < amountMin;
  const amountInputValue = amountFocused ? amount : amount ? `${amount}.00` : "";
  const paypalAmountParam = amount && !amountTooLow ? `&amount=${encodeURIComponent(amount)}` : "";
  let paypalIdentityParams = "";
  if (!anonymous) {
    if (firstName) paypalIdentityParams += `&first_name=${encodeURIComponent(firstName)}`;
    if (lastName) paypalIdentityParams += `&last_name=${encodeURIComponent(lastName)}`;
    if (email) paypalIdentityParams += `&email=${encodeURIComponent(email)}`;
  }
  const paypalUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(ORG.email)}&currency_code=CAD&no_recurring=${freq === "monthly" ? "0" : "1"}${paypalAmountParam}${paypalIdentityParams}`;

  const anonymousDisabled = method === "bank";

  const pillBase: React.CSSProperties = { flex: 1, textAlign: "center", padding: "9px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "background 0.3s ease, color 0.3s ease" };
  const activeStyle: React.CSSProperties = { ...pillBase, background: "#c9a227", color: "#0e2419" };
  const inactiveStyle: React.CSSProperties = { ...pillBase, background: "transparent", color: "rgba(246,243,234,0.6)" };
  const panelStyle = (open: boolean): React.CSSProperties => ({ maxHeight: open ? 900 : 0, overflow: "hidden", transition: "max-height 0.3s ease" });
  const cardStyle = (key: Exclude<Method, null>): React.CSSProperties => {
    const hide = !!method && method !== key;
    const isThis = method === key;
    const base: React.CSSProperties = { borderRadius: 14, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(246,243,234,0.14)", overflow: "hidden", transition: "opacity 0.3s ease, max-height 0.3s ease, transform 0.3s ease" };
    if (hide) return { ...base, opacity: 0, maxHeight: 0, transform: "translateY(-10px)", pointerEvents: "none" };
    return { ...base, opacity: 1, maxHeight: 1400, order: isThis ? -1 : 0 };
  };

  const inputStyle: React.CSSProperties = { background: "rgba(246,243,234,0.06)", border: "1px solid rgba(246,243,234,0.2)", borderRadius: 8, padding: "11px 13px", color: "#f6f3ea", fontSize: 14, fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
  const padInputStyle: React.CSSProperties = { background: "rgba(246,243,234,0.06)", border: "1px solid rgba(246,243,234,0.2)", borderRadius: 8, padding: "10px 12px", color: "#f6f3ea", fontSize: 13, fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(246,243,234,0.55)" };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", fontFamily: "'Work Sans',sans-serif", background: "#0e2419", overflow: "hidden" }}>
      {/* decorative field: crescent moon, glowing lanterns, stars */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }} aria-hidden>
        <div style={{ position: "absolute", top: -130, right: -90, width: 440, height: 440, borderRadius: 999, background: "radial-gradient(circle, rgba(201,162,39,0.2), transparent 70%)" }} />
        <div style={{ position: "absolute", top: "38%", left: -120, width: 380, height: 380, borderRadius: 999, background: "radial-gradient(circle, rgba(201,162,39,0.1), transparent 70%)" }} />
        <div style={{ position: "absolute", top: "78%", right: -100, width: 400, height: 400, borderRadius: 999, background: "radial-gradient(circle, rgba(201,162,39,0.12), transparent 70%)" }} />

        <div className="da-float-slow" style={{ position: "absolute", top: 64, right: 70, animationDuration: "7s" }}>
          <div style={{ position: "absolute", inset: -16, borderRadius: 999, background: "radial-gradient(circle, rgba(227,197,106,0.45), transparent 70%)", filter: "blur(6px)" }} />
          <svg width={58} height={58} viewBox="0 0 56 56" style={{ position: "relative" }}>
            <path d="M36 8 A20 20 0 1 0 36 48 A15.5 15.5 0 1 1 36 8 Z" fill="#e3c56a" opacity={0.9} />
          </svg>
        </div>

        <PledgeLantern width={28} height={36} top="20px" left="12%" stringHeight={46} glowSize={46} glowBlur={5} fillOpacity={0.22} circleR={3.2} swing={6} swingDelay={0} />
        <PledgeLantern width={20} height={26} top="10px" right="16%" stringHeight={30} glowSize={34} glowBlur={4} fillOpacity={0.18} circleR={3} circleOpacity={0.8} svgOpacity={0.85} swing={7.5} swingDelay={0.5} />

        <PledgeLantern width={30} height={38} top="42%" left="6%" glowSize={50} glowBlur={6} fillOpacity={0.2} circleR={3.4} floatDur={8} floatDelay={1} />
        <PledgeLantern width={26} height={34} top="58%" right="8%" glowSize={42} glowBlur={5} fillOpacity={0.2} circleR={3.2} floatDur={9} floatDelay={0.4} />
        <PledgeLantern width={27} height={35} top="88%" left="10%" glowSize={44} glowBlur={5} fillOpacity={0.2} circleR={3.3} floatDur={7.5} floatDelay={0.8} />

        {TWINKLES.map((s, i) => (
          <div
            key={i}
            className="da-twinkle"
            style={{ position: "absolute", top: s.top, left: s.left, right: s.right, width: s.size, height: s.size, borderRadius: 999, background: i % 2 === 0 ? "#e3c56a" : "#f6f3ea", animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "56px 24px 120px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px 8px 8px", borderRadius: 999, background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.35)", marginBottom: 20 }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 999, background: "#c9a227", color: "#0e2419", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>✓</span>
          <span style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#e3c56a", fontWeight: 700 }}>
            CRA registered charity <span style={{ color: "rgba(246,243,234,0.5)", fontWeight: 500, letterSpacing: "0.02em" }}>· {ORG.charityReg}</span>
          </span>
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(34px,4.6vw,50px)", lineHeight: 1.1, color: "#f6f3ea", margin: "0 0 36px 0" }}>
          Help{" "}
          <span
            className="da-shine"
            style={{
              backgroundImage: "linear-gradient(90deg, #c9a227 0%, #f6f3ea 20%, #e3c56a 40%, #c9a227 60%, #f6f3ea 80%, #e3c56a 100%)",
              backgroundSize: "250% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontStyle: "italic",
            }}
          >
            support
          </span>{" "}
          your masjid.
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <span style={{ width: 26, height: 1, background: "rgba(201,162,39,0.6)" }} />
          <span style={{ fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a227", fontWeight: 600 }}>Current giving priorities</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(246,243,234,0.12)", border: "1px solid rgba(201,162,39,0.28)", borderRadius: 14, overflow: "hidden", marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(246,243,234,0.12)" }}>
            {[
              { value: ORG.finances.monthlyExpenses, label: "Monthly maintenance target" },
              { value: ORG.finances.parkingLot, label: "Parking lot renovation" },
              { value: ORG.finances.loanRemaining, label: "Qard-e-Hasan remaining" },
            ].map((g) => (
              <div key={g.label} style={{ background: "#0e2419", padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 19, color: "#c9a227", marginBottom: 3, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>${g.value.toLocaleString()}</div>
                <div style={{ fontSize: 11, lineHeight: 1.3, color: "rgba(246,243,234,0.55)" }}>{g.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "linear-gradient(120deg, rgba(201,162,39,0.22), rgba(201,162,39,0.1))", padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, whiteSpace: "nowrap" }}>Fun fact</div>
            <div style={{ width: 1, alignSelf: "stretch", background: "rgba(201,162,39,0.35)" }} />
            <div style={{ fontSize: 12, lineHeight: 1.4, color: "rgba(246,243,234,0.8)", flex: 1, minWidth: 200 }}>
              <strong style={{ color: "#f6f3ea" }}>${ORG.finances.perFamily}/mo</strong> per family would cover the loan and running costs — together.
            </div>
            <button type="button" onClick={fillSixtyMonthly} style={{ flexShrink: 0, background: "#c9a227", color: "#0e2419", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 999, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
              Sure, let&apos;s do this →
            </button>
          </div>
        </div>

        {/* TAX RECEIPT CTA */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 20,
            borderRadius: 18,
            padding: "24px 28px",
            marginBottom: 32,
            background: "linear-gradient(120deg, rgba(214,74,64,0.28), rgba(214,74,64,0.1))",
            border: "1.5px solid rgba(224,110,100,0.55)",
            boxShadow: "0 18px 40px -18px rgba(214,74,64,0.4)",
          }}
        >
          <span
            style={{
              flexShrink: 0,
              width: 50,
              height: 50,
              borderRadius: 999,
              background: "rgba(214,74,64,0.22)",
              border: "1.5px solid rgba(240,140,130,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden
          >
            <svg width={22} height={24} viewBox="0 0 20 22" fill="none">
              <path d="M2 2 H14 L18 6 V20 H2 Z" stroke="#f0a89f" strokeWidth={1.6} strokeLinejoin="round" />
              <path d="M14 2 V6 H18" stroke="#f0a89f" strokeWidth={1.6} strokeLinejoin="round" />
              <path d="M5.5 11.5 L8.5 14.5 L14.5 8" stroke="#f6f3ea" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f0a89f", fontWeight: 800, marginBottom: 5 }}>Reminder</div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 20, color: "#f6f3ea", margin: "0 0 3px 0" }}>Already gave, or need a receipt for last year?</p>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(246,243,234,0.75)", margin: 0 }}>
              Request or update the mailing address on file so your official CRA tax receipt reaches you — issued every February.
            </p>
          </div>
          <Link
            href={R.taxReceipt}
            style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#e56b60,#c94c42)", color: "#fff", fontWeight: 700, fontSize: 13.5, padding: "13px 24px", borderRadius: 999, boxShadow: "0 12px 26px -8px rgba(201,76,66,0.6)" }}
          >
            Get your tax receipt <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* FORM */}
        <div style={{ borderRadius: 24, padding: 40, background: "rgba(246,243,234,0.05)", border: "1px solid rgba(201,162,39,0.3)", boxShadow: "0 30px 70px -30px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 8 }}>Donation authorization form</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 29, color: "#f6f3ea", margin: "0 0 22px 0" }}>Your details</h2>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
              width: "fit-content",
              fontSize: 13.5,
              color: anonymousDisabled ? "rgba(246,243,234,0.35)" : "rgba(246,243,234,0.75)",
              cursor: anonymousDisabled ? "not-allowed" : "pointer",
            }}
          >
            <input type="checkbox" checked={anonymous} disabled={anonymousDisabled} onChange={onToggleAnonymous} style={{ width: 16, height: 16, accentColor: "#c9a227", cursor: anonymousDisabled ? "not-allowed" : "pointer" }} />
            <span>Keep my donation anonymous{anonymousDisabled ? " (not available for bank debit)" : ""}</span>
          </label>

          {bankAnonNotice && (
            <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,20,14,0.72)", padding: 20 }} onClick={dismissBankAnonNotice}>
              <div
                style={{ maxWidth: 380, width: "100%", textAlign: "center", background: "linear-gradient(160deg, #163827, #0f2519)", border: "1px solid rgba(201,162,39,0.4)", borderRadius: 20, padding: "36px 30px 30px", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ width: 52, height: 52, margin: "0 auto 20px", borderRadius: 999, background: "rgba(201,162,39,0.14)", border: "1px solid rgba(201,162,39,0.45)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                    <path d="M7 14.5c0-4.6 1.9-7.6 5-7.6s5 3 5 7.6" fill="#e3c56a" />
                    <rect x="4.3" y="13.8" width="15.4" height="2.2" rx="1.1" fill="#e3c56a" />
                    <circle cx="8.7" cy="18.7" r="2.1" stroke="#e3c56a" strokeWidth={1.4} fill="none" />
                    <circle cx="15.3" cy="18.7" r="2.1" stroke="#e3c56a" strokeWidth={1.4} fill="none" />
                    <line x1="10.8" y1="18.7" x2="13.2" y2="18.7" stroke="#e3c56a" strokeWidth={1.4} />
                  </svg>
                  <div style={{ position: "absolute", width: 44, height: 2.5, background: "#e0685c", transform: "rotate(45deg)", borderRadius: 2 }} />
                  <div style={{ position: "absolute", width: 44, height: 2.5, background: "#e0685c", transform: "rotate(-45deg)", borderRadius: 2 }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 23, lineHeight: 1.3, color: "#f6f3ea", margin: "0 0 10px 0" }}>Keeping your donation anonymous isn&apos;t available for this payment method.</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(246,243,234,0.6)", margin: "0 0 26px 0" }}>Bank debit needs your name and contact info for banking and tax receipts.</p>
                <button onClick={dismissBankAnonNotice} style={{ width: "100%", background: "#c9a227", color: "#0e2419", fontWeight: 600, fontSize: 14, padding: "13px 0", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Work Sans',sans-serif" }}>
                  I understand
                </button>
              </div>
            </div>
          )}

          {showIdentityFields && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>First name</span>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Last name</span>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                </label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    onBlur={(e) => setEmailError(isValidEmail(e.currentTarget.value) ? "" : "Enter a valid email address.")}
                    style={inputStyle}
                  />
                  {emailError && <span style={errorStyle}>{emailError}</span>}
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={labelStyle}>Phone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    onBlur={(e) => setPhoneError(isValidPhone(e.currentTarget.value) ? "" : "Enter a valid phone number.")}
                    style={inputStyle}
                  />
                  {phoneError && <span style={errorStyle}>{phoneError}</span>}
                </label>
              </div>
            </>
          )}

          <div id="pledge-amount-section" style={{ borderRadius: 16, transition: "box-shadow 0.4s ease, background 0.4s ease", margin: "-10px -12px 0", padding: "10px 12px", boxShadow: highlight ? "0 0 0 2px rgba(201,162,39,0.6), 0 0 24px rgba(201,162,39,0.35)" : "0 0 0 0 rgba(201,162,39,0)", background: highlight ? "rgba(201,162,39,0.08)" : "transparent" }}>
            <label style={{ display: "block", fontSize: 11.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(246,243,234,0.55)", marginBottom: 8 }}>Amount of donation</label>
            <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 6, background: "rgba(246,243,234,0.06)", border: `1px solid ${highlight ? "#c9a227" : "rgba(246,243,234,0.2)"}`, borderRadius: 12, padding: "4px 16px", maxWidth: 220, transition: "border-color 0.4s ease" }}>
              <span style={{ fontSize: 20, color: "#c9a227", fontWeight: 600, fontFamily: "'Cormorant Garamond',serif" }}>$</span>
              <input
                value={amountInputValue}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                inputMode="numeric"
                placeholder={`${amountMin}.00`}
                style={{ border: "none", background: "transparent", color: "#f6f3ea", fontSize: 20, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", padding: "10px 6px", width: "100%", outline: "none" }}
              />
            </div>
            {amountTooLow && <div style={{ margin: "0 0 14px 4px", fontSize: 12, color: "#e08a8a" }}>Minimum amount is ${amountMin}.00.</div>}
            <div style={{ marginBottom: 28 }} />

            <label style={{ display: "block", fontSize: 11.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(246,243,234,0.55)", marginBottom: 8 }}>Donation option</label>
            <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 999, background: "rgba(246,243,234,0.06)", border: "1px solid rgba(246,243,234,0.14)", marginBottom: 28, maxWidth: 280 }}>
              <div onClick={() => setFreq("once")} style={freq === "once" ? activeStyle : inactiveStyle}>One-time</div>
              <div onClick={() => setFreq("monthly")} style={freq === "monthly" ? activeStyle : inactiveStyle}>Monthly</div>
            </div>
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a227", fontWeight: 700, marginBottom: 6 }}>How you want to pay</div>
          <p style={{ fontSize: 12.5, color: "rgba(246,243,234,0.55)", margin: "0 0 18px 0" }}>Choose whichever is most convenient: credit card via PayPal, pre-authorized bank debit, or Interac e-Transfer.</p>

          {method && (
            <div onClick={resetMethod} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, color: "#c9a227", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>← Change payment method</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* PayPal */}
            <div style={cardStyle("paypal")}>
              <div onClick={setMethodPaypal} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", cursor: "pointer" }}>
                <span style={{ width: 40, height: 26, flexShrink: 0, borderRadius: 6, background: "#003087", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>Pay</span>
                <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: "#f6f3ea" }}>Credit card via PayPal</span>
                <span style={{ color: "rgba(246,243,234,0.5)", fontSize: 13 }}>{method === "paypal" ? "－" : "＋"}</span>
              </div>
              <div style={panelStyle(method === "paypal")}>
                <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: 0 }}>
                    Pay by credit card through PayPal — no PayPal account required. For monthly giving, check &quot;Make this monthly donation&quot; on the PayPal page.
                  </p>
                  <a href={paypalUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" alt="Donate with PayPal" style={{ display: "block", height: 36 }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Bank / PAD */}
            <div style={cardStyle("bank")}>
              <div onClick={setMethodBank} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", cursor: "pointer" }}>
                <span style={{ width: 40, height: 28, flexShrink: 0, borderRadius: 6, background: "#2b2b2b", position: "relative", overflow: "hidden" }}>
                  <span style={{ position: "absolute", top: 6, left: 0, right: 0, height: 5, background: "#e8e8e8" }} />
                  <span style={{ position: "absolute", bottom: 5, left: 5, width: 12, height: 8, borderRadius: 2, background: "linear-gradient(135deg,#c9a227,#e3c56a)" }} />
                </span>
                <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: "#f6f3ea" }}>Pre-authorized bank debit (PAD)</span>
                <span style={{ color: "rgba(246,243,234,0.5)", fontSize: 13 }}>{method === "bank" ? "－" : "＋"}</span>
              </div>
              <div style={panelStyle(method === "bank")}>
                <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "rgba(246,243,234,0.65)", margin: 0, padding: "10px 12px", background: "rgba(201,162,39,0.1)", borderRadius: 8, border: "1px solid rgba(201,162,39,0.25)" }}>
                    Fill in your banking details below, then attach a photo of a VOID cheque to the email that opens when you submit. Prefer a
                    printable, paper copy instead? <Link href={R.padForm} style={{ color: "#8fb4c9", textDecoration: "underline" }}>Get the PAD form</Link>.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input value={padBankName} onChange={(e) => setPadBankName(e.target.value)} placeholder="Bank name" style={{ ...padInputStyle, gridColumn: "span 2" }} />
                    <input value={padInstitution} onChange={(e) => setPadInstitution(e.target.value)} placeholder="Institution #" style={padInputStyle} />
                    <input value={padTransit} onChange={(e) => setPadTransit(e.target.value)} placeholder="Transit #" style={padInputStyle} />
                    <input value={padAccount} onChange={(e) => setPadAccount(e.target.value)} placeholder="Account #" style={{ ...padInputStyle, gridColumn: "span 2" }} />
                    <label style={{ gridColumn: "span 2", fontSize: 11.5, color: "rgba(246,243,234,0.55)", display: "flex", alignItems: "center", gap: 8 }}>
                      Charge day of month
                      <input value={padDay} onChange={(e) => setPadDay(e.target.value)} placeholder="1–28" style={{ ...padInputStyle, width: 60, padding: "8px 10px" }} />
                    </label>
                    <input value={padAddress} onChange={(e) => setPadAddress(e.target.value)} placeholder="Complete mailing address (required for tax receipt)" style={{ ...padInputStyle, gridColumn: "span 2" }} />
                    <input value={padSignature} onChange={(e) => setPadSignature(e.target.value)} placeholder="Signature (type your full name)" style={{ ...padInputStyle, gridColumn: "span 2" }} />
                    <textarea value={padComments} onChange={(e) => setPadComments(e.target.value)} placeholder="Comments (optional)" rows={2} style={{ ...padInputStyle, gridColumn: "span 2", resize: "vertical" }} />
                  </div>
                  <p style={{ fontSize: 11.5, lineHeight: 1.6, color: "rgba(246,243,234,0.45)", margin: "4px 0 0 0" }}>By submitting, I authorize Darul Arqum to collect the above amount from my account, cancellable with 30 days&apos; notice.</p>
                  {padState === "done" ? (
                    <div style={{ fontSize: 13.5, color: "#a9e0c0", marginTop: 4 }}>
                      {padDelivered ? "Submitted — the team has your details." : "Recorded — please also email a photo of a VOID cheque to admin@darularqum.org."}
                    </div>
                  ) : (
                    <button onClick={submitPad} disabled={padState === "busy"} style={{ alignSelf: "flex-start", marginTop: 4, background: "#c9a227", color: "#0e2419", fontWeight: 600, fontSize: 13.5, padding: "11px 20px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Work Sans',sans-serif" }}>
                      {padState === "busy" ? "Sending…" : "Email my void cheque details"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* e-Transfer */}
            <div style={cardStyle("etransfer")}>
              <div onClick={setMethodEtransfer} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", cursor: "pointer" }}>
                <span style={{ width: 40, height: 26, flexShrink: 0, borderRadius: 6, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/interac-logo.png" alt="Interac" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
                <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: "#f6f3ea" }}>Interac e-Transfer</span>
                <span style={{ color: "rgba(246,243,234,0.5)", fontSize: 13 }}>{method === "etransfer" ? "－" : "＋"}</span>
              </div>
              <div style={panelStyle(method === "etransfer")}>
                <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "rgba(246,243,234,0.65)", margin: 0 }}>
                    Open your banking app and send an Interac e-Transfer for <strong style={{ color: "#c9a227" }}>${amount || amountMin}</strong> to the email below. Autodeposit is enabled — just add your name in the message so we can match it to a tax receipt.
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, color: "rgba(246,243,234,0.8)", fontFamily: "monospace", background: "rgba(246,243,234,0.06)", padding: "8px 12px", borderRadius: 8 }}>{ORG.email}</span>
                    <button onClick={copyEmail} style={{ background: "transparent", color: "#a9e0c0", border: "1px solid rgba(120,190,150,0.4)", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 999, cursor: "pointer", fontFamily: "'Work Sans',sans-serif" }}>
                      {copied ? "Copied!" : "Copy email"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(246,243,234,0.1)", fontSize: 12, color: "rgba(246,243,234,0.5)", lineHeight: 1.6 }}>
            {ORG.phone} · {ORG.email} · Tax receipts for the current year are issued to donors with valid mailing addresses (CRA requirement).
          </div>
        </div>

        {/* HADITH */}
        <div style={{ position: "relative", overflow: "hidden", textAlign: "center", borderRadius: 16, padding: "28px 24px", background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(201,162,39,0.12), transparent 70%), linear-gradient(180deg, #123321, #0d2419)", border: "1px solid rgba(201,162,39,0.22)", marginTop: 36 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", width: 220, height: 220, transform: "translate(-50%,-50%)", opacity: 0.12, pointerEvents: "none" }} aria-hidden>
            <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(227,197,106,0.4)", borderRadius: 999 }} />
            <div style={{ position: "absolute", inset: 24, border: "1px solid rgba(227,197,106,0.4)" }} />
            <div style={{ position: "absolute", inset: 24, border: "1px solid rgba(227,197,106,0.4)", transform: "rotate(45deg)" }} />
          </div>
          <p dir="rtl" lang="ar" style={{ position: "relative", fontFamily: "'Amiri',serif", fontWeight: 700, fontSize: "clamp(18px,2.4vw,23px)", lineHeight: 1.9, margin: "0 0 16px 0", unicodeBidi: "plaintext", backgroundImage: "linear-gradient(100deg, #f3d98a, #c9a227 55%, #8a6a1e)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            مَنْ بَنَى مَسْجِدًا لِلّهِ بَنَى اللَّهُ لَهُ فِي الْجَنَّةِ مِثْلَهُ
          </p>
          <span style={{ position: "relative", display: "block", width: 36, height: 1, background: "rgba(201,162,39,0.5)", margin: "0 auto 18px" }} />
          <p style={{ position: "relative", fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontStyle: "italic", lineHeight: 1.6, color: "#f6f3ea", margin: "0 auto 10px", maxWidth: 480 }}>
            &quot;Whoever builds a mosque for Allah, Allah will build for him a house like it in Paradise.&quot;
          </p>
          <p style={{ position: "relative", fontSize: 11.5, color: "rgba(246,243,234,0.5)", margin: 0 }}>Uthman ibn Affan · Sahih al-Bukhari 450, Sahih Muslim 533</p>
        </div>
      </div>
    </div>
  );
}
