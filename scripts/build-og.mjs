import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

export async function buildOg(outPath) {
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141210" />
      <stop offset="100%" stop-color="#0B0A09" />
    </linearGradient>
    <radialGradient id="vermilionGlow" cx="85%" cy="25%" r="45%">
      <stop offset="0%" stop-color="#FF4D1C" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#FF4D1C" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#vermilionGlow)" />

  <!-- Framing border -->
  <rect x="36" y="36" width="1128" height="558" rx="20" fill="none" stroke="#2C2622" stroke-width="2" />
  <rect x="44" y="44" width="1112" height="542" rx="14" fill="none" stroke="#1E1A17" stroke-width="1" />

  <!-- Corner Crosses -->
  <path d="M 36 50 L 36 36 L 50 36" fill="none" stroke="#FF4D1C" stroke-width="3" />
  <path d="M 1164 50 L 1164 36 L 1150 36" fill="none" stroke="#FF4D1C" stroke-width="3" />
  <path d="M 36 580 L 36 594 L 50 594" fill="none" stroke="#FF4D1C" stroke-width="3" />
  <path d="M 1164 580 L 1164 594 L 1150 594" fill="none" stroke="#FF4D1C" stroke-width="3" />

  <!-- Top bar -->
  <circle cx="82" cy="88" r="6" fill="#FF4D1C" />
  <text x="102" y="93" fill="#FF4D1C" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" letter-spacing="2">STUDIO ARCHIVE // MAKASSAR, ID</text>
  <text x="1116" y="93" text-anchor="end" fill="#A69E93" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600">FIG. 00 // 2026 EDITION</text>
  <line x1="72" y1="120" x2="1128" y2="120" stroke="#2C2622" stroke-width="1.5" />

  <!-- Main Hero Title -->
  <text x="72" y="235" fill="#F7F4EF" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="58" font-weight="800" letter-spacing="-1.5">Muhammad Al Khairan Asaad</text>

  <!-- Disciplines -->
  <text x="72" y="315" fill="#FF6A3D" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="34" font-weight="700">Graphic Designer &amp; Software Development</text>

  <!-- Academic & Credentials -->
  <text x="72" y="390" fill="#F7F4EF" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="22" font-weight="600">Politeknik Negeri Ujung Pandang <tspan fill="#A69E93" font-weight="400">·</tspan> <tspan fill="#F59E0B">IPK 3.74 / 4.00</tspan></text>
  <text x="72" y="430" fill="#A69E93" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="19" font-weight="400">Infografis Resmi KPU Makassar · Identitas Visual · Kemasan · Motion · Android IoT RUBOOTH</text>

  <!-- Divider -->
  <line x1="72" y1="485" x2="1128" y2="485" stroke="#2C2622" stroke-width="1.5" />

  <!-- Bottom Pills & Metadata -->
  <rect x="72" y="515" width="230" height="38" rx="8" fill="#171412" stroke="#2C2622" stroke-width="1" />
  <text x="88" y="539" fill="#F7F4EF" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600">38 KARYA TERKURASI</text>

  <rect x="318" y="515" width="270" height="38" rx="8" fill="#171412" stroke="#2C2622" stroke-width="1" />
  <text x="334" y="539" fill="#F7F4EF" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600">RUBOOTH SMART PHOTOBOOTH</text>

  <text x="1116" y="539" text-anchor="end" fill="#FF4D1C" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="700">portfolio-khairan.vercel.app &#8599;</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outPath);

  return { width: 1200, height: 630 };
}

// CLI runner
if (process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) {
  (async () => {
    const outPath = path.join(ROOT, 'public/og-image.png');
    console.log(`Building 1200x630 OG image to ${outPath}...`);
    const meta = await buildOg(outPath);
    console.log(`OG image generated: ${meta.width}x${meta.height}`);
  })();
}
