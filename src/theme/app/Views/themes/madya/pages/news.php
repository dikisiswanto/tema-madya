<?php
$themeHasNewsFilters = trim((string)($search ?? '')) !== '' || trim((string)($category ?? '')) !== '' || !empty($month);
if ($themeHasNewsFilters) {
    $robots = 'noindex,follow';
}
?>
<?= $this->include('themes/madya/layouts/header') ?>
<?php
$banner = !empty($page_banners) ? (json_decode($page_banners, true)['news'] ?? []) : [];
$newsItems = $news ?? [];
?>
<?= $this->include('themes/madya/components/page-header', ['eyebrow' => $banner['badge'] ?? 'Kabar sekolah', 'title' => $banner['title'] ?? 'Berita sekolah', 'description' => $banner['subtitle'] ?? 'Cerita, kabar, dan informasi terbaru dari lingkungan sekolah.', 'breadcrumbs' => [['label' => 'Berita']]]) ?>
<section class="section">
    <div class="theme-container news-layout-theme">
        <div>
            <form class="news-search" method="get" action="<?= base_url('news') ?>" role="search">
                <label class="sr-only" for="news-search">Cari berita</label><input id="news-search" name="search" value="<?= esc($search ?? '') ?>" placeholder="Cari berita…"><button class="button" type="submit">Cari</button>
            </form>
            <div class="news-filter" aria-label="Kategori berita">
                <a class="<?= empty($category) ? 'is-active' : '' ?>" href="<?= base_url('news') ?>">Semua</a>
                <?php foreach (($categories ?? []) as $cat): $name = is_array($cat) ? ($cat['name'] ?? $cat['title'] ?? '') : $cat; $url = base_url('news?category=' . urlencode($name)); ?><a class="<?= $category === $name ? 'is-active' : '' ?>" href="<?= esc($url) ?>"><?= esc($name) ?></a><?php endforeach; ?>
            </div>
            <div class="news-archive-grid">
                <?php foreach ($newsItems as $post): ?><?= $this->include('themes/madya/components/content/news-card', ['post' => $post]) ?><?php endforeach; ?>
                <?php if (!$newsItems): ?><?= $this->include('themes/madya/components/ui/empty-state', ['message' => 'Tidak ada berita yang sesuai dengan pencarian Anda.']) ?><?php endif; ?>
            </div>
            <?php if (isset($pager)): ?><div class="pagination" aria-label="Paginasi berita"><?= $pager->links() ?></div><?php endif; ?>
        </div>
        <aside class="article-side news-sidebar-theme">
            <div class="widget"><h2>Terbaru</h2><div class="sidebar-news"><?php foreach (($recent_news ?? []) as $post): ?><a href="<?= base_url('news/' . rawurlencode((string)($post['slug'] ?? ''))) ?>"><span><?= esc($post['title']) ?></span><small><?= esc($post['published_at'] ?? $post['created_at'] ?? '') ?></small></a><?php endforeach; ?></div></div>
            <?php if (!empty($archive)): ?><div class="widget"><h2>Arsip</h2><div class="sidebar-links"><?php foreach ($archive as $item): ?><a href="<?= base_url('news?month=' . urlencode($item['month'])) ?>"><?= esc($item['label']) ?><span><?= esc($item['count']) ?></span></a><?php endforeach; ?></div></div><?php endif; ?>
            <?php if (!empty($tags)): ?><div class="widget"><h2>Topik</h2><div class="tag-list"><?php foreach ($tags as $tag): $tagName = is_array($tag) ? ($tag['name'] ?? $tag['tag'] ?? '') : $tag; ?><a href="<?= base_url('news?search=' . urlencode($tagName)) ?>"><?= esc($tagName) ?></a><?php endforeach; ?></div></div><?php endif; ?>
        </aside>
    </div>
</section>
<?= $this->include('themes/madya/layouts/footer') ?>
