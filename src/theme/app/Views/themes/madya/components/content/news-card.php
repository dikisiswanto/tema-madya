<?php
$post = $post ?? [];
$featured = $featured ?? false;
$href = $href ?? base_url('news/' . ($post['slug'] ?? ''));
$image = $post['image'] ?? $post['image_url'] ?? '';
?>
<article class="news-card<?= $featured ? ' news-card-featured' : '' ?>">
    <?php if ($image): ?>
        <a class="news-card-media" href="<?= esc($href) ?>" aria-label="Baca <?= esc($post['title'] ?? 'berita') ?>">
            <img src="<?= esc($image) ?>" width="<?= esc($post['image_width'] ?? 1600) ?>" height="<?= esc($post['image_height'] ?? 1000) ?>" alt="<?= esc($post['title'] ?? 'Berita sekolah') ?>" loading="lazy" decoding="async">
        </a>
    <?php endif; ?>
    <div class="news-card-body">
        <div class="card-meta"><time datetime="<?= esc($post['published_at'] ?? $post['created_at'] ?? '') ?>"><?= esc($post['published_at'] ?? $post['created_at'] ?? '') ?></time><?php if (!empty($post['category'])): ?><span><?= esc($post['category']) ?></span><?php endif; ?></div>
        <h3><a href="<?= esc($href) ?>"><?= esc($post['title'] ?? '') ?></a></h3>
        <?php if (!empty($post['excerpt'])): ?><p><?= esc($post['excerpt']) ?></p><?php endif; ?>
        <a class="text-link" href="<?= esc($href) ?>">Baca berita <span aria-hidden="true">↗</span></a>
    </div>
</article>
