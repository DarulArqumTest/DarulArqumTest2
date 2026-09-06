import type { MetadataRoute } from "next";
import { PROGRAMS } from "@/lib/programs";
import { R, SITE_URL } from "@/lib/links";


/**
 * Every page, so search engines are not left to guess.
 *
 * Priorities reflect what people actually arrive looking for: prayer times
 * and locations first, then programmes and giving, then the reading.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const at = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    at(R.home, 1, "weekly"),
    at(R.prayer, 0.9, "daily"),
    at(R.locations, 0.8, "monthly"),
    at(R.programs, 0.8, "monthly"),
    at(R.give, 0.8, "monthly"),
    at(R.contact, 0.7, "monthly"),
    at(R.community, 0.6, "monthly"),
    at(R.story, 0.6, "yearly"),
    at(R.gallery, 0.5, "monthly"),
    at(R.newsletters, 0.5, "monthly"),
    at(R.newsletterDec2020, 0.3, "yearly"),
    at(R.pledge, 0.6, "yearly"),
    at(R.taxReceipt, 0.4, "yearly"),
    at(R.padForm, 0.4, "yearly"),
    ...PROGRAMS.flatMap((p) => {
      const rows = [at(`/programs/${p.slug}`, 0.7, "monthly" as const)];
      if (p.registerHref) rows.push(at(p.registerHref, 0.6, "yearly" as const));
      return rows;
    }),
  ];
}
