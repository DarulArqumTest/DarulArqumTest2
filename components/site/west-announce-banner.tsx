"use client";

/**
 * "New location" announcement.
 *
 * Staged entrance, in the order it reads: the megaphone swings up from flat
 * and off-screen, its sound waves fade in once it is upright, and only then
 * does the speech bubble pop. Nothing loops afterwards — the old idle shake
 * pulled the eye back every few seconds for no reason.
 *
 * Desktop — anchored INSIDE the hero, so it scrolls away with it.
 * Phone — docked bottom-right and follows the reader; tapping blurs the page
 * and raises the same content, scaled to fit.
 *
 * Deliberately outside the site's green/gold palette: this is a one-off
 * shout, and dressing it like the rest of the furniture is what stopped it
 * standing out.
 */

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LOCATIONS, R } from "@/lib/links";
import { Megaphone } from "@/components/site/megaphone";
import { ComicBubble } from "@/components/site/comic-bubble";

const KEY = "da-west-announce-dismissed";
const west = LOCATIONS.west;
const EASE = [0.22, 1, 0.36, 1] as const;

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

/** Megaphone that swings up from lying flat, then starts sounding. */
function SwingInMegaphone({ size, delay = 0 }: { size: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="da-mega-swing"
      initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: 84, x: 90, y: 26 }}
      animate={{ opacity: 1, rotate: 0, x: 0, y: 0 }}
      transition={{ duration: reduce ? 0.3 : 0.78, delay, ease: EASE }}
      onAnimationComplete={() => {
        // waves only start once the horn is upright and pointing
        document.documentElement.style.setProperty("--da-wave-on", "1");
      }}
    >
      <Megaphone size={size} facing="left" />
    </motion.div>
  );
}

function AnnounceBody({ onClose, compact }: { onClose?: () => void; compact?: boolean }) {
  return (
    <>
      <div className="da-comic-eyebrow">
        <span aria-hidden />
        We have a new location
      </div>
      <h2 className="da-comic-title">
        Introducing <em>Darul Arqum West</em>
      </h2>
      {!compact && (
        <p className="da-comic-copy">
          The community has acquired a second masjid at {west.street}. Opening details are on the way.
        </p>
      )}
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

/* ── desktop: lives in the hero, scrolls with it ──────────────── */

export function HeroAnnouncement() {
  const reduce = useReducedMotion();
  return (
    <aside className="da-hero-announce" aria-label="New location announcement">
      <motion.div
        className="da-hero-bubble"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        // waits for the horn to swing up and start sounding
        transition={{ duration: 0.5, delay: reduce ? 0.2 : 1.85, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <ComicBubble tail="right">
          <AnnounceBody />
        </ComicBubble>
      </motion.div>
      <div className="da-hero-mega">
        <SwingInMegaphone size={172} delay={0.9} />
      </div>
    </aside>
  );
}

/* ── phone: docks bottom-right, opens a sheet ─────────────────── */

export function WestAnnounceDock() {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (readDismissed()) return;
    const t = window.setTimeout(() => setShown(true), 1800);
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
      <button type="button" className="da-dock" onClick={() => setExpanded(true)} aria-label="New location, tap for details">
        <motion.span
          className="da-dock-bubble"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.42, delay: reduce ? 0 : 0.85, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <ComicBubble tail="right" className="da-cb-mini">
            New location!
          </ComicBubble>
        </motion.span>
        <SwingInMegaphone size={62} delay={0.1} />
      </button>

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
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" onClick={() => setExpanded(false)} aria-label="Close" className="da-sheet-x">
                ✕
              </button>
              {/* A phone screen is portrait, so the desktop's side-by-side
                  arrangement does not scale down cleanly. Here the bubble is a
                  wide box with its tail leaving the underside, and the horn
                  sits below it. */}
              <ComicBubble tail="bottom">
                <AnnounceBody onClose={close} />
              </ComicBubble>
              <div className="da-sheet-mega">
                <Megaphone size={104} facing="left" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
