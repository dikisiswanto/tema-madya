<?php
$aboutData = is_array($about ?? null) ? $about : (json_decode($about ?? '[]', true) ?: []);
$mediaUrl = static function (?string $value, string $uploadDir = ''): string {
    $value = trim((string)$value);
    if ($value === '') return '';
    if (preg_match('#^https?://#i', $value) || str_starts_with($value, '//') || str_starts_with($value, '/themes/')) return $value;
    return base_url($uploadDir !== '' ? 'uploads/' . trim($uploadDir, '/') . '/' . ltrim($value, '/') : ltrim($value, '/'));
};
$generatedImageBase = base_url(($theme_asset_base ?? 'themes/madya/assets') . '/generated');
$generated = static fn(string $name): string => $generatedImageBase . '/' . $name;
$sectionSettings = is_array($section_settings ?? null) ? $section_settings : (json_decode($section_settings ?? '[]', true) ?: []);
$sectionMeta = static function (string $key, string $fallbackTitle, string $fallbackSubtitle = '') use ($sectionSettings): array {
    $meta = is_array($sectionSettings[$key] ?? null) ? $sectionSettings[$key] : [];
    return [
        'show' => !array_key_exists('show', $meta) || (bool)$meta['show'],
        'title' => trim((string)($meta['title'] ?? $fallbackTitle)) ?: $fallbackTitle,
        'subtitle' => trim((string)($meta['subtitle'] ?? $fallbackSubtitle)) ?: $fallbackSubtitle,
    ];
};
$principalData = is_array($principal ?? null) ? $principal : (json_decode($principal ?? '[]', true) ?: []);
$programItems = is_array($programs ?? null) ? $programs : [];
$extraItems = is_array($extracurriculars ?? null) ? $extracurriculars : [];
$teacherItems = is_array($teachers ?? null) ? $teachers : [];
$achievementItems = is_array($achievements ?? null) ? $achievements : [];
$testimonialItems = is_array($testimonials ?? null) ? $testimonials : [];
$eventItems = is_array($events ?? null) ? $events : [];
$galleryItems = is_array($galleries ?? null) ? $galleries : [];
$newsItems = is_array($news ?? null) ? $news : [];
$heroImage = $aboutData['hero_image'] ?? $aboutData['image'] ?? $aboutData['image_url'] ?? $generated('hero-image.png');
$primaryUrl = $hero_btn_primary_url ?? '/#profile';
$primaryText = $hero_btn_primary_text ?? 'Jelajahi Sekolah';
$secondaryUrl = $hero_btn_secondary_url ?? '/#profile';
$secondaryText = $hero_btn_secondary_text ?? 'Tentang Kami';
$serviceItems = [
    ['icon' => 'user-plus', 'label' => 'SPMB Online', 'desc' => 'Pendaftaran siswa baru', 'url' => $spmb_url ?? '#'],
    ['icon' => 'monitor-play', 'label' => 'E-Learning', 'desc' => 'Belajar di mana saja', 'url' => '/#programs'],
    ['icon' => 'book-open', 'label' => 'Perpustakaan', 'desc' => 'Akses buku & referensi', 'url' => '/#profile'],
    ['icon' => 'bell-ring', 'label' => 'Pengaduan', 'desc' => 'Sampaikan keluhan Anda', 'url' => base_url('contact')],
    ['icon' => 'mail', 'label' => 'Kontak Sekolah', 'desc' => 'Hubungi kami', 'url' => base_url('contact')],
];
$programItems = array_slice($programItems, 0, 4);
$extraItems = array_slice($extraItems, 0, 6);
$teacherItems = array_slice($teacherItems, 0, 4);
$achievementItems = array_slice($achievementItems, 0, 3);
$eventItems = array_slice($eventItems, 0, 4);
$galleryItems = array_slice($galleryItems, 0, 6);
$newsFeatured = $newsItems[0] ?? null;
$newsSecondary = array_slice($newsItems, 1, 3);
$heroTitleMarkup = esc($hero_title ?: 'Membentuk Generasi Berilmu, Berakhlak, dan Berprestasi.');
$heroTitleMarkup = preg_replace('/(Berprestasi\.?)(\s*)$/u', '<span class="hero-title-accent">$1</span>$2', $heroTitleMarkup);
$profileMeta = $sectionMeta('profile', 'Profil Sekolah', 'Mengenal lebih dekat visi, misi, dan sejarah sekolah.');
$programMeta = $sectionMeta('programs', 'Program Unggulan', 'Program unggulan untuk mengembangkan potensi dan bakat siswa.');
$extraMeta = $sectionMeta('extracurriculars', 'Ekstrakurikuler', 'Wadah pengembangan minat dan bakat di luar kelas.');
$teacherMeta = $sectionMeta('teachers', 'Tenaga Pengajar', 'Guru profesional dan berpengalaman di bidangnya.');
$achievementMeta = $sectionMeta('achievements', 'Prestasi Siswa', 'Capaian membanggakan yang telah diraih siswa.');
$testimonialMeta = $sectionMeta('testimonials', 'Testimoni', 'Apa kata mereka tentang sekolah?');
$newsMeta = $sectionMeta('news', 'Berita & Artikel', 'Informasi terkini seputar sekolah.');
$eventMeta = $sectionMeta('events', 'Agenda & Kegiatan', 'Jadwal kegiatan dan acara mendatang.');
$galleryMeta = $sectionMeta('gallery', 'Galeri', 'Dokumentasi kegiatan dan momen berharga.');
$faqMeta = $sectionMeta('faq', 'FAQ', 'Pertanyaan yang sering diajukan.');
$downloadMeta = $sectionMeta('downloads', 'Download Center', 'Dokumen resmi sekolah.');
$contactMeta = $sectionMeta('contact', 'Kontak Kami', 'Hubungi kami untuk informasi lebih lanjut.');
?>
<?php
$homeDescription = trim((string) ($site_description ?? $site_tagline ?? ''));
$homeStructured = [
    '@context' => 'https://schema.org',
    '@type' => 'EducationalOrganization',
    'name' => $site_name ?? 'SekolahKu',
    'url' => base_url(),
    'description' => $homeDescription,
    'telephone' => $contact_phone ?? null,
    'email' => $contact_email ?? null,
    'address' => !empty($contact_address) ? ['@type' => 'PostalAddress', 'streetAddress' => $contact_address] : null,
];
?>
<?= $this->include('themes/madya/layouts/header', [
    'page_title' => $site_name ?? 'SekolahKu',
    'page_description' => $homeDescription,
    'canonical_url' => base_url(),
    'structured_data' => $homeStructured,
]) ?>
<div class="home-page">
  <section class="home-hero" aria-labelledby="hero-title" <?php if ($heroImage): ?>
    style="--hero-bg-image: url('<?= esc($heroImage) ?>')" <?php endif; ?>>
    <div class="theme-container home-hero-grid">
      <div class="home-hero-copy">
        <?php if (!empty($hero_badge)): ?><p class="hero-kicker"><?= esc($hero_badge) ?></p><?php endif; ?>
        <h1 id="hero-title"><?= $heroTitleMarkup ?></h1>
        <p class="hero-lead"><?= esc($hero_subtitle ?: ($site_description ?? $site_tagline ?? '')) ?></p>
        <div class="home-hero-actions">
          <a class="button" href="<?= esc($primaryUrl) ?>"><?= esc($primaryText) ?> <i data-lucide="arrow-right"
              aria-hidden="true"></i></a>
          <a class="button button-secondary" href="<?= esc($secondaryUrl) ?>"><i data-lucide="play-circle"
              aria-hidden="true"></i><?= esc($secondaryText) ?></a>
        </div>
      </div>
    </div>
  </section>

  <section class="home-quick-services" aria-label="Layanan cepat">
    <div class="theme-container quick-service-grid">
      <?php foreach ($serviceItems as $service): ?>
      <a class="quick-service<?= $service['url'] === '#' ? ' is-disabled' : '' ?>" href="<?= esc($service['url']) ?>"
        <?= $service['url'] === '#' ? ' aria-disabled="true" tabindex="-1"' : '' ?>>
        <span class="quick-service-icon"><i data-lucide="<?= esc($service['icon']) ?>" aria-hidden="true"></i></span>
        <span><strong><?= esc($service['label']) ?></strong><small><?= esc($service['desc']) ?></small></span>
      </a>
      <?php endforeach; ?>
    </div>
  </section>

  <?php $counterItems = is_array($counter_stats ?? null) ? array_slice($counter_stats, 0, 4) : []; ?>
  <?php if ($counterItems): ?><section class="home-stat-section" aria-label="Statistik sekolah">
    <div class="theme-container">
      <div class="home-stat-grid">
        <?php foreach ($counterItems as $stat): ?><div class="home-stat-item">
          <?= $this->include('themes/madya/components/ui/icon', ['name' => $stat['icon'] ?? 'sparkles']) ?><div>
            <strong><?= esc($stat['number'] ?? '') ?><?= esc($stat['suffix'] ?? '') ?></strong><span><?= esc($stat['label'] ?? '') ?></span>
          </div>
        </div><?php endforeach; ?>
      </div>
    </div>
  </section><?php endif; ?>

  <section class="home-section home-middle-section" id="profile" aria-label="Profil sekolah">
    <div class="theme-container home-middle-stack">
      <div class="home-middle-grid home-middle-grid-profile">
        <article class="principal-panel">
          <div class="principal-photo">
            <img src="<?= esc($mediaUrl($principalData['photo'] ?? '', 'principal') ?: $generated('principal.jpg')) ?>"
              width="<?= esc($principalData['image_width'] ?? 900) ?>"
              height="<?= esc($principalData['image_height'] ?? 1100) ?>"
              alt="<?= esc($principalData['name'] ?? 'Kepala sekolah') ?>" loading="lazy" decoding="async">
          </div>
          <div class="principal-message">
            <p class="section-kicker">Sambutan Kepala Sekolah</p>
            <blockquote>
              “<?= esc($principalData['welcome_message'] ?? $principalData['quote'] ?? 'Selamat datang di sekolah kami.') ?>”
            </blockquote>
            <p class="principal-description"><?= esc('') ?></p>
            <strong><?= esc($principalData['name'] ?? 'Kepala Sekolah') ?></strong>
            <span><?= esc($principalData['role_title'] ?? $principalData['role'] ?? 'Kepala Sekolah') ?></span>
            <?php
                        $principalFacts = [

                            ['graduation-cap', 'Pendidikan', $principalData['education'] ?? ''],
                            ['briefcase-business', 'Pengabdian', $principalData['years_of_service'] ?? ''],
                            ['award', 'Akreditasi', $aboutData['accreditation'] ?? ''],
                        ];
                        $principalFacts = array_values(array_filter($principalFacts, static fn($fact) => (string)$fact[2] !== ''));
                        if ($principalFacts):
                        ?><div class="principal-facts">
              <?php foreach ($principalFacts as $fact): ?><div><i data-lucide="<?= esc($fact[0]) ?>"
                  aria-hidden="true"></i><span><b><?= esc($fact[1]) ?></b><?= esc($fact[2]) ?></span></div>
              <?php endforeach; ?>
            </div><?php endif; ?>
          </div>
        </article>

        <article class="program-panel" id="programs" aria-labelledby="programs-title">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($programMeta['title']) ?></p>
              <h2 id="programs-title"><?= esc($programMeta['title']) ?></h2>
              <p class="section-description"><?= esc($programMeta['subtitle']) ?></p>
            </div>
            <a class="text-link" href="<?= base_url('/#programs') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <?php if ($programItems): ?><div class="program-showcase-grid">
            <?php foreach (array_slice($programItems, 0, 3) as $index => $item): ?>
            <article class="program-showcase-card">
              <div class="program-showcase-icon" aria-hidden="true">
                <?= $this->include('themes/madya/components/ui/icon', ['name' => $item['icon'] ?? 'star', 'class' => 'program-icon']) ?>
              </div>
              <div class="program-showcase-body">
                <h3><?= esc($item['title'] ?? 'Program Unggulan') ?></h3>
                <p><?= esc($item['description'] ?? $item['excerpt'] ?? 'Program pengembangan potensi siswa.') ?></p>
              </div>
            </article>
            <?php endforeach; ?>
          </div><?php else: ?><div class="empty-inline">Belum ada program unggulan.</div><?php endif; ?>
          <?php if ($extraItems): ?><div class="extra-inline" id="extracurriculars">
            <div class="subsection-label"><span>Ekstrakurikuler</span><a
                href="<?= base_url('/#extracurriculars') ?>">Lihat Semua <i data-lucide="arrow-right"
                  aria-hidden="true"></i></a></div>
            <div class="extra-inline-list">
              <?php foreach (array_slice($extraItems, 0, 4) as $item): $iconColor = preg_match('/^#[0-9a-f]{6}$/i', (string)($item['icon_color'] ?? '')) ? $item['icon_color'] : ''; ?><a
                class="extra-inline-item" href="<?= base_url('/#extracurriculars') ?>"><span class="extra-inline-icon"
                  <?= $iconColor ? ' style="--rich-icon-color:' . esc($iconColor) . '"' : '' ?>><?= $this->include('themes/madya/components/ui/icon', ['name' => $item['icon'] ?? 'users-round', 'color' => $iconColor]) ?></span><span><?= esc($item['title'] ?? 'Kegiatan') ?></span></a><?php endforeach; ?>
            </div>
          </div><?php endif; ?>
        </article>
      </div>

      <div class="home-middle-grid home-middle-grid-people" id="teachers">
        <?php if ($teacherItems): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($teacherMeta['title']) ?></p>
              <h2><?= esc($teacherMeta['subtitle'] ?: 'Tenaga pengajar pilihan.') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#teachers') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="teacher-grid">
            <?php foreach (array_slice($teacherItems, 0, 4) as $index => $item): ?><article class="teacher-card"><img
                src="<?= esc($mediaUrl($item['photo'] ?? '', 'teachers') ?: $generated('teacher-' . (($index % 4) + 1) . '.jpg')) ?>"
                width="900" height="1100" alt="<?= esc($item['name'] ?? 'Tenaga pendidik') ?>" loading="lazy"
                decoding="async">
              <div>
                <strong><?= esc($item['name'] ?? 'Tenaga pendidik') ?></strong><span><?= esc($item['role'] ?? 'Tenaga pendidik') ?></span>
              </div>
            </article><?php endforeach; ?>
          </div>
        </article><?php endif; ?>
        <?php if ($achievementItems): ?><article class="middle-panel" id="achievements">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($achievementMeta['title']) ?></p>
              <h2><?= esc($achievementMeta['subtitle'] ?: 'Mengukir prestasi di berbagai bidang.') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#achievements') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="achievement-list">
            <?php foreach (array_slice($achievementItems, 0, 3) as $item): ?><article class="achievement-list-row"><span
                class="achievement-list-icon"><i data-lucide="trophy" aria-hidden="true"></i></span>
              <div>
                <strong><?= esc(($item['achievement'] ?? 'Prestasi siswa') . (!empty($item['student_name']) ? ' — ' . $item['student_name'] : '')) ?></strong><small><?= esc(trim(($item['level'] ?? '') . (!empty($item['class_name']) ? ' · ' . $item['class_name'] : ''))) ?></small>
              </div><time><?= esc($item['year'] ?? '') ?></time>
            </article><?php endforeach; ?>
          </div>
        </article><?php endif; ?>
      </div>

      <div class="home-middle-grid home-middle-grid-updates" id="updates">
        <?php if ($newsItems): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($newsMeta['title']) ?></p>
              <h2><?= esc($newsMeta['subtitle'] ?: 'Informasi terkini seputar kegiatan sekolah.') ?></h2>
            </div><a class="text-link" href="<?= base_url('news') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="news-home-row">
            <?php if ($newsFeatured): ?><a class="featured-news-home"
              href="<?= base_url('news/' . rawurlencode((string)($newsFeatured['slug'] ?? ''))) ?>"><img
                src="<?= esc($newsFeatured['image'] ?? $generated('news-campus.jpg')) ?>" width="900" height="600"
                alt="<?= esc($newsFeatured['title'] ?? 'Berita sekolah') ?>" loading="lazy" decoding="async">
              <div><span><?= esc($newsFeatured['category'] ?? 'Berita') ?></span>
                <h3><?= esc($newsFeatured['title'] ?? 'Berita sekolah') ?></h3>
                <small><?= esc($newsFeatured['published_at'] ?? '') ?></small>
              </div>
            </a><?php endif; ?>
            <div class="news-home-side"><?php foreach (array_slice($newsItems, 1, 3) as $item): ?><a
                href="<?= base_url('news/' . rawurlencode((string)($item['slug'] ?? ''))) ?>"><img
                  src="<?= esc($item['image'] ?? $generated('news-campus.jpg')) ?>" width="180" height="120" alt=""
                  loading="lazy"
                  decoding="async"><span><strong><?= esc($item['title'] ?? '') ?></strong><small><?= esc($item['published_at'] ?? '') ?></small></span></a><?php endforeach; ?>
            </div>
          </div>
        </article><?php endif; ?>
        <?php if ($eventItems): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($eventMeta['title']) ?></p>
              <h2><?= esc($eventMeta['subtitle'] ?: 'Agenda penting sekolah.') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#events') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="agenda-list" id="events"><?php foreach (array_slice($eventItems, 0, 3) as $item): ?><article
              class="agenda-item"><time
                datetime="<?= esc($item['event_date'] ?? $item['date'] ?? '') ?>"><b><?= esc(!empty($item['event_date']) ? date('d', strtotime((string)$item['event_date'])) : '—') ?></b><span><?= esc(!empty($item['event_date']) ? strtoupper(date('M', strtotime((string)$item['event_date']))) : '') ?></span></time>
              <div>
                <h3><?= esc($item['title'] ?? 'Kegiatan sekolah') ?></h3>
                <p>
                  <?= esc($item['event_time'] ?? '') ?><?= !empty($item['location']) ? ' · ' . esc($item['location']) : '' ?>
                </p>
              </div><i data-lucide="chevron-right" aria-hidden="true"></i>
            </article><?php endforeach; ?></div>
        </article><?php endif; ?>
      </div>

      <div class="home-middle-grid home-middle-grid-community" id="gallery">
        <?php if ($galleryItems): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($galleryMeta['title']) ?></p>
              <h2><?= esc($galleryMeta['subtitle'] ?: 'Momen terbaik kami.') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#gallery') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="gallery-home-grid gallery-home-grid-compact">
            <?php foreach (array_slice($galleryItems, 0, 4) as $index => $item): ?><a
              class="gallery-home-item gallery-home-item-<?= $index ?>" href="<?= base_url('/#gallery') ?>"><img
                src="<?= esc($item['image'] ?? $generated('gallery-' . (['students', 'class', 'library'][$index % 3]) . '.jpg')) ?>"
                width="700" height="520" alt="<?= esc($item['caption'] ?? 'Dokumentasi sekolah') ?>" loading="lazy"
                decoding="async"></a><?php endforeach; ?></div>
        </article><?php endif; ?>
        <?php if ($testimonialItems): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($testimonialMeta['title']) ?></p>
              <h2><?= esc($testimonialMeta['subtitle'] ?: 'Apa kata mereka tentang sekolah?') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#testimonials') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="testimonial-feature" id="testimonials"><?php $testimonial = $testimonialItems[0]; ?><div
              class="testimonial-quote-mark">“</div>
            <blockquote><?= esc($testimonial['quote'] ?? $testimonial['content'] ?? '') ?></blockquote>
            <div class="testimonial-person"><img
                src="<?= esc($mediaUrl($testimonial['photo'] ?? '', 'testimonials') ?: $generated('testimonial-1.jpg')) ?>"
                width="80" height="80" alt="" loading="lazy"
                decoding="async"><span><strong><?= esc($testimonial['name'] ?? $testimonial['author'] ?? 'Warga sekolah') ?></strong><small><?= esc($testimonial['role'] ?? '') ?></small></span>
            </div>
          </div>
        </article><?php endif; ?>
      </div>
    </div>
  </section>

  <?php if (!empty($spmb_url)): ?>
  <section class="home-section section-soft" id="spmb">
    <div class="theme-container">
      <aside class="spmb-home-banner">
        <div>
          <p class="section-kicker">SPMB Online</p>
          <h2>Pendaftaran peserta didik baru.</h2>
          <p>Bergabung bersama kami dan raih masa depan gemilang.</p><a class="button button-accent"
            href="<?= esc($spmb_url) ?>">Daftar Sekarang <i data-lucide="arrow-right" aria-hidden="true"></i></a>
        </div>
        <?php if ($heroImage): ?><img src="<?= esc($heroImage) ?>" width="800" height="600" alt="" loading="lazy"
          decoding="async"><?php endif; ?>
      </aside>
    </div>
  </section>
  <?php endif; ?>

  <?php if ($contactMeta['show']): ?><section class="home-contact-strip" id="contact" aria-label="Kontak sekolah">
    <div class="theme-container contact-strip-grid">
      <div><i data-lucide="map-pin"
          aria-hidden="true"></i><span><b>Alamat</b><small><?= esc($contact_address ?? '—') ?></small></span></div>
      <div><i data-lucide="phone"
          aria-hidden="true"></i><span><b>Telepon</b><small><?= esc($contact_phone ?? '—') ?></small></span></div>
      <div><i data-lucide="mail"
          aria-hidden="true"></i><span><b>Email</b><small><?= esc($contact_email ?? '—') ?></small></span></div>
      <div><i data-lucide="clock-3" aria-hidden="true"></i><span><b>Jam
            Layanan</b><small><?= esc($contact_hours ?? '—') ?></small></span></div>
    </div>
  </section><?php endif; ?>
</div>
<?= $this->include('themes/madya/layouts/footer') ?>
