<?php
$article = is_array($post ?? null) ? $post : [];
$banner = !empty($page_banners) ? (json_decode($page_banners, true)['single_post'] ?? []) : [];
$generatedHero = base_url('themes/madya/assets/generated/hero-image.jpg');
$publishedAt = (string)($article['published_at'] ?? $article['created_at'] ?? '');
$monthNames = [1 => 'Januari',2 => 'Februari',3 => 'Maret',4 => 'April',5 => 'Mei',6 => 'Juni',7 => 'Juli',8 => 'Agustus',9 => 'September',10 => 'Oktober',11 => 'November',12 => 'Desember'];
$timestamp = $publishedAt !== '' ? strtotime($publishedAt) : false;
$publishedLabel = $timestamp ? date('j', $timestamp) . ' ' . ($monthNames[(int) date('n', $timestamp)] ?? date('F', $timestamp)) . ' ' . date('Y', $timestamp) : 'Tanggal terbit tidak tersedia';
$wordCount = str_word_count(trim(strip_tags((string)($article['content'] ?? ''))));
$readMinutes = max(1, (int) ceil($wordCount / 200));
$relatedItems = is_array($related ?? null) ? array_values($related) : [];
$categories = is_array($categories ?? null) ? $categories : [];
$archive = is_array($archive ?? null) ? $archive : [];
$tags = is_array($tags ?? null) ? $tags : [];
$articleTags = [];
if (!empty($article['tags'])) {
    $decodedTags = is_string($article['tags']) ? json_decode($article['tags'], true) : $article['tags'];
    if (is_array($decodedTags)) {
        $articleTags = array_values(array_filter(array_map('trim', $decodedTags)));
    }
}
$commentErrors = session()->getFlashdata('errors') ?? [];
$commentSuccess = session()->getFlashdata('success');
$commentError = session()->getFlashdata('error');
$canonicalUrl = base_url('news/' . rawurlencode(ltrim((string)($article['slug'] ?? ''), '/')));
$structuredArticle = [
    '@context' => 'https://schema.org',
    '@type' => 'NewsArticle',
    'headline' => $article['title'] ?? '',
    'datePublished' => $article['published_at'] ?? $article['created_at'] ?? null,
    'dateModified' => $article['updated_at'] ?? $article['published_at'] ?? null,
    'mainEntityOfPage' => $canonicalUrl,
    'url' => $canonicalUrl,
    'description' => $article['excerpt'] ?? '',
    'image' => !empty($article['image']) ? [$article['image']] : null,
    'author' => ['@type' => 'Person', 'name' => $article['author'] ?? 'Redaksi'],
    'publisher' => ['@type' => 'EducationalOrganization', 'name' => $site_name ?? 'SekolahKu', 'logo' => !empty($site_logo_url) ? ['@type' => 'ImageObject', 'url' => $site_logo_url] : null],
    'articleSection' => $article['category'] ?? null,
    'keywords' => $article['tags'] ?? null,
];
$shareTitle = (string)($article['title'] ?? 'Berita sekolah');
$shareUrl = current_url();
?>
<?php $this->setData([
    'structured_data' => $structuredArticle,
    'page_title' => $article['title'] ?? 'Berita',
    'page_description' => $article['excerpt'] ?? '',
    'canonical_url' => $canonicalUrl,
    'og_type' => 'article',
    'og_image' => $article['image'] ?? null,
    'article_published_time' => $article['published_at'] ?? $article['created_at'] ?? null,
    'article_modified_time' => $article['updated_at'] ?? $article['published_at'] ?? $article['created_at'] ?? null,
]) ?>
<?= $this->include('themes/madya/layouts/header') ?>
<?php $heroImage = $generatedHero; ?>
<?= view('themes/madya/components/page-header', [
    'eyebrow' => $banner['badge'] ?? 'Detail',
    'title' => 'Berita',
    'description' => $banner['subtitle'] ?? 'Informasi lengkap seputar kegiatan dan prestasi di lingkungan sekolah.',
    'image' => $heroImage,
    'breadcrumbs' => [['url' => base_url('news'), 'label' => 'Berita'], ['label' => 'Detail']],
    'variant' => 'article-detail-hero',
]) ?>
<section class="section article-detail-section">
    <div class="theme-container article-detail-layout">
        <article class="article-main">
<header class="article-header">
                <?php if (!empty($article['category'])): ?>
<span class="article-category"><?= esc(trim(explode(',', (string) $article['category'])[0])) ?></span>
<?php endif; ?>
                <h1><?= esc($shareTitle) ?></h1>
                <div class="article-meta" aria-label="Metadata artikel">
                    <span><i data-lucide="calendar-days" aria-hidden="true"></i><?= esc($publishedLabel) ?></span>
                    <?php if (!empty($article['author'])): ?>
<span><i data-lucide="user-round" aria-hidden="true"></i><?= esc($article['author']) ?></span>
<?php endif; ?>
                    <?php if (isset($article['view_count'])): ?>
<span><i data-lucide="eye" aria-hidden="true"></i><?= esc(number_format((int) $article['view_count'], 0, ',', '.')) ?> kali dibaca</span>
<?php endif; ?>
                    <span><i data-lucide="clock-3" aria-hidden="true"></i><?= esc($readMinutes) ?> menit baca</span>
                </div>
            </header>

            <?php if (!empty($article['image'])): ?>
            <figure class="article-cover">
                <img src="<?= esc($article['image']) ?>" width="<?= esc($article['image_width'] ?? 1600) ?>" height="<?= esc($article['image_height'] ?? 1000) ?>" alt="<?= esc($shareTitle) ?>" fetchpriority="high" decoding="async">
                <?php if (!empty($article['image_caption'])): ?>
<figcaption><?= esc($article['image_caption']) ?></figcaption>
<?php endif; ?>
            </figure>
            <?php endif; ?>

            <div class="article-prose"><?= $article['content'] ?? '' ?></div>

            <?php if ($articleTags): ?>
            <div class="article-tags"><strong>Tag:</strong><?php foreach ($articleTags as $tag): ?><span><?= esc($tag) ?></span><?php endforeach; ?></div>
            <?php endif; ?>

            <nav class="article-nav" aria-label="Navigasi artikel">
                <?php if (!empty($prev_post)): ?>
<a class="article-nav-card" href="<?= base_url('news/' . rawurlencode((string) $prev_post['slug'])) ?>"><span><i data-lucide="arrow-left" aria-hidden="true"></i>Artikel sebelumnya</span><strong><?= esc($prev_post['title']) ?></strong></a>
<?php else: ?>
<span></span>
<?php endif; ?>
                <?php if (!empty($next_post)): ?>
<a class="article-nav-card article-nav-next" href="<?= base_url('news/' . rawurlencode((string) $next_post['slug'])) ?>"><span>Artikel selanjutnya <i data-lucide="arrow-right" aria-hidden="true"></i></span><strong><?= esc($next_post['title']) ?></strong></a>
<?php else: ?>
<span></span>
<?php endif; ?>
            </nav>

            <?php if (!empty($relatedItems)): ?>
            <section class="article-related">
                <div class="article-section-heading"><p class="eyebrow">Bacaan berikutnya</p><h2>Berita terkait.</h2></div>
                <div class="article-related-grid">
                    <?php foreach (array_slice($relatedItems, 0, 3) as $item): ?>
                    <a class="article-related-card" href="<?= base_url('news/' . rawurlencode((string)($item['slug'] ?? ''))) ?>">
                        <div class="article-related-media">
                            <?php if (!empty($item['image'])): ?>
<img src="<?= esc($item['image']) ?>" width="800" height="500" alt="<?= esc($item['title'] ?? 'Berita') ?>" loading="lazy" decoding="async">
<?php else: ?>
<div class="article-related-placeholder"><i data-lucide="newspaper" aria-hidden="true"></i></div>
<?php endif; ?>
                        </div>
                        <div class="article-related-body">
                            <span><?= esc(trim(explode(',', (string)($item['category'] ?? 'Berita'))[0])) ?></span>
                            <strong><?= esc($item['title'] ?? '') ?></strong>
                            <small><?= esc($item['published_at'] ?? $item['created_at'] ?? '') ?></small>
                        </div>
                    </a>
                    <?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

            <section class="comments-section" id="komentar">
                <div class="article-section-heading"><p class="eyebrow">Ruang diskusi</p><h2>Komentar.</h2><p class="comments-intro">Bagikan tanggapan Anda. Komentar akan tampil setelah disetujui oleh pengelola sekolah.</p></div>
                <?php if ($commentSuccess): ?>
<div class="comment-alert comment-alert-success" role="status"><?= esc($commentSuccess) ?></div>
<?php endif; ?>
                <?php if ($commentError): ?>
<div class="comment-alert comment-alert-error" role="alert"><?= esc($commentError) ?></div>
<?php endif; ?>
                <?php if (!empty($commentErrors)): ?><div class="comment-alert comment-alert-error" role="alert"><strong>Periksa kembali:</strong><ul><?php foreach ($commentErrors as $error): ?><li><?= esc($error) ?></li><?php endforeach; ?>
                <?php ?></ul></div><?php endif; ?>
                <form class="comment-form" action="<?= base_url('news/' . rawurlencode((string)($article['slug'] ?? '')) . '/comment') ?>" method="post">
                    <div class="comment-form-grid">
                        <label><span>Nama</span><input type="text" name="name" value="<?= esc(old('name')) ?>" required minlength="3" maxlength="100" autocomplete="name" placeholder="Nama Anda"></label>
                        <label><span>Email</span><input type="email" name="email" value="<?= esc(old('email')) ?>" required autocomplete="email" placeholder="email@contoh.com"></label>
                    </div>
                    <label><span>Komentar</span><textarea name="message" rows="5" required minlength="10" placeholder="Tulis tanggapan Anda…"><?= esc(old('message')) ?></textarea></label>
                    <div class="comment-form-footer">
                        <p>Komentar yang sopan dan relevan akan membantu percakapan tetap bermanfaat.</p>
                        <button class="button" type="submit">Kirim Komentar <i data-lucide="arrow-right" aria-hidden="true"></i></button>
                    </div>
                    <div class="comment-honeypot" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
                </form>

                <?php if (!empty($comments)): ?>
                <div class="comment-list" aria-label="Komentar yang telah disetujui">
                    <?php foreach ($comments as $comment): ?>
                    <article class="comment-card"><div class="comment-card-inner">
                        <div class="comment-avatar" aria-hidden="true"><?= esc(strtoupper(substr(trim((string)($comment['name'] ?? 'W')), 0, 1))) ?></div>
                        <div class="comment-card-body">
                            <div class="comment-card-head"><strong><?= esc($comment['name'] ?? 'Warga sekolah') ?></strong><time datetime="<?= esc($comment['created_at'] ?? '') ?>"><?= esc($comment['created_at'] ?? '') ?></time></div>
                            <p><?= nl2br(esc($comment['comment'] ?? $comment['message'] ?? '')) ?></p>
                        </div></div>
                    </article>
                    <?php endforeach; ?>
                </div>
                <?php else: ?>
                <div class="comments-empty"><i data-lucide="messages-square" aria-hidden="true"></i><div><strong>Belum ada komentar.</strong><p>Jadilah yang pertama memberikan tanggapan pada berita ini.</p></div></div>
                <?php endif; ?>
            </section>
        </article>

        <aside class="article-sidebar">
            <section class="share-card">
                <h2>Bagikan Artikel</h2>
                <div class="share-actions">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=<?= urlencode($shareUrl) ?>" target="_blank" rel="noopener" aria-label="Bagikan ke Facebook"><i data-lucide="facebook" aria-hidden="true"></i><span>Facebook</span></a>
                    <a href="https://twitter.com/intent/tweet?url=<?= urlencode($shareUrl) ?>&text=<?= urlencode($shareTitle) ?>" target="_blank" rel="noopener" aria-label="Bagikan ke X"><i data-lucide="twitter" aria-hidden="true"></i><span>X (Twitter)</span></a>
                    <a href="https://wa.me/?text=<?= urlencode($shareTitle . ' ' . $shareUrl) ?>" target="_blank" rel="noopener" aria-label="Bagikan ke WhatsApp"><i data-lucide="message-circle" aria-hidden="true"></i><span>WhatsApp</span></a>
                    <button type="button" data-copy-link aria-label="Salin tautan"><i data-lucide="link-2" aria-hidden="true"></i><span>Salin Tautan</span></button>
                </div>
            </section>

            <?php if (!empty($relatedItems)): ?>
            <section class="sidebar-card">
                <h2>Berita Terkait</h2>
                <div class="sidebar-related-list">
                    <?php foreach ($relatedItems as $item): ?><a href="<?= base_url('news/' . rawurlencode((string)($item['slug'] ?? ''))) ?>"><?php if (!empty($item['image'])): ?>
<img src="<?= esc($item['image']) ?>" width="96" height="64" alt="" loading="lazy" decoding="async">
<?php endif; ?>
<?php ?><span><strong><?= esc($item['title'] ?? '') ?></strong><small><?= esc($item['published_at'] ?? $item['created_at'] ?? '') ?></small></span></a><?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

            <?php if (!empty($categories)): ?>
            <section class="sidebar-card">
                <h2>Kategori Berita</h2>
                <div class="sidebar-category-list">
                    <?php foreach ($categories as $cat): ?><a href="<?= base_url('news?category=' . urlencode((string)($cat['name'] ?? ''))) ?>"><span><?= esc($cat['name'] ?? '') ?></span><b><?= esc($cat['count'] ?? 0) ?></b></a><?php endforeach; ?>
                </div>
                <a class="sidebar-more" href="<?= base_url('news') ?>">Lihat semua kategori <i data-lucide="arrow-right" aria-hidden="true"></i></a>
            </section>
            <?php endif; ?>
            <?php if (!empty($tags)): ?>
            <section class="sidebar-card">
                <h2>Topik Populer</h2>
                <div class="article-sidebar-tags">
                    <?php foreach (array_slice($tags, 0, 12) as $tag): $tagName = is_array($tag) ? ($tag['name'] ?? $tag['tag'] ?? '') : $tag; ?>
                    <?php if (!$tagName) continue; ?>
                    <a href="<?= base_url('news?search=' . urlencode((string) $tagName)) ?>"><?= esc($tagName) ?></a>
                    <?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

            <?php if (!empty($archive)): ?>
            <section class="sidebar-card">
                <h2>Arsip Berita</h2>
                <div class="article-archive-list">
                    <?php foreach (array_slice($archive, 0, 8) as $entry): ?>
                    <a href="<?= base_url('news?month=' . urlencode((string)($entry['month'] ?? ''))) ?>"><span><?= esc($entry['label'] ?? $entry['month'] ?? '') ?></span><b><?= esc($entry['count'] ?? 0) ?></b></a>
                    <?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

            <section class="article-newsletter faq-cta-card">
                <p class="eyebrow eyebrow-dark">Pertanyaan Umum</p>
                <h2>Masih ada yang ingin diketahui?</h2>
                <p>Lihat jawaban atas pertanyaan yang sering diajukan mengenai sekolah dan layanan publik.</p>
                <a class="button button-light" href="<?= base_url('/#faq') ?>">Buka FAQ <i data-lucide="arrow-right" aria-hidden="true"></i></a>
                <div class="article-newsletter-art" aria-hidden="true"><i data-lucide="circle-help" aria-hidden="true"></i></div>
            </section>
        </aside>
    </div>
</section>
<?= $this->include('themes/madya/layouts/footer') ?>
