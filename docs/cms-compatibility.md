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
## Data boundary: Playground vs CMS

Playground dan CMS sengaja memiliki sumber data yang berbeda:

- `playground/data/demo.json` adalah satu-satunya sumber data demo untuk standalone/playground.
- View PHP Madya hanya mengonsumsi variabel yang disuplai controller SekolahKu 3.1.2.
- View PHP tidak boleh mengimpor model CMS, membaca `$_GET` untuk membuat fitur baru yang tidak didukung controller, atau mengambil data dari demo.
- Fallback pada PHP hanya boleh bersifat presentational dan generik; tidak boleh mengarang identitas sekolah, nama guru/kepala sekolah, sambutan, atau foto orang tertentu.
- Fallback foto orang menggunakan placeholder netral; data CMS yang tersedia selalu diprioritaskan.
- Rich components pada homepage CMS dirender dari data PHP CMS. SPA hanya merupakan progressive enhancement pada playground/standalone shell yang memiliki `[data-spa-content][data-spa-runtime="standalone"]`.
- Halaman native (`/news`, `/news/{slug}`, `/downloads`, `/contact`, dan static page) tidak boleh menyediakan SPA shell dan tidak boleh diintercept oleh SPA router.
- Breadcrumb halaman native dirender server-side oleh `components/page-header.php` sehingga tetap tersedia ketika URL dibuka langsung, direfresh, atau diakses tanpa JavaScript.

