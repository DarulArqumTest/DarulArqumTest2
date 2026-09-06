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
    // Complete 301 map: every legacy Wix slug lands on its new home.
    const map = [
      ["/salat", "/prayer-times"],
      ["/madrasa", "/programs/quran-classes"],
      ["/contact-1", "/programs/aalim"],
      ["/services-4", "/programs/aalim"],
      ["/kidslearnarabic", "/programs/kids-arabic"],
      ["/welearn", "/programs/welearn"],
      ["/donate", "/give"],
      ["/contribute", "/give"],
      ["/pledge", "/give/pledge"],
      ["/tax-receipt", "/give/tax-receipt"],
      ["/thestory", "/story"],
      ["/masjid-gallery", "/gallery"],
      ["/fundraising-event-march-7th-2020-ga", "/gallery"],
      ["/taraweeh-ramadhan-2021", "/gallery"],
      ["/volunteer", "/community"],
      ["/copy-of-volunteer", "/community"],
      ["/subscribe", "/community"],
      ["/register", "/community"],
      ["/eid", "/community"],
    ];
    return map.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};
export default nextConfig;
