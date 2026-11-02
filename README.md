# Website Portofolio // Muhammad Al Khairan Asaad

Website portofolio disiplin ganda (**Graphic Designer** & **Software Development**) milik **Muhammad Al Khairan Asaad** (Lulusan **Politeknik Negeri Ujung Pandang**, **IPK 3.74 / 4.00**).

Dibangun dengan arsitektur **Astro 5 SSG** dan **Tailwind CSS v4** dengan prinsip satu sumber kebenaran (*single source of truth*), bebas dari duplikasi file warisan.

---

## Struktur Direktori

```text
F:\portfolio-khairan\
├── public/                     # Aset publik statis murni
│   ├── assets/                 # Foto profil dan banner RUBOOTH
│   ├── favicon.svg             # Favicon SVG
│   ├── favicon.ico             # Favicon ICO
│   ├── robots.txt              # Konfigurasi perayapan mesin pencari
│   └── sitemap.xml             # Peta situs terindeks
├── src/
│   ├── components/             # Komponen antarmuka Astro modular
│   │   ├── Navbar.astro        # Header navigasi & pengalih tema
│   │   ├── Hero.astro          # Hero section, bio, metrik almamater
│   │   ├── GraphicDesignSection.astro # Galeri 38 karya Google Drive
│   │   ├── SoftwareDevSection.astro   # Showcase teknis RUBOOTH
│   │   ├── ContactFooter.astro # Aksi kontak langsung & footer
│   │   └── LightboxModal.astro # Modal pratinjau media & studi kasus
│   ├── data/
│   │   └── portfolio-data.cjs  # Sumber data tunggal profil & karya
│   ├── pages/
│   │   └── index.astro         # Halaman utama statis
│   ├── scripts/
│   │   └── app.js              # Interaktivitas klien, spotlight, modal
│   └── styles/
│       ├── global.css          # Integrasi Tailwind CSS v4
│       └── main.css            # Desain editorial studio
├── tests/
│   └── verify-portfolio.mjs    # Test suite otomatis (node --test)
├── astro.config.mjs            # Konfigurasi Astro
└── package.json
```

---

## Panduan Pengelolaan Karya & Profil

Seluruh data portofolio tersentralisasi di `src/data/portfolio-data.cjs`:

1. **Biodata & Kontak:** Edit objek `profile` untuk memperbarui email, LinkedIn, WhatsApp, maupun CV.
2. **Karya Graphic Design:** Tambahkan atau sunting item di dalam array `driveItems`.
3. **Proyek Software Development:** Sunting proyek kios cerdas di dalam array `devItems`.

---

## Perintah Pengembangan

- **Menjalankan Dev Server:**
  ```bash
  npm run dev
  ```
- **Menjalankan Pengujian Otomatis:**
  ```bash
  npm test
  ```
- **Membangun Versi Produksi:**
  ```bash
  npm run build
  ```
- **Pratinjau Hasil Build:**
  ```bash
  npm run preview
  ```
