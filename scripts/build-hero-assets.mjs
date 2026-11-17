/**
 * Car cutout for the "text behind the car" hero effect.
 *
 *   node scripts/build-hero-assets.mjs <mask.png> [photo]
 *
 * photo     — defaults to public/hero-photo.jpg
 * mask.png  — alpha matte of that photo (any size; alpha channel is used),
 *             e.g. produced with @imgly/background-removal-node.
 *
 * Writes public/hero-car-cutout.webp at the photo's exact size, so it sits
 * pixel-perfect on top of the photo.
 */
import path from "node:path";
import sharp from "sharp";

const maskPath = process.argv[2];
if (!maskPath) throw new Error("Usage: node scripts/build-hero-assets.mjs <mask.png> [photo]");
const ROOT = process.cwd();
const photoPath = process.argv[3] ?? path.join(ROOT, "public", "hero-photo.jpg");
const outPath = path.join(ROOT, "public", "hero-car-cutout.webp");

const { width: W, height: H } = await sharp(photoPath).metadata();
const n = W * H;

const alphaRaw = await sharp(maskPath)
  .resize(W, H, { fit: "fill", kernel: "lanczos3" })
  .ensureAlpha()
  .extractChannel(3)
  .toColourspace("b-w")
  .raw()
  .toBuffer();

// keep only the largest connected blob (drops floor specks / reflections)
const label = new Int32Array(n).fill(-1);
const queue = new Int32Array(n);
let best = { id: -1, size: 0 };
let id = 0;
for (let i = 0; i < n; i++) {
  if (label[i] !== -1 || alphaRaw[i] < 128) continue;
  let head = 0;
  let tail = 0;
  let size = 0;
  queue[tail++] = i;
  label[i] = id;
  while (head < tail) {
    const p = queue[head++];
    size++;
    const x = p % W;
    for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) {
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

const rgb = await sharp(photoPath).removeAlpha().raw().toBuffer();
const rgba = Buffer.alloc(n * 4);
for (let i = 0; i < n; i++) {
  rgba[i * 4] = rgb[i * 3];
  rgba[i * 4 + 1] = rgb[i * 3 + 1];
  rgba[i * 4 + 2] = rgb[i * 3 + 2];
  rgba[i * 4 + 3] = choked[i];
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 90, alphaQuality: 90, smartSubsample: true })
  .toFile(outPath);

console.log(`hero-car-cutout.webp written (${W}x${H})`);
