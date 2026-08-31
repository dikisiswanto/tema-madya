<?php
$themeHasNewsFilters = trim((string)($search ?? '')) !== '' || trim((string)($category ?? '')) !== '' || trim((string)($tag ?? '')) !== '' || !empty($month);
if ($themeHasNewsFilters) {
    $robots = 'noindex,follow';
}
$banner = !empty($page_banners) ? (json_decode($page_banners, true)['news'] ?? []) : [];
if (is_array($news ?? null)) {
    $newsItems = array_values($news);
} elseif ($news instanceof Traversable) {
    $newsItems = iterator_to_array($news, false);
} else {
    $newsItems = [];
}
$activeSearch = trim((string)($search ?? ''));
$activeCategory = trim((string)($category ?? ''));
$activeMonth = trim((string)($month ?? ''));
$activeTag = trim((string)($tag ?? ''));
$tagSupported = array_key_exists('tag', get_defined_vars()) && $activeTag !== '';
$bannerTitle = trim((string)($banner['title'] ?? ''));
$bannerSubtitle = trim((string)($banner['subtitle'] ?? ''));
$newsTitle = $activeSearch !== ''
    ? 'Hasil Pencarian Berita'
    : ($activeCategory !== '' ? 'Berita: ' . $activeCategory : ($activeTag !== '' ? 'Topik: ' . $activeTag : ($bannerTitle !== '' ? $bannerTitle : 'Berita')));
$newsDescription = $activeSearch !== ''
    ? 'Menampilkan hasil pencarian untuk kata kunci “' . $activeSearch . '”.'
    : ($activeCategory !== '' ? 'Menampilkan berita dalam kategori ' . $activeCategory . '.' : ($activeTag !== '' ? 'Menampilkan berita dengan topik ' . $activeTag . '.' : ($bannerSubtitle !== '' ? $bannerSubtitle : 'Informasi terbaru seputar kegiatan, prestasi, dan program di sekolah.')));

$heroNewsImage = $banner['image'] ?? base_url(($theme_asset_base ?? 'themes/madya/assets') . '/generated/hero-image.jpg');
$categoryRows = [];
foreach (($categories ?? []) as $cat) {
    if (is_array($cat)) {
        $name = (string)($cat['name'] ?? $cat['title'] ?? '');
        $count = (int)($cat['count'] ?? $cat['total'] ?? 0);
    } else {
        $name = (string) $cat;
        $count = 0;
    }
    if ($name !== '') {
        $categoryRows[] = ['name' => $name, 'count' => $count];
    }
}
$popularNews = is_array($recent_news ?? null) ? array_slice($recent_news, 0, 5) : array_slice($newsItems, 0, 5);
?>
<?php
$newsCanonical = base_url('news');
$newsStructured = ['@context' => 'https://schema.org','@type' => 'CollectionPage','name' => $newsTitle,'description' => $newsDescription,'url' => $newsCanonical,'isPartOf' => ['@type' => 'WebSite','name' => $site_name ?? 'SekolahKu','url' => base_url()]];
?>
<?php $this->setData(['page_title' => $newsTitle, 'page_description' => $newsDescription, 'canonical_url' => $newsCanonical, 'structured_data' => $newsStructured, 'og_image' => $heroNewsImage]); ?>
<?= $this->include('themes/madya/layouts/header') ?>
<?= view('themes/madya/components/page-header', ['eyebrow' => $banner['badge'] ?? 'Berita & Artikel', 'title' => $newsTitle, 'description' => $newsDescription, 'image' => $heroNewsImage, 'breadcrumbs' => [['label' => 'Berita']]]) ?>
<section class="madya-section news-list-page">
    <div class="theme-container news-list-shell">
        <div class="news-list-main">
            <div class="news-list-toolbar">
                <nav class="news-category-pills" aria-label="Kategori berita">
                    <a class="<?= empty($category) ? 'is-active' : '' ?>" href="<?= base_url('news') ?>">Semua</a>
                    <?php foreach ($categoryRows as $cat): ?>
<a class="<?= strcasecmp($activeCategory, $cat['name']) === 0 ? 'is-active' : '' ?>" href="<?= base_url('news?category=' . urlencode($cat['name'])) ?>"><?= esc($cat['name']) ?></a>
<?php endforeach; ?>
                </nav>

            </div>
            <?php if ($activeSearch !== ''): ?>
<p class="search-summary">Menampilkan <?= count($newsItems) ?> hasil untuk <strong>“<?= esc($activeSearch) ?>”</strong></p>
<?php endif; ?>            <?php if ($activeTag !== ''): ?>
<p class="search-summary">Menampilkan <?= count($newsItems) ?> berita dengan topik <strong>“<?= esc($activeTag) ?>”</strong></p>
<?php endif; ?>
            <div class="news-archive-list">
                <?php foreach ($newsItems as $post): ?>
<?= view('themes/madya/components/content/news-card', ['post' => $post]) ?>
<?php endforeach; ?>
                <?php if (!$newsItems): ?>
<?= view('themes/madya/components/ui/empty-state', ['message' => 'Tidak ada berita yang sesuai dengan pencarian Anda.']) ?>
<?php endif; ?>
            </div>
            <?php if (isset($pager)): ?>
<div class="madya-news-pagination" aria-label="Navigasi halaman berita"><?= $pager->links() ?></div>
<?php endif; ?>
        </div>
        <aside class="news-list-sidebar">
            <section class="news-side-card news-search-card">
                <h2>Cari Berita</h2>
                <form class="news-sidebar-search" method="get" action="<?= base_url('news') ?>" role="search">
                    <label class="sr-only" for="news-search">Cari berita</label><input id="news-search" name="search" value="<?= esc($search ?? '') ?>" placeholder="Cari berita..."><button type="submit" aria-label="Cari berita"><i data-lucide="search" aria-hidden="true"></i></button>
                </form>
            </section>
            <?php if ($categoryRows): ?><section class="news-side-card"><h2>Kategori Berita</h2><div class="news-category-list"><?php foreach ($categoryRows as $cat): ?><a class="<?= strcasecmp($activeCategory, $cat['name']) === 0 ? 'is-active' : '' ?>" href="<?= base_url('news?category=' . urlencode($cat['name'])) ?>"><span><?= esc($cat['name']) ?></span><b><?= $cat['count'] ?></b></a><?php endforeach; ?>
            <?php ?><a href="<?= base_url('news') ?>"><span>Semua Kategori</span><span class="category-more-icon"><i data-lucide="arrow-right" aria-hidden="true"></i></span></a></div></section><?php endif; ?>
            <?php if ($popularNews): ?><section class="news-side-card"><h2>Berita Populer</h2><div class="popular-news-list"><?php foreach ($popularNews as $i => $post): ?><a href="<?= base_url('news/' . rawurlencode((string)($post['slug'] ?? ''))) ?>"><b><?= str_pad((string)($i + 1), 2, '0', STR_PAD_LEFT) ?></b><span><strong><?= esc($post['title'] ?? 'Berita sekolah') ?></strong><small><?= esc($post['published_at'] ?? $post['created_at'] ?? '') ?></small></span></a><?php endforeach; ?>
            <?php ?><a class="side-card-more" href="<?= base_url('news') ?>">Lihat semua berita populer <i data-lucide="arrow-right" aria-hidden="true"></i></a></div></section><?php endif; ?>
            <?php if ($tags): ?>
            <section class="news-side-card"><h2>Topik Populer</h2><div class="article-sidebar-tags">
                <?php foreach (array_slice($tags, 0, 12) as $tagItem): $tagName = is_array($tagItem) ? ($tagItem['name'] ?? $tagItem['tag'] ?? '') : $tagItem; if (!$tagName) continue; ?>
                    <?php if ($tagName !== ''): ?>
                        <a class="<?= strcasecmp($activeTag, (string) $tagName) === 0 ? 'is-active' : '' ?>" href="<?= base_url('news?tag=' . urlencode((string) $tagName)) ?>"><?= esc($tagName) ?></a>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div></section>
            <?php endif; ?>
            <section class="news-newsletter-card faq-cta-card"><h2>Pertanyaan yang Sering Diajukan</h2><p>Temukan jawaban cepat mengenai informasi sekolah, layanan, dan kegiatan.</p><a class="button button-light" href="<?= base_url('/#faq') ?>">Buka FAQ <i data-lucide="arrow-right" aria-hidden="true"></i></a><div class="news-newsletter-art" aria-hidden="true"><i data-lucide="circle-help" aria-hidden="true"></i></div></section>
        </aside>
    </div>
</section>
<?= $this->include('themes/madya/layouts/footer') ?>
