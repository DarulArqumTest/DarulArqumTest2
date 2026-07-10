"use client";

/**
 * The Pledge / Donation page — the most behaviorally complex page in the
 * redesign. One unified controlled form: frequency + payment method
 * selection, live amount validation/formatting, PayPal URL construction,
 * full Pre-Authorized Debit (bank) fields, and Interac e-Transfer
 * instructions. Bank Debit submits through the shared submitForm() action;
 * PayPal opens an external donate link; e-Transfer is instructions-only.
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { ORG } from "@/lib/links";
import { submitForm } from "@/app/actions/submit";
import { Reveal } from "@/components/site/reveal";

type Method = "paypal" | "bank" | "etransfer" | null;
type Freq = "once" | "monthly";

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function PledgeForm() {
  const [freq, setFreq] = React.useState<Freq>("once");
  const [method, setMethod] = React.useState<Method>(null);
  const [amount, setAmount] = React.useState("");
  const [amountFocused, setAmountFocused] = React.useState(false);
  const [highlight, setHighlight] = React.useState(false);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(false);
  const [bankAnonNotice, setBankAnonNotice] = React.useState(false);

  const [bank, setBank] = React.useState({
    bankName: "",
    institution: "",
    transit: "",
    account: "",
    chargeDay: "",
    address: "",
    signature: "",
    comments: "",
  });

  const [padState, setPadState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const [padDelivered, setPadDelivered] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const fillTimer = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const highlightTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Pre-select from ?method=&amount=&freq= on mount.
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const m = q.get("method");
    if (m === "paypal" || m === "bank" || m === "etransfer") setMethod(m);
    const a = (q.get("amount") || "").replace(/[^0-9]/g, "");
    if (a && a !== "0") setAmount(a);
    if (q.get("freq") === "monthly") setFreq("monthly");
  }, []);

  const amountMin = freq === "monthly" ? 20 : 1;
  const amountNum = amount === "" ? null : parseInt(amount, 10);
  const amountTooLow = amountNum !== null && amountNum < amountMin;
  const amountInputValue = amountFocused ? amount : amount ? `${amount}.00` : "";
  const showIdentityFields = !anonymous || method === "bank";
  const anonymousDisabled = method === "bank";

  function fillSixtyMonthly() {
    if (fillTimer.current) clearInterval(fillTimer.current);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    document.getElementById("pledge-amount-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFreq("monthly");
    setHighlight(true);
    setAmount("0");
    const target = 60;
    const start = Date.now();
    const duration = 700;
    fillTimer.current = setInterval(() => {
      const t = clamp((Date.now() - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAmount(String(Math.round(eased * target)));
      if (t >= 1) {
        clearInterval(fillTimer.current);
        highlightTimer.current = setTimeout(() => setHighlight(false), 900);
      }
    }, 25);
  }

  function selectMethod(key: Exclude<Method, null>) {
    setMethod((prev) => {
      const willOpen = prev !== key;
      const next = willOpen ? key : null;
      if (key === "bank" && willOpen) {
        const wasAnonymous = anonymous;
        setAnonymous(false);
        setBankAnonNotice(wasAnonymous);
      }
      return next;
    });
  }

  function toggleAnonymous() {
    if (anonymousDisabled) return;
    setAnonymous((v) => !v);
  }

  function copyEmail() {
    navigator.clipboard.writeText(ORG.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const paypalUrl = React.useMemo(() => {
    const params = new URLSearchParams();
    params.set("business", ORG.email);
    params.set("currency_code", "CAD");
    params.set("no_recurring", freq === "monthly" ? "0" : "1");
    if (amount && !amountTooLow) params.set("amount", amount);
    if (!anonymous) {
      if (firstName) params.set("first_name", firstName);
      if (lastName) params.set("last_name", lastName);
      if (email) params.set("email", email);
    }
    return `https://www.paypal.com/donate/?${params.toString()}`;
  }, [freq, amount, amountTooLow, anonymous, firstName, lastName, email]);

  async function submitBank(e: React.FormEvent) {
    e.preventDefault();
    setPadState("busy");
    const res = await submitForm("pledge", {
      "Payment method": "Pre-authorized bank debit",
      Frequency: freq === "monthly" ? "Monthly" : "One-time",
      Amount: amount ? `$${amount}.00` : "",
      "First name": anonymous ? "" : firstName,
      "Last name": anonymous ? "" : lastName,
      Email: email,
      Phone: phone,
      Anonymous: anonymous ? "Yes" : "No",
      "Bank name": bank.bankName,
      "Institution #": bank.institution,
      "Transit #": bank.transit,
      "Account #": bank.account,
      "Charge day of month": bank.chargeDay,
      "Mailing address": bank.address,
      Signature: bank.signature,
      Comments: bank.comments,
    });
    if (res.ok) {
      setPadDelivered(res.delivered);
      setPadState("done");
    } else setPadState("error");
  }

  const inputCls =
    "w-full rounded-lg border border-da-cream/20 bg-da-cream/[0.06] px-[13px] py-[11px] text-sm text-da-cream placeholder:text-da-cream/35 focus:border-da-gold focus:outline-none";
  const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-da-cream/55";

  return (
    <div className="relative bg-da-bg px-5 py-16 font-daBody text-da-cream md:py-24">
      <div className="mx-auto max-w-3xl">
        {/* CRA badge */}
        <Reveal className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-da-gold/35 bg-da-gold/[0.12] px-4 py-1.5 text-xs text-da-goldL">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-da-gold text-[10px] font-bold text-da-bg">✓</span>
            CRA registered charity · {ORG.charityReg}
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-5 text-center font-daDisplay text-4xl font-medium tracking-tight text-da-cream md:text-5xl">
            Help{" "}
            <span
              className="da-shine bg-clip-text italic text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#c9a227 0%,#f6f3ea 20%,#e3c56a 40%,#c9a227 60%,#f6f3ea 80%,#e3c56a 100%)",
              }}
            >
              support
            </span>{" "}
            your masjid.
          </h1>
        </Reveal>

        {/* Currently active goals */}
        <Reveal delay={0.1} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Monthly maintenance target", value: ORG.finances.monthlyExpenses },
            { label: "Parking lot renovation", value: ORG.finances.parkingLot },
            { label: "Qard-e-Hasan remaining", value: ORG.finances.loanRemaining },
          ].map((g) => (
            <div key={g.label} className="rounded-2xl border border-da-cream/10 bg-da-cream/[0.03] p-5 text-center">
              <p className="font-daDisplay text-2xl font-semibold text-da-gold">${g.value.toLocaleString()}</p>
              <p className="mt-1 text-xs text-da-cream/55">{g.label}</p>
            </div>
          ))}
        </Reveal>

        {/* Fun fact */}
        <Reveal delay={0.15}>
          <div
            className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl p-6"
            style={{ background: "linear-gradient(120deg, rgba(201,162,39,0.22), rgba(201,162,39,0.1))" }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-da-goldL">Fun fact</p>
            <p className="flex-1 text-sm leading-relaxed text-da-cream/85">
              <span className="font-daDisplay text-xl font-semibold text-da-gold">${ORG.finances.perFamily}/mo</span> per family
              would cover the loan and running costs — together.
            </p>
            <button
              type="button"
              onClick={fillSixtyMonthly}
              className="rounded-full bg-da-gold px-5 py-2.5 text-sm font-semibold text-da-bg transition-transform hover:-translate-y-0.5"
            >
              Sure, let&apos;s do this →
            </button>
          </div>
        </Reveal>

        {/* Amount + frequency */}
        <div
          id="pledge-amount-section"
          className="mt-10 rounded-2xl transition-all duration-300"
          style={
            highlight
              ? { boxShadow: "0 0 0 2px rgba(201,162,39,0.6), 0 0 24px rgba(201,162,39,0.35)", background: "rgba(201,162,39,0.08)" }
              : undefined
          }
        >
          <div className="rounded-[24px] border border-da-gold/30 bg-da-cream/[0.05] p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] md:p-10">
            <div className="inline-flex gap-1 rounded-full border border-da-cream/15 bg-da-cream/[0.06] p-1">
              {(["once", "monthly"] as Freq[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFreq(f)}
                  className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors ${
                    freq === f ? "bg-da-gold text-da-bg" : "text-da-cream/70"
                  }`}
                >
                  {f === "once" ? "One-time" : "Monthly"}
                </button>
              ))}
            </div>

            <label className="mt-6 block">
              <span className={labelCls}>Amount</span>
              <div className="flex items-center gap-2 rounded-xl border border-da-cream/20 bg-da-cream/[0.06] px-4 py-1">
                <span className="font-daDisplay text-xl text-da-gold">$</span>
                <input
                  inputMode="numeric"
                  value={amountInputValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder={`${amountMin}.00`}
                  className={`w-full border-0 bg-transparent py-3 text-lg text-da-cream outline-none ${
                    highlight ? "border-solid" : ""
                  }`}
                  style={highlight ? { borderBottom: "2px solid #c9a227" } : undefined}
                />
              </div>
              {amountTooLow && (
                <p className="mt-1.5 text-xs text-[#e08a8a]">Minimum amount is ${amountMin}.00.</p>
              )}
            </label>

            {/* Payment method cards */}
            <div className="mt-7 flex flex-col gap-3">
              <MethodCard
                order={method === "paypal" ? -1 : 0}
                hidden={method !== null && method !== "paypal"}
                selected={method === "paypal"}
                onClick={() => selectMethod("paypal")}
                badge={
                  <span className="flex h-[26px] w-10 items-center justify-center rounded-[3px] bg-[#003087] text-[9px] font-extrabold text-white">
                    Pay
                  </span>
                }
                label="Credit / Debit via PayPal"
              >
                <p className="text-sm leading-relaxed text-da-cream/70">
                  Pay by credit card through PayPal — no PayPal account required. For monthly giving, check
                  &ldquo;Make this monthly donation&rdquo; on the PayPal page.
                </p>
                <a
                  href={paypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-da-gold px-6 py-3 text-sm font-semibold text-da-bg"
                >
                  Continue to PayPal <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </MethodCard>

              <MethodCard
                order={method === "bank" ? -1 : 0}
                hidden={method !== null && method !== "bank"}
                selected={method === "bank"}
                onClick={() => selectMethod("bank")}
                badge={
                  <span className="flex h-[26px] w-10 items-center justify-center rounded-[3px] bg-[#2b2b2b]">
                    <span className="h-1.5 w-1.5 rounded-full bg-da-gold" />
                  </span>
                }
                label="Pre-authorized Bank Debit"
              >
                <form onSubmit={submitBank} className="grid gap-4 sm:grid-cols-2">
                  <p className="text-xs leading-relaxed text-da-cream/60 sm:col-span-2">
                    Fill in your banking details below, then attach a photo of a VOID cheque to the email that
                    opens when you submit.
                  </p>
                  <label className="sm:col-span-2">
                    <span className={labelCls}>Bank name</span>
                    <input className={inputCls} value={bank.bankName} onChange={(e) => setBank((b) => ({ ...b, bankName: e.target.value }))} />
                  </label>
                  <label>
                    <span className={labelCls}>Institution #</span>
                    <input className={inputCls} value={bank.institution} onChange={(e) => setBank((b) => ({ ...b, institution: e.target.value }))} />
                  </label>
                  <label>
                    <span className={labelCls}>Transit #</span>
                    <input className={inputCls} value={bank.transit} onChange={(e) => setBank((b) => ({ ...b, transit: e.target.value }))} />
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelCls}>Account #</span>
                    <input className={inputCls} value={bank.account} onChange={(e) => setBank((b) => ({ ...b, account: e.target.value }))} />
                  </label>
                  <label>
                    <span className={labelCls}>Charge day of month</span>
                    <input className={inputCls} placeholder="1–28" value={bank.chargeDay} onChange={(e) => setBank((b) => ({ ...b, chargeDay: e.target.value }))} />
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelCls}>Complete mailing address (required for tax receipt)</span>
                    <input className={inputCls} value={bank.address} onChange={(e) => setBank((b) => ({ ...b, address: e.target.value }))} />
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelCls}>Signature (type your full name)</span>
                    <input className={inputCls} value={bank.signature} onChange={(e) => setBank((b) => ({ ...b, signature: e.target.value }))} />
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelCls}>Comments (optional)</span>
                    <textarea rows={2} className={inputCls} value={bank.comments} onChange={(e) => setBank((b) => ({ ...b, comments: e.target.value }))} />
                  </label>
                  <p className="text-xs leading-relaxed text-da-cream/50 sm:col-span-2">
                    By submitting, I authorize Darul Arqum to collect the above amount from my account,
                    cancellable with 30 days&apos; notice.
                  </p>
                  {padState === "done" ? (
                    <div className="flex items-center gap-2 text-sm text-da-mint sm:col-span-2">
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      {padDelivered ? "Submitted — the team has your details." : "Recorded — please also email a photo of a VOID cheque."}
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={padState === "busy"}
                      className="inline-flex items-center gap-2 rounded-full bg-da-gold px-6 py-3 text-sm font-semibold text-da-bg sm:col-span-2 sm:w-fit"
                    >
                      {padState === "busy" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                      Email my void cheque details
                    </button>
                  )}
                </form>
              </MethodCard>

              <MethodCard
                order={method === "etransfer" ? -1 : 0}
                hidden={method !== null && method !== "etransfer"}
                selected={method === "etransfer"}
                onClick={() => selectMethod("etransfer")}
                badge={
                  <span className="flex h-[26px] w-10 items-center justify-center rounded-[3px] bg-white text-[8px] font-extrabold text-[#00B0F0] ring-1 ring-black/10">
                    INT
                  </span>
                }
                label="Interac e-Transfer"
              >
                <p className="text-sm leading-relaxed text-da-cream/70">
                  Open your banking app and send an Interac e-Transfer for{" "}
                  <span className="font-semibold text-da-goldL">${amount || amountMin}</span> to the email below.
                  Autodeposit is enabled — just add your name in the message so we can match it to a tax receipt.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-lg bg-da-cream/[0.06] px-3 py-2 font-mono text-sm">{ORG.email}</span>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1.5 rounded-full border border-da-gold/40 px-4 py-2 text-xs font-semibold text-da-goldL"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                    {copied ? "Copied!" : "Copy email"}
                  </button>
                </div>
              </MethodCard>

              {method && (
                <button type="button" onClick={() => setMethod(null)} className="self-start text-sm text-da-cream/60 hover:text-da-cream">
                  ← Change payment method
                </button>
              )}
            </div>

            {/* Identity fields */}
            {showIdentityFields && (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className={labelCls}>First name</span>
                  <input className={inputCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </label>
                <label>
                  <span className={labelCls}>Last name</span>
                  <input className={inputCls} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>
                <label>
                  <span className={labelCls}>Email</span>
                  <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                  <span className={labelCls}>Phone</span>
                  <input type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
              </div>
            )}

            <label className={`mt-6 flex items-center gap-2.5 text-sm ${anonymousDisabled ? "cursor-not-allowed text-da-cream/35" : "text-da-cream/75"}`}>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={toggleAnonymous}
                disabled={anonymousDisabled}
                className="h-4 w-4 rounded border-da-cream/30"
              />
              Keep my donation anonymous
              {anonymousDisabled && " (not available for bank debit)"}
            </label>
          </div>
        </div>

        {/* Hadith card */}
        <Reveal delay={0.1}>
          <div
            className="mt-10 rounded-2xl border border-da-gold/[0.22] p-8 text-center"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(201,162,39,0.12), transparent 70%), linear-gradient(180deg, #123321, #0d2419)",
            }}
          >
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-xl leading-loose text-transparent"
              style={{ backgroundImage: "linear-gradient(100deg,#f3d98a,#c9a227 55%,#8a6a1e)", WebkitBackgroundClip: "text", backgroundClip: "text" }}
            >
              مَنْ بَنَى مَسْجِدًا لِلّهِ بَنَى اللَّهُ لَهُ فِي الْجَنَّةِ مِثْلَهُ
            </p>
            <p className="mt-4 font-daDisplay text-lg italic leading-relaxed text-da-cream">
              &ldquo;Whoever builds a mosque for Allah, Allah will build for him a house like it in Paradise.&rdquo;
            </p>
            <p className="mt-2 text-xs text-da-cream/50">Uthman ibn Affan · Sahih al-Bukhari 450, Sahih Muslim 533</p>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-xs text-da-cream/45">
          {ORG.phone} · {ORG.email} · Tax receipts for the current year are issued to donors with valid mailing
          addresses (CRA requirement).
        </p>
      </div>

      {/* Anonymous + Bank Debit warning modal */}
      <AnimatePresence>
        {bankAnonNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(6,16,11,0.72)] p-6"
            onClick={() => setBankAnonNotice(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl border border-da-gold/25 bg-da-modal p-8 text-center"
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-da-gold/15">
                <span className="text-2xl">🕶️</span>
                <span className="absolute h-[2.5px] w-11 rotate-45 rounded-full bg-[#e0685c]" />
                <span className="absolute h-[2.5px] w-11 -rotate-45 rounded-full bg-[#e0685c]" />
              </div>
              <h3 className="mt-5 font-daDisplay text-xl font-semibold text-da-cream">
                Keeping your donation anonymous isn&apos;t available for this payment method.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-da-cream/70">
                Bank debit needs your name and contact info for banking and tax receipts.
              </p>
              <button
                type="button"
                onClick={() => setBankAnonNotice(false)}
                className="mt-6 rounded-full bg-da-gold px-6 py-2.5 text-sm font-semibold text-da-bg"
              >
                I understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MethodCard({
  selected,
  hidden,
  order,
  onClick,
  badge,
  label,
  children,
}: {
  selected: boolean;
  hidden: boolean;
  order: number;
  onClick: () => void;
  badge: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ order, opacity: hidden ? 0 : 1, maxHeight: hidden ? 0 : 1400, transform: hidden ? "translateY(-10px)" : "none", pointerEvents: hidden ? "none" : "auto" }}
      className="overflow-hidden rounded-2xl border border-da-cream/[0.14] bg-da-cream/[0.05] transition-all duration-300"
    >
      <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-5 py-4 text-left">
        {badge}
        <span className="flex-1 text-sm font-medium text-da-cream">{label}</span>
        <span className="text-lg text-da-cream/50">{selected ? "−" : "+"}</span>
      </button>
      {selected && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}
