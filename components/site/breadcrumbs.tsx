import Link from "next/link";
import { R } from "@/lib/links";

/**
 * The way back up.
 *
 * Deep pages like /programs/hifz/register had no route out except the
 * browser's own back button, which is not there at all if the page was
 * opened from a link someone shared.
 *
 * Two renderings of the same list rather than one squeezed into both: a
 * phone gets a single back link to the parent, because a three-level trail
 * in 375px either wraps or truncates and a truncated trail is worse than no
 * trail; wider screens get the full path. The last item is the current page
 * and is never a link.
 */

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const trail: Crumb[] = [{ label: "Home", href: R.home }, ...items];
  // the nearest ancestor that can actually be navigated to
  const parent = [...trail].slice(0, -1).reverse().find((c) => c.href);

  return (
    <nav aria-label="Breadcrumb" className={className ? `da-crumbs ${className}` : "da-crumbs"}>
      {parent && (
        <Link href={parent.href!} className="da-crumbs-back">
          <span aria-hidden="true">←</span>
          {parent.label}
        </Link>
      )}
      <ol className="da-crumbs-trail">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`}>
              {c.href && !last ? <Link href={c.href}>{c.label}</Link> : <span aria-current={last ? "page" : undefined}>{c.label}</span>}
              {!last && (
                <span className="da-crumbs-sep" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
