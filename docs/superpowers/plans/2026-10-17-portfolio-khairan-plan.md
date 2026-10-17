# Portfolio Website Muhammad Al Khairan Asaad Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun website portofolio disiplin ganda (*Graphic Designer* & *Software Development*) untuk **Muhammad Al Khairan Asaad** (Lulusan Politeknik Negeri Ujung Pandang, IPK 3.74) dengan arsitektur data modular di `F:\portfolio-khairan` yang mudah diperbarui kapan saja.

**Architecture:** Aplikasi web statis modular tanpa kompilasi rumit (*zero-build*) yang memisahkan struktur antarmuka (`index.html`), sistem gaya *Swiss Architectural / Studio Editorial* (`styles/main.css`), data karya & profil (`data/portfolio-data.js`), dan logika interaktif (`scripts/app.js`). Verifikasi otomatis dijalankan melalui skrip pengujian Node.js (`tests/verify-portfolio.mjs`).

**Tech Stack:** HTML5 Semantik, CSS3 Custom Properties (Grid, Flexbox, Light/Dark Theme), Vanilla JavaScript (ES6+), Google Fonts (`Plus Jakarta Sans` & `JetBrains Mono`), Node.js (`node --test`) untuk verifikasi otomatis.

**Spec:** `f:\portfolio-khairan\docs\superpowers\specs\2026-10-17-portfolio-khairan-design.md`

## Global Constraints

- Nama lengkap pemilik wajib tertulis: `Muhammad Al Khairan Asaad`
- Almamater & IPK wajib tertulis: `Politeknik Negeri Ujung Pandang` dan `IPK 3.74 / 4.00`
- Dua bidang utama wajib menggunakan istilah: `Graphic Designer` dan `Software Development` (dilarang menggunakan istilah `Software Engineer` pada antarmuka)
- Tipografi wajib menggunakan `Plus Jakarta Sans` (`--font-sans`) dan `JetBrains Mono` (`--font-mono`); dilarang menggunakan font `Syne`
- Gambar pada `.stage-frame` maupun `.modal-media-wrap` dilarang memiliki pinggiran/latar hitam (`#000` / `#141413` / `#0d0d0c`); bingkai mengikuti proporsi asli gambar (`width: 100%; height: auto;` pada stage dan `width: fit-content;` pada modal)
- Bagian *Graphic Designer* memuat tepat **39 karya** dari Google Drive (25 Photoshop termasuk 20 karya KPU Kota Makassar, 4 Illustrator, 4 After Effects, 4 Premiere Pro, 2 Blender 3D); item *Desain UI/UX* (`1bdApHoMt2PzXcptWipbhhpioNl59ribX`) dilarang dimasukkan
- Bagian *Software Development* memuat **RUBOOTH - Smart Android Photobooth Kiosk System** sebagai 1 entri proyek utuh dengan gambar `assets/rubooth_banner.jpg` dan tautan langsung ke `https://github.com/alkhairan18/rubooth`

## Review Focus

1. **Karakter kutip tunggal (`'`) pada judul atau deskripsi karya baru di `data/portfolio-data.js`:** Jika pemilik menambahkan karya baru yang judul/deskripsinya mengandung tanda kutip tunggal atau karakter khusus HTML, fungsi render tidak boleh rusak karena *inline string concatenation* (`onclick="..."`); oleh karena itu pemanggilan event wajib menggunakan indeks/atribut `data-index` atau *event delegation*.
2. **Navigasi melingkar (*wrap-around*) pada Modal Lightbox saat berada di indeks pertama (`0`) atau terakhir (`length - 1`):** Mengklik `← Sebelumnya` pada karya pertama harus berpindah mulus ke karya terakhir dalam daftar filter aktif, dan sebaliknya.
3. **Kegagalan akses `localStorage` pada mode penjelajahan privat ketat:** Pengubah *Mode Terang / Gelap* tidak boleh melempar *uncaught exception* apabila `localStorage.getItem` / `setItem` diblokir browser.
4. **Klik tombol `GitHub ↗` di dalam baris proyek *Software Development*:** Mengklik tombol tautan `GitHub ↗` harus membuka tab baru ke `https://github.com/alkhairan18/rubooth` tanpa memicu pembukaan modal secara tidak sengaja (`event.stopPropagation()`).
5. **Pembersihan `iframe` video Google Drive saat modal ditutup:** Menutup modal ketika video sedang diputar wajib mengosongkan `innerHTML` wadah media agar suara video tidak terus berputar di latar belakang.

---

### Task 1: Aset Lokal & Modul Data Portofolio (`assets/` & `data/portfolio-data.js`)

**Files:**
- Create: `f:\portfolio-khairan\assets\profile_khairan.jpg`
- Create: `f:\portfolio-khairan\assets\rubooth_banner.jpg`
- Create: `f:\portfolio-khairan\data\portfolio-data.js`
- Test: `f:\portfolio-khairan\tests\verify-portfolio.mjs`

**Interfaces:**
- Produces: `window.PORTFOLIO_DATA` (dan `module.exports = PORTFOLIO_DATA` untuk pengujian Node.js) dengan struktur:
  - `profile`: `{ name, kicker, institution, gpa, roleSummary, avatarUrl, driveFolderUrl, githubProfileUrl }`
  - `personas`: `{ hybrid: string, designer: string, developer: string }`
  - `driveFilters`: `Array<{ key: string, label: string }>`
  - `driveItems`: `Array<{ id: string, cat: 'ps'|'ai'|'ae'|'pr'|'blender', subcat: string, isNew: boolean, tool: string, type: 'image'|'video', title: string, file: string, desc: string }>` (39 item)
  - `devFilters`: `Array<{ key: string, label: string }>`
  - `devItems`: `Array<{ id: string, cat: 'app'|'web', badge: string, title: string, sub: string, img: string, repoUrl: string, repoLabel: string, desc: string, tags: string[], type: 'image' }>` (1 item: RUBOOTH)

- [ ] **Step 1: Tulis pengujian verifikasi data & aset di `f:\portfolio-khairan\tests\verify-portfolio.mjs`**

```javascript
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
```

- [ ] **Step 2: Jalankan pengujian untuk memastikan gagal sebelum implementasi**

Run: `node --test "f:\portfolio-khairan\tests\verify-portfolio.mjs"`
Expected: FAIL (`profile_khairan.jpg must exist` / `Cannot find module`)

- [ ] **Step 3: Salin kedua aset gambar dan buat `f:\portfolio-khairan\data\portfolio-data.js`**

Salin `profile_khairan.jpg` dan `rubooth_banner.jpg` dari `C:\Users\ACER\.gemini\antigravity\brain\3b1d6eed-2cc7-4df4-9c68-571310e5c82b\scratch\brainstorm\content\` ke `f:\portfolio-khairan\assets\`, lalu tulis `f:\portfolio-khairan\data\portfolio-data.js` dengan seluruh 39 karya Google Drive dan proyek `RUBOOTH` beserta komentar panduan berbahasa Indonesia di bagian atas file agar pemilik mudah menambah karya di masa depan.

- [ ] **Step 4: Jalankan pengujian untuk memastikan Task 1 lulus**

Run: `node --test "f:\portfolio-khairan\tests\verify-portfolio.mjs"`
Expected: PASS

---

### Task 2: Sistem Gaya Swiss Architectural & Anti-Black-Bars (`styles/main.css`)

**Files:**
- Create: `f:\portfolio-khairan\styles\main.css`
- Modify: `f:\portfolio-khairan\tests\verify-portfolio.mjs`

**Interfaces:**
- Produces: Kelas CSS untuk `.shell`, `.nav`, `.hero`, `.tilt-card` (`aspect-ratio: 3 / 4`), `.discipline-section`, `.stage-frame` (`background: transparent;` dan `.stage-frame img { display: block; width: 100%; height: auto; }`), `.work-scroll-area`, `.work-row`, `.modal-backdrop`, `.modal-media-wrap` (`width: fit-content; background: transparent;`), serta tema `[data-theme="dark"]`.

- [ ] **Step 1: Tambahkan pengujian verifikasi CSS di `f:\portfolio-khairan\tests\verify-portfolio.mjs`**

```javascript
test('Task 2: CSS typography, theme variables, and zero-black-bars rules', () => {
  const css = fs.readFileSync(path.join(ROOT, 'styles/main.css'), 'utf8');
  assert.match(css, /Plus Jakarta Sans/);
  assert.match(css, /JetBrains Mono/);
  assert.doesNotMatch(css, /Syne/i);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\.stage-frame\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.modal-media-wrap\s*\{[^}]*width:\s*fit-content/s);
});
```

- [ ] **Step 2: Jalankan pengujian untuk memastikan gagal sebelum `styles/main.css` dibuat**

Run: `node --test "f:\portfolio-khairan\tests\verify-portfolio.mjs"`
Expected: FAIL (`ENOENT: no such file or directory, open '.../styles/main.css'`)

- [ ] **Step 3: Buat `f:\portfolio-khairan\styles\main.css`**

Implementasikan seluruh variabel CSS Mode Terang (`#F5F4F0`) dan Mode Gelap (`#111110`), tipografi `Plus Jakarta Sans` + `JetBrains Mono`, tata letak Hero dengan foto profil `3:4`, tata letak Atas-Bawah untuk kedua disiplin, bingkai gambar tanpa latar hitam di pinggir, serta responsivitas layar mobile/tablet.

- [ ] **Step 4: Jalankan pengujian untuk memastikan Task 2 lulus**

Run: `node --test "f:\portfolio-khairan\tests\verify-portfolio.mjs"`
Expected: PASS

---

### Task 3: Dokumen HTML5, Logika Interaktif, & Dokumentasi Pemeliharaan (`index.html`, `scripts/app.js`, `README.md`)

**Files:**
- Create: `f:\portfolio-khairan\index.html`
- Create: `f:\portfolio-khairan\scripts\app.js`
- Create: `f:\portfolio-khairan\README.md`
- Modify: `f:\portfolio-khairan\tests\verify-portfolio.mjs`

**Interfaces:**
- Consumes: `window.PORTFOLIO_DATA` dari `data/portfolio-data.js` dan kelas CSS dari `styles/main.css`
- Produces: Fungsi interaktif di `scripts/app.js`:
  - `initPortfolio()`
  - `setPersona(personaKey, btnEl)`
  - `filterDriveWorks(filterKey, btnEl)`
  - `filterDevWorks(filterKey, btnEl)`
  - `previewDesignStageByIndex(idx)`
  - `previewDevStageByIndex(idx)`
  - `openDriveModalByIndex(idx)`
  - `openDevModalByIndex(idx)`
  - `stepModal(delta)` (dengan modulo wrap-around `(currentModalIdx + delta + len) % len`)
  - `closeModal()` (mengosongkan `#modalMediaContainer` agar iframe video berhenti)
  - `toggleTheme()` (dengan `try/catch` saat mengakses `localStorage`)

- [ ] **Step 1: Tambahkan pengujian verifikasi HTML, JS, dan Review Focus di `f:\portfolio-khairan\tests\verify-portfolio.mjs`**

```javascript
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
```

- [ ] **Step 2: Jalankan pengujian untuk memastikan gagal sebelum implementasi**

Run: `node --test "f:\portfolio-khairan\tests\verify-portfolio.mjs"`
Expected: FAIL (`ENOENT: no such file or directory, open '.../index.html'`)

- [ ] **Step 3: Buat `f:\portfolio-khairan\index.html`, `f:\portfolio-khairan\scripts\app.js`, dan `f:\portfolio-khairan\README.md`**

- Pada `index.html`: Sediakan struktur lengkap tanpa bar *companion* prototipe, melainkan dengan tombol `Mode Terang / Gelap` langsung di bar navigasi atas, bagian Hero Perkenalan, bagian Atas `Graphic Designer (39 Karya)`, bagian Bawah `Software Development`, serta bagian Footer kontak/tautan profesional.
- Pada `scripts/app.js`: Gunakan *index-based event handlers* (`previewDesignStageByIndex(idx)` dan `openDriveModalByIndex(idx)`) agar judul/deskripsi yang memiliki tanda kutip tidak pernah merusak HTML, simpan tema di `localStorage` dengan `try/catch`, dan hentikan pemutaran video saat modal ditutup.
- Pada `README.md`: Tuliskan panduan singkat berbahasa Indonesia tentang cara membuka website dan cara menambah/mengubah karya di `data/portfolio-data.js`.

- [ ] **Step 4: Jalankan seluruh pengujian untuk memastikan semua lulus**

Run: `node --test "f:\portfolio-khairan\tests\verify-portfolio.mjs"`
Expected: PASS (3/3 tests passing)
