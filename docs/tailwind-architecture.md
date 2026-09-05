# Arsitektur Tailwind

Madya menggunakan Tailwind CSS 4.

`src/css/app.css` adalah entry point dan tidak lagi menyimpan seluruh component CSS. File-file kecil di bawahnya dipisahkan berdasarkan tanggung jawab visual sehingga perubahan satu area tidak perlu menyentuh stylesheet monolitik.

```text
app.css
├─ base.css
└─ components/
   ├─ primitives.css
   ├─ navigation-core.css
   ├─ typography-core.css
   ├─ home-core.css
   ├─ pages-core.css
   ├─ content-core.css
   ├─ footer-core.css
   ├─ 
   ├─ 
   ├─ interaction.css
   ├─ home-*.css
   ├─ agenda-row.css
   ├─ rich-*.css / shared-rich.css
   ├─ news-*.css
   ├─ static-page-core.css
   ├─ profile-page.css
   ├─ contact-page.css
   ├─ downloads-page.css
   ├─ tables-utils.css
   ├─ icons.css
   ├─ site-*.css / home-typography.css
   ├─ media-fallbacks.css
   ├─ home-services.css
   └─ accessibility-motion.css
```

Urutan import mengikuti ownership: fondasi → komponen inti → homepage/rich/news/page components → utility/compatibility contracts → readability/typography refinements.

## Responsive

Gunakan breakpoint bawaan Tailwind 4:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Di template, utamakan utility responsive seperti `@apply md:grid-cols-2 lg:grid-cols-3 xl:gap-8`. Di CSS komponen, gunakan `@variant md`, `@variant lg`, `@variant xl`, `@variant 2xl` atau `max-*` ketika aturan memang harus berada di layer komponen. Jangan menambah breakpoint custom berbasis pixel/rem.

`@media` hanya dipertahankan untuk fitur non-breakpoint seperti `prefers-reduced-motion`.

## Typography

Gunakan skala ukuran teks native Tailwind (`text-xs` sampai `text-9xl`) sebagai default. Hindari `font-size` fixed manual dan `text-[...rem]` arbitrary untuk ukuran teks biasa. Perbedaan ukuran antar viewport harus memakai variant Tailwind seperti `md:text-base lg:text-lg`, bukan breakpoint custom.

Fluid `clamp()` hanya dipertahankan untuk display typography yang memang membutuhkan perilaku fluid; ini diperlakukan sebagai pengecualian yang disengaja, bukan skala ukuran teks umum.

## Batas CSS manual

Tailwind utility dan design token `@theme` adalah default. CSS manual hanya untuk kebutuhan yang tidak praktis dengan utility: geometry kompleks, pseudo-element, positioning dinamis, CSS variable runtime, dan browser-specific behavior.

Sumber PHP, JavaScript, dan playground ikut dipindai Tailwind. Jangan menggunakan `overflow` untuk menyembunyikan bug layout.
