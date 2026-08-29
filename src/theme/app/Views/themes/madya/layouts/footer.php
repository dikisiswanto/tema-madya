</main>
<footer class="site-footer" role="contentinfo">
    <div class="theme-container footer-grid">
        <div class="footer-intro">
            <span class="footer-kicker"><?= esc($site_name ?? 'SekolahKu') ?></span>
            <h2>Informasi yang dekat, sekolah yang terasa terbuka.</h2>
            <p><?= esc($footer_description ?? $site_description ?? $site_tagline ?? '') ?></p>
            <?php if (!empty($contact_address)): ?><address><?= esc($contact_address) ?></address><?php endif; ?>
        </div>
        <div>
            <h3 class="footer-title">Navigasi</h3>
            <div class="footer-links">
                <a href="<?= base_url() ?>">Beranda</a>
                <a href="<?= base_url('news') ?>">Berita</a>
                <a href="<?= base_url('downloads') ?>">Dokumen</a>
                <a href="<?= base_url('contact') ?>">Kontak</a>
            </div>
        </div>
        <div>
            <h3 class="footer-title"><i data-lucide="message-circle" aria-hidden="true"></i> Kontak</h3>
            <div class="footer-links">
                <?php if (!empty($contact_phone)): ?><a href="tel:<?= esc($contact_phone) ?>"><?= esc($contact_phone) ?></a><?php endif; ?>
                <?php if (!empty($contact_email)): ?><a href="mailto:<?= esc($contact_email) ?>"><?= esc($contact_email) ?></a><?php endif; ?>
                <?php if (!empty($contact_hours)): ?><span><?= esc($contact_hours) ?></span><?php endif; ?>
            </div>
        </div>
        <div>
            <h3 class="footer-title"><i data-lucide="users" aria-hidden="true"></i> Ikuti</h3>
            <div class="footer-links">
                <?php if (!empty($social_facebook) && $social_facebook !== '#'): ?><a href="<?= esc($social_facebook) ?>" target="_blank" rel="noopener">Facebook</a><?php endif; ?>
                <?php if (!empty($social_instagram) && $social_instagram !== '#'): ?><a href="<?= esc($social_instagram) ?>" target="_blank" rel="noopener">Instagram</a><?php endif; ?>
                <?php if (!empty($social_youtube) && $social_youtube !== '#'): ?><a href="<?= esc($social_youtube) ?>" target="_blank" rel="noopener">YouTube</a><?php endif; ?>
                <?php if (!empty($social_tiktok) && $social_tiktok !== '#'): ?><a href="<?= esc($social_tiktok) ?>" target="_blank" rel="noopener">TikTok</a><?php endif; ?>
            </div>
        </div>
    </div>
    <div class="footer-bottom"><div class="theme-container"><p>© <?= date('Y') ?> <?= esc($site_name ?? 'SekolahKu') ?><?= !empty($footer_copyright) ? ' — ' . esc($footer_copyright) : '' ?></p><a href="https://sekolahku.web.id" target="_blank" rel="noopener">CMS SekolahKu</a></div></div>
</footer>
<script defer src="<?= base_url($theme_asset_base ?? 'themes/madya/assets') ?>/app.js"></script>
</body>
</html>
