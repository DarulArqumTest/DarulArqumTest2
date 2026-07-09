# Handoff: Darul Arqum Website Redesign → Next.js (site-src)

## Overview
The Darul Arqum masjid website (`site-src`, deployed on Vercel at darul-arqum-test2.vercel.app) is running its **old design**. A complete visual and UX redesign was done separately, as interactive HTML prototypes, and was never ported into the real Next.js codebase. This package hands that redesign to a developer (or Claude Code) to implement inside `site-src`.

## About the Design Files
The `.dc.html` files in this bundle are **design references built in a prototyping tool** — they show the intended look, layout, copy, and interaction behavior pixel-by-pixel, but they are NOT production code. They use a custom templating syntax (`{{ }}` holes, `<sc-for>`, `<x-import>`, a `DCLogic` class) that only runs in the prototyping environment — none of that is real React/Next.js and none of it should be copied verbatim.

**The task: recreate these designs as real pages/components inside the existing `site-src` Next.js + Tailwind + TypeScript codebase**, reusing its existing patterns (App Router structure under `app/`, the shared `submit.ts` server action for form delivery, Tailwind config, component conventions already in `components/`). Do not introduce a new framework — `site-src` is already fully set up.

## Fidelity
**High-fidelity.** Every page below has final copy, exact layout, exact colors/gradients, and specific illustrated/decorative elements (hand-crafted SVG-style Islamic motifs — lanterns, crescents, geometric patterns, medallions). Recreate pixel-perfectly: match spacing, type scale, color values, border radii, and decorative details, not just rough structure.

## Pages in this bundle → target route

| Design file | Target in site-src | Route |
|---|---|---|
| `Darul Arqum Home.dc.html` | `app/page.tsx` | `/` |
| `Prayer Times.dc.html` | `app/prayer-times/page.tsx` | `/prayer-times` |
| `Story.dc.html` | `app/story/page.tsx` | `/story` |
| `Gallery.dc.html` | `app/gallery/page.tsx` | `/gallery` |
| `Pledge.dc.html` | `app/give/pledge/page.tsx` | `/give/pledge` |
| `Aalim Registration.dc.html` | new: `app/programs/aalim/register/page.tsx` | `/programs/aalim/register` |
| `Hifz Registration.dc.html` | new: `app/programs/hifz/register/page.tsx` | `/programs/hifz/register` |
| `Quran Class Registration.dc.html` | `app/programs/quran-classes/register/page.tsx` (or existing quran-classes page) | `/programs/quran-classes/register` |
| `Kids Registration.dc.html` | new: `app/programs/kids-arabic/register/page.tsx` | `/programs/kids-arabic/register` |

The existing `app/programs/page.tsx`, `app/programs/aalim/page.tsx`, `app/programs/kids-arabic/page.tsx`, `app/programs/quran-classes/page.tsx`, `app/programs/welearn/page.tsx`, `app/community/page.tsx`, and `app/contact/page.tsx` were **not redesigned in this pass** — leave their current implementation as-is unless the nav/shared header/footer needs updating to match the new site (see Shared Chrome below).

## Shared Chrome (applies to every page)
- **Top navigation bar**: Home, Prayer Times, Programs, Story, Gallery, Community, Contact Us, and a Donate button with a dropdown (One-time / Monthly / payment method picker: Credit/Debit via PayPal, Pre-authorized Bank Debit, Interac e-Transfer). The Donate dropdown must work identically from every page, not just Home.
- Clicking **Programs**, **Contact Us**, or **Community** from any sub-page must navigate to `/` and then smooth-scroll to that section, followed by a brief highlight/spotlight animation on the target section (a soft glow/box outline that fades after ~1.5s). See `onNavPrayerTimes`/highlight logic in `Darul Arqum Home.dc.html`'s logic class for the reference behavior (scroll + temporary highlight state).
- Background: deep green (`#0e2419`-family) base with hand-illustrated Islamic decorative motifs (crescents with dangling lanterns replacing any moon-only iconography, geometric star patterns, subtle glow) scattered through hero sections and page backgrounds — not just at the top of the page. Reuse the same decorative language across all pages for consistency.
- Color/typography base: dark green background, warm gold/amber accents (`#d4a45c`-ish family) for headers and CTAs, cream/off-white body text, Arabic display type for Arabic phrases (see `<helmet>` font-face declarations in any `.dc.html` file for the exact Google Fonts used — Amiri for Arabic, a serif/sans pairing for Latin text).

## Page-by-page notes

### Home (`Darul Arqum Home.dc.html`)
- Hero with slowly animating background (zoom + drifting decorative Islamic elements), Darul Arqum logo/branding, tagline, and primary CTAs.
- Sections: Prayer times snapshot, Programs grid (Aalim, Hifz, Quran Classes, We Learn, Kids Arabic, Weekend classes), Story teaser, Community/WhatsApp invitation section, Contact section with hero banner, footer.
- "We Learn" banner: hand-illustrated digital tablet graphic (not a stock Zoom logo).
- Contact section: address card with "Get Directions"/"Open in Maps" linking to the masjid's real Google Maps business profile (not a bare address search), plus copy-to-clipboard and tap-to-call buttons clearly labeled for the two phone numbers (main/secondary).

### Prayer Times (`Prayer Times.dc.html`)
- Custom-illustrated old-style wooden TV frame housing the live prayer-times display (horizontally-rectangular screen, not tall).
- "NOW" indicator sits as its own label above the current prayer (not inline text), with a noticeably glowing highlight card.
- Each of the 5 daily prayers has a unique hand-illustrated background representing its time of day.
- A red-accented "Please arrive before Iqama" notice sits prominently above/near the TV.
- Hadith-of-the-day card with Arabic text (must NOT be truncated — show the full Arabic passage matching the full translation), styled as a gradient card.
- WhatsApp community invitation is its own independent hero section at the very bottom of the page.
- An "Iqama countdown" widget overlays fixed to the top-middle of the viewport and stays pinned while scrolling, only on this page.

### Story (`Story.dc.html`)
- Vertical scroll-driven timeline: 2019 → 2020 → 2021 → 2025 → Today, each year as its own uniquely-styled card (distinct color/motif per era) while still feeling part of one cohesive family (consistent card shape/border language, differing internal color/illustration).
- Scroll-linked reveal animations per section.
- Crescent-with-dangling-lantern motif used for section dividers/icons.

### Gallery (`Gallery.dc.html`)
- Masjid gallery: single large hero photo (the same background photo used behind the Gaussian-blur hero on Home).
- Ramadan recordings section: hand-illustrated speaker/recording-themed buttons per lecture, labeled with the current Hijri/Gregorian Ramadan year — verify and use the latest actual Ramadan year at build time, not a hardcoded past year.
- Images open in an expandable/lightbox full-screen view on click, with a smooth expand animation.

### Pledge / Donation (`Pledge.dc.html`)
This is the most functionally complex page — preserve ALL logic exactly:
- One unified form (not a redirect to another page) handling: One-time vs Monthly, payment method (Credit/Debit via PayPal, Pre-authorized Bank Debit, Interac e-Transfer), donor info (first/last name, email, phone), and an "anonymous donation" checkbox.
- Whichever payment method the user picked on Home's Donate dropdown must arrive pre-selected here (passed via query param or route state).
- Minimum-amount enforcement: $1.00 for one-time, $20.00 grayed-out placeholder/minimum for monthly; live validation error below the field if under minimum; amount always formatted `X.00`.
- Selecting a payment method animates the other two away and slides the selected one into a focused single-column view, with a "change payment method" back arrow to return to all three.
- PayPal path: opens PayPal with the entered amount, name, and email pre-filled as URL params (unless anonymous is checked, in which case name/email are omitted).
- Anonymous donation: unavailable for Pre-authorized Bank Debit (that path requires identity for the PAD agreement). If a user has "anonymous" checked and switches to Bank Debit, show a modal explaining anonymous giving isn't available for this method (with an incognito-icon-with-red-cross visual) and require them to click "I understand" before it unchecks itself. Also gray out/disable the anonymous checkbox while Bank Debit is selected.
- Bank Debit path: full PAD form fields, and the submitted email (via the shared `submit.ts` server action) must include all of the entered banking/PAD fields correctly formatted.
- Interac e-Transfer path: shows instructions in a modal/popover (not a full page navigation) with the e-Transfer email and reference-note instructions.
- Includes: Hadith-of-the-day card (same visual language as Prayer Times' Hadith card, scaled down), a "Currently Active Goals" section (Monthly Maintenance Target, total campaign target, Parking Lot Renovation — all three goal amounts must be correct and consistent with each other), and a "fun fact" callout ($60/month covers loan + running costs) with a "Sure, let's do this" button that auto-fills $60/Monthly and does a scroll + count-up + one-time→monthly slide animation to draw attention to the change.

### Registration Pages (Aalim, Hifz, Quran Classes, Kids Arabic)
All four share one layout system — implement as one reusable form component parameterized by program, not four copies:
- Hand-illustrated hero banner unique per program (Aalim: illuminated book/lamp motif; Hifz: the ornate gold-medallion Quran book cover with draped tasbih, matching the reference photo provided during design — an actual Quran book portrait cover, gold border, diamond medallion, arced embossed title, green prayer beads draped over one corner; Quran Classes and Kids Arabic: their own distinct motifs — Kids Arabic uses a tablet/chalkboard-inspired graphic with Arabic lettering centered correctly inside any circular badges).
- Shared field set: student first/last name, age, **gender** (styled custom select matching the dark theme — no default browser dropdown arrow), parent/guardian name, parent email, parent phone, **emergency contact number** (separate field from parent phone), **student health card number** (own full-width row, centered), and a medical-conditions disclaimer field labeled "Student medical condition(s) (if any)" with the exact disclaimer copy: importance of being informed of any medical condition and emergency instructions beyond calling 911 (allergies, first-aid remedies), and a note that special needs cannot be accommodated at this time.
- Program-specific fields/pricing shown per program:
  - Aalim: Monday–Friday, $150/month
  - Hifz: Monday–Friday, $75/month
  - Quran Classes: Weekend, $50/month
  - Kids Arabic: (existing pricing, confirm with existing `programs/kids-arabic/page.tsx`)
- Decorative background per page matching that program's theme (not a shared generic background) — motion/parallax elements, not static.
- Submission goes through the existing shared `submit.ts` server action.

## Design Tokens (extract precisely from the `.dc.html` files' inline styles)
- Background base green: `#0e2419` family (check each file's root div `background:` value).
- Gold/amber accent: `#d4a45c` / `#e3b16a` family (medallions, CTAs, borders).
- Arabic display font: Amiri (Google Fonts) — see `<helmet>` `@font-face`/`<link>` tags in any `.dc.html` file.
- Latin font pairing: Work Sans (body) — confirm serif/display headline font from each file's `font-family` declarations.
- Border radius: mix of soft-rounded cards (12–20px) and fully custom illustrated shapes (medallions, book covers) — not uniform.
- Buttons: gradient gold fills for primary CTAs, outlined/ghost style for secondary.

Pull exact hex values, spacing, and font-sizes directly from each `.dc.html` file's inline `style` attributes — they are the source of truth, more precise than this summary.

## Assets
- Logo and hero photography are hosted remotely (see `site-src/lib/links.ts` for existing URLs) — reuse those, do not re-host.
- Decorative Islamic motifs (lanterns, crescents, medallions, geometric patterns) in the `.dc.html` files are hand-built with CSS/SVG — recreate as real SVG/CSS assets in the new codebase; do not screenshot them.
- Reference photo for the Hifz Quran book cover (ornate gold diamond medallion design) was supplied during the original design conversation — if unavailable, the current `Hifz Registration.dc.html` implementation is the fallback source of truth.

## Files in this bundle
- `Darul Arqum Home.dc.html`
- `Prayer Times.dc.html`
- `Story.dc.html`
- `Gallery.dc.html`
- `Pledge.dc.html`
- `Aalim Registration.dc.html`
- `Hifz Registration.dc.html`
- `Quran Class Registration.dc.html`
- `Kids Registration.dc.html`
- `site-src/` — the current (old-design) Next.js codebase these should be implemented into. `site-src/app/actions/submit.ts` is the existing shared form-delivery logic to reuse; `site-src/lib/links.ts` holds existing asset URLs to reuse.
