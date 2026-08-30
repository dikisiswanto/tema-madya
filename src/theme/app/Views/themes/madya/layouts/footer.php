<footer class="site-footer" role="contentinfo">
    <div class="newsletter-strip faq-strip">
        <div class="theme-container newsletter-inner">
            <div><p class="eyebrow eyebrow-dark">Pertanyaan yang Sering Diajukan</p><h2>Temukan jawaban sebelum menghubungi sekolah.</h2><p>Lihat informasi umum mengenai akademik, layanan, kegiatan, dan administrasi sekolah.</p></div>
            <a class="button button-light" href="<?= base_url('/#faq') ?>"><i data-lucide="circle-help" aria-hidden="true"></i><span>Buka FAQ</span></a>
        </div>
    </div>
    <div class="footer-main">
        <div class="theme-container footer-grid footer-grid-rich">
            <div class="footer-intro">
                <a class="footer-brand" href="<?= base_url() ?>" aria-label="Beranda <?= esc($site_name ?? 'SekolahKu') ?>">
                    <span class="brand-mark footer-brand-mark" aria-hidden="true"><i data-lucide="graduation-cap" aria-hidden="true"></i></span>
                    <span><strong><?= esc($site_logo_text ?? $site_name ?? 'SekolahKu') ?></strong><small><?= esc($site_tagline ?? 'Situs resmi sekolah') ?></small></span>
                </a>
                <p><?= esc($footer_description ?? $site_description ?? $site_tagline ?? '') ?></p>
                <?php if (!empty($contact_address)): ?>
<address><?= esc($contact_address) ?></address>
<?php endif; ?>
            </div>
            <div>
                <h3 class="footer-title">Navigasi</h3>
                <div class="footer-links"><a href="<?= base_url() ?>">Beranda</a><a href="<?= base_url('news') ?>">Berita</a><a href="<?= base_url('downloads') ?>">Dokumen</a><a href="<?= base_url('contact') ?>">Kontak</a></div>
            </div>
            <div>
                <h3 class="footer-title">Program</h3>
                <div class="footer-links">
                <?php $footerProgramItems = is_array($footer_services ?? null) ? $footer_services : (json_decode($footer_services ?? '[]', true) ?: []); ?>
                <?php if ($footerProgramItems): foreach (array_slice($footerProgramItems, 0, 5) as $item): ?><a href="<?= esc($item['url'] ?? '/#programs') ?>"><?= esc($item['label'] ?? $item['title'] ?? '') ?></a><?php endforeach; ?>
                <?php else: ?><a href="<?= base_url('/#programs') ?>">Program unggulan</a><a href="<?= base_url('/#extracurriculars') ?>">Ekstrakurikuler</a><a href="<?= base_url('/#achievements') ?>">Prestasi</a><?php endif; ?>
                </div>
            </div>
            <div>
                <h3 class="footer-title">Layanan</h3>
                <div class="footer-links">
                <?php $footerServiceLinks = is_array($footer_links ?? null) ? $footer_links : (json_decode($footer_links ?? '[]', true) ?: []); ?>
                <?php if ($footerServiceLinks): foreach (array_slice($footerServiceLinks, 0, 6) as $item): ?><a href="<?= esc($item['url'] ?? '#') ?>"><?= esc($item['label'] ?? $item['title'] ?? '') ?></a><?php endforeach; ?>
                <?php else: ?><a href="<?= esc($spmb_url ?? '#') ?>">SPMB Online</a><a href="#">E-Learning</a><a href="<?= base_url('downloads') ?>">Download Dokumen</a><?php endif; ?>
                </div>
            </div>
            <div class="footer-newsletter-column">
                <h3 class="footer-title">Bantuan</h3>
                <p>Temukan jawaban atau hubungi sekolah melalui kanal resmi.</p>
                <div class="footer-links"><a href="<?= base_url('/#faq') ?>">FAQ</a><a href="<?= base_url('contact') ?>">Hubungi Sekolah</a><a href="<?= base_url('downloads') ?>">Dokumen</a></div>
                <div class="footer-socials">
                    <?php if (!empty($social_facebook) && $social_facebook !== '#'): ?>
<a href="<?= esc($social_facebook) ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i data-lucide="brand-facebook" aria-hidden="true"></i></a>
<?php endif; ?>
                    <?php if (!empty($social_instagram) && $social_instagram !== '#'): ?>
<a href="<?= esc($social_instagram) ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i data-lucide="brand-instagram" aria-hidden="true"></i></a>
<?php endif; ?>
                    <?php if (!empty($social_youtube) && $social_youtube !== '#'): ?>
<a href="<?= esc($social_youtube) ?>" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i data-lucide="brand-youtube" aria-hidden="true"></i></a>
<?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-bottom"><div class="theme-container"><p><?= esc($footer_copyright ?? ('© ' . date('Y') . ' ' . ($site_name ?? 'SekolahKu'))) ?></p><span>Dibuat dengan <strong>♥</strong> menggunakan <a href="https://sekolahku.web.id" target="_blank" rel="noopener noreferrer">CMS SekolahKu</a> · <a href="https://github.com/dikisiswanto/tema-madya" target="_blank" rel="noopener noreferrer">Tema Madya</a> oleh <a href="https://silirdev.com" target="_blank" rel="noopener noreferrer">silirdev</a></span></div></div>
</footer>
<script defer src="<?= base_url($theme_asset_base ?? 'themes/madya/assets') ?>/app.js"></script>
</body>
</html>
