import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ORG } from "@/lib/links";

/**
 * Social share card, generated at build time.
 *
 * An ensemble, not a logo on a background. The masjid itself is the ground
 * the whole card stands on; the two properties are the leads, given real
 * photographs and real captions; the five prayers run as a strip of skies in
 * the same gradients the prayer board uses; and the programmes appear as the
 * rooms they actually are rather than as words in outlined boxes. Someone
 * who has never heard of Darul Arqum should be able to look once and know
 * what it is and what happens there.
 *
 * Satori supports only a subset of CSS: flexbox and absolute positioning
 * only, every element with more than one child needs an explicit
 * `display: flex`, and background images do not tile. Everything here is
 * built from primitives and from pre-scaled JPEGs in public/assets/og, so a
 * refactor of the site chrome can never break this build.
 */

export const alt = "Darul Arqum — two masjids in Ottawa: prayer, Quran classes and community in Riverside South";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OG_DIR = path.join(process.cwd(), "public", "assets", "og");
const jpg = (f: string) => `data:image/jpeg;base64,${fs.readFileSync(path.join(OG_DIR, f)).toString("base64")}`;
const png = (f: string) =>
  `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public", "assets", f)).toString("base64")}`;

/** The five skies, lifted from the prayer board's own gradients. */
const SKIES = [
  { name: "Fajr", bg: "linear-gradient(180deg,#182238 0%,#35335c 46%,#6d4c6f 78%,#a8724f 100%)", disc: "#f7dfa6", glow: "rgba(247,223,166,0.5)", top: 60, size: 19, fg: "#fdf6e6", plate: "rgba(9,13,26,0.62)" },
  { name: "Dhuhr", bg: "linear-gradient(180deg,#2f6fb0 0%,#5b9bd6 55%,#a9d4ee 100%)", disc: "#fffbe8", glow: "rgba(255,251,232,0.75)", top: 15, size: 25, fg: "#0d2118", plate: "rgba(248,252,255,0.72)" },
  { name: "Asr", bg: "linear-gradient(180deg,#a8622c 0%,#cf9143 55%,#ecc57e 100%)", disc: "#fff2cf", glow: "rgba(255,242,207,0.7)", top: 28, size: 23, fg: "#2a1608", plate: "rgba(255,247,228,0.72)" },
  { name: "Maghrib", bg: "linear-gradient(180deg,#4a2a56 0%,#a83f4a 45%,#d9722f 78%,#f0a860 100%)", disc: "#ffdcb0", glow: "rgba(255,179,92,0.7)", top: 55, size: 25, fg: "#fff3e4", plate: "rgba(38,10,28,0.6)" },
  { name: "Isha", bg: "linear-gradient(180deg,#0a1220 0%,#182642 55%,#223458 100%)", disc: "#eef1ff", glow: "rgba(238,241,255,0.5)", top: 18, size: 11, fg: "#f6f3ea", plate: "rgba(4,8,18,0.6)" },
];

const PROGRAMS = [
  { file: "quran.jpg", label: "Quran classes", tint: "#e3c56a" },
  { file: "aalim.jpg", label: "Aalim & Hifz", tint: "#d98f4a" },
  { file: "kids.jpg", label: "Kids Arabic", tint: "#a9e0c0" },
  // No photograph in the library shows people, and a fourth building shot
  // beside the two location cards would read as more property. The WhatsApp
  // group is how this community actually keeps in touch, so it stands for it.
  { file: "whatsapp.jpg", label: "WhatsApp group", tint: "#7cc99a" },
];

export default function OpengraphImage() {
  const bg = jpg("bg.jpg");
  const east = jpg("east.jpg");
  const west = jpg("west.jpg");
  const emblem = png("logo-icon.png");
  const programs = PROGRAMS.map((p) => ({ ...p, src: jpg(p.file) }));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#08180f" }}>
        {/* ── the masjid, as the ground everything stands on ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} />
        {/* The grade. NOTE: `inset: 0` leaves this element zero-sized in
            Satori and the whole scrim silently disappears, taking every bit
            of text legibility with it — the size has to be stated. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "linear-gradient(101deg, rgba(5,19,12,0.95) 0%, rgba(5,19,12,0.93) 46%, rgba(6,24,15,0.80) 62%, rgba(6,24,15,0.58) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 82% 14%, rgba(243,217,138,0.22), transparent 44%), radial-gradient(circle at 6% 94%, rgba(60,140,100,0.30), transparent 48%)",
          }}
        />

        {/* ── a garland of lights across the top ── */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 46, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "0 54px" }}>
          {Array.from({ length: 22 }, (_, i) => {
            const drop = 6 + (i % 4) * 7;
            const hue = ["#f3d98a", "#a9e0c0", "#f0a89f", "#e3c56a"][i % 4];
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 10 }}>
                <div style={{ width: 1, height: drop, backgroundColor: "rgba(227,197,106,0.45)", display: "flex" }} />
                <div style={{ width: 7, height: 7, borderRadius: 7, backgroundColor: hue, boxShadow: `0 0 10px 3px ${hue}55`, display: "flex" }} />
              </div>
            );
          })}
        </div>

        {/* ── gold frame ── */}
        <div style={{ position: "absolute", top: 24, left: 24, right: 24, bottom: 24, display: "flex", border: "2px solid rgba(227,197,106,0.6)", borderRadius: 12 }} />
        <div style={{ position: "absolute", top: 32, left: 32, right: 32, bottom: 32, display: "flex", border: "1px solid rgba(227,197,106,0.24)", borderRadius: 7 }} />

        {/* ══ LEFT: who we are, the five prayers, and what happens inside ══
            One column with a stated height and space-between, so the three
            blocks share the card's full height instead of overrunning each
            other from the top down. */}
        <div style={{ position: "absolute", top: 52, left: 62, width: 566, height: 526, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* identity */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f5ec", border: "2px solid rgba(227,197,106,0.9)", boxShadow: "0 10px 26px -10px rgba(0,0,0,0.8)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={emblem} alt="" width={44} height={44} />
              </div>
              <div style={{ marginLeft: 15, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 14.5, letterSpacing: 4.2, color: "#e3c56a", fontFamily: "system-ui, sans-serif", fontWeight: 700, display: "flex" }}>
                  RIVERSIDE SOUTH · OTTAWA
                </div>
                <div style={{ marginTop: 6, fontSize: 16, letterSpacing: 1.2, color: "rgba(248,245,236,0.72)", fontFamily: "system-ui, sans-serif", fontWeight: 600, display: "flex" }}>
                  darularqum.org
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, fontSize: 74, lineHeight: 1, letterSpacing: -1.2, color: "#f8f5ec", fontFamily: "Georgia, serif", textShadow: "0 3px 18px rgba(0,0,0,0.75)", display: "flex" }}>
              Darul Arqum
            </div>

            <div style={{ marginTop: 15, display: "flex", alignItems: "center" }}>
              <div style={{ width: 120, height: 2, backgroundColor: "rgba(227,197,106,0.85)", display: "flex" }} />
              <div style={{ marginLeft: 11, marginRight: 11, width: 9, height: 9, backgroundColor: "#e3c56a", transform: "rotate(45deg)", display: "flex" }} />
              <div style={{ width: 290, height: 1, backgroundColor: "rgba(227,197,106,0.32)", display: "flex" }} />
            </div>

            <div style={{ marginTop: 15, fontSize: 25, lineHeight: 1.28, color: "rgba(248,245,236,0.9)", fontFamily: "Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.7)", maxWidth: 520, display: "flex" }}>
              A house of Allah rising in Riverside South.
            </div>
          </div>

          {/* the five prayers, each in its own sky */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, backgroundColor: "#7cc99a", display: "flex" }} />
              <div style={{ marginLeft: 10, fontSize: 13, letterSpacing: 2.4, color: "rgba(169,224,192,0.95)", fontWeight: 700, fontFamily: "system-ui, sans-serif", display: "flex" }}>
                FIVE PRAYERS DAILY IN CONGREGATION
              </div>
            </div>
            <div style={{ marginTop: 10, display: "flex", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(227,197,106,0.4)", boxShadow: "0 18px 36px -18px rgba(0,0,0,0.85)" }}>
              {SKIES.map((s) => (
                <div key={s.name} style={{ position: "relative", width: 107, height: 88, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundImage: s.bg, borderRight: "1px solid rgba(0,0,0,0.22)" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: s.top,
                      left: 53 - s.size / 2,
                      width: s.size,
                      height: s.size,
                      borderRadius: s.size,
                      backgroundColor: s.disc,
                      boxShadow: `0 0 20px 6px ${s.glow}`,
                      display: "flex",
                    }}
                  />
                  {/* a label plate, because a bare name at the horizon of its
                      own gradient sits at whatever contrast the sky happens
                      to have there — Fajr and Maghrib both lost it */}
                  <div style={{ position: "relative", width: 107, height: 27, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: s.plate }}>
                    <div style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: 0.3, color: s.fg, fontFamily: "system-ui, sans-serif", display: "flex" }}>
                      {s.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "6px 13px", borderRadius: 8, backgroundColor: "rgba(146,34,34,0.92)", border: "1px solid rgba(240,168,159,0.55)" }}>
                <div style={{ fontSize: 12, letterSpacing: 2, color: "rgba(255,224,224,0.9)", fontWeight: 700, fontFamily: "system-ui, sans-serif", display: "flex" }}>
                  JUMU&apos;AH
                </div>
                <div style={{ marginLeft: 10, fontSize: 14, color: "#fff", fontWeight: 700, fontFamily: "system-ui, sans-serif", display: "flex" }}>
                  {ORG.jumua.first} &amp; {ORG.jumua.second}
                </div>
              </div>
              <div style={{ marginLeft: 13, fontSize: 13.5, color: "rgba(248,245,236,0.62)", fontFamily: "system-ui, sans-serif", display: "flex" }}>
                WhatsApp group · monthly newsletter
              </div>
            </div>
          </div>

          {/* what happens inside */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            {programs.map((p) => (
              <div key={p.label} style={{ marginRight: 20, display: "flex", flexDirection: "column", alignItems: "center", width: 112 }}>
                <div style={{ display: "flex", width: 80, height: 80, borderRadius: 80, overflow: "hidden", border: `2px solid ${p.tint}`, boxShadow: "0 14px 26px -12px rgba(0,0,0,0.9)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt="" width={76} height={76} />
                </div>
                <div style={{ marginTop: 8, fontSize: 13.5, fontWeight: 700, color: "rgba(248,245,236,0.92)", textShadow: "0 2px 8px rgba(0,0,0,0.85)", fontFamily: "system-ui, sans-serif", display: "flex" }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT: the two masjids, as photographs ══ */}
        <div style={{ position: "absolute", top: 56, right: 58, width: 468, display: "flex", flexDirection: "column" }}>
          {[
            { src: east, name: "Darul Arqum East", street: "4269 Limebank Rd", tag: "OPEN NOW", tint: "#e3c56a", ink: "#3a2c05", rot: "-1.2deg" },
            { src: west, name: "Darul Arqum West", street: "6050 Old Richmond Rd", tag: "COMING SOON", tint: "#a9e0c0", ink: "#0d2a1b", rot: "1.2deg" },
          ].map((b, i) => (
            <div
              key={b.name}
              style={{
                marginTop: i === 0 ? 0 : 22,
                display: "flex",
                flexDirection: "column",
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: "#0a1f14",
                border: `2px solid ${b.tint}`,
                boxShadow: "0 26px 52px -22px rgba(0,0,0,0.9)",
                transform: `rotate(${b.rot})`,
              }}
            >
              <div style={{ position: "relative", display: "flex", width: 464, height: 172 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt="" width={464} height={172} />
                <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(180deg, rgba(6,20,13,0) 40%, rgba(6,20,13,0.55) 100%)" }} />
                <div style={{ position: "absolute", top: 11, left: 12, display: "flex", padding: "5px 11px", borderRadius: 7, backgroundColor: b.tint }}>
                  <div style={{ fontSize: 11.5, letterSpacing: 1.8, fontWeight: 800, color: b.ink, fontFamily: "system-ui, sans-serif", display: "flex" }}>
                    {b.tag}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", padding: "11px 16px 13px" }}>
                <div style={{ fontSize: 25, color: "#f8f5ec", fontFamily: "Georgia, serif", display: "flex" }}>{b.name}</div>
                <div style={{ marginTop: 3, fontSize: 14.5, color: "rgba(248,245,236,0.62)", fontFamily: "system-ui, sans-serif", display: "flex" }}>
                  {b.street}, Ottawa
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    ),
    size,
  );
}
