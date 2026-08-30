<?php $item = $item ?? []; $index = $index ?? 0; $src = $item['image'] ?? $item['image_url'] ?? ''; ?>
<figure class="gallery-home-item gallery-home-item-<?= $index % 5 ?>">
    <?php if ($src): ?><img src="<?= esc($src) ?>" width="<?= esc($item['image_width'] ?? 1600) ?>" height="<?= esc($item['image_height'] ?? 1000) ?>" alt="<?= esc($item['caption'] ?? $item['title'] ?? 'Dokumentasi sekolah') ?>" loading="lazy" decoding="async">
    <?php else: ?><div class="media-placeholder" role="img" aria-label="Dokumentasi sekolah"><span>Dokumentasi</span></div><?php endif; ?>
    <?php if (!empty($item['title'])): ?><figcaption><?= esc($item['title']) ?></figcaption><?php endif; ?>
</figure>
