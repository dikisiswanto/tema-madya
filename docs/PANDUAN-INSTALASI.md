# Panduan Instalasi Tema Madya

Panduan ini ditujukan untuk pengguna yang tidak perlu memahami pemrograman.

## 1. Backup terlebih dahulu

Sebelum memasang tema, lakukan backup file CMS Sekolahku dan database. Ini penting agar instalasi dapat dikembalikan jika terjadi masalah.

## 2. Extract paket release

Paket release Madya berisi dua folder di root ZIP:

```text
app/
public/
```

Jangan membuat folder baru bernama `madya` lalu meletakkan kedua folder tersebut di dalamnya.

## 3. Upload ke root CMS

Upload isi paket ke **root instalasi Sekolahku CMS 3.1.2** sehingga struktur akhirnya tetap seperti:

```text
ROOT-CMS/
├── app/
└── public/
```

Jika File Manager meminta konfirmasi merge atau replace folder/file, pilih opsi yang mempertahankan struktur folder dan mengganti file tema dengan versi dari paket.

## 4. Bersihkan cache

Setelah upload selesai, bersihkan cache aplikasi/browser jika CMS masih menampilkan asset atau tampilan versi sebelumnya.

## 5. Periksa website

Buka homepage dan cek:

- menu desktop;
- menu mobile dan submenu bertingkat;
- berita;
- halaman statis;
- dokumen/download;
- kontak;
- asset CSS dan JavaScript.

## Jika tampilan rusak

Jangan mengubah struktur folder `app` atau `public` secara manual. Periksa kembali bahwa paket diekstrak langsung ke root CMS dan bukan ke folder bertingkat.

Jika masalah tetap ada, pulihkan backup dan simpan pesan error dari log CMS untuk pemeriksaan lebih lanjut.
