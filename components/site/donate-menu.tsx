"use client";

/** Nav "Donate" button + dropdown — identical on every page: a direct PayPal
 * link (pre-selects the method on the Pledge page via ?method=) and a
 * "Pay via e-Transfer" button that opens the standalone e-Transfer modal. */

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { R } from "@/lib/links";
import { cn } from "@/lib/utils";
import { EtransferModal } from "@/components/site/etransfer-modal";

export function DonateMenu({ align = "right" }: { align?: "left" | "right" }) {
  const [open, setOpen] = React.useState(false);
  const [etransferOpen, setEtransferOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="da-donate-glow rounded-full bg-da-gold px-[22px] py-2.5 text-[13.5px] font-semibold text-da-bg transition-transform hover:-translate-y-0.5 hover:brightness-110"
      >
        Donate
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "absolute top-[calc(100%+10px)] z-30 w-[230px] rounded-2xl bg-da-cream p-2 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)]",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            <Link
              href={`${R.pledge}?method=paypal`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-da-bg transition-colors hover:bg-da-bg/[0.06]"
            >
              <span className="flex h-5 w-[30px] items-center justify-center rounded-[3px] bg-[#003087] text-[9px] font-extrabold text-white">
                Pay
              </span>
              PayPal
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEtransferOpen(true);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-da-bg transition-colors hover:bg-da-bg/[0.06]"
            >
              <span className="flex h-5 w-[30px] items-center justify-center overflow-hidden rounded-[3px] bg-white ring-1 ring-black/10">
                <img src="/assets/interac-logo.png" alt="" className="h-full w-full object-cover" />
              </span>
              Pay via e-Transfer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <EtransferModal open={etransferOpen} onClose={() => setEtransferOpen(false)} />
    </div>
  );
}
