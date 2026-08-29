# Tema Madya CMS Sekolahku

Tema website sekolah yang modern, tenang, dan editorial untuk **Sekolahku CMS 3.1.2**.

Madya dirancang agar informasi sekolah terasa lebih mudah dibaca tanpa kehilangan kesan formal dan terpercaya. Homepage dibuat ringkas, sementara konten yang lebih panjang tetap memiliki halaman khusus.

> **Modern untuk dilihat. Sederhana untuk digunakan.**

## Mencoba Madya

Tidak perlu menjalankan Sekolahku CMS untuk melihat dan mencoba tampilannya.

```bash
npm install
npm run dev
```

Buka alamat Vite, biasanya:

```text
http://localhost:5173/
```

Mode ini menggunakan data contoh dari `playground/data/demo.json`.

### Halaman demo

```text
/
/news
/news/membuka-semester-dengan-semangat-baru
/downloads
/contact
```

Beranda juga memiliki navigasi section seperti `#profile`, `#programs`, `#gallery`, dan `#faq`.

## Untuk Developer

Source tema PHP berada di:

```text
src/theme/app/Views/themes/madya/
```

Frontend berada di:

```text
src/css/
src/js/
```

Demo HTML berada di:

```text
playground/
```

Struktur utamanya:

```text
src/
├── theme/
│   └── app/Views/themes/madya/
│       ├── pages/
│       ├── layouts/
│       ├── components/
│       ├── partials/
│       └── theme.json
│
├── css/
└── js/

playground/
└── data/
    └── demo.json
```

## Kontrak View Sekolahku

Enam view utama mengikuti contract controller CMS dan tidak boleh diganti namanya:

```text
pages/home.php
pages/news.php
pages/single_post.php
pages/downloads.php
pages/contact.php
pages/page.php
```

Di bawah view tersebut, layout, component, partial, CSS, dan JavaScript dapat dikembangkan secara bebas.

## Styling dengan Tailwind

Madya menggunakan **Tailwind CSS 4** sebagai fondasi styling. Tailwind tetap tersedia langsung di HTML dan PHP theme, sehingga utility seperti `flex`, `grid`, `gap-6`, `text-brand`, `bg-surface-alt`, dan utility responsive dapat digunakan tanpa membuat class baru.

Design token Madya didefinisikan melalui `@theme`, sedangkan komponen visual utama ditempatkan pada `@layer components` dan menggunakan `@apply` jika padanannya tersedia. Custom `@utility` hanya digunakan untuk kebutuhan yang memang tidak cukup diwakili utility bawaan.

Prinsipnya:

```text
Tailwind utilities
        ↓
Madya design tokens (@theme)
        ↓
Reusable components (@layer components)
        ↓
Page-specific composition
```

CSS manual tetap digunakan hanya untuk perilaku yang memang membutuhkan deklarasi khusus, misalnya positioning submenu dinamis, custom easing, view transition, atau fallback browser.

Source scanning Tailwind mencakup view PHP, JavaScript, dan playground sehingga class utility yang ditulis langsung pada markup tetap ikut dibangun.

## HTML-only Development

Madya memiliki entry point standalone di `playground/index.html`.
File tersebut memuat `playground/app.js`, yang kemudian mengimpor source aplikasi dari `src/js/app.js`.
Dengan pola ini, `npm run dev` dan `npm run dev:html` menggunakan server dan dependency graph yang sama.


Madya memiliki playground standalone sehingga tampilan dapat dikerjakan tanpa PHP, database, atau aplikasi CI4.

```bash
npm run dev
```

`npm run dev:html` juga tersedia sebagai alias dari perintah yang sama.

Static preview:

```bash
npm run build:html
```

Hasilnya berada di `dist-html/` dan dapat dipreview sebagai website statis.

## Hybrid MPA + SPA

Madya menggunakan progressive enhancement.

Section di homepage dapat ditingkatkan melalui JavaScript:

```text
#profile
#programs
#gallery
#faq
```

Sementara halaman yang memiliki URL sendiri tetap menggunakan route native:

```text
/news
/news/{slug}
/downloads
/contact
/pages/{slug}
```

Dengan pendekatan ini, JavaScript memperhalus pengalaman navigasi tanpa menjadi syarat utama agar website dapat digunakan.

## Navigasi

Satu struktur menu CMS digunakan untuk desktop dan mobile.

Desktop memiliki submenu bertingkat dengan open/close yang diberi jeda halus, penempatan yang menyesuaikan viewport, keyboard support, dan focus handling.

Mobile menggunakan navigasi bertingkat sehingga menu yang dalam tetap mudah dipahami.

## Ikon & Visual Interaktif

Madya menggunakan **bundled Tabler-style inline SVG icons** untuk ikon antarmuka agar icon tetap konsisten, tajam, dan tidak bergantung pada runtime icon package eksternal.

Untuk memberikan sedikit identitas sekolah pada area hero, Madya menyediakan miniatur kampus berbasis **Three.js** yang dimuat secara lazy. Scene ini hanya aktif pada perangkat yang sesuai dan tidak menjadi ketergantungan untuk fungsi utama website.

Demo standalone juga dilengkapi foto contoh untuk sekolah, guru, siswa, kegiatan, prestasi, berita, dan galeri agar struktur layout dapat dinilai dengan konten yang lebih realistis.

## Tipografi

Madya menggunakan:

- **Instrument Sans** untuk body dan interface.
- **Newsreader** untuk display dan heading editorial.

Font dimuat melalui Google Fonts CDN dengan preconnect dan `display=swap`.

## SEO, Aksesibilitas, dan Performance

Madya memperhatikan:

- HTML semantic;
- heading hierarchy;
- canonical URL;
- Open Graph;
- structured data untuk konten yang relevan;
- keyboard navigation;
- focus state;
- reduced motion;
- intrinsic image dimensions;
- responsive images bila tersedia dari CMS;
- LCP, CLS, dan INP.

## Perintah yang Sering Dipakai

```bash
npm install
npm run dev
npm run dev:html
npm run check
npm run validate
npm run test
npm run build
npm run build:html
npm run release
```

## Release

Gunakan semantic versioning, misalnya:

```text
v1.0.0
```

Release melalui:

```bash
npm run release
```

Perintah tersebut melakukan pemeriksaan, validasi theme, build asset, validasi package, lalu membuat ZIP production.

Contoh:

```text
release/tema-madya-cms-sekolahku-1.0.0.zip
```

GitHub Actions menggunakan pipeline yang sama untuk membuat release otomatis dari Git tag.

## Struktur Package Production

Package yang dikirim ke CMS hanya berisi bagian yang diperlukan theme:

```text
madya/
├── app/
│   └── Views/
│       └── themes/
│           └── madya/
│               ├── pages/
│               ├── layouts/
│               ├── components/
│               ├── partials/
│               └── theme.json
│
└── public/
    └── themes/
        └── madya/
            └── assets/
```

File development seperti playground, test, dan tooling tidak ikut dibawa ke package production.

## Status

**Release Candidate — 0.3.0-rc.3**

Sebelum production release, lakukan verifikasi terakhir pada browser nyata, responsive layout, accessibility, SEO, Core Web Vitals, dan integrasi dengan Sekolahku CMS 3.1.2.

## Lisensi

Tema Madya CMS Sekolahku dirilis di bawah **MIT License**. Lihat file `LICENSE` untuk ketentuan lengkap.

Sekolahku CMS dan dependency pihak ketiga tetap mengikuti lisensinya masing-masing.

---

**Tema Madya CMS Sekolahku**  
*Modern untuk dilihat. Sederhana untuk digunakan.*

## Instalasi sebagai Theme Pihak Ketiga di Sekolahku 3.1.2

Sekolahku 3.1.2 merender public page melalui nama view tetap (`pages/home`, `pages/news`, `pages/single_post`, `pages/downloads`, `pages/contact`, `pages/page`) dan tidak menyediakan theme resolver yang dapat dipakai theme pihak ketiga. Karena Madya tidak mengubah core CMS, package production menyertakan **public view adapter** pada `app/Views/pages/`.

Adapter tersebut hanya mendelegasikan view publik ke:

```text
app/Views/themes/madya/pages/
```

Jadi instalasi package dilakukan dengan menyalin isi package `madya/` ke root instalasi Sekolahku 3.1.2. Tidak diperlukan perubahan pada controller, route, model, migration, atau source core CMS.

> Catatan upgrade: karena Sekolahku 3.1.2 tidak mempunyai hook theme resolver, adapter `app/Views/pages/*.php` adalah integration seam milik theme. Saat upgrade CMS, pastikan file adapter Madya tetap ada atau pasang ulang package Madya setelah upgrade.

Madya tidak mengandalkan `theme_color` CMS sebagai theme selector; token visual Madya didefinisikan sendiri di asset theme.

## RC9 Header & Navigation

Header/navigation is screenshot-led from `homepage.png` while retaining production readability and accessibility. Desktop navigation begins at 960px, mobile navigation uses level-based drill-down, and the playground demo includes intentionally deep recursive menu branches for QA.
