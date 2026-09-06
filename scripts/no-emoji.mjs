#!/usr/bin/env node
/**
 * Fails the build if a pictographic emoji reaches the source.
 *
 * An emoji is a character in someone else's font: Apple, Google and Microsoft
 * each draw it differently and none of them drew it for this site. Standing
 * one in for an icon is the clearest single tell of an unfinished interface,
 * so it does not ship. Draw the mark instead — components/site/program-glyphs.tsx
 * is the house set.
 *
 * Typographic marks are allowed and deliberately not caught: arrows, the
 * four-point star, a check, a close. They render in the text colour, in the
 * page's own font, and they are type rather than pictures.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SEARCH = ["app", "components", "lib"];
const EXTS = [".ts", ".tsx", ".css", ".mjs", ".js"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "graphify-out", "out", "dist"]);

/**
 * Emoji_Presentation + the legacy pictographs that default to a colour glyph.
 * Deliberately excludes U+2190–U+21FF (arrows), U+2713/2715 (check, close)
 * and U+2726 (four-point star), which are typography.
 */
const PICTOGRAPHIC = new RegExp(
  "[" +
    "\\u{1F000}-\\u{1FAFF}" + // the main emoji planes
    "\\u{1F1E6}-\\u{1F1FF}" + // regional indicators
    "\\u{2600}-\\u{26FF}" + // miscellaneous symbols (weather, warning, …)
    "\\u{2700}-\\u{2705}\\u{2708}-\\u{2712}" + // dingbats that render in colour
    "\\u{FE0F}" + // the variation selector that forces colour
    "]",
  "gu",
);

const offences = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!EXTS.some((e) => entry.endsWith(e))) continue;
    const rel = relative(ROOT, full).split(sep).join("/");
    if (rel === "scripts/no-emoji.mjs") continue;

    readFileSync(full, "utf8")
      .split("\n")
      .forEach((line, i) => {
        for (const m of line.matchAll(PICTOGRAPHIC)) {
          offences.push({
            file: rel,
            line: i + 1,
            char: m[0],
            code: `U+${m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`,
            context: line.trim().slice(0, 96),
          });
        }
      });
  }
}

for (const dir of SEARCH) {
  try {
    walk(join(ROOT, dir));
  } catch {
    /* a directory that does not exist is not a failure */
  }
}

if (offences.length === 0) {
  console.log(`no-emoji: clean (${SEARCH.join(", ")})`);
  process.exit(0);
}

console.error(`\nno-emoji: ${offences.length} pictographic character(s) in the source.\n`);
for (const o of offences) {
  console.error(`  ${o.file}:${o.line}  ${o.char}  ${o.code}`);
  console.error(`      ${o.context}`);
}
console.error(
  "\nEmoji are drawn by the reader's operating system, not by us. Add a mark to" +
    "\ncomponents/site/program-glyphs.tsx and use <Glyph name=\"…\" /> instead.\n",
);
process.exit(1);
