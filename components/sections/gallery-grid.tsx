"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { SafeImage } from "@/components/site/safe-image";
import { SectionIntro } from "@/components/site/section-intro";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { EXT } from "@/lib/links";

/**
 * Albums mirror the legacy gallery structure (Masjid Gallery ·
 * Fundraising Event March 7, 2020 · Taraweeh-Ramadhan 2021).
 *
 * ADMIN-ACCESS FOLLOW-UP: populate `src` values by copying image
 * addresses from the live gallery pages (or the Wix media export).
 * Tiles without a src render as branded lattice placeholders, so the
 * page works fully either way.
 */
type Photo = { src: string; alt: string };
type Album = { title: string; note: string; photos: Photo[] };

const ALBUMS: Album[] = [
  {
    title: "The masjid",
    note: "4269 Limebank Rd — the community's home, inside and out.",
    photos: [
      { src: EXT.logoFull, alt: "Darul Arqum crest" },
      { src: "", alt: "Masjid front — Limebank Rd" },
      { src: "", alt: "Prayer hall" },
      { src: "", alt: "Entrance" },
      { src: "", alt: "Community space" },
      { src: "", alt: "Grounds" },
    ],
  },
  {
    title: "Fundraising dinner — March 7, 2020",
    note: "The night the community rallied to bring the building home.",
    photos: [
      { src: "", alt: "Fundraising dinner — gathering" },
      { src: "", alt: "Fundraising dinner — speakers" },
      { src: "", alt: "Fundraising dinner — community" },
    ],
  },
  {
    title: "Taraweeh — Ramadhan 2021",
    note: "The first Ramadhan nights prayed in a home of our own.",
    photos: [
      { src: "", alt: "Taraweeh prayers" },
      { src: "", alt: "Ramadhan nights at the masjid" },
      { src: "", alt: "Congregation" },
    ],
  },
];

export function GalleryGrid() {
  const [open, setOpen] = React.useState<Photo | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="px-5 py-20 md:py-28">
      <div className="mx-auto max-w-wide space-y-20">
        {ALBUMS.map((album) => (
          <section key={album.title}>
            <SectionIntro eyebrow="Album" title={album.title} lede={album.note} />
            <Stagger className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
              {album.photos.map((p, i) => (
                <StaggerItem key={`${album.title}-${i}`}>
                  <motion.button
                    type="button"
                    onClick={() => setOpen(p)}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="block w-full overflow-hidden rounded-2xl border border-line text-left"
                    aria-label={`View: ${p.alt}`}
                  >
                    <SafeImage src={p.src} alt={p.alt} className="aspect-[4/3] w-full object-cover" />
                  </motion.button>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-5 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.alt}
          >
            <motion.div
              initial={{ scale: 0.94, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage src={open.src} alt={open.alt} className="max-h-[80vh] w-full object-contain bg-ink" />
              <p className="bg-ink px-5 py-3 text-sm text-bone/70">{open.alt}</p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-ink/70 text-bone hover:bg-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
