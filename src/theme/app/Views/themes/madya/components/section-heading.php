<?php
$eyebrow = $eyebrow ?? '';
$title = $title ?? '';
$description = $description ?? '';
$link = $link ?? null;
$linkLabel = $linkLabel ?? 'Lihat selengkapnya';
?>
<div class="section-heading">
    <div class="section-heading-copy">
        <?php if ($eyebrow !== ''): ?><p class="eyebrow"><?= esc($eyebrow) ?></p><?php endif; ?>
        <h2><?= esc($title) ?></h2>
        <?php if ($description !== ''): ?><p class="section-heading-description"><?= esc($description) ?></p><?php endif; ?>
    </div>
    <?php if ($link): ?><a class="text-link" href="<?= esc($link) ?>"><?= esc($linkLabel) ?> <span aria-hidden="true">→</span></a><?php endif; ?>
</div>
