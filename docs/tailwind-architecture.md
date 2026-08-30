# Arsitektur Tailwind

Madya menggunakan Tailwind CSS 4.

```text
@theme
↓
@layer base
↓
@layer components
↓
utility pada markup
↓
CSS khusus bila benar-benar diperlukan
```

Sumber PHP, JavaScript, dan playground ikut dipindai Tailwind. Jangan menggunakan `overflow` untuk menyembunyikan bug layout.
