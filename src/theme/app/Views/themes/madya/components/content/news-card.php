<?php $featured = !empty($featured); ?>
<?php $post = is_array($post ?? null) ? $post : []; ?>
<?php $title = trim((string) ($post['title'] ?? '')); ?>
<?php $slug = trim((string) ($post['slug'] ?? '')); ?>
<?php $image = trim((string) ($post['image'] ?? $post['image_url'] ?? '')); ?>
<?php $excerpt = trim((string) ($post['excerpt'] ?? '')); ?>
<?php if ($excerpt === '' && !empty($post['description'])): $excerpt = trim((string) $post['description']); endif; ?>
<?php if ($excerpt === '' && !empty($post['content'])): $excerpt = trim(preg_replace('/\s+/', ' ', strip_tags((string) $post['content']))); endif; ?>
<?php $href = $slug !== '' ? base_url('news/' . rawurlencode($slug)) : base_url('news'); ?>
<article class="madya-news-card<?= $featured ? ' news-card-featured' : '' ?>">
    <a class="news-card-media" href="<?= esc($href) ?>" aria-label="Baca <?= esc($title !== '' ? $title : 'berita') ?>">
        <?php if ($image !== ''): ?>
            <img src="<?= esc($image) ?>" width="<?= esc($post['image_width'] ?? 1200) ?>" height="<?= esc($post['image_height'] ?? 800) ?>" alt="<?= esc($title) ?>" loading="<?= $featured ? 'eager' : 'lazy' ?>" decoding="async">
        <?php else: ?>
            <span class="media-placeholder" aria-hidden="true"></span>
        <?php endif; ?>
        <?php if (!empty($post['category'])): ?>
<span class="news-card-category"><?= esc($post['category']) ?></span>
<?php endif; ?>
    </a>
    <div class="news-card-body">
        <div class="news-card-date"><i data-lucide="calendar-days" aria-hidden="true"></i><time datetime="<?= esc($post['published_at'] ?? $post['created_at'] ?? '') ?>"><?= esc($post['published_at'] ?? $post['created_at'] ?? 'Informasi terbaru') ?></time></div>
        <h2><a href="<?= esc($href) ?>"><?= esc($title) ?></a></h2>
        <?php if ($excerpt !== ''): ?>
<p><?= esc($excerpt) ?></p>
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
