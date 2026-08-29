<?php
helper('menu');
$tree = $menu_tree ?? get_menu_tree($section_settings ?? null);
?>
<header class="site-header" data-site-nav>
    <div class="theme-container header-inner">
        <a class="brand" href="<?= base_url() ?>" aria-label="Beranda <?= esc($site_name ?? 'SekolahKu') ?>">
            <span class="brand-mark" aria-hidden="true"><i data-lucide="graduation-cap"></i></span>
            <span class="brand-copy"><strong><?= esc($site_logo_text ?? $site_name ?? 'SekolahKu') ?></strong><small><?= esc($site_tagline ?? 'Situs resmi sekolah') ?></small></span>
        </a>

        <nav class="desktop-nav-wrap" aria-label="Navigasi utama">
            <ul class="desktop-nav">
                <?php theme_render_menu($tree); ?>
            </ul>
        </nav>

        <?php if (!empty($spmb_url)): ?><a class="nav-cta" href="<?= esc($spmb_url) ?>" target="_blank" rel="noopener noreferrer"><span>SPMB Online</span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a><?php endif; ?>

        <button class="mobile-toggle" type="button" data-mobile-menu aria-expanded="false" aria-controls="mobile-navigation">
            <span class="menu-icon" aria-hidden="true"><span></span><span></span></span>
            <span class="sr-only">Buka menu</span>
        </button>
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
