import { EXT, LOCATION_LIST, ORG, SITE_URL } from "@/lib/links";

/**
 * What this place is, in the form search engines read.
 *
 * People do not search "Darul Arqum". They search "mosque near Riverside
 * South" and "jummah time Ottawa", and a page with no structured data is a
 * page Google has to guess about. This says it outright: a place of worship,
 * at these two addresses, with this phone number, these hours for Jumu'ah,
 * and a registered charity number.
 *
 * Two masjids means two Mosque nodes under one organisation, rather than one
 * node with a second address bolted on, because they are two places a person
 * can drive to.
 *
 * Everything here reads from lib/links.ts, so an address or a number cannot
 * say one thing on the page and another to Google.
 */
export function StructuredData() {
  const graph = [
    {
      "@type": ["Organization", "NGO"],
      "@id": `${SITE_URL}/#organization`,
      name: ORG.name,
      alternateName: ORG.tagline,
      url: SITE_URL,
      telephone: ORG.phone,
      email: ORG.email,
      /** the CRA registration, which is what makes a donation receiptable */
      taxID: ORG.charityReg,
      nonprofitStatus: "NonprofitANBI",
      areaServed: { "@type": "City", name: "Ottawa" },
      sameAs: [EXT.youtubeChannel, EXT.mawaqitLive],
    },
    ...LOCATION_LIST.map((loc, i) => ({
      "@type": ["Mosque", "PlaceOfWorship"],
      "@id": `${SITE_URL}/locations#${loc.key}`,
      name: loc.name,
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/locations#${loc.key}`,
      telephone: ORG.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.street,
        addressLocality: "Ottawa",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      // only the first masjid is confirmed open; the second has no hours yet
      ...(i === 0
        ? {
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Friday",
                opens: "13:00",
                closes: "15:00",
                name: "Jumu'ah",
              },
            ],
          }
        : {}),
    })),
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: ORG.name,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-CA",
    },
  ];

  return (
    <script
      type="application/ld+json"
      // the payload is built from our own constants, never from user input
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
