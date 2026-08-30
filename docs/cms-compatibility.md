# Kompatibilitas CMS Sekolahku

Madya adalah tema pihak ketiga untuk Sekolahku CMS 3.1.2. Core CMS, controller, model, route, dan database tidak dimodifikasi.

## Kontrak view

- `pages/home.php`
- `pages/news.php`
- `pages/single_post.php`
- `pages/downloads.php`
- `pages/contact.php`
- `pages/page.php`

View publik tersebut meneruskan rendering ke `themes/madya/`.

## Prinsip data

PHP hanya menggunakan variabel yang disuplai controller CMS. View tidak melakukan query database atau business logic. Data kosong dan nullable harus ditangani dengan aman.

## Dukungan pencarian

`/news` memang mendukung `search`, `category`, `month`, dan pagination melalui controller CMS. Karena itu search berita boleh ditampilkan. `/downloads` tidak menerima parameter pencarian dari controller CMS, sehingga Madya tidak menampilkan search palsu di halaman download.

## Ikon

Ikon dari CMS, terutama class Font Awesome seperti `fas fa-futbol` dan `fa-school`, dipertahankan. `icon_color` ekstrakurikuler divalidasi sebelum diterapkan.
