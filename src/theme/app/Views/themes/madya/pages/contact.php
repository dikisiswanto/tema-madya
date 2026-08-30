<?php
$banner = [];
if (!empty($page_banners)) {
    $decoded = is_string($page_banners) ? json_decode($page_banners, true) : $page_banners;
    $banner = is_array($decoded) ? ($decoded['contact'] ?? []) : [];
}
$heroImage = $banner['image'] ?? base_url(($theme_asset_base ?? 'themes/madya/assets') . '/generated/hero-image.jpg');
$about = [];
if (!empty($about)) {
    $about = is_string($about) ? (json_decode($about, true) ?: []) : $about;
}
$facebook = trim((string)($social_facebook ?? ''));
$instagram = trim((string)($social_instagram ?? ''));
$youtube = trim((string)($social_youtube ?? ''));
$accreditation = $about['accreditation'] ?? '';
$mapQuery = rawurlencode((string)($contact_address ?? ''));
$contactCanonical = base_url('contact');
$contactDescription = $banner['subtitle'] ?? 'Temukan alamat, kanal resmi, dan formulir untuk menghubungi sekolah.';
$contactStructured = ['@context' => 'https://schema.org','@type' => 'ContactPage','name' => $banner['title'] ?? 'Kontak Sekolah','description' => $contactDescription,'url' => $contactCanonical,'isPartOf' => ['@type' => 'WebSite','name' => $site_name ?? 'SekolahKu','url' => base_url()]];
?>
<?= $this->include('themes/madya/layouts/header', ['page_title' => $banner['title'] ?? 'Kontak Sekolah', 'page_description' => $contactDescription, 'canonical_url' => $contactCanonical, 'structured_data' => $contactStructured, 'og_image' => $heroImage]) ?>
<?= $this->include('themes/madya/components/page-header', [
    'eyebrow' => $banner['badge'] ?? 'Hubungi Sekolah',
    'title' => $banner['title'] ?? 'Kontak Sekolah',
    'description' => $banner['subtitle'] ?? 'Kami siap membantu Anda. Hubungi kami untuk informasi, kerja sama, atau layanan sekolah lainnya.',
    'image' => $heroImage,
    'breadcrumbs' => [['label' => 'Kontak']],
]) ?>

<section class="contact-overlap-section section">
    <div class="theme-container">
        <div class="contact-summary contact-summary-five">
            <div class="contact-summary-item"><span class="contact-summary-icon"><i data-lucide="map-pin" aria-hidden="true"></i></span><div><strong>Alamat</strong><small><?= esc($contact_address ?: '—') ?></small></div></div>
            <div class="contact-summary-item"><span class="contact-summary-icon"><i data-lucide="phone" aria-hidden="true"></i></span><div><strong>Telepon</strong><small><?= esc($contact_phone ?: '—') ?></small></div></div>
            <div class="contact-summary-item"><span class="contact-summary-icon"><i data-lucide="mail" aria-hidden="true"></i></span><div><strong>Email</strong><small><?= esc($contact_email ?: '—') ?></small></div></div>
            <div class="contact-summary-item"><span class="contact-summary-icon"><i data-lucide="clock-3" aria-hidden="true"></i></span><div><strong>Jam Layanan</strong><small><?= esc($contact_hours ?: '—') ?></small></div></div>
            <div class="contact-summary-item"><span class="contact-summary-icon contact-summary-icon-social"><i data-lucide="messages-square" aria-hidden="true"></i></span><div><strong>Media Sosial</strong><small><?= esc($instagram ?: $facebook ?: $youtube ?: 'Kanal resmi sekolah') ?></small></div></div>
        </div>

        <div class="contact-main-grid contact-main-grid-reference">
            <section class="contact-info-panel contact-reference-card">
                <div class="contact-info-heading"><p class="eyebrow">Informasi Sekolah</p><h2>Temukan kami dan hubungi kanal resmi.</h2></div>
                <div class="contact-info-body">
                    <div class="contact-facts-list">
                        <div><span class="contact-fact-icon"><i data-lucide="map-pin" aria-hidden="true"></i></span><span><strong>Alamat Lengkap</strong><small><?= esc($contact_address ?: 'Alamat sekolah belum diatur.') ?></small></span></div>
                        <div><span class="contact-fact-icon"><i data-lucide="phone" aria-hidden="true"></i></span><span><strong>Telepon</strong><small><?= esc($contact_phone ?: 'Nomor telepon belum diatur.') ?></small></span></div>
                        <div><span class="contact-fact-icon"><i data-lucide="mail" aria-hidden="true"></i></span><span><strong>Email</strong><small><?= esc($contact_email ?: 'Email sekolah belum diatur.') ?></small></span></div>
                        <?php if ($accreditation !== ''): ?>
<div><span class="contact-fact-icon"><i data-lucide="award" aria-hidden="true"></i></span><span><strong>Akreditasi</strong><small><?= esc($accreditation) ?></small></span></div>
<?php endif; ?>
                    </div>
                    <figure class="contact-campus-photo"><img src="<?= base_url(($theme_asset_base ?? 'themes/madya/assets') . '/generated/hero-image.jpg') ?>" alt="Lingkungan sekolah" width="1672" height="941" loading="lazy" decoding="async"><figcaption>Lingkungan sekolah</figcaption></figure>
                </div>
                <div class="contact-location-block">
                    <h3>Lokasi Sekolah</h3>
                    <div class="contact-map-wrap">
                        <?php if ($mapQuery): ?>
<iframe title="Peta lokasi sekolah" loading="lazy" src="https://www.google.com/maps?q=<?= $mapQuery ?>&output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe>
<?php else: ?>
<div class="contact-map-fallback"><i data-lucide="map" aria-hidden="true"></i><span>Alamat sekolah belum tersedia untuk menampilkan peta.</span></div>
<?php endif; ?>
                    </div>
                    <?php if ($mapQuery): ?>
<a class="contact-map-link" href="https://www.google.com/maps/search/?api=1&query=<?= $mapQuery ?>" target="_blank" rel="noopener noreferrer">Buka di Google Maps <i data-lucide="external-link" aria-hidden="true"></i></a>
<?php endif; ?>
                </div>
            </section>

            <section class="contact-form-card">
                <p class="eyebrow">Kirim Pesan</p>
                <h2>Hubungi tim sekolah.</h2>
                <p class="contact-form-intro">Isi formulir di bawah ini, tim kami akan segera merespons pesan Anda.</p>
                <?php if (session()->getFlashdata('success')): ?>
<div class="form-alert form-alert-success" role="status"><?= esc(session()->getFlashdata('success')) ?></div>
<?php endif; ?>
                <?php if (session()->getFlashdata('error')): ?>
<div class="form-alert form-alert-error" role="alert"><?= esc(session()->getFlashdata('error')) ?></div>
<?php endif; ?>
                <?php $errors = session()->getFlashdata('errors') ?? []; ?>
                <?php if ($errors): ?><div class="form-alert form-alert-error" role="alert"><?= esc(is_array($errors) ? implode(' ', $errors) : $errors) ?></div><?php endif; ?>
                <form class="contact-form-grid" action="<?= base_url('contact/send') ?>" method="post">
                    <?= csrf_field() ?>
                    <input type="text" name="website" class="sr-only" tabindex="-1" autocomplete="off">
                    <div class="form-field"><label for="contact-name">Nama Lengkap <span>*</span></label><input id="contact-name" name="name" value="<?= esc(old('name')) ?>" placeholder="Masukkan nama lengkap Anda" required autocomplete="name"></div>
                    <div class="form-field"><label for="contact-email">Email <span>*</span></label><input id="contact-email" name="email" value="<?= esc(old('email')) ?>" type="email" placeholder="Masukkan email Anda" required autocomplete="email"></div>
                    <div class="form-field form-full"><label for="contact-subject">Subjek <span>*</span></label><select id="contact-subject" name="subject" required><option value="">Pilih subjek</option><option value="Informasi umum"<?= old('subject') === 'Informasi umum' ? ' selected' : '' ?>>Informasi umum</option><option value="Pendaftaran"<?= old('subject') === 'Pendaftaran' ? ' selected' : '' ?>>Pendaftaran</option><option value="Akademik"<?= old('subject') === 'Akademik' ? ' selected' : '' ?>>Akademik</option><option value="Kerja sama"<?= old('subject') === 'Kerja sama' ? ' selected' : '' ?>>Kerja sama</option><option value="Lainnya"<?= old('subject') === 'Lainnya' ? ' selected' : '' ?>>Lainnya</option></select></div>
                    <div class="form-field form-full"><label for="contact-message">Pesan <span>*</span></label><textarea id="contact-message" name="message" placeholder="Tulis pesan Anda di sini..." required maxlength="5000"><?= esc(old('message')) ?></textarea><small class="form-counter">Maks. 5000 karakter</small></div>
                    <div class="contact-form-note"><i data-lucide="shield-check" aria-hidden="true"></i><span>Data Anda hanya digunakan untuk menindaklanjuti pesan dan kebutuhan komunikasi dengan sekolah.</span></div>
                    <div><button class="button button-contact-submit" type="submit"><i data-lucide="send" aria-hidden="true"></i>Kirim Pesan</button></div>
                </form>
                <p class="contact-response-note">Pesan akan dibalas pada jam kerja (<?= esc($contact_hours ?: 'jam layanan sekolah') ?>).</p>
            </section>
        </div>

        <div class="contact-lower-grid">
            <section class="contact-help-panel">
                <img src="<?= base_url(($theme_asset_base ?? 'themes/madya/assets') . '/illustrations/community.svg') ?>" alt="Layanan bantuan sekolah" width="720" height="520" loading="lazy" decoding="async">
                <div class="contact-help-copy"><p class="eyebrow">Butuh Bantuan Cepat?</p><h2>Pilih kanal informasi yang Anda perlukan.</h2><p>Gunakan halaman resmi sekolah untuk menemukan informasi dan layanan yang paling relevan.</p></div>
                <div class="contact-help-links">
                    <a href="<?= base_url('downloads') ?>"><i data-lucide="file-text" aria-hidden="true"></i><strong>Pusat Download</strong><small>Dokumen dan formulir resmi</small></a>
                    <a href="<?= base_url('news') ?>"><i data-lucide="newspaper" aria-hidden="true"></i><strong>Berita Sekolah</strong><small>Informasi dan pengumuman</small></a>
                    <a href="<?= base_url('#profile') ?>"><i data-lucide="school" aria-hidden="true"></i><strong>Profil Sekolah</strong><small>Kenali sekolah lebih dekat</small></a>
                    <a href="<?= base_url('contact') ?>"><i data-lucide="messages-square" aria-hidden="true"></i><strong>Hubungi Kami</strong><small>Kanal komunikasi resmi</small></a>
                </div>
            </section>
            <section class="contact-newsletter-card faq-cta-card"><p class="eyebrow eyebrow-dark">Pertanyaan Umum</p><h2>Mungkin jawabannya sudah tersedia.</h2><p>Lihat pertanyaan yang sering diajukan sebelum mengirim pesan ke sekolah.</p><a class="button button-light" href="<?= base_url('/#faq') ?>">Buka FAQ <i data-lucide="arrow-right" aria-hidden="true"></i></a><img src="<?= base_url(($theme_asset_base ?? 'themes/madya/assets') . '/illustrations/documents.svg') ?>" alt="" aria-hidden="true" width="640" height="480"></section>
        </div>
    </div>
</section>
<?= $this->include('themes/madya/layouts/footer') ?>
