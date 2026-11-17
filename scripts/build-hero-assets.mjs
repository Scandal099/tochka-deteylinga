/**
 * Hero poster + car cutout (for the "text behind the car" effect).
 *
 *   node scripts/build-hero-assets.mjs <mask.png>
 *
 * <mask.png> — alpha matte of the first 4K frame (any size, alpha channel used),
 * e.g. produced with @imgly/background-removal-node. The poster is rendered from
 * the same source frame with the same grade as the scroll sequence, so the cutout
 * sits pixel-perfect on top of it.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const maskPath = process.argv[2];
if (!maskPath) throw new Error("Usage: node scripts/build-hero-assets.mjs <mask.png>");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "video4k", "Camera_moving_around_Porsche_911_66a2a094_4K.mp4");
const OUT_DIR = path.join(ROOT, "public", "frames");
const W = 2560;
const H = 1440;
const tmpPng = path.join(os.tmpdir(), `hero-${Date.now()}.png`);

execFileSync(
  ffmpegPath,
  [
    "-y", "-i", SRC, "-frames:v", "1",
    "-vf", `scale=${W}:${H}:flags=lanczos,unsharp=5:5:0.45,eq=contrast=1.06:saturation=0.78`,
    tmpPng,
  ],
  { stdio: "ignore" }
);

// --- mask: alpha -> keep largest connected blob (drops floor specks) -> soft edge
const { data: alphaRaw, info } = await sharp(maskPath)
  .resize(W, H, { fit: "fill", kernel: "lanczos3" })
  .ensureAlpha()
  .extractChannel(3)
  .toColourspace("b-w")
  .raw()
  .toBuffer({ resolveWithObject: true });

const n = W * H;
const label = new Int32Array(n).fill(-1);
const queue = new Int32Array(n);
let best = { id: -1, size: 0 };
let id = 0;
for (let i = 0; i < n; i++) {
  if (label[i] !== -1 || alphaRaw[i] < 128) continue;
  let head = 0, tail = 0, size = 0;
  queue[tail++] = i;
  label[i] = id;
  while (head < tail) {
    const p = queue[head++];
    size++;
    const x = p % W;
    const nb = [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W];
    for (const q of nb) {
      if (q < 0 || q >= n || label[q] !== -1 || alphaRaw[q] < 128) continue;
      label[q] = id;
      queue[tail++] = q;
    }
  }
  if (size > best.size) best = { id, size };
  id++;
}
const alpha = Buffer.alloc(n);
for (let i = 0; i < n; i++) {
  // keep soft edge values only next to the main blob
  if (label[i] === best.id) alpha[i] = alphaRaw[i];
  else if (label[i] === -1 && alphaRaw[i] > 0) {
    const x = i % W;
    const near =
      (x > 0 && label[i - 1] === best.id) ||
      (x < W - 1 && label[i + 1] === best.id) ||
      (i >= W && label[i - W] === best.id) ||
      (i + W < n && label[i + W] === best.id);
    alpha[i] = near ? alphaRaw[i] : 0;
  }
}
// slight choke so no background halo survives on the silhouette
const choked = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } })
  .blur(0.8)
  .linear(1.15, -0.15 * 255)
  .extractChannel(0)
  .toColourspace("b-w")
  .raw()
  .toBuffer();
if (alphaRaw.length !== n || choked.length !== n) {
  throw new Error(`mask size mismatch: ${alphaRaw.length} / ${choked.length} vs ${n}`);
}

await sharp(tmpPng).webp({ quality: 86, smartSubsample: true }).toFile(path.join(OUT_DIR, "hero-poster.webp"));
const rgb = await sharp(tmpPng).removeAlpha().raw().toBuffer();
const rgba = Buffer.alloc(n * 4);
for (let i = 0; i < n; i++) {
  rgba[i * 4] = rgb[i * 3];
  rgba[i * 4 + 1] = rgb[i * 3 + 1];
  rgba[i * 4 + 2] = rgb[i * 3 + 2];
  rgba[i * 4 + 3] = choked[i];
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 88, alphaQuality: 90, smartSubsample: true })
  .toFile(path.join(OUT_DIR, "hero-car-cutout.webp"));

fs.rmSync(tmpPng, { force: true });
console.log("hero-poster.webp + hero-car-cutout.webp written", info.width, info.height);
