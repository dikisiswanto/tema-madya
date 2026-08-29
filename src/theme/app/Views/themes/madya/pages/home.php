<?= $this->include('themes/madya/layouts/header') ?>
<?php
$aboutData = is_array($about ?? null) ? $about : (json_decode($about ?? '[]', true) ?: []);
$generatedImageBase = base_url(($theme_asset_base ?? 'themes/madya/assets') . '/generated');
$generated = static fn(string $name): string => $generatedImageBase . '/' . $name;
$counterItems = is_array($counter_stats ?? null) ? array_slice($counter_stats, 0, 4) : [];
$principalData = is_array($principal ?? null) ? $principal : (json_decode($principal ?? '[]', true) ?: []);
$programItems = is_array($programs ?? null) ? $programs : [];
$extraItems = is_array($extracurriculars ?? null) ? $extracurriculars : [];
$teacherItems = is_array($teachers ?? null) ? $teachers : [];
$achievementItems = is_array($achievements ?? null) ? $achievements : [];
$testimonialItems = is_array($testimonials ?? null) ? $testimonials : [];
$eventItems = is_array($events ?? null) ? $events : [];
$galleryItems = is_array($galleries ?? null) ? $galleries : [];
$newsItems = is_array($news ?? null) ? $news : [];
$downloadItems = is_array($downloads ?? null) ? $downloads : [];
$announcementItems = array_values(array_filter($newsItems, static fn($item) => strtolower((string)($item['category'] ?? '')) === 'pengumuman'));
$announcementItems = array_slice($announcementItems ?: $newsItems, 0, 3);
$heroImage = $aboutData['hero_image'] ?? $aboutData['image'] ?? $aboutData['image_url'] ?? $generated('hero-campus.jpg');
$heroWidth = $aboutData['hero_image_width'] ?? $aboutData['image_width'] ?? $aboutData['width'] ?? 1600;
$heroHeight = $aboutData['hero_image_height'] ?? $aboutData['image_height'] ?? $aboutData['height'] ?? 1100;
$primaryUrl = $hero_btn_primary_url ?? '#profile';
$primaryText = $hero_btn_primary_text ?? 'Jelajahi Sekolah';
$secondaryUrl = $hero_btn_secondary_url ?? '#profile';
$secondaryText = $hero_btn_secondary_text ?? 'Tentang Kami';
$serviceItems = [
    ['icon' => 'user-plus', 'label' => 'SPMB Online', 'desc' => 'Pendaftaran siswa baru', 'url' => $spmb_url ?? '#'],
    ['icon' => 'monitor-play', 'label' => 'E-Learning', 'desc' => 'Belajar di mana saja', 'url' => '#'],
    ['icon' => 'book-open', 'label' => 'Perpustakaan', 'desc' => 'Akses buku & referensi', 'url' => '#'],
    ['icon' => 'bell-ring', 'label' => 'Pengaduan', 'desc' => 'Sampaikan keluhan Anda', 'url' => '#'],
    ['icon' => 'download', 'label' => 'Download Dokumen', 'desc' => 'Formulir & surat penting', 'url' => base_url('downloads')],
    ['icon' => 'mail', 'label' => 'Kontak Sekolah', 'desc' => 'Hubungi kami', 'url' => base_url('contact')],
];
$statIcons = ['users', 'graduation-cap', 'trophy', 'book-open'];
$programItems = array_slice($programItems, 0, 4);
$extraItems = array_slice($extraItems, 0, 6);
$teacherItems = array_slice($teacherItems, 0, 4);
$achievementItems = array_slice($achievementItems, 0, 3);
$eventItems = array_slice($eventItems, 0, 4);
$galleryItems = array_slice($galleryItems, 0, 6);
$newsFeatured = $newsItems[0] ?? null;
$newsSecondary = array_slice($newsItems, 1, 3);
$downloadItems = array_slice($downloadItems, 0, 4);
$heroTitleMarkup = esc($hero_title ?: 'Membentuk Generasi Berilmu, Berakhlak, dan Berprestasi.');
$heroTitleMarkup = preg_replace('/(Berprestasi\.?)(\s*)$/u', '<span class="hero-title-accent">$1</span>$2', $heroTitleMarkup);
?>

<div class="home-page">
<section class="home-hero" aria-labelledby="hero-title">
    <div class="theme-container home-hero-grid">
        <div class="home-hero-copy">
            <?php if (!empty($hero_badge)): ?><p class="hero-kicker"><?= esc($hero_badge) ?></p><?php endif; ?>
            <h1 id="hero-title"><?= $heroTitleMarkup ?></h1>
            <p class="hero-lead"><?= esc($hero_subtitle ?: ($site_description ?? $site_tagline ?? '')) ?></p>
            <div class="home-hero-actions">
                <a class="button" href="<?= esc($primaryUrl) ?>"><?= esc($primaryText) ?> <i data-lucide="arrow-right" aria-hidden="true"></i></a>
                <a class="button button-secondary" href="<?= esc($secondaryUrl) ?>"><i data-lucide="play-circle" aria-hidden="true"></i><?= esc($secondaryText) ?></a>
            </div>
        </div>
        <div class="hero-photo-wrap">
            <figure class="hero-photo">
                <?php if ($heroImage): ?><img src="<?= esc($heroImage) ?>" width="<?= esc($heroWidth) ?>" height="<?= esc($heroHeight) ?>" alt="Lingkungan <?= esc($site_name ?? 'sekolah') ?>" fetchpriority="high" decoding="async"><?php else: ?><div class="media-placeholder" role="img" aria-label="Lingkungan sekolah"><span><?= esc($site_name ?? 'SekolahKu') ?></span></div><?php endif; ?>
            </figure>
            <?php if ($announcementItems): ?><aside class="hero-announcement" aria-label="Pengumuman terbaru">
                <h2><i data-lucide="megaphone" aria-hidden="true"></i> Pengumuman Terbaru</h2>
                <ul class="announcement-list">
                    <?php foreach ($announcementItems as $item): ?><li><a href="<?= base_url('news/' . rawurlencode((string)($item['slug'] ?? ''))) ?>"><?= esc($item['title'] ?? 'Informasi terbaru') ?></a><?php if (!empty($item['published_at'])): ?><small><?= esc(date('d M Y', strtotime((string)$item['published_at']))) ?></small><?php endif; ?></li><?php endforeach; ?>
                </ul>
                <a class="announcement-more" href="<?= base_url('news?category=Pengumuman') ?>">Lihat semua pengumuman <i data-lucide="arrow-right" aria-hidden="true"></i></a>
            </aside><?php endif; ?>
        </div>
    </div>
</section>

<section class="home-quick-services" aria-label="Layanan cepat">
    <div class="theme-container quick-service-grid">
        <?php foreach ($serviceItems as $service): ?>
            <a class="quick-service<?= $service['url'] === '#' ? ' is-disabled' : '' ?>" href="<?= esc($service['url']) ?>"<?= $service['url'] === '#' ? ' aria-disabled="true" tabindex="-1"' : '' ?>>
                <span class="quick-service-icon"><i data-lucide="<?= esc($service['icon']) ?>" aria-hidden="true"></i></span>
                <span><strong><?= esc($service['label']) ?></strong><small><?= esc($service['desc']) ?></small></span>
            </a>
        <?php endforeach; ?>
    </div>
</section>

<?php if ($counterItems): ?><section class="home-stat-section" aria-label="Statistik sekolah"><div class="theme-container"><div class="home-stat-grid">
    <?php foreach ($counterItems as $index => $stat): ?><div class="home-stat-item"><i data-lucide="<?= esc($statIcons[$index] ?? 'sparkles') ?>" aria-hidden="true"></i><div><strong><?= esc($stat['value'] ?? $stat['number'] ?? '') ?><?= !isset($stat['value']) && !empty($stat['suffix']) ? esc($stat['suffix']) : '' ?></strong><span><?= esc($stat['label'] ?? $stat['title'] ?? '') ?></span></div></div><?php endforeach; ?>
</div></div></section><?php endif; ?>

<section class="home-section home-middle-section" id="profile" aria-label="Profil sekolah">
    <div class="theme-container home-middle-stack">
        <div class="home-middle-grid home-middle-grid-profile">
            <article class="principal-panel">
                <div class="principal-photo">
                    <img src="<?= esc($principalData['image'] ?? $generated('principal.jpg')) ?>" width="<?= esc($principalData['image_width'] ?? 900) ?>" height="<?= esc($principalData['image_height'] ?? 1100) ?>" alt="<?= esc($principalData['name'] ?? 'Kepala sekolah') ?>" loading="lazy" decoding="async">
                </div>
                <div class="principal-message">
                    <p class="section-kicker">Sambutan Kepala Sekolah</p>
                    <blockquote>“<?= esc($principalData['bio'] ?? 'Membangun karakter, meraih masa depan bersama seluruh warga sekolah.') ?>”</blockquote>
                    <p class="principal-description"><?= esc($principalData['description'] ?? '') ?></p>
                    <strong><?= esc($principalData['name'] ?? 'Kepala Sekolah') ?></strong>
                    <span><?= esc($principalData['title'] ?? $principalData['position'] ?? 'Kepala Sekolah') ?></span>
                    <?php
                    $principalFacts = [
                        ['award', 'Akreditasi', $aboutData['accreditation'] ?? ''],
                        ['book-open', 'Kurikulum', $aboutData['curriculum'] ?? ''],
                        ['calendar-days', 'Tahun Berdiri', $aboutData['established_year'] ?? ''],
                    ];
                    $principalFacts = array_values(array_filter($principalFacts, static fn($fact) => (string)$fact[2] !== ''));
                    if ($principalFacts):
                    ?><div class="principal-facts">
                        <?php foreach ($principalFacts as $fact): ?><div><i data-lucide="<?= esc($fact[0]) ?>" aria-hidden="true"></i><span><b><?= esc($fact[1]) ?></b><?= esc($fact[2]) ?></span></div><?php endforeach; ?>
                    </div><?php endif; ?>
                </div>
            </article>

            <article class="program-panel" id="programs" aria-labelledby="programs-title">
                <div class="section-head-row compact">
                    <div><p class="section-kicker">Program Unggulan</p><h2 id="programs-title">Program Unggulan Kami</h2></div>
                    <a class="text-link" href="#programs">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a>
                </div>
                <?php if ($programItems): ?><div class="program-showcase-grid">
                    <?php foreach (array_slice($programItems, 0, 3) as $index => $item): ?>
                        <article class="program-showcase-card">
                            <div class="program-showcase-media"><img src="<?= esc($item['image'] ?? $generated('program-' . (['science','language','students'][$index % 3]) . '.jpg')) ?>" width="800" height="520" alt="" loading="lazy" decoding="async"></div>
                            <div class="program-showcase-body"><h3><?= esc($item['title'] ?? $item['name'] ?? 'Program') ?></h3><p><?= esc($item['description'] ?? $item['excerpt'] ?? '') ?></p></div>
                        </article>
                    <?php endforeach; ?>
                </div><?php else: ?><div class="empty-inline">Belum ada program unggulan.</div><?php endif; ?>
            </article>
        </div>

        <div class="home-middle-grid home-middle-grid-people" id="teachers">
            <?php if ($teacherItems): ?><article class="middle-panel">
                <div class="section-head-row compact"><div><p class="section-kicker">Guru Berprestasi</p><h2>Tenaga pengajar pilihan.</h2></div><a class="text-link" href="#teachers">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>
                <div class="teacher-grid">
                    <?php foreach (array_slice($teacherItems, 0, 4) as $index => $item): ?><article class="teacher-card"><img src="<?= esc($item['image'] ?? $generated('teacher-' . (($index % 4) + 1) . '.jpg')) ?>" width="900" height="1100" alt="<?= esc($item['name'] ?? 'Tenaga pendidik') ?>" loading="lazy" decoding="async"><div><strong><?= esc($item['name'] ?? 'Tenaga pendidik') ?></strong><span><?= esc($item['title'] ?? $item['position'] ?? 'Tenaga pendidik') ?></span></div></article><?php endforeach; ?>
                </div>
            </article><?php endif; ?>
            <?php if ($achievementItems): ?><article class="middle-panel" id="achievements">
                <div class="section-head-row compact"><div><p class="section-kicker">Prestasi Terbaru</p><h2>Mengukir prestasi di berbagai bidang.</h2></div><a class="text-link" href="#achievements">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>
                <div class="achievement-list">
                    <?php foreach (array_slice($achievementItems, 0, 3) as $item): ?><article class="achievement-list-row"><span class="achievement-list-icon"><i data-lucide="trophy" aria-hidden="true"></i></span><div><strong><?= esc($item['title'] ?? 'Prestasi siswa') ?></strong><small><?= esc($item['description'] ?? '') ?></small></div><time><?= esc($item['year'] ?? '') ?></time></article><?php endforeach; ?>
                </div>
            </article><?php endif; ?>
        </div>

        <div class="home-middle-grid home-middle-grid-updates" id="updates">
            <?php if ($newsItems): ?><article class="middle-panel">
                <div class="section-head-row compact"><div><p class="section-kicker">Berita Terbaru</p><h2>Informasi terkini seputar kegiatan sekolah.</h2></div><a class="text-link" href="<?= base_url('news') ?>">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>
                <div class="news-home-row">
                    <?php if ($newsFeatured): ?><a class="featured-news-home" href="<?= base_url('news/' . rawurlencode((string)($newsFeatured['slug'] ?? ''))) ?>"><img src="<?= esc($newsFeatured['image'] ?? $generated('news-campus.jpg')) ?>" width="900" height="600" alt="<?= esc($newsFeatured['title'] ?? 'Berita sekolah') ?>" loading="lazy" decoding="async"><div><span><?= esc($newsFeatured['category'] ?? 'Berita') ?></span><h3><?= esc($newsFeatured['title'] ?? 'Berita sekolah') ?></h3><small><?= esc($newsFeatured['published_at'] ?? '') ?></small></div></a><?php endif; ?>
                    <div class="news-home-side"><?php foreach (array_slice($newsItems, 1, 3) as $item): ?><a href="<?= base_url('news/' . rawurlencode((string)($item['slug'] ?? ''))) ?>"><img src="<?= esc($item['image'] ?? $generated('news-campus.jpg')) ?>" width="180" height="120" alt="" loading="lazy" decoding="async"><span><strong><?= esc($item['title'] ?? '') ?></strong><small><?= esc($item['published_at'] ?? '') ?></small></span></a><?php endforeach; ?></div>
                </div>
            </article><?php endif; ?>
            <?php if ($eventItems): ?><article class="middle-panel">
                <div class="section-head-row compact"><div><p class="section-kicker">Agenda Kegiatan</p><h2>Agenda penting sekolah.</h2></div><a class="text-link" href="#events">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>
                <div class="agenda-list" id="events"><?php foreach (array_slice($eventItems, 0, 3) as $item): ?><article class="agenda-item"><time datetime="<?= esc($item['event_date'] ?? $item['date'] ?? '') ?>"><b><?= esc(!empty($item['event_date']) ? date('d', strtotime((string)$item['event_date'])) : '—') ?></b><span><?= esc(!empty($item['event_date']) ? strtoupper(date('M', strtotime((string)$item['event_date']))) : '') ?></span></time><div><h3><?= esc($item['title'] ?? 'Kegiatan sekolah') ?></h3><p><?= esc($item['time'] ?? '') ?><?= !empty($item['location']) ? ' · ' . esc($item['location']) : '' ?></p></div><i data-lucide="chevron-right" aria-hidden="true"></i></article><?php endforeach; ?></div>
            </article><?php endif; ?>
        </div>

        <div class="home-middle-grid home-middle-grid-community" id="gallery">
            <?php if ($galleryItems): ?><article class="middle-panel">
                <div class="section-head-row compact"><div><p class="section-kicker">Galeri Kegiatan</p><h2>Momen terbaik kami.</h2></div><a class="text-link" href="#gallery">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>
                <div class="gallery-home-grid gallery-home-grid-compact"><?php foreach (array_slice($galleryItems, 0, 4) as $index => $item): ?><a class="gallery-home-item gallery-home-item-<?= $index ?>" href="#gallery"><img src="<?= esc($item['image'] ?? $generated('gallery-' . (['students','class','library'][$index % 3]) . '.jpg')) ?>" width="700" height="520" alt="<?= esc($item['title'] ?? 'Dokumentasi sekolah') ?>" loading="lazy" decoding="async"></a><?php endforeach; ?></div>
            </article><?php endif; ?>
            <?php if ($testimonialItems): ?><article class="middle-panel">
                <div class="section-head-row compact"><div><p class="section-kicker">Testimoni</p><h2>Apa kata mereka tentang sekolah?</h2></div><a class="text-link" href="#testimonials">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>
                <div class="testimonial-feature" id="testimonials"><?php $testimonial = $testimonialItems[0]; ?><div class="testimonial-quote-mark">“</div><blockquote><?= esc($testimonial['quote'] ?? $testimonial['content'] ?? '') ?></blockquote><div class="testimonial-person"><img src="<?= esc($testimonial['image'] ?? $generated('testimonial-1.jpg')) ?>" width="80" height="80" alt="" loading="lazy" decoding="async"><span><strong><?= esc($testimonial['name'] ?? $testimonial['author'] ?? 'Warga sekolah') ?></strong><small><?= esc($testimonial['role'] ?? '') ?></small></span><span class="testimonial-stars">★★★★★</span></div></div>
            </article><?php endif; ?>
        </div>
    </div>
</section>

<section class="home-section section-soft" id="documents" aria-labelledby="documents-title"><div class="theme-container documents-spmb-grid">
    <div><div class="section-head-row compact"><div><p class="section-kicker">Pusat Dokumen</p><h2 id="documents-title">Unduh dokumen dan formulir penting.</h2></div><a class="text-link" href="<?= base_url('downloads') ?>">Lihat Semua Dokumen <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><div class="document-home-list"><?php foreach ($downloadItems as $item): ?><a href="<?= esc($item['url'] ?? '#') ?>" class="document-home-row"><span class="document-file-icon"><i data-lucide="file-text" aria-hidden="true"></i></span><span><strong><?= esc($item['title'] ?? 'Dokumen') ?></strong><small><?= esc($item['type'] ?? $item['extension'] ?? 'PDF') ?> · <?= esc($item['file_size'] ?? $item['size'] ?? '') ?></small></span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a><?php endforeach; ?></div></div>
    <aside class="spmb-home-banner"><div><p class="section-kicker">SPMB 2025/2026</p><h2>Berikan langkah terbaik untuk masa depan gemilang.</h2><p>Pendaftaran peserta didik baru melalui kanal resmi sekolah.</p><a class="button button-accent" href="<?= esc($spmb_url ?? '#') ?>">Daftar Sekarang <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><?php if ($heroImage): ?><img src="<?= esc($heroImage) ?>" width="800" height="600" alt="" loading="lazy" decoding="async"><?php endif; ?></aside>
</div></section>

<section class="home-contact-strip" id="contact" aria-label="Kontak sekolah"><div class="theme-container contact-strip-grid">
    <div><i data-lucide="map-pin" aria-hidden="true"></i><span><b>Alamat</b><small><?= esc($contact_address ?? '—') ?></small></span></div>
    <div><i data-lucide="phone" aria-hidden="true"></i><span><b>Telepon</b><small><?= esc($contact_phone ?? '—') ?></small></span></div>
    <div><i data-lucide="mail" aria-hidden="true"></i><span><b>Email</b><small><?= esc($contact_email ?? '—') ?></small></span></div>
    <div><i data-lucide="clock-3" aria-hidden="true"></i><span><b>Jam Layanan</b><small><?= esc($contact_hours ?? '—') ?></small></span></div>
</div></section>
</div>
<?= $this->include('themes/madya/layouts/footer') ?>
