<?= $this->include('themes/madya/layouts/header') ?>
<?php $banner = !empty($page_banners) ? (json_decode($page_banners, true)['contact'] ?? []) : []; ?>
<?= $this->include('themes/madya/components/page-header', ['eyebrow' => $banner['badge'] ?? 'Hubungi sekolah', 'title' => $banner['title'] ?? 'Mari berbincang.', 'description' => $banner['subtitle'] ?? 'Temukan kanal resmi untuk mendapatkan informasi dan bantuan dari sekolah.', 'breadcrumbs' => [['label' => 'Kontak']]]) ?>
<section class="section"><div class="theme-container contact-page-grid">
    <div class="contact-stack">
        <div><span>Alamat</span><strong><?= esc($contact_address ?? '—') ?></strong></div>
        <div><span>Telepon</span><strong><?= esc($contact_phone ?? '—') ?></strong></div>
        <div><span>Email</span><strong><?= esc($contact_email ?? '—') ?></strong></div>
        <div><span>Jam layanan</span><strong><?= esc($contact_hours ?? '—') ?></strong></div>
    </div>
    <div>
        <p class="eyebrow">Kirim pesan</p><h2 class="display-title text-4xl md:text-6xl">Sampaikan kebutuhan Anda.</h2>
        <p class="max-w-xl leading-8 text-slate-600">Pesan akan diproses melalui kanal kontak resmi sekolah.</p>
        <form class="form-grid mt-8" action="<?= base_url('contact/send') ?>" method="post">
            <?= csrf_field() ?><input type="text" name="website" class="sr-only" tabindex="-1" autocomplete="off">
            <div class="form-field"><label for="contact-name">Nama</label><input id="contact-name" name="name" required autocomplete="name"></div>
            <div class="form-field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" required autocomplete="email"></div>
            <div class="form-field"><label for="contact-subject">Subjek</label><input id="contact-subject" name="subject" required></div>
            <div class="form-field form-full"><label for="contact-message">Pesan</label><textarea id="contact-message" name="message" required></textarea></div>
            <div><button class="button" type="submit">Kirim pesan</button></div>
        </form>
    </div>
</div></section>
<?= $this->include('themes/madya/layouts/footer') ?>
