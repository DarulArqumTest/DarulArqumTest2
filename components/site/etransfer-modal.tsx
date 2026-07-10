"use client";

/** Standalone Interac e-Transfer instructions modal — reused from the nav Donate
 * dropdown on every page, and inline (in fuller form) on the Pledge page. */

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Copy, Check } from "lucide-react";
import { ORG } from "@/lib/links";

export function EtransferModal({
  open,
  onClose,
  amount = "1.00",
}: {
  open: boolean;
  onClose: () => void;
  amount?: string;
}) {
  const [copied, setCopied] = React.useState(false);

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
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-da-cream/20 bg-da-cream/10 text-da-cream"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-da-goldL">
              Pay via Interac e-Transfer
            </p>
            <h3 className="mt-2 font-daDisplay text-2xl font-semibold text-da-cream">
              Send your donation directly.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-da-cream/72">
              Open your banking app and send an Interac e-Transfer for{" "}
              <span className="font-semibold text-da-goldL">${amount}</span> to the email below.
              Autodeposit is enabled, so no security question is needed — just add your name in
              the message so we can match your donation to a tax receipt.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-da-cream/[0.06] px-3 py-2 font-mono text-sm text-da-cream">
                {ORG.email}
              </span>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-da-gold/40 px-4 py-2 text-xs font-semibold text-da-goldL transition-colors hover:bg-da-gold/10"
              >
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                {copied ? "Copied ✓" : "Copy email"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
