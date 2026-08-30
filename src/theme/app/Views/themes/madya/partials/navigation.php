<?php
helper('menu');
$tree = $menu_tree ?? get_menu_tree($section_settings ?? null);
$brandSocialIcon = static function (string $name): string {
    $paths = [
        'facebook' => '<path d="M15 2h3V0h-3c-3.31 0-6 2.69-6 6v3H6v3h3v8h3v-8h3l1-3h-4V6c0-1.1.9-2 2-2z"/>',
        'instagram' => '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
        'youtube' => '<path d="M21.58 7.19a2.75 2.75 0 0 0-1.93-1.95C17.95 4.75 12 4.75 12 4.75s-5.95 0-7.65.49a2.75 2.75 0 0 0-1.93 1.95A28.7 28.7 0 0 0 1.95 12a28.7 28.7 0 0 0 .47 4.81 2.75 2.75 0 0 0 1.93 1.95c1.7.49 7.65.49 7.65.49s5.95 0 7.65-.49a2.75 2.75 0 0 0 1.93-1.95A28.7 28.7 0 0 0 22.05 12a28.7 28.7 0 0 0-.47-4.81Z"/><path d="m10 15.25 5-3.25-5-3.25v6.5Z" fill="currentColor" stroke="none"/>',
    ];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . ($paths[$name] ?? '') . '</svg>';
};
?>
<div class="site-topbar">
    <div class="theme-container topbar-inner">
        <div class="topbar-contact">
            <?php if (!empty($contact_address)): ?><span><i data-lucide="map-pin" aria-hidden="true"></i><?= esc($contact_address) ?></span><?php endif; ?>
            <?php if (!empty($contact_phone)): ?><a href="tel:<?= esc($contact_phone) ?>"><i data-lucide="phone" aria-hidden="true"></i><?= esc($contact_phone) ?></a><?php endif; ?>
            <?php if (!empty($contact_email)): ?><a href="mailto:<?= esc($contact_email) ?>"><i data-lucide="mail" aria-hidden="true"></i><?= esc($contact_email) ?></a><?php endif; ?>
        </div>
        <div class="topbar-links">
            <?php $utilityLinks = is_array($footer_links ?? null) ? $footer_links : (json_decode($footer_links ?? '[]', true) ?: []); ?>
            <?php foreach (array_slice($utilityLinks, 0, 3) as $item): ?><a href="<?= esc($item['url'] ?? '#') ?>"><?= esc($item['label'] ?? $item['title'] ?? '') ?></a><?php endforeach; ?>
            <?php if (!empty($social_facebook) && $social_facebook !== '#'): ?><a href="<?= esc($social_facebook) ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><?= $brandSocialIcon('facebook') ?></a><?php endif; ?>
            <?php if (!empty($social_instagram) && $social_instagram !== '#'): ?><a href="<?= esc($social_instagram) ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><?= $brandSocialIcon('instagram') ?></a><?php endif; ?>
            <?php if (!empty($social_youtube) && $social_youtube !== '#'): ?><a href="<?= esc($social_youtube) ?>" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><?= $brandSocialIcon('youtube') ?></a><?php endif; ?>
        </div>
    </div>
</div>
<header class="site-header" data-site-nav>
    <div class="theme-container header-inner">
        <a class="brand" href="<?= base_url() ?>" aria-label="Beranda <?= esc($site_name ?? 'SekolahKu') ?>">
            <span class="brand-mark" aria-hidden="true"><?php if (!empty($site_logo_url)): ?><img src="<?= esc($site_logo_url) ?>" alt="" width="96" height="96" loading="eager" decoding="async"><?php else: ?><?= $this->include('themes/madya/components/ui/icon', ['name' => $site_logo_icon ?? 'graduation-cap', 'class' => 'brand-icon']) ?><?php endif; ?></span>
            <span class="brand-copy"><strong><?= esc($site_logo_text ?? $site_name ?? 'SekolahKu') ?></strong><small><?= esc($site_tagline ?? 'Situs resmi sekolah') ?></small></span>
        </a>
        <nav class="desktop-nav-wrap" aria-label="Navigasi utama"><ul class="desktop-nav"><?php theme_render_menu($tree); ?></ul></nav>
        <button class="header-search" type="button" data-search-open aria-haspopup="dialog" aria-controls="site-search-dialog" aria-label="Buka pencarian berita"><i data-lucide="search" aria-hidden="true"></i></button>
        <?php if (!empty($spmb_url)): ?><a class="nav-cta" href="<?= esc($spmb_url) ?>" target="_blank" rel="noopener noreferrer"><span>SPMB Online</span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a><?php endif; ?>
        <button class="mobile-toggle" type="button" data-mobile-menu aria-expanded="false" aria-controls="mobile-navigation"><span class="menu-icon" aria-hidden="true"><span></span><span></span></span><span class="sr-only">Buka menu</span></button>
    </div>
</header>

<aside id="mobile-navigation" class="mobile-nav" aria-label="Navigasi seluler" aria-hidden="true" inert>
    <div class="theme-container mobile-nav-inner">
        <div class="mobile-level" id="mobile-navigation-panel-root" data-mobile-level="root" data-active="true" aria-hidden="false">
            <div class="mobile-nav-intro">
                <span class="eyebrow">Navigasi</span>
                <p>Temukan informasi sekolah berdasarkan kebutuhan Anda.</p>
            </div>
            <?php theme_render_menu($tree, true); ?>
            <?php if (!empty($spmb_url)): ?><a class="mobile-menu-cta" href="<?= esc($spmb_url) ?>" target="_blank" rel="noopener noreferrer"><span>SPMB Online</span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a><?php endif; ?>
        </div>
        <?php
        $flatten = function (array $items) use (&$flatten): iterable {
            foreach ($items as $item) {
                if (empty($item['children'])) continue;
                $key = (string)($item['id'] ?? '');
                if ($key !== '') yield $item;
                yield from $flatten($item['children']);
            }
        };
        foreach ($flatten($tree) as $item):
            $key = (string)($item['id'] ?? '');
        ?>
            <div class="mobile-level" id="mobile-navigation-panel-<?= esc(preg_replace('/[^a-zA-Z0-9_-]/', '-', $key) ?: 'item') ?>" data-mobile-level="<?= esc($key) ?>" data-active="false" aria-hidden="true">
                <button class="mobile-back" type="button" data-mobile-back aria-label="Kembali ke menu sebelumnya"><i data-lucide="arrow-left" aria-hidden="true"></i> Kembali</button>
                <p class="mobile-level-title"><?= esc($item['title'] ?? 'Menu') ?></p>
                <?php theme_render_menu($item['children'], true); ?>
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
