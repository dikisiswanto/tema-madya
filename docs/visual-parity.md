# Audit Paritas Visual

## Baseline

RC10.12.42 mempertahankan satu arah visual untuk PHP theme dan playground. Playground bukan desain alternatif; playground adalah representasi HTML dari komponen yang juga digunakan oleh asset JavaScript tema.

## Pemeriksaan utama

- Hero memiliki jarak yang cukup dari header dan tetap menggunakan gambar sebagai background.
- Program dan ekstrakurikuler menonjolkan ikon CMS, bukan gambar fiktif.
- Ikon data diberi warna yang aman ketika CMS menyediakan `icon_color`.
- Konten penjelasan menggunakan font body, sedangkan heading memakai font display.
- Profil menonjolkan visi, misi, dan identitas sekolah.
- Breadcrumb tersedia pada rich component dan halaman native.
- Galeri menggunakan lightbox dan tetap merender footer pada route rich component.
- Filter/sortir hanya digunakan ketika dapat diproses dari data yang sudah tersedia.
- Navbar desktop memiliki fallback `Lainnya` untuk item yang tidak muat.
- Link rich component memakai `/#...` agar aman dari halaman lain.
