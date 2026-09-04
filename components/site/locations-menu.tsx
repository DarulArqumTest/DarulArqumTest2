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
      style={{ position: "relative" }}
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
        className="u-draw inline-flex items-center gap-1.5 text-sm font-medium text-da-cream/[0.82] transition-all hover:-translate-y-0.5 hover:text-da-goldL"
      >
        Locations
        <span aria-hidden style={{ fontSize: 9, opacity: 0.7, transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s ease" }}>
          ▾
        </span>
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 14px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 60,
              width: 288,
              padding: 7,
              borderRadius: 16,
              background: "rgba(11,30,20,0.97)",
              backdropFilter: "blur(14px) saturate(150%)",
              border: "1px solid rgba(201,162,39,0.34)",
              boxShadow: "0 26px 56px -20px rgba(0,0,0,0.75)",
            }}
          >
            {LOCATION_LIST.map((loc) => (
              <Link
                key={loc.key}
                href={`${R.locations}#${loc.key}`}
                style={{ display: "block", padding: "12px 14px", borderRadius: 11, transition: "background 0.16s ease" }}
                className="hover:bg-da-gold/10"
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
