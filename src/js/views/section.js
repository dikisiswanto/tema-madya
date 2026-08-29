import { iconMarkup } from '../icons.js';

const routeMeta = {
    profile: ['Profil', 'Profil Sekolah', 'Mengenal sekolah, arah pendidikan, dan perjalanan kita bersama.'],
    programs: ['Akademik', 'Program Unggulan', 'Program unggulan yang dirancang untuk mengembangkan potensi siswa secara seimbang.'],
    extracurriculars: ['Kesiswaan', 'Ekstrakurikuler', 'Kegiatan untuk mencoba hal baru, bekerja sama, dan mengembangkan minat di luar kelas.'],
    teachers: ['Kesiswaan', 'Tenaga Pengajar', 'Tenaga pendidik yang profesional, berkompeten, dan berdedikasi dalam membimbing generasi penerus bangsa.'],
    achievements: ['Kesiswaan', 'Prestasi', 'Berbagai prestasi yang telah diraih siswa-siswi dalam bidang akademik dan non-akademik.'],
    testimonials: ['Informasi', 'Testimoni', 'Cerita dan pengalaman dari warga sekolah yang tumbuh bersama komunitas pendidikan.'],
    events: ['Informasi', 'Agenda', 'Jadwal kegiatan dan acara penting yang akan datang.'],
    gallery: ['Berita', 'Galeri', 'Dokumentasi kegiatan, momen berharga, dan keseharian di sekolah.'],
    faq: ['Informasi', 'FAQ', 'Temukan jawaban atas pertanyaan yang sering diajukan seputar sekolah.'],
    contact: ['Informasi', 'Kontak', 'Saluran resmi untuk mendapatkan informasi dan menghubungi sekolah.'],
};

export default function renderSection(route, state, container) {
    const renderers = { profile: renderProfile, programs: renderPrograms, extracurriculars: renderExtracurriculars, teachers: renderTeachers, achievements: renderAchievements, testimonials: renderTestimonials, events: renderEvents, gallery: renderGallery, faq: renderFaq, contact: renderContact };
    container.innerHTML = (renderers[route] || renderProfile)(state);
}

function pageHeader(route, state) {
    const fallback = routeMeta[route] || routeMeta.profile;
    const configured = state.section_settings?.[route] || {};
    const eyebrow = fallback[0];
    const title = configured.title || fallback[1];
    const description = configured.subtitle || fallback[2];
    const image = state.about?.hero_image || state.hero_image || state.about?.image || '';
    const crumb = title;
    return `<header class="page-hero page-hero-has-image"${image ? ` style="--page-hero-image:url('${escapeHtml(image)}')"` : ''}><div class="page-hero-backdrop" aria-hidden="true"></div><div class="theme-container page-hero-inner"><nav class="breadcrumb" aria-label="Jejak navigasi"><a href="/">Beranda</a><span aria-hidden="true">›</span><span>${escapeHtml(eyebrow)}</span><span aria-hidden="true">›</span><span aria-current="page">${escapeHtml(crumb)}</span></nav><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div></header>`;
}

function richLayout(route, state, content) {
    return `<section class="section rich-section"><div class="theme-container">${content}</div></section>`;
}

function renderProfile(state) {
    const about = state.about || {};
    const principal = state.principal || {};
    const highlights = Array.isArray(about.highlights) ? about.highlights : [];
    const contentTitle = about.content_title || 'Mengenal sekolah lebih dekat.';
    const paragraphs = [about.content_1, about.content_2].filter(Boolean);
    const highlightCards = highlights.map((item, i) => `<div class="profile-point"><span class="rich-card-icon">${iconMarkup(['badge-check','book-open','graduation-cap','library'][i % 4])}</span><strong>${escapeHtml(item)}</strong></div>`).join('');
    const principalCard = (principal.name || principal.quote || principal.photo) ? `<section class="profile-principal"><div class="profile-principal-copy"><p class="eyebrow">Sambutan Kepala Sekolah</p><h2>${escapeHtml(principal.name || 'Kepala Sekolah')}</h2>${principal.role ? `<span>${escapeHtml(principal.role)}</span>` : ''}${principal.quote ? `<blockquote>“${escapeHtml(principal.quote)}”</blockquote>` : ''}${principal.education || principal.years_of_service ? `<div class="profile-principal-meta">${principal.education ? `<span>${escapeHtml(principal.education)}</span>` : ''}${principal.years_of_service ? `<span>${escapeHtml(principal.years_of_service)}</span>` : ''}</div>` : ''}</div>${principal.photo ? `<figure><img src="${escapeHtml(principal.photo)}" alt="${escapeHtml(principal.name || 'Kepala Sekolah')}" loading="lazy" decoding="async"></figure>` : ''}</section>` : '';
    const identityRows = [
        ['Nama Sekolah', state.site_name],
        ['NPSN', about.npsn],
        ['Akreditasi', [about.accreditation, about.accreditation_label].filter(Boolean).join(' · ')],
        ['Alamat', state.contact_address],
        ['Telepon', state.contact_phone],
        ['Email', state.contact_email],
    ];
    const content = `<main class="rich-main profile-main">
        <section class="profile-intro"><div class="identity-copy"><p class="eyebrow">Profil Sekolah</p><h2>${escapeHtml(contentTitle)}</h2>${paragraphs.map(text => `<p>${escapeHtml(text)}</p>`).join('')}${about.visi ? `<div class="identity-vision"><span>Visi</span><p>${escapeHtml(about.visi)}</p></div>` : ''}</div>${about.image ? `<figure class="rich-feature-image"><img src="${escapeHtml(about.image)}" alt="Lingkungan ${escapeHtml(state.site_name || 'sekolah')}" loading="lazy" decoding="async"></figure>` : ''}</section>
        ${highlightCards ? `<section class="profile-highlights"><div class="rich-section-label"><h2>Keunggulan Sekolah</h2></div><div class="profile-points">${highlightCards}</div></section>` : ''}
        ${principalCard}
        <section class="identity-table"><div class="rich-section-label"><h2>Identitas Sekolah</h2></div>${identityRows.map(([k,v]) => `<div><span>${escapeHtml(k)}</span><strong>${escapeHtml(v || '—')}</strong></div>`).join('')}</section>
    </main>`;
    return pageHeader('profile', state) + richLayout('profile', state, content);
}

function renderPrograms(state) {
    const items = state.programs || [];
    const extras = state.extracurriculars || [];
    const cards = items.map((item, i) => `<article class="rich-program-card"><span class="rich-card-icon">${iconMarkup(item.icon || ['atom','languages','dribbble'][i] || 'book-open')}</span><h3>${escapeHtml(item.title || 'Program Akademik')}</h3><p>${escapeHtml(item.description || '')}</p>${item.link_url ? `<a class="text-link" href="${escapeHtml(item.link_url)}">${escapeHtml(item.link_text || 'Selengkapnya')} ${iconMarkup('arrow-right')}</a>` : ''}</article>`).join('');
    const extraCards = extras.map(item => `<article class="rich-program-row"><span class="rich-card-icon">${iconMarkup(item.icon || 'users-round')}</span><div><h3>${escapeHtml(item.title || 'Kegiatan')}</h3><p>${escapeHtml(item.description || '')}</p></div></article>`).join('');
    const featureImage = state.about?.image || '';
    const content = `<main class="rich-main"><section><div class="rich-section-label"><h2>Program Akademik</h2></div><div class="rich-program-grid">${cards || emptyState('Belum ada program akademik yang tersedia.')}</div></section><section class="rich-program-secondary"><div class="rich-section-label"><h2>Program Lainnya</h2></div><div class="rich-program-split"><div class="rich-program-list">${extraCards || emptyState('Belum ada program lainnya.')}</div>${featureImage ? `<figure class="rich-program-image"><img src="${escapeHtml(featureImage)}" alt="Lingkungan sekolah" loading="lazy" decoding="async"><figcaption><strong>Bersama kami, raih masa depan yang lebih baik.</strong><a class="button button-accent" href="#contact">Daftar Sekarang</a></figcaption></figure>` : ''}</div></section></main>`;
    return pageHeader('programs', state) + richLayout('programs', state, content);
}

function renderExtracurriculars(state) { return pageHeader('extracurriculars', state) + richLayout('extracurriculars', state, `<main class="rich-main"><div class="rich-card-grid">${(state.extracurriculars || []).map(item => richCollectionCard(item, item.icon || 'star')).join('') || emptyState('Belum ada kegiatan.')}</div></main>`); }

function renderTeachers(state) {
    const items = state.teachers || [];
    const cards = items.map(item => `<figure class="rich-person-card"><img src="${escapeHtml(item.photo || '')}" alt="${escapeHtml(item.name || 'Tenaga pengajar')}" loading="lazy" decoding="async"><figcaption><strong>${escapeHtml(item.name || 'Tenaga pengajar')}</strong><span>${escapeHtml(item.role || 'Guru')}</span></figcaption></figure>`).join('');
    const content = `<main class="rich-main"><div class="rich-toolbar"><div class="rich-filters"><button class="is-active" type="button">Semua</button><button type="button">Guru</button><button type="button">Staf</button></div><label class="rich-search"><span class="sr-only">Cari nama pengajar</span><input type="search" placeholder="Cari nama pengajar…"><button type="button" aria-label="Cari">${iconMarkup('search')}</button></label></div><div class="rich-people-grid">${cards || emptyState('Belum ada data tenaga pengajar.')}</div></main>`;
    return pageHeader('teachers', state) + richLayout('teachers', state, content);
}

function renderAchievements(state) {
    const items = state.achievements || [];
    const cards = items.map(item => `<article class="rich-achievement-card">${item.photo ? `<img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.student_name || 'Siswa berprestasi')}" loading="lazy" decoding="async">` : ''}<div><span class="meta">${escapeHtml(item.level || 'Prestasi')}</span><h2>${escapeHtml(item.achievement || 'Prestasi siswa')}</h2><p>${escapeHtml([item.student_name, item.class_name].filter(Boolean).join(' · '))}</p><small>${escapeHtml(item.year || '')}</small></div></article>`).join('');
    const levels = [...new Set(items.map(item => item.level).filter(Boolean))];
    const years = [...new Set(items.map(item => item.year).filter(Boolean))].sort().reverse();
    const content = `<main class="rich-main"><div class="rich-toolbar"><div class="rich-filters"><button class="is-active" type="button">Semua</button>${levels.map(level => `<button type="button">${escapeHtml(level)}</button>`).join('')}</div><div class="rich-selects"><select aria-label="Tahun"><option value="">Tahun</option>${years.map(year => `<option>${escapeHtml(year)}</option>`).join('')}</select></div></div><div class="rich-achievement-grid">${cards || emptyState('Belum ada prestasi yang tersedia.')}</div></main>`;
    return pageHeader('achievements', state) + richLayout('achievements', state, content);
}

function renderTestimonials(state) {
    const items = state.testimonials || [];
    const content = `<main class="rich-main"><div class="rich-testimonial-grid">${items.map(item => `<figure class="rich-testimonial"><blockquote>“${escapeHtml(item.quote || '')}”</blockquote><figcaption>${item.photo ? `<img src="${escapeHtml(item.photo)}" alt="" loading="lazy">` : ''}<span><strong>${escapeHtml(item.name || 'Warga sekolah')}</strong><small>${escapeHtml(item.role || '')}</small></span></figcaption></figure>`).join('') || emptyState('Belum ada testimoni.')}</div></main>`;
    return pageHeader('testimonials', state) + richLayout('testimonials', state, content);
}

function renderEvents(state) {
    const months = [...new Set((state.events || []).map(item => item.event_date ? new Date(item.event_date).toLocaleString('id-ID', {month:'long', year:'numeric'}) : '').filter(Boolean))];
    const content = `<main class="rich-main"><div class="rich-toolbar"><div class="rich-filters"><button class="is-active" type="button">Semua</button><button type="button">Mendatang</button><button type="button">Berlangsung</button><button type="button">Selesai</button></div><select class="rich-month" aria-label="Bulan"><option value="">Semua bulan</option>${months.map(month => `<option>${escapeHtml(month)}</option>`).join('')}</select></div><div class="rich-event-list">${(state.events || []).map(item => { const d = item.event_date || ''; return `<article class="rich-event-row"><time datetime="${escapeHtml(d)}"><b>${d ? new Date(d).getDate() : '—'}</b><span>${d ? new Date(d).toLocaleString('id-ID',{month:'short'}).toUpperCase() : ''}</span></time><div><h2>${escapeHtml(item.title || 'Kegiatan sekolah')}</h2><p>${escapeHtml([item.event_time, item.location].filter(Boolean).join(' · '))}</p><small>${escapeHtml(item.description || '')}</small></div><span class="rich-event-tag">${escapeHtml(item.status || 'upcoming')}</span></article>`; }).join('') || emptyState('Belum ada agenda.')}</div></main>`;
    return pageHeader('events', state) + richLayout('events', state, content);
}

function renderGallery(state) {
    const items = state.galleries || [];
    const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
    const content = `<main class="rich-main"><div class="rich-toolbar"><div class="rich-filters"><button class="is-active" type="button">Semua</button>${categories.map(category => `<button type="button">${escapeHtml(category)}</button>`).join('')}</div></div><div class="rich-gallery-grid">${items.map((item,i) => `<figure class="rich-gallery-item rich-gallery-item-${i%5}"><img src="${escapeHtml(item.image || '')}" alt="${escapeHtml(item.caption || 'Dokumentasi sekolah')}" loading="lazy" decoding="async"><figcaption>${escapeHtml(item.caption || 'Dokumentasi sekolah')}</figcaption></figure>`).join('') || emptyState('Belum ada dokumentasi galeri.')}</div></main>`;
    return pageHeader('gallery', state) + richLayout('gallery', state, content);
}

function renderFaq(state) {
    const items = state.faq || [];
    const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
    const content = `<main class="rich-main"><div class="rich-faq-layout"><aside class="rich-faq-nav"><button class="is-active">Semua</button>${categories.map(category=>`<button>${escapeHtml(category)}<small>${items.filter(item=>item.category===category).length}</small></button>`).join('')}</aside><div class="rich-faq-list">${items.map((item,i)=>`<details ${i===0?'open':''}><summary><span>${escapeHtml(item.question || '')}</span>${iconMarkup('plus')}</summary><p>${escapeHtml(item.answer || '')}</p></details>`).join('') || emptyState('Belum ada pertanyaan.')}</div></div><div class="rich-help"><span>${iconMarkup('messages-square')}</span><div><strong>Masih ada pertanyaan?</strong><small>Kami siap membantu untuk informasi yang belum terjawab.</small></div><a class="button" href="/contact">Hubungi Kami</a></div></main>`;
    return pageHeader('faq', state) + richLayout('faq', state, content);
}

function renderContact(state) { return pageHeader('contact', state) + richLayout('contact', state, `<main class="rich-main"><div class="contact-page-grid"><div class="contact-stack"><div><span>Alamat</span><strong>${escapeHtml(state.contact_address || '—')}</strong></div><div><span>Telepon</span><strong>${escapeHtml(state.contact_phone || '—')}</strong></div><div><span>Email</span><strong>${escapeHtml(state.contact_email || '—')}</strong></div><div><span>Jam layanan</span><strong>${escapeHtml(state.contact_hours || '—')}</strong></div></div><div><p class="eyebrow">Kanal resmi</p><h2 class="display-title contact-display-title">Mari lanjutkan percakapan.</h2><p class="mt-5 max-w-xl leading-8 text-slate-600">Gunakan kanal resmi sekolah untuk mendapatkan informasi dan bantuan.</p><a class="button mt-7" href="/contact">Buka halaman kontak</a></div></div></main>`); }

function richCollectionCard(item, icon) { return `<article class="rich-program-card"><span class="rich-card-icon">${iconMarkup(icon)}</span><h2>${escapeHtml(item.title || 'Kegiatan')}</h2><p>${escapeHtml(item.description || '')}</p></article>`; }
function emptyState(message) { return `<div class="empty-state"><span class="empty-state-mark" aria-hidden="true">—</span><p>${escapeHtml(message)}</p></div>`; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
