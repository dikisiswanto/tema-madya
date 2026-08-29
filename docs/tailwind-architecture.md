# Arsitektur Styling Tailwind Madya

Madya menggunakan Tailwind CSS 4 sebagai fondasi styling. `src/css/app.css` adalah entry CSS utama untuk theme dan playground.

## Lapisan

```text
@import "tailwindcss"
        ↓
@source
        ↓
@theme
        ↓
@layer base
        ↓
@utility
        ↓
@layer components
```

### `@source`

Source scanning mencakup view PHP, JavaScript, dan playground. Ini membuat utility Tailwind yang ditulis langsung pada HTML/PHP ikut masuk ke build.

### `@theme`

Token warna, font, shadow, easing, dan breakpoint theme didefinisikan di `@theme`. Gunakan utility yang dihasilkan dari token tersebut di markup, misalnya `text-brand`, `bg-surface-alt`, `font-display`, atau `shadow-soft`.

### `@utility`

Digunakan hanya untuk utility yang tidak tersedia secara langsung, seperti `theme-container`, `page-shell`, dan `madya-text-balance`.

### `@layer components`

Class semantic Madya seperti `.button`, `.news-card`, `.page-hero`, dan navigation components hidup di layer component. `@apply` menjadi pilihan pertama ketika utility Tailwind dapat mewakili styling tersebut. CSS manual dipertahankan hanya untuk behavior yang memang membutuhkan deklarasi khusus, misalnya positioning dinamis, custom transition, pseudo-element, dan browser fallback.

## Aturan praktis

1. Utility Tailwind boleh langsung digunakan pada markup HTML/PHP.
2. Token visual bersama didefinisikan di `@theme`, bukan tersebar sebagai nilai baru.
3. Component reusable memakai `@layer components`.
4. Gunakan `@apply` sebelum menulis deklarasi property manual yang padanannya sudah tersedia di Tailwind.
5. Jangan membuat class abstraction untuk satu kali penggunaan jika utility Tailwind sudah cukup.
