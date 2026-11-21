"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORG, R } from "@/lib/links";
import { DonateMenu } from "@/components/site/donate-menu";
import { LocationsMenu, LocationsMobileList } from "@/components/site/locations-menu";
import { requestSectionScroll, type ScrollTargetId } from "@/components/site/use-scroll-highlight";

type NavItem = { label: string; href: string } | { label: string; sectionId: ScrollTargetId };

const NAV: NavItem[] = [
  { label: "Prayer times", href: R.prayer },
  { label: "Programs", href: R.programs },
  { label: "Story", href: R.story },
  { label: "Gallery", href: R.gallery },
  // was a scroll to the homepage WhatsApp card, which meant /community —
  // the volunteer page — could only be reached from a single link at the
  // foot of the gallery. It is a nav destination now.
  { label: "Community", href: R.community },
  // was a scroll to the front page's contact strip, which made this the only
  // item in the bar without a page behind it
  { label: "Contact us", href: R.contact },
];

function NavLink({ item, className, onNavigate }: { item: NavItem; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  if ("href" in item) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          className,
          pathname === item.href && "text-da-goldL",
        )}
      >
        {item.label}
      </Link>
    );
  }
  const onHome = pathname === "/";
  return (
    <a
      href={`/#${item.sectionId}`}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (onHome) {
          e.preventDefault();
          requestSectionScroll(item.sectionId);
        }
      }}
    >
      {item.label}
    </a>
  );
}

/** where the sheet starts: under the closure band, under the bar.
 *  --da-bar-h is set in globals.css and steps up at the md breakpoint. */
const SHEET_TOP = "calc(var(--da-notice-h, 0px) + var(--da-bar-h, 64px))";

/**
 * The dimmed page behind the open sheet.
 *
 * Portalled to the body rather than rendered inside the header, because
 * Motion leaves a `transform` on the header and a transformed ancestor turns
 * `position: fixed` into `position: absolute` — the scrim would have covered
 * the header strip and nothing else.
 */
function Scrim({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [host, setHost] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setHost(document.body), []);
  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.button
          key="scrim"
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          style={{ top: SHEET_TOP }}
          className="fixed inset-x-0 bottom-0 z-40 cursor-default bg-da-bg/70 backdrop-blur-[3px] xl:hidden"
        />
      )}
    </AnimatePresence>,
    host,
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const onHome = pathname === "/";

  React.useEffect(() => setOpen(false), [pathname]);

  /**
   * The sheet used to be a content-height panel hanging off the bar with the
   * page still scrolling and fully legible underneath it, which read as a
   * menu that had half-opened. It is a real sheet now: capped to what is
   * left of the viewport, scrollable inside itself on a short phone, over a
   * scrim, with the page behind it held still and Escape closing it.
   */
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const { overflow, paddingRight } = document.body.style;
    // the gutter the hidden scrollbar leaves behind, so the bar does not jump
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <motion.header
      initial={reduce ? false : { y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      /* sits below the closure band when there is one, at the top when there
         is not; the band publishes its own height as --da-notice-h */
      style={{ top: "var(--da-notice-h, 0px)" }}
      className={cn(
        "inset-x-0 border-b border-da-gold/[0.22] font-daBody backdrop-blur-md backdrop-saturate-150",
        onHome ? "fixed z-50 bg-da-bg/[0.72]" : "sticky z-50 bg-da-bg/[0.85]",
      )}
    >
      <div className="mx-auto grid h-16 max-w-wide grid-cols-[auto_1fr_auto] items-center gap-5 px-5 md:h-[76px]">
        {/* Brand lockup: emblem and wordmark share one framed plate with a
            gold hairline and a rule between them, so it reads as a mark rather
            than an avatar dropped next to some text. */}
        <Link href={R.home} className="da-brand">
          <span className="da-brand-emblem">
            <Image src="/assets/logo-icon.png" alt="Darul Arqum emblem" width={30} height={30} priority />
          </span>
          <span className="da-brand-rule" aria-hidden />
          <span className="da-brand-words">
            <span className="da-brand-name">Darul Arqum</span>
            <span className="da-brand-sub">Riverside South · Ottawa</span>
          </span>
        </Link>

        {/* One system, not four. Brand plate, locations chip, link bar and
            Donate all sit at the same height on the same radius behind the
            same gold hairline; only the Donate button is filled, because it
            is the only one asking for an action. The nav used to be a
            half-pill with a floating ✦ that landed in the middle of a link. */}
        <div className="da-navset mx-auto hidden xl:flex">
          <LocationsMenu />
          <nav className="da-navlinks" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                className="u-draw text-sm font-medium text-da-cream/[0.82] transition-colors hover:text-da-goldL"
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 justify-self-end">
          <div className="hidden xl:block">
            <DonateMenu />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full text-da-cream xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Scrim open={open} onClose={() => setOpen(false)} />

      <AnimatePresence>
        {open && (
          <>
            <motion.nav
              key="mobile"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ maxHeight: `calc(100dvh - ${SHEET_TOP})` }}
              className="da-sheet relative z-10 overflow-y-auto overscroll-contain rounded-b-[22px] border-b border-da-gold/25 bg-da-bg shadow-[0_26px_50px_-20px_rgba(0,0,0,0.85)] xl:hidden"
              aria-label="Mobile"
            >
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                className="px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-1"
              >
                <motion.div variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}>
                  <LocationsMobileList onNavigate={() => setOpen(false)} />
                </motion.div>
                {NAV.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}
                  >
                    <NavLink
                      item={item}
                      onNavigate={() => setOpen(false)}
                      className="block rounded-lg px-3 py-[11px] font-daDisplay text-[19px] leading-none text-da-cream/85 transition-colors hover:bg-da-gold/10"
                    />
                  </motion.div>
                ))}
                <motion.div
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  className="mt-4 flex flex-wrap items-center gap-3 border-t border-da-gold/15 pt-4"
                >
                  <DonateMenu align="left" />
                  <a
                    href={ORG.phoneHref}
                    className="flex items-center gap-2 rounded-[11px] border border-da-gold/25 px-5 py-3 text-sm text-da-cream"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    {ORG.phone}
                  </a>
                </motion.div>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
