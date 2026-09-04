"use client";

/**
 * "New location" announcement.
 *
 * Desktop — lives INSIDE the hero (see HeroAnnouncement below), anchored in
 * the empty right-hand column. It is part of the page, not a floating
 * overlay, so it scrolls away with the hero like everything else.
 *
 * Phone — there is no spare width, so the megaphone slides in from off-screen
 * to the bottom-right and stays with the reader. Tapping it blurs the page
 * and promotes the full desktop content to a centred sheet.
 *
 * The announcement deliberately steps outside the site's green/gold palette:
 * a red-and-white megaphone and a white comic speech bubble. It is a one-off
 * shout, and it should not read as more site furniture.
 */

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LOCATIONS, R } from "@/lib/links";
import { Megaphone } from "@/components/site/megaphone";

const KEY = "da-west-announce-dismissed";
const west = LOCATIONS.west;

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

/** Shared bubble content. `onClose` is omitted where there is nothing to close. */
function AnnounceBody({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div className="da-comic-eyebrow">
        <span className="da-live-pulse" aria-hidden />
        We have a new location
      </div>
      <h2 className="da-comic-title">
        Introducing <em>Darul Arqum West</em>
      </h2>
      <p className="da-comic-copy">
        The community has acquired a second masjid at {west.street}. Opening details are on the way.
      </p>
      <div className="da-comic-actions">
        <Link href={R.locationWest} onClick={onClose} className="da-comic-cta">
          Check out the new location <span aria-hidden="true">→</span>
        </Link>
        {onClose && (
          <button type="button" onClick={onClose} className="da-comic-dismiss">
            Not now
          </button>
        )}
      </div>
    </>
  );
}

/* ── desktop: sits in the hero, scrolls with it ───────────────── */

export function HeroAnnouncement() {
  const reduce = useReducedMotion();
  return (
    <motion.aside
      className="da-hero-announce"
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      aria-label="New location announcement"
    >
      <Megaphone size={96} />
      <div className="da-comic">
        <AnnounceBody />
      </div>
    </motion.aside>
  );
}

/* ── phone: slides in, follows the reader, opens a sheet ──────── */

export function WestAnnounceDock() {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (readDismissed()) return;
    const t = window.setTimeout(() => setShown(true), 2200);
    return () => window.clearTimeout(t);
  }, []);

  const close = React.useCallback(() => {
    setExpanded(false);
    setDismissed(true);
    writeDismissed();
  }, []);

  React.useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  if (!shown || dismissed) return null;

  return (
    <>
      <motion.button
        type="button"
        className="da-dock"
        onClick={() => setExpanded(true)}
        // slides in from off the right edge, then settles
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 150 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        aria-label="New location — tap for details"
      >
        <span className="da-comic da-comic-mini">New location!</span>
        <Megaphone size={52} />
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="da-dock-scrim"
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
              className="da-dock-sheet"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" onClick={() => setExpanded(false)} aria-label="Close" className="da-sheet-x">
                ✕
              </button>
              <div className="da-dock-mega">
                <Megaphone size={72} />
              </div>
              <div className="da-comic">
                <AnnounceBody onClose={close} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
