<?php
$article = $post ?? [];
$canonicalUrl = base_url('news/' . rawurlencode(ltrim((string)($article['slug'] ?? ''), '/')));
$structuredArticle = [
    '@context' => 'https://schema.org',
    '@type' => 'NewsArticle',
    'headline' => $article['title'] ?? '',
    'datePublished' => $article['published_at'] ?? $article['created_at'] ?? null,
    'dateModified' => $article['updated_at'] ?? $article['published_at'] ?? null,
    'mainEntityOfPage' => $canonicalUrl,
    'url' => $canonicalUrl,
    'description' => $article['excerpt'] ?? $article['description'] ?? '',
    'image' => !empty($article['image']) ? [$article['image']] : null,
    'author' => ['@type' => 'Organization', 'name' => $article['author'] ?? ($site_name ?? 'SekolahKu')],
    'publisher' => ['@type' => 'EducationalOrganization', 'name' => $site_name ?? 'SekolahKu', 'logo' => !empty($site_logo_url) ? ['@type' => 'ImageObject', 'url' => $site_logo_url] : null],
];
?>
<?= $this->include('themes/madya/layouts/header', [
    'structured_data' => $structuredArticle,
    'page_title' => $article['title'] ?? 'Artikel',
    'page_description' => $article['excerpt'] ?? $article['description'] ?? '',
    'canonical_url' => $canonicalUrl,
    'og_type' => 'article',
    'og_image' => $article['image'] ?? null,
]) ?>
<?= $this->include('themes/madya/components/page-header', ['eyebrow' => $article['category'] ?? 'Berita sekolah', 'title' => $article['title'] ?? 'Artikel', 'description' => $article['excerpt'] ?? '', 'image' => $article['image'] ?? '', 'breadcrumbs' => [['url' => base_url('news'), 'label' => 'Berita'], ['label' => $article['title'] ?? 'Artikel']]]) ?>
<section class="section">
    <div class="theme-container article-layout">
        <article>
            <header class="article-header"><p class="eyebrow"><?= esc($article['category'] ?? 'Berita') ?></p><h1><?= esc($article['title'] ?? 'Artikel') ?></h1><div class="article-meta"><span><?= esc($article['published_at'] ?? $article['created_at'] ?? '') ?></span><?php if (!empty($article['author'])): ?><span>Oleh <?= esc($article['author']) ?></span><?php endif; ?><?php if (isset($article['view_count'])): ?><span><?= esc($article['view_count']) ?> dilihat</span><?php endif; ?></div></header>
            <?php if (!empty($article['image'])): ?><figure class="article-cover"><img src="<?= esc($article['image']) ?>" width="<?= esc($article['image_width'] ?? 1600) ?>" height="<?= esc($article['image_height'] ?? 1000) ?>" alt="<?= esc($article['title'] ?? 'Berita sekolah') ?>" fetchpriority="high" decoding="async"></figure><?php endif; ?>
            <div class="article-prose"><?= $article['content'] ?? '' ?></div>
            <div class="share-row"><span>Bagikan</span><a href="https://www.facebook.com/sharer/sharer.php?u=<?= urlencode(current_url()) ?>" target="_blank" rel="noopener">Facebook</a><a href="https://wa.me/?text=<?= urlencode(($article['title'] ?? '') . ' ' . current_url()) ?>" target="_blank" rel="noopener">WhatsApp</a><button type="button" data-copy-link>Salin tautan</button></div>

            <?php if (!empty($related)): ?><section class="related-section"><div class="section-heading"><div><p class="eyebrow">Selanjutnya</p><h2>Berita terkait.</h2></div></div><div class="related-grid"><?php foreach ($related as $item): ?><a class="related-card" href="<?= base_url('news/' . rawurlencode((string)($item['slug'] ?? ''))) ?>"><?php if (!empty($item['image'])): ?><img src="<?= esc($item['image']) ?>" width="<?= esc($item['image_width'] ?? 1200) ?>" height="<?= esc($item['image_height'] ?? 800) ?>" alt="<?= esc($item['title']) ?>" loading="lazy" decoding="async"><?php endif; ?><div><span class="meta"><?= esc($item['published_at'] ?? $item['created_at'] ?? '') ?></span><strong><?= esc($item['title']) ?></strong></div></a><?php endforeach; ?></div></section><?php endif; ?>

            <section class="comments-section" id="komentar">
                <div class="section-heading"><div><p class="eyebrow">Ruang diskusi</p><h2><?= count($comments ?? []) ?> komentar.</h2></div></div>
                <?php if (!empty($comments)): ?><div class="comment-list"><?php foreach ($comments as $comment): ?><article class="quote-card"><blockquote><?= esc($comment['comment'] ?? $comment['message'] ?? '') ?></blockquote><figcaption><?= esc($comment['name'] ?? 'Warga sekolah') ?> · <?= esc($comment['created_at'] ?? '') ?></figcaption></article><?php endforeach; ?></div><?php endif; ?>
                <form class="form-grid" action="<?= base_url('news/' . esc($article['slug']) . '/comment') ?>" method="post"><input type="hidden" name="parent_id" value=""><input type="text" name="website" class="sr-only" tabindex="-1" autocomplete="off"><?= csrf_field() ?><div class="form-field"><label for="comment-name">Nama</label><input id="comment-name" name="name" required></div><div class="form-field"><label for="comment-email">Email</label><input id="comment-email" name="email" type="email" required></div><div class="form-field form-full"><label for="comment-message">Komentar</label><textarea id="comment-message" name="message" required></textarea></div><div><button class="button" type="submit">Kirim komentar</button></div></form>
            </section>

            <?php if (!empty($prev_post) || !empty($next_post)): ?><nav class="article-nav" aria-label="Navigasi artikel"><?php if ($prev_post): ?><a href="<?= base_url('news/' . rawurlencode((string)($prev_post['slug'] ?? ''))) ?>"><span>← Berita sebelumnya</span><strong><?= esc($prev_post['title']) ?></strong></a><?php else: ?><span></span><?php endif; ?><?php if ($next_post): ?><a class="article-nav-next" href="<?= base_url('news/' . rawurlencode((string)($next_post['slug'] ?? ''))) ?>"><span>Berita selanjutnya →</span><strong><?= esc($next_post['title']) ?></strong></a><?php endif; ?></nav><?php endif; ?>
        </article>
        <aside class="article-side">
            <div class="widget"><h2>Berita terbaru</h2><div class="sidebar-news"><?php foreach (($recent_news ?? []) as $postItem): ?><a href="<?= base_url('news/' . rawurlencode((string)($postItem['slug'] ?? ''))) ?>"><span><?= esc($postItem['title']) ?></span><small><?= esc($postItem['published_at'] ?? $postItem['created_at'] ?? '') ?></small></a><?php endforeach; ?></div></div>
            <?php if (!empty($archive)): ?><div class="widget"><h2>Arsip</h2><div class="sidebar-links"><?php foreach ($archive as $item): ?><a href="<?= base_url('news?month=' . urlencode($item['month'])) ?>"><?= esc($item['label']) ?><span><?= esc($item['count']) ?></span></a><?php endforeach; ?></div></div><?php endif; ?>
        </aside>
    </div>
</section>
<?= $this->include('themes/madya/layouts/footer') ?>
