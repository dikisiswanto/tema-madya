<?php
$pageMetaTitle = trim((string) ($page['meta_title'] ?? $page['title'] ?? 'Halaman'));
$pageMetaDescription = trim((string) ($page['meta_description'] ?? $page['excerpt'] ?? $site_description ?? ''));
$pageSlug = trim((string) ($page['slug'] ?? ''), '/');
$pageCanonical = base_url(rawurlencode($pageSlug));
$structuredPage = [
    '@context' => 'https://schema.org',
    '@type' => 'WebPage',
    'name' => $pageMetaTitle,
    'description' => $pageMetaDescription,
    'url' => $pageCanonical,
    'isPartOf' => ['@type' => 'WebSite', 'name' => $site_name ?? 'SekolahKu', 'url' => base_url()],
];
$staticBanners = [];
if (!empty($page_banners)) {
    $decodedBanners = is_string($page_banners) ? json_decode($page_banners, true) : $page_banners;
    $staticBanners = is_array($decodedBanners) ? $decodedBanners : [];
}
$pageBanner = $staticBanners[$page['slug'] ?? ''] ?? $staticBanners['page'] ?? $staticBanners['pages'] ?? [];
?>
<?php $this->setData(['page_title' => $pageMetaTitle, 'page_description' => $pageMetaDescription, 'canonical_url' => $pageCanonical, 'structured_data' => $structuredPage]); ?>
<?= $this->include('themes/madya/layouts/header') ?>
<?php
$pageTitle = $page['title'] ?? 'Halaman';
$pageExcerpt = $page['excerpt'] ?? '';
$banner = '';
if (is_array($pageBanner)) {
    $banner = $pageBanner['image'] ?? '';
}
$banner = $banner ?: ($page['image'] ?? '');
?>
<?= view('themes/madya/components/page-header', ['eyebrow' => '', 'title' => $pageTitle, 'description' => $pageExcerpt, 'image' => $banner, 'breadcrumbs' => [['label' => $pageTitle]]]) ?>
<section class="madya-section static-page-section">
    <div class="theme-container static-page-layout">
        <article class="static-page-main">
            <div class="static-content-intro">
                <div class="article-prose"><?= $page['content'] ?? '' ?></div>
            </div>
            <?php if (!empty($page['image'])): ?>
                <figure class="static-feature-image"><img src="<?= esc($page['image']) ?>" width="<?= esc($page['image_width'] ?? 1600) ?>" height="<?= esc($page['image_height'] ?? 1000) ?>" alt="<?= esc($pageTitle) ?>" loading="lazy" decoding="async"></figure>
            
<?php endif; ?>
        </article>
        <aside class="static-page-sidebar">
            <?php if (!empty($all_pages)): ?>
            <section class="static-sidebar-card">
                <h2>Halaman Lainnya</h2>
                <nav class="static-sidebar-links" aria-label="Halaman lainnya">
                    <?php foreach ($all_pages as $item): if (($item['id'] ?? null) == ($page['id'] ?? null)) continue; ?>
                        <a href="<?= base_url(rawurlencode((string)($item['slug'] ?? ''))) ?>"><i data-lucide="file-text" aria-hidden="true"></i><span><?= esc($item['title'] ?? '') ?></span></a>
                    <?php endforeach; ?>
                </nav>
            </section>
            <?php endif; ?>
            <section class="static-help-card">
                <div><p class="eyebrow">Butuh Bantuan?</p><h2>Masih ada pertanyaan?</h2><p>Jika Anda memiliki pertanyaan atau informasi yang ingin disampaikan, jangan ragu menghubungi kami.</p><a class="button" href="<?= base_url('contact') ?>">Hubungi Kami <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>
                <i data-lucide="messages-square" aria-hidden="true"></i>
            </section>
            <section class="static-newsletter-card faq-cta-card">
                <p class="eyebrow">Pertanyaan Umum</p><h2>Butuh jawaban cepat?</h2><p>Lihat pertanyaan yang sering diajukan seputar layanan, kegiatan, dan informasi sekolah.</p>
                <a class="button button-accent" href="<?= base_url('/#faq') ?>">Lihat FAQ <i data-lucide="arrow-right" aria-hidden="true"></i></a>
            </section>
        </aside>
    </div>
</section>
<?= $this->include('themes/madya/layouts/footer') ?>
