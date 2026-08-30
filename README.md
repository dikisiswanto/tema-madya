# Tema Madya — RC10.12.42

Baseline visual parity dan CMS UI contract.

# Tema Madya CMS Sekolahku

Tema website sekolah modern-editorial untuk **Sekolahku CMS 3.1.2+**. Madya adalah tema pihak ketiga: core CMS, controller, model, route, dan database tidak perlu dimodifikasi.

> **Modern untuk dilihat. Sederhana untuk digunakan.**

## Status

- Versi: **0.3.0-rc.10.12.42**
- CMS target: **Sekolahku CMS 3.1.2+**
- Node lokal/CI: **22**
- PHP target: **8.5**
- Tailwind CSS: **4**
- Biome: **2.5.10**

## Menjalankan Playground

```bash
npm ci
npm run dev
```

Buka alamat Vite yang ditampilkan. Data demo berada di `playground/data/demo.json`. Data tersebut mengikuti vocabulary field CMS agar tampilan playground merepresentasikan data nyata yang diterima theme.

### Route demo

```text
/
/news
/news/{slug}
/downloads
/contact
/pages/{slug}
```

Rich component menggunakan hash route yang sama dengan struktur konten theme:

```text
#profile
#programs
#extracurriculars
#teachers
#achievements
#testimonials
#events
#gallery
#faq
```

## Struktur Source

```text
src/theme/app/Views/
├── pages/                  # adapter view publik CMS
└── themes/madya/          # layout, component, partial, asset

src/js/                    # state, router, navigation, renderer
src/css/                   # Tailwind entry dan komponen visual
playground/                # HTML-only preview
playground/data/demo.json  # fixture dengan struktur data CMS
scripts/                   # validasi dan build
tests/                     # pengujian browser
docs/                      # dokumentasi maintenance
```

## Kontrak CMS

Enam view publik tidak boleh diganti namanya:

```text
pages/home.php
pages/news.php
pages/single_post.php
pages/downloads.php
pages/contact.php
pages/page.php
```

PHP view harus membaca variabel yang disupply controller CMS. Jangan membuat kontrak data baru hanya untuk kebutuhan theme. Detail field penting ada di `docs/cms-compatibility.md`.

## Data dan Ikon

Playground memakai satu `demo.json` canonical. JavaScript melakukan normalisasi ringan tetapi mempertahankan nama field CMS.

Sekolahku menggunakan Font Awesome untuk sejumlah nilai ikon. Madya mendukung class Font Awesome seperti `fas fa-futbol` dan `fas fa-music`, termasuk `icon_color` untuk ekstrakurikuler. Lihat `docs/cms-icon-contract.md`.

## Search dan Galeri

Search header membuka dialog pencarian. Submit diarahkan ke route native `/news?search=...`, sehingga hasil mengikuti mekanisme berita CMS.

Galeri memiliki preview lightbox tanpa mengubah URL. Kontrol mendukung keyboard dan `Esc`.

## Code Quality

```bash
npm run format
npm run format:check
npm run lint
npm run lint:fix
npm run fix
npm run check
npm run build:html
npm test
```

`npm run fix` digunakan saat pengembangan. `npm run check` adalah gate yang bersifat read-only untuk CI/release.

## Tailwind

Tailwind CSS 4 menjadi fondasi styling. Design token Madya didefinisikan melalui `@theme`, reusable component menggunakan `@layer`, dan CSS manual dibatasi untuk kebutuhan khusus. Lihat `docs/tailwind-architecture.md`.

## SEO dan Aksesibilitas

Theme memperhatikan semantic HTML, heading hierarchy, metadata SEO, canonical, Open Graph, structured data, keyboard navigation, focus state, reduced motion, alternative text, dan ukuran gambar intrinsik.

## Release

Package production hanya membawa file theme yang dibutuhkan CMS. Playground, test, dan tooling development tidak menjadi bagian package theme production.

Gunakan script release setelah seluruh quality gate hijau.

## Prinsip Maintenance

1. Core CMS tidak disentuh.
2. Nama dan field kontrak CMS dipertahankan.
3. Playground harus dapat menampilkan struktur data yang sama dengan CMS.
4. Data turunan dibuat di renderer, bukan mengubah fixture menjadi kontrak baru.
5. Empty state, responsive layout, SEO, dan aksesibilitas harus dipikirkan bersama fitur.
6. Jangan mematikan lint hanya untuk membuat CI hijau.

## Dokumentasi

- `docs/cms-compatibility.md` — kontrak data dan view CMS.
- `docs/cms-icon-contract.md` — kontrak ikon Font Awesome dan fallback.
- `docs/code-style.md` — aturan penulisan kode.
- `docs/tailwind-architecture.md` — aturan styling Tailwind.
- `docs/ui-direction.md` — arah visual dan UX.

## Lisensi

Tema Madya dirilis di bawah MIT License. Dependency dan Sekolahku CMS tetap mengikuti lisensinya masing-masing.

## Perilaku interaktif

Tema hanya menampilkan kontrol yang memiliki perilaku nyata.

- Pencarian header membuka dialog dan mengirim kata kunci ke `/news?search=...`, mengikuti kemampuan pencarian berita CMS.
- Pengurutan berita di playground diproses JavaScript menggunakan data yang tersedia (`published_at`, `view_count`, dan judul); pada CMS server tetap menjadi sumber data utama.
- Filter rich component seperti prestasi, agenda, galeri, FAQ, dan tenaga pengajar diproses JavaScript dari data CMS yang sudah tersedia, bukan membuat endpoint baru.
- Galeri memiliki lightbox untuk melihat gambar berukuran besar.
- Navbar desktop memiliki menu `Lainnya` otomatis saat item melebihi ruang yang tersedia.
- Tautan ke rich component menggunakan pola `/#section` agar tetap menuju homepage ketika dipanggil dari halaman lain.

## Prinsip data

Nilai demo boleh berbeda dari data sekolah sebenarnya, tetapi bentuk objeknya mengikuti kontrak CMS Sekolahku. View PHP tidak boleh mengandalkan field yang tidak disuplai controller CMS. Playground menggunakan data berbentuk CMS untuk memastikan komponen yang terlihat dapat diuji tanpa instalasi CMS.
