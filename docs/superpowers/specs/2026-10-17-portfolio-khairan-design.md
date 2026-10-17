# Spesifikasi Desain Website Portofolio — Muhammad Al Khairan Asaad

**Tanggal:** 2026-10-17  
**Pemilik Portofolio:** Muhammad Al Khairan Asaad  
**Almamater & Capaian Akademik:** Lulusan Politeknik Negeri Ujung Pandang (PNUP) — IPK 3.74 / 4.00  
**Lokasi Proyek:** `F:\portfolio-khairan`  
**Prototipe Referensi Final:** `C:\Users\ACER\.gemini\antigravity\brain\3b1d6eed-2cc7-4df4-9c68-571310e5c82b\scratch\brainstorm\content\portfolio-interactive-v14.html`

---

## 1. Tujuan & Latar Belakang (Intent and the Why)

Membangun website portofolio personal berstandar produksi untuk **Muhammad Al Khairan Asaad**, lulusan **Politeknik Negeri Ujung Pandang (IPK 3.74)**, yang ditujukan kepada **HRD (perekrut perusahaan/instansi)** maupun pengunjung umum.

Website ini harus merepresentasikan dua disiplin keahlian utama secara **setara (seimbang)** tanpa mengorbankan salah satunya:
1. **Graphic Designer** — Menguasai **Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro, Adobe After Effects, Blender 3D, dan Canva**, dibuktikan melalui **39 karya nyata** yang terhubung langsung dengan Google Drive portofolio pemilik (termasuk 20 karya desain infografis, PPID, dan kampanye media sosial resmi **KPU Kota Makassar**, 5 karya kemasan & manipulasi visual Photoshop, 4 karya identitas vektor & sampul buku Illustrator, 4 video motion graphics After Effects, 4 video sinematografi & dokumenter Premiere Pro, serta 2 animasi 3D Blender).
2. **Software Development** — Membangun aplikasi dan sistem web fungsional, dibuktikan melalui proyek aplikasi utama **RUBOOTH — Smart Android Photobooth Kiosk System** (`https://github.com/alkhairan18/rubooth`).

Selain itu, kode website harus dirancang **modular dan mudah diubah/diperbarui kapan saja setelah dibangun** (data karya dan profil dipisahkan ke dalam modul data tersendiri sehingga penambahan karya Google Drive baru, penambahan proyek aplikasi/web baru, atau perubahan foto/teks dapat dilakukan dengan cepat tanpa merombak struktur antarmuka).

---

## 2. Sasaran, Non-Sasaran, dan Anti-Sasaran (Goals, Non-Goals, Anti-Goals)

### Goals (Sasaran Utama)
- Menampilkan identitas **Muhammad Al Khairan Asaad**, almamater **Politeknik Negeri Ujung Pandang**, dan **IPK 3.74 / 4.00** secara jelas di bagian pembuka (*Hero*) bersama foto profil resmi berproporsi potret `3:4` utuh.
- Menyediakan fitur interaktif **Pengubah Sudut Pandang HRD (*Persona Switcher*)** pada bagian Hero:
  - *Profil Utuh (Seimbang)*
  - *Sudut Pandang HRD Desain*
  - *Sudut Pandang HRD IT/Tech*
- Menyajikan dua bagian disiplin utama dalam tata letak **Atas-Bawah (*Full-Width Stacked Sections*)**:
  - Bagian Atas: **Graphic Designer (39 Karya)**
  - Bagian Bawah: **Software Development (RUBOOTH)**
- Setiap bagian disiplin memiliki **Panel Pratinjau Langsung (*Live Stage Monitor*)** di sisi kiri dan **Daftar Karya Interaktif (*Interactive Work List*)** di sisi kanan:
  - Mengarahkan kursor (*hover*) ke baris karya di kanan langsung memperbarui gambar, label kategori, judul, dan deskripsi pada *Live Stage Monitor* di kiri.
  - Mengklik baris karya membuka **Jendela Detail / Lightbox Modal** yang menampilkan gambar resolusi tinggi atau memutar video Google Drive secara langsung (`iframe` `/preview`), lengkap dengan tombol navigasi `← Sebelumnya` dan `Selanjutnya →` serta dukungan tombol papan ketik (`Escape`, `ArrowLeft`, `ArrowRight`).
- Menampilkan gambar pratinjau maupun gambar modal **tanpa ruang kosong/latar hitam di pinggir gambar** (*zero black letterboxing/pillarboxing*): bingkai `1px solid` membungkus proporsi asli gambar secara presisi.
- Menyediakan tombol tautan langsung ke repositori GitHub (`https://github.com/alkhairan18/rubooth`) pada bagian **Software Development** (baik di panel kiri, di baris daftar proyek kanan, maupun di dalam modal detail).
- Mendukung **Mode Terang (*Warm Stone Paper*)** dan **Mode Gelap (*Warm Carbon Slate*)** dengan penyimpanan preferensi di `localStorage`.
- Memisahkan seluruh data karya & profil ke dalam file `data/portfolio-data.js` agar pemilik dapat menambah/mengubah karya kapan saja dengan mudah setelah website selesai dibangun.

### Non-Goals (Bukan Sasaran Saat Ini)
- Tidak menggunakan *backend database* atau CMS berbayar yang rumit; website berjalan sebagai aplikasi web statis/modular yang ringan, cepat, dan langsung dapat dibuka di browser maupun di-*deploy* ke GitHub Pages / Vercel / Netlify.
- Tidak menampilkan item *Prototipe Antarmuka Aplikasi (Desain UI/UX)* (`Desain UI UX.mp4` / Adobe XD) karena atas permintaan pemilik item tersebut tidak dimasukkan.
- Tidak memecah aplikasi **RUBOOTH** menjadi beberapa baris sub-fitur terpisah; **RUBOOTH** tampil utuh sebagai satu entri proyek utama.

### Anti-Goals (Hal yang Dilarang Keras / Anti-AI-Slop)
- **Dilarang menggunakan estetika klise AI ("AI Slop"):** tidak boleh ada kartu gelap dengan *glow* ungu/biru neon, gradien kosmik, *glassmorphism* berlebihan, atau deretan kartu bundar yang seragam.
- **Dilarang menambahkan pinggiran/latar belakang hitam (`#000` / `#141413`) di kiri-kanan gambar potret/persegi** pada *stage frame* maupun *modal*.
- **Dilarang menggunakan font `Syne`** (telah ditolak karena terlalu melebar); wajib menggunakan kombinasi **`Plus Jakarta Sans`** dan **`JetBrains Mono`** dengan ukuran proporsional yang telah dikalibrasi.
- **Dilarang menggunakan istilah "Software Engineer"** pada teks antarmuka; seluruh penyebutan bidang kedua wajib menggunakan **"Software Development"**.

---

## 3. Batasan & Ketentuan Teknis (Constraints)

- **Arsitektur Tanpa Ketergantungan Build Rumit (Zero-Build / Standard Web):** Menggunakan HTML5 semantik (`index.html`), CSS3 terstruktur (`styles/main.css`), dan JavaScript modular (`data/portfolio-data.js` & `scripts/app.js`) sehingga dapat dijalankan langsung di browser lokal maupun melalui server statis (`npx serve` / GitHub Pages / Vercel) tanpa langkah kompilasi yang rawan gagal.
- **Aset Lokal yang Disertakan di Dalam Proyek (`F:\portfolio-khairan\assets\`):**
  - `assets/profile_khairan.jpg` — Disalin dari foto profil resmi yang diunggah pemilik (`C:\Users\ACER\.gemini\antigravity\brain\3b1d6eed-2cc7-4df4-9c68-571310e5c82b\.user_uploaded\media_1792219476256_514888b7.jpg`).
  - `assets/rubooth_banner.jpg` — Disalin dari gambar banner resmi RUBOOTH yang diunggah pemilik (`C:\Users\ACER\.gemini\antigravity\brain\3b1d6eed-2cc7-4df4-9c68-571310e5c82b\.user_uploaded\media_1792219973678_496e5f4d.jpg`).
- **Aset Google Drive (39 Karya Graphic Designer):**
  - Thumbnail daftar karya menggunakan `https://drive.google.com/thumbnail?id=<FILE_ID>&sz=w400`.
  - Pratinjau *Live Stage* menggunakan `https://drive.google.com/thumbnail?id=<FILE_ID>&sz=w1000`.
  - Gambar resolusi tinggi di dalam Modal menggunakan `https://drive.google.com/thumbnail?id=<FILE_ID>&sz=w1600`.
  - Pemutar video di dalam Modal menggunakan `<iframe src="https://drive.google.com/file/d/<FILE_ID>/preview" allow="autoplay; fullscreen"></iframe>`.

---

## 4. Keputusan Desain yang Telah Dikunci Bersama Pemilik (Decided How)

### 4.1. Estetika & Sistem Warna (Swiss Architectural / Studio Editorial)
- **Mode Terang (Default):**
  - `--bg: #F5F4F0` (*Warm Stone Paper*)
  - `--bg-elevated: #ECEAE3`
  - `--bg-invert: #141413`
  - `--text: #141413`
  - `--text-muted: #575651`
  - `--border: #141413` (garis kisi struktural tegas `1px solid`)
  - `--border-soft: #D5D2C8`
  - `--accent: #D9381E` (*International Vermilion*)
- **Mode Gelap (`[data-theme="dark"]`):**
  - `--bg: #111110`
  - `--bg-elevated: #191917`
  - `--bg-invert: #F5F4F0`
  - `--text: #F5F4F0`
  - `--text-muted: #9E9C94`
  - `--border: #2E2E2B`
  - `--border-soft: #22221F`
  - `--accent: #D4FF33`

### 4.2. Tipografi & Skala Ukuran Font
- **Font Utama (Heading & Body):** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
- **Font Teknis & Metadata:** `'JetBrains Mono', monospace`
- **Skala Ukuran Font Proporsional:**
  - `--fs-hero: clamp(26px, 2.8vw, 36px)`
  - `--fs-section: clamp(22px, 2.2vw, 28px)`
  - `--fs-stage-title: 18px`
  - `--fs-work-title: 15px`
  - `--fs-body: 14.5px`
  - `--fs-btn: 12.5px`
  - `--fs-meta: 11px`

### 4.3. Struktur Bagian Halaman
1. **Header Navigasi:**
   - Kiri: Foto avatar kecil (`30px × 30px`, `assets/profile_khairan.jpg`) + nama **Muhammad Al Khairan Asaad**.
   - Kanan: Tautan navigasi (`Profil Diri`, `Graphic Designer (39 Karya)`, `Software Development`) + tombol pengubah `Mode Terang / Gelap`.
2. **Bagian 1 — Hero Perkenalan Diri (`#perkenalan`):**
   - Kolom Kiri (`1.45fr`):
     - Kicker: `PORTOFOLIO DISIPLIN GANDA · MAKASSAR`
     - Judul H1: `Muhammad Al Khairan Asaad`
     - *Persona Switcher* (`Profil Utuh (Seimbang)`, `Sudut Pandang HRD Desain`, `Sudut Pandang HRD IT/Tech`) yang mengubah narasi bio secara dinamis.
     - Baris Metrik 3 Kolom:
       - `Almamater`: **Politeknik Negeri Ujung Pandang**
       - `Capaian Akademik`: **IPK 3.74 / 4.00**
       - `Bidang Utama`: **Graphic Designer & Software Dev.**
   - Kolom Kanan (`0.95fr`):
     - Kartu Foto Profil (`assets/profile_khairan.jpg`) dengan rasio potret `3:4` utuh (`max-width: 265px`), tanpa pinggiran hitam, dilengkapi efek interaktif *3D Mouse Tilt* dan *overlay* nama + almamater + `IPK 3.74`.
     - Dua tombol pintas (*CTA*): `1. Karya Graphic Design (39)` dan `2. Proyek Software Development`.
3. **Bagian 2 (Atas, Full-Width) — Graphic Designer (`#bagian-desain`):**
   - Header Bagian dengan filter chip interaktif:
     - `Semua (39)`
     - `Photoshop · Semua (25)`
     - `Infografis & PPID KPU (9)`
     - `Kampanye Hari Besar KPU (11)`
     - `Kemasan & Manipulasi PS (5)`
     - `Illustrator (4)`
     - `After Effects (4)`
     - `Premiere Pro (4)`
     - `Blender 3D (2)`
   - Badan 2 Kolom (`1fr` Kiri : `1.25fr` Kanan):
     - **Kiri (*Live Stage Monitor*):** Bingkai gambar proporsional (`width: 100%; height: auto;` tanpa latar hitam di pinggir), lencana alat keahlian, judul karya, dan deskripsi karya.
     - **Kanan (*Scrollable Work List*):** Area gulir (`max-height: 580px`) yang menampilkan seluruh karya sesuai filter aktif, lengkap dengan lencana `BARU` pada 20 karya KPU Kota Makassar dan tombol `Buka Gambar` / `Putar Video`.
4. **Bagian 3 (Bawah, Full-Width) — Software Development (`#bagian-development`):**
   - Header Bagian dengan filter chip (`Semua`, `Pembuatan Aplikasi`).
   - Badan 2 Kolom (`1fr` Kiri : `1.25fr` Kanan):
     - **Kiri (*Live Stage Monitor*):** Menampilkan banner resmi **RUBOOTH** (`assets/rubooth_banner.jpg`) tanpa latar hitam di pinggir, judul `RUBOOTH - Smart Android Photobooth Kiosk System`, deskripsi arsitektur lengkap (*Android Kotlin, Dual-Camera USB UVC + DSLR Canon EOS via USB PTP, Google Gemini API Generative AI, Midtrans Snap QRIS, Firebase Realtime Database IoT, Epson L8050*), dan tombol `Buka Proyek di GitHub (github.com/alkhairan18/rubooth) ↗`.
     - **Kanan (*Work List*):** Menampilkan entri proyek **RUBOOTH** dengan tombol `GitHub ↗` (membuka tab baru ke repositori GitHub) dan `Detail` (membuka modal detail proyek).
5. **Footer & Kontak Profesional:**
   - Baris penutup bersih yang memuat ringkasan identitas Muhammad Al Khairan Asaad, tautan langsung ke Google Drive Portofolio Desain (`https://drive.google.com/drive/folders/1_1u2Mi_RnFdh7tYA8i8AzM7Rwwlu4RPe`) dan GitHub Software Development (`https://github.com/alkhairan18`).

---

## 5. Hal yang Diserahkan kepada Pembangun (Left to the Builder)

- Penataan struktur direktori di dalam `F:\portfolio-khairan` (`index.html`, `styles/main.css`, `data/portfolio-data.js`, `scripts/app.js`, `assets/`, dan `README.md` panduan cara menambah/mengubah karya di masa depan).
- Penanganan *fallback* pemuatan gambar (*lazy loading* dan *alt text* aksesibel) serta responsivitas penuh untuk layar ponsel dan tablet (`@media (max-width: 920px)` dan `@media (max-width: 600px)`).
