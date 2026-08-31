<?php
$banner = [];
if (!empty($page_banners)) {
    $decoded = is_string($page_banners) ? json_decode($page_banners, true) : $page_banners;
    $banner = is_array($decoded) ? ($decoded['downloads'] ?? []) : [];
}
$heroImage = $banner['image'] ?? base_url(($theme_asset_base ?? 'themes/madya/assets') . '/generated/hero-image.jpg');
$categories = is_array($categories ?? null) ? $categories : [];
$allItems = [];
foreach ($categories as $group) {
    foreach ((array) $group as $item) {
        $allItems[] = $item;
    }
}
$categoryCount = count($categories);
$categorySlugs = []; foreach (array_keys($categories ?? []) as $categoryName) { $categorySlugs[$categoryName] = trim(preg_replace('/[^a-z0-9]+/i', '-', strtolower((string) $categoryName)), '-'); }
$pdfCount = count(array_filter($allItems, static fn($i) => strtoupper((string)($i['extension'] ?? pathinfo((string)($i['url'] ?? ''), PATHINFO_EXTENSION))) === 'PDF'));
$otherCount = max(0, count($allItems) - $pdfCount);

$downloadsCanonical = base_url('downloads');
$downloadsDescription = $banner['subtitle'] ?? 'Formulir, panduan, dan dokumen resmi sekolah dalam satu tempat.';
$downloadsStructured = ['@context' => 'https://schema.org','@type' => 'CollectionPage','name' => $banner['title'] ?? 'Dokumen Resmi','description' => $downloadsDescription,'url' => $downloadsCanonical,'isPartOf' => ['@type' => 'WebSite','name' => $site_name ?? 'SekolahKu','url' => base_url()]];
?>
<?php $this->setData(['page_title' => $banner['title'] ?? 'Dokumen Resmi', 'page_description' => $downloadsDescription, 'canonical_url' => $downloadsCanonical, 'structured_data' => $downloadsStructured, 'og_image' => $heroImage]); ?>
<?= $this->include('themes/madya/layouts/header') ?>
<?= view('themes/madya/components/page-header', [
    'eyebrow' => $banner['badge'] ?? 'Pusat Download',
    'title' => $banner['title'] ?? 'Pusat Download',
    'description' => $banner['subtitle'] ?? 'Unduh berbagai dokumen penting, formulir, panduan, dan informasi resmi sekolah.',
    'image' => $heroImage,
    'breadcrumbs' => [['label' => 'Download']],
]) ?>

<section class="downloads-reference-section section">
    <div class="theme-container">
        <div class="download-stat-grid download-stat-grid-reference">
            <div class="download-stat"><span class="download-stat-icon"><i data-lucide="files" aria-hidden="true"></i></span><span><strong><?= count($allItems) ?></strong><small>Total Dokumen</small></span></div>
            <div class="download-stat"><span class="download-stat-icon"><i data-lucide="folder-open" aria-hidden="true"></i></span><span><strong><?= $categoryCount ?></strong><small>Kategori</small></span></div>
            <div class="download-stat"><span class="download-stat-icon"><i data-lucide="file-down" aria-hidden="true"></i></span><span><strong><?= $pdfCount ?></strong><small>Dokumen PDF</small></span></div>
            <div class="download-stat"><span class="download-stat-icon"><i data-lucide="files" aria-hidden="true"></i></span><span><strong><?= $otherCount ?></strong><small>Format Lain</small></span></div>
        </div>

        <div class="download-content-grid">
            <main class="download-main-column">
                <div class="download-toolbar-reference">
                    <div><h2>Semua Dokumen</h2><p>Dokumen resmi sekolah yang tersedia untuk diunduh.</p></div>
                </div>
                <?php if ($categories): foreach ($categories as $category => $items): ?>
                    <section class="document-group document-group-reference" id="doc-<?= esc($categorySlugs[$category] ?? 'category') ?>">
                        <div class="document-group-heading"><div><p class="eyebrow">Koleksi</p><h2><?= esc($category ?: 'Dokumen lainnya') ?></h2></div><span><?= count($items) ?> dokumen</span></div>
                        <div class="document-list-reference">
                            <?php foreach ($items as $item): ?>
                                <?php $ext = strtoupper((string)($item['extension'] ?? pathinfo((string)($item['url'] ?? ''), PATHINFO_EXTENSION) ?: 'PDF')); ?>
                                <?php $icon = $ext === 'PDF' ? 'file-type' : ($ext === 'XLS' || $ext === 'XLSX' ? 'file-spreadsheet' : ($ext === 'DOC' || $ext === 'DOCX' ? 'file-text' : 'file')); ?>
                                <a class="document-row-reference" href="<?= esc($item['url'] ?? '#') ?>" target="_blank" rel="noopener noreferrer"><span class="document-file-type document-file-type-<?= esc(strtolower($ext)) ?>"><i data-lucide="<?= esc($icon) ?>" aria-hidden="true"></i><b><?= esc($ext) ?></b></span><span class="document-main-reference"><strong><?= esc($item['title'] ?? 'Dokumen') ?></strong><?php if (!empty($item['description'])): ?>
<small><?= esc($item['description']) ?></small>
<?php endif; ?><span class="document-meta-reference"><i data-lucide="download" aria-hidden="true"></i><?= esc($item['file_size'] ?? 'Ukuran tidak tersedia') ?></span></span><span class="document-download-button"><i data-lucide="download" aria-hidden="true"></i>Unduh</span></a>
                            <?php endforeach; ?>
                        </div>
                    </section>
                <?php endforeach; ?>
                <?php else: ?><?= view('themes/madya/components/ui/empty-state', ['message' => 'Belum ada dokumen yang tersedia untuk diunduh.']) ?><?php endif; ?>
            </main>

            <aside class="download-sidebar-reference">
                <section class="download-widget"><h2>Kategori Dokumen</h2><div class="download-category-links"><a href="<?= base_url('downloads') ?>"><span><i data-lucide="chevron-right" aria-hidden="true"></i>Semua Kategori</span><b><?= count($allItems) ?></b></a><?php foreach ($categories as $category => $items): ?>
<a href="#doc-<?= esc($categorySlugs[$category] ?? 'category') ?>"><span><i data-lucide="chevron-right" aria-hidden="true"></i><?= esc($category ?: 'Dokumen lainnya') ?></span><b><?= count($items) ?></b></a>
<?php endforeach; ?></div></section>
                <section class="download-widget"><h2>Dokumen Pilihan</h2><div class="download-popular-list"><?php $selected = array_slice($allItems, 0, 5); foreach ($selected as $index => $item): ?><a href="<?= esc($item['url'] ?? '#') ?>" target="_blank" rel="noopener noreferrer"><span class="download-rank"><?= str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT) ?></span><span><strong><?= esc($item['title'] ?? 'Dokumen') ?></strong><small><?= esc($item['file_size'] ?? '') ?></small></span></a><?php endforeach; ?></div><a class="download-widget-link" href="#all-documents">Lihat semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></section>
                <section class="download-newsletter-widget faq-cta-card"><p class="eyebrow eyebrow-dark">Pertanyaan Umum</p><h2>Butuh bantuan terkait dokumen?</h2><p>Lihat jawaban atas pertanyaan yang sering diajukan sebelum menghubungi sekolah.</p><a class="button button-light" href="<?= base_url('/#faq') ?>">Buka FAQ <i data-lucide="arrow-right" aria-hidden="true"></i></a><img src="<?= base_url(($theme_asset_base ?? 'themes/madya/assets') . '/illustrations/documents.svg') ?>" alt="" aria-hidden="true"></section>
            </aside>
        </div>

        <section class="download-help-banner"><img src="<?= base_url(($theme_asset_base ?? 'themes/madya/assets') . '/illustrations/community.svg') ?>" alt="Bantuan dokumen" width="720" height="520" loading="lazy" decoding="async"><div><p class="eyebrow">Butuh Dokumen Lain?</p><h2>Tidak menemukan dokumen yang Anda cari?</h2><p>Hubungi admin sekolah untuk mendapatkan informasi atau mengajukan permintaan dokumen.</p><a class="button" href="<?= base_url('contact') ?>">Hubungi Kami <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><span class="download-help-art" aria-hidden="true"><i data-lucide="folder-open" aria-hidden="true"></i></span></section>
    </div>
</section>
<?= $this->include('themes/madya/layouts/footer') ?>
