# Portfolio Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menutup kekurangan portofolio yang tersisa setelah rencana 2026-11-02-portfolio-improvements: klaim yang belum terverifikasi, ketergantungan gambar pada Google Drive, aksesibilitas/kontras, pratinjau sosial, halaman 404, analitik, dan duplikasi kode warisan.

**Architecture:** Astro 5 SSG tetap. Satu sumber kebenaran: `src/data`, `src/scripts`, `src/styles` dibundel Astro; `public/` hanya berisi aset statis. Gambar karya disajikan dari WebP lokal hasil skrip `scripts/build-thumbs.mjs`, dengan Google Drive hanya sebagai fallback. Interaksi memakai event delegation (`data-action`), bukan atribut `onclick` inline.

**Tech Stack:** Astro 5, Tailwind v4, Vanilla JS, `sharp` (devDependency, generator gambar), `jsdom` (devDependency, tes perilaku), Node test runner (`node --test`), Vercel Web Analytics.

**Spec:** Audit situs live 2026-11-02 (bagian "Temuan Audit" di bawah) dan `docs/superpowers/specs/2026-10-17-portfolio-khairan-design.md`. Tidak ada spec baru; keputusan yang diambil eksekutor bersifat sementara.

## Temuan Audit (dasar rencana ini)

| # | Temuan terukur pada situs live | Task |
|---|---|---|
| A | Angka metrik RUBOOTH (`< 120ms`, `300 DPI`, `30 FPS`, `99.9%`) dan teks "Dampak" pada 3 studi kasus ditulis tanpa data dari pemilik; tombol LinkedIn/WhatsApp/CV memakai tautan pengganti (pencarian LinkedIn, `wa.me/?text=` tanpa nomor, mailto) | 2 |
| B | 39 `<img>` bersumber `drive.google.com/thumbnail` (rawan rate limit/blokir) | 3 |
| C | 74 atribut `onclick`, 39 `div role="button"`, 39 `onmouseenter` (hover-only), tidak ada `<main>` | 4 |
| D | Kontras: teks putih di atas tombol vermilion gelap `#FF4D1C` = 3.3:1; aksen `#E03E10` di atas `#F4EFE6` = 3.8:1 (batas WCAG AA teks kecil 4.5:1) | 4 |
| E | `og:image` memakai foto profil persegi, bukan gambar 1200×630 | 5 |
| F | Tidak ada `404.html`, tidak ada analitik | 5 |
| G | `index.html` warisan + `public/{data,scripts,styles}` hasil salin (`sync-public.mjs`) menggandakan kode; `README.md` rusak encoding dan menjelaskan struktur lama | 1 |

Ditunda (di luar rencana): versi bahasa Inggris (butuh terjemahan dari pemilik, rencana terpisah), video demo/screenshot aplikasi RUBOOTH (butuh aset dari pemilik), studi kasus untuk karya selain 3 yang ada (butuh konten pemilik).

## Global Constraints

- Nama: `Muhammad Al Khairan Asaad`; almamater `Politeknik Negeri Ujung Pandang`; `IPK 3.74 / 4.00`.
- Istilah disiplin: `Graphic Designer` dan `Software Development` (dilarang `Software Engineer`).
- Font: `Plus Jakarta Sans`, `Instrument Serif`, `JetBrains Mono`.
- Dilarang em-dash (`—`) pada teks yang tampil di HTML build dan `portfolio-data`.
- Tidak boleh ada border/latar hitam buatan di sekitar thumbnail; `.stage-frame` tetap `background: transparent`, `.modal-media-wrap` tetap `width: fit-content`.
- Tepat **38** karya Drive (tanpa `1bdApHoMt2PzXcptWipbhhpioNl59ribX` dan `1Q7xbfCeAFMPg2P67K6qXD-JOKF-rDr0J`) dan 1 proyek RUBOOTH.
- Tidak boleh ada klaim angka/dampak yang ditampilkan tanpa `confirmed: true` dari pemilik.
- `npm run build` dan `npm test` harus hijau di akhir setiap task.

## Review Focus

1. **Karya Drive dihapus/privat saat `build-thumbs`:** skrip harus keluar dengan kode non-nol dan mencetak ID yang gagal, bukan menghasilkan thumbnail kosong secara diam-diam (Task 3).
2. **Pengguna keyboard/screen reader di lightbox:** fokus pindah ke dialog saat dibuka, terkunci di dalamnya (Tab melingkar), `Escape` menutup, dan fokus kembali ke kartu yang membuka (Task 4).
3. **Perangkat sentuh:** satu ketukan pada kartu membuka modal tepat satu kali; pratinjau-saat-hover hanya aktif di `(hover: hover)` (Task 4).
4. **Judul/deskripsi karya mengandung `'`, `"`, `<`, `&`:** tidak merusak markup maupun handler setelah `onclick` dihapus (Task 4).
5. **Data pemilik kosong:** `linkedinUrl`/`whatsappUrl`/`cvUrl` kosong menyembunyikan tombolnya, bukan menampilkan tautan pengganti (Task 2).

---

### Task 1: Satu Sumber Kebenaran dan README (menghapus duplikasi G)

**Files:**
- Move: `data/portfolio-data.js` → `src/data/portfolio-data.cjs`; `scripts/app.js` → `src/scripts/app.js`; `styles/main.css` → `src/styles/main.css`
- Move: `assets/*`, `favicon.svg`, `favicon.ico` → `public/` (tanpa salinan di akar)
- Delete: `index.html`, `scripts/sync-public.mjs`, `public/data`, `public/scripts`, `public/styles`
- Modify: `src/pages/index.astro`, `src/styles/global.css`, `package.json`, `tests/verify-portfolio.mjs`, `README.md`

**Interfaces:**
- Produces: `src/data/portfolio-data.cjs` (`module.exports = PORTFOLIO_DATA`, struktur tidak berubah); `window.PORTFOLIO_DATA` diisi `index.astro` lewat `<script is:inline set:html>` berisi `window.PORTFOLIO_DATA=<JSON>`; `src/scripts/app.js` diimpor Astro sebagai module (fungsi yang dipanggil markup tetap global lewat `window.*` sampai Task 4 menggantinya). Semua task berikutnya memakai path baru ini.

- [x] **Step 1: Tulis tes gagal `Hardening 1: single source layout`** di `tests/verify-portfolio.mjs`: `ROOT/index.html`, `ROOT/scripts/sync-public.mjs`, `ROOT/public/data`, `ROOT/public/scripts`, `ROOT/public/styles` tidak ada; `src/data/portfolio-data.cjs`, `src/scripts/app.js`, `src/styles/main.css`, `public/assets/profile_khairan.jpg`, `public/favicon.svg` ada; `package.json` tidak memuat `sync-public`; `dist/index.html` memuat `window.PORTFOLIO_DATA=`; `README.md` tidak memuat karakter `\uFFFD` dan menyebut `src/data/portfolio-data.cjs`.
- [x] **Step 2: Jalankan** `npm test`. Expected: FAIL (`index.html` masih ada).
- [x] **Step 3: Pindahkan file dengan `git mv`, hapus berkas warisan, ubah `prebuild`/`predev` di `package.json` (hapus), impor CSS/JS di `index.astro`/`global.css`, tulis ulang `README.md` (UTF-8) berisi struktur baru, cara menambah karya, cara menjalankan `npm run thumbs` (ditambah Task 3).** Perbarui semua path di tes lama (`index.html` → `dist/index.html`, `scripts/app.js` → `src/scripts/app.js`, dst.) tanpa melonggarkan asersinya.
- [x] **Step 4: Jalankan** `npm run build` lalu `npm test`. Expected: build sukses, semua tes PASS.
- [x] **Step 5: Commit** `refactor: single source layout, remove legacy index.html and public sync, rewrite README`

---

### Task 2: Integritas Konten, Tidak Ada Klaim Tanpa Konfirmasi (temuan A)

**Files:**
- Modify: `src/data/portfolio-data.cjs`, `src/components/SoftwareDevSection.astro`, `src/components/ContactFooter.astro`, `src/components/Hero.astro`, `src/scripts/app.js`, `tests/verify-portfolio.mjs`

**Interfaces:**
- Consumes: path baru dari Task 1.
- Produces: `devItems[0].metrics: Array<{ value: string, label: string, confirmed: boolean }>` (4 entri, seluruhnya `confirmed: false` sampai pemilik mengisi); `driveItem.caseStudy.confirmed: boolean` (3 entri yang ada diubah ke `false`); `hydrateProfile()` menyembunyikan tombol bila URL kosong.

- [x] **Step 1: Tulis tes gagal `Hardening 2: unconfirmed claims never ship`:** (a) setiap `metrics[i]` dan setiap `caseStudy` memiliki properti boolean `confirmed`; (b) `dist/index.html` tidak memuat `rubooth-metrics-strip` selama ada metrik `confirmed: false`, dan memuatnya hanya berisi nilai metrik `confirmed: true`; (c) `dist/index.html` tidak memuat `wa.me/?text`, `linkedin.com/search`, maupun `mailto:...subject=Permintaan`; (d) bila `profile.linkedinUrl`/`whatsappUrl`/`cvUrl` kosong, `contactLinkedinBtn`/`contactWhatsappBtn`/`contactCvBtn`/`heroCvBtn` ada dengan `style="display:none;"`; (e) `src/scripts/app.js` tidak memuat `defaultLinkedIn`, `defaultWa`.
- [x] **Step 2: Jalankan** `npm test`. Expected: FAIL (`confirmed` belum ada, tautan pengganti masih ada).
- [x] **Step 3: Implementasi:** pindahkan 4 metrik dari markup ke `devItems[0].metrics`; render strip hanya untuk entri `confirmed: true` (strip tidak dirender bila nol); `renderCaseStudy` mengabaikan studi kasus `confirmed !== true`; kembalikan logika `hydrateProfile` dan markup kontak ke perilaku "sembunyikan bila kosong" (hapus tautan pengganti dan tombol "Salin Email" tetap).
- [x] **Step 4: Jalankan** `npm run build` lalu `npm test`. Expected: PASS.
- [x] **Step 5: Commit** `fix(content): gate metrics and case studies behind confirmed flag, remove placeholder contact links`

> **Input dari pemilik (tidak memblokir task):** URL LinkedIn, nomor WhatsApp (`https://wa.me/62...`), URL CV PDF, dan nilai nyata metrik RUBOOTH serta dampak studi kasus. Isi di `src/data/portfolio-data.cjs` lalu set `confirmed: true`; tidak perlu mengubah kode.

---

### Task 3: Gambar Lokal WebP dengan Fallback Drive (temuan B)

**Files:**
- Create: `scripts/build-thumbs.mjs`, `public/assets/works/<id>-600.webp`, `public/assets/works/<id>-1200.webp` (38 id × 2)
- Modify: `package.json` (devDependency `sharp`, script `thumbs`), `src/components/GraphicDesignSection.astro`, `src/scripts/app.js`, `tests/verify-portfolio.mjs`

**Interfaces:**
- Produces: `export async function buildThumbs(ids: string[], outDir: string, fetchImpl = fetch): Promise<{ ok: string[], failed: string[] }>`; CLI `npm run thumbs` mengunduh `https://drive.google.com/thumbnail?id=<id>&sz=w1600`, menulis dua varian WebP (lebar 600 dan 1200, kualitas 78), keluar kode 1 bila `failed.length > 0`. Fungsi bantu `localThumb(id: string, width: 600 | 1200): string` mengembalikan `assets/works/${id}-${width}.webp`.

- [x] **Step 1: Tulis tes gagal `Hardening 3: local thumbnails`:** (a) `buildThumbs(['ok','bad'], tmpDir, fakeFetch)` dengan `fakeFetch` mengembalikan PNG valid untuk `ok` dan status 404 untuk `bad` menghasilkan `{ ok: ['ok'], failed: ['bad'] }` dan tidak menulis berkas untuk `bad`; (b) tiap id di `driveItems` memiliki `public/assets/works/<id>-600.webp` dan `-1200.webp`, masing-masing ≤ 120 KB; (c) `dist/index.html` tidak memuat `<img` dengan `src="https://drive.google.com/thumbnail`; (d) tiap `<img class="work-thumb">` memiliki atribut `onerror` fallback ke Drive atau `data-fallback`; (e) `localThumb('abc', 600) === 'assets/works/abc-600.webp'`.
- [x] **Step 2: Jalankan** `npm test`. Expected: FAIL (`Cannot find module scripts/build-thumbs.mjs`).
- [x] **Step 3: Implementasikan `buildThumbs` dan CLI dengan `sharp`;** jalankan `npm run thumbs` di mesin pemilik yang terhubung internet dan commit hasil WebP. Ganti `src` kartu, panggung, dan modal ke varian lokal; Drive menjadi `onerror` fallback. Tambahkan `content-visibility: auto; contain-intrinsic-size: 420px 520px;` pada `.work-row` (grid mode).
- [x] **Step 4: Jalankan** `npm run build` lalu `npm test`. Expected: PASS; jika `npm run thumbs` melaporkan `failed`, hentikan dan laporkan ID-nya ke pemilik.
- [x] **Step 5: Commit** `perf(gallery): serve local WebP thumbnails with Drive fallback`

---

### Task 4: Aksesibilitas, Semantik, dan Kontras (temuan C dan D)

**Files:**
- Modify: `src/pages/index.astro` (bungkus konten dengan `<main id="perkenalan-main">`, skip-link menunjuk ke sana), seluruh `src/components/*.astro`, `src/scripts/app.js`, `src/styles/main.css`, `tests/verify-portfolio.mjs`, `package.json` (devDependency `jsdom`)

**Interfaces:**
- Produces: atribut `data-action` dengan nilai `open-work` (+`data-idx`), `open-dev`, `filter-drive` (+`data-key`), `filter-dev`, `view-mode` (+`data-mode`), `persona` (+`data-key`), `select-module` (+`data-idx`), `step-stage` (+`data-delta`), `step-modal` (+`data-delta`), `close-modal`, `toggle-theme`, `copy-email`; satu listener `document.addEventListener('click', ...)` memetakan `data-action` ke fungsi. Kartu karya: `<div class="work-row"><button type="button" class="work-open" data-action="open-work" data-idx="N">…judul…</button>…</div>` dengan `.work-open::after { content:""; position:absolute; inset:0 }`. Token warna baru `--accent-ink` (teks aksen di atas latar) dan `--on-accent` (teks di atas tombol aksen). Fungsi `contrastRatio(hexA: string, hexB: string): number` ada di berkas tes.

- [x] **Step 1: Tulis tes gagal `Hardening 4: accessibility`:** (a) `dist/index.html` tanpa `onclick=`, `onkeydown=`, `onmouseenter=`, `onfocus=`, tanpa `role="button"`, dan memuat tepat satu `<main`; (b) `contrastRatio` ≥ 4.5 untuk pasangan token: `--accent-ink` pada `--bg` dan `--bg-card` (terang dan gelap), `--on-accent` pada `--accent` (terang dan gelap), `--text-muted` pada `--bg` (terang dan gelap), nilai token dibaca dari `src/styles/main.css`; (c) dengan `jsdom` memuat `dist/index.html` dan menjalankan `src/scripts/app.js`: klik `.work-open` pertama membuka `#projectModal.open` dan memindahkan `document.activeElement` ke dalam `#projectModal`; `Escape` menutupnya dan `document.activeElement` kembali ke `.work-open` yang sama; Tab dari elemen terakhir dialog berpindah ke elemen pertama dialog; (d) dengan judul karya uji `O'Reilly "X" <b>&` hasil `renderDriveList` tidak menambah elemen `<b>` dan klik tetap membuka modal berjudul sama; (e) di `main.css` aturan pratinjau-saat-hover (`previewDesignStageByIndex` via hover) hanya terpasang bila `matchMedia('(hover: hover)').matches`.
- [x] **Step 2: Jalankan** `npm test`. Expected: FAIL (`onclick=` masih ada, kontras belum memenuhi).
- [x] **Step 3: Implementasi:** ganti seluruh handler inline dengan delegation `data-action`; ubah kartu ke pola `.work-open`; tambahkan focus trap dan pengembalian fokus di `openModal`/`closeModal` (simpan `lastTrigger`); pasang `pointerenter` pratinjau hanya bila `(hover: hover)`; tetapkan token: mode terang `--accent-ink #B8320C` dan `--accent #C2410C` dengan `--on-accent #FFFFFF`; mode gelap `--accent-ink #FF6A3D` dan `--accent #FF4D1C` dengan `--on-accent #0B0A09`; sesuaikan nilai bila `contrastRatio` belum ≥ 4.5 dan catat hasilnya.
- [x] **Step 4: Jalankan** `npm run build` lalu `npm test`. Expected: PASS.
- [x] **Step 5: Commit** `a11y: event delegation, native buttons, main landmark, focus management, AA contrast tokens`

---

### Task 5: Pratinjau Sosial, Halaman 404, Analitik, dan Deploy (temuan E dan F)

**Files:**
- Create: `scripts/build-og.mjs`, `public/og-image.png` (1200×630), `src/pages/404.astro`
- Modify: `src/pages/index.astro`, `package.json` (script `og`), `tests/verify-portfolio.mjs`

**Interfaces:**
- Consumes: path dan token dari Task 1 dan Task 4.
- Produces: `export async function buildOg(outPath: string): Promise<{ width: number, height: number }>` (SVG berisi nama, peran, dan almamater, dirender `sharp` ke PNG 1200×630); meta `og:image`, `og:image:width=1200`, `og:image:height=630`, `twitter:image` mengarah ke `https://portfolio-khairan.vercel.app/og-image.png`; `dist/404.html`; tag `<script defer src="/_vercel/insights/script.js">` di `index.astro` dan `404.astro`.

- [x] **Step 1: Tulis tes gagal `Hardening 5: social, 404, analytics`:** `buildOg(tmp)` mengembalikan `{ width: 1200, height: 630 }` dan berkas tersebut PNG; `public/og-image.png` ada dengan metadata 1200×630 (dibaca `sharp`); `dist/index.html` memuat `og:image:width`, `og:image:height`, dan `og:image` berakhiran `/og-image.png`; `dist/404.html` ada dan memuat tautan kembali ke `/`; kedua halaman memuat `/_vercel/insights/script.js`.
- [x] **Step 2: Jalankan** `npm test`. Expected: FAIL (`buildOg` tidak ada).
- [x] **Step 3: Implementasikan `buildOg`, jalankan `npm run og`, tambah `404.astro` bertema sama, ubah meta di `index.astro`, tambahkan skrip analitik.**
- [x] **Step 4: Jalankan** `npm run build`, `npm test`, lalu `git push origin main` dan `npx vercel --prod --yes`. Expected: build hijau, semua tes PASS, deploy `READY`; `curl -I https://portfolio-khairan.vercel.app/og-image.png` mengembalikan `200`, dan `/halaman-tidak-ada` mengembalikan halaman 404 kustom.
- [x] **Step 5: Commit** `feat(seo): 1200x630 OG image, custom 404, Vercel Web Analytics` (sebelum push)

> **Input dari pemilik:** aktifkan *Web Analytics* di dasbor Vercel proyek `portfolio-khairan` (skrip tidak mengirim data sebelum diaktifkan).

---

## Self-Review

- **Spec coverage:** temuan A→Task 2, B→3, C dan D→4, E dan F→5, G→1; item ditunda tercatat di atas.
- **Step scan:** tidak ada langkah "TBD"; nilai token awal diberikan dan diverifikasi tes kontras (nilai boleh disesuaikan eksekutor bila tes belum lulus, dicatat sebagai Ruling).
- **Type consistency:** `data-action` dan `localThumb`/`buildThumbs`/`buildOg`/`contrastRatio` dipakai konsisten antar task; Task 4 menggantikan handler global yang Task 1 pertahankan sementara.
- **Review Focus:** lima butir masing-masing punya tes di task pemiliknya (Task 3 a, Task 4 c, c, d, Task 2 d).
- **Proporsi:** kode hanya pada tes dan signature; implementasi tidak ditulis.
