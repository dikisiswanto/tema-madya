<?= $this->include('themes/madya/layouts/header') ?>
<?= $this->include('themes/madya/components/page-header', ['eyebrow' => 'Informasi sekolah', 'title' => $page['title'] ?? 'Halaman', 'description' => $page['excerpt'] ?? '', 'breadcrumbs' => [['label' => $page['title'] ?? 'Halaman']]]) ?>
<section class="section"><div class="theme-container article-layout">
    <article>
        <?php if (!empty($page['image'])): ?><figure class="article-cover"><img src="<?= esc($page['image']) ?>" width="<?= esc($page['image_width'] ?? 1600) ?>" height="<?= esc($page['image_height'] ?? 1000) ?>" alt="<?= esc($page['title'] ?? '') ?>" loading="lazy" decoding="async"></figure><?php endif; ?>
        <div class="article-prose"><?= $page['content'] ?? '' ?></div>
    </article>
    <aside class="article-side">
        <?php if (!empty($all_pages)): ?><div class="widget"><h2>Jelajahi</h2><div class="sidebar-links"><?php foreach ($all_pages as $item): if (($item['id'] ?? null) == ($page['id'] ?? null)) continue; ?><a href="<?= base_url(ltrim((string)($item['slug'] ?? ''), '/')) ?>"><?= esc($item['title'] ?? '') ?></a><?php endforeach; ?></div></div><?php endif; ?>
        <?php if (!empty($recent_news)): ?><div class="widget"><h2>Berita terbaru</h2><div class="sidebar-news"><?php foreach ($recent_news as $post): ?><a href="<?= base_url('news/' . rawurlencode((string)($post['slug'] ?? ''))) ?>"><span><?= esc($post['title']) ?></span></a><?php endforeach; ?></div></div><?php endif; ?>
    </aside>
</div></section>
<?= $this->include('themes/madya/layouts/footer') ?>
