<?= $this->include('themes/madya/layouts/header') ?>

<?php
$aboutData = is_array($about ?? null) ? $about : (json_decode($about ?? '[]', true) ?: []);
$counterItems = is_array($counter_stats ?? null) ? $counter_stats : (json_decode($counter_stats ?? '[]', true) ?: []);
$heroStats = is_array($hero_stats ?? null) ? $hero_stats : (json_decode($hero_stats ?? '[]', true) ?: []);
$counterItems = array_slice($counterItems ?: $heroStats, 0, 4);
$heroImage = $aboutData['image'] ?? $aboutData['image_url'] ?? '';
$heroWidth = $aboutData['image_width'] ?? $aboutData['width'] ?? 1600;
$heroHeight = $aboutData['image_height'] ?? $aboutData['height'] ?? 1100;
$themeState = [
    'site_name' => $site_name ?? 'SekolahKu',
    'site_tagline' => $site_tagline ?? '',
    'site_description' => $site_description ?? '',
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
    'about' => $aboutData,
    'counter_stats' => $counterItems,
    'hero_stats' => $heroStats,
    'principal' => $principal ?? [],
    'programs' => $programs ?? [],
    'extracurriculars' => $extracurriculars ?? [],
    'teachers' => $teachers ?? [],
    'achievements' => $achievements ?? [],
    'testimonials' => $testimonials ?? [],
    'events' => $events ?? [],
    'galleries' => $galleries ?? [],
    'faq' => $faq ?? [],
    'news' => $news ?? [],
    'urls' => ['news' => base_url('news'), 'downloads' => base_url('downloads'), 'contact' => base_url('contact')],
];
?>

<div data-spa-content>
    <section class="section hero-section" aria-labelledby="hero-title">
        <div class="theme-container hero-editorial">
            <div class="hero-editorial-copy">
                <?php if (!empty($hero_badge)): ?><p class="eyebrow"><?= esc($hero_badge) ?></p><?php endif; ?>
                <p class="hero-kicker">Belajar · Bertumbuh · Berkarya</p>
                <h1 id="hero-title" class="display-title hero-title"><?= esc($hero_title ?: 'Ruang untuk belajar, bertumbuh, dan melangkah.') ?></h1>
                <p class="hero-lead"><?= esc($hero_subtitle ?: ($site_tagline ?? '')) ?></p>
                <div class="hero-actions">
                    <?php if (!empty($hero_btn_primary_url)): ?><a class="button" href="<?= esc($hero_btn_primary_url) ?>"><?= esc($hero_btn_primary_text ?: 'Kenali sekolah') ?></a><?php else: ?><a class="button" href="#profile">Kenali sekolah</a><?php endif; ?>
                    <?php if (!empty($hero_btn_secondary_url)): ?><a class="button button-secondary" href="<?= esc($hero_btn_secondary_url) ?>"><?= esc($hero_btn_secondary_text ?: 'Lihat program') ?></a><?php else: ?><a class="button button-secondary" href="#programs">Lihat program</a><?php endif; ?>
                </div>
            </div>
            <div class="hero-editorial-media-wrap">
                <figure class="hero-media hero-media-editorial">
                    <?php if ($heroImage): ?><img src="<?= esc($heroImage) ?>" width="<?= esc($heroWidth) ?>" height="<?= esc($heroHeight) ?>" alt="Lingkungan <?= esc($site_name ?? 'sekolah') ?>" fetchpriority="high" decoding="async">
                    <?php else: ?><div class="media-placeholder" style="height:100%;min-height:28rem" role="img" aria-label="Lingkungan sekolah"><span><?= esc($site_name ?? 'SekolahKu') ?></span></div><?php endif; ?>
                    <canvas class="campus-scene" data-campus-scene aria-hidden="true"></canvas>
                    <div class="campus-scene-label"><i data-lucide="school" aria-hidden="true"></i><span>Miniatur kampus</span></div>
                    <?php $principalCard = $principal ?? ($teachers[0] ?? []); ?>
                    <div class="hero-principal-card">
                        <?php if (!empty($principalCard['image'])): ?><img src="<?= esc($principalCard['image']) ?>" width="<?= esc($principalCard['image_width'] ?? 900) ?>" height="<?= esc($principalCard['image_height'] ?? 1100) ?>" alt="<?= esc($principalCard['name'] ?? 'Kepala sekolah') ?>" loading="lazy" decoding="async"><?php endif; ?>
                        <div><span>Kepala sekolah</span><strong><?= esc($principalCard['name'] ?? 'Kepala sekolah') ?></strong></div>
                    </div>
                    <?php if (!empty($aboutData['image_caption'])): ?><figcaption><?= esc($aboutData['image_caption']) ?></figcaption><?php endif; ?>
                </figure>
                <div class="hero-note"><span>01</span><p><?= esc($site_tagline ?: 'Ruang belajar untuk tumbuh bersama.') ?></p></div>
            </div>
        </div>
    </section>

    <section class="section section-facts" aria-label="Gambaran singkat sekolah">
        <div class="theme-container"><div class="fact-strip editorial-facts">
            <?php if ($counterItems): foreach ($counterItems as $index => $stat): ?><div class="fact-item"><span class="fact-number"><?= esc(str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT)) ?></span><strong><?= esc($stat['value'] ?? $stat['number'] ?? '') ?></strong><span><?= esc($stat['label'] ?? $stat['title'] ?? '') ?></span></div><?php endforeach; else: ?><div class="fact-item"><strong>—</strong><span>Profil sekolah</span></div><?php endif; ?>
        </div></div>
    </section>

    <section class="section section-alt" id="profile" aria-labelledby="profile-title">
        <div class="theme-container identity-grid">
            <div class="identity-visual">
            <div class="identity-image">
                <?php if ($heroImage): ?><img src="<?= esc($heroImage) ?>" width="<?= esc($heroWidth) ?>" height="<?= esc($heroHeight) ?>" alt="Tentang <?= esc($site_name ?? 'sekolah') ?>" loading="lazy" decoding="async">
                <?php else: ?><div class="media-placeholder" role="img" aria-label="Tentang sekolah"><span><?= esc($site_name ?? 'SekolahKu') ?></span></div><?php endif; ?>
            </div>
            <figure class="illustration-card illustration-card-learning">
                <img src="<?= base_url(($theme_asset_base ?? 'themes/madya/assets') . '/illustrations/learning.svg') ?>" width="720" height="520" alt="Ilustrasi kegiatan belajar di sekolah" loading="lazy" decoding="async">
                <figcaption><i data-lucide="book-open" aria-hidden="true"></i><span>Belajar dengan pengalaman nyata.</span></figcaption>
            </figure>
        </div>
            <div class="identity-copy">
                <p class="eyebrow">Tentang sekolah</p>
                <h2 id="profile-title" class="display-title section-title">Mengenal sekolah lebih dekat.</h2>
                <p><?= esc($aboutData['description'] ?? $aboutData['content_title'] ?? $site_description ?? '') ?></p>
                <?php if (!empty($aboutData['visi'])): ?><div class="identity-vision"><span>Visi</span><p><?= esc($aboutData['visi']) ?></p></div><?php endif; ?>
                <a class="text-link mt-7" href="#profile" data-spa-link>Lihat profil <span aria-hidden="true">→</span></a>
            </div>
        </div>
    </section>

    <section class="section" id="programs" aria-labelledby="program-feature-title">
        <div class="theme-container">
            <?= $this->include('themes/madya/components/section-heading', ['eyebrow' => 'Pilihan belajar', 'title' => 'Pilihan belajar untuk berkembang.', 'description' => 'Program yang memberi ruang untuk mencoba, mendalami minat, dan berkembang.', 'link' => '#programs', 'linkLabel' => 'Semua program']) ?>
            <div class="program-story">
                <?php $featuredProgram = $programs[0] ?? []; ?>
                <div class="program-feature-panel">
                    <span class="program-index">01</span>
                    <h3><?= esc($featuredProgram['title'] ?? $featuredProgram['name'] ?? 'Program akademik') ?></h3>
                    <p><?= esc($featuredProgram['description'] ?? $featuredProgram['excerpt'] ?? 'Ruang belajar untuk mengembangkan rasa ingin tahu dan kemampuan memecahkan masalah.') ?></p>
                    <?php if (!empty($featuredProgram['image'])): ?><div class="program-feature-image"><img src="<?= esc($featuredProgram['image']) ?>" width="1200" height="800" alt="" loading="lazy" decoding="async"></div><?php endif; ?>
                    <a class="text-link" href="#programs">Jelajahi <span aria-hidden="true">↗</span></a>
                </div>
                <div class="program-list">
                    <?php foreach (array_slice($programs, 1, 3) as $index => $program): ?><?= $this->include('themes/madya/components/content/program-row', ['item' => $program, 'index' => $index + 1]) ?><?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>

    <section class="section section-tint" id="extracurriculars" aria-labelledby="extracurricular-title">
        <div class="theme-container">
            <?= $this->include('themes/madya/components/section-heading', ['eyebrow' => 'Di luar kelas', 'title' => 'Tempat minat bertemu pengalaman.', 'description' => 'Kegiatan yang memberi siswa ruang untuk mencoba, bekerja sama, dan menemukan hal yang mereka sukai.', 'link' => '#extracurriculars', 'linkLabel' => 'Lihat semua']) ?>
            <div class="activity-strip">
                <?php foreach (array_slice($extracurriculars ?? [], 0, 4) as $i => $item): ?>
                    <a class="activity-card" href="#extracurriculars">
                        <span class="activity-number"><?= esc(str_pad((string)($i + 1), 2, '0', STR_PAD_LEFT)) ?></span>
                        <span class="activity-icon"><?php if (!empty($item['icon'])): ?><?= $this->include('themes/madya/components/ui/icon', ['name' => $item['icon']]) ?><?php else: ?><i data-lucide="sparkles" aria-hidden="true"></i><?php endif; ?></span>
                        <?php if (!empty($item['image'])): ?><span class="activity-image"><img src="<?= esc($item['image']) ?>" width="640" height="420" alt="" loading="lazy" decoding="async"></span><?php endif; ?>
                        <h3><?= esc($item['title'] ?? 'Kegiatan siswa') ?></h3>
                        <p><?= esc($item['description'] ?? $item['excerpt'] ?? '') ?></p>
                        <span class="activity-arrow" aria-hidden="true">↗</span>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section class="section section-dark people-feature" id="teachers" aria-labelledby="people-title">
        <div class="theme-container people-grid">
            <div class="people-portrait-grid">
                <?php foreach (array_slice($teachers ?? [], 0, 3) as $index => $teacher): ?>
                    <?php $teacherImage = $teacher['image'] ?? $teacher['image_url'] ?? ''; ?>
                    <figure class="teacher-portrait teacher-portrait-<?= $index + 1 ?>">
                        <?php if ($teacherImage): ?><img src="<?= esc($teacherImage) ?>" width="<?= esc($teacher['image_width'] ?? 900) ?>" height="<?= esc($teacher['image_height'] ?? 1100) ?>" alt="<?= esc($teacher['name'] ?? 'Tenaga pendidik') ?>" loading="lazy" decoding="async"><?php else: ?><div class="media-placeholder media-placeholder-dark"><span><?= esc($teacher['name'] ?? 'Tenaga pendidik') ?></span></div><?php endif; ?>
                        <figcaption><strong><?= esc($teacher['name'] ?? '') ?></strong><span><?= esc($teacher['title'] ?? 'Tenaga pendidik') ?></span></figcaption>
                    </figure>
                <?php endforeach; ?>
            </div>
            <div class="people-copy">
                <p class="eyebrow eyebrow-dark">Orang-orang di balik pembelajaran</p>
                <h2 id="people-title" class="display-title section-title">Sekolah tumbuh lewat orang-orangnya.</h2>
                <?php $featuredTeacher = $teachers[0] ?? []; ?>
                <p class="dark-feature-copy"><?= esc($featuredTeacher['bio'] ?? 'Guru, staf, siswa, dan keluarga membentuk budaya belajar yang memberi makna pada setiap hari.') ?></p>
                <div class="people-quote"><i data-lucide="quote" class="quote-mark" aria-hidden="true"></i><p>Belajar bukan hanya tentang hasil, tetapi tentang siapa yang tumbuh di sepanjang jalan.</p></div>
                <a class="button button-light" href="#teachers">Kenali para pengajar <span aria-hidden="true">↗</span></a>
            </div>
        </div>
    </section>

    <section class="section" id="achievements" aria-labelledby="stories-title">
        <div class="theme-container stories-layout">
            <div class="stories-intro"><p class="eyebrow">Cerita & capaian</p><h2 id="stories-title" class="display-title section-title">Capaian yang patut dibanggakan.</h2><p class="editorial-copy">Setiap capaian berawal dari latihan, dukungan, dan keberanian untuk mencoba.</p></div>
            <div class="achievement-list">
                <?php foreach (array_slice($achievements ?? [], 0, 3) as $index => $item): ?><article class="achievement-row"><span class="program-index"><?= esc(str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT)) ?></span><?php if (!empty($item['image'])): ?><img class="achievement-thumb" src="<?= esc($item['image']) ?>" width="<?= esc($item['image_width'] ?? 300) ?>" height="<?= esc($item['image_height'] ?? 220) ?>" alt="<?= esc($item['title'] ?? 'Prestasi siswa') ?>" loading="lazy" decoding="async"><?php endif; ?><div><h3><?= esc($item['title'] ?? 'Prestasi siswa') ?></h3><p><?= esc($item['description'] ?? '') ?></p></div></article><?php endforeach; ?>
            </div>
        </div>
    </section>

    <?php $testimonial = $testimonials[0] ?? []; ?>
    <section class="section testimonial-feature" id="testimonials" aria-labelledby="testimonial-title">
        <div class="theme-container testimonial-feature-grid">
            <div>
                <p class="eyebrow">Cerita dari komunitas</p>
                <h2 id="testimonial-title" class="display-title section-title">Yang paling terasa adalah orang-orangnya.</h2>
            </div>
            <figure class="testimonial-feature-card">
                <?php if (!empty($testimonial['image'])): ?><img src="<?= esc($testimonial['image']) ?>" width="160" height="160" alt="<?= esc($testimonial['name'] ?? 'Warga sekolah') ?>" loading="lazy" decoding="async"><?php endif; ?>
                <blockquote>“<?= esc($testimonial['quote'] ?? 'Sekolah memberi ruang untuk mencoba, bertumbuh, dan menemukan percaya diri.') ?>”</blockquote>
                <figcaption><strong><?= esc($testimonial['name'] ?? 'Warga sekolah') ?></strong><span><?= esc($testimonial['role'] ?? '') ?></span></figcaption>
            </figure>
        </div>
    </section>

    <section class="section section-alt" aria-labelledby="news-title">
        <div class="theme-container">
            <?= $this->include('themes/madya/components/section-heading', ['eyebrow' => 'Kabar sekolah', 'title' => 'Kabar dari sekolah.', 'link' => base_url('news'), 'linkLabel' => 'Semua berita']) ?>
            <div class="news-feature-layout">
                <?php $featuredNews = $news[0] ?? null; ?>
                <?php if ($featuredNews): ?>
                    <?php $featuredNewsUrl = base_url('news/' . ($featuredNews['slug'] ?? '')); ?>
                    <article class="news-feature-item">
                        <a class="news-feature-media" href="<?= esc($featuredNewsUrl) ?>">
                            <?php if (!empty($featuredNews['image'] ?? $featuredNews['image_url'] ?? '')): ?><img src="<?= esc($featuredNews['image'] ?? $featuredNews['image_url']) ?>" width="<?= esc($featuredNews['image_width'] ?? 1200) ?>" height="<?= esc($featuredNews['image_height'] ?? 800) ?>" alt="<?= esc($featuredNews['title'] ?? 'Berita sekolah') ?>" loading="lazy" decoding="async"><?php endif; ?>
                        </a>
                        <div class="news-feature-body"><div class="card-meta"><time datetime="<?= esc($featuredNews['published_at'] ?? $featuredNews['created_at'] ?? '') ?>"><?= esc($featuredNews['published_at'] ?? $featuredNews['created_at'] ?? 'Informasi terbaru') ?></time></div><h3><a href="<?= esc($featuredNewsUrl) ?>"><?= esc($featuredNews['title'] ?? 'Berita sekolah') ?></a></h3><p><?= esc($featuredNews['excerpt'] ?? '') ?></p><a class="text-link" href="<?= esc($featuredNewsUrl) ?>">Baca cerita <span aria-hidden="true">↗</span></a></div>
                    </article>
                <?php else: ?><div class="empty-state"><span class="empty-state-mark" aria-hidden="true">—</span><p>Belum ada berita untuk ditampilkan.</p></div><?php endif; ?>
                <div class="news-list-compact">
                    <?php foreach (array_slice($news ?? [], 1, 3) as $item): ?><article class="news-compact-row"><span class="program-index">Berita</span><div><time datetime="<?= esc($item['published_at'] ?? $item['created_at'] ?? '') ?>"><?= esc($item['published_at'] ?? $item['created_at'] ?? '') ?></time><h3><a href="<?= esc(base_url('news/' . ($item['slug'] ?? ''))) ?>"><?= esc($item['title'] ?? 'Berita sekolah') ?></a></h3></div></article><?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>

    <section class="section" id="events" aria-labelledby="event-title">
        <div class="theme-container events-layout"><div><p class="eyebrow">Agenda</p><h2 id="event-title" class="display-title section-title">Yang sedang berlangsung.</h2><p class="editorial-copy">Agenda belajar, berkegiatan, dan bertemu bersama komunitas sekolah.</p></div><div class="agenda-list"><?php foreach (array_slice($events ?? [], 0, 3) as $event): ?><?= $this->include('themes/madya/components/content/event-row', ['event' => $event]) ?><?php endforeach; ?></div></div>
    </section>

    <section class="section section-alt" id="gallery" aria-labelledby="gallery-title">
        <div class="theme-container">
            <?= $this->include('themes/madya/components/section-heading', ['eyebrow' => 'Dokumentasi', 'title' => 'Potret keseharian di sekolah.', 'link' => '#gallery', 'linkLabel' => 'Lihat galeri']) ?>
            <div class="gallery-editorial-grid"><?php foreach (array_slice($galleries ?? [], 0, 5) as $i => $item): ?><?= $this->include('themes/madya/components/media/gallery-item', ['item' => $item, 'index' => $i]) ?><?php endforeach; ?></div>
        </div>
    </section>

    <section class="section" id="faq" aria-labelledby="faq-title">
        <div class="theme-container faq-preview-grid">
            <div>
                <p class="eyebrow">Pertanyaan umum</p>
                <h2 id="faq-title" class="display-title section-title">Hal-hal yang sering ditanyakan.</h2>
                <a class="text-link" href="#faq">Buka semua jawaban <span aria-hidden="true">→</span></a>
            </div>
            <div class="faq-list">
                <?php foreach (array_slice($faq ?? [], 0, 4) as $i => $item): ?>
                    <details class="faq-item"<?= $i === 0 ? ' open' : '' ?>>
                        <summary><span><?= esc(str_pad((string)($i + 1), 2, '0', STR_PAD_LEFT)) ?></span><?= esc($item['question'] ?? '') ?><i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                        <div class="faq-answer"><?= esc($item['answer'] ?? '') ?></div>
                    </details>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section class="section section-cta" aria-labelledby="contact-title">
        <div class="theme-container cta-editorial"><div><p class="eyebrow">Langkah berikutnya</p><h2 id="contact-title" class="display-title section-title">Mari berkenalan lebih dekat.</h2></div><div><p class="editorial-copy">Hubungi kami untuk informasi tentang pendaftaran, program, kegiatan, dan layanan sekolah.</p><a class="button" href="<?= esc(base_url('contact')) ?>">Hubungi sekolah <span aria-hidden="true">↗</span></a></div></div>
    </section>
</div>

<script id="theme-state" type="application/json"><?= json_encode($themeState, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?></script>
<?= $this->include('themes/madya/layouts/footer') ?>
