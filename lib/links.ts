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

  // Community
  whatsapp: "https://chat.whatsapp.com/F7LaeeNTGIlBPxJndDpEny",
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
  phoneAlt: "(819) 360-5936",
  phoneHref: "tel:+16137092329",
  email: "admin@darularqum.org",
  emailHref: "mailto:admin@darularqum.org",
  madrasaFeeEmail: "alaarifislamicins@gmail.com",
  charityReg: "709549687RR0001",
  bank: { institution: "004 (TD)", transit: "32936", account: "5254632" },
  jumua: { first: "1:30 PM", second: "2:30 PM" },
  finances: {
    propertyPrice: 665000,
    acquired: "July 30, 2020",
    loanRemaining: 144000,
    monthlyExpenses: 6000,
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

/** Internal route map (new IA). Old slugs 301 in next.config.mjs. */
export const R = {
  home: "/",
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
