# Audit Contract Madya × Sekolahku CMS 3.1.2

Baseline: `tema-madya-main_11.zip` dibandingkan dengan `cms-sekolahku-v3.1.2.zip`, terutama `app/Views/pages/*`, controller publik, dan implementasi `CodeIgniter\View\View::include()`.

## Akar masalah utama

Pada CodeIgniter 4.6 yang dibundel CMS, signature renderer adalah:

```php
$this->include(string $view, ?array $options = null, $saveData = true)
```

Argumen kedua adalah **render options**, bukan data view. Karena itu pola Madya berikut tidak mem-passing variable ke child view:

```php
$this->include('themes/madya/components/page-header', ['title' => $title])
```

Dampaknya saling terkait:

1. Icon homepage yang dirender lewat `components/ui/icon.php` menerima fallback `graduation-cap`, bukan icon item CMS.
2. `page-header.php` tidak menerima `title`, `description`, `image`, dan `breadcrumbs`, sehingga hero/breadcrumb internal page hilang atau kosong.
3. `news-card.php` tidak menerima `$post`, sehingga feed utama `/news` tidak memakai item dari `$news`, walaupun `$recent_news` tetap tampil karena sidebar dirender langsung di parent view.
4. Override SEO/header (`page_title`, `page_description`, canonical, structured data, OG image) juga tidak pernah masuk ke `layouts/header.php`.

## Contract controller yang dipertahankan

Madya tetap mengonsumsi nama variable asli Sekolahku CMS: `$news`, `$categories`, `$recent_news`, `$page_banners`, `$site_logo_icon`, `$footer_copyright`, `$section_settings`, dan data publik lainnya. Tidak ada perubahan controller/core CMS.

## Perbaikan

- Header layout: override metadata dimasukkan ke renderer menggunakan `$this->setData([...])`, kemudian layout di-include normal.
- Component props lokal: gunakan `view('...', [...])` untuk `icon`, `page-header`, `news-card`, dan `empty-state`.
- Logo footer sekarang mengikuti `$site_logo_icon` melalui component icon yang sama dengan navigation.
- Attribution footer “Dibuat dengan ♥ …” dipertahankan; markup memang sudah ada pada baseline dan diverifikasi tetap tampil sebagai bagian footer-bottom.

## Validasi

- Seluruh file PHP di `src/theme/app/Views/themes/madya` lolos `php -l`.
- Tidak tersisa pola `$this->include(..., [data])` pada view Madya.
- Test browser belum dijalankan karena dependency npm (`vite`, `@tailwindcss/vite`, `three`) tidak tersedia pada sandbox baseline.
