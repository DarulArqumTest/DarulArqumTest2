"use client";

/**
 * Prayer feature modules:
 *  - NextPrayerBand: live countdown heartbeat (home + prayer page)
 *  - PrayerScreen: the framed live Mawaqit mirror (the masjid TV screen)
 *  - IqamaCards: native five-prayer cards with active-state highlighting
 * All render safely from the fallback schedule if anything external fails.
 */

import * as React from "react";
import { motion } from "motion/react";
import { ExternalLink, MonitorPlay, BellRing } from "lucide-react";
import { EXT } from "@/lib/links";
import {
  PRAYERS,
  SHURUQ,
  nextPrayer,
  activePrayerKey,
  FALLBACK_DATE_NOTE,
} from "@/lib/prayer";

const EASE = [0.22, 1, 0.36, 1] as const;

function useNow(intervalMs = 30000) {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function NextPrayerBand() {
  const now = useNow();
  if (!now) return <div className="h-[64px] bg-forest" aria-hidden />;
  const next = nextPrayer(now);
  if (!next) return null;
  const h = Math.floor(next.minutesUntil / 60);
  const m = next.minutesUntil % 60;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden bg-forest px-5 py-4 text-bone"
    >
      <div className="mx-auto flex max-w-wide flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-3 text-sm">
          <span className="live-dot inline-block h-2 w-2 rounded-full bg-brassL" aria-hidden />
          <span className="text-bone/60">Next iqama</span>
          <span className="font-medium">
            {next.prayer.name}
            {next.tomorrow ? " (tomorrow)" : ""} · {next.prayer.iqama}
          </span>
          <span className="rounded-full bg-bone/10 px-3 py-1 text-xs text-brassL">
            in {h > 0 ? `${h}h ` : ""}{m}m
          </span>
        </p>
        <a
          href="/prayer-times"
          className="u-draw text-sm text-bone/80 hover:text-bone"
        >
          Full schedule + live screen
        </a>
      </div>
    </motion.div>
  );
}

export function PrayerScreen({ tall = false }: { tall?: boolean }) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.95, ease: EASE }}
      className="shimmer-frame relative overflow-hidden rounded-3xl border border-brass/25 bg-ink shadow-[0_30px_80px_-30px_rgba(12,17,14,0.6)]"
    >
      <div className="flex items-center justify-between border-b border-bone/10 px-5 py-3">
        <p className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-bone/60">
          <span className="live-dot inline-block h-2 w-2 rounded-full bg-red-500" aria-hidden />
          Live · masjid screen
        </p>
        <a
          href={EXT.mawaqitLive}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-brassL hover:text-bone"
        >
          Open full screen <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
      <div className="relative">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-bone/55" aria-hidden>
            <MonitorPlay className="h-7 w-7 animate-pulse" />
            <p className="text-sm">Connecting to the masjid screen…</p>
            <p className="max-w-xs text-center text-xs text-bone/40">
              If it doesn&apos;t load in your browser, use &ldquo;Open full screen&rdquo; above — the timings below stay available either way.
            </p>
          </div>
        )}
        <iframe
          src={EXT.mawaqitEmbed}
          title="Darul Arqum live prayer times (Mawaqit)"
          onLoad={() => setLoaded(true)}
          loading="lazy"
          allow="fullscreen"
          className={`relative w-full border-0 ${tall ? "h-[74vh] min-h-[540px]" : "h-[54vh] min-h-[420px]"}`}
        />
      </div>
    </motion.div>
  );
}

export function IqamaCards() {
  const now = useNow(60000);
  const active = now ? activePrayerKey(now) : null;
  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 gap-3 md:grid-cols-5"
      >
        {PRAYERS.map((p) => {
          const isActive = active === p.key;
          return (
            <motion.div
              key={p.key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className={`relative overflow-hidden rounded-2xl border p-5 text-center transition-colors ${
                isActive
                  ? "border-brass/60 bg-forest text-bone"
                  : "border-line bg-white/60 text-ink"
              }`}
            >
              {isActive && (
                <span className="absolute right-3 top-3 flex items-center gap-1 text-[10px] uppercase tracking-widest text-brassL">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-brassL" aria-hidden /> Now
                </span>
              )}
              <p lang="ar" dir="rtl" className={`font-arabic text-lg ${isActive ? "text-brassL" : "text-brass"}`}>
                {p.arabic}
              </p>
              <p className="mt-1 text-sm font-medium">{p.name}</p>
              <p className={`mt-3 text-[10px] uppercase tracking-widest ${isActive ? "text-bone/50" : "text-ink/45"}`}>
                Adhan
              </p>
              <p className="text-sm">{p.adhan}</p>
              <p className={`mt-2 text-[10px] uppercase tracking-widest ${isActive ? "text-bone/50" : "text-ink/45"}`}>
                Iqama
              </p>
              <p className={`text-lg font-medium ${isActive ? "text-brassL" : "text-forest"}`}>{p.iqama}</p>
            </motion.div>
          );
        })}
      </motion.div>
      <p className="mt-4 flex items-center gap-2 text-xs text-ink/50">
        <BellRing className="h-3.5 w-3.5 text-brass" aria-hidden />
        Shurûq {SHURUQ} · {FALLBACK_DATE_NOTE} — iqama changes are announced in the WhatsApp group.
      </p>
    </div>
  );
}
