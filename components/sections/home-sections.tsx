"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  HandCoins,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  X,
  BadgeCheck,
} from "lucide-react";
import { EXT, ORG, R } from "@/lib/links";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { IqamaCards, PrayerScreen } from "@/components/prayer/prayer-modules";
import { SafeImage } from "@/components/site/safe-image";
import { DaAmbient, CrescentLantern, StarMedallion } from "@/components/site/da-motifs";
import { requestSectionScroll, SectionSpotlight, useSectionHighlightController } from "@/components/site/use-scroll-highlight";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Hero ─────────────────────────────────────────────────────── */

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 16 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-da-bg px-5 pb-24 pt-32 font-daBody text-da-cream">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 22% 30%, rgba(20,60,42,0.55), transparent 70%), linear-gradient(180deg, rgba(9,24,17,0.93) 0%, rgba(13,34,24,0.88) 38%, rgba(14,40,27,0.97) 100%)",
        }}
      />
      <DaAmbient stars />
      <StarMedallion size={340} className="right-[-90px] top-[-60px]" />
      <CrescentLantern size={46} className="absolute right-[8%] top-[14%]" />
      <CrescentLantern size={30} withLantern={false} className="absolute left-[10%] top-[22%]" />

      <div className="relative mx-auto w-full max-w-wide">
        <motion.div {...rise(0.05)} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-da-cream">
            <Image src={EXT.logo} alt="Darul Arqum logo" width={36} height={36} className="h-9 w-9 rounded-lg object-cover" priority />
          </span>
          <span className="font-daDisplay text-2xl font-semibold text-da-cream">Darul Arqum</span>
        </motion.div>

        <motion.p
          {...rise(0.12)}
          className="mt-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-da-gold"
        >
          <span className="h-px w-6 bg-da-gold" />
          Riverside South Muslim Community Association
        </motion.p>

        <motion.p {...rise(0.18)} lang="ar" dir="rtl" className="mt-4 font-arabic text-2xl text-da-cream/85">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </motion.p>

        <h1 className="mt-4 max-w-4xl font-daDisplay text-[clamp(40px,6vw,74px)] font-medium leading-[1.05] text-da-cream">
          <motion.span {...rise(0.26)} className="block">
            A house of prayer
          </motion.span>
          <motion.span {...rise(0.32)} className="block">
            rising in <span className="italic text-da-gold">Riverside South.</span>
          </motion.span>
        </h1>

        <motion.p {...rise(0.4)} className="mt-7 max-w-xl text-[17px] leading-relaxed text-da-cream/78">
          The first masjid in the community — 4269 Limebank Rd, Ottawa. Acquired by its people in
          2020, sustained by its people every month since. Let&apos;s build it together.
        </motion.p>

        <motion.div {...rise(0.48)} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#programs-section"
            onClick={(e) => {
              e.preventDefault();
              requestSectionScroll("programs-section");
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-da-gold px-7 py-[15px] text-sm font-semibold text-da-bg transition-transform hover:-translate-y-0.5 hover:brightness-105"
          >
            Programs &amp; news
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
          <Link
            href={R.prayer}
            className="inline-flex items-center gap-2 rounded-full border border-da-cream/25 px-7 py-[15px] text-sm font-medium text-da-cream transition-colors hover:bg-da-cream/10"
          >
            <Clock className="h-4 w-4" aria-hidden />
            Prayer times — live
          </Link>
        </motion.div>

        <motion.div {...rise(0.56)} className="mt-16 flex max-w-3xl flex-wrap gap-3.5">
          {[
            { label: "Jumu'ah", value: `${ORG.jumua.first} & ${ORG.jumua.second}` },
            { label: "Daily prayers", value: "In congregation, every day" },
            { label: "CRA charity", value: ORG.charityReg },
          ].map((c) => (
            <div
              key={c.label}
              className="flex-1 basis-[220px] rounded-xl border border-da-cream/[0.12] bg-da-cream/[0.045] px-[18px] py-4"
            >
              <p className="font-semibold text-da-cream">{c.label}</p>
              <p className="mt-0.5 text-sm text-da-cream/65">{c.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Prayer times snapshot ────────────────────────────────────── */

export function PrayerFeature() {
  return (
    <section className="relative overflow-hidden bg-da-bg px-5 py-24 font-daBody md:py-32">
      <DaAmbient />
      <div className="relative mx-auto max-w-wide">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.25fr]">
          <div className="lg:sticky lg:top-28">
            <SectionIntro
              dark
              theme="da"
              eyebrow="Live from the masjid"
              title="The prayer screen, wherever you are"
              lede="The same Mawaqit display running inside Darul Arqum — adhan and iqama for all five prayers, Hijri date, Shurûq and Jumu'ah — mirrored here in real time."
            />
            <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-3">
              <Link
                href={R.prayer}
                className="group inline-flex items-center gap-2 rounded-full bg-da-gold px-6 py-3.5 text-sm font-semibold text-da-bg transition-transform hover:-translate-y-0.5"
              >
                Open the prayer page
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <a
                href={EXT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-da-cream/20 px-6 py-3.5 text-sm text-da-cream transition-colors hover:bg-da-cream/10"
              >
                Iqama alerts on WhatsApp
              </a>
            </Reveal>
          </div>
          <div>
            <PrayerScreen />
            <div className="mt-6">
              <IqamaCards />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Programs grid + info modal ───────────────────────────────── */

type ProgramKey = "aalim" | "hifz" | "quran" | "kids" | "welearn";

const PROGRAM_INFO: Record<
  ProgramKey,
  { title: string; eyebrow: string; lede: string; body: string; logistics: string; accent: string; cta: { label: string; href: string } }
> = {
  aalim: {
    title: "Aalim program",
    eyebrow: "Al-Arif Islamic Institute · flagship",
    lede: "Led by Mufti Taqi — trained in jurisprudence, Hadith, Tafsir and Arabic — Al-Arif Madrasa pairs academic excellence with spiritual grounding.",
    body: "Structured classical studies: Sarf & Nahw, Quran, Hadith, Fiqh and Aqa'id — a full academic path toward becoming a scholar of Islamic sciences.",
    logistics: "Full-time program, Monday–Friday, on site at Darul Arqum · $150/month.",
    accent: "#c9a227",
    cta: { label: "Register for Aalim", href: "/programs/aalim/register" },
  },
  hifz: {
    title: "Quran Hifz",
    eyebrow: "Al-Arif Islamic Institute · flagship",
    lede: "A dedicated, full-time track for students pursuing memorization of the Quran as their primary focus, under Mufti Taqi.",
    body: "Structured daily hours for revision and new memorization, paired with tajweed correction and continuous assessment, until the Quran is completed and preserved by heart.",
    logistics: "Full-time program, Monday–Friday, on site at Darul Arqum · $75/month.",
    accent: "#d98f4a",
    cta: { label: "Register for Hifz", href: "/programs/hifz/register" },
  },
  quran: {
    title: "Weekend Quran classes",
    eyebrow: "Weekend madrasa · ages 6+",
    lede: "Building recitation, memorization, and character — one structured track at a time.",
    body: "Students progress through five tracks: Nazira (reading), Hifz (memorization), Deeniyaat (Islamic studies), Akhlaqiat (character) and Seerah.",
    logistics: "Saturday & Sunday, at the masjid · $50/month.",
    accent: "#d98f4a",
    cta: { label: "Register for weekend classes", href: "/programs/quran-classes/register" },
  },
  kids: {
    title: "KidsLearnArabic",
    eyebrow: "Ages 5–10",
    lede: "A dedicated Arabic track for young learners — playful, structured, and rooted in the language of the Quran.",
    body: "Children aged 5–10 build letters, sounds, vocabulary and confidence in a nurturing environment at the masjid, taught by teachers experienced with young learners.",
    logistics: "Ages 5–10, on site at Darul Arqum.",
    accent: "#7cc99a",
    cta: { label: "Register for KidsLearnArabic", href: "/programs/kids-arabic/register" },
  },
  welearn: {
    title: "welearn",
    eyebrow: "Online · Zoom",
    lede: "Live online Islamic learning from Darul Arqum with Sheikh Saud Hasan — join the class over Zoom from anywhere.",
    body: "Sessions run live — no software beyond Zoom needed. Class announcements, schedule changes and recordings are shared through the community WhatsApp group.",
    logistics: "Live over Zoom — link shared with registered students.",
    accent: "#8fb4c9",
    cta: { label: "Join the live class", href: EXT.welearnZoom },
  },
};

function ProgramModal({ program, onClose }: { program: ProgramKey | null; onClose: () => void }) {
  const info = program ? PROGRAM_INFO[program] : null;
  React.useEffect(() => {
    if (!program) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [program, onClose]);

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(6,16,11,0.72)] p-6 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-[20px] border border-da-gold/25 bg-da-modal shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]"
          >
            <div className="h-[110px]" style={{ background: `linear-gradient(135deg, ${info.accent}22, transparent)` }} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-da-cream/10 text-da-cream"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <div className="px-8 pb-8 pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: info.accent }}>
                {info.eyebrow}
              </p>
              <h3 className="mt-2 font-daDisplay text-2xl font-semibold text-da-cream">{info.title}</h3>
              <p className="mt-3 italic leading-relaxed text-da-cream/80">{info.lede}</p>
              <p className="mt-3 text-sm leading-relaxed text-da-cream/65">{info.body}</p>
              <p className="mt-4 text-sm font-medium text-da-cream/85">{info.logistics}</p>
              <a
                href={info.cta.href}
                target={info.cta.href.startsWith("http") ? "_blank" : undefined}
                rel={info.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-da-bg"
                style={{ background: `linear-gradient(135deg, ${info.accent}, ${info.accent}cc)` }}
              >
                {info.cta.label} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WelearnScene() {
  return (
    <div
      className="relative h-full min-h-[160px] overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(100deg, #8a6a44 0%, #6b4f30 50%, #55391f 100%)",
        backgroundImage:
          "repeating-linear-gradient(100deg, rgba(0,0,0,0.08) 0px, transparent 2px, transparent 34px, rgba(0,0,0,0.08) 36px)",
      }}
    >
      <div className="absolute left-6 top-6 h-[60px] w-[64px] -rotate-6 rounded-[3px]" style={{ background: "linear-gradient(115deg,#8a2020,#6b1414)" }} />
      <div className="absolute left-[68px] top-16 h-[70px] w-[86px] rotate-3 rounded-lg border-[3px] border-[#15181c] bg-[#15181c] p-1.5">
        <div className="relative h-full w-full rounded" style={{ background: "linear-gradient(160deg,#1a3c2a,#0e2419)" }}>
          <div className="absolute inset-x-0 top-2 flex flex-col items-center gap-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-da-gold">
              <span className="ml-0.5 h-0 w-0 border-y-[3px] border-l-[5px] border-y-transparent border-l-da-gold" />
            </span>
            <span className="font-daDisplay text-[10px] text-white">welearn</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-[rgba(20,14,8,0.55)] px-5 py-3 backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-wider text-da-cream/60">Online · Zoom</p>
        <p className="font-daDisplay text-lg font-semibold text-da-cream">welearn</p>
      </div>
    </div>
  );
}

export function ProgramsSection() {
  const [open, setOpen] = React.useState<ProgramKey | null>(null);
  return (
    <section id="programs-section" className="relative bg-da-bg px-5 py-24 font-daBody md:py-32">
      <SectionSpotlightHost id="programs-section" />
      <DaAmbient />
      <div className="relative mx-auto max-w-wide">
        <SectionIntro
          dark
          theme="da"
          eyebrow="Programs &amp; news"
          title="We offer learning for every age, every week."
          lede="Led by Mufti Taqi and our teaching team — choose the track that fits, at any age."
        />

        <div className="mt-14 overflow-hidden rounded-3xl border border-da-gold/30 p-2">
          <Reveal>
            <button
              type="button"
              onClick={() => setOpen("aalim")}
              className="group relative block w-full overflow-hidden rounded-2xl p-7 text-left"
            >
              <SafeImage
                src="/assets/program-aalim.jpg"
                alt="Aalim program"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(9,20,15,0.55) 0%, rgba(9,20,15,0.8) 60%, #0e2419 100%)" }}
              />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-da-gold">Al-Arif Islamic Institute · flagship</p>
                <h3 className="mt-2 font-daDisplay text-2xl font-semibold text-da-cream">Aalim program</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-da-cream/65">
                  Classical studies — Sarf &amp; Nahw, Quran, Hadith, Fiqh and Aqa&apos;id — a full academic path toward becoming a scholar.
                </p>
                <span className="mt-4 inline-block rounded-full bg-da-cream/10 px-3 py-1 text-xs font-medium text-da-cream/80">
                  Monday–Friday · $150/mo
                </span>
              </div>
            </button>
          </Reveal>

          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <Reveal delay={0.05}>
              <button
                type="button"
                onClick={() => setOpen("hifz")}
                className="block h-full w-full rounded-2xl p-7 text-left transition-colors hover:bg-da-cream/[0.04]"
                style={{ boxShadow: "inset 3px 0 0 rgba(217,143,74,0.5)", background: "rgba(217,143,74,0.05)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-da-orange">Full-time</p>
                <h3 className="mt-2 font-daDisplay text-xl font-semibold text-da-cream">Hifz program</h3>
                <p className="mt-2 text-sm leading-relaxed text-da-cream/65">
                  Full-time memorization of the Qur&apos;an with tajweed and Islamic studies.
                </p>
                <span className="mt-4 inline-block rounded-full bg-da-cream/10 px-3 py-1 text-xs font-medium text-da-cream/80">
                  Monday–Friday · $75/mo
                </span>
              </button>
            </Reveal>
            <Reveal delay={0.1}>
              <button
                type="button"
                onClick={() => setOpen("quran")}
                className="block h-full w-full rounded-2xl bg-da-cream/[0.03] p-7 text-left transition-colors hover:bg-da-cream/[0.05]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-da-blue">Weekend</p>
                <h3 className="mt-2 font-daDisplay text-xl font-semibold text-da-cream">Weekend classes</h3>
                <p className="mt-2 text-sm leading-relaxed text-da-cream/65">Quran reading &amp; tajweed for all ages.</p>
                <span className="mt-4 inline-block rounded-full bg-da-cream/10 px-3 py-1 text-xs font-medium text-da-cream/80">
                  Saturday &amp; Sunday · $50/mo
                </span>
              </button>
            </Reveal>
          </div>

          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <Reveal delay={0.15}>
              <button
                type="button"
                onClick={() => setOpen("kids")}
                className="block h-full w-full rounded-2xl border border-da-kids/25 p-7 text-left transition-colors hover:bg-da-cream/[0.04]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-da-kids">Ages 5–10</p>
                <h3 className="mt-2 font-daDisplay text-xl font-semibold text-da-cream">KidsLearnArabic</h3>
                <p className="mt-2 text-sm leading-relaxed text-da-cream/65">
                  Playful, structured Arabic for young learners.
                </p>
              </button>
            </Reveal>
            <Reveal delay={0.2}>
              <button type="button" onClick={() => setOpen("welearn")} className="block h-full w-full text-left">
                <WelearnScene />
              </button>
            </Reveal>
          </div>
        </div>
      </div>

      <ProgramModal program={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/* ── WhatsApp / community section ─────────────────────────────── */

export function CommunitySection() {
  return (
    <section id="whatsapp-section" className="relative bg-da-bg px-5 pb-24 font-daBody md:pb-32">
      <SectionSpotlightHost id="whatsapp-section" />
      <div className="relative mx-auto max-w-wide">
        <Reveal>
          <a
            href={EXT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center gap-5 overflow-hidden rounded-[22px] border border-da-mint/25 px-9 py-10 text-center transition-transform hover:-translate-y-0.5 sm:flex-row sm:text-left"
            style={{ background: "linear-gradient(120deg, rgba(80,160,120,0.14), rgba(80,160,120,0.04))" }}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#25D366]/15">
              <img src="/assets/whatsapp-icon.png" alt="" className="h-9 w-9 object-contain" />
            </span>
            <div className="flex-1">
              <h3 className="font-daDisplay text-2xl font-semibold text-da-cream">New to the community?</h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-da-cream/70">
                Join the WhatsApp group for Iqama alerts and announcements — or come see the masjid. Everyone is welcome.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-da-bg">
              Join the group <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Giving — animated numerals ──────────────────────────────── */

function Counter({ to, prefix = "" }: { to: number; prefix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [val, setVal] = React.useState(reduce ? to : 0);
  React.useEffect(() => {
    if (!inView || reduce) return;
    let start: number | null = null;
    let raf = 0;
    const dur = 1500;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-US")}
    </span>
  );
}

export function GivingSection() {
  return (
    <section id="giving-section" className="relative overflow-hidden bg-da-bg2 px-5 py-24 font-daBody text-da-cream md:py-32">
      <DaAmbient />
      <div className="relative mx-auto max-w-wide">
        <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionIntro
              dark
              theme="da"
              eyebrow="Sadaqah Jariyah"
              title="Sixty dollars, one family, every month."
              lede="The community purchased this property outright in 2020 and carries a Qard-e-Hasan."
            />
            <Reveal delay={0.2} className="mt-9 flex flex-wrap gap-3">
              <Link
                href={R.pledge}
                className="inline-flex items-center gap-2 rounded-full bg-da-gold px-7 py-4 text-sm font-semibold text-da-bg transition-transform hover:-translate-y-0.5"
              >
                Donate now <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={`${R.pledge}?freq=monthly`}
                className="inline-flex items-center gap-2 rounded-full border border-da-cream/25 px-7 py-4 text-sm text-da-cream transition-colors hover:bg-da-cream/10"
              >
                Set up a monthly pledge
              </Link>
            </Reveal>
          </div>

          <div className="rounded-2xl border border-da-cream/10 bg-da-cream/[0.03] p-1">
            <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-da-cream/10">
              {[
                { n: ORG.finances.parkingLot ?? 20000, label: "Parking lot renovation" },
                { n: ORG.finances.loanRemaining, label: "Qard-e-Hasan remaining" },
              ].map((s) => (
                <StaggerItem key={s.label} className="bg-da-bg2 p-7">
                  <p className="font-daDisplay text-[clamp(26px,2.6vw,34px)] font-semibold text-da-gold">
                    <Counter to={s.n} prefix="$" />
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-da-cream/60">{s.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <div
              className="mt-1 rounded-xl p-6"
              style={{ background: "linear-gradient(120deg, rgba(201,162,39,0.22), rgba(201,162,39,0.1))" }}
            >
              <div className="flex items-center gap-4">
                <p className="font-daDisplay text-[clamp(30px,3vw,38px)] font-semibold text-da-gold">${ORG.finances.perFamily}</p>
                <p className="border-l border-da-cream/20 pl-4 text-sm leading-relaxed text-da-cream/75">
                  If every family gave just ${ORG.finances.perFamily} a month, it would cover the loan and running costs — together.
                </p>
              </div>
              <Link
                href={`${R.pledge}?amount=${ORG.finances.perFamily}&freq=monthly`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-da-cream px-5 py-2.5 text-sm font-semibold text-da-bg"
              >
                I can do that — give ${ORG.finances.perFamily}/month
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Story teaser ────────────────────────────────────────────── */

export function StoryTeaser() {
  return (
    <section className="bg-da-bg px-5 py-24 font-daBody md:py-32">
      <div className="mx-auto grid max-w-wide items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative overflow-hidden rounded-t-[120px] border border-da-gold/25 bg-da-modal p-10 pt-20 text-center">
            <DaAmbient />
            <CrescentLantern size={34} className="absolute left-1/2 top-8 -translate-x-1/2" />
            <p lang="ar" dir="rtl" className="relative mt-4 font-arabic text-2xl leading-loose text-da-goldL">
              مَن بَنى مَسجِدًا لِلَّهِ بَنى اللَّهُ لَهُ بَيتًا في الجَنَّةِ
            </p>
            <p className="relative mt-6 font-daDisplay text-xl italic leading-relaxed text-da-cream">
              &ldquo;Whoever builds a masjid for Allah, Allah will build for him a house like it in Paradise.&rdquo;
            </p>
            <p className="relative mt-3 text-xs text-da-cream/50">Sahih Muslim</p>
          </div>
        </Reveal>
        <div>
          <SectionIntro
            dark
            theme="da"
            eyebrow="The story"
            title="From a rented hall to a home of our own"
            lede="Founded in 2019, Darul Arqum set out to give Riverside South its first masjid. On July 30, 2020 the community acquired 4269 Limebank Rd — and the work of building a destination for worship, education and service began."
          />
          <Reveal delay={0.2}>
            <Link
              href={R.story}
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-da-cream/20 px-6 py-3.5 text-sm font-medium text-da-cream transition-colors hover:bg-da-cream/10"
            >
              Read the full story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Contact section ──────────────────────────────────────────── */

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      aria-label={`Copy ${value}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-da-cream/20 px-3 py-1.5 text-xs text-da-cream/75 transition-colors hover:bg-da-cream/10"
    >
      {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

export function ContactSection() {
  return (
    <section id="contact-us" className="relative bg-da-bg2 px-5 py-24 font-daBody text-da-cream md:py-32">
      <SectionSpotlightHost id="contact-us" />
      <div className="relative mx-auto max-w-wide">
        <SectionIntro dark theme="da" eyebrow="Contact us" title="Come visit us, or reach out anytime." />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-da-cream/10">
              <iframe
                title="Darul Arqum masjid location"
                src="https://www.google.com/maps?q=Darul+Arqum+Markaz+of+Ottawa,+4269+Limebank+Rd,+Ottawa,+ON+K1V+1G5&output=embed"
                className="h-[320px] w-full border-0 grayscale"
                loading="lazy"
              />
              <div className="flex flex-col gap-3 bg-da-cream/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm text-da-cream/80">
                  <MapPin className="h-4 w-4 shrink-0 text-da-goldL" aria-hidden />
                  {ORG.address}
                </p>
                <a
                  href="https://maps.app.goo.gl/7WWyowUrajYGgNv16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-da-gold px-4 py-2 text-xs font-semibold text-da-bg"
                >
                  Get directions <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-4">
            <div className="rounded-2xl border border-da-mint/20 bg-da-mint/[0.06] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-da-mint">Call us</p>
              <ul className="mt-3 space-y-2.5 text-sm text-da-cream/85">
                <li className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-da-mint" aria-hidden /> {ORG.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CopyButton value={ORG.phone} />
                    <a href={ORG.phoneHref} className="rounded-full bg-da-mint/20 px-3 py-1.5 text-xs">Call ↗</a>
                  </span>
                </li>
              </ul>
            </div>
            <a
              href={ORG.emailHref}
              className="rounded-2xl border border-da-gold/25 p-6"
              style={{ background: "linear-gradient(120deg, rgba(201,162,39,0.12), rgba(201,162,39,0.04))" }}
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-da-goldL">
                <Mail className="h-3.5 w-3.5" aria-hidden /> Email us
              </p>
              <p className="mt-2 text-sm text-da-cream">{ORG.email}</p>
            </a>
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(120deg, #2b210c, #1a1508)" }}>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-da-goldL">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> CRA registered charity
              </p>
              <p className="mt-2 font-mono text-sm text-da-cream/85">{ORG.charityReg}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Shared spotlight-host wired to the page-level controller ───── */

export const HomeHighlightContext = React.createContext<{ isHighlighted: (id: string) => boolean; nonce: number } | null>(null);

function SectionSpotlightHost({ id }: { id: string }) {
  const ctx = React.useContext(HomeHighlightContext);
  if (!ctx) return null;
  return <SectionSpotlight id={id} nonce={ctx.nonce} active={ctx.isHighlighted(id)} />;
}

export function HomeHighlightProvider({ children }: { children: React.ReactNode }) {
  const { target, nonce, isHighlighted } = useSectionHighlightController();
  const value = React.useMemo(() => ({ isHighlighted, nonce }), [isHighlighted, nonce, target]);
  return <HomeHighlightContext.Provider value={value}>{children}</HomeHighlightContext.Provider>;
}
