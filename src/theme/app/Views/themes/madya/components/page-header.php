<?php
$eyebrow = $eyebrow ?? '';
$title = $title ?? '';
$description = $description ?? '';
$breadcrumbs = is_array($breadcrumbs ?? null) ? $breadcrumbs : [];
if (!$breadcrumbs && $title !== '') {
    $breadcrumbs = [['label' => $title]];
}
$bannerImage = $image ?? '';
$fallbackIcon = trim((string)($fallback_icon ?? 'school'));
$variant = trim((string)($variant ?? ''));
?>
<header data-madya-native-page-header="true" class="page-hero<?= $bannerImage ? ' page-hero-has-image' : '' ?><?= $variant !== '' ? ' page-hero-' . esc($variant) : '' ?>" role="banner"<?php if ($bannerImage): ?>
 style="--page-hero-image: url('<?= esc($bannerImage) ?>')"
<?php endif; ?>>
    <div class="page-hero-backdrop" aria-hidden="true"></div>
    <?php if (!$bannerImage): ?><div class="page-hero-icon-fallback" aria-hidden="true"><i class="fas fa-<?= esc(preg_replace('/[^a-z0-9-]/i', '', $fallbackIcon)) ?>"></i></div><?php endif; ?>
    <div class="theme-container page-hero-inner">
        <?php if ($breadcrumbs): ?>
        <nav class="breadcrumb page-breadcrumb" aria-label="Jejak navigasi">
            <a href="<?= base_url() ?>">Beranda</a>
            <?php foreach ($breadcrumbs as $crumb): ?>
                <span aria-hidden="true">/</span>
                <?php if (!empty($crumb['url'])): ?>
                    <a href="<?= esc($crumb['url']) ?>"><?= esc($crumb['label'] ?? '') ?></a>
                <?php else: ?>
                    <span aria-current="page"><?= esc($crumb['label'] ?? $title) ?></span>
                <?php endif; ?>
            <?php endforeach; ?>
        </nav>
        <?php endif; ?>
        <p class="eyebrow"><?= esc($eyebrow) ?></p>
        <h1><?= esc($title) ?></h1>
        <?php if ($description !== ''): ?>
<p><?= esc($description) ?></p>
<?php endif; ?>
    </div>
</header>
