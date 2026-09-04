"use client";

/**
 * "New location" announcement, in two forms driven by one piece of state.
 *
 * Desktop — a speech bubble slides out of a megaphone into the hero's empty
 * right-hand side, after a short delay so it reads as an interruption rather
 * than page furniture.
 *
 * Phone — there is no spare width, so the megaphone docks bottom-right with a
 * one-line bubble. Tapping it blurs the page and promotes the same content to
 * a centred sheet.
 *
 * Dismissal is remembered per session (not forever) so a returning visitor
 * still meets the announcement on a later visit, but is not nagged while
 * moving around the site. Storage is wrapped because Safari private mode
 * throws on access.
 */

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LOCATIONS, R } from "@/lib/links";
import { Megaphone } from "@/components/site/megaphone";

const KEY = "da-west-announce-dismissed";

function readDismissed() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
function writeDismissed() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* private mode — dismissal just won't persist */
  }
}

const west = LOCATIONS.west;

function BubbleBody({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <span className="da-live-pulse" aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: "#e3c56a", flexShrink: 0 }} />
        <span style={{ fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#f3e2ad", fontWeight: 800 }}>
          We have a new location
        </span>
      </div>

      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "clamp(26px,3vw,34px)", lineHeight: 1.12, color: "#f6f3ea", margin: "0 0 10px 0" }}>
        Introducing{" "}
        <span className="da-shine" style={{ fontStyle: "italic", backgroundImage: "linear-gradient(100deg,#c9a227,#f7e6b4,#c9a227)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          {west.name}.
        </span>
      </h2>

      <p style={{ fontSize: 13.8, lineHeight: 1.6, color: "rgba(246,243,234,0.76)", margin: "0 0 16px 0" }}>
        The community has acquired a second masjid at {west.street}. Opening details are on the way.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
        <Link href={R.locationWest} onClick={onClose} className="da-btn da-btn-gold da-btn-sm">
          Check out the new location <span aria-hidden="true">→</span>
        </Link>
        <button type="button" onClick={onClose} className="da-btn da-btn-ghost da-btn-sm">
          Not now
        </button>
      </div>
    </>
  );
}

export function WestAnnounceBanner() {
  const reduce = useReducedMotion();
  const [ready, setReady] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (readDismissed()) return;
    const t = window.setTimeout(() => {
      setDismissed(false);
      setReady(true);
    }, 2600);
    return () => window.clearTimeout(t);
  }, []);

  const close = React.useCallback(() => {
    setExpanded(false);
    setDismissed(true);
    writeDismissed();
  }, []);

  // Escape closes the phone sheet
  React.useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  if (!ready || dismissed) return null;
  const slide = reduce ? { opacity: 0 } : { opacity: 0, x: 46, scale: 0.96 };

  return (
    <>
      {/* ── desktop: speech bubble in the hero's right-hand space ── */}
      <motion.aside
        className="da-announce-desk"
        initial={slide}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        aria-label="New location announcement"
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <Megaphone size={62} />
          <div className="da-bubble">
            <BubbleBody onClose={close} />
          </div>
        </div>
      </motion.aside>

      {/* ── phone: docked megaphone + one-line bubble ── */}
      <motion.button
        type="button"
        className="da-announce-dock"
        onClick={() => setExpanded(true)}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        aria-label="New location — tap for details"
      >
        <span className="da-dock-bubble">New location!</span>
        <Megaphone size={40} />
      </motion.button>

      {/* ── phone: expanded sheet ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="da-announce-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setExpanded(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Introducing ${west.name}`}
          >
            <motion.div
              className="da-announce-sheet"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" onClick={() => setExpanded(false)} aria-label="Close" className="da-sheet-x">
                ✕
              </button>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                <Megaphone size={64} />
              </div>
              <BubbleBody onClose={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
