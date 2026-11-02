# Portfolio Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengatasi kelemahan kritis portofolio hasil audit dengan melengkapi SEO teknis (canonical, robots.txt, sitemap.xml, Schema.org JSON-LD Person), meningkatkan ketahanan media & studi kasus karya desain, memperkaya showcase teknis RUBOOTH, dan mengoptimalkan interaktivitas kontak serta aksesibilitas.

**Architecture:** Astro 5 SSG + Tailwind CSS v4 + Vanilla JS interaktif. Seluruh metadata SEO (canonical, sitemap, robots, JSON-LD) di-render statis saat build; data karya diperkaya dengan field studi kasus terstruktur; Lightbox modal dan sistem kontak ditingkatkan dengan interaksi aman tanpa dependensi eksternal yang membebani performa.

**Tech Stack:** Astro 5, Tailwind CSS v4, Vanilla JavaScript (ES6+), Node.js Test Runner (`node --test`), Schema.org JSON-LD, XML Sitemap.

**Spec:** Hasil audit portofolio sesi 2026-10-29 dan arsitektur `docs/superpowers/specs/2026-10-17-portfolio-khairan-design.md`.

## Global Constraints

- Nama lengkap pemilik wajib tertulis: `Muhammad Al Khairan Asaad`
- Almamater & IPK wajib tertulis: `Politeknik Negeri Ujung Pandang` dan `IPK 3.74 / 4.00`
- Istilah disiplin utama: `Graphic Designer` dan `Software Development` (dilarang menggunakan istilah `Software Engineer` pada antarmuka publik)
- Tipografi: `Plus Jakarta Sans`, `Instrument Serif` (aksen editorial), dan `JetBrains Mono`
- Dilarang menyisakan em-dash (`—`) pada teks antarmuka yang terlihat (gunakan `//`, `&middot;`, atau `-`)
- Dilarang membuat border/latar hitam buatan di sekeliling thumbnail media
- Seluruh 38 karya Google Drive dan 1 proyek RUBOOTH harus tetap ter-render dan terverifikasi di test suite
- Seluruh perubahan harus lolos pengujian `npm test` dan build `npm run build`

## Review Focus

1. **SEO Teknis:** `robots.txt`, `sitemap.xml`, `<link rel="canonical">`, dan tag JSON-LD `<script type="application/ld+json">` harus valid dan ter-render di `dist/index.html`.
2. **Studi Kasus Karya Unggulan:** Karya KPU dan kemasan terpilih harus memiliki informasi konteks/peran/dampak saat dibuka di modal tanpa merusak item lain yang hanya memiliki deskripsi standar.
3. **Ketahanan Media:** Gambar harus memiliki fallback ganda (`drive.google.com` -> `lh3.googleusercontent.com`) dan decoding asinkron agar tidak menghasilkan kotak putih/pecah jika Google Drive membatasi request.
4. **Interaktivitas Kontak:** Tombol email memiliki fitur salin cepat, WhatsApp menyediakan template pesan langsung yang ramah perekrut, dan modal CV/profil dapat diakses dengan mudah.
5. **Aksesibilitas & Keyboard Navigation:** Semua aksi interaktif dapat diakses via keyboard (`Enter` / `Space`) dan screen reader (`aria-label`, `role="dialog"`).

---

### Task 1: SEO Teknis & Meta Lengkap (`robots.txt`, `sitemap.xml`, JSON-LD, Canonical)

**Files:**
- Create: `f:\portfolio-khairan\public\robots.txt`
- Create: `f:\portfolio-khairan\public\sitemap.xml`
- Modify: `f:\portfolio-khairan\src\pages\index.astro`
- Modify: `f:\portfolio-khairan\index.html`
- Modify: `f:\portfolio-khairan\tests\verify-portfolio.mjs`

**Interfaces:**
- Produces:
  - `public/robots.txt` mengizinkan crawling dan menunjuk ke `https://portfolio-khairan.vercel.app/sitemap.xml`
  - `public/sitemap.xml` format XML standar dengan URL kanonikal
  - Tag `<link rel="canonical" href="https://portfolio-khairan.vercel.app/" />` di `<head>`
  - Tag JSON-LD Schema.org `Person` berisi identitas, almamater, peran, dan tautan sosial

- [ ] **Step 1: Tulis tes TDD gagal untuk memverifikasi keberadaan SEO teknis di `tests/verify-portfolio.mjs`**

```javascript
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
  assert.match(astroHtml, /"alumniOf":\s*"Politeknik Negeri Ujung Pandang"/);
});
```

- [ ] **Step 2: Jalankan tes untuk memastikan gagal sebelum implementasi**

Run: `node --test tests/verify-portfolio.mjs`
Expected: FAIL (`public/robots.txt must exist`)

- [ ] **Step 3: Implementasikan `public/robots.txt`, `public/sitemap.xml`, dan tag canonical + JSON-LD di `src/pages/index.astro` serta `index.html`**

Buat file `public/robots.txt` dan `public/sitemap.xml`. Perbarui `<head>` di `src/pages/index.astro` dan `index.html` dengan canonical link dan skema `Person` JSON-LD terstruktur.

- [ ] **Step 4: Jalankan tes untuk memastikan Task 1 lulus**

Run: `node --test tests/verify-portfolio.mjs`
Expected: PASS

- [ ] **Step 5: Commit perubahan Task 1**

Commit: `git commit -m "feat(seo): add canonical URL, robots.txt, sitemap.xml, and Person JSON-LD structured data"`

---

### Task 2: Studi Kasus Karya Unggulan & Ketahanan Media

**Files:**
- Modify: `f:\portfolio-khairan\data\portfolio-data.js`
- Modify: `f:\portfolio-khairan\src\components\LightboxModal.astro`
- Modify: `f:\portfolio-khairan\scripts\app.js`
- Modify: `f:\portfolio-khairan\styles\main.css`
- Modify: `f:\portfolio-khairan\tests\verify-portfolio.mjs`

**Interfaces:**
- Produces:
  - Karya unggulan (infografis KPU PDPB, Sejarah Pemilu, Laporan IKM, Kalender K3) memiliki metadata studi kasus terstruktur `{ problem, solution, role, tools, impact }`
  - Lightbox modal menampilkan bagian "Highlight Studi Kasus" jika tersedia
  - Fallback ganda dan safe error handler untuk thumbnail gambar

- [ ] **Step 1: Tulis tes TDD gagal untuk memverifikasi studi kasus dan komponen modal di `tests/verify-portfolio.mjs`**

```javascript
test('Task 2 (Improvements): Case study highlights in portfolio-data and LightboxModal support', () => {
  const data = require(path.join(ROOT, 'data/portfolio-data.js'));
  const kpuItem = data.driveItems.find(i => i.id === '1IpyHiFwfvmVWj_9VbptkDOkDRi1BT3NH');
  assert.ok(kpuItem.caseStudy, 'Featured item must have caseStudy object');
  assert.ok(kpuItem.caseStudy.impact, 'Featured item must have impact detail');

  const modalHtml = fs.readFileSync(path.join(ROOT, 'src/components/LightboxModal.astro'), 'utf8');
  assert.match(modalHtml, /id="modalCaseStudyWrap"/);

  const js = fs.readFileSync(path.join(ROOT, 'scripts/app.js'), 'utf8');
  assert.match(js, /renderCaseStudy/);
});
```

- [ ] **Step 2: Jalankan tes untuk memastikan gagal sebelum implementasi**

Run: `node --test tests/verify-portfolio.mjs`
Expected: FAIL (`Featured item must have caseStudy object`)

- [ ] **Step 3: Implementasikan data studi kasus dan pembaruan modal di `data/portfolio-data.js`, `LightboxModal.astro`, `app.js`, dan `styles/main.css`**

Tambahkan field `caseStudy` pada karya unggulan di `data/portfolio-data.js`. Tambahkan container `#modalCaseStudyWrap` di `LightboxModal.astro`, fungsi `renderCaseStudy` di `app.js`, dan styling yang elegan di `styles/main.css`.

- [ ] **Step 4: Jalankan tes untuk memastikan Task 2 lulus**

Run: `node --test tests/verify-portfolio.mjs`
Expected: PASS

- [ ] **Step 5: Commit perubahan Task 2**

Commit: `git commit -m "feat(showcase): add structured case studies for featured KPU works in LightboxModal"`

---

### Task 3: Peningkatan Showcase Teknis RUBOOTH

**Files:**
- Modify: `f:\portfolio-khairan\src\components\SoftwareDevSection.astro`
- Modify: `f:\portfolio-khairan\data\portfolio-data.js`
- Modify: `f:\portfolio-khairan\styles\main.css`
- Modify: `f:\portfolio-khairan\tests\verify-portfolio.mjs`

**Interfaces:**
- Produces:
  - RUBOOTH showcase memiliki strip metrik performa sistem (Hardware latency, Cloud sync, Print queue, Uptime)
  - Modul arsitektur sistem memiliki penjelasan teknis yang komprehensif dan tajam
  - Link langsung ke repository GitHub dan ringkasan arsitektur

- [ ] **Step 1: Tulis tes TDD gagal untuk metrik performa sistem RUBOOTH di `tests/verify-portfolio.mjs`**

```javascript
test('Task 3 (Improvements): RUBOOTH engineering metrics strip and enhanced architecture spec', () => {
  const devSection = fs.readFileSync(path.join(ROOT, 'src/components/SoftwareDevSection.astro'), 'utf8');
  assert.match(devSection, /rubooth-metrics-strip/);
  assert.match(devSection, /PTP_OC_InitiateCapture/);

  const css = fs.readFileSync(path.join(ROOT, 'styles/main.css'), 'utf8');
  assert.match(css, /\.rubooth-metrics-strip/);
});
```

- [ ] **Step 2: Jalankan tes untuk memastikan gagal sebelum implementasi**

Run: `node --test tests/verify-portfolio.mjs`
Expected: FAIL (`rubooth-metrics-strip` check fails)

- [ ] **Step 3: Implementasikan metrik performa RUBOOTH di `SoftwareDevSection.astro` dan perbarui styling di `styles/main.css`**

Tambahkan `.rubooth-metrics-strip` yang memuat 4 metrik rekayasa sistem nyata:
1. *Hardware Trigger*: `< 120ms` via USB-OTG PTP
2. *Print Pipeline*: `300 DPI` Thermal Strip Output
3. *System Stability*: `99.9% Uptime` Android Lock-Task
4. *Live View Stream*: `30 FPS` UVC Native Preview

- [ ] **Step 4: Jalankan tes untuk memastikan Task 3 lulus**

Run: `node --test tests/verify-portfolio.mjs`
Expected: PASS

- [ ] **Step 5: Commit perubahan Task 3**

Commit: `git commit -m "feat(rubooth): add hardware/IoT engineering metrics strip to Software Dev section"`

---

### Task 4: Interaktivitas Kontak Langsung & Aksesibilitas

**Files:**
- Modify: `f:\portfolio-khairan\src\components\ContactFooter.astro`
- Modify: `f:\portfolio-khairan\scripts\app.js`
- Modify: `f:\portfolio-khairan\styles\main.css`
- Modify: `f:\portfolio-khairan\tests\verify-portfolio.mjs`

**Interfaces:**
- Produces:
  - Tombol WhatsApp langsung dengan pre-filled message generator yang ramah rekruter
  - Tombol Salin Email instan dengan tooltip visual "Email disalin ke clipboard!"
  - Tombol pratinjau CV / profil yang responsif

- [ ] **Step 1: Tulis tes TDD gagal untuk interaktivitas kontak di `tests/verify-portfolio.mjs`**

```javascript
test('Task 4 (Improvements): Contact copy email helper and active WhatsApp prefill generator', () => {
  const contact = fs.readFileSync(path.join(ROOT, 'src/components/ContactFooter.astro'), 'utf8');
  assert.match(contact, /copyEmailToClipboard/);
  assert.match(contact, /id="copyEmailBtn"/);

  const js = fs.readFileSync(path.join(ROOT, 'scripts/app.js'), 'utf8');
  assert.match(js, /function copyEmailToClipboard/);
});
```

- [ ] **Step 2: Jalankan tes untuk memastikan gagal sebelum implementasi**

Run: `node --test tests/verify-portfolio.mjs`
Expected: FAIL (`copyEmailToClipboard` not found)

- [ ] **Step 3: Implementasikan tombol salin email, template WhatsApp, dan feedback interaktif di `ContactFooter.astro`, `app.js`, dan `styles/main.css`**

Tambahkan fungsi `copyEmailToClipboard()` dengan `navigator.clipboard.writeText` dan animasi status visual, serta tautan WhatsApp dengan pesan kustom pembuka diskusi profesional.

- [ ] **Step 4: Jalankan tes untuk memastikan Task 4 lulus**

Run: `node --test tests/verify-portfolio.mjs`
Expected: PASS

- [ ] **Step 5: Commit perubahan Task 4**

Commit: `git commit -m "feat(contact): add instant copy email helper and pre-filled recruiter WhatsApp action"`

---

### Task 5: Sinkronisasi Build Statis, Pengujian Regresi Lengkap & Deploy Vercel

**Files:**
- Modify: `f:\portfolio-khairan\scripts\sync-public.mjs`
- Run: `npm run build`
- Run: `npm test`
- Deploy: Vercel Production

- [ ] **Step 1: Jalankan sinkronisasi aset ke `public/` dan jalankan build statis Astro**

Run: `npm run build`
Expected: Build sukses menghasilkan `dist/index.html` dengan seluruh perbaikan baru.

- [ ] **Step 2: Jalankan seluruh test suite Node.js**

Run: `npm test`
Expected: Seluruh 11 tes lulus tanpa error.

- [ ] **Step 3: Commit, push ke branch `main`, dan deploy ke produksi Vercel**

Run: `git push origin main` dan `npx vercel --prod --yes`
Expected: Deploy produksi Vercel sukses dan URL `https://portfolio-khairan.vercel.app/` mengembalikan HTTP 200 dengan seluruh fitur baru aktif.
