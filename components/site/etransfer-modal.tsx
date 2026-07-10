"use client";

/** Standalone Interac e-Transfer instructions modal — reused from the nav Donate
 * dropdown on every page. Matches the .dc.html "giveModal" exactly: an
 * editable amount field (digit-only, "1.00" placeholder) whose value is
 * interpolated live into the instructions copy. */

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Copy, Check } from "lucide-react";
import { ORG } from "@/lib/links";

export function EtransferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = React.useState(false);
  const [amount, setAmount] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function copyEmail() {
    navigator.clipboard.writeText(ORG.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(6,16,11,0.7)] p-6 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Pay via Interac e-Transfer"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] rounded-[20px] border border-da-gold/30 bg-da-modal p-8 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-[18px] top-[18px] flex h-8 w-8 items-center justify-center rounded-full border border-da-cream/20 bg-da-cream/[0.08] text-da-cream"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-da-gold">
              Pay via Interac e-Transfer
            </p>
            <h3 className="mb-[22px] font-daDisplay text-2xl font-semibold text-da-cream">
              Send your donation directly.
            </h3>

            <label className="mb-2 block text-[11.5px] uppercase tracking-[0.06em] text-da-cream/55">Amount</label>
            <div className="mb-[22px] flex items-center gap-0.5 rounded-xl border border-da-cream/20 bg-da-cream/[0.06] px-4 py-1">
              <span className="font-daDisplay text-xl font-semibold text-da-gold">$</span>
              <input
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="1.00"
                className="w-full border-0 bg-transparent px-1.5 py-2.5 font-daDisplay text-xl font-semibold text-da-cream outline-none"
              />
            </div>

            <div className="rounded-[14px] border border-da-cream/[0.14] bg-da-cream/[0.05] p-[18px]">
              <div className="mb-3.5 flex items-center gap-3">
                <span className="flex h-[26px] w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                  <img src="/assets/interac-logo.png" alt="Interac" className="h-full w-full object-cover" />
                </span>
                <span className="text-[14.5px] font-semibold text-da-cream">Interac e-Transfer</span>
              </div>
              <p className="mb-3.5 text-[12.5px] leading-relaxed text-da-cream/65">
                Open your banking app and send an Interac e-Transfer for{" "}
                <strong className="text-da-gold">${amount || "1.00"}</strong> to the email below.
                Autodeposit is enabled, so no security question is needed — just add your name in
                the message so we can match your donation to a tax receipt.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-da-cream/[0.06] px-3 py-2 font-mono text-[13.5px] text-da-cream/80">
                  {ORG.email}
                </span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="rounded-full border border-da-mint/40 px-4 py-2 text-[13px] font-semibold text-da-mint transition-colors hover:bg-da-mint/10"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                    {copied ? "Copied ✓" : "Copy email"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
