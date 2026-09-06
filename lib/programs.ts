/**
 * Every programme the masjid runs, in one place.
 *
 * The details used to live in three: a modal record on the homepage, a set of
 * `facts` arrays inside each route file, and the footer's link labels. They
 * had already drifted — the homepage described the Quran class as a weekend
 * programme at $50 while its own page described a weekday madrasa at $75.
 * One record now feeds the index, the detail pages and the registration
 * forms, so a fee can only be wrong in one place.
 *
 * Checked 2026-09-06 against the live site at darularqum.org — /madrasa,
 * /services-4, /kidslearnarabic and /welearn — and reconciled with it.
 */

import { EXT, ORG, R } from "@/lib/links";

export type ProgramSlug = "aalim" | "hifz" | "quran-classes" | "kids-arabic" | "welearn";

export type Program = {
  slug: ProgramSlug;
  /** the route for this programme's own page */
  href: string;
  /** where to register, when registration is how you join */
  registerHref?: string;
  /** for welearn, joining is a Zoom link rather than a form */
  joinUrl?: string;
  joinLabel?: string;
  name: string;
  eyebrow: string;
  /** one sentence, for cards and the page masthead */
  lede: string;
  /** the paragraph on the detail page */
  about: string;
  /** headline facts — schedule, fee, who it is for */
  facts: { label: string; value: string }[];
  /** what is actually studied */
  curriculum?: { title: string; body: string }[];
  /** anything a parent must know before registering */
  notes?: string[];
  photo: string | null;
  /** background-position for that photograph */
  focus: string;
  accent: string;
  /** short facts for the index card — a subset, so cards stay scannable */
  cardFacts: { label: string; value: string }[];
  metaTitle: string;
  metaDescription: string;
};

export const PROGRAMS: Program[] = [
  {
    slug: "aalim",
    href: "/programs/aalim",
    registerHref: "/programs/aalim/register",
    name: "Aalim program",
    eyebrow: "Al-Arif Islamic Institute · full time",
    lede:
      "Structured classical studies toward becoming a scholar of the Islamic sciences, led by Mufti Taqi.",
    about:
      "Mufti Taqi trained at the Al-Rashid Institute and teaches with deep grounding in jurisprudence, Hadith, Tafsir and Arabic. The Aalim track pairs academic rigour with spiritual formation: students work through the grammar that unlocks the language, then the Quran, the Hadith of the Prophet ﷺ, fiqh and creed, in the order the tradition teaches them.",
    facts: [
      { label: "Runs", value: "Monday – Friday, full time" },
      { label: "Fee", value: "$150 / month" },
      { label: "Lead teacher", value: "Mufti Taqi" },
      { label: "Where", value: "On site at Darul Arqum" },
      { label: "Running since", value: "September 2025" },
      { label: "Contact", value: `Sadrul Alim · ${ORG.phone}` },
    ],
    cardFacts: [
      { label: "Runs", value: "Mon – Fri, full time" },
      { label: "Fee", value: "$150 / month" },
      { label: "Teacher", value: "Mufti Taqi" },
      { label: "Where", value: "At the masjid" },
    ],
    curriculum: [
      { title: "Sarf & Nahw", body: "Arabic morphology and grammar — the tools every later subject depends on." },
      { title: "Quran", body: "Recitation, tafsir and the sciences of the Quran." },
      { title: "Hadith", body: "The narrations of the Prophet ﷺ, their chains and their meaning." },
      { title: "Fiqh", body: "Islamic jurisprudence and how rulings are derived." },
      { title: "Aqa'id", body: "Creed: what Muslims believe, and why." },
    ],
    photo: "/assets/program-aalim.jpg",
    focus: "center 30%",
    accent: "#c9a227",
    metaTitle: "Aalim program at Al-Arif Islamic Institute",
    metaDescription:
      "Full-time classical Islamic studies at Darul Arqum, Ottawa: Sarf & Nahw, Quran, Hadith, Fiqh and Aqa'id under Mufti Taqi. Monday–Friday, $150/month.",
  },
  {
    slug: "hifz",
    href: "/programs/hifz",
    registerHref: "/programs/hifz/register",
    name: "Quran Hifz",
    eyebrow: "Al-Arif Islamic Institute · full time",
    lede:
      "A full-time track for students memorizing the Quran as their primary focus, under Mufti Taqi.",
    about:
      "Hifz is not a subject taken alongside others; it is the day's work. Students keep structured daily hours split between new memorization and revision of what is already held, with tajweed corrected as they go and continuous assessment against what was memorized last week and last month — until the Quran is complete and, just as importantly, preserved.",
    facts: [
      { label: "Runs", value: "Monday – Friday, full time" },
      { label: "Fee", value: "$75 / month" },
      { label: "Lead teacher", value: "Mufti Taqi" },
      { label: "Where", value: "On site at Darul Arqum" },
      { label: "Entry levels", value: "Beginner through partial Hifz" },
      { label: "Contact", value: `Sadrul Alim · ${ORG.phone}` },
    ],
    cardFacts: [
      { label: "Runs", value: "Mon – Fri, full time" },
      { label: "Fee", value: "$75 / month" },
      { label: "Teacher", value: "Mufti Taqi" },
      { label: "Where", value: "At the masjid" },
    ],
    curriculum: [
      { title: "New memorization", body: "A set portion each day, heard and corrected before it is counted." },
      { title: "Revision", body: "Daily cycles over recent and older portions, so nothing memorized is lost." },
      { title: "Tajweed", body: "Pronunciation and the rules of recitation, corrected continuously rather than taught apart." },
      { title: "Assessment", body: "Regular testing against previous months, not just the current page." },
    ],
    photo: "/assets/program-quran.jpg",
    focus: "center 26%",
    accent: "#d98f4a",
    metaTitle: "Quran Hifz program",
    metaDescription:
      "Full-time Quran memorization at Darul Arqum, Ottawa, under Mufti Taqi: daily new memorization, structured revision and tajweed. Monday–Friday, $75/month.",
  },
  {
    slug: "quran-classes",
    href: "/programs/quran-classes",
    registerHref: "/programs/quran-classes/register",
    name: "Weekday Quran classes",
    eyebrow: "Madrasa · ages 6 and up",
    lede:
      "Evening madrasa at the masjid, Monday to Friday — recitation, memorization and character, five nights a week.",
    about:
      "Students move through structured tracks rather than a single undifferentiated class: Nazira for reading, Hifz for memorization, Deeniyaat for Islamic studies, Akhlaqiat for character, and Seerah for the life of the Prophet ﷺ. A student is placed in the track that fits where they actually are, and moves on when they are ready.",
    facts: [
      { label: "Runs", value: "Monday – Friday · 6:00 – 8:00 PM" },
      { label: "Eligibility", value: "Boys, ages 6 and up" },
      { label: "Fee", value: "$75 / month" },
      { label: "Sibling discount", value: "$25 off" },
      { label: "Weekend class", value: "Offered — time and fee still to be set" },
      { label: "Fee e-transfer", value: ORG.madrasaFeeEmail },
      { label: "Where", value: ORG.address },
    ],
    cardFacts: [
      { label: "Runs", value: "Mon – Fri, 6 – 8 PM" },
      { label: "Fee", value: "$75 / month" },
      { label: "Ages", value: "Boys, 6 and up" },
      { label: "Also", value: "A weekend class, time still to be set" },
    ],
    curriculum: [
      { title: "Nazira", body: "Reading the Quran correctly, from the letters upward." },
      { title: "Hifz", body: "Memorization at a pace that fits alongside school." },
      { title: "Deeniyaat", body: "Islamic studies: the basics every Muslim should carry." },
      { title: "Akhlaqiat", body: "Character and manners, taught as a subject rather than assumed." },
      { title: "Seerah", body: "The life of the Prophet ﷺ and the Sahaba." },
    ],
    notes: [
      "Childcare is not provided — drop-off and pick-up must be punctual.",
      `Monthly fees are sent by e-transfer to ${ORG.madrasaFeeEmail}.`,
    ],
    photo: "/assets/program-quran.jpg",
    focus: "center 60%",
    accent: "#d98f4a",
    metaTitle: "Weekday Quran classes",
    metaDescription:
      "Monday–Friday evening madrasa at Darul Arqum, Ottawa: Nazira, Hifz, Deeniyaat, Akhlaqiat and Seerah. Boys 6+, $75/month with a sibling discount.",
  },
  {
    slug: "kids-arabic",
    href: "/programs/kids-arabic",
    registerHref: "/programs/kids-arabic/register",
    name: "KidsLearnArabic",
    eyebrow: "Ages 5 – 10",
    lede:
      "A dedicated Arabic track for young learners: playful, structured, and rooted in the language of the Quran.",
    about:
      "Children aged five to ten build letters, sounds, vocabulary and confidence in small groups at the masjid, taught by teachers who are used to this age. The point is not to rush them into grammar but to make the language familiar enough that the Quran sounds like something they are beginning to understand rather than something they are only reciting.",
    facts: [
      { label: "Ages", value: "5 – 10" },
      { label: "Class size", value: "Small groups" },
      { label: "Where", value: ORG.address },
      { label: "Contact", value: ORG.phone },
    ],
    cardFacts: [
      { label: "Ages", value: "5 – 10" },
      { label: "Class size", value: "Small groups" },
      { label: "Where", value: "At the masjid" },
    ],
    curriculum: [
      { title: "Letters and sounds", body: "The alphabet by shape and by sound, until both are automatic." },
      { title: "Vocabulary", body: "Words children will actually meet in the Quran and in du'a." },
      { title: "Confidence", body: "Speaking and reading aloud in a room where getting it wrong is fine." },
    ],
    notes: [
      "Registration collects emergency and health details required by the programme's safety policy. They are shared only with the teaching team.",
    ],
    photo: "/assets/program-kids.jpg",
    // the lettering sat high and clipped at 20%; this centres it in the crop
    focus: "center 35%",
    accent: "#7cc99a",
    metaTitle: "KidsLearnArabic",
    metaDescription:
      "Arabic for ages 5–10 at Darul Arqum, Ottawa: the language of the Quran made approachable and joyful for young learners.",
  },
  {
    slug: "welearn",
    href: "/programs/welearn",
    joinUrl: EXT.welearnZoom,
    joinLabel: "Join the live Zoom class",
    name: "welearn",
    eyebrow: "Online · live over Zoom",
    lede:
      "Two live classes a week with Sheikh Saud Hasan — Quran tafsir and the stories of the Prophets, over Zoom from anywhere.",
    about:
      "welearn runs twice a week and the two evenings are different subjects, not one class split in half. Thursday is Darsul Quran, working through Tafseer Ma'riful Quran. Wednesday is Qasas-un-Nabiyyeen — the stories of the Prophets — taught alongside basic Arabic. Sessions are live, there is nothing to install beyond Zoom, and there is no registration form: you open the link at class time.",
    facts: [
      { label: "Runs", value: "Wednesday & Thursday · 8:00 PM" },
      { label: "Teacher", value: "Sheikh Saud Hasan" },
      { label: "Thursday", value: "Darsul Quran · Tafseer Ma'riful Quran" },
      { label: "Wednesday", value: "Qasas-un-Nabiyyeen + basic Arabic" },
      { label: "Joining", value: "Open the Zoom link at class time" },
      { label: "Announcements", value: "Community WhatsApp group" },
    ],
    cardFacts: [
      { label: "Runs", value: "Wed & Thu · 8:00 PM" },
      { label: "Teacher", value: "Sheikh Saud Hasan" },
      { label: "Where", value: "Live over Zoom" },
    ],
    curriculum: [
      { title: "Darsul Quran", body: "Thursdays — tafsir, working through Tafseer Ma'riful Quran." },
      { title: "Qasas-un-Nabiyyeen", body: "Wednesdays — the stories of the Prophets, with basic Arabic taught alongside." },
    ],
    notes: [
      "Schedule changes and recordings go out in the WhatsApp group rather than by email.",
    ],
    // the official Zoom wordmark rather than a drawing of a computer — every
    // other card carries a real image, and this is the real one for this class
    photo: "/assets/program-welearn.png",
    focus: "center",
    accent: "#0b5cff",
    metaTitle: "welearn — online with Sheikh Saud Hasan",
    metaDescription:
      "Live online Islamic learning from Darul Arqum with Sheikh Saud Hasan — join the class over Zoom from anywhere.",
  },
];

export const PROGRAM_BY_SLUG = Object.fromEntries(PROGRAMS.map((p) => [p.slug, p])) as Record<ProgramSlug, Program>;

export function getProgram(slug: ProgramSlug): Program {
  return PROGRAM_BY_SLUG[slug];
}

/** the other programmes, for the "see also" rail at the foot of a detail page */
export function otherPrograms(slug: ProgramSlug): Program[] {
  return PROGRAMS.filter((p) => p.slug !== slug);
}

export const PROGRAMS_INDEX = R.programs;
export const WHATSAPP = EXT.whatsapp;
