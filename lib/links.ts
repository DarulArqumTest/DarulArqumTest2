/**
 * Single source of truth for every external link, asset, and org fact.
 * All URLs extracted from the live darularqum.org site + mawaqit.net.
 * ADMIN-ACCESS FOLLOW-UPS are marked inline.
 */

export const SITE = "https://www.darularqum.org";

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
  // ADMIN-ACCESS FOLLOW-UP: swap `paypalPledgeLegacy` for the exact hosted
  // PayPal button URL (https://www.paypal.com/donate?hosted_button_id=XXXX)
  // once Wix admin access is available. Until then the pledge flow routes to
  // the live public pledge page + e-transfer + PAD PDF, all working today.
  paypalPledgeLegacy: `${SITE}/pledge`,
  ircMatchingCampaign:
    "https://donate.islamicreliefcanada.org/campaign/darul-arqum-mosque-922",
  ircCrowdfunding:
    "https://fundraise.islamicreliefcanada.org/campaign/support-darularqum-2311",
  padFormPdf: `${SITE}/_files/ugd/c7abce_35ff88cd1e7f4c78830da9979172ff7b.pdf`,

  // Brand (public Wix-hosted original — the real logo, not a placeholder)
  logo: "https://static.wixstatic.com/media/62a910_dce8cdcf2540405b990112ba6e712e73~mv2.jpg/v1/fill/w_328,h_328,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20-new%20-L.jpg",
  logoFull:
    "https://static.wixstatic.com/media/62a910_dce8cdcf2540405b990112ba6e712e73~mv2.jpg",
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
  story: "/story",
  gallery: "/gallery",
  community: "/community",
  newsletters: "/newsletters",
  contact: "/contact",
} as const;
