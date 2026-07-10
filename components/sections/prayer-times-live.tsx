"use client";

/** Prayer Times page — redesigned (2026) presentation layer.
 * Reuses lib/prayer.ts data logic and prayer-modules.tsx's PrayerScreen
 * (the live Mawaqit iframe) as-is; everything visual here is new. */

import * as React from "react";
import { motion } from "motion/react";
import { EXT, ORG } from "@/lib/links";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { PrayerScreen } from "@/components/prayer/prayer-modules";
import { PRAYERS, SHURUQ, nextPrayer, activePrayerKey, FALLBACK_DATE_NOTE } from "@/lib/prayer";
import { DaAmbient } from "@/components/site/da-motifs";

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

/* ── Fixed Iqama countdown pill — this page only ─────────────── */

export function IqamaCountdownPill() {
  const now = useNow();
  if (!now) return null;
  const next = nextPrayer(now);
  if (!next) return null;
  const h = Math.floor(next.minutesUntil / 60);
  const m = next.minutesUntil % 60;
  return (
    <div className="fixed left-1/2 top-[70px] z-[25] -translate-x-1/2 whitespace-nowrap">
      <div className="flex items-center gap-2.5 rounded-full border border-da-gold/35 bg-da-bg/90 px-5 py-2.5 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <span className="da-live-pulse h-[7px] w-[7px] rounded-full bg-da-gold" />
        <span className="text-xs text-da-cream/60">Next iqama</span>
        <span className="text-[13px] font-semibold text-da-cream">
          {next.prayer.name}
          {next.tomorrow ? " (tomorrow)" : ""} · {next.prayer.iqama}
        </span>
        <span className="rounded-full bg-da-gold/[0.16] px-2.5 py-1 text-[11px] text-da-goldL">
          in {h > 0 ? `${h}h ` : ""}
          {m}m
        </span>
      </div>
    </div>
  );
}

/* ── Wooden TV bezel housing the live Mawaqit screen ──────────── */

function WoodenTvFrame() {
  return (
    <div>
      <div className="mx-auto flex w-fit items-center gap-2.5 rounded-t-xl bg-gradient-to-br from-[#7a2020] to-[#4d1414] px-5 py-2 text-xs text-da-cream">
        <span className="da-live-pulse h-1.5 w-1.5 rounded-full bg-da-cream" />
        <span className="font-semibold uppercase tracking-wider">Jumu&apos;ah</span>
        <span className="text-da-cream/80">
          1st Khutbah {ORG.jumua.first} &amp; 2nd Khutbah {ORG.jumua.second}
        </span>
      </div>
      <div
        className="rounded-[30px] border border-black/50 p-5 pb-4 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)]"
        style={{ background: "linear-gradient(155deg, #333029, #171512)" }}
      >
        <div className="overflow-hidden rounded-2xl border-2 border-da-gold/40 bg-[#08150f]">
          <PrayerScreen tall />
        </div>
        <p className="mt-3 text-center text-[11px] tracking-[0.3em] text-da-gold/50">✦ DARUL ARQUM ✦</p>
      </div>
      <div className="mx-auto h-6 w-24" style={{ background: "linear-gradient(155deg, #333029, #171512)", clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }} />
      <div className="mx-auto h-2.5 w-44 rounded-full" style={{ background: "linear-gradient(155deg, #333029, #171512)" }} />
    </div>
  );
}

/* ── Per-prayer time-of-day gradient cards ───────────────────── */

const TIME_LOOK: Record<string, { bg: string; discTop: string; discSize: number; disc: string; dark?: boolean }> = {
  fajr: {
    bg: "linear-gradient(180deg, #182238 0%, #35335c 48%, #6d4c6f 82%, #a8724f 100%)",
    discTop: "76%",
    discSize: 34,
    disc: "radial-gradient(circle, #f7dfa6, #e3a25f 70%)",
  },
  dhuhr: {
    bg: "linear-gradient(180deg, #2f6fb0 0%, #5b9bd6 55%, #a9d4ee 100%)",
    discTop: "10%",
    discSize: 40,
    disc: "radial-gradient(circle, #fffbe8, #ffe9a0 70%)",
    dark: true,
  },
  asr: {
    bg: "linear-gradient(180deg, #a8622c 0%, #cf9143 55%, #ecc57e 100%)",
    discTop: "30%",
    discSize: 38,
    disc: "radial-gradient(circle, #fff2cf, #ffd27a 70%)",
    dark: true,
  },
  maghrib: {
    bg: "linear-gradient(180deg, #4a2a56 0%, #a83f4a 45%, #d9722f 78%, #f0a860 100%)",
    discTop: "68%",
    discSize: 42,
    disc: "radial-gradient(circle, #fff0d2, #ffb35c 70%)",
  },
  isha: {
    bg: "linear-gradient(180deg, #0a1220 0%, #182642 55%, #223458 100%)",
    discTop: "14%",
    discSize: 16,
    disc: "radial-gradient(circle, #f4f6ff, #cfd8f5 70%)",
  },
};

function DaIqamaCards() {
  const now = useNow(60000);
  const active = now ? activePrayerKey(now) : null;
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {PRAYERS.map((p, i) => {
          const look = TIME_LOOK[p.key];
          const isActive = active === p.key;
          const textColor = look.dark ? "#2a1608" : "#f6f3ea";
          return (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              className={`relative overflow-hidden p-5 pt-8 text-center ${i === 0 ? "rounded-l-2xl" : ""} ${
                i === PRAYERS.length - 1 ? "rounded-r-2xl" : ""
              }`}
              style={{
                background: look.bg,
                boxShadow: isActive ? "inset 0 0 0 2px rgba(227,197,106,0.5)" : undefined,
                color: textColor,
              }}
            >
              <span
                className="absolute rounded-full blur-[1px]"
                style={{ top: look.discTop, left: "50%", transform: "translate(-50%, -50%)", width: look.discSize, height: look.discSize, background: look.disc }}
              />
              {isActive && (
                <div className="absolute -top-[17px] left-1/2 -translate-x-1/2">
                  <div className="da-live-pulse absolute left-1/2 top-1/2 h-11 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md" style={{ background: "radial-gradient(circle, rgba(227,197,106,0.85), transparent 72%)" }} />
                  <div className="relative flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase text-[#1c2b21]" style={{ background: "linear-gradient(135deg, #f3d98a, #c9a227)", boxShadow: "0 8px 20px -4px rgba(227,197,106,0.7), 0 0 0 3px #0d2318" }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1c2b21]" /> Now
                  </div>
                </div>
              )}
              <p className="relative font-arabic text-lg" lang="ar" dir="rtl">
                {p.arabic}
              </p>
              <p className="relative mt-1 text-sm font-bold">{p.name}</p>
              <p className="relative mt-3 text-[10px] uppercase tracking-widest opacity-60">Adhan</p>
              <p className="relative text-[13px]">{p.adhan}</p>
              <p className="relative mt-2 text-[10px] uppercase tracking-widest opacity-60">Iqama</p>
              <p className="relative text-[16.5px] font-bold">{p.iqama}</p>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-da-cream/55">
        ✦ Shurûq {SHURUQ} · {FALLBACK_DATE_NOTE} — changes are announced in the WhatsApp group.
      </p>
    </div>
  );
}

/* ── Page composition ─────────────────────────────────────────── */

export function PrayerTimesLive() {
  return (
    <div className="relative overflow-hidden bg-da-bg px-5 pb-24 pt-14 font-daBody text-da-cream md:pt-20">
      <DaAmbient stars />
      <IqamaCountdownPill />

      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <div
            className="mb-10 flex flex-wrap items-center gap-4 rounded-2xl border border-da-gold/35 px-7 py-5"
            style={{ background: "linear-gradient(120deg, rgba(201,162,39,0.14), rgba(201,162,39,0.04))" }}
          >
            <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-da-cream text-2xl">📢</span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-da-goldL">Special request</p>
              <p className="mt-1 text-sm leading-relaxed text-da-cream/85">
                Please arrive before iqama. Timing changes are announced in the community WhatsApp group.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-da-goldL">Live from the masjid</p>
          <h2 className="mt-2 text-center font-daDisplay text-2xl font-medium text-da-cream md:text-3xl">
            Today&apos;s board, straight off the screen
          </h2>
        </Reveal>

        <div className="mt-8">
          <WoodenTvFrame />
        </div>

        <div className="mt-16">
          <SectionIntro dark theme="da" eyebrow="Today at the masjid" title="Iqama, at a glance" />
          <div className="mt-8">
            <DaIqamaCards />
          </div>
        </div>

        <Reveal delay={0.1}>
          <div
            className="mt-16 rounded-[20px] border border-da-gold/[0.22] p-8 text-center md:p-12"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(201,162,39,0.12), transparent 70%), linear-gradient(180deg, #123321, #0d2419)",
            }}
          >
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-[clamp(22px,3vw,30px)] font-bold leading-[2] text-transparent"
              style={{ backgroundImage: "linear-gradient(100deg, #f3d98a, #c9a227 55%, #8a6a1e)", WebkitBackgroundClip: "text", backgroundClip: "text" }}
            >
              مَنْ تَوَضَّأَ لِلصَّلاَةِ فَأَسْبَغَ الْوُضُوءَ ثُمَّ مَشَى إِلَى الصَّلاَةِ الْمَكْتُوبَةِ فَصَلاَّهَا مَعَ النَّاسِ أَوْ مَعَ الْجَمَاعَةِ أَوْ فِي الْمَسْجِدِ غَفَرَ اللَّهُ لَهُ ذُنُوبَهُ
            </p>
            <div className="mx-auto mt-5 h-px w-11 bg-da-gold/50" />
            <p className="mx-auto mt-5 max-w-xl font-daDisplay text-xl italic leading-relaxed text-da-cream">
              &ldquo;Salat is the key to Paradise. Whoever performs wudu and does it well, then walks to the
              obligatory prayer and offers it with the congregation, or in the masjid — Allah will forgive his
              sins.&rdquo;
            </p>
            <p className="mt-3 text-[12.5px] text-da-cream/50">Sahih Muslim, Vol 1, No. 549</p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative mx-auto mt-20 max-w-[760px]">
        <a
          href={EXT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-5 rounded-[22px] border-[1.5px] border-da-mint/40 p-8 transition-transform hover:-translate-y-0.5"
          style={{ background: "linear-gradient(120deg, #163f2c, #0d2b1e)" }}
        >
          <span className="da-float-slow flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-da-mint/15">
            <img src="/assets/whatsapp-icon.png" alt="" className="h-9 w-9 object-contain" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-da-mint">Timing changes, announced live</p>
            <p className="mt-1 font-daDisplay text-2xl font-semibold text-da-cream">Join the community WhatsApp group</p>
            <p className="mt-1.5 text-sm leading-relaxed text-da-cream/70">
              Get iqama change alerts, janazah announcements and event updates the moment they&apos;re posted.
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full bg-da-mint px-6 py-3 text-sm font-semibold text-da-bg sm:inline-block">
            Join the group ↗
          </span>
        </a>
      </Reveal>
    </div>
  );
}
