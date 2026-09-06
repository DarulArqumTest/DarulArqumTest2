"use client";

/**
 * Locations navigation. The masjid now runs two sites, so location is a
 * top-level decision rather than a line in the contact section: a hover/focus
 * dropdown on desktop, and a flat labelled list inside the mobile sheet.
 */

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { LOCATION_LIST, R } from "@/lib/links";

function StatusDot({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={open ? "da-live-pulse" : undefined}
      style={{
        width: 7,
        height: 7,
        borderRadius: 999,
        flexShrink: 0,
        background: open ? "#7cc99a" : "#e3c56a",
        boxShadow: `0 0 8px ${open ? "rgba(124,201,154,0.8)" : "rgba(227,197,106,0.8)"}`,
      }}
    />
  );
}

export function LocationsMenu() {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<number | undefined>(undefined);

  const show = React.useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);
  const hide = React.useCallback(() => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 130);
  }, []);

  React.useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      className="da-loc-menu"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href={R.locations}
        aria-expanded={open}
        aria-haspopup="true"
        className="da-loc-trigger"
        data-open={open || undefined}
      >
        {/* A real map pin, in map-pin red, dropped on the fold */}
        <svg className="da-loc-pin" width="14" height="17" viewBox="0 0 15 18" aria-hidden>
          <ellipse cx="7.5" cy="16.4" rx="3.6" ry="1.2" fill="rgba(0,0,0,0.32)" />
          <path d="M7.5 1C4.6 1 2.2 3.35 2.2 6.25c0 3.9 5.3 9.3 5.3 9.3s5.3-5.4 5.3-9.3C12.8 3.35 10.4 1 7.5 1Z" fill="#d4483f" stroke="#f0a89f" strokeWidth="0.9" strokeLinejoin="round" />
          <circle cx="7.5" cy="6.2" r="2" fill="#fbeee9" />
        </svg>
        Locations
        <span className="da-loc-caret" aria-hidden>▾</span>
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            // `x: "-50%"` is the centring pull-back, and it MUST live here
            // rather than in CSS: Motion writes the whole `transform` on this
            // element every frame, so a CSS `translateX(-50%)` gets clobbered
            // and the menu hangs half its width off to one side.
            initial={{ opacity: 0, y: -6, scale: 0.98, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -6, scale: 0.98, x: "-50%" }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="da-loc-dropdown"
          >
            {LOCATION_LIST.map((loc) => (
              <Link
                key={loc.key}
                href={`${R.locations}#${loc.key}`}
                // Each site carries its own colour rather than sharing one
                // green wash: gold for the masjid that is open, mint for the
                // one still coming. Applied as light falling across the row,
                // not as a bar down its edge.
                style={{ display: "block", padding: "12px 14px", borderRadius: 11, backgroundImage: `linear-gradient(100deg, ${loc.accent}1f, transparent 62%)`, transition: "background-color 0.16s ease" }}
                className="hover:bg-da-cream/[0.07]"
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <StatusDot open={loc.status === "open"} />
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, color: "#f6f3ea" }}>{loc.name}</span>
                </span>
                <span style={{ display: "block", fontSize: 12.5, color: "rgba(246,243,234,0.62)", lineHeight: 1.45 }}>{loc.street}</span>
                <span style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: loc.accent, fontWeight: 700, marginTop: 4 }}>
                  {loc.statusLabel}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LocationsMobileList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div style={{ padding: "6px 12px 10px" }}>
      <div style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(201,162,39,0.85)", fontWeight: 800, marginBottom: 8 }}>
        Locations
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {LOCATION_LIST.map((loc) => (
          <Link
            key={loc.key}
            href={`${R.locations}#${loc.key}`}
            onClick={onNavigate}
            style={{
              display: "block",
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(246,243,234,0.05)",
              border: "1px solid rgba(246,243,234,0.13)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <StatusDot open={loc.status === "open"} />
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: "#f6f3ea" }}>{loc.name}</span>
            </span>
            <span style={{ display: "block", fontSize: 12.5, color: "rgba(246,243,234,0.6)", overflowWrap: "anywhere" }}>{loc.street}</span>
            <span style={{ display: "block", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: loc.accent, fontWeight: 700, marginTop: 3 }}>
              {loc.statusLabel}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
