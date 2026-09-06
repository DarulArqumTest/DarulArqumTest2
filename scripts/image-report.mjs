import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(png|jpe?g)$/i.test(extname(name))) out.push(p);
  }
  return out;
}

const files = walk("public").sort((a, b) => statSync(b).size - statSync(a).size);
for (const f of files.slice(0, 20)) {
  const { width, height, hasAlpha, channels } = await sharp(f).metadata();
  const kb = Math.round(statSync(f).size / 1024);
  console.log(`${String(kb).padStart(6)} KB  ${String(width).padStart(5)}x${String(height).padEnd(5)} alpha=${hasAlpha ? "y" : "n"} ch=${channels}  ${f}`);
}
