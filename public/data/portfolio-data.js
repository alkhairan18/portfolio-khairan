/**
 * ============================================================================
 * DATA PORTOFOLIO - MUHAMMAD AL KHAIRAN ASAAD
 * ============================================================================
 * Panduan Mengubah / Menambah Karya di Masa Depan:
 * 1. Untuk mengubah biodata atau foto profil, edit objek `profile` dan `personas`.
 * 2. Untuk menambah karya Graphic Design baru dari Google Drive:
 *    - Ambil ID file Google Drive (bagian di antara `/d/` dan `/view` pada link Drive).
 *    - Tambahkan objek baru ke dalam array `driveItems`.
 * 3. Untuk menambah proyek aplikasi/web baru pada Software Development:
 *    - Tambahkan objek baru ke dalam array `devItems`.
 * ============================================================================
 */

const PORTFOLIO_DATA = {
  profile: {
    name: 'Muhammad Al Khairan Asaad',
    kicker: 'Graphic Designer & Software Developer · Makassar',
    institution: 'Politeknik Negeri Ujung Pandang',
    gpa: 'IPK 3.74 / 4.00',
    roleSummary: 'Graphic Designer & Software Dev.',
    avatarUrl: 'assets/profile_khairan.jpg',
    email: 'alkhairan18@gmail.com',
    linkedinUrl: '',
    whatsappUrl: '',
    cvUrl: '',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1_1u2Mi_RnFdh7tYA8i8AzM7Rwwlu4RPe',
    githubProfileUrl: 'https://github.com/alkhairan18'
  },

  personas: {
    hybrid:
      'Lulusan <strong>Politeknik Negeri Ujung Pandang</strong> dengan <strong>IPK 3.74</strong>. Menekuni dua bidang secara seimbang: merancang infografis publikasi instansi (KPU Kota Makassar), identitas visual, kemasan, 3D, dan motion graphics sebagai <strong>Graphic Designer</strong>, serta membangun aplikasi dan sistem web fungsional pada bidang <strong>Software Development</strong>.',
    designer:
      'Sebagai <strong>Graphic Designer</strong> lulusan Politeknik Negeri Ujung Pandang (IPK 3.74), saya menguasai <strong>Photoshop, Illustrator, Premiere Pro, After Effects, Blender 3D, dan Canva</strong> dengan pengalaman merancang 20+ infografis &amp; publikasi resmi KPU Kota Makassar, kemasan produk, video sinematik, dan motion graphics.',
    developer:
      'Pada bidang <strong>Software Development</strong>, sebagai lulusan Politeknik Negeri Ujung Pandang (IPK 3.74) saya membangun aplikasi dan sistem web seperti <strong>RUBOOTH Smart Photobooth Kiosk</strong> (Android Kotlin, Canon DSLR USB PTP, Gemini AI, Midtrans QRIS, Firebase IoT).'
  },

  driveFilters: [
    { key: 'all', label: 'Semua (39)' },
    { key: 'ps', label: 'Photoshop · Semua (25)' },
    { key: 'ps-kpu-info', label: 'Infografis & PPID KPU (9)' },
    { key: 'ps-kpu-sosmed', label: 'Kampanye Hari Besar KPU (11)' },
    { key: 'ps-pack', label: 'Kemasan & Manipulasi PS (5)' },
    { key: 'ai', label: 'Illustrator (4)' },
    { key: 'ae', label: 'After Effects (4)' },
    { key: 'pr', label: 'Premiere Pro (4)' },
    { key: 'blender', label: 'Blender 3D (2)' }
  ],

  driveItems: [
    // === A. 9 Infografis Layanan Publik, PPID & Kepemiluan KPU Kota Makassar ===
    {
      id: '1IpyHiFwfvmVWj_9VbptkDOkDRi1BT3NH',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Infografis KPU',
      type: 'image',
      title: 'Infografis Kategori Pemilih (PDPB Triwulan III 2025) - KPU Makassar',
      file: 'INFOGRAFIS DIAGRAM.1.png',
      desc: 'Visualisasi data dan diagram statistik Pemutakhiran Data Pemilih Berkelanjutan (PDPB) Triwulan 3 Tahun 2025 (1.070.078 pemilih) untuk KPU Kota Makassar.'
    },
    {
      id: '1EVKjwUvXkFBJNPiI0jMSESjLJfcXlwKB',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Infografis KPU',
      type: 'image',
      title: 'Infografis Lini Masa Sejarah Pemilihan Umum di Indonesia',
      file: 'Sejarah Pemilu.png',
      desc: 'Desain infografis edukasi publik KPU Kota Makassar yang merangkum sejarah Pemilu Indonesia dari Periode 1955, Orde Baru (1971-1997), hingga Era Reformasi (1999-2024).'
    },
    {
      id: '1TM2KW9W9zKRA8D0hsEpUV5Tz7uUHrDqz',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Publikasi KPU',
      type: 'image',
      title: 'Poster Penghargaan Terbaik III KPU RI - KPU Kota Makassar',
      file: 'Penghargaan dan Apresiasi KPU RI.png',
      desc: 'Desain publikasi resmi Komisi Pemilihan Umum (KPU) Kota Makassar atas diraihnya Penghargaan Terbaik III Manajemen Penanganan Sengketa Hukum Tahun 2025.'
    },
    {
      id: '1G1QPteDHiPwh-QPnBDnJ1kIra0Kvu9RD',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Infografis KPU',
      type: 'image',
      title: 'Infografis Hasil Survei Indeks Kepuasan Masyarakat (IKM 90,03)',
      file: 'Hasil Survey Indeks Kepuasan Masyarakat.png',
      desc: 'Tabel visualisasi capaian mutu layanan publik KPU Kota Makassar dengan nilai IKM 90,03 (Predikat A / Sangat Baik).'
    },
    {
      id: '1Q7xbfCeAFMPg2P67K6qXD-JOKF-rDr0J',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Infografis KPU',
      type: 'image',
      title: 'Infografis Daftar Partai Politik Peserta Pemilu',
      file: 'Peserta Pemilu.png',
      desc: 'Desain informasi publik mengenai partai politik peserta Pemilihan Umum untuk sosialisasi pemilih KPU Kota Makassar.'
    },
    {
      id: '1-JX-SNrrl1bFf4ysN0kBuZnnAJ_cT-5D',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Infografis PPID',
      type: 'image',
      title: 'Infografis Alur Prosedur Permintaan Data & Informasi Publik',
      file: 'Prosedur Permintaan Data dan Informasi Publik.png',
      desc: 'Visualisasi alur layanan dan prosedur permohonan data/informasi publik pada PPID KPU Kota Makassar.'
    },
    {
      id: '1H5bj218-o5EqhTVH5jPGYuw-ysr930lD',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Infografis KPU',
      type: 'image',
      title: 'Infografis Layanan Tanggapan Masyarakat PDPB Triwulan IV',
      file: 'Layanan Tanggapan PDPB Triwulan IV 1.png',
      desc: 'Desain publikasi layanan masukan dan tanggapan masyarakat terhadap PDPB Triwulan IV KPU Kota Makassar.'
    },
    {
      id: '1nXfzuYSPfljALgLY8ibXvIYGtc2uTqOJ',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Publikasi PPID',
      type: 'image',
      title: 'Poster Maklumat Pelayanan Informasi Publik - PPID KPU Makassar',
      file: 'Maklumat Pelayanan Informasi Revisi.png',
      desc: 'Desain tata letak maklumat pelayanan informasi publik resmi untuk PPID KPU Kota Makassar.'
    },
    {
      id: '1r9twmp16i4J4on6EizyA12zve5wspixX',
      cat: 'ps',
      subcat: 'ps-kpu-info',
      isNew: true,
      tool: 'Adobe Photoshop · Infografis PPID',
      type: 'image',
      title: 'Bagan Struktur Organisasi PPID - KPU Kota Makassar',
      file: 'Struktur PPID Tanpa Jabatan 1.png',
      desc: 'Perancangan bagan hierarki dan struktur Pejabat Pengelola Informasi dan Dokumentasi (PPID) KPU Kota Makassar.'
    },

    // === B. 11 Poster Kampanye Media Sosial Hari Besar Nasional/Internasional KPU Kota Makassar ===
    {
      id: '1b0snGOo3JtA2cXYEesHmNtFLeNFmSfz0',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Kampanye Hari Nusantara (13 Desember) - KPU Makassar',
      file: '13 Desember - Hari Nusantara.png',
      desc: 'Desain poster media sosial resmi KPU Kota Makassar memperingati Hari Nusantara dengan komposisi peta kepulauan Indonesia 3D dan ilustrasi kapal Phinisi.'
    },
    {
      id: '19XLTBrSbxhjeFLarPzMxhMCFuOo8crbE',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Peringatan Hari Bela Negara (19 Desember) - KPU Makassar',
      file: '19 Desember - Hari Bela Negara.png',
      desc: 'Desain konten media sosial resmi KPU Kota Makassar dalam rangka memperingati Hari Bela Negara.'
    },
    {
      id: '1kJWTxSBrhzGJxny4sB-p3MycFOJ1vyOA',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Kampanye Hari Antikorupsi Internasional (9 Desember)',
      file: '9 Desember - Hari Anti Korupsi Internasional.png',
      desc: 'Poster kampanye integritas publik peringatan Hari Antikorupsi Internasional untuk kanal resmi KPU Kota Makassar.'
    },
    {
      id: '1fhYoSr-dUNIYqhpY89oYR0qmkrmBP8ji',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Peringatan Hari Batik Nasional - KPU Kota Makassar',
      file: 'Hari Batik Nasional 1.png',
      desc: 'Desain publikasi visual bertema warisan budaya untuk memperingati Hari Batik Nasional pada kanal resmi KPU Kota Makassar.'
    },
    {
      id: '1lJ8gVN8TafXfwX6BhUI2mCuFZsRzEEYZ',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Hari Relawan Internasional (5 Desember 2025)',
      file: '5 Desember 2025 - Hari Relawan Internasional.png',
      desc: 'Desain konten apresiasi relawan demokrasi dan kemanusiaan pada peringatan Hari Relawan Internasional.'
    },
    {
      id: '1V25pQ4tQPV8sxafWj-tlEGobKgTaR1JU',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Peringatan Hari Anak Sedunia - KPU Kota Makassar',
      file: 'Hari Anak Sedunia.png',
      desc: 'Desain ilustrasi dan tipografi media sosial KPU Kota Makassar dalam rangka Hari Anak Sedunia.'
    },
    {
      id: '1d2jrfQFkA-PE-a1dhVY4NVn1ydmsD3zQ',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Peringatan Hari Tani Nasional - KPU Kota Makassar',
      file: 'Hari Tani Nasional.png',
      desc: 'Desain poster apresiasi Hari Tani Nasional untuk publikasi media sosial KPU Kota Makassar.'
    },
    {
      id: '1ItApvUe-2O18MdW0uNKpC66Xj7lp9ENe',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Ucapan Hari Juang Polri - KPU Kota Makassar',
      file: 'Hari Juang Polri.png',
      desc: 'Desain publikasi hubungan antar-lembaga KPU Kota Makassar memperingati Hari Juang Polri.'
    },
    {
      id: '1vi15sQWo6Aax2MdUcqGve9_h-6aiY6bM',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Kampanye Hari Menanam Pohon (28 November)',
      file: '28 November-Hari Menanam Pohon.png',
      desc: 'Desain komunikasi visual bertema pelestarian lingkungan untuk Hari Menanam Pohon Indonesia.'
    },
    {
      id: '1DQ5P0bc7Yv-scOFS2xwLMqqgBlkBfRv2',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Kampanye Hari Perlindungan Lapisan Ozon',
      file: 'Hari Perlindungan Lapisan Ozon.png',
      desc: 'Desain visual edukasi lingkungan hidup pada peringatan Hari Perlindungan Lapisan Ozon.'
    },
    {
      id: '1V2ECCBHHjve659CNnfxdu2aj4HBYOao0',
      cat: 'ps',
      subcat: 'ps-kpu-sosmed',
      isNew: true,
      tool: 'Adobe Photoshop · Sosmed KPU',
      type: 'image',
      title: 'Poster Peringatan Hari Meditasi Sedunia (21 Desember)',
      file: '21 Desember - Hari Meditasi Sedunia.png',
      desc: 'Desain visual media sosial KPU Kota Makassar untuk peringatan Hari Meditasi Sedunia.'
    },

    // === C. 5 Karya Kemasan & Manipulasi Visual Photoshop ===
    {
      id: '1yniwn6mBWECi-E4bZeuF0rVmj0AqqSdv',
      cat: 'ps',
      subcat: 'ps-pack',
      isNew: false,
      tool: 'Adobe Photoshop',
      type: 'image',
      title: 'Mockup Kemasan Cartoon Box & Chopsticks',
      file: 'close-up-cartoon-box-with-chopsticks.png',
      desc: 'Desain kemasan produk makanan dan penyajian visual realistis menggunakan Adobe Photoshop.'
    },
    {
      id: '1LG5pBPgwohKgPsZGoggI5236vYZtzrNW',
      cat: 'ps',
      subcat: 'ps-pack',
      isNew: false,
      tool: 'Adobe Photoshop',
      type: 'image',
      title: 'Eksplorasi Komposisi Visual (Project PS)',
      file: 'Tugas Project PS.png',
      desc: 'Karya manipulasi gambar dan tata letak poster digital di Adobe Photoshop.'
    },
    {
      id: '10PkYbtnVDUZ72WlWZin-kfprZIi9a0a4',
      cat: 'ps',
      subcat: 'ps-pack',
      isNew: false,
      tool: 'Adobe Photoshop',
      type: 'image',
      title: 'Desain Kemasan Produk White-Box (Seri 1)',
      file: 'white-box.png',
      desc: 'Perancangan kemasan boks minimalis dengan penataan pencahayaan studio.'
    },
    {
      id: '1oicMK9HneeYqBAlpGQy444vxFnEe-8_A',
      cat: 'ps',
      subcat: 'ps-pack',
      isNew: false,
      tool: 'Adobe Photoshop',
      type: 'image',
      title: 'Desain Kemasan Produk White-Box (Seri 2)',
      file: 'white-box1.png',
      desc: 'Variasi sudut pandang kemasan produk dan detail permukaan.'
    },
    {
      id: '1_4yRH_Pg4LA8hJPyafV_d5FfvoLifLDt',
      cat: 'ps',
      subcat: 'ps-pack',
      isNew: false,
      tool: 'Adobe Photoshop',
      type: 'image',
      title: 'Desain Kemasan Produk White-Box (Seri 3)',
      file: 'white-box 2.png',
      desc: 'Presentasi akhir sistem kemasan produk White-Box.'
    },

    // === D. 4 Karya Adobe Illustrator ===
    {
      id: '1tITC-FAqL_lQAZkx44K1EpiThqfknKH6',
      cat: 'ai',
      subcat: 'ai',
      isNew: false,
      tool: 'Adobe Illustrator',
      type: 'image',
      title: 'Desain Sampul Buku (Cover Book 1)',
      file: 'Cover Book 1.png',
      desc: 'Ilustrasi vektor dan tata letak tipografi sampul publikasi buku menggunakan Adobe Illustrator.'
    },
    {
      id: '16vTqpNRJyVMYFxo-UyvGK6HxsWg2KyA1',
      cat: 'ai',
      subcat: 'ai',
      isNew: false,
      tool: 'Adobe Illustrator',
      type: 'image',
      title: 'Identitas Visual & Logo DIMCAV (Utama)',
      file: 'LOGO DIMCAV.png',
      desc: 'Perancangan logogram dan identitas visual merek DIMCAV berbasis vektor presisi.'
    },
    {
      id: '1mJn4NvtCjWqemaRWsPsjcG6iNpUsz8lz',
      cat: 'ai',
      subcat: 'ai',
      isNew: false,
      tool: 'Adobe Illustrator',
      type: 'image',
      title: 'Eksplorasi Varian Logo DIMCAV 3',
      file: 'LOGO DIMCAV 3.png',
      desc: 'Pengembangan alternatif komposisi dan proporsi simbol identitas DIMCAV.'
    },
    {
      id: '1jjPkkhvjQQ5wa_EX8hYAUf4lhdJHFVcU',
      cat: 'ai',
      subcat: 'ai',
      isNew: false,
      tool: 'Adobe Illustrator',
      type: 'image',
      title: 'Eksplorasi Varian Logo DIMCAV 4',
      file: 'LOGO DIMCAV 4.png',
      desc: 'Penerapan sistem warna dan bentuk akhir logo DIMCAV.'
    },

    // === E. 4 Karya After Effects ===
    {
      id: '15dqc8O6j_Nj5x2j59uETJUzGmqnEy7qU',
      cat: 'ae',
      subcat: 'ae',
      isNew: false,
      tool: 'After Effects',
      type: 'video',
      title: 'Motion Graphics Video Iklan Komersial',
      file: 'Iklan fix.mp4',
      desc: 'Produksi animasi iklan digital dengan transisi gerak dinamis dan efek visual di After Effects.'
    },
    {
      id: '1T5yBN-t3IbfJlcOYOtQwoFh8T2shHSUs',
      cat: 'ae',
      subcat: 'ae',
      isNew: false,
      tool: 'After Effects',
      type: 'video',
      title: 'Eksplorasi Tipografi Kinetik (Liquid Text)',
      file: 'Liquid_Text.mp4',
      desc: 'Animasi efek teks cair (liquid motion) untuk kebutuhan bumper dan pembuka visual.'
    },
    {
      id: '1wyUuI0RVGZ7dAgVh2jGjug4NNproOJp6',
      cat: 'ae',
      subcat: 'ae',
      isNew: false,
      tool: 'After Effects',
      type: 'video',
      title: 'Animasi Pembuka Identitas (Logo Reveal)',
      file: 'Logo Reveal.mp4',
      desc: 'Bumper animasi pengungkapan logo (logo reveal) dengan ritme gerak presisi.'
    },
    {
      id: '1D1CqzPqUxG3BMfNTd4YWM_zEFhUyUIZ5',
      cat: 'ae',
      subcat: 'ae',
      isNew: false,
      tool: 'After Effects',
      type: 'video',
      title: 'Animasi Kilau Identitas (Shine Logo Animation)',
      file: 'Shine_Logo_Animation.mp4',
      desc: 'Efek pencahayaan dan kilau dinamis pada animasi identitas brand.'
    },

    // === F. 4 Karya Premiere Pro ===
    {
      id: '1t5RsVxlV530Mbrzw0ZrH6-H-xIn9wBZY',
      cat: 'pr',
      subcat: 'pr',
      isNew: false,
      tool: 'Premiere Pro',
      type: 'video',
      title: 'Video Profil Produk Gula Semut',
      file: 'Gula Semut_2.mp4',
      desc: 'Penyuntingan video dokumenter/komersial produk Gula Semut, mencakup alur cerita, warna, dan audio.'
    },
    {
      id: '11sTThpryDir7xxMeMOxN-tqvGpHvwnKt',
      cat: 'pr',
      subcat: 'pr',
      isNew: false,
      tool: 'Premiere Pro',
      type: 'video',
      title: 'Showreel & Reels Sinematografi',
      file: 'Reels Sinematografi.mp4',
      desc: 'Kompilasi pengambilan gambar sinematik, color grading, dan pemotongan ritme di Premiere Pro.'
    },
    {
      id: '1Sj35WbQBlNP1HionE3amUmcBw5MqMYRk',
      cat: 'pr',
      subcat: 'pr',
      isNew: false,
      tool: 'Premiere Pro',
      type: 'video',
      title: 'Produksi Video Podcast (Case or Close)',
      file: 'Kelompok 4 Podcast Case or Close.mp4',
      desc: 'Penyuntingan multi-kamera dan penataan audio untuk program gelar wicara / podcast.'
    },
    {
      id: '1y60P9sY6eiV8op_ezSUePVSHBN7uklyX',
      cat: 'pr',
      subcat: 'pr',
      isNew: false,
      tool: 'Premiere Pro',
      type: 'video',
      title: 'Produksi Video Narasi & Edukasi',
      file: 'Tugas Agama 2.mp4',
      desc: 'Penyuntingan video narasi lengkap dengan tata suara dan subtitel.'
    },

    // === G. 2 Karya Blender 3D ===
    {
      id: '1FAZNJ8rj9JtpUGjkGGL_K8LMBFosU7c3',
      cat: 'blender',
      subcat: 'blender',
      isNew: false,
      tool: 'Blender 3D',
      type: 'video',
      title: 'Animasi Iklan Produk 3D',
      file: 'Iklan klp3.mp4',
      desc: 'Pemodelan objek 3D, pencahayaan, dan rendering animasi produk menggunakan Blender.'
    },
    {
      id: '13HHrzxJ0ZtTededJ7VoskuAc03aDF-f0',
      cat: 'blender',
      subcat: 'blender',
      isNew: false,
      tool: 'Blender 3D',
      type: 'video',
      title: 'Animasi Identitas 3D (Logo 3D)',
      file: 'Logo UTS.mp4',
      desc: 'Visualisasi dan animasi logo tiga dimensi menggunakan Blender.'
    }
  ],

  devFilters: [
    { key: 'all', label: 'Semua' },
    { key: 'app', label: 'Pembuatan Aplikasi' }
  ],

  devItems: [
    {
      id: 'rubooth',
      cat: 'app',
      badge: 'PEMBUATAN APLIKASI · ANDROID KOTLIN',
      title: 'RUBOOTH - Smart Android Photobooth Kiosk System',
      sub: 'Kotlin · Canon DSLR USB PTP · Gemini AI · Midtrans QRIS',
      img: 'assets/rubooth_banner.jpg',
      repoUrl: 'https://github.com/alkhairan18/rubooth',
      repoLabel: 'github.com/alkhairan18/rubooth',
      desc: 'Aplikasi kios photobooth interaktif mandiri berbasis Android (Kotlin) yang mengintegrasikan Dual-Camera (USB UVC Live Preview + kamera DSLR Canon EOS via USB PTP), Generative AI foto bersama idola (Google Gemini API), pembayaran otomatis QRIS Midtrans Snap, sinkronisasi lampu studio IoT via Firebase, dan pencetakan instan format 3R ke printer Epson L8050.',
      tags: [
        'Kotlin',
        'Android SDK',
        'USB PTP (Canon DSLR)',
        'Google Gemini API',
        'Midtrans QRIS',
        'Firebase IoT',
        'Epson L8050 Print'
      ],
      type: 'image'
    }
  ]
};

if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
