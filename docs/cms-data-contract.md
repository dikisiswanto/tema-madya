# Kontrak Data CMS SekolahKu

Dokumen ini menjelaskan aturan agar data demo playground dan view PHP Madya mengikuti data yang benar-benar disediakan SekolahKu CMS 3.1.2.

## Prinsip

- CMS adalah sumber kebenaran untuk nama field dan bentuk data.
- `playground/data/demo.json` boleh memakai nilai contoh sendiri, tetapi bentuk objek dan nama field harus mengikuti CMS. Field ekstra untuk kebutuhan UI tidak boleh disamarkan sebagai field CMS; gunakan fallback di renderer/adapter.
- View PHP hanya boleh membaca variabel yang disuplai controller CMS.
- View PHP tidak boleh membuat query model baru untuk melengkapi data yang tidak disuplai controller.
- Playground tidak boleh menganggap data yang hanya tersedia pada halaman lain tersedia di homepage.

## Data homepage

Controller homepage CMS menyediakan `programs`, `extracurriculars`, `teachers`, `achievements`, `testimonials`, `news`, `events`, `galleries`, dan `faq`, serta data setting dan `principal`/`about`.

`downloads` bukan bagian dari data homepage CMS. Karena itu section dokumen dinamis tidak boleh mengambil `DownloadModel` dari view homepage. Halaman `/downloads` mempunyai kontraknya sendiri melalui `categories`.

## Program dan ekstrakurikuler

Program memakai `icon`, `title`, dan `description`. Ekstrakurikuler memakai `icon`, `icon_color`, `title`, dan `description`. Gambar bukan bagian dari kontrak kedua collection tersebut.

## Validasi

Gunakan:

```bash
npm run audit:cms-data
```

Audit ini memeriksa field inti demo agar tidak terjadi kasus data sudah ada di JSON tetapi renderer tidak bisa menemukannya karena nama/struktur berbeda.

## Konteks halaman

Data demo dapat memuat collection yang dipakai beberapa halaman sekaligus. Itu tidak berarti semua collection tersedia pada setiap controller CMS. Renderer homepage hanya boleh mengandalkan contract `Home::index()`. Renderer `/downloads` memakai contract `Downloads::index()`, termasuk `categories`. Dengan aturan ini data demo tetap lengkap untuk preview, tetapi tidak membuat PHP view mengarang data yang tidak disuplai CMS.
