"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXT, ORG, R } from "@/lib/links";

const NAV = [
  { label: "Prayer times", href: R.prayer },
  { label: "Programs", href: R.programs },
  { label: "Give", href: R.give },
  { label: "Story", href: R.story },
  { label: "Gallery", href: R.gallery },
  { label: "Community", href: R.community },
  { label: "Contact", href: R.contact },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  const onDark = !scrolled; // heroes are dark; switch tone once scrolled

  return (
    <motion.header
      initial={reduce ? false : { y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b border-line/70 bg-bone/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-wide items-center justify-between px-5 md:h-[76px]">
        <Link href={R.home} className="flex items-center gap-3">
          <Image
            src={EXT.logo}
            alt="Darul Arqum logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-brass/40"
            priority
          />
          <span
            className={cn(
              "font-display text-lg tracking-tight transition-colors",
              onDark ? "text-bone" : "text-ink",
            )}
          >
            Darul Arqum
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "u-draw text-sm transition-colors",
                onDark ? "text-bone/75 hover:text-bone" : "text-ink/70 hover:text-ink",
                pathname === item.href && (onDark ? "text-bone" : "text-ink"),
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={R.give}
            className="rounded-full bg-brass px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.04]"
          >
            Donate
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full xl:hidden",
            open || !onDark ? "text-ink" : "text-bone",
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-line bg-bone xl:hidden"
            aria-label="Mobile"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="space-y-1 px-5 pb-6 pt-2"
            >
              {[{ label: "Home", href: R.home }, ...NAV, { label: "Newsletters", href: R.newsletters }].map((item) => (
                <motion.div
                  key={item.href}
                  variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-3 font-display text-xl text-ink/85 hover:bg-sand/50"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                className="flex gap-3 pt-3"
              >
                <Link href={R.give} className="flex-1 rounded-full bg-brass px-5 py-3 text-center text-sm font-medium text-ink">
                  Donate
                </Link>
                <a href={ORG.phoneHref} className="flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm text-ink">
                  <Phone className="h-4 w-4" aria-hidden />
                  {ORG.phone}
                </a>
              </motion.div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
