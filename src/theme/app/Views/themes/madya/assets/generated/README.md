# Generated theme assets

Asset demo/fallback bawaan Madya disimpan langsung di package theme agar playground dan production fallback memakai sumber yang sama.

## Hero production fallback

- `hero-campus.jpg` — 2560×1440, 16:9
- `hero-campus.webp` — alternate optimized format
- Tidak mengandung nama sekolah, logo, atau copy tertanam sehingga aman sebagai fallback lintas sekolah.
- Komposisi menyisakan area visual yang cukup tenang untuk overlay headline.

## Asset rules

- Landscape content assets: minimal 1600px lebar.
- Portrait assets: minimal 1000–1200px lebar.
- Square/testimonial assets: minimal 800px.
- Aspect ratio sumber dipertahankan; tidak ada forced crop untuk sekadar menaikkan resolusi.
- Crop hanya dilakukan pada asset hero agar rasio 16:9 sesuai kebutuhan banner.
- File JPEG tetap menjadi fallback utama; WebP disediakan sebagai alternate ketika pipeline theme memerlukannya.
