# Panduan Instalasi Tema Madya

Panduan ini ditujukan untuk pengguna yang belum terbiasa dengan struktur file CMS.

## 1. Backup terlebih dahulu

Sebelum memasang tema:

1. Backup database CMS SekolahKu.
2. Backup folder `app` dan `public` dari instalasi CMS yang sedang berjalan.
3. Pastikan backup dapat dipulihkan sebelum melanjutkan.

## 2. Siapkan file release

File release Tema Madya memiliki struktur:

```text
app/
public/
```

## 3. Upload ke server

Masuk ke **File Manager/cPanel** atau gunakan FTP/SFTP.

Upload file:

```text
tema-madya-cms-sekolahku-X.Y.Z.zip
```

ke folder utama instalasi CMS SekolahKu, yaitu folder yang juga berisi `app`, `public`, dan file aplikasi lainnya.

## 4. Extract ZIP

Extract ZIP langsung di folder utama CMS.

Setelah selesai, struktur pentingnya harus terlihat seperti:

```text
CMS SekolahKu/
├── app/
│   └── Views/
│       ├── pages/
│       └── themes/
└── public/
    └── themes/
```

### Jangan sampai menjadi

```text
CMS SekolahKu/
└── tema-madya/
    ├── app/
    └── public/
```

Jika hasil extract seperti contoh kedua, pindahkan/merge isi `app` dan `public` ke folder utama CMS.

## 5. Jika muncul pilihan Replace/Merge

Tema Madya memang memasang file view adapter dan asset pada lokasi yang diperlukan CMS.

Jika File Manager meminta konfirmasi **Replace/Overwrite**, pastikan Anda sudah membuat backup pada langkah pertama, kemudian lanjutkan sesuai instruksi deployment tema.

## 6. Bersihkan cache

Setelah instalasi:

1. Logout dari admin.
2. Bersihkan cache aplikasi/CMS jika tersedia.
3. Bersihkan cache browser.
4. Buka ulang website dengan hard refresh.

## 7. Periksa website

Cek minimal:

- Homepage
- Menu desktop
- Menu mobile
- Halaman berita
- Detail berita
- Halaman statis
- Download/dokumen
- Kontak
- Footer
- Login/admin CMS

## 8. Jika website error

Jangan langsung menghapus file CMS.

Catat:

- URL yang error
- pesan error lengkap
- file dan nomor baris yang disebutkan
- perubahan terakhir yang dilakukan

Kemudian pulihkan backup jika diperlukan.

## Catatan penting

Tema Madya mengikuti contract data dan struktur view CMS SekolahKu. Jangan mengubah nama key JSON, nama field database, atau struktur array yang diberikan controller hanya agar tampilan terlihat benar. Perubahan seperti itu dapat menyebabkan error pada view.

