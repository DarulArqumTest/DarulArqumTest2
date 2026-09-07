"use client";

import * as React from "react";

/**
 * Each prayer's sky, in one place.
 *
 * This used to live inside the prayer times page. The admin panel edits the
 * same board, and a second-hand approximation of it would have been a
 * different board — the point of editing Fajr is that you are looking at
 * Fajr's sky while you do it.
 */

export type PrayerLook = {
  bg: string;
  /** where the disc sits in the sky band, 0 zenith to 1 horizon */
  skyFrac: number;
  skyX: string;
  discSize: number;
  disc: string;
  discGlow: string;
  moon?: boolean;
  textPrimary: string;
  textAccent: string;
  textSecondary: string;
  textMuted: string;
  labelShadow: string;
  /** a one-pixel outline in the cell's own ink, so type survives over sky */
  halo: string;
};

/**
 * A crescent, not a circle with a bite out of it: builds a real crescent out
 * of a lit disc with a mask, and puts craters on the lit limb where they
 * catch the light. IDs are scoped with useId because several copies can be
 * in the document at once and a duplicate mask id resolves to whichever one
 * the browser saw first.
 */
export function Moon() {
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg width="100%" height="100%" viewBox="0 0 40 40" aria-hidden style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 0 6px rgba(198,214,255,0.5))" }}>
      <defs>
        <mask id={`mk${uid}`}>
          <rect width="40" height="40" fill="#000" />
          <circle cx="19" cy="20" r="17" fill="#fff" />
          <circle cx="31.5" cy="13.5" r="15" fill="#000" />
        </mask>
        <radialGradient id={`gr${uid}`} cx="34%" cy="64%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#eaeefc" />
          <stop offset="100%" stopColor="#c2cae6" />
        </radialGradient>
      </defs>
      <g mask={`url(#mk${uid})`}>
        <circle cx="19" cy="20" r="17" fill={`url(#gr${uid})`} />
        <circle cx="11.5" cy="14.5" r="2.7" fill="#a9b3d2" opacity="0.5" />
        <circle cx="8.6" cy="23.5" r="1.9" fill="#a9b3d2" opacity="0.42" />
        <circle cx="14.6" cy="28.5" r="1.4" fill="#a9b3d2" opacity="0.38" />
        <circle cx="7.6" cy="18.2" r="1.05" fill="#a9b3d2" opacity="0.34" />
        <circle cx="13.4" cy="21.6" r="1.15" fill="#a9b3d2" opacity="0.3" />
      </g>
    </svg>
  );
}

export const TIME_LOOK: Record<string, PrayerLook> = {
  fajr: {
    bg: "linear-gradient(180deg, #182238 0%, #35335c 48%, #6d4c6f 82%, #a8724f 100%)",
    skyFrac: 0.94, skyX: "50%", discSize: 38, disc: "radial-gradient(circle, #f7dfa6, #e3a25f 70%)", discGlow: "rgba(247,223,166,0.45)",
    textPrimary: "#fdf6e6", textAccent: "#ffe3a3", textSecondary: "rgba(253,246,230,0.88)", textMuted: "rgba(253,246,230,0.5)", labelShadow: "0 1px 6px rgba(0,0,0,0.75)",
    halo: "0 1px 0 rgba(10,14,30,0.95), 0 -1px 0 rgba(10,14,30,0.7), 1px 0 0 rgba(10,14,30,0.7), -1px 0 0 rgba(10,14,30,0.7), 0 0 4px rgba(10,14,30,0.95), 0 0 9px rgba(10,14,30,0.7)",
  },
  dhuhr: {
    bg: "linear-gradient(180deg, #2f6fb0 0%, #5b9bd6 55%, #a9d4ee 100%)",
    skyFrac: 0.02, skyX: "50%", discSize: 46, disc: "radial-gradient(circle, #fffbe8, #ffe9a0 70%)", discGlow: "rgba(255,251,232,0.65)",
    textPrimary: "#0e2419", textAccent: "#7a4a12", textSecondary: "rgba(14,36,25,0.8)", textMuted: "rgba(14,36,25,0.55)", labelShadow: "0 1px 5px rgba(255,255,255,0.85)",
    halo: "0 1px 0 rgba(255,255,255,0.95), 0 -1px 0 rgba(240,250,255,0.8), 1px 0 0 rgba(240,250,255,0.8), -1px 0 0 rgba(240,250,255,0.8), 0 0 4px rgba(255,255,255,0.95), 0 0 9px rgba(240,250,255,0.8)",
  },
  asr: {
    bg: "linear-gradient(180deg, #a8622c 0%, #cf9143 55%, #ecc57e 100%)",
    skyFrac: 0.4, skyX: "50%", discSize: 42, disc: "radial-gradient(circle, #fff2cf, #ffd27a 70%)", discGlow: "rgba(255,242,207,0.6)",
    textPrimary: "#2a1608", textAccent: "#5c2c0a", textSecondary: "rgba(42,22,8,0.78)", textMuted: "rgba(42,22,8,0.5)", labelShadow: "0 1px 5px rgba(255,240,214,0.8)",
    halo: "0 1px 0 rgba(255,250,238,0.95), 0 -1px 0 rgba(255,246,226,0.8), 1px 0 0 rgba(255,246,226,0.8), -1px 0 0 rgba(255,246,226,0.8), 0 0 4px rgba(255,250,238,0.95), 0 0 9px rgba(255,246,226,0.8)",
  },
  maghrib: {
    bg: "linear-gradient(180deg, #4a2a56 0%, #a83f4a 45%, #d9722f 78%, #f0a860 100%)",
    skyFrac: 0.96, skyX: "50%", discSize: 44, disc: "radial-gradient(circle, #fff0d2, #ffb35c 70%)", discGlow: "rgba(255,179,92,0.6)",
    textPrimary: "#fff3e4", textAccent: "#ffd9a0", textSecondary: "rgba(255,243,228,0.88)", textMuted: "rgba(255,243,228,0.55)", labelShadow: "0 1px 6px rgba(0,0,0,0.7)",
    halo: "0 1px 0 rgba(46,10,24,0.98), 0 -1px 0 rgba(46,10,24,0.8), 1px 0 0 rgba(46,10,24,0.8), -1px 0 0 rgba(46,10,24,0.8), 0 0 4px rgba(46,10,24,0.98), 0 0 9px rgba(46,10,24,0.8)",
  },
  isha: {
    bg: "linear-gradient(180deg, #0a1220 0%, #182642 55%, #223458 100%)",
    skyFrac: 0.16, skyX: "50%", discSize: 46, disc: "", discGlow: "", moon: true,
    textPrimary: "#f6f3ea", textAccent: "#e3c56a", textSecondary: "rgba(246,243,234,0.88)", textMuted: "rgba(246,243,234,0.45)", labelShadow: "0 1px 6px rgba(0,0,0,0.8)",
    halo: "0 1px 0 rgba(4,8,20,0.95), 0 -1px 0 rgba(4,8,20,0.7), 1px 0 0 rgba(4,8,20,0.7), -1px 0 0 rgba(4,8,20,0.7), 0 0 4px rgba(4,8,20,0.95), 0 0 9px rgba(4,8,20,0.7)",
  },
};

/** the sky band and its disc, exactly as the board draws it */
export function PrayerSky({ look }: { look: PrayerLook }) {
  return (
    <div
      className="da-iqama-sky"
      style={{ "--disc": `${look.discSize}px`, "--f": look.skyFrac, "--x": look.skyX } as React.CSSProperties}
      aria-hidden
    >
      <div
        className="da-iqama-disc"
        style={{
          borderRadius: look.moon ? 0 : 999,
          background: look.moon ? undefined : look.disc,
          boxShadow: look.moon ? undefined : `0 0 26px 8px ${look.discGlow}`,
        }}
      >
        {look.moon && <Moon />}
      </div>
    </div>
  );
}
