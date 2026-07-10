"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { SafeImage } from "@/components/site/safe-image";
import { Reveal } from "@/components/site/reveal";
import { EXT } from "@/lib/links";

type Photo = { src: string; alt: string };

const FUNDRAISING_PHOTOS: Photo[] = [
  { src: EXT.galleryFundraising1, alt: "Fundraising dinner — gathering" },
  { src: EXT.galleryFundraising2, alt: "Fundraising dinner — community" },
];

export function GalleryGrid() {
  const [open, setOpen] = React.useState<Photo | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative bg-da-bg px-5 py-20 font-daBody text-da-cream md:py-28">
      <div className="mx-auto max-w-wide space-y-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-da-goldL">Masjid Gallery</p>
          <h2 className="mt-2 font-daDisplay text-3xl font-medium tracking-tight text-da-cream md:text-4xl">
            Our home at Limebank Road.
          </h2>
          <button
            type="button"
            onClick={() => setOpen({ src: "", alt: "Darul Arqum masjid house" })}
            className="mt-8 block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-da-gold/20"
          >
            <SafeImage src="" alt="Darul Arqum masjid house" className="max-h-[560px] w-full object-cover" />
          </button>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-da-goldL">March 7th, 2020</p>
          <h2 className="mt-2 font-daDisplay text-3xl font-medium tracking-tight text-da-cream md:text-4xl">
            Masjid fundraising event
          </h2>
          <p className="mt-2 text-sm text-da-cream/60">Hellenic Meeting &amp; Receptions Centre, Ottawa</p>
          <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            {FUNDRAISING_PHOTOS.map((p) => (
              <motion.button
                key={p.alt}
                type="button"
                onClick={() => setOpen(p)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="block aspect-[1141/344] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-da-gold/25"
                aria-label={`View: ${p.alt}`}
              >
                <SafeImage src={p.src} alt={p.alt} className="h-full w-full object-cover" />
              </motion.button>
            ))}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-[rgba(6,16,11,0.88)] p-10 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.alt}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.3, 1] }}
              className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-xl shadow-[0_40px_90px_-20px_rgba(0,0,0,0.7)]"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage src={open.src} alt={open.alt} className="max-h-[80vh] w-full object-contain bg-da-bg" />
              <p className="bg-da-bg px-5 py-3 text-sm text-da-cream/70">{open.alt}</p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-da-cream/30 bg-da-cream/10 text-da-cream hover:bg-da-cream/20"
              >
                <X className="h-4.5 w-4.5" aria-hidden />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
