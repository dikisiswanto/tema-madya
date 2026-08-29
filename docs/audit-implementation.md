# Madya 0.3.0 RC.1 — Implementation Audit

## Scope

Audit and alignment terhadap screenshot desain Madya, design direction, Tailwind architecture, dan batas integrasi Sekolahku CMS 3.1.2 sebagai theme pihak ketiga.

## Keputusan integrasi CMS

Sekolahku CMS 3.1.2 merender enam public view dengan nama tetap:

- `pages/home`
- `pages/news`
- `pages/single_post`
- `pages/downloads`
- `pages/contact`
- `pages/page`

Karena theme pihak ketiga tidak boleh mengubah core, Madya menggunakan **public view adapter**. Package production menyalin enam adapter ke `app/Views/pages/`, sementara implementasi Madya tetap berada di `app/Views/themes/madya/pages/`.

Tidak ada perubahan controller, route, model, migration, atau source core CMS.

## Implemented

- Finalized navy/gold visual tokens sesuai design direction.
- Added institutional topbar, search affordance, dan SPMB CTA.
- Reworked page hero agar mendukung photography-led background.
- Reworked homepage menjadi information-rich editorial composition.
- Added quick service rail.
- Added announcement block berbasis berita kategori `Pengumuman`.
- Added principal/profile block yang memanfaatkan data CMS yang tersedia.
- Added richer news metadata: category, author, view count.
- Reworked news search state (`Hasil Pencarian`).
- Reworked downloads information architecture dengan statistics, toolbar, list, dan category sidebar.
- Reworked contact page dengan summary cards dan help panel.
- Reworked footer dengan newsletter surface, program, layanan, kontak, dan social links.
- Added public-view adapters dan release packaging support.
- Preserved progressive enhancement, semantic HTML, keyboard navigation, mobile drill-down, dan native CMS routes.

## Data-contract limits

Beberapa detail screenshot tidak dapat dibuat dinamis karena CMS 3.1.2 tidak menyediakan data tersebut kepada controller theme:

- logo image URL;
- announcement model khusus;
- download count/popularity;
- WhatsApp setting khusus;
- NPSN/accreditation sebagai setting terpisah;
- map coordinates/map URL;
- newsletter subscription endpoint;
- download listing pada Home controller.

Theme tidak memalsukan data tersebut. Komponen hanya merender fallback atau CTA jika data yang tersedia mendukungnya.

## Validation

Berhasil:

- `npm run validate`
- PHP syntax check untuk theme views dan public-view adapters.
- Node syntax check untuk JavaScript utama, router, state, native views, dan release/validation scripts.

Belum dijalankan di environment audit:

- `npm run build`
- Playwright browser tests

Alasannya dependency npm pada environment audit tidak lengkap dan instalasi dependency tidak dapat diselesaikan. Source tetap disiapkan agar build normal dapat dijalankan pada environment development dengan `npm install`.
