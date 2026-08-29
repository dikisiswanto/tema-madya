<?php $featured = !empty($featured); $href = base_url('news/' . rawurlencode((string)($post['slug'] ?? ''))); ?>
<article class="news-card<?= $featured ? ' news-card-featured' : '' ?>">
    <?php if (!empty($post['image'])): ?><a class="news-card-media" href="<?= esc($href) ?>" aria-label="Baca <?= esc($post['title'] ?? 'berita') ?>"><img src="<?= esc($post['image']) ?>" width="<?= esc($post['image_width'] ?? 1200) ?>" height="<?= esc($post['image_height'] ?? 800) ?>" alt="<?= esc($post['title'] ?? 'Berita sekolah') ?>" loading="<?= $featured ? 'eager' : 'lazy' ?>" decoding="async"></a><?php endif; ?>
    <div class="news-card-body">
        <div class="card-meta"><time datetime="<?= esc($post['published_at'] ?? $post['created_at'] ?? '') ?>"><?= esc($post['published_at'] ?? $post['created_at'] ?? 'Informasi terbaru') ?></time><?php if (!empty($post['category'])): ?><span><?= esc($post['category']) ?></span><?php endif; ?><?php if (!empty($post['author'])): ?><span><?= esc($post['author']) ?></span><?php endif; ?><?php if (isset($post['view_count'])): ?><span><?= esc($post['view_count']) ?> dilihat</span><?php endif; ?></div>
        <h2><a href="<?= esc($href) ?>"><?= esc($post['title'] ?? 'Berita sekolah') ?></a></h2>
        <?php if (!empty($post['excerpt'])): ?><p><?= esc($post['excerpt']) ?></p><?php endif; ?>
        <a class="text-link" href="<?= esc($href) ?>">Baca berita <span aria-hidden="true">→</span></a>
    </div>
</article>
