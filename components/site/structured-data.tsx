import { EXT, LOCATION_LIST, ORG, SITE_URL } from "@/lib/links";

/**
 * What this place is, in the form search engines read.
 *
 * A page with no structured data is a page Google has to guess about, so
 * this says it outright: a community centre at this address, with this
 * phone number and a registered charity number.
 *
 * The node type is deliberate. It was ["Community Center", "PlaceOfWorship"], which
 * is the single most consequential line on the site for how Google and
 * every downstream directory classify the building. It is now a civic
 * structure, matching how the organisation describes itself.
 *
 * One node per published property, from LOCATION_LIST — so a property that
 * is withheld from the site is withheld from search too, rather than
 * quietly staying in the graph.
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
      "@type": ["CivicStructure", "Place"],
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
      // only the first property is confirmed open; any other has no hours yet
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
