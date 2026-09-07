/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Both of these ship barrel files: importing one symbol pulls the whole
   * index into the client bundle. `optimizePackageImports` rewrites those to
   * deep imports at build time, so only the icons and motion primitives that
   * are actually referenced get bundled.
   */
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "motion/react"],
  },

  async redirects() {
    /**
     * Where the old Wix pages went.
     *
     * The site ran on Wix for years, so its URLs are in Google's index, in
     * WhatsApp messages, on printed flyers and in people's bookmarks. Every
     * one of them that is not caught here is a 404 for somebody who did
     * nothing wrong — and, until Google recrawls, a 404 sitting in the search
     * results under the masjid's name.
     *
     * The list below was taken from the Internet Archive's record of the old
     * site rather than from memory, so it covers pages nobody here would have
     * thought to list. If another old slug turns up, add it: a redirect costs
     * nothing and a dead link costs a visitor.
     */
    const map = [
      // prayer
      ["/salat", "/prayer-times"],

      // programs
      ["/madrasa", "/programs/quran-classes"],
      ["/maktab", "/programs/quran-classes"],
      ["/ischool", "/programs"],
      ["/contact-1", "/programs/aalim"],
      ["/services-4", "/programs/aalim"],
      ["/kidslearnarabic", "/programs/kids-arabic"],
      ["/welearn", "/programs/welearn"],

      // giving
      ["/donate", "/give"],
      ["/donations", "/give"],
      ["/contribute", "/give"],
      ["/membership", "/give"],
      // a "loyal donor" on the old site was signing up to give monthly
      ["/loyaldonor", "/give/pledge"],
      ["/pledge", "/give/pledge"],
      ["/tax-receipt", "/give/tax-receipt"],

      // story and photographs
      ["/thestory", "/story"],
      ["/masjid-gallery", "/gallery"],
      ["/fundraising-event-march-7th-2020-ga", "/gallery"],
      ["/taraweeh-ramadhan-2021", "/gallery"],

      /**
       * The old site had an events section and this one does not yet. Until
       * it does, these land on the community page, which is the closest
       * honest answer — every one of them is a past event, and the archived
       * list runs from 2020 fundraising dinners to Eid prayer times.
       */
      ["/events", "/community"],
      ["/event-details/:slug*", "/community"],
      ["/eid", "/community"],

      // community
      ["/volunteer", "/community"],
      ["/copy-of-volunteer", "/community"],
      ["/subscribe", "/community"],
      ["/register", "/community"],

      // Wix leftovers that were never real pages
      ["/home-1", "/"],
      ["/blank-page", "/"],
    ];
    return map.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};
export default nextConfig;
