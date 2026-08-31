import { iconMarkup } from '../icons.js';

const routeMeta = {
    profile: [
        'Profil',
        'Profil Sekolah',
        'Mengenal sekolah, arah pendidikan, dan perjalanan kita bersama.',
    ],
    programs: [
        'Akademik',
        'Program Unggulan',
        'Program unggulan yang dirancang untuk mengembangkan potensi siswa secara seimbang.',
    ],
    extracurriculars: [
        'Kesiswaan',
        'Ekstrakurikuler',
        'Kegiatan untuk mencoba hal baru, bekerja sama, dan mengembangkan minat di luar kelas.',
    ],
    teachers: [
        'Kesiswaan',
        'Tenaga Pengajar',
        'Tenaga pendidik yang profesional, berkompeten, dan berdedikasi dalam membimbing generasi penerus bangsa.',
    ],
    achievements: [
        'Kesiswaan',
        'Prestasi',
        'Berbagai prestasi yang telah diraih siswa-siswi dalam bidang akademik dan non-akademik.',
    ],
    testimonials: [
        'Informasi',
        'Testimoni',
        'Cerita dan pengalaman dari warga sekolah yang tumbuh bersama komunitas pendidikan.',
    ],
    events: [
        'Informasi',
        'Agenda',
        'Jadwal kegiatan dan acara penting yang akan datang.',
    ],
    gallery: [
        'Berita',
        'Galeri',
        'Dokumentasi kegiatan, momen berharga, dan keseharian di sekolah.',
    ],
    faq: [
        'Informasi',
        'FAQ',
        'Temukan jawaban atas pertanyaan yang sering diajukan seputar sekolah.',
    ],
    contact: [
        'Informasi',
        'Kontak',
        'Saluran resmi untuk mendapatkan informasi dan menghubungi sekolah.',
    ],
};

export default function renderSection(route, state, container) {
    const renderers = {
        profile: renderProfile,
        programs: renderPrograms,
        extracurriculars: renderExtracurriculars,
        teachers: renderTeachers,
        achievements: renderAchievements,
        testimonials: renderTestimonials,
        events: renderEvents,
        gallery: renderGallery,
        faq: renderFaq,
        contact: renderContact,
    };
    container.innerHTML = (renderers[route] || renderProfile)(state);
}

function pageHeader(route, state) {
    const fallback = routeMeta[route] || routeMeta.profile;
    const configured = state.section_settings?.[route] || {};
    const eyebrow = fallback[0];
    const title = configured.title || fallback[1];
    const description = configured.subtitle || fallback[2];
    const image =
        state.about?.hero_image || state.hero_image || state.about?.image || '';
    const crumb = title;
    return `<header class="page-hero page-hero-has-image"${image ? ` style="--page-hero-image:url('${escapeHtml(image)}')"` : ''}><div class="page-hero-backdrop" aria-hidden="true"></div><div class="theme-container page-hero-inner"><nav class="breadcrumb" aria-label="Jejak navigasi"><a href="/">Beranda</a><span aria-hidden="true">›</span><span>${escapeHtml(eyebrow)}</span><span aria-hidden="true">›</span><span aria-current="page">${escapeHtml(crumb)}</span></nav>${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ''}<h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div></header>`;
}

function richLayout(content) {
    return `<section class="madya-section rich-section"><div class="theme-container">${content}</div></section>`;
}

function renderProfile(state) {
    const about = state.about || {};
    const principal = state.principal || {};
    const highlights = Array.isArray(about.highlights) ? about.highlights : [];
    const contentTitle =
        about.content_title ||
        `Sekilas Tentang ${state.site_name || 'Sekolah'}`;
    const paragraphs = [about.content_1, about.content_2, about.description]
        .filter(Boolean)
        .slice(0, 2);
    const values = highlights.slice(0, 5);
    const identityRows = [
        ['Nama Sekolah', state.site_name],
        ['NPSN', about.npsn],
        [
            'Akreditasi',
            [about.accreditation, about.accreditation_label]
                .filter(Boolean)
                .join(' · '),
        ],
        ['Alamat', state.contact_address],
        ['Telepon', state.contact_phone],
        ['Email', state.contact_email],
    ];
    const principalCard =
        principal.name || principal.welcome_message || principal.photo
            ? `<section class="profile-principal"><div class="profile-principal-copy"><p class="eyebrow">Sambutan Kepala Sekolah</p><h2>${escapeHtml(principal.name || 'Kepala Sekolah')}</h2>${principal.role_title ? `<span>${escapeHtml(principal.role_title)}</span>` : ''}${principal.welcome_message ? `<blockquote>“${escapeHtml(principal.welcome_message)}”</blockquote>` : ''}</div>${principal.photo ? `<figure><img src="${escapeHtml(principal.photo)}" alt="${escapeHtml(principal.name || 'Kepala Sekolah')}" loading="lazy" decoding="async"></figure>` : ''}</section>`
            : '';
    const valueCards = values
        .map(
            (item, i) =>
                `<article class="profile-value-card"><span class="rich-card-icon">${iconMarkup(['badge-check', 'award', 'users-round', 'lightbulb', 'heart-handshake'][i % 5])}</span><strong>${escapeHtml(item)}</strong></article>`,
        )
        .join('');
    const main = `<main class="rich-main profile-main static-page-main">
        <section class="static-content-intro"><p class="eyebrow">Profil Sekolah</p><h2>${escapeHtml(contentTitle)}</h2>${paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join('')}${about.image ? `<figure class="static-feature-image"><img src="${escapeHtml(about.image)}" alt="Lingkungan ${escapeHtml(state.site_name || 'sekolah')}" loading="lazy" decoding="async"></figure>` : ''}</section>
        ${about.visi ? `<section class="static-info-card"><div class="static-info-icon">${iconMarkup('eye')}</div><div><h2>Visi</h2><p>${escapeHtml(about.visi)}</p></div></section>` : ''}
        ${about.misi ? `<section class="static-info-card static-mission-card"><div class="static-info-icon">${iconMarkup('target')}</div><div><h2>Misi</h2><div class="static-mission-copy"><p>${escapeHtml(about.misi)}</p></div></div></section>` : ''}
        ${valueCards ? `<section class="static-values"><div class="rich-section-label"><h2>Nilai-Nilai Kami</h2></div><div class="profile-value-grid">${valueCards}</div></section>` : ''}
        ${principalCard}
        <section class="identity-table"><header class="identity-table-header"><p class="eyebrow">Data Sekolah</p><h2>Identitas Sekolah</h2></header><div class="identity-table-body">${identityRows.map(([k, v]) => `<div class="identity-row"><span>${escapeHtml(k)}</span><strong>${escapeHtml(v || '—')}</strong></div>`).join('')}</div></section>
    </main>`;
    return `${pageHeader('profile', state)}<section class="madya-section static-page-section"><div class="theme-container static-page-layout profile-no-sidebar">${main}</div></section>`;
}
function renderPrograms(state) {
    const items = state.programs || [];
    const extras = state.extracurriculars || [];
    const cards = items
        .map(
            (item, i) =>
                `<article class="rich-program-card"><span class="rich-card-icon rich-data-icon">${iconMarkup(item.icon || ['atom', 'languages', 'dribbble'][i] || 'book-open')}</span><h3>${escapeHtml(item.title || 'Program Unggulan')}</h3><p>${escapeHtml(item.description || 'Program pengembangan potensi siswa.')}</p></article>`,
        )
        .join('');
    const extraCards = extras
        .map((item) => {
            const iconColor = /^#[0-9a-f]{6}$/i.test(
                String(item.icon_color || ''),
            )
                ? item.icon_color
                : '';
            const iconStyle = iconColor
                ? ` style="--rich-icon-color:${escapeHtml(iconColor)}"`
                : '';
            return `<article class="rich-program-row"><span class="rich-card-icon rich-data-icon"${iconStyle}>${iconMarkup(item.icon || 'users-round', '', iconColor)}</span><div><h3>${escapeHtml(item.title || 'Kegiatan')}</h3><p>${escapeHtml(item.description || '')}</p></div></article>`;
        })
        .join('');
    const content = `<main class="rich-main"><section><div class="rich-section-label"><h2>Program Unggulan</h2><p>Program yang tersedia di SekolahKu.</p></div><div class="rich-program-grid">${cards || emptyState('Belum ada program unggulan yang tersedia.')}</div></section><section class="rich-program-secondary"><div class="rich-section-label"><h2>Ekstrakurikuler</h2><p>Kegiatan pengembangan minat dan bakat siswa.</p></div><div class="rich-program-list">${extraCards || emptyState('Belum ada kegiatan ekstrakurikuler.')}</div></section></main>`;
    return pageHeader('programs', state) + richLayout(content);
}

function renderExtracurriculars(state) {
    const items = Array.isArray(state.extracurriculars)
        ? state.extracurriculars
        : [];
    const cards = items
        .map((item, index) => {
            const iconColor = /^#[0-9a-f]{6}$/i.test(
                String(item.icon_color || ''),
            )
                ? item.icon_color
                : '';
            const iconStyle = iconColor
                ? ` style="--rich-icon-color:${escapeHtml(iconColor)}"`
                : '';
            return `<article class="rich-extra-card" data-cms-collection="extracurriculars">
        <div class="rich-extra-card-head"><span class="rich-card-icon rich-data-icon"${iconStyle}>${iconMarkup(item.icon || ['users-round', 'dribbble', 'music', 'book-open'][index % 4], '', iconColor)}</span><span class="rich-extra-index">${String(index + 1).padStart(2, '0')}</span></div>
        <div class="rich-extra-copy"><h2>${escapeHtml(item.title || 'Kegiatan')}</h2><p>${escapeHtml(item.description || 'Kegiatan pengembangan minat dan bakat siswa.')}</p></div>
        ${item.link_url ? `` : ''}
    </article>`;
        })
        .join('');
    const content = `<main class="rich-main"><section class="rich-intro-panel"><div><p class="eyebrow">Kegiatan Siswa</p><h2>Ruang untuk tumbuh di luar kelas.</h2></div><p>Pilih kegiatan yang sesuai dengan minat, bakat, dan pengalaman belajar siswa.</p></section><div class="rich-extra-grid">${cards || emptyState('Belum ada kegiatan ekstrakurikuler.')}</div></main>`;
    return pageHeader('extracurriculars', state) + richLayout(content);
}

function renderTeachers(state) {
    const items = state.teachers || [];
    const cards = items
        .map((item) => {
            const role = String(item.role || 'Guru');
            const group = /staf|staff|administr/i.test(role) ? 'Staf' : 'Guru';
            return `<figure class="rich-person-card" data-filter-item data-filter-group="teacher-role" data-filter-value="${escapeHtml(group)}"><div class="rich-person-media">${item.photo ? `<img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.name || 'Tenaga pengajar')}" loading="lazy" decoding="async">` : `<span class="rich-person-placeholder" aria-hidden="true"><i class="fas fa-chalkboard-user"></i></span>`}</div><figcaption><span class="rich-person-role">${escapeHtml(group)}</span><strong>${escapeHtml(item.name || 'Tenaga pengajar')}</strong><span>${escapeHtml(role)}</span></figcaption></figure>`;
        })
        .join('');
    const content = `<main class="rich-main"><div class="rich-toolbar" data-filter-toolbar="teacher-role"><div class="rich-filters"><button class="is-active" type="button" data-filter-value="">Semua</button><button type="button" data-filter-value="Guru">Guru</button><button type="button" data-filter-value="Staf">Staf</button></div></div><div class="rich-people-grid" data-filter-list="teacher-role">${cards || emptyState('Belum ada data tenaga pengajar.')}</div></main>`;
    return pageHeader('teachers', state) + richLayout(content);
}

function renderAchievements(state) {
    const items = state.achievements || [];
    const cards = items
        .map((item, index) => {
            const level = item.level || 'Prestasi';
            const year = item.year || '';
            const color = ['#2563eb', '#16805f', '#a56a08', '#7c3aed'][
                index % 4
            ];
            return `<article class="rich-achievement-card" data-filter-item data-filter-group="achievement-level" data-filter-value="${escapeHtml(level)}" data-filter-year="${escapeHtml(year)}">${item.photo ? `<div class="rich-achievement-media"><img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.student_name || 'Siswa berprestasi')}" loading="lazy" decoding="async"></div>` : `<div class="rich-achievement-media rich-achievement-placeholder" style="--achievement-accent:${color}">${iconMarkup('trophy')}</div>`}<div class="rich-achievement-body"><span class="meta">${escapeHtml(level)}</span><h2>${escapeHtml(item.achievement || 'Prestasi siswa')}</h2><p>${escapeHtml([item.student_name, item.class_name].filter(Boolean).join(' · '))}</p><small>${escapeHtml(year)}</small></div></article>`;
        })
        .join('');
    const levels = [
        ...new Set(items.map((item) => item.level).filter(Boolean)),
    ];
    const years = [...new Set(items.map((item) => item.year).filter(Boolean))]
        .sort()
        .reverse();
    const content = `<main class="rich-main"><div class="rich-toolbar" data-filter-toolbar="achievement-level"><div class="rich-filters"><button class="is-active" type="button" data-filter-value="">Semua</button>${levels.map((level) => `<button type="button" data-filter-value="${escapeHtml(level)}">${escapeHtml(level)}</button>`).join('')}</div><div class="rich-selects"><label class="sr-only" for="achievement-year">Tahun prestasi</label><select id="achievement-year" data-filter-year><option value="">Semua tahun</option>${years.map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`).join('')}</select></div></div><div class="rich-achievement-grid" data-filter-list="achievement-level">${cards || emptyState('Belum ada prestasi yang tersedia.')}</div></main>`;
    return pageHeader('achievements', state) + richLayout(content);
}

function renderTestimonials(state) {
    const items = state.testimonials || [];
    const content = `<main class="rich-main"><div class="rich-testimonial-grid">${items.map((item) => `<figure class="rich-testimonial"><blockquote>“${escapeHtml(item.quote || '')}”</blockquote><figcaption>${item.photo ? `<img src="${escapeHtml(item.photo)}" alt="" loading="lazy">` : ''}<span><strong>${escapeHtml(item.name || 'Warga sekolah')}</strong><small>${escapeHtml(item.role || '')}</small></span></figcaption></figure>`).join('') || emptyState('Belum ada testimoni.')}</div></main>`;
    return pageHeader('testimonials', state) + richLayout(content);
}

function renderEvents(state) {
    const items = state.events || [];
    const months = [
        ...new Set(
            items
                .map((item) =>
                    item.event_date
                        ? new Date(item.event_date).toLocaleString('id-ID', {
                              month: 'long',
                              year: 'numeric',
                          })
                        : '',
                )
                .filter(Boolean),
        ),
    ];
    const now = new Date();
    const statusFor = (date) => {
        if (!date) return 'upcoming';
        const value = new Date(date);
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );
        const day = new Date(
            value.getFullYear(),
            value.getMonth(),
            value.getDate(),
        );
        if (day < today) return 'past';
        if (day.getTime() === today.getTime()) return 'today';
        return 'upcoming';
    };
    const cards = items
        .map((item) => {
            const d = item.event_date || '';
            const status = statusFor(d);
            const month = d
                ? new Date(d).toLocaleString('id-ID', {
                      month: 'long',
                      year: 'numeric',
                  })
                : '';
            return `<article class="rich-event-row" data-filter-item data-filter-group="event-status" data-filter-value="${status}" data-filter-month="${escapeHtml(month)}"><time datetime="${escapeHtml(d)}"><b>${d ? new Date(d).getDate() : '—'}</b><span>${d ? new Date(d).toLocaleString('id-ID', { month: 'short' }).toUpperCase() : ''}</span></time><div><h2>${escapeHtml(item.title || 'Kegiatan sekolah')}</h2><p>${escapeHtml([item.event_time, item.location].filter(Boolean).join(' · '))}</p><small>${escapeHtml(item.description || '')}</small></div><span class="rich-event-tag">${status === 'past' ? 'Selesai' : status === 'today' ? 'Hari ini' : 'Mendatang'}</span></article>`;
        })
        .join('');
    const content = `<main class="rich-main"><div class="rich-toolbar" data-filter-toolbar="event-status"><div class="rich-filters"><button class="is-active" type="button" data-filter-value="">Semua</button><button type="button" data-filter-value="upcoming">Mendatang</button><button type="button" data-filter-value="today">Hari ini</button><button type="button" data-filter-value="past">Selesai</button></div><label class="sr-only" for="event-month">Bulan agenda</label><select class="rich-month" id="event-month" data-filter-month-select><option value="">Semua bulan</option>${months.map((month) => `<option value="${escapeHtml(month)}">${escapeHtml(month)}</option>`).join('')}</select></div><div class="rich-event-list" data-filter-list="event-status">${cards || emptyState('Belum ada agenda.')}</div></main>`;
    return pageHeader('events', state) + richLayout(content);
}

function renderGallery(state) {
    const items = state.galleries || [];
    const categories = [
        ...new Set(items.map((item) => item.category).filter(Boolean)),
    ];
    const content = `<main class="rich-main"><div class="rich-toolbar" data-filter-toolbar="gallery-category"><div class="rich-filters"><button class="is-active" type="button" data-filter-value="">Semua</button>${categories.map((category) => `<button type="button" data-filter-value="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('')}</div></div><div class="rich-gallery-grid" data-filter-list="gallery-category">${items.map((item, i) => `<figure class="rich-gallery-item rich-gallery-item-${i % 5}" data-filter-item data-filter-group="gallery-category" data-filter-value="${escapeHtml(item.category || '')}"><button class="gallery-lightbox-trigger" type="button" data-gallery-open data-gallery-src="${escapeHtml(item.image || '')}" data-gallery-alt="${escapeHtml(item.caption || 'Dokumentasi sekolah')}" aria-label="Lihat ${escapeHtml(item.caption || 'dokumentasi sekolah')} dalam ukuran besar"><img src="${escapeHtml(item.image || '')}" alt="${escapeHtml(item.caption || 'Dokumentasi sekolah')}" loading="lazy" decoding="async"></button><figcaption>${escapeHtml(item.caption || 'Dokumentasi sekolah')}</figcaption></figure>`).join('') || emptyState('Belum ada dokumentasi galeri.')}</div></main>`;
    return (
        pageHeader('gallery', state) + richLayout(content) + galleryLightbox()
    );
}

function galleryLightbox() {
    return `<div class="gallery-lightbox" data-gallery-lightbox hidden aria-hidden="true"><div class="gallery-lightbox-backdrop" data-gallery-close></div><figure class="gallery-lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="gallery-lightbox-caption"><button type="button" class="gallery-lightbox-close" data-gallery-close aria-label="Tutup pratinjau gambar">${iconMarkup('x')}</button><img data-gallery-lightbox-image src="" alt=""><figcaption id="gallery-lightbox-caption" data-gallery-lightbox-caption></figcaption></figure></div>`;
}

function renderFaq(state) {
    const items = state.faq || [];
    const categories = [
        ...new Set(items.map((item) => item.category).filter(Boolean)),
    ];
    const content = `<main class="rich-main"><div class="rich-faq-layout"><aside class="rich-faq-nav" data-filter-toolbar="faq-category"><button class="is-active" type="button" data-filter-value="">Semua</button>${categories.map((category) => `<button type="button" data-filter-value="${escapeHtml(category)}">${escapeHtml(category)}<small>${items.filter((item) => item.category === category).length}</small></button>`).join('')}</aside><div class="rich-faq-list" data-filter-list="faq-category">${items.map((item, i) => `<details data-filter-item data-filter-group="faq-category" data-filter-value="${escapeHtml(item.category || '')}" ${i === 0 ? 'open' : ''}><summary><span>${escapeHtml(item.question || '')}</span>${iconMarkup('plus')}</summary><p>${escapeHtml(item.answer || '')}</p></details>`).join('') || emptyState('Belum ada pertanyaan.')}</div></div><div class="rich-help"><span>${iconMarkup('messages-square')}</span><div><strong>Masih ada pertanyaan?</strong><small>Kami siap membantu untuk informasi yang belum terjawab.</small></div><a class="button" href="/contact">Hubungi Kami</a></div></main>`;
    return pageHeader('faq', state) + richLayout(content);
}

function renderContact(state) {
    return (
        pageHeader('contact', state) +
        richLayout(
            `<main class="rich-main"><div class="contact-page-grid"><div class="contact-stack"><div><span>Alamat</span><strong>${escapeHtml(state.contact_address || '—')}</strong></div><div><span>Telepon</span><strong>${escapeHtml(state.contact_phone || '—')}</strong></div><div><span>Email</span><strong>${escapeHtml(state.contact_email || '—')}</strong></div><div><span>Jam layanan</span><strong>${escapeHtml(state.contact_hours || '—')}</strong></div></div><div><p class="eyebrow">Kanal resmi</p><h2 class="display-title contact-display-title">Mari lanjutkan percakapan.</h2><p class="mt-5 max-w-xl leading-8 text-slate-600">Gunakan kanal resmi sekolah untuk mendapatkan informasi dan bantuan.</p><a class="button mt-7" href="/contact">Buka halaman kontak</a></div></div></main>`,
        )
    );
}

function emptyState(message) {
    return `<div class="empty-state"><span class="empty-state-mark" aria-hidden="true">—</span><p>${escapeHtml(message)}</p></div>`;
}
function escapeHtml(value) {
    return String(value ?? '').replace(
        /[&<>'"]/g,
        (char) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;',
            })[char],
    );
}
