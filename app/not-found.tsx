import Link from "next/link";
import { Ambient } from "@/components/site/ambient";
import { R } from "@/lib/links";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink px-5 text-bone">
        <Ambient dark grain />
        <div className="relative mx-auto max-w-wide py-40">
          <p className="text-[11px] uppercase tracking-[0.3em] text-brassL">404</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">This page has moved on</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/60">
            The redesign reorganized a few old addresses. Everything still exists — try one of these.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={R.home} className="rounded-full bg-brass px-6 py-3.5 text-sm font-medium text-ink">Home</Link>
            <Link href={R.prayer} className="rounded-full border border-bone/25 px-6 py-3.5 text-sm text-bone">Prayer times</Link>
            <Link href={R.give} className="rounded-full border border-bone/25 px-6 py-3.5 text-sm text-bone">Give</Link>
          </div>
        </div>
    </main>
  );
}
