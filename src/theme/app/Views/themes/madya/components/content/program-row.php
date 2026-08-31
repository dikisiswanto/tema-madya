<?php
$item = $item ?? [];
$index = $index ?? 0;
$href = $href ?? '/#programs';
?>
<a class="program-feature-row" href="<?= esc($href) ?>">
    <span class="program-row-index"><span class="program-index"><?= str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT) ?></span><?php if (!empty($item['icon'])): ?>
<?= view('themes/madya/components/ui/icon', ['name' => $item['icon']]) ?>
<?php endif; ?></span>
    <span class="program-title"><?= esc($item['title'] ?? $item['name'] ?? 'Program') ?></span>
    <span class="program-summary"><?= esc($item['description'] ?? $item['excerpt'] ?? '') ?></span>
    <span class="program-row-image"><?php if (!empty($item['image'])): ?>
<img src="<?= esc($item['image']) ?>" width="360" height="240" alt="" loading="lazy" decoding="async">
<?php else: ?><span class="madya-media-fallback" aria-hidden="true"><i class="fas fa-graduation-cap"></i></span><?php endif; ?></span>
    <span class="program-arrow" aria-hidden="true">↗</span>
</a>
