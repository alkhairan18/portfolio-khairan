import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

export function localThumb(id, width = 600) {
  return `assets/works/${id}-${width}.webp`;
}

export async function buildThumbs(ids, outDir, fetchImpl = fetch) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const ok = [];
  const failed = [];

  for (const id of ids) {
    try {
      const url = `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
      const res = await fetchImpl(url);
      if (!res.ok) {
        failed.push(id);
        continue;
      }
      const arrayBuf = await res.arrayBuffer();
      const buf = Buffer.from(arrayBuf);

      const f600 = path.join(outDir, `${id}-600.webp`);
      const f1200 = path.join(outDir, `${id}-1200.webp`);

      await sharp(buf)
        .resize({ width: 600, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(f600);

      await sharp(buf)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(f1200);

      ok.push(id);
    } catch (err) {
      console.error(`Error processing thumbnail for ${id}:`, err.message);
      failed.push(id);
    }
  }

  return { ok, failed };
}

// CLI runner
if (process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) {
  (async () => {
    const { createRequire } = await import('node:module');
    const req = createRequire(import.meta.url);
    const data = req('../src/data/portfolio-data.cjs');
    const outDir = path.join(ROOT, 'public/assets/works');

    const ids = data.driveItems.map((item) => item.id);
    console.log(`Starting buildThumbs for ${ids.length} items to ${outDir}...`);
    const { ok, failed } = await buildThumbs(ids, outDir);

    console.log(`Finished: ${ok.length} succeeded, ${failed.length} failed.`);
    if (failed.length > 0) {
      console.error('Failed IDs:', failed);
      process.exit(1);
    }
  })();
}
