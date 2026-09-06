import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Social share card, generated at build time.
 *
 * Composed rather than assembled: a girih lattice runs edge to edge, a gold
 * rule frames it, and the masjid emblem sits inside a struck medallion built
 * from the same eight-point star as the lattice, so the mark reads as part of
 * the pattern instead of a logo dropped onto a background.
 *
 * Satori supports only a subset of CSS. Flexbox and absolute positioning
 * only, every element with more than one child needs an explicit
 * `display: flex`, and there is no `background-repeat` on a data URI unless
 * the size is stated. Kept to primitives so a refactor of the site chrome can
 * never break this build.
 */

export const alt = "Darul Arqum, masjid in Riverside South, Ottawa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The girih field, drawn as real elements.
 *
 * Satori does not reliably repeat a background-image, so tiling a data URI
 * silently produced a flat panel. Each cell is instead an eight-point star
 * built the way the site builds it: a square and the same square rotated 45
 * degrees, overlaid.
 */
const CELL = 150;
const COLS = Math.ceil(1200 / CELL) + 1;
const ROWS = Math.ceil(630 / CELL) + 1;
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => ({
  x: (i % COLS) * CELL,
  y: Math.floor(i / COLS) * CELL,
}));

function emblem() {
  const file = path.join(process.cwd(), "public", "assets", "logo-icon.png");
  return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
}

export default function OpengraphImage() {
  const logo = emblem();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0b2116",
        }}
      >
        {/* girih field */}
        {CELLS.map((c, i) => (
          <div key={i} style={{ position: "absolute", left: c.x, top: c.y, width: CELL, height: CELL, display: "flex" }}>
            <div
              style={{
                position: "absolute",
                left: CELL * 0.19,
                top: CELL * 0.19,
                width: CELL * 0.62,
                height: CELL * 0.62,
                display: "flex",
                border: "1px solid rgba(201,162,39,0.13)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: CELL * 0.19,
                top: CELL * 0.19,
                width: CELL * 0.62,
                height: CELL * 0.62,
                display: "flex",
                border: "1px solid rgba(201,162,39,0.13)",
                transform: "rotate(45deg)",
              }}
            />
          </div>
        ))}
        {/* light pooling from the upper right, as on the site */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 78% 44%, rgba(201,162,39,0.20), transparent 46%), linear-gradient(96deg, rgba(9,26,18,0.97) 30%, rgba(9,26,18,0.62) 62%, rgba(9,26,18,0.30) 100%)",
          }}
        />

        {/* gold frame */}
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 26,
            display: "flex",
            border: "2px solid rgba(201,162,39,0.55)",
            borderRadius: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 34,
            right: 34,
            bottom: 34,
            display: "flex",
            border: "1px solid rgba(201,162,39,0.28)",
            borderRadius: 6,
          }}
        />

        {/* ── medallion: the emblem struck into the lattice's own star ── */}
        <div
          style={{
            position: "absolute",
            top: 168,
            right: 74,
            width: 300,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 250,
              height: 250,
              display: "flex",
              border: "2px solid rgba(227,197,106,0.55)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 250,
              height: 250,
              display: "flex",
              border: "2px solid rgba(227,197,106,0.55)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 232,
              height: 232,
              borderRadius: 232,
              display: "flex",
              border: "3px solid rgba(227,197,106,0.9)",
              backgroundColor: "rgba(8,24,16,0.94)",
            }}
          />
          {/* The emblem is a square plate of #f6f3ea. Seating it on a circle
              left its corners either poking past the curve or showing as a
              lighter square inside it, so the plate here is a rounded square
              of the same size: no seam, and the gold rings and star still do
              the framing. */}
          <div
            style={{
              position: "absolute",
              width: 152,
              height: 152,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "#f6f3ea",
              border: "2px solid rgba(201,162,39,0.8)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={158} height={158} />
          </div>
        </div>

        {/* ── words ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 84px",
            width: 700,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 40, height: 2, backgroundColor: "#c9a227", display: "flex" }} />
            <div
              style={{
                marginLeft: 16,
                fontSize: 19,
                letterSpacing: 5,
                color: "#e3c56a",
                fontFamily: "system-ui, sans-serif",
                display: "flex",
              }}
            >
              RIVERSIDE SOUTH · OTTAWA
            </div>
          </div>

          <div
            style={{
              marginTop: 26,
              fontSize: 96,
              lineHeight: 1,
              color: "#f6f3ea",
              fontFamily: "Georgia, serif",
              letterSpacing: -1,
              display: "flex",
            }}
          >
            Darul Arqum
          </div>

          <div style={{ marginTop: 22, display: "flex", alignItems: "center" }}>
            <div style={{ width: 9, height: 9, backgroundColor: "#c9a227", transform: "rotate(45deg)", display: "flex" }} />
            <div style={{ marginLeft: 14, width: 300, height: 1, backgroundColor: "rgba(201,162,39,0.6)", display: "flex" }} />
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 31,
              lineHeight: 1.34,
              color: "rgba(246,243,234,0.82)",
              fontFamily: "Georgia, serif",
              maxWidth: 470,
              display: "flex",
            }}
          >
            A house of Allah rising in Riverside South.
          </div>

          <div style={{ marginTop: 28, display: "flex", gap: 8 }}>
            {["Prayer times", "Quran classes", "Aalim program", "Community"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "7px 13px",
                  borderRadius: 8,
                  border: "1px solid rgba(201,162,39,0.42)",
                  backgroundColor: "rgba(201,162,39,0.09)",
                  color: "rgba(246,243,234,0.86)",
                  fontSize: 17,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {t}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 18,
              letterSpacing: 3,
              color: "rgba(227,197,106,0.78)",
              fontFamily: "system-ui, sans-serif",
              display: "flex",
            }}
          >
            TWO MASJIDS IN OTTAWA · darularqum.org
          </div>
        </div>
      </div>
    ),
    size,
  );
}
