"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useInView } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Languages,
  Laptop,
  Clock,
  HandCoins,
} from "lucide-react";
import { EXT, ORG, R } from "@/lib/links";
import { Reveal, Stagger, StaggerItem, DrawnRule } from "@/components/site/reveal";
import { Ambient } from "@/components/site/ambient";
import { SectionIntro } from "@/components/site/section-intro";
import { IqamaCards, PrayerScreen } from "@/components/prayer/prayer-modules";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Hero (revealed beneath the arc curtain) ─────────────────── */

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 30 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: EASE },
  });

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink px-5 pb-24 pt-28 text-bone">
      <Ambient dark grain />

      <div className="relative mx-auto w-full max-w-wide">
        <motion.div {...rise(0.1)} className="flex items-center gap-4">
          <Image
            src={EXT.logo}
            alt="Darul Arqum logo"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-1 ring-brass/50"
            priority
          />
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-brassL">{ORG.tagline}</p>
            <p lang="ar" dir="rtl" className="mt-1 font-arabic text-lg text-bone/70">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </motion.div>

        <h1 className="mt-10 max-w-4xl font-display text-5xl leading-[1.03] tracking-tight sm:text-6xl md:text-8xl">
          <motion.span {...rise(0.25)} className="block">
            A house of prayer
          </motion.span>
          <motion.span {...rise(0.4)} className="block text-bone/85">
            rising in <span className="text-brassL">Riverside South.</span>
          </motion.span>
        </h1>

        <motion.p {...rise(0.55)} className="mt-7 max-w-xl text-base leading-relaxed text-bone/65 md:text-lg">
          The first masjid in the community — 4269 Limebank Rd, Ottawa. Acquired
          by its people in 2020, sustained by its people every month since.{" "}
          <span className="text-bone">Let&apos;s build it together.</span>
        </motion.p>

        <motion.div {...rise(0.7)} className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={R.prayer}
            className="group inline-flex items-center gap-2 rounded-full bg-brass px-7 py-4 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            <Clock className="h-4 w-4" aria-hidden />
            Prayer times — live
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <Link
            href={R.give}
            className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-7 py-4 text-sm font-medium text-bone transition-colors hover:bg-bone/10"
          >
            <HandCoins className="h-4 w-4" aria-hidden />
            Support the masjid
          </Link>
        </motion.div>

        <motion.div {...rise(0.85)} className="mt-16 max-w-3xl">
          <DrawnRule className="bg-bone/15" />
          <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-4 text-sm text-bone/55 sm:grid-cols-3">
            <p>
              <span className="block font-medium text-bone">Jumu&apos;ah</span>
              1st Khutbah {ORG.jumua.first} · 2nd {ORG.jumua.second}
            </p>
            <p>
              <span className="block font-medium text-bone">Five daily prayers</span>
              In congregation, every day
            </p>
            <p>
              <span className="block font-medium text-bone">CRA charity</span>
              Reg. #{ORG.charityReg}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Prayer feature showcase ─────────────────────────────────── */

export function PrayerFeature() {
  return (
    <section className="relative overflow-hidden bg-bone px-5 py-24 md:py-32">
      <Ambient />
      <div className="relative mx-auto max-w-wide">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.25fr]">
          <div className="lg:sticky lg:top-28">
            <SectionIntro
              eyebrow="Live from the masjid"
              title="The prayer screen, wherever you are"
              lede="The same Mawaqit display running inside Darul Arqum — adhan and iqama for all five prayers, Hijri date, Shurûq and Jumu'ah — mirrored here in real time."
            />
            <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-3">
              <Link
                href={R.prayer}
                className="group inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-moss"
              >
                Open the prayer page
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <a
                href={EXT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 text-sm text-ink transition-colors hover:bg-sand/50"
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

/* ── Programs — editorial split, not a card grid ─────────────── */

const PROGRAMS = [
  {
    icon: BookOpen,
    title: "Weekdays Quran classes",
    meta: "Mon–Fri · 6:00–8:00 PM · $75/month",
    body: "Nazira, Hifz, Deeniyaat, Akhlaqiat and Seerah tracks for boys 6+, with an optional weekend class. Sibling discount available.",
    href: R.quran,
  },
  {
    icon: GraduationCap,
    title: "Aalim program & Hifz",
    meta: "Al-Arif Islamic Institute · led by Mufti Taqi",
    body: "Sarf & Nahw, Quran, Hadith, Fiqh and Aqa'id — plus a full-time Quran memorization track, Monday to Friday.",
    href: R.aalim,
  },
  {
    icon: Languages,
    title: "KidsLearnArabic",
    meta: "Ages 5–10",
    body: "The language of the Quran made approachable and joyful for young learners.",
    href: R.kidsArabic,
  },
  {
    icon: Laptop,
    title: "welearn",
    meta: "Online with Sheikh Saud Hasan",
    body: "Live Islamic learning over Zoom — join from anywhere.",
    href: R.welearn,
  },
];

export function ProgramsSection() {
  return (
    <section className="bg-bone px-5 pb-24 md:pb-32">
      <div className="mx-auto max-w-wide">
        <SectionIntro
          eyebrow="Programs"
          title="Knowledge for every age"
          lede="From a child's first surah to the classical sciences — every program taught in person at the masjid or live online."
        />
        <div className="mt-14">
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <Link
                href={p.href}
                className="group grid items-center gap-4 border-t border-line py-8 transition-colors hover:bg-sand/25 md:grid-cols-[56px_1.1fr_1.4fr_auto] md:gap-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest/10">
                  <p.icon className="h-5 w-5 text-forest" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-2xl tracking-tight text-ink">{p.title}</span>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-brass">{p.meta}</span>
                </span>
                <span className="text-sm leading-relaxed text-ink/60">{p.body}</span>
                <ArrowUpRight
                  className="hidden h-5 w-5 text-brass transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:block"
                  aria-hidden
                />
              </Link>
            </Reveal>
          ))}
          <DrawnRule />
        </div>
      </div>
    </section>
  );
}

/* ── Giving — animated numerals ──────────────────────────────── */

function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [val, setVal] = React.useState(reduce ? to : 0);
  React.useEffect(() => {
    if (!inView || reduce) return;
    let start: number | null = null;
    let raf = 0;
    const dur = 1400;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export function GivingSection() {
  return (
    <section className="relative overflow-hidden bg-forest px-5 py-24 text-bone md:py-32">
      <Ambient dark grain />
      <div className="relative mx-auto max-w-wide">
        <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionIntro
              dark
              eyebrow="Sadaqah Jariyah"
              title="Sixty dollars, one family, every month"
              lede="The community purchased this property outright in 2020 and carries an interest-free Qard-e-Hasan. If every family gives $60 a month, the loan and the running costs are covered — together."
            />
            <Reveal delay={0.2} className="mt-9 flex flex-wrap gap-3">
              <Link
                href={R.give}
                className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-4 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                Give now <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={R.pledge}
                className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-7 py-4 text-sm text-bone transition-colors hover:bg-bone/10"
              >
                Set up a monthly pledge
              </Link>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/15 bg-bone/15">
            {[
              { n: 665000, prefix: "$", label: `Property acquired ${ORG.finances.acquired}` },
              { n: 144000, prefix: "$", label: "Qard-e-Hasan remaining" },
              { n: 6000, prefix: "$", label: "Monthly running costs" },
              { n: 60, prefix: "$", label: "Per family, per month" },
            ].map((s) => (
              <StaggerItem key={s.label} className="bg-forest p-7">
                <p className="font-display text-4xl tracking-tight text-brassL md:text-5xl">
                  <Counter to={s.n} prefix={s.prefix} />
                </p>
                <p className="mt-2 text-xs leading-relaxed text-bone/55">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ── Story teaser ────────────────────────────────────────────── */

export function StoryTeaser() {
  return (
    <section className="bg-bone px-5 py-24 md:py-32">
      <div className="mx-auto grid max-w-wide items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="shimmer-frame relative overflow-hidden rounded-t-[160px] border border-brass/30 bg-ink p-10 pt-20 text-center">
            <Ambient dark />
            <p lang="ar" dir="rtl" className="relative font-arabic text-2xl leading-loose text-brassL">
              مَن بَنى مَسجِدًا لِلَّهِ بَنى اللَّهُ لَهُ بَيتًا في الجَنَّةِ
            </p>
            <p className="relative mt-6 font-display text-xl leading-relaxed text-bone">
              &ldquo;Whoever builds a masjid for Allah, Allah will build for him a house like it in Paradise.&rdquo;
            </p>
            <p className="relative mt-3 text-xs text-bone/50">Sahih Muslim</p>
          </div>
        </Reveal>
        <div>
          <SectionIntro
            eyebrow="The story"
            title="From a rented hall to a home of our own"
            lede="Founded in 2019, Darul Arqum set out to give Riverside South its first masjid. On July 30, 2020 the community acquired 4269 Limebank Rd — and the work of building a destination for worship, education and service began."
          />
          <Reveal delay={0.2}>
            <Link
              href={R.story}
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-sand/50"
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
