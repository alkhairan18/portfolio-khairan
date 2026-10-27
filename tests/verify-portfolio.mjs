import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = 'f:/portfolio-khairan';

test('Task 1: Local assets and PORTFOLIO_DATA structure', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'assets/profile_khairan.jpg')), 'profile_khairan.jpg must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'assets/rubooth_banner.jpg')), 'rubooth_banner.jpg must exist');

  const data = require(path.join(ROOT, 'data/portfolio-data.js'));
  assert.equal(data.profile.name, 'Muhammad Al Khairan Asaad');
  assert.equal(data.profile.institution, 'Politeknik Negeri Ujung Pandang');
  assert.equal(data.profile.gpa, 'IPK 3.74 / 4.00');
  assert.equal(data.driveItems.length, 39, 'Must have exactly 39 Google Drive works');
  assert.equal(data.driveItems.some(i => i.id === '1bdApHoMt2PzXcptWipbhhpioNl59ribX'), false, 'UI/UX item must not be present');
  assert.equal(data.devItems.length, 1, 'Must have 1 unified RUBOOTH project');
  assert.equal(data.devItems[0].repoUrl, 'https://github.com/alkhairan18/rubooth');
  assert.equal(data.devItems[0].img, 'assets/rubooth_banner.jpg');
});

test('Task 2: CSS typography, theme variables, and zero-black-bars rules', () => {
  const css = fs.readFileSync(path.join(ROOT, 'styles/main.css'), 'utf8');
  assert.match(css, /Plus Jakarta Sans/);
  assert.match(css, /JetBrains Mono/);
  assert.doesNotMatch(css, /Syne/i);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\.stage-frame\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.modal-media-wrap\s*\{[^}]*width:\s*fit-content/s);
});

test('Task 3: HTML structure, Software Development terminology, and interactive JS safeguards', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'scripts/app.js'), 'utf8');
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');

  assert.match(html, /Muhammad Al Khairan Asaad/);
  assert.match(html, /Graphic Designer/);
  assert.match(html, /Software Development/);
  assert.doesNotMatch(html, /Software Engineer/i);
  assert.match(html, /data\/portfolio-data\.js/);
  assert.match(html, /scripts\/app\.js/);

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

  assert.match(readme, /portfolio-data\.js/);
});

test('Final Review Fixes: closeModal resets currentModalIdx and hydrateProfile syncs PORTFOLIO_DATA.profile on init', () => {
  const js = fs.readFileSync(path.join(ROOT, 'scripts/app.js'), 'utf8');
  assert.match(js, /function closeModal\(\)\s*\{[^}]*currentModalIdx\s*=\s*-1;/s);
  assert.match(js, /function hydrateProfile\(\)/);
  assert.match(js, /hydrateProfile\(\);/);
});

test('Audit Improvements: Favicon, Open Graph SEO, Contact/CV section, Accessibility, and Image Optimization', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'favicon.svg')), 'favicon.svg must exist');
  assert.ok(fs.existsSync(path.join(ROOT, 'favicon.ico')), 'favicon.ico must exist');

  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'styles/main.css'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'scripts/app.js'), 'utf8');
  const data = require(path.join(ROOT, 'data/portfolio-data.js'));

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

