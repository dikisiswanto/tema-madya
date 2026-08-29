<?= $this->include('themes/madya/layouts/header') ?>
<?php $banner = !empty($page_banners) ? (json_decode($page_banners, true)['downloads'] ?? []) : []; ?>
<?= $this->include('themes/madya/components/page-header', ['eyebrow' => $banner['badge'] ?? 'Pusat dokumen', 'title' => $banner['title'] ?? 'Dokumen resmi', 'description' => $banner['subtitle'] ?? 'Formulir, panduan, dan dokumen sekolah tersedia dalam satu tempat.', 'breadcrumbs' => [['label' => 'Dokumen']]]) ?>
<section class="section"><div class="theme-container document-groups"><div class="document-intro-art document-intro-art-local"><img src="<?= base_url(($theme_asset_base ?? 'themes/madya/assets') . '/illustrations/documents.svg') ?>" width="720" height="520" alt="Ilustrasi dokumen sekolah" loading="lazy" decoding="async"><span class="illustration-caption">Dokumen resmi, lebih mudah ditemukan.</span></div>
<?php if (!empty($categories)): foreach ($categories as $category => $items): ?>
    <section class="document-group">
        <div class="document-group-heading"><div><p class="eyebrow">Koleksi</p><h2><?= esc($category ?: 'Dokumen lainnya') ?></h2></div><span><?= count($items) ?> berkas</span></div>
        <div class="document-list"><?php foreach ($items as $item): ?><?= $this->include('themes/madya/components/content/download-item', ['item' => $item]) ?><?php endforeach; ?></div>
    </section>
<?php endforeach; else: ?><?= $this->include('themes/madya/components/ui/empty-state', ['message' => 'Belum ada dokumen yang tersedia untuk diunduh.']) ?><?php endif; ?>
</div></section>
<?= $this->include('themes/madya/layouts/footer') ?>
