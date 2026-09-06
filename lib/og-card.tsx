import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * One share card, per page.
 *
 * Every link on the site shared the same picture, so a programme dropped in
 * a WhatsApp group arrived looking anonymous — and WhatsApp is how this
 * community actually passes things around. Each page gets its own now: its
 * own eyebrow, its own headline, its own colour running through the frame
 * and the medallion, and the two or three facts a person needs before they
 * decide whether to open it.
 *
 * The frame, the girih field and the emblem are the root card's, so a page
 * card and the site card are recognisably the same object.
 *
 * Satori supports a subset of CSS: flexbox and absolute positioning only,
 * every element with more than one child needs an explicit `display: flex`,
 * and background images do not tile. Everything here stays on primitives.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const CELL = 150;
const COLS = Math.ceil(OG_SIZE.width / CELL) + 1;
const ROWS = Math.ceil(OG_SIZE.height / CELL) + 1;
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => ({
  x: (i % COLS) * CELL,
  y: Math.floor(i / COLS) * CELL,
}));

function emblem() {
  const file = path.join(process.cwd(), "public", "assets", "logo-icon.png");
  return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
}

/** rgba from a #rrggbb, because Satori has no color-mix */
function tint(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function pageCard({
  eyebrow,
  title,
  lede,
  facts = [],
  accent = "#e3c56a",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** the two or three things worth knowing before you open the link */
  facts?: string[];
  accent?: string;
}) {
  const logo = emblem();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#0b2116" }}>
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
                border: `1px solid ${tint(accent, 0.13)}`,
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
                border: `1px solid ${tint(accent, 0.13)}`,
                transform: "rotate(45deg)",
              }}
            />
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `radial-gradient(circle at 80% 46%, ${tint(accent, 0.22)}, transparent 46%), linear-gradient(96deg, rgba(9,26,18,0.97) 32%, rgba(9,26,18,0.66) 64%, rgba(9,26,18,0.34) 100%)`,
          }}
        />

        {/* the frame */}
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 26,
            display: "flex",
            border: `2px solid ${tint(accent, 0.55)}`,
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
            border: `1px solid ${tint(accent, 0.26)}`,
            borderRadius: 6,
          }}
        />

        {/* the medallion, in this page's colour */}
        <div
          style={{
            position: "absolute",
            top: 195,
            right: 86,
            width: 250,
            height: 250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", width: 210, height: 210, display: "flex", border: `2px solid ${tint(accent, 0.5)}`, transform: "rotate(45deg)" }} />
          <div style={{ position: "absolute", width: 210, height: 210, display: "flex", border: `2px solid ${tint(accent, 0.5)}` }} />
          <div
            style={{
              position: "absolute",
              width: 194,
              height: 194,
              borderRadius: 194,
              display: "flex",
              border: `3px solid ${tint(accent, 0.9)}`,
              backgroundColor: "rgba(8,24,16,0.94)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 124,
              height: 124,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "#f6f3ea",
              border: `2px solid ${tint(accent, 0.8)}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={130} height={130} />
          </div>
        </div>

        {/* the words */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 84px",
            width: 760,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 40, height: 2, backgroundColor: accent, display: "flex" }} />
            <div
              style={{
                marginLeft: 16,
                fontSize: 19,
                letterSpacing: 5,
                color: accent,
                fontFamily: "system-ui, sans-serif",
                display: "flex",
              }}
            >
              {eyebrow.toUpperCase()}
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: title.length > 26 ? 68 : 86,
              lineHeight: 1.02,
              color: "#f6f3ea",
              fontFamily: "Georgia, serif",
              letterSpacing: -1,
              maxWidth: 620,
              display: "flex",
            }}
          >
            {title}
          </div>

          <div style={{ marginTop: 20, display: "flex", alignItems: "center" }}>
            <div style={{ width: 9, height: 9, backgroundColor: accent, transform: "rotate(45deg)", display: "flex" }} />
            <div style={{ marginLeft: 14, width: 280, height: 1, backgroundColor: tint(accent, 0.6), display: "flex" }} />
          </div>

          {lede && (
            <div
              style={{
                marginTop: 20,
                fontSize: 28,
                lineHeight: 1.34,
                color: "rgba(246,243,234,0.82)",
                fontFamily: "Georgia, serif",
                maxWidth: 560,
                display: "flex",
              }}
            >
              {lede}
            </div>
          )}

          {facts.length > 0 && (
            <div style={{ marginTop: 26, display: "flex", gap: 8 }}>
              {facts.slice(0, 3).map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    padding: "7px 13px",
                    borderRadius: 8,
                    border: `1px solid ${tint(accent, 0.42)}`,
                    backgroundColor: tint(accent, 0.09),
                    color: "rgba(246,243,234,0.88)",
                    fontSize: 17,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: 24,
              fontSize: 18,
              letterSpacing: 3,
              color: tint(accent, 0.78),
              fontFamily: "system-ui, sans-serif",
              display: "flex",
            }}
          >
            DARUL ARQUM · RIVERSIDE SOUTH, OTTAWA
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
