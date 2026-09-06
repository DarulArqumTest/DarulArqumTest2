/**
 * Re-encode the images in public/ without changing a single filename.
 *
 * They were exported straight out of whatever produced them and never
 * touched: hero-house.jpg is 2.4 MB at 1360px wide, which is a quality
 * setting nobody chose; interac-logo.png is 2210x2210 for a mark that is
 * drawn 40px wide; several "PNG" files are photographs with no transparency
 * in them at all.
 *
 * Formats and names stay exactly as they are so nothing that references
 * them has to change. Alpha is preserved where it exists. The only files
 * that shrink in pixel terms are ones being displayed far smaller than they
 * are stored.
 *
 *   node scripts/optimize-images.mjs          report only
 *   node scripts/optimize-images.mjs --write   actually rewrite them
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname, posix } from "node:path";
import sharp from "sharp";

const WRITE = process.argv.includes("--write");

/** longest side we ever need, per file; anything unlisted keeps its size */
const MAX_SIDE = {
  "assets/interac-logo.png": 240,
  "assets/whatsapp-icon.png": 200,
  "assets/phone-icon.png": 200,
  "assets/lantern-photo.png": 800,
  "assets/masjid-gallery-1.png": 1800,
  "assets/masjid-gallery-2.png": 1800,
  "assets/masjid-gallery-3.png": 1400,
  "assets/masjid-gallery-4.png": 1800,
  "assets/gallery/fundraising-1.jpg": 1400,
  "assets/gallery/fundraising-2.jpg": 1400,
};

/** everything else is capped here, which is generous for a full-bleed hero */
const DEFAULT_MAX = 1800;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(png|jpe?g)$/i.test(extname(name))) out.push(p);
  }
  return out;
}

const files = walk("public").sort();
let before = 0;
let after = 0;
const rows = [];

for (const file of files) {
  const key = posix.join(...file.split(/[\\/]/).slice(1));
  const sizeBefore = statSync(file).size;
  before += sizeBefore;

  // read the bytes up front: sharp keeps the source file open, and on
  // Windows that blocks writing back to the same path
  const input = readFileSync(file);
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const cap = MAX_SIDE[key] ?? DEFAULT_MAX;
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  if (longest > cap) {
    pipeline = pipeline.resize({ width: cap, height: cap, fit: "inside", withoutEnlargement: true });
  }

  const isPng = /\.png$/i.test(file);
  pipeline = isPng
    ? pipeline.png({
        compressionLevel: 9,
        effort: 10,
        // a photograph stored as a PNG with no alpha quantises well and
        // stays a PNG, so nothing that points at it has to change
        palette: !meta.hasAlpha,
        quality: meta.hasAlpha ? 90 : 82,
      })
    : pipeline.jpeg({ quality: 78, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" });

  const buf = await pipeline.toBuffer();

  // never make a file bigger than it already was
  const use = buf.length < sizeBefore ? buf : null;
  const sizeAfter = use ? use.length : sizeBefore;
  after += sizeAfter;

  if (use && WRITE) writeFileSync(file, use);

  const saved = sizeBefore - sizeAfter;
  if (saved > 1024) {
    rows.push(
      `${String(Math.round(sizeBefore / 1024)).padStart(6)} KB -> ${String(Math.round(sizeAfter / 1024)).padStart(6)} KB  (-${String(Math.round((saved / sizeBefore) * 100)).padStart(2)}%)  ${key}`,
    );
  }
}

console.log(rows.join("\n"));
console.log(
  `\n${WRITE ? "written" : "DRY RUN"}: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB ` +
    `(-${Math.round(((before - after) / before) * 100)}%)`,
);
if (!WRITE) console.log("re-run with --write to apply");
