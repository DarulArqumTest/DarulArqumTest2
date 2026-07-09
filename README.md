# Darul Arqum — Full-Site Redesign (v3, production build)

Next.js 15 (App Router) · TypeScript · Tailwind · shadcn structure · Motion (Framer Motion)

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

Optional env for direct email delivery of all forms:

```bash
RESEND_API_KEY=re_xxx   # activates Resend delivery to admin@darularqum.org
```

Without the key, every form still works: it validates, records, and offers the
visitor a one-click prefilled "send via your email app" fallback — no dead UI.

## Route map (new IA)

| Route | Replaces (301 in next.config.mjs) |
|---|---|
| `/` | Home |
| `/prayer-times` | `/salat` |
| `/programs` | `/programs` |
| `/programs/quran-classes` | `/madrasa` |
| `/programs/aalim` | `/contact-1`, `/services-4` |
| `/programs/kids-arabic` | `/kidslearnarabic` |
| `/programs/welearn` | `/welearn` |
| `/give` | `/donate`, `/contribute` |
| `/give/pledge` | `/pledge` |
| `/give/tax-receipt` | `/tax-receipt` |
| `/story` | `/thestory` |
| `/gallery` | `/masjid-gallery`, `/fundraising-event-march-7th-2020-ga`, `/taraweeh-ramadhan-2021` |
| `/community` | `/volunteer`, `/copy-of-volunteer`, `/subscribe`, `/register`, `/eid` |
| `/newsletters` | `/newsletters` |
| `/contact` | `/contact` |

Every legacy slug 301s to its new home — no old-site leftovers, no broken
inbound links. DNS cutover: point www.darularqum.org at the new deployment
(e.g. Vercel) and the redirect map takes over.

## Architecture

- `lib/links.ts` — every external URL, email, bank detail, board member and
  org fact in one file. Change once, updates site-wide.
- `lib/prayer.ts` — iqama fallback schedule + next-prayer/active-prayer math.
- `app/actions/submit.ts` — one server action powering all 8 forms
  (contact, quran-classes, aalim, kids-arabic, pledge, tax-receipt,
  volunteer, mailing-list) with honeypot spam guard.
- `components/site/*` — design system: Ambient (lattice + light blooms +
  grain), PageHero, SectionIntro, QuoteBlock, CTABand, FormSystem,
  ProgramDetail, SafeImage, motion primitives (Reveal/Stagger/DrawnRule).
- `components/prayer/prayer-modules.tsx` — NextPrayerBand (live countdown),
  PrayerScreen (framed Mawaqit mirror with load fallback), IqamaCards
  (active-prayer highlighting).
- `app/template.tsx` — route-level page transitions.
- `prefers-reduced-motion` collapses all motion (incl. the arc intro and
  ambient loops) site-wide.

## ADMIN-ACCESS FOLLOW-UPS (isolated, swap-in-place)

1. **PayPal hosted button** — `lib/links.ts → EXT.paypalPledgeLegacy`
   currently routes to the live public pledge flow. Replace with
   `https://www.paypal.com/donate?hosted_button_id=XXXX` from Wix admin.
   Referenced in `app/give/pledge/page.tsx` (marked with a comment).
2. **Email delivery** — set `RESEND_API_KEY` (+ verify sending domain) in
   the host to switch forms from fallback mode to direct delivery.
3. **Gallery originals** — `components/sections/gallery-grid.tsx → ALBUMS`:
   paste image URLs from the live gallery pages or the Wix media export.
   Placeholder tiles degrade gracefully until then.
4. **Newsletter archive** — `app/newsletters/page.tsx → ISSUES`: migrate
   legacy issues (title/date/link). Page is fully functional meanwhile.
5. **Prayer data proxy (optional)** — native modules use the fallback
   schedule in `lib/prayer.ts`; the embedded Mawaqit screen is always the
   live source of truth. A small server proxy to Mawaqit's mosque data can
   later feed exact daily adhan times into the cards.
