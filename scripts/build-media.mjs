/**
 * Media pipeline — run with `npm run media`.
 *
 * Reads the supplied project folders and writes web-ready assets to /public/media:
 *   - still.jpg       optimized master of each concept image (original resolution, never upscaled)
 *   - detail-{1..3}   crops of the real image, chosen by local entropy (busiest regions)
 *   - preview.mp4     the supplied GIF camera-move loop, re-encoded as H.264 (far smaller, pausable)
 * plus the editing-breakdown crops, grain texture and icon PNGs, and a manifest with dimensions.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";

const root = process.cwd();
const out = path.join(root, "public");
const SOURCES = [
  [1, "luma"], [2, "velo"], [3, "after-hours"], [4, "atlas"], [5, "forma"],
  [6, "aera"], [7, "moonvale"], [8, "serein"], [9, "gather"], [10, "orbit"],
  [11, "solara"], [12, "nouri"], [13, "little-atlas"], [14, "nova"], [15, "vanta"],
  [16, "morrow"], [17, "fieldnote"], [18, "kanso"], [19, "pulse"], [20, "prism"],
  [21, "thread"], [22, "meridian"], [23, "cove"], [24, "evergreen"], [25, "signal"],
  [26, "paws-and-play"], [27, "aperture"], [28, "bloom"], [29, "contour"], [30, "hearth"],
];

/** Editing-breakdown crops on Morrow: square regions in source pixels. */
const BREAKDOWN = {
  skin: { left: 315, top: 20, size: 300 },
  fabric: { left: 300, top: 200, size: 340 },
  light: { left: 20, top: 560, size: 400 },
  type: { left: 870, top: 100, size: 560 },
};

const force = process.argv.includes("--force");
const exists = (p) => !force && fs.existsSync(p);
const manifest = {};

function sourceFor(n) {
  const id = String(n).padStart(2, "0");
  return n <= 10
    ? { still: `creative-portfolio/${id}.png`, gif: `creative-portfolio/${id}.gif` }
    : { still: `portfolio-projects-11-30/${id}.jpg`, gif: `portfolio-projects-11-30/${id}.gif` };
}

async function entropyCrops(file, width, height, count = 3) {
  const side = Math.round(height * 0.5);
  const candidates = [];
  for (let gx = 0; gx < 5; gx++) {
    for (let gy = 0; gy < 3; gy++) {
      const left = Math.round(((width - side) * gx) / 4);
      const top = Math.round(((height - side) * gy) / 2);
      const { entropy } = await sharp(file).extract({ left, top, width: side, height: side }).stats();
      candidates.push({ left, top, side, entropy });
    }
  }
  candidates.sort((a, b) => b.entropy - a.entropy);
  const picked = [];
  for (const c of candidates) {
    const overlaps = picked.some((p) => {
      const ix = Math.max(0, Math.min(p.left + side, c.left + side) - Math.max(p.left, c.left));
      const iy = Math.max(0, Math.min(p.top + side, c.top + side) - Math.max(p.top, c.top));
      return (ix * iy) / (side * side) > 0.25;
    });
    if (!overlaps) picked.push(c);
    if (picked.length === count) break;
  }
  return picked;
}

/** Five dominant colours via a small k-means over a downsampled copy of the image. */
async function extractPalette(file, k = 5) {
  const { data } = await sharp(file).resize(72, 72, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += 3) px.push([data[i], data[i + 1], data[i + 2]]);
  let centers = Array.from({ length: k }, (_, i) => px[Math.floor(((i + 0.5) * px.length) / k)]);
  let groups = [];
  for (let iter = 0; iter < 12; iter++) {
    groups = centers.map(() => []);
    for (const p of px) {
      let best = 0, bestD = Infinity;
      centers.forEach((c, ci) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < bestD) { bestD = d; best = ci; }
      });
      groups[best].push(p);
    }
    centers = groups.map((g, gi) => (g.length ? [0, 1, 2].map((ch) => g.reduce((s, p) => s + p[ch], 0) / g.length) : centers[gi]));
  }
  const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
  return centers.map((c, i) => ({ c, n: groups[i].length })).sort((a, b) => b.n - a.n).map(({ c }) => hex(c));
}

for (const [n, slug] of SOURCES) {
  const src = sourceFor(n);
  const dir = path.join(out, "media", "work", slug);
  fs.mkdirSync(dir, { recursive: true });
  const meta = await sharp(src.still).metadata();
  const entry = { width: meta.width, height: meta.height, details: [] };

  const still = path.join(dir, "still.jpg");
  if (!exists(still)) await sharp(src.still).jpeg({ quality: 86, mozjpeg: true }).toFile(still);

  const crops = await entropyCrops(src.still, meta.width, meta.height);
  for (const [i, c] of crops.entries()) {
    const file = path.join(dir, `detail-${i + 1}.jpg`);
    if (!exists(file)) {
      await sharp(src.still)
        .extract({ left: c.left, top: c.top, width: c.side, height: c.side })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(file);
    }
    entry.details.push({ src: `/media/work/${slug}/detail-${i + 1}.jpg`, size: c.side });
  }

  const video = path.join(dir, "preview.mp4");
  if (!exists(video)) {
    execFileSync(ffmpeg, [
      "-y", "-loglevel", "error", "-i", src.gif,
      "-movflags", "+faststart", "-pix_fmt", "yuv420p",
      "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos",
      "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-an", video,
    ]);
  }
  const gifMeta = await sharp(src.gif, { animated: true }).metadata();
  entry.video = {
    width: gifMeta.width - (gifMeta.width % 2),
    height: gifMeta.pageHeight - (gifMeta.pageHeight % 2),
  };
  entry.palette = await extractPalette(src.still);
  manifest[slug] = entry;
  console.log(`✓ ${slug}`);
}

// Editing breakdown crops (Morrow)
const bdDir = path.join(out, "media", "breakdown");
fs.mkdirSync(bdDir, { recursive: true });
for (const [key, r] of Object.entries(BREAKDOWN)) {
  const file = path.join(bdDir, `morrow-${key}.jpg`);
  if (!exists(file)) {
    await sharp(sourceFor(16).still)
      .extract({ left: r.left, top: r.top, width: r.size, height: r.size })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(file);
  }
}

// Paper grain: tiny tile of soft monochrome noise, tiled in CSS
const tex = path.join(out, "textures");
fs.mkdirSync(tex, { recursive: true });
const N = 220;
const noise = Buffer.alloc(N * N * 4);
for (let i = 0; i < N * N; i++) {
  const v = Math.random() * 255;
  noise.set([v, v, v, Math.random() * 22], i * 4);
}
await sharp(noise, { raw: { width: N, height: N, channels: 4 } }).png({ compressionLevel: 9 }).toFile(path.join(tex, "grain.png"));

// Icons rendered from the identity mark
const mark = fs.readFileSync(path.join(root, "public", "icon.svg"));
for (const [name, size] of [["icon-32.png", 32], ["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  await sharp(mark, { density: 600 }).resize(size, size).png().toFile(path.join(out, name));
}
const ico32 = await sharp(mark, { density: 600 }).resize(32, 32).png().toBuffer();
// Single-image ICO wrapping a PNG (supported by all modern browsers)
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(ico32.length, 14); header.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(out, "favicon.ico"), Buffer.concat([header, ico32]));

fs.writeFileSync(path.join(root, "data", "media-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("Media pipeline complete.");
