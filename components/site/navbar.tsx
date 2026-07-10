"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORG, R } from "@/lib/links";
import { DonateMenu } from "@/components/site/donate-menu";
import { requestSectionScroll, type ScrollTargetId } from "@/components/site/use-scroll-highlight";

type NavItem = { label: string; href: string } | { label: string; sectionId: ScrollTargetId };

const NAV: NavItem[] = [
  { label: "Prayer times", href: R.prayer },
  { label: "Programs", sectionId: "programs-section" },
  { label: "Story", href: R.story },
  { label: "Gallery", href: R.gallery },
  { label: "Community", sectionId: "whatsapp-section" },
  { label: "Contact us", sectionId: "contact-us" },
];

function NavLink({ item, className, onNavigate }: { item: NavItem; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  if ("href" in item) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          className,
          pathname === item.href && "text-da-goldL",
        )}
      >
        {item.label}
      </Link>
    );
  }
  const onHome = pathname === "/";
  return (
    <a
      href={`/#${item.sectionId}`}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (onHome) {
          e.preventDefault();
          requestSectionScroll(item.sectionId);
        }
      }}
    >
      {item.label}
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const onHome = pathname === "/";

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.header
      initial={reduce ? false : { y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={cn(
        "inset-x-0 top-0 border-b border-da-gold/[0.22] font-daBody backdrop-blur-md backdrop-saturate-150",
        onHome ? "fixed z-40 bg-da-bg/[0.72]" : "sticky z-20 bg-da-bg/[0.85]",
      )}
    >
      <div className="mx-auto grid h-16 max-w-wide grid-cols-[auto_1fr_auto] items-center gap-5 px-5 md:h-[76px]">
        <Link href={R.home} className="flex items-center gap-2.5">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-da-cream">
            <Image src="/assets/logo-icon.png" alt="Darul Arqum emblem" width={28} height={28} className="h-[84%] w-[84%] object-contain" priority />
          </span>
          <span className="font-daDisplay text-lg font-semibold text-da-cream">Darul Arqum</span>
        </Link>

        <nav
          className="relative mx-auto hidden items-center gap-6 rounded-t-[10px] rounded-b-full border border-da-gold/[0.22] bg-da-cream/[0.045] px-8 py-2.5 xl:flex"
          aria-label="Primary"
        >
          <span className="absolute left-1/2 top-[5px] -translate-x-1/2 text-[8px] text-da-gold/55">✦</span>
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              className="u-draw text-sm font-medium text-da-cream/[0.82] transition-all hover:-translate-y-0.5 hover:text-da-goldL"
            />
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <div className="hidden xl:block">
            <DonateMenu />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full text-da-cream xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-da-gold/20 bg-da-bg xl:hidden"
            aria-label="Mobile"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              className="space-y-1 px-5 pb-6 pt-2"
            >
              {NAV.map((item) => (
                <motion.div
                  key={item.label}
                  variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}
                >
                  <NavLink
                    item={item}
                    onNavigate={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 font-daDisplay text-xl text-da-cream/85 hover:bg-da-gold/10"
                  />
                </motion.div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                className="flex flex-wrap items-center gap-3 pt-3"
              >
                <DonateMenu />
                <a
                  href={ORG.phoneHref}
                  className="flex items-center gap-2 rounded-full border border-da-gold/25 px-5 py-3 text-sm text-da-cream"
                >
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
