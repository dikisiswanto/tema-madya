# Generated theme assets

Asset demo/fallback bawaan Madya disimpan langsung di package theme agar playground dan production fallback memakai sumber yang sama.

## Hero production fallback

- `hero-image.jpg` — 1672×941, 16:9, optimized JPEG fallback untuk production. **Pengecualian:** file ini boleh dipakai sebagai runtime fallback khusus homepage hero.
- Tidak mengandung nama sekolah, logo, atau copy tertanam sehingga aman sebagai fallback lintas sekolah.
- Komposisi menyisakan area visual yang cukup tenang untuk overlay headline.

## Asset rules

- Landscape content assets: minimal 1600px lebar.
- Portrait assets: minimal 1000–1200px lebar.
- Square/testimonial assets: minimal 800px.
- Aspect ratio sumber dipertahankan; tidak ada forced crop untuk sekadar menaikkan resolusi.
- Crop hanya dilakukan pada asset hero agar rasio 16:9 sesuai kebutuhan banner.
- JPEG/WebP/AVIF dapat dipakai sebagai delivery format; source/master tidak dijadikan default delivery bila ukurannya terlalu besar.
