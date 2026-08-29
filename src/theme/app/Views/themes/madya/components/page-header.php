<?php
$eyebrow = $eyebrow ?? 'Informasi';
$title = $title ?? ($page_title ?? $site_name ?? 'SekolahKu');
$description = $description ?? '';
$breadcrumbs = $breadcrumbs ?? [];
?>
<header class="page-hero">
    <div class="theme-container page-hero-inner">
        <?php if ($breadcrumbs): ?>
            <nav class="breadcrumb" aria-label="Jejak navigasi">
                <a href="<?= base_url() ?>">Beranda</a>
                <?php foreach ($breadcrumbs as $crumb): ?>
                    <span aria-hidden="true">/</span>
                    <?php if (!empty($crumb['url'])): ?><a href="<?= esc($crumb['url']) ?>"><?= esc($crumb['label'] ?? '') ?></a><?php else: ?><span aria-current="page"><?= esc($crumb['label'] ?? '') ?></span><?php endif; ?>
                <?php endforeach; ?>
            </nav>
        <?php endif; ?>
        <p class="eyebrow"><?= esc($eyebrow) ?></p>
        <h1><?= esc($title) ?></h1>
        <?php if ($description !== ''): ?><p><?= esc($description) ?></p><?php endif; ?>
    </div>
</header>
