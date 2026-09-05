<?php
helper('menu');
$this->include('themes/madya/partials/navigation/menu');
$tree = $menu_tree ?? get_menu_tree($section_settings ?? null);
$brandSocialIcon = static function (string $name): string {
    $classes = [
        'facebook' => 'fab fa-facebook-f',
        'instagram' => 'fab fa-instagram',
        'youtube' => 'fab fa-youtube',
        'tiktok' => 'fab fa-tiktok',
    ];
    return '<i class="' . esc($classes[$name] ?? 'fas fa-globe') . '" aria-hidden="true"></i>';
}?>
<div class="site-topbar">
    <div class="theme-container topbar-inner">
        <div class="topbar-contact">
            <?php if (!empty($contact_address)): ?>
<span><i data-lucide="map-pin" aria-hidden="true"></i><?= esc($contact_address) ?></span>
<?php endif; ?>
            <?php if (!empty($contact_phone)): ?>
<a href="tel:<?= esc($contact_phone) ?>"><i data-lucide="phone" aria-hidden="true"></i><?= esc($contact_phone) ?></a>
<?php endif; ?>
            <?php if (!empty($contact_email)): ?>
<a href="mailto:<?= esc($contact_email) ?>"><i data-lucide="mail" aria-hidden="true"></i><?= esc($contact_email) ?></a>
<?php endif; ?>
        </div>
        <div class="topbar-links">
<?php if (!empty($social_facebook) && $social_facebook !== '#'): ?>
<a href="<?= esc($social_facebook) ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><?= $brandSocialIcon('facebook') ?></a>
<?php endif; ?>
            <?php if (!empty($social_instagram) && $social_instagram !== '#'): ?>
<a href="<?= esc($social_instagram) ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><?= $brandSocialIcon('instagram') ?></a>
<?php endif; ?>
            <?php if (!empty($social_youtube) && $social_youtube !== '#'): ?>
<a href="<?= esc($social_youtube) ?>" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><?= $brandSocialIcon('youtube') ?></a>
<?php endif; ?>
            <?php if (!empty($social_tiktok) && $social_tiktok !== '#'): ?>
<a href="<?= esc($social_tiktok) ?>" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><?= $brandSocialIcon('tiktok') ?></a>
<?php endif; ?>
        </div>
    </div>
</div>
<header class="site-header" data-site-nav>
    <div class="theme-container madya-header-inner">
        <a class="brand" href="<?= base_url() ?>" aria-label="Beranda <?= esc($site_name ?? 'SekolahKu') ?>">
<span class="brand-copy"><strong><?= esc($site_logo_text ?? $site_name ?? 'SekolahKu') ?></strong><small><?= esc($site_tagline ?? 'Situs resmi sekolah') ?></small></span>
        </a>
        <nav class="desktop-nav-wrap" aria-label="Navigasi utama"><ul class="desktop-nav"><?php theme_render_menu($tree); ?></ul></nav>
        <button class="header-search" type="button" data-search-open aria-haspopup="dialog" aria-controls="site-search-dialog" aria-label="Buka pencarian berita"><i data-lucide="search" aria-hidden="true"></i></button>
        <?php if (!empty($spmb_url)): ?>
<a class="nav-cta" href="<?= esc($spmb_url) ?>" target="_blank" rel="noopener noreferrer"><span>SPMB Online</span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
<?php endif; ?>
        <button class="mobile-toggle" type="button" data-mobile-menu aria-expanded="false" aria-controls="mobile-navigation"><span class="menu-icon" aria-hidden="true"><span></span><span></span></span><span class="sr-only">Buka menu</span></button>
    </div>
</header>

<aside id="mobile-navigation" class="mobile-nav" aria-label="Navigasi seluler" aria-hidden="true" inert>
    <div class="mobile-nav-inner">
        <div class="mobile-level" id="mobile-navigation-panel-root" data-mobile-level="root" data-active="true" aria-hidden="false">
            <div class="mobile-nav-intro">
                <span class="eyebrow">Navigasi</span>
                <p>Temukan informasi sekolah berdasarkan kebutuhan Anda.</p>
            </div>
            <?php theme_render_menu($tree, true); ?>
            <?php if (!empty($spmb_url)): ?>
<a class="mobile-menu-cta" href="<?= esc($spmb_url) ?>" target="_blank" rel="noopener noreferrer"><span>SPMB Online</span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
<?php endif; ?>
        </div>
        <?php foreach (theme_collect_mobile_levels($tree) as [$item, $key]): ?>
            <div class="mobile-level" id="mobile-navigation-panel-<?= esc($key) ?>" data-mobile-level="<?= esc($key) ?>" data-active="false" aria-hidden="true">
                <button class="mobile-back" type="button" data-mobile-back aria-label="Kembali ke menu sebelumnya"><i data-lucide="arrow-left" aria-hidden="true"></i> Kembali</button>
                <p class="mobile-level-title"><?= esc($item['title'] ?? 'Menu') ?></p>
                <?php theme_render_menu($item['children'], true, 0, $key); ?>
            </div>
        <?php endforeach; ?>
    </div>
</aside>

<div class="search-dialog" id="site-search-dialog" data-search-dialog hidden aria-hidden="true">
    <div class="search-dialog-backdrop" data-search-close></div>
    <section class="search-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="site-search-title">
        <button class="search-dialog-close" type="button" data-search-close aria-label="Tutup pencarian"><i data-lucide="x" aria-hidden="true"></i></button>
        <p class="eyebrow">Pencarian</p>
        <h2 id="site-search-title">Cari berita sekolah.</h2>
        <p class="search-dialog-copy">Masukkan kata kunci untuk menemukan berita yang relevan.</p>
        <form class="search-dialog-form" action="<?= base_url('news') ?>" method="get" data-search-form role="search">
            <label for="site-search-input" class="sr-only">Kata kunci berita</label>
            <input id="site-search-input" name="search" type="search" placeholder="Cari berita…" autocomplete="off" enterkeyhint="search" required>
            <button class="button button-accent" type="submit"><i data-lucide="search" aria-hidden="true"></i><span>Cari Berita</span></button>
        </form>
        <p class="search-dialog-hint">Hasil pencarian akan dibuka pada halaman Berita.</p>
    </section>
</div>
