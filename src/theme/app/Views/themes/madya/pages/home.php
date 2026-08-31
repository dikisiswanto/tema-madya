<?php
$aboutData = is_array($about ?? null) ? $about : (json_decode($about ?? '[]', true) ?: []);
$mediaUrl = static function (?string $value, string $uploadDir = ''): string {
    $value = trim((string) $value);
    if ($value === '') {
        return '';
    }
    if (preg_match('#^(?:https?:)?//#i', $value) || str_starts_with($value, '/')) {
        return $value;
    }
    return base_url($uploadDir !== '' ? 'uploads/' . trim($uploadDir, '/') . '/' . ltrim($value, '/') : ltrim($value, '/'));
};
$sectionSettings = is_array($section_settings ?? null) ? $section_settings : (json_decode($section_settings ?? '[]', true) ?: []);
$sectionMeta = static function (string $key, string $fallbackTitle, string $fallbackSubtitle = '') use ($sectionSettings): array {
    $meta = is_array($sectionSettings[$key] ?? null) ? $sectionSettings[$key] : [];
    return [
        'show' => !array_key_exists('show', $meta) || (bool) $meta['show'],
        'title' => trim((string)($meta['title'] ?? $fallbackTitle)) ?: $fallbackTitle,
        'subtitle' => trim((string)($meta['subtitle'] ?? $fallbackSubtitle)) ?: $fallbackSubtitle,
    ];
};
$principalData = is_array($principal ?? null) ? $principal : (json_decode($principal ?? '[]', true) ?: []);
$visibleItems = static function ($items): array {
    if (!is_array($items)) {
        return [];
    }
    return array_values(array_filter($items, static fn($item) => !array_key_exists('show', (array) $item) || (bool) $item['show']));
};
$programItems = $visibleItems($programs ?? []);
$extraItems = $visibleItems($extracurriculars ?? []);
$teacherItems = $visibleItems($teachers ?? []);
$achievementItems = $visibleItems($achievements ?? []);
$testimonialItems = $visibleItems($testimonials ?? []);
$eventItems = $visibleItems($events ?? []);
$galleryItems = $visibleItems($galleries ?? []);
$newsItems = $visibleItems($news ?? []);
$heroImage = trim((string) ($aboutData['hero_image'] ?? $aboutData['image'] ?? $aboutData['image_url'] ?? ''));
$heroImage = $heroImage !== '' ? $heroImage : base_url('themes/madya/assets/generated/hero-image.jpg');
$primaryUrl = trim((string) ($hero_btn_primary_url ?? '')) ?: '/#profile';
$primaryText = trim((string) ($hero_btn_primary_text ?? '')) ?: 'Jelajahi Sekolah';
$secondaryUrl = trim((string) ($hero_btn_secondary_url ?? '')) ?: '/#contact';
$secondaryText = trim((string) ($hero_btn_secondary_text ?? '')) ?: 'Hubungi Kami';
$configuredServiceLinks = is_array($footer_links ?? null) ? $footer_links : (json_decode($footer_links ?? '[]', true) ?: []);
$serviceItems = [];
if (!empty($spmb_url) && $spmb_url !== '#') {
    $serviceItems[] = ['icon' => 'user-plus', 'label' => 'SPMB Online', 'desc' => 'Informasi pendaftaran siswa baru', 'url' => $spmb_url];
}
foreach (array_slice($configuredServiceLinks, 0, 4) as $service) {
    $label = trim((string) ($service['label'] ?? $service['title'] ?? ''));
    $url = trim((string) ($service['url'] ?? ''));
    if ($label === '' || $url === '' || $url === '#') {
        continue;
    }
    $serviceItems[] = ['icon' => 'arrow-up-right', 'label' => $label, 'desc' => 'Layanan dan informasi sekolah', 'url' => $url];
}
if (!$serviceItems) {
    $serviceItems = [
        ['icon' => 'newspaper', 'label' => 'Berita Sekolah', 'desc' => 'Informasi terbaru sekolah', 'url' => base_url('news')],
        ['icon' => 'download', 'label' => 'Dokumen', 'desc' => 'Dokumen resmi sekolah', 'url' => base_url('downloads')],
        ['icon' => 'mail', 'label' => 'Kontak Sekolah', 'desc' => 'Hubungi sekolah', 'url' => base_url('contact')],
    ];
}
$allProgramItems = $programItems;
$allExtraItems = $extraItems;
$allTeacherItems = $teacherItems;
$allAchievementItems = $achievementItems;
$allEventItems = $eventItems;
$allGalleryItems = $galleryItems;

$programItems = array_slice($programItems, 0, 4);
$extraItems = array_slice($extraItems, 0, 6);
$teacherItems = array_slice($teacherItems, 0, 4);
$achievementItems = array_slice($achievementItems, 0, 3);
$eventItems = array_slice($eventItems, 0, 4);
$galleryItems = array_slice($galleryItems, 0, 6);
$newsFeatured = $newsItems[0] ?? null;
$newsSecondary = array_slice($newsItems, 1, 3);
$heroTitle = trim((string) ($hero_title ?? ''));
$heroTitle = $heroTitle !== '' ? $heroTitle : ('Selamat Datang di ' . ($site_name ?? 'Sekolah'));
$heroTitleMarkup = esc($heroTitle);
$heroTitleMarkup = preg_replace('/(' . preg_quote($site_name ?? 'Sekolah', '/') . ')(\s*)$/u', '<span class="hero-title-accent">$1</span>$2', $heroTitleMarkup);
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
<?php
// The CMS homepage is server-rendered first, then the same real CMS data is
// exposed to the hash-enhancement renderer. Playground keeps using demo.json.
$themeStateImage = static function ($value, string $uploadDir = '') use ($mediaUrl): string {
    return $mediaUrl((string) $value, $uploadDir);
};
$themeStateAbout = $aboutData;
foreach (['hero_image', 'image', 'image_url'] as $imageKey) {
    if (!empty($themeStateAbout[$imageKey])) {
        $themeStateAbout[$imageKey] = $themeStateImage($themeStateAbout[$imageKey]);
    }
}
$themeStatePrincipal = $principalData;
if (isset($themeStatePrincipal['quote']) && !isset($themeStatePrincipal['welcome_message'])) {
    $themeStatePrincipal['welcome_message'] = $themeStatePrincipal['quote'];
}
if (isset($themeStatePrincipal['sambutan']) && !isset($themeStatePrincipal['welcome_message'])) {
    $themeStatePrincipal['welcome_message'] = $themeStatePrincipal['sambutan'];
}
if (isset($themeStatePrincipal['role']) && !isset($themeStatePrincipal['role_title'])) {
    $themeStatePrincipal['role_title'] = $themeStatePrincipal['role'];
}
if (!empty($themeStatePrincipal['photo'])) {
    $themeStatePrincipal['photo'] = $themeStateImage($themeStatePrincipal['photo'], 'principal');
}
$themeStateCollection = static function (array $items, string $imageField, string $uploadDir = '') use ($themeStateImage): array {
    return array_map(static function ($item) use ($imageField, $uploadDir, $themeStateImage) {
        $item = (array) $item;
        if (!empty($item[$imageField])) {
            $item[$imageField] = $themeStateImage($item[$imageField], $uploadDir);
        }
        return $item;
    }, $items);
};
$themeStateTeachers = $themeStateCollection($allTeacherItems, 'photo', 'teachers');
$themeStateAchievements = $themeStateCollection($allAchievementItems, 'photo', 'achievements');
$themeStateTestimonials = $themeStateCollection($testimonialItems, 'photo', 'testimonials');
$themeStateGalleries = $themeStateCollection($allGalleryItems, 'image', 'gallery');
$themeStateNews = array_map(static function ($item) use ($themeStateImage) {
    $item = (array) $item;
    if (!empty($item['image'])) {
        $item['image'] = $themeStateImage($item['image'], 'news');
    }
    if (!empty($item['image_url'])) {
        $item['image_url'] = $themeStateImage($item['image_url'], 'news');
    }
    return $item;
}, $newsItems);

$themeState = [
    'site_name' => $site_name ?? '',
    'site_tagline' => $site_tagline ?? '',
    'site_description' => $site_description ?? '',
    'site_logo_text' => $site_logo_text ?? '',
    'site_logo_icon' => $site_logo_icon ?? 'graduation-cap',
    'social_facebook' => $social_facebook ?? '',
    'social_instagram' => $social_instagram ?? '',
    'social_youtube' => $social_youtube ?? '',
    'social_tiktok' => $social_tiktok ?? '',
    'footer_description' => $footer_description ?? '',
    'footer_copyright' => $footer_copyright ?? '',
    'footer_services' => is_array($footer_services ?? null) ? $footer_services : (json_decode($footer_services ?? '[]', true) ?: []),
    'footer_links' => $configuredServiceLinks,
    'spmb_url' => $spmb_url ?? '',
    'contact_phone' => $contact_phone ?? '',
    'contact_email' => $contact_email ?? '',
    'contact_address' => $contact_address ?? '',
    'contact_hours' => $contact_hours ?? '',
    'hero_badge' => $hero_badge ?? '',
    'hero_title' => $hero_title ?? '',
    'hero_subtitle' => $hero_subtitle ?? '',
    'hero_btn_primary_text' => $hero_btn_primary_text ?? '',
    'hero_btn_primary_url' => $hero_btn_primary_url ?? '',
    'hero_btn_secondary_text' => $hero_btn_secondary_text ?? '',
    'hero_btn_secondary_url' => $hero_btn_secondary_url ?? '',
    'theme_color' => $theme_color ?? 'default',
    'runtime' => 'cms-home',
    'asset_base' => base_url($theme_asset_base ?? 'themes/madya/assets'),
    'section_settings' => $sectionSettings,
    'about' => $themeStateAbout,
    'principal' => $themeStatePrincipal,
    'counter_stats' => is_array($counter_stats ?? null) ? $counter_stats : (json_decode($counter_stats ?? '[]', true) ?: []),
    'hero_stats' => is_array($hero_stats ?? null) ? $hero_stats : (json_decode($hero_stats ?? '[]', true) ?: []),
    'navigation' => is_array($menu_tree ?? null) ? $menu_tree : [],
    'programs' => $allProgramItems,
    'extracurriculars' => $allExtraItems,
    'teachers' => $themeStateTeachers,
    'achievements' => $themeStateAchievements,
    'testimonials' => $themeStateTestimonials,
    'events' => $allEventItems,
    'galleries' => $themeStateGalleries,
    'faq' => $faq ?? [],
    'news' => $themeStateNews,
    'urls' => [
        'home' => base_url(),
        'news' => base_url('news'),
        'downloads' => base_url('downloads'),
        'contact' => base_url('contact'),
    ],
];
$themeStateJson = json_encode($themeState, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
?>
<?php $this->setData([
    'page_title' => $site_name ?? 'SekolahKu',
    'page_description' => $homeDescription,
    'canonical_url' => base_url(),
    'structured_data' => $homeStructured,
    'og_image' => $heroImage ?: null,
    'preload_image' => $heroImage ?: null,
]) ?>
<?= $this->include('themes/madya/layouts/header') ?>
<script id="theme-state" type="application/json"><?= $themeStateJson ?></script>
<div class="home-page" data-spa-content data-spa-runtime="cms-home">
  <section class="home-hero<?= $heroImage ? '' : ' home-hero-no-image' ?>" aria-labelledby="hero-title" <?php if ($heroImage): ?>
    style="--hero-bg-image: url('<?= esc($heroImage) ?>')" 
<?php endif; ?>>
    
    <div class="theme-container home-hero-grid">
      <div class="home-hero-copy">
        <?php if (!empty($hero_badge)): ?>
<p class="hero-kicker"><?= esc($hero_badge) ?></p>
<?php endif; ?>
        <h1 id="hero-title"><?= $heroTitleMarkup ?></h1>
        <p class="hero-lead"><?= esc($hero_subtitle ?: ($site_description ?? $site_tagline ?? '')) ?></p>
        <div class="home-hero-actions">
          <a class="button" href="<?= esc($primaryUrl) ?>"><?= esc($primaryText) ?> <?= view('themes/madya/components/ui/icon', ['name' => 'arrow-right']) ?></a>
          <a class="button button-secondary" href="<?= esc($secondaryUrl) ?>"><?= view('themes/madya/components/ui/icon', ['name' => 'play-circle']) ?><?= esc($secondaryText) ?></a>
        </div>
      </div>
    </div>
  </section>

  <section class="home-quick-services" aria-label="Layanan cepat">
    <div class="theme-container quick-service-grid quick-service-grid-count-<?= count($serviceItems) ?>">
      <?php foreach ($serviceItems as $service): ?>
      <a class="quick-service<?= $service['url'] === '#' ? ' is-disabled' : '' ?>" href="<?= esc($service['url']) ?>"
        <?= $service['url'] === '#' ? ' aria-disabled="true" tabindex="-1"' : '' ?>>
        <span class="quick-service-icon"><?= view('themes/madya/components/ui/icon', ['name' => $service['icon'] ?? 'arrow-up-right']) ?></span>
        <span><strong><?= esc($service['label']) ?></strong><small><?= esc($service['desc']) ?></small></span>
      </a>
      
<?php endforeach; ?>
    </div>
  </section>

  <?php
$counterItems = is_array($counter_stats ?? null) ? array_slice($counter_stats, 0, 4) : [];
$statIconClass = static function (array $stat): string {
    $configured = trim((string) ($stat['icon'] ?? ''));
    if (preg_match('/^(?:(?:fa|fas|far|fab|fal|fat|fad)\s+fa-[a-z0-9-]+|fa-[a-z0-9-]+)$/i', $configured)) {
        return preg_match('/^fa-[a-z0-9-]+$/i', $configured) ? 'fas ' . $configured : $configured;
    }
    $label = strtolower(trim((string) ($stat['label'] ?? '')));
    if (str_contains($label, 'guru') || str_contains($label, 'pengajar') || str_contains($label, 'tenaga')) {
        return 'fas fa-chalkboard-user';
    }
    if (str_contains($label, 'prestasi') || str_contains($label, 'capaian')) {
        return 'fas fa-trophy';
    }
    if (str_contains($label, 'program') || str_contains($label, 'kegiatan')) {
        return 'fas fa-layer-group';
    }
    if (str_contains($label, 'siswa') || str_contains($label, 'murid') || str_contains($label, 'peserta')) {
        return 'fas fa-user-graduate';
    }
    return 'fas fa-school';
};
$mediaFallbackIcon = static function (string $kind): string {
    $icons = [
        'teacher' => 'fas fa-chalkboard-user',
        'achievement' => 'fas fa-trophy',
        'program' => 'fas fa-graduation-cap',
        'extracurricular' => 'fas fa-people-group',
        'gallery' => 'fas fa-images',
        'news' => 'fas fa-newspaper',
    ];
    return $icons[$kind] ?? 'fas fa-image';
};
?>
  <?php if ($counterItems): ?><section class="home-stat-section" aria-label="Statistik sekolah">
    <div class="theme-container">
      <div class="home-stat-grid">
        <?php foreach ($counterItems as $stat): ?><div class="home-stat-item">
          <span class="home-stat-icon" aria-hidden="true"><i class="<?= esc($statIconClass((array) $stat)) ?>"></i></span><div>
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
            <?php $principalPhoto = $mediaUrl($principalData['photo'] ?? '', 'principal'); ?>
            <?php if ($principalPhoto): ?><img src="<?= esc($principalPhoto) ?>"
              width="<?= esc($principalData['image_width'] ?? 720) ?>"
              height="<?= esc($principalData['image_height'] ?? 900) ?>"
              alt="<?= esc($principalData['name'] ?? 'Foto kepala sekolah') ?>" loading="lazy" decoding="async"><?php else: ?><div class="madya-media-fallback madya-media-fallback-principal" aria-hidden="true"><i class="fas fa-user-tie"></i></div><?php endif; ?>
          </div>
          <div class="principal-message">
            <p class="section-kicker">Sambutan Kepala Sekolah</p>
            <?php if (!empty($principalData['welcome_message'] ?? $principalData['quote'] ?? '')): ?>
            <blockquote>“<?= esc($principalData['welcome_message'] ?? $principalData['quote']) ?>”</blockquote>
            <?php endif; ?>
            <?php if (!empty($principalData['name'])): ?><strong><?= esc($principalData['name']) ?></strong><?php endif; ?>
            <?php if (!empty($principalData['role_title'] ?? $principalData['role'])): ?><span><?= esc($principalData['role_title'] ?? $principalData['role']) ?></span><?php endif; ?>
            <?php
                        $principalFacts = [

                            ['graduation-cap', 'Pendidikan', $principalData['education'] ?? ''],
                            ['briefcase-business', 'Pengabdian', $principalData['years_of_service'] ?? ''],
                            ['award', 'Akreditasi', $aboutData['accreditation'] ?? ''],
                        ];
                        $principalFacts = array_values(array_filter($principalFacts, static fn($fact) => (string) $fact[2] !== ''));
                        if ($principalFacts):
                        ?><div class="principal-facts">
              <?php foreach ($principalFacts as $fact): ?>
<div><i data-lucide="<?= esc($fact[0]) ?>"
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
          <?php if ($programItems && $programMeta['show']): ?><div class="program-showcase-grid">
            <?php foreach (array_slice($programItems, 0, 3) as $index => $item): ?>
            <article class="program-showcase-card">
              <div class="program-showcase-media program-showcase-icon" aria-hidden="true">
                <?= view('themes/madya/components/ui/icon', ['name' => $item['icon'] ?? 'graduation-cap', 'class' => 'program-icon']) ?>
              </div>
              <div class="program-showcase-body">
                <h3><?= esc($item['title'] ?? '') ?></h3>
                <p><?= esc($item['description'] ?? $item['excerpt'] ?? '') ?></p>
              </div>
            </article>
            <?php endforeach; ?>
          </div><?php else: ?><div class="empty-inline">Belum ada program unggulan.</div><?php endif; ?>
          <?php if ($extraItems && $extraMeta['show']): ?><div class="extra-inline" id="extracurriculars">
            <div class="subsection-label"><span>Ekstrakurikuler</span><a
                href="<?= base_url('/#extracurriculars') ?>">Lihat Semua <i data-lucide="arrow-right"
                  aria-hidden="true"></i></a></div>
            <div class="extra-inline-list">
              <?php foreach (array_slice($extraItems, 0, 4) as $item): $iconColor = preg_match('/^#[0-9a-f]{6}$/i', (string)($item['icon_color'] ?? '')) ? $item['icon_color'] : ''; ?><a
                class="extra-inline-item" href="<?= base_url('/#extracurriculars') ?>"><span class="extra-inline-icon"
                  <?= $iconColor ? ' style="--rich-icon-color:' . esc($iconColor) . '"' : '' ?>><?= view('themes/madya/components/ui/icon', ['name' => $item['icon'] ?? 'users-round', 'color' => $iconColor]) ?></span><span><?= esc($item['title'] ?? '') ?></span></a><?php endforeach; ?>
            </div>
          </div><?php endif; ?>
        </article>
      </div>

      <div class="home-middle-grid home-middle-grid-people" id="teachers">
        <?php if ($teacherItems && $teacherMeta['show']): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($teacherMeta['title']) ?></p>
              <h2><?= esc($teacherMeta['subtitle'] ?: 'Tenaga pengajar pilihan.') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#teachers') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="teacher-grid">
            <?php foreach (array_slice($teacherItems, 0, 4) as $index => $item): ?><article class="madya-teacher-card">
              <?php $teacherPhoto = $mediaUrl($item['photo'] ?? '', 'teachers'); ?>
              <?php if ($teacherPhoto): ?><img src="<?= esc($teacherPhoto) ?>" width="900" height="1100"
                alt="<?= esc($item['name'] ?? 'Foto tenaga pendidik') ?>" loading="lazy" decoding="async">
              <?php else: ?><div class="madya-media-fallback madya-media-fallback-teacher" aria-hidden="true"><i class="<?= esc($mediaFallbackIcon('teacher')) ?>"></i></div><?php endif; ?>
              <div>
                <?php if (!empty($item['name'])): ?><strong><?= esc($item['name']) ?></strong><?php endif; ?><?php if (!empty($item['role'])): ?><span><?= esc($item['role']) ?></span><?php endif; ?>
              </div>
            </article><?php endforeach; ?>
          </div>
        </article><?php endif; ?>
        <?php if ($achievementItems && $achievementMeta['show']): ?><article class="middle-panel" id="achievements">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($achievementMeta['title']) ?></p>
              <h2><?= esc($achievementMeta['subtitle'] ?: 'Mengukir prestasi di berbagai bidang.') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#achievements') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="achievement-list">
            <?php foreach (array_slice($achievementItems, 0, 3) as $item): ?><article class="achievement-list-row"><span class="achievement-list-icon" aria-hidden="true"><i class="fas fa-trophy"></i></span>
              <div>
                <strong><?= esc(($item['achievement'] ?? 'Prestasi siswa') . (!empty($item['student_name']) ? ' — ' . $item['student_name'] : '')) ?></strong><small><?= esc(trim(($item['level'] ?? '') . (!empty($item['class_name']) ? ' · ' . $item['class_name'] : ''))) ?></small>
              </div><time><?= esc($item['year'] ?? '') ?></time>
            </article><?php endforeach; ?>
          </div>
        </article><?php endif; ?>
      </div>

      <div class="home-middle-grid home-middle-grid-updates" id="updates">
        <?php if ($newsItems && $newsMeta['show']): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($newsMeta['title']) ?></p>
              <h2><?= esc($newsMeta['subtitle'] ?: 'Informasi terkini seputar kegiatan sekolah.') ?></h2>
            </div><a class="text-link" href="<?= base_url('news') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="news-home-row">
            <?php if ($newsFeatured): ?>
<a class="featured-news-home"
              href="<?= base_url('news/' . rawurlencode((string)($newsFeatured['slug'] ?? ''))) ?>"><span class="home-news-media"><?php if ($mediaUrl($newsFeatured['image'] ?? '', 'news')): ?><img src="<?= esc($mediaUrl($newsFeatured['image'] ?? '', 'news')) ?>" width="900" height="600" alt="<?= esc($newsFeatured['title'] ?? '') ?>" loading="lazy" decoding="async"><?php else: ?><span class="madya-media-fallback" aria-hidden="true"><i class="fas fa-newspaper"></i></span><?php endif; ?></span>
              <div><span><?= esc($newsFeatured['category'] ?? '') ?></span>
                <h3><?= esc($newsFeatured['title'] ?? '') ?></h3>
                <small><?= esc($newsFeatured['published_at'] ?? '') ?></small>
              </div>
            </a>
<?php endif; ?>
            <div class="news-home-side"><?php foreach (array_slice($newsItems, 1, 3) as $item): ?>
<a
                href="<?= base_url('news/' . rawurlencode((string)($item['slug'] ?? ''))) ?>"><span class="home-news-media"><?php if ($mediaUrl($item['image'] ?? '', 'news')): ?><img src="<?= esc($mediaUrl($item['image'] ?? '', 'news')) ?>" width="180" height="120" alt="" loading="lazy" decoding="async"><?php else: ?><span class="madya-media-fallback" aria-hidden="true"><i class="fas fa-newspaper"></i></span><?php endif; ?></span><span><strong><?= esc($item['title'] ?? '') ?></strong><small><?= esc($item['published_at'] ?? '') ?></small></span></a>
<?php endforeach; ?>
            </div>
          </div>
        </article><?php endif; ?>
        <?php if ($eventItems && $eventMeta['show']): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($eventMeta['title']) ?></p>
              <h2><?= esc($eventMeta['subtitle'] ?: 'Agenda penting sekolah.') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#events') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="agenda-list" id="events"><?php foreach (array_slice($eventItems, 0, 3) as $item): ?><article
              class="agenda-item"><time
                datetime="<?= esc($item['event_date'] ?? $item['date'] ?? '') ?>"><b><?= esc(!empty($item['event_date']) ? date('d', strtotime((string) $item['event_date'])) : '—') ?></b><span><?= esc(!empty($item['event_date']) ? strtoupper(date('M', strtotime((string) $item['event_date']))) : '') ?></span></time>
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
        <?php if ($galleryItems && $galleryMeta['show']): ?><article class="middle-panel">
          <div class="section-head-row compact">
            <div>
              <p class="section-kicker"><?= esc($galleryMeta['title']) ?></p>
              <h2><?= esc($galleryMeta['subtitle'] ?: 'Momen terbaik kami.') ?></h2>
            </div><a class="text-link" href="<?= base_url('/#gallery') ?>">Lihat Semua <i data-lucide="arrow-right"
                aria-hidden="true"></i></a>
          </div>
          <div class="gallery-home-grid gallery-home-grid-compact">
            <?php foreach (array_slice($galleryItems, 0, 4) as $index => $item): ?><a
              class="gallery-home-item gallery-home-item-<?= $index ?>" href="<?= base_url('/#gallery') ?>"><?php if (!empty($item['image'])): ?><img
                src="<?= esc($item['image']) ?>"
                width="700" height="520" alt="<?= esc($item['caption'] ?? 'Dokumentasi sekolah') ?>" loading="lazy"
                decoding="async"><?php else: ?><span class="madya-media-fallback" aria-hidden="true"><i class="fas fa-images"></i></span><?php endif; ?></a><?php endforeach; ?></div>
        </article><?php endif; ?>
        <?php if ($testimonialItems && $testimonialMeta['show']): ?><article class="middle-panel">
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
            <div class="testimonial-person">
              <?php $testimonialPhoto = $mediaUrl($testimonial['photo'] ?? '', 'testimonials'); ?><?php if ($testimonialPhoto): ?><img src="<?= esc($testimonialPhoto) ?>" width="80" height="80" alt="" loading="lazy" decoding="async"><?php else: ?><span class="madya-media-fallback madya-media-fallback-avatar" aria-hidden="true"><i class="fas fa-user"></i></span><?php endif; ?><span><strong><?= esc($testimonial['name'] ?? $testimonial['author'] ?? '') ?></strong><small><?= esc($testimonial['role'] ?? '') ?></small></span>
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
        <?php if ($heroImage): ?>
<img src="<?= esc($heroImage) ?>" width="800" height="600" alt="" loading="lazy" decoding="async">
<?php else: ?><span class="madya-media-fallback madya-media-fallback-spmb" aria-hidden="true"><i class="fas fa-user-plus"></i></span><?php endif; ?>
      </aside>
    </div>
  </section>
  <?php endif; ?>

  <?php if ($contactMeta['show']): ?>
<section class="home-contact-strip" id="contact" aria-label="Kontak sekolah">
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
  </section>
<?php endif; ?>
</div>
<?= $this->include('themes/madya/layouts/footer') ?>
