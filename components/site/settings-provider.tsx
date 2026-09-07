"use client";

import * as React from "react";
import { DEFAULT_SETTINGS, repaidFraction, type SiteSettings } from "@/lib/settings";

/**
 * One set of numbers for the whole site.
 *
 * Before this, every component read ORG.finances directly, so changing the
 * per-family figure meant changing it in six files and missing one. The
 * layout reads the stored settings on the server and hands them down; every
 * component that shows money takes them from here.
 *
 * The defaults are the same object the server starts from, so a page renders
 * identically whether or not anything has ever been overridden.
 */

const Ctx = React.createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SettingsProvider({ value, children }: { value: SiteSettings; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return React.useContext(Ctx);
}

/** the money, plus the two figures worked out from it */
export function useFinances() {
  const s = React.useContext(Ctx);
  return React.useMemo(
    () => ({
      ...s.finances,
      repaid: s.finances.loanTotal - s.finances.loanRemaining,
      repaidFraction: repaidFraction(s.finances),
    }),
    [s.finances],
  );
}
