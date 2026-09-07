import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/links";

/**
 * Crawlers were left to work the site out on their own.
 *
 * Everything here is public and worth indexing except the form pages, which
 * are only useful to somebody who arrived from the programme they belong to
 * and would otherwise turn up in search results as a bare form.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin"],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: SITE_URL,
  };
}
