import { ImageResponse } from "next/og";
import { ORG } from "@/lib/links";

/**
 * Social share card, generated at build time.
 *
 * Rendered by Satori, which supports only a subset of CSS: flexbox, absolute
 * positioning and plain backgrounds. No grid, no custom properties, no
 * shorthand `background` with multiple layers. Every element that contains
 * more than one child needs an explicit `display: flex`.
 *
 * Deliberately built from primitives rather than the site's components so a
 * refactor of the site chrome can never break the build here.
 */

export const alt = "Darul Arqum, masjid in Riverside South, Ottawa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0e2419",
          backgroundImage:
            "radial-gradient(circle at 78% 22%, rgba(201,162,39,0.28), transparent 55%), radial-gradient(circle at 12% 88%, rgba(60,140,100,0.30), transparent 55%)",
          padding: "68px 76px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* crescent, echoing the site's night motif */}
        <div style={{ position: "absolute", top: 74, right: 96, display: "flex" }}>
          <div style={{ width: 96, height: 96, borderRadius: 96, backgroundColor: "#e3c56a", display: "flex" }} />
          <div
            style={{
              position: "absolute",
              top: -10,
              left: 27,
              width: 96,
              height: 116,
              borderRadius: 96,
              backgroundColor: "#0e2419",
              display: "flex",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 44, height: 3, backgroundColor: "#c9a227", display: "flex" }} />
            <div
              style={{
                marginLeft: 18,
                fontSize: 22,
                letterSpacing: 4,
                color: "#c9a227",
                fontFamily: "system-ui, sans-serif",
                display: "flex",
              }}
            >
              RIVERSIDE SOUTH MUSLIM COMMUNITY ASSOCIATION
            </div>
          </div>

          <div style={{ marginTop: 34, fontSize: 96, lineHeight: 1.04, color: "#f6f3ea", display: "flex" }}>
            Darul Arqum
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 38,
              lineHeight: 1.3,
              color: "rgba(246,243,234,0.78)",
              maxWidth: 820,
              display: "flex",
            }}
          >
            A house of Allah rising in Riverside South.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: 26,
              color: "rgba(246,243,234,0.62)",
              fontFamily: "system-ui, sans-serif",
              display: "flex",
            }}
          >
            Two masjids in Ottawa · Prayer times, programs &amp; giving
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#e3c56a",
              fontFamily: "system-ui, sans-serif",
              display: "flex",
            }}
          >
            {ORG.phone}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
