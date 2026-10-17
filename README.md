# Website Portofolio — Muhammad Al Khairan Asaad

Website portofolio disiplin ganda (**Graphic Designer** & **Software Development**) milik **Muhammad Al Khairan Asaad** (Lulusan **Politeknik Negeri Ujung Pandang**, **IPK 3.74 / 4.00**).

## Struktur Direktori

```text
F:\portfolio-khairan\
├── index.html                  # Halaman utama portofolio
├── styles/
│   └── main.css                # Gaya Swiss Architectural (Mode Terang & Gelap)
├── data/
│   └── portfolio-data.js       # Pusat data karya & profil (mudah diedit kapan saja)
├── scripts/
│   └── app.js                  # Logika interaktif (filter, pratinjau stage, modal lightbox)
├── assets/
│   ├── profile_khairan.jpg     # Foto profil resmi Muhammad Al Khairan Asaad
│   └── rubooth_banner.jpg      # Gambar banner proyek aplikasi RUBOOTH
└── tests/
    └── verify-portfolio.mjs    # Pengujian otomatis kelengkapan data & tampilan
```

## Cara Membuka Website

1. **Langsung di Browser:** Klik dua kali file `F:\portfolio-khairan\index.html` untuk membukanya langsung di browser.
2. **Menggunakan Server Lokal (Opsional):**
   ```powershell
   npx serve "f:\portfolio-khairan"
   ```

## Cara Mengubah atau Menambah Karya di Masa Depan

Seluruh data karya dan profil dipisahkan di dalam file **`data/portfolio-data.js`** sehingga Anda tidak perlu mengutak-atik kode HTML atau CSS:

1. **Menambah Karya Graphic Designer Baru dari Google Drive:**
   - Buka file `data/portfolio-data.js`.
   - Tambahkan baris objek baru ke dalam `driveItems`:
     ```javascript
     {
       id: 'ID_FILE_GOOGLE_DRIVE',
       cat: 'ps', // 'ps' | 'ai' | 'ae' | 'pr' | 'blender'
       subcat: 'ps-kpu-info',
       isNew: true,
       tool: 'Adobe Photoshop',
       type: 'image', // 'image' atau 'video'
       title: 'Judul Karya Baru',
       file: 'nama-file.png',
       desc: 'Deskripsi singkat karya.'
     }
     ```
2. **Menambah Proyek Software Development Baru:**
   - Buka file `data/portfolio-data.js`.
   - Tambahkan objek proyek baru ke dalam array `devItems` lengkap dengan `repoUrl` GitHub atau link website Anda.
3. **Mengganti Foto Profil atau Biodata:**
   - Ganti file di `assets/profile_khairan.jpg` atau ubah teks pada bagian `profile` dan `personas` di `data/portfolio-data.js`.
