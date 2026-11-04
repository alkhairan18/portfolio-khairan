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
  assert.ok(data.devItems.length >= 2, 'Must have at least 2 software projects (RUBOOTH and personal-finance)');
  assert.equal(data.devItems[0].repoUrl, 'https://github.com/alkhairan18/rubooth');
  assert.equal(data.devItems[0].img, 'assets/rubooth_banner.jpg');
  assert.equal(data.devItems[1].repoUrl, 'https://github.com/alkhairan18/personal-finance');
  assert.equal(data.devItems[1].img, 'assets/personal_finance_banner.svg');
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
  assert.match(html, /tabindex="0"/);

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

  for (const devItem of data.devItems) {
    assert.ok(Array.isArray(devItem.metrics), 'devItem.metrics must be an array');
    assert.ok(devItem.metrics.length > 0, 'metrics array must not be empty');
    for (const m of devItem.metrics) {
      assert.equal(typeof m.confirmed, 'boolean', 'each metric must have a boolean confirmed property');
      assert.equal(m.confirmed, false, 'unconfirmed metrics must be flagged confirmed: false');
    }
  }

  const caseStudies = data.driveItems.filter(i => i.caseStudy).map(i => i.caseStudy);
  assert.ok(caseStudies.length > 0, 'case studies must exist');
  for (const cs of caseStudies) {
    assert.equal(typeof cs.confirmed, 'boolean', 'each case study must have boolean confirmed property');
  }
  const confirmedCaseStudies = caseStudies.filter(cs => cs.confirmed === true);
  assert.ok(confirmedCaseStudies.length >= 3, 'Option A: confirmed KPU case studies must have confirmed: true');

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

function relativeLuminance(hex) {
  const clean = hex.trim().replace(/^#/, '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function extractCssTokens(css, selector) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const blockRegex = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`, 'm');
  const match = clean.match(blockRegex);
  if (!match) return {};
  const tokens = {};
  const lines = match[1].split(';');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      if (key && val) {
        tokens[key] = val;
      }
    }
  }
  return tokens;
}

test('Hardening 4: accessibility, semantics, and contrast', async () => {
  const distHtml = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'src/styles/main.css'), 'utf8');

  // (a) No inline event attributes, no role="button", exactly one <main>
  assert.doesNotMatch(distHtml, /\sonclick=/);
  assert.doesNotMatch(distHtml, /\sonkeydown=/);
  assert.doesNotMatch(distHtml, /\sonmouseenter=/);
  assert.doesNotMatch(distHtml, /\sonfocus=/);
  assert.doesNotMatch(distHtml, /\srole="button"/);
  const mainMatches = distHtml.match(/<main[\s>]/g) || [];
  assert.equal(mainMatches.length, 1, 'dist/index.html must contain exactly one <main> landmark');

  // (b) WCAG AA contrast ratio >= 4.5
  const light = extractCssTokens(css, ':root');
  const dark = extractCssTokens(css, '[data-theme="dark"]');

  assert.ok(light['--accent-ink'], 'Light mode must define --accent-ink');
  assert.ok(light['--on-accent'], 'Light mode must define --on-accent');
  assert.ok(dark['--accent-ink'], 'Dark mode must define --accent-ink');
  assert.ok(dark['--on-accent'], 'Dark mode must define --on-accent');

  assert.ok(contrastRatio(light['--accent-ink'], light['--bg']) >= 4.5, 'Light accent-ink on bg must be >= 4.5');
  assert.ok(contrastRatio(light['--accent-ink'], light['--bg-card']) >= 4.5, 'Light accent-ink on bg-card must be >= 4.5');
  assert.ok(contrastRatio(light['--on-accent'], light['--accent']) >= 4.5, 'Light on-accent on accent must be >= 4.5');
  assert.ok(contrastRatio(light['--text-muted'], light['--bg']) >= 4.5, 'Light text-muted on bg must be >= 4.5');

  assert.ok(contrastRatio(dark['--accent-ink'], dark['--bg']) >= 4.5, 'Dark accent-ink on bg must be >= 4.5');
  assert.ok(contrastRatio(dark['--accent-ink'], dark['--bg-card']) >= 4.5, 'Dark accent-ink on bg-card must be >= 4.5');
  assert.ok(contrastRatio(dark['--on-accent'], dark['--accent']) >= 4.5, 'Dark on-accent on accent must be >= 4.5');
  assert.ok(contrastRatio(dark['--text-muted'], dark['--bg']) >= 4.5, 'Dark text-muted on bg must be >= 4.5');

  // (c) jsdom behavior: focus management, modal trigger, focus trap, Escape return
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM(distHtml, {
    runScripts: 'dangerously',
    url: 'https://portfolio-khairan.vercel.app/'
  });
  const appJsCode = fs.readFileSync(path.join(ROOT, 'src/scripts/app.js'), 'utf8');
  dom.window.eval(appJsCode);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

  const firstWorkBtn = dom.window.document.querySelector('.work-open');
  assert.ok(firstWorkBtn, '.work-open button must exist');
  firstWorkBtn.focus();
  firstWorkBtn.click();

  const modal = dom.window.document.getElementById('projectModal');
  assert.ok(modal.classList.contains('open'), 'Modal must open on click');
  assert.ok(modal.contains(dom.window.document.activeElement), 'Active element must be inside modal on open');

  // Escape key closes modal and returns focus to trigger
  dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.ok(!modal.classList.contains('open'), 'Modal must close on Escape');
  assert.equal(dom.window.document.activeElement, firstWorkBtn, 'Focus must return to triggering .work-open on close');

  // (d) XSS immunity on quotes and HTML tags
  const testItem = {
    id: 'test_xss_id',
    cat: 'ps',
    tool: 'Photoshop',
    title: 'O\'Reilly "X" <b>&',
    desc: 'Test description',
    file: 'test.png',
    type: 'image'
  };
  dom.window.PORTFOLIO_DATA.driveItems = [testItem];
  dom.window.renderDriveList('all');
  const renderedRow = dom.window.document.querySelector('.work-row');
  assert.ok(renderedRow, 'Rendered row must exist');
  assert.equal(renderedRow.querySelectorAll('b').length, 0, 'No <b> tags should be created by title');
  const renderedBtn = renderedRow.querySelector('.work-open');
  renderedBtn.click();
  const modalTitle = dom.window.document.getElementById('modalTitle');
  assert.equal(modalTitle.textContent, 'O\'Reilly "X" <b>&');
  dom.window.closeModal();
});

test('Hardening 5: social, 404, analytics', async () => {
  const { buildOg } = await import('../scripts/build-og.mjs');
  const tmpOg = path.join(os.tmpdir(), `test-og-${Date.now()}.png`);
  const meta = await buildOg(tmpOg);
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 630);
  assert.ok(fs.existsSync(tmpOg));
  fs.rmSync(tmpOg, { force: true });

  const sharp = (await import('sharp')).default;
  const ogPath = path.join(ROOT, 'public/og-image.png');
  assert.ok(fs.existsSync(ogPath), 'public/og-image.png must exist');
  const ogMeta = await sharp(ogPath).metadata();
  assert.equal(ogMeta.width, 1200);
  assert.equal(ogMeta.height, 630);
  assert.equal(ogMeta.format, 'png');

  const indexHtml = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8');
  assert.match(indexHtml, /property="og:image"\s+content="https:\/\/portfolio-khairan\.vercel\.app\/og-image\.png"/);
  assert.match(indexHtml, /property="og:image:width"\s+content="1200"/);
  assert.match(indexHtml, /property="og:image:height"\s+content="630"/);
  assert.match(indexHtml, /name="twitter:image"\s+content="https:\/\/portfolio-khairan\.vercel\.app\/og-image\.png"/);
  assert.match(indexHtml, /\/_vercel\/insights\/script\.js/);

  const notFoundHtml = fs.readFileSync(path.join(ROOT, 'dist/404.html'), 'utf8');
  assert.match(notFoundHtml, /href="\/"/);
  assert.match(notFoundHtml, /\/_vercel\/insights\/script\.js/);
});










