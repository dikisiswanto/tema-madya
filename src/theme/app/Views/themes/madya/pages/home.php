<?= $this->include('themes/madya/layouts/header') ?>
<?php
$aboutData = is_array($about ?? null) ? $about : (json_decode($about ?? '[]', true) ?: []);
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
$heroImage = $aboutData['hero_image'] ?? $aboutData['image'] ?? $aboutData['image_url'] ?? '';
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

<section class="home-section" id="profile" aria-labelledby="profile-title">
    <div class="theme-container profile-grid">
        <article class="principal-panel">
            <div class="principal-photo">
                <?php if (!empty($principalData['image'])): ?><img src="<?= esc($principalData['image']) ?>" width="<?= esc($principalData['image_width'] ?? 900) ?>" height="<?= esc($principalData['image_height'] ?? 1100) ?>" alt="<?= esc($principalData['name'] ?? 'Kepala sekolah') ?>" loading="lazy" decoding="async"><?php else: ?><div class="media-placeholder"><span>Kepala sekolah</span></div><?php endif; ?>
            </div>
            <div class="principal-message">
                <p class="section-kicker">Sambutan Kepala Sekolah</p>
                <blockquote>“<?= esc($principalData['bio'] ?? 'Mari bersama membangun lingkungan belajar yang inspiratif, berkarakter, dan berdaya saing.') ?>”</blockquote>
                <strong><?= esc($principalData['name'] ?? 'Kepala Sekolah') ?></strong>
                <span><?= esc($principalData['title'] ?? $principalData['position'] ?? 'Kepala Sekolah') ?></span>
                <div class="principal-facts">
                    <?php foreach ([['award','Akreditasi',$aboutData['accreditation'] ?? ''],['book-open','Kurikulum',$aboutData['curriculum'] ?? ''],['calendar-days','Tahun Berdiri',$aboutData['established_year'] ?? '']] as $fact): if ($fact[2] === '') continue; ?>
                        <div><i data-lucide="<?= esc($fact[0]) ?>" aria-hidden="true"></i><span><b><?= esc($fact[1]) ?></b><?= esc($fact[2]) ?></span></div>
                    <?php endforeach; ?>
                </div>
            </div>
        </article>
        <div class="profile-copy">
            <p class="section-kicker">Profil Singkat</p>
            <h2 id="profile-title">Sekolah yang tumbuh bersama masyarakat.</h2>
            <p><?= esc($aboutData['description'] ?? $site_description ?? '') ?></p>
            <div class="profile-points">
                <div class="profile-point"><i data-lucide="compass" aria-hidden="true"></i><div><strong>Visi</strong><span><?= esc($aboutData['visi'] ?? '') ?></span></div></div>
                <div class="profile-point"><i data-lucide="target" aria-hidden="true"></i><div><strong>Misi</strong><span><?= esc($aboutData['misi'] ?? '') ?></span></div></div>
                <div class="profile-point"><i data-lucide="landmark" aria-hidden="true"></i><div><strong>Fasilitas Unggulan</strong><span><?= esc($aboutData['facilities'] ?? '') ?></span></div></div>
            </div>
            <a class="text-link" href="#profile">Selengkapnya Tentang Sekolah <i data-lucide="arrow-right" aria-hidden="true"></i></a>
        </div>
    </div>
</section>

<?php if ($programItems || $extraItems): ?><section class="home-section section-soft" id="programs" aria-labelledby="programs-title"><div class="theme-container">
    <div class="section-head-row"><div><p class="section-kicker">Program & Ekstrakurikuler</p><h2 id="programs-title">Wadah pengembangan potensi dan minat siswa.</h2></div><a class="text-link" href="#programs">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>
    <div class="programs-extras-grid">
        <div><div class="subsection-label"><span>Program Unggulan</span></div><div class="program-card-grid">
            <?php foreach ($programItems as $item): ?><article class="program-card"><span class="program-card-icon"><i data-lucide="<?= esc($item['icon'] ?? 'book-open') ?>" aria-hidden="true"></i></span><h3><?= esc($item['title'] ?? $item['name'] ?? 'Program') ?></h3><p><?= esc($item['description'] ?? $item['excerpt'] ?? '') ?></p></article><?php endforeach; ?>
        </div></div>
        <div><div class="subsection-label"><span>Ekstrakurikuler Populer</span><a href="#programs">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><div class="extra-rail">
            <?php foreach ($extraItems as $item): ?><a class="extra-card" href="#programs"><?php if (!empty($item['image'])): ?><img src="<?= esc($item['image']) ?>" width="600" height="800" alt="" loading="lazy" decoding="async"><?php endif; ?><span><?= esc($item['title'] ?? $item['name'] ?? 'Kegiatan') ?></span></a><?php endforeach; ?>
        </div></div>
    </div>
</div></section><?php endif; ?>

<?php if ($teacherItems || $achievementItems): ?><section class="home-section" id="teachers" aria-labelledby="teachers-title"><div class="theme-container people-achievements-grid">
    <?php if ($teacherItems): ?><div><div class="section-head-row compact"><div><p class="section-kicker">Tenaga Pengajar</p><h2 id="teachers-title">Guru profesional dan berkompeten.</h2></div><a class="text-link" href="#teachers">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><div class="teacher-grid">
        <?php foreach ($teacherItems as $item): ?><article class="teacher-card"><?php if (!empty($item['image'])): ?><img src="<?= esc($item['image']) ?>" width="<?= esc($item['image_width'] ?? 900) ?>" height="<?= esc($item['image_height'] ?? 1100) ?>" alt="<?= esc($item['name'] ?? 'Tenaga pendidik') ?>" loading="lazy" decoding="async"><?php else: ?><div class="media-placeholder"><span><?= esc($item['name'] ?? 'Guru') ?></span></div><?php endif; ?><div><strong><?= esc($item['name'] ?? 'Tenaga pendidik') ?></strong><span><?= esc($item['title'] ?? $item['position'] ?? 'Tenaga pendidik') ?></span></div></article><?php endforeach; ?>
    </div></div><?php endif; ?>
    <?php if ($achievementItems): ?><div><div class="section-head-row compact"><div><p class="section-kicker">Prestasi Siswa</p><h2>Mengukir prestasi di berbagai bidang.</h2></div><a class="text-link" href="#achievements">Lihat Semua <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><div class="achievement-cards" id="achievements">
        <?php foreach ($achievementItems as $index => $item): ?><article class="achievement-card"><?php if (!empty($item['image'])): ?><img src="<?= esc($item['image']) ?>" width="700" height="480" alt="" loading="lazy" decoding="async"><?php endif; ?><span class="achievement-level"><?= esc($item['level'] ?? 'Prestasi') ?></span><div><small><?= esc($item['year'] ?? '') ?></small><h3><?= esc($item['title'] ?? 'Prestasi siswa') ?></h3><p><?= esc($item['description'] ?? '') ?></p></div></article><?php endforeach; ?></div></div><?php endif; ?>
</div></section><?php endif; ?>

<?php if ($newsItems || $eventItems): ?><section class="home-section section-soft" id="updates" aria-labelledby="updates-title"><div class="theme-container news-agenda-grid">
    <?php if ($newsFeatured): ?><div><div class="section-head-row compact"><div><p class="section-kicker">Berita Terbaru</p><h2 id="updates-title">Informasi terkini seputar kegiatan sekolah.</h2></div><a class="text-link" href="<?= base_url('news') ?>">Lihat Semua Berita <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><article class="featured-news"><a href="<?= base_url('news/' . rawurlencode((string)($newsFeatured['slug'] ?? ''))) ?>" class="featured-news-media"><?php if (!empty($newsFeatured['image'])): ?><img src="<?= esc($newsFeatured['image']) ?>" width="1200" height="800" alt="<?= esc($newsFeatured['title'] ?? 'Berita sekolah') ?>" loading="lazy" decoding="async"><?php endif; ?><span><?= esc($newsFeatured['category'] ?? 'Berita') ?></span><div><h3><?= esc($newsFeatured['title'] ?? 'Berita sekolah') ?></h3><p><?= esc($newsFeatured['excerpt'] ?? $newsFeatured['description'] ?? '') ?></p></div></a><div class="news-side-list"><?php foreach ($newsSecondary as $item): ?><a href="<?= base_url('news/' . rawurlencode((string)($item['slug'] ?? ''))) ?>"><span><?php if (!empty($item['image'])): ?><img src="<?= esc($item['image']) ?>" width="120" height="80" alt="" loading="lazy" decoding="async"><?php endif; ?></span><div><strong><?= esc($item['title'] ?? '') ?></strong><small><?= esc($item['published_at'] ?? '') ?></small></div></a><?php endforeach; ?></div></article></div><?php endif; ?>
    <?php if ($eventItems): ?><div><div class="section-head-row compact"><div><p class="section-kicker">Agenda Mendatang</p><h2>Jangan lewatkan agenda penting sekolah.</h2></div><a class="text-link" href="#events">Lihat Semua Agenda <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><div class="agenda-list" id="events"><?php foreach ($eventItems as $item): ?><article class="agenda-item"><time datetime="<?= esc($item['event_date'] ?? $item['date'] ?? '') ?>"><b><?= esc(date('d', strtotime((string)($item['event_date'] ?? date('Y-m-d'))))) ?></b><span><?= esc(strtoupper(date('M', strtotime((string)($item['event_date'] ?? date('Y-m-d')))))) ?></span></time><div><h3><?= esc($item['title'] ?? 'Kegiatan sekolah') ?></h3><p><?= esc($item['time'] ?? '') ?><?= !empty($item['location']) ? ' · ' . esc($item['location']) : '' ?></p></div><i data-lucide="chevron-right" aria-hidden="true"></i></article><?php endforeach; ?></div></div><?php endif; ?>
</div></section><?php endif; ?>

<?php if ($galleryItems || $testimonialItems): ?><section class="home-section" id="gallery" aria-labelledby="gallery-title"><div class="theme-container gallery-testimonial-grid">
    <?php if ($galleryItems): ?><div><div class="section-head-row compact"><div><p class="section-kicker">Galeri Kegiatan</p><h2 id="gallery-title">Momen terbaik kami.</h2></div><a class="text-link" href="#gallery">Lihat Galeri Lengkap <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><div class="gallery-home-grid">
        <?php foreach ($galleryItems as $index => $item): ?><a class="gallery-home-item gallery-home-item-<?= (int)($index % 6) ?>" href="#gallery"><?php if (!empty($item['image'])): ?><img src="<?= esc($item['image']) ?>" width="900" height="650" alt="<?= esc($item['title'] ?? 'Dokumentasi sekolah') ?>" loading="lazy" decoding="async"><?php endif; ?></a><?php endforeach; ?>
    </div></div><?php endif; ?>
    <?php if ($testimonialItems): ?><div><div class="section-head-row compact"><div><p class="section-kicker">Testimoni</p><h2>Apa kata mereka tentang sekolah?</h2></div><a class="text-link" href="#testimonials">Lihat Semua Testimoni <i data-lucide="arrow-right" aria-hidden="true"></i></a></div><div class="testimonial-grid-home" id="testimonials"><?php foreach (array_slice($testimonialItems,0,3) as $item): ?><figure class="testimonial-card-home"><blockquote>“<?= esc($item['quote'] ?? $item['content'] ?? '') ?>”</blockquote><figcaption><?php if (!empty($item['image'])): ?><img src="<?= esc($item['image']) ?>" width="80" height="80" alt="" loading="lazy" decoding="async"><?php endif; ?><span><strong><?= esc($item['name'] ?? $item['author'] ?? 'Warga sekolah') ?></strong><small><?= esc($item['role'] ?? '') ?></small></span></figcaption><div class="stars" aria-label="5 dari 5">★★★★★</div></figure><?php endforeach; ?></div></div><?php endif; ?>
</div></section><?php endif; ?>

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
