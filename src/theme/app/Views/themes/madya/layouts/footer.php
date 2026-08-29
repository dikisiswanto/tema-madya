<?php
$footerBrandSocialIcon = static function (string $name): string {
    $paths = [
        'facebook' => '<path d="M15 2h3V0h-3c-3.31 0-6 2.69-6 6v3H6v3h3v8h3v-8h3l1-3h-4V6c0-1.1.9-2 2-2z"/>',
        'instagram' => '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
        'youtube' => '<path d="M21.58 7.19a2.75 2.75 0 0 0-1.93-1.95C17.95 4.75 12 4.75 12 4.75s-5.95 0-7.65.49a2.75 2.75 0 0 0-1.93 1.95A28.7 28.7 0 0 0 1.95 12a28.7 28.7 0 0 0 .47 4.81 2.75 2.75 0 0 0 1.93 1.95c1.7.49 7.65.49 7.65.49s5.95 0 7.65-.49a2.75 2.75 0 0 0 1.93-1.95A28.7 28.7 0 0 0 22.05 12a28.7 28.7 0 0 0-.47-4.81Z"/><path d="m10 15.25 5-3.25-5-3.25v6.5Z" fill="currentColor" stroke="none"/>',
    ];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . ($paths[$name] ?? '') . '</svg>';
};
?>
<footer class="site-footer" role="contentinfo">
    <div class="newsletter-strip">
        <div class="theme-container newsletter-inner">
            <div><p class="eyebrow eyebrow-dark">Tetap terhubung</p><h2>Informasi sekolah, langsung ke kotak masuk.</h2><p>Gunakan kanal resmi sekolah untuk mendapatkan pengumuman dan informasi terbaru.</p></div>
            <form class="newsletter-form" action="#" method="post" onsubmit="return false">
                <label class="sr-only" for="footer-newsletter-email">Alamat email</label>
                <input id="footer-newsletter-email" type="email" placeholder="Masukkan email Anda" autocomplete="email">
                <button class="button button-light" type="submit" aria-label="Berlangganan newsletter"><i data-lucide="send" aria-hidden="true"></i><span>Berlangganan</span></button>
            </form>
        </div>
    </div>
    <div class="footer-main">
        <div class="theme-container footer-grid footer-grid-rich">
            <div class="footer-intro">
                <a class="footer-brand" href="<?= base_url() ?>" aria-label="Beranda <?= esc($site_name ?? 'SekolahKu') ?>">
                    <span class="brand-mark footer-brand-mark" aria-hidden="true"><i data-lucide="graduation-cap"></i></span>
                    <span><strong><?= esc($site_logo_text ?? $site_name ?? 'SekolahKu') ?></strong><small><?= esc($site_tagline ?? 'Situs resmi sekolah') ?></small></span>
                </a>
                <p><?= esc($footer_description ?? $site_description ?? $site_tagline ?? '') ?></p>
                <?php if (!empty($contact_address)): ?><address><?= esc($contact_address) ?></address><?php endif; ?>
            </div>
            <div>
                <h3 class="footer-title">Navigasi</h3>
                <div class="footer-links"><a href="<?= base_url() ?>">Beranda</a><a href="<?= base_url('news') ?>">Berita</a><a href="<?= base_url('downloads') ?>">Dokumen</a><a href="<?= base_url('contact') ?>">Kontak</a></div>
            </div>
            <div>
                <h3 class="footer-title">Program</h3>
                <div class="footer-links">
                <?php $footerProgramItems = is_array($footer_services ?? null) ? $footer_services : (json_decode($footer_services ?? '[]', true) ?: []); ?>
                <?php if ($footerProgramItems): foreach (array_slice($footerProgramItems, 0, 5) as $item): ?><a href="<?= esc($item['url'] ?? '#programs') ?>"><?= esc($item['label'] ?? $item['title'] ?? '') ?></a><?php endforeach; else: ?><a href="#programs">Program unggulan</a><a href="#extracurriculars">Ekstrakurikuler</a><a href="#achievements">Prestasi</a><?php endif; ?>
                </div>
            </div>
            <div>
                <h3 class="footer-title">Layanan</h3>
                <div class="footer-links">
                <?php $footerServiceLinks = is_array($footer_links ?? null) ? $footer_links : (json_decode($footer_links ?? '[]', true) ?: []); ?>
                <?php if ($footerServiceLinks): foreach (array_slice($footerServiceLinks, 0, 6) as $item): ?><a href="<?= esc($item['url'] ?? '#') ?>"><?= esc($item['label'] ?? $item['title'] ?? '') ?></a><?php endforeach; else: ?><a href="<?= esc($spmb_url ?? '#') ?>">SPMB Online</a><a href="#">E-Learning</a><a href="<?= base_url('downloads') ?>">Download Dokumen</a><?php endif; ?>
                </div>
            </div>
            <div class="footer-newsletter-column">
                <h3 class="footer-title">Newsletter</h3>
                <p>Dapatkan informasi terbaru dari kami.</p>
                <form class="footer-newsletter-form" action="#" method="post" onsubmit="return false">
                    <label class="sr-only" for="footer-newsletter-email">Masukkan email Anda</label>
                    <input id="footer-newsletter-email" type="email" placeholder="Masukkan email Anda" autocomplete="email">
                    <button class="button button-accent" type="submit" aria-label="Kirim email"><i data-lucide="send" aria-hidden="true"></i></button>
                </form>
                <div class="footer-socials">
                    <?php if (!empty($social_facebook) && $social_facebook !== '#'): ?><a href="<?= esc($social_facebook) ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><?= $footerBrandSocialIcon('facebook') ?></a><?php endif; ?>
                    <?php if (!empty($social_instagram) && $social_instagram !== '#'): ?><a href="<?= esc($social_instagram) ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><?= $footerBrandSocialIcon('instagram') ?></a><?php endif; ?>
                    <?php if (!empty($social_youtube) && $social_youtube !== '#'): ?><a href="<?= esc($social_youtube) ?>" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><?= $footerBrandSocialIcon('youtube') ?></a><?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-bottom"><div class="theme-container"><p><?= esc($footer_copyright ?? ('© ' . date('Y') . ' ' . ($site_name ?? 'SekolahKu'))) ?></p><span>Dibuat dengan <strong>♥</strong> menggunakan CMS SekolahKu</span></div></div>
</footer>
<script defer src="<?= base_url($theme_asset_base ?? 'themes/madya/assets') ?>/app.js"></script>
</body>
</html>
