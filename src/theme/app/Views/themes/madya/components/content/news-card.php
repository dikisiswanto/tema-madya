<?php $featured = !empty($featured); ?>
<?php $href = base_url('news/' . rawurlencode((string)($post['slug'] ?? ''))); ?>
<article class="news-card<?= $featured ? ' news-card-featured' : '' ?>">
    <?php if (!empty($post['image'])): ?>
        <a class="news-card-media" href="<?= esc($href) ?>" aria-label="Baca <?= esc($post['title'] ?? 'berita') ?>">
            <img src="<?= esc($post['image']) ?>" width="<?= esc($post['image_width'] ?? 1200) ?>" height="<?= esc($post['image_height'] ?? 800) ?>" alt="<?= esc($post['title'] ?? 'Berita sekolah') ?>" loading="<?= $featured ? 'eager' : 'lazy' ?>" decoding="async">
            <?php if (!empty($post['category'])): ?>
<span class="news-card-category"><?= esc($post['category']) ?></span>
<?php endif; ?>
        </a>
    <?php endif; ?>
    <div class="news-card-body">
        <div class="news-card-date"><i data-lucide="calendar-days" aria-hidden="true"></i><time datetime="<?= esc($post['published_at'] ?? $post['created_at'] ?? '') ?>"><?= esc($post['published_at'] ?? $post['created_at'] ?? 'Informasi terbaru') ?></time></div>
        <h2><a href="<?= esc($href) ?>"><?= esc($post['title'] ?? 'Berita sekolah') ?></a></h2>
        <?php if (!empty($post['excerpt'])): ?>
<p><?= esc($post['excerpt']) ?></p>
<?php endif; ?>
        <div class="news-card-footer">
            <div class="news-card-meta" aria-label="Metadata berita">
                <?php if (!empty($post['author'])): ?>
<span><i data-lucide="user" aria-hidden="true"></i><?= esc($post['author']) ?></span>
<?php endif; ?>
                <?php if (isset($post['view_count'])): ?>
<span><i data-lucide="eye" aria-hidden="true"></i><?= esc(number_format((int) $post['view_count'], 0, ',', '.')) ?> kali dibaca</span>
<?php endif; ?>
            </div>
            <a class="text-link" href="<?= esc($href) ?>">Baca selengkapnya <i data-lucide="arrow-right" aria-hidden="true"></i></a>
        </div>
    </div>
</article>
