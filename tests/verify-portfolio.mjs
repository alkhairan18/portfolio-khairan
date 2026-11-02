import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = 'f:/portfolio-khairan';

test('Task 1: Local assets and PORTFOLIO_DATA structure', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'public/assets/profile_khairan.jpg')), 'profile_khairan.jpg must exist in public/assets');
  assert.ok(fs.existsSync(path.join(ROOT, 'public/assets/rubooth_banner.jpg')), 'rubooth_banner.jpg must exist in public/assets');

  const data = require(path.join(ROOT, 'src/data/portfolio-data.cjs'));
  assert.equal(data.profile.name, 'Muhammad Al Khairan Asaad');
  assert.equal(data.profile.institution, 'Politeknik Negeri Ujung Pandang');
  assert.equal(data.profile.gpa, 'IPK 3.74 / 4.00');
  assert.equal(data.driveItems.length, 38, 'Must have exactly 38 Google Drive works');
  assert.equal(data.driveItems.some(i => i.id === '1bdApHoMt2PzXcptWipbhhpioNl59ribX'), false, 'UI/UX item must not be present');
  assert.equal(data.driveItems.some(i => i.id === '1Q7xbfCeAFMPg2P67K6qXD-JOKF-rDr0J'), false, 'Infografis Daftar Partai Politik Peserta Pemilu must be removed');
  assert.equal(data.devItems.length, 1, 'Must have 1 unified RUBOOTH project');
  assert.equal(data.devItems[0].repoUrl, 'https://github.com/alkhairan18/rubooth');
  assert.equal(data.devItems[0].img, 'assets/rubooth_banner.jpg');
});

test('Task 2: CSS typography, theme variables, and zero-black-bars rules', () => {
  const css = fs.readFileSync(path.join(ROOT, 'src/styles/main.css'), 'utf8');
  assert.match(css, /Plus Jakarta Sans/);
  assert.match(css, /JetBrains Mono/);
  assert.doesNotMatch(css, /Syne/i);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\.stage-frame\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.modal-media-wrap\s*\{[^}]*width:\s*fit-content/s);
});

test('Task 3: HTML structure, Software Development terminology, and interactive JS safeguards', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'src/scripts/app.js'), 'utf8');
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');

  assert.match(html, /Muhammad Al Khairan Asaad/);
  assert.match(html, /Graphic Designer/);
  assert.match(html, /Software Development/);
  assert.doesNotMatch(html, /Software Engineer/i);
  assert.match(html, /window\.PORTFOLIO_DATA/);

  // Review Focus checks:
  // 1. Safe index-based handlers instead of inline string interpolation of titles/descriptions
  assert.match(js, /openDriveModalByIndex/);
  assert.match(js, /previewDesignStageByIndex/);
  // 2. Wrap-around modal navigation
  assert.match(js, /%\s*currentFilteredDrive\.length/);
  // 3. Safe localStorage access
  assert.match(js, /localStorage/);
  // 4. Stop propagation on GitHub button click
  assert.match(js, /stopPropagation/);
  // 5. Clear modal media container on close
  assert.match(js, /modalMediaContainer['"]\)\.innerHTML\s*=\s*['"]['"]/);

  assert.match(readme, /portfolio-data/);
});

test('Final Review Fixes: closeModal resets currentModalIdx and hydrateProfile syncs PORTFOLIO_DATA.profile on init', () => {
  const js = fs.readFileSync(path.join(ROOT, 'src/scripts/app.js'), 'utf8');
  assert.match(js, /function closeModal\(\)\s*\{[^}]*currentModalIdx\s*=\s*-1;/s);
  assert.match(js, /function hydrateProfile\(\)/);
  assert.match(js, /hydrateProfile\(\);/);
});

test('Audit Improvements: Favicon, Open Graph SEO, Contact/CV section, Accessibility, and Image Optimization', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'public/favicon.svg')), 'favicon.svg must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'public/favicon.ico')), 'favicon.ico must exist');

  const html = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'src/styles/main.css'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'src/scripts/app.js'), 'utf8');
  const data = require(path.join(ROOT, 'src/data/portfolio-data.cjs'));

  // 1. Favicon & Open Graph / Twitter meta tags
  assert.match(html, /rel="icon"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:description"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /property="og:url"/);
  assert.match(html, /name="twitter:card"/);

  // 2. Contact & CV fields in data + section in HTML
  assert.equal(data.profile.email, 'alkhairan18@gmail.com');
  assert.ok('linkedinUrl' in data.profile);
  assert.ok('whatsappUrl' in data.profile);
  assert.ok('cvUrl' in data.profile);
  assert.match(html, /id="kontak"/);
  assert.match(html, /mailto:alkhairan18@gmail\.com/);

  // 3. Accessibility (skip link, dialog role, keyboard support, focus-visible)
  assert.match(html, /class="skip-link"/);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(css, /\.skip-link/);
  assert.match(css, /:focus-visible/);
  assert.match(js, /tabindex="0"/);

  // 4. Image optimization & Google Drive fallback
  assert.match(html, /fetchpriority="high"/);
  assert.match(js, /lh3\.googleusercontent\.com\/d\//);
});

test('Taste-Skill UI Upgrade: Zero em-dashes, prefers-reduced-motion, eyebrow restraint, and view-mode / bento enhancements', () => {
  const html = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'src/styles/main.css'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'src/scripts/app.js'), 'utf8');
  const dataRaw = fs.readFileSync(path.join(ROOT, 'src/data/portfolio-data.cjs'), 'utf8');

  // 1. Zero em-dashes (—) in HTML and data
  assert.doesNotMatch(html, /—/, 'HTML must contain zero em-dashes');
  assert.doesNotMatch(dataRaw, /—/, 'portfolio-data.cjs must contain zero em-dashes');

  // 2. Reduced motion & reduced transparency guardrails (Apple Liquid Glass web approx)
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /prefers-reduced-transparency:\s*reduce/);
  assert.match(css, /\.liquid-glass-web-approx/);
  assert.match(css, /--radius-card:\s*24px/);
  assert.match(css, /--radius-pill:\s*9999px/);

  // 3. Tactile active state & gallery/list view mode support
  assert.match(css, /cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)/);
  assert.match(js, /setDriveViewMode/);
  assert.match(html, /rubooth-bento-grid/);
});

test('Astro + Tailwind CSS v4 Architecture & Static Pre-rendered Output', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'astro.config.mjs')), 'astro.config.mjs must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'src/styles/global.css')), 'src/styles/global.css must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'src/pages/index.astro')), 'src/pages/index.astro must exist');

  for (const comp of [
    'LightboxModal.astro',
    'Navbar.astro',
    'Hero.astro',
    'GraphicDesignSection.astro',
    'SoftwareDevSection.astro',
    'ContactFooter.astro'
  ]) {
    assert.ok(fs.existsSync(path.join(ROOT, 'src/components', comp)), `${comp} must exist`);
  }

  const astroConfig = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
  const globalCss = fs.readFileSync(path.join(ROOT, 'src/styles/global.css'), 'utf8');
  assert.match(astroConfig, /@tailwindcss\/vite/);
  assert.match(globalCss, /@import\s+["']tailwindcss["']/);

  assert.ok(fs.existsSync(path.join(ROOT, 'dist/index.html')), 'dist/index.html must be built');
  const distHtml = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  assert.doesNotMatch(distHtml, /—/, 'Built dist/index.html must contain zero em-dashes');
  assert.match(distHtml, /data-drive-idx="37"/, 'All 38 Google Drive items (0..37) must be pre-rendered in static HTML');
  assert.doesNotMatch(distHtml, /Infografis Daftar Partai Politik Peserta Pemilu/, 'Removed work must not appear in built HTML');
  assert.match(distHtml, /RUBOOTH - Smart Android Photobooth Kiosk System/);
  assert.match(distHtml, /id="driveSearchInput"/, 'Live gallery search input must exist in pre-rendered HTML');
  assert.match(distHtml, /id="pipelineDetailBox"/, 'Interactive RUBOOTH pipeline explorer must exist in pre-rendered HTML');
  assert.match(distHtml, /thumb-hover-drawer/, 'Hover quick-action drawer must exist on artwork cards');
  assert.match(distHtml, /spotlight-card/, 'Cursor-tracking spotlight cards must exist');
  assert.match(distHtml, /class="nav-brand-name"/, 'Navbar brand name must have explicit .nav-brand-name class so hydrateProfile does not overwrite status dot');
  assert.doesNotMatch(distHtml, /<span[^>]*class="nav-status-dot"/, 'Status dot must not be a span that precedes brand name');
});

test('Task 1 (Improvements): SEO Essentials - Canonical, robots.txt, sitemap.xml, and Schema.org JSON-LD', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'public/robots.txt')), 'public/robots.txt must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'public/sitemap.xml')), 'public/sitemap.xml must exist');

  const robots = fs.readFileSync(path.join(ROOT, 'public/robots.txt'), 'utf8');
  assert.match(robots, /User-agent:\s*\*/i);
  assert.match(robots, /Sitemap:\s*https:\/\/portfolio-khairan\.vercel\.app\/sitemap\.xml/i);

  const sitemap = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
  assert.match(sitemap, /<loc>https:\/\/portfolio-khairan\.vercel\.app\/<\/loc>/);

  const astroHtml = fs.readFileSync(path.join(ROOT, 'src/pages/index.astro'), 'utf8');
  assert.match(astroHtml, /rel="canonical"/);
  assert.match(astroHtml, /application\/ld\+json/);
  assert.match(astroHtml, /"alumniOf":\s*profile\.institution/);

  const distHtml = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  assert.match(distHtml, /"alumniOf":\s*"Politeknik Negeri Ujung Pandang"/);
});

test('Task 2 (Improvements): Case study highlights in portfolio-data and LightboxModal support', () => {
  const data = require(path.join(ROOT, 'src/data/portfolio-data.cjs'));
  const kpuItem = data.driveItems.find(i => i.id === '1IpyHiFwfvmVWj_9VbptkDOkDRi1BT3NH');
  assert.ok(kpuItem.caseStudy, 'Featured item must have caseStudy object');
  assert.ok(kpuItem.caseStudy.impact, 'Featured item must have impact detail');

  const modalHtml = fs.readFileSync(path.join(ROOT, 'src/components/LightboxModal.astro'), 'utf8');
  assert.match(modalHtml, /id="modalCaseStudyWrap"/);

  const js = fs.readFileSync(path.join(ROOT, 'src/scripts/app.js'), 'utf8');
  assert.match(js, /renderCaseStudy/);
});

test('Task 3 (Improvements): RUBOOTH engineering metrics strip and enhanced architecture spec', () => {
  const devSection = fs.readFileSync(path.join(ROOT, 'src/components/SoftwareDevSection.astro'), 'utf8');
  assert.match(devSection, /rubooth-metrics-strip/);
  assert.match(devSection, /PTP_OC_InitiateCapture/);

  const css = fs.readFileSync(path.join(ROOT, 'src/styles/main.css'), 'utf8');
  assert.match(css, /\.rubooth-metrics-strip/);
});

test('Task 4 (Improvements): Contact copy email helper and active WhatsApp prefill generator', () => {
  const contact = fs.readFileSync(path.join(ROOT, 'src/components/ContactFooter.astro'), 'utf8');
  assert.match(contact, /copyEmailToClipboard/);
  assert.match(contact, /id="copyEmailBtn"/);

  const js = fs.readFileSync(path.join(ROOT, 'src/scripts/app.js'), 'utf8');
  assert.match(js, /function copyEmailToClipboard/);
});

test('Hardening 1: single source layout', () => {
  assert.ok(!fs.existsSync(path.join(ROOT, 'index.html')), 'legacy index.html must be removed');
  assert.ok(!fs.existsSync(path.join(ROOT, 'scripts/sync-public.mjs')), 'sync-public.mjs must be removed');
  assert.ok(!fs.existsSync(path.join(ROOT, 'public/data')), 'public/data must be removed');
  assert.ok(!fs.existsSync(path.join(ROOT, 'public/scripts')), 'public/scripts must be removed');
  assert.ok(!fs.existsSync(path.join(ROOT, 'public/styles')), 'public/styles must be removed');

  assert.ok(fs.existsSync(path.join(ROOT, 'src/data/portfolio-data.cjs')), 'src/data/portfolio-data.cjs must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'src/scripts/app.js')), 'src/scripts/app.js must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'src/styles/main.css')), 'src/styles/main.css must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'public/assets/profile_khairan.jpg')), 'public/assets/profile_khairan.jpg must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'public/favicon.svg')), 'public/favicon.svg must exist');

  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.ok(!pkg.scripts.prebuild, 'prebuild sync-public script must be removed');

  const distHtml = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  assert.match(distHtml, /window\.PORTFOLIO_DATA\s*=/);

  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  assert.doesNotMatch(readme, /\uFFFD/, 'README.md must not contain broken encoding characters');
  assert.match(readme, /src\/data\/portfolio-data\.cjs/);
});

test('Hardening 2: unconfirmed claims never ship', () => {
  const data = require(path.join(ROOT, 'src/data/portfolio-data.cjs'));

  assert.ok(Array.isArray(data.devItems[0].metrics), 'devItems[0].metrics must be an array');
  assert.ok(data.devItems[0].metrics.length > 0, 'metrics array must not be empty');
  for (const m of data.devItems[0].metrics) {
    assert.equal(typeof m.confirmed, 'boolean', 'each metric must have a boolean confirmed property');
    assert.equal(m.confirmed, false, 'unconfirmed metrics must be flagged confirmed: false');
  }

  const caseStudies = data.driveItems.filter(i => i.caseStudy).map(i => i.caseStudy);
  assert.ok(caseStudies.length > 0, 'case studies must exist');
  for (const cs of caseStudies) {
    assert.equal(typeof cs.confirmed, 'boolean', 'each case study must have boolean confirmed property');
    assert.equal(cs.confirmed, false, 'unconfirmed case studies must be flagged confirmed: false');
  }

  const js = fs.readFileSync(path.join(ROOT, 'src/scripts/app.js'), 'utf8');
  assert.doesNotMatch(js, /defaultLinkedIn/);
  assert.doesNotMatch(js, /defaultWa/);

  const contactAstro = fs.readFileSync(path.join(ROOT, 'src/components/ContactFooter.astro'), 'utf8');
  assert.doesNotMatch(contactAstro, /linkedin\.com\/search/);
  assert.doesNotMatch(contactAstro, /wa\.me\/\?text/);
  assert.doesNotMatch(contactAstro, /mailto:\$\{profile\.email\}\?subject=Permintaan/);
});

test('Hardening 3: local thumbnails', async () => {
  const { buildThumbs, localThumb } = await import('../scripts/build-thumbs.mjs');
  
  assert.equal(localThumb('abc', 600), 'assets/works/abc-600.webp');
  assert.equal(localThumb('abc', 1200), 'assets/works/abc-1200.webp');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'build-thumbs-test-'));
  const fakePng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

  const fakeFetch = async (url) => {
    if (url.includes('id=ok')) {
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () => fakePng.buffer.slice(fakePng.byteOffset, fakePng.byteOffset + fakePng.byteLength)
      };
    }
    return { ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) };
  };

  const res = await buildThumbs(['ok', 'bad'], tmpDir, fakeFetch);
  assert.deepEqual(res.ok, ['ok']);
  assert.deepEqual(res.failed, ['bad']);
  assert.ok(fs.existsSync(path.join(tmpDir, 'ok-600.webp')));
  assert.ok(fs.existsSync(path.join(tmpDir, 'ok-1200.webp')));
  assert.ok(!fs.existsSync(path.join(tmpDir, 'bad-600.webp')));
  assert.ok(!fs.existsSync(path.join(tmpDir, 'bad-1200.webp')));
  fs.rmSync(tmpDir, { recursive: true, force: true });

  const data = require(path.join(ROOT, 'src/data/portfolio-data.cjs'));
  for (const item of data.driveItems) {
    const f600 = path.join(ROOT, 'public/assets/works', `${item.id}-600.webp`);
    const f1200 = path.join(ROOT, 'public/assets/works', `${item.id}-1200.webp`);
    assert.ok(fs.existsSync(f600), `Missing thumbnail: ${item.id}-600.webp`);
    assert.ok(fs.existsSync(f1200), `Missing thumbnail: ${item.id}-1200.webp`);
  }

  const distHtml = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  const imgTags = distHtml.match(/<img[^>]+>/g) || [];
  assert.ok(imgTags.length > 0, 'index.html must contain img tags');
  for (const tag of imgTags) {
    const srcMatch = tag.match(/\ssrc=["']([^"']+)["']/);
    assert.ok(srcMatch, `Img tag must have src: ${tag}`);
    assert.ok(
      !srcMatch[1].startsWith('https://drive.google.com/thumbnail'),
      `Initial image src must not point directly to drive.google.com/thumbnail: ${tag}`
    );
  }

  const graphicAstro = fs.readFileSync(path.join(ROOT, 'src/components/GraphicDesignSection.astro'), 'utf8');
  assert.match(graphicAstro, /onerror=/);
});










