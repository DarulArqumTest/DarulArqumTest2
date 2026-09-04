/**
 * Single source of truth for every external link, asset, and org fact.
 * All URLs extracted from the live darularqum.org site + mawaqit.net.
 * ADMIN-ACCESS FOLLOW-UPS are marked inline.
 */

export const EXT = {
  // Prayer (Mawaqit — powers the TV screen at the masjid)
  mawaqitLive:
    "https://mawaqit.net/en/darul-arqum-ottawa-canada-ottawa-k1v-1g5-canada",
  mawaqitEmbed:
    "https://mawaqit.net/en/m/darul-arqum-ottawa-canada-ottawa-k1v-1g5-canada",

  // Community — the org-wide announcements group (iqama changes, janazah, events).
  whatsapp: "https://chat.whatsapp.com/G8CW0AUcDDWCDLhbxYQaJS",
  youtubeChannel: "https://www.youtube.com/channel/UCRSJNamNoeDsOlwzk8dMcvQ",
  youtubeIntro: "https://youtu.be/6wVEPBovOjI",
  welearnZoom: "https://zoom.us/j/93194466159",

  // Giving — live public endpoints (interim source of truth).
  ircMatchingCampaign:
    "https://donate.islamicreliefcanada.org/campaign/darul-arqum-mosque-922",
  ircCrowdfunding:
    "https://fundraise.islamicreliefcanada.org/campaign/support-darularqum-2311",
  padFormPdf: "/assets/forms/pad-form.pdf",

  // Gallery photos (self-hosted)
  galleryFundraising1: "/assets/gallery/fundraising-1.jpg",
  galleryFundraising2: "/assets/gallery/fundraising-2.jpg",

  // Brand (self-hosted)
  logo: "/assets/logo-icon.png",
  logoFull: "/assets/logo-icon.png",
} as const;

export const ORG = {
  name: "Darul Arqum",
  tagline: "Riverside South Muslim Community Association",
  address: "4269 Limebank Rd., Ottawa, ON K1V 1G5",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=4269+Limebank+Rd+Ottawa+ON+K1V+1G5",
  phone: "613-709-2329",
  phoneHref: "tel:+16137092329",
  email: "admin@darularqum.org",
  emailHref: "mailto:admin@darularqum.org",
  madrasaFeeEmail: "alaarifislamicins@gmail.com",
  charityReg: "709549687RR0001",
  bank: { institution: "004 (TD)", transit: "32936", account: "5254985" },
  jumua: { first: "1:30 PM", second: "2:30 PM" },
  finances: {
    propertyPrice: 665000,
    acquired: "July 30, 2020",
    /** Qard-e-Hasan still outstanding. */
    loanRemaining: 200000,
    /** Total loan carried across both properties. */
    loanTotal: 600000,
    monthlyExpenses: 10000,
    perFamily: 60,
    parkingLot: 20000,
  },
  board: [
    { name: "Sadrul Alim", role: "President" },
    { name: "Muhammad Serbouti", role: "Co-ordinator" },
    { name: "Faisal Musa", role: "Board member" },
    { name: "Faiq Mohammed", role: "Board member" },
  ],
} as const;

/**
 * The two masjids. The original Limebank property is now "Darul Arqum East";
 * the newly acquired Old Richmond Rd property is "Darul Arqum West".
 *
 * ADMIN-ACCESS FOLLOW-UP: West has no Google Business listing yet, so its
 * `mapsUrl` is an address search rather than a place link. Opening date and
 * prayer timings are still pending.
 */
export type LocationKey = "east" | "west";

export type Location = {
  key: LocationKey;
  name: string;
  short: string;
  street: string;
  city: string;
  postal: string;
  /** Full one-line address for display. */
  address: string;
  /** Photograph of the property. Falls back to drawn art if the file is absent. */
  photo: string;
  mapsUrl: string;
  embedQuery: string;
  status: "open" | "coming-soon";
  statusLabel: string;
  blurb: string;
  accent: string;
};

export const LOCATIONS: Record<LocationKey, Location> = {
  east: {
    key: "east",
    name: "Darul Arqum East",
    short: "East",
    street: "4269 Limebank Rd",
    city: "Ottawa, ON",
    postal: "K1V 1G5",
    address: "4269 Limebank Rd, Ottawa, ON K1V 1G5",
    photo: "/assets/location-east.jpg",
    mapsUrl: "https://maps.app.goo.gl/7WWyowUrajYGgNv16",
    embedQuery: "Darul Arqum Markaz of Ottawa, 4269 Limebank Rd, Ottawa, ON K1V 1G5",
    status: "open",
    statusLabel: "Open daily",
    blurb:
      "The first masjid in Riverside South — acquired by the community in 2020. Five daily prayers in congregation, Jumu'ah, and the full Al-Arif madrasa.",
    accent: "#c9a227",
  },
  west: {
    key: "west",
    name: "Darul Arqum West",
    short: "West",
    street: "6050 Old Richmond Rd",
    city: "Ottawa, ON",
    postal: "K0A 2Z0",
    address: "6050 Old Richmond Rd, Ottawa, ON K0A 2Z0",
    photo: "/assets/location-west.jpg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=6050+Old+Richmond+Rd+Ottawa+ON+K0A+2Z0",
    embedQuery: "6050 Old Richmond Rd, Ottawa, ON K0A 2Z0",
    status: "coming-soon",
    statusLabel: "Opening soon",
    blurb:
      "Our second masjid, newly acquired by the community. Prayer timings, programs and an opening date will be announced here and in the WhatsApp group.",
    accent: "#a9e0c0",
  },
};

export const LOCATION_LIST = [LOCATIONS.east, LOCATIONS.west] as const;

/** Internal route map (new IA). Old slugs 301 in next.config.mjs. */
export const R = {
  home: "/",
  locations: "/locations",
  locationEast: "/locations#east",
  locationWest: "/locations#west",
  prayer: "/prayer-times",
  programs: "/programs",
  quran: "/programs/quran-classes",
  aalim: "/programs/aalim",
  kidsArabic: "/programs/kids-arabic",
  welearn: "/programs/welearn",
  give: "/give",
  pledge: "/give/pledge",
  taxReceipt: "/give/tax-receipt",
  padForm: "/give/pad-form",
  story: "/story",
  gallery: "/gallery",
  community: "/community",
  newsletters: "/newsletters",
  newsletterDec2020: "/newsletters/december-2020",
  contact: "/contact",
} as const;
