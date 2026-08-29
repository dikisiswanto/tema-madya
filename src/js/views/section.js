import { iconMarkup } from '../icons.js';
const routeMeta = {
    profile: ['Profil Sekolah', 'Mengenal sekolah, arah pendidikan, dan perjalanan kita bersama.'],
    programs: ['Pembelajaran', 'Pilihan belajar yang membantu siswa mengenal minat dan mengembangkan kemampuannya.'],
    extracurriculars: ['Kegiatan Siswa', 'Kegiatan untuk mencoba hal baru, bekerja sama, dan mengembangkan minat di luar kelas.'],
    teachers: ['Tenaga Pendidik', 'Guru dan tenaga pendidik yang mendampingi proses belajar setiap hari.'],
    achievements: ['Prestasi', 'Capaian siswa dan sekolah yang patut dibanggakan bersama.'],
    testimonials: ['Cerita Komunitas', 'Cerita dari siswa, alumni, dan keluarga sekolah.'],
    events: ['Agenda Sekolah', 'Jadwal kegiatan dan momen penting yang akan datang.'],
    gallery: ['Dokumentasi', 'Potret kegiatan belajar dan keseharian di sekolah.'],
    faq: ['Pertanyaan Umum', 'Jawaban atas hal-hal yang paling sering ditanyakan kepada sekolah.'],
    contact: ['Hubungi Sekolah', 'Saluran resmi untuk mendapatkan informasi dan menghubungi sekolah.'],
};

export default function renderSection(route, state, container) {
    const renderers = { profile: renderProfile, programs: renderPrograms, extracurriculars: renderExtracurriculars, teachers: renderTeachers, achievements: renderAchievements, testimonials: renderTestimonials, events: renderEvents, gallery: renderGallery, faq: renderFaq, contact: renderContact };
    container.innerHTML = (renderers[route] || renderProfile)(state);
}

function pageHeader(route) {
    const [eyebrow, title, description] = routeMeta[route];
    return `<header class="page-hero"><div class="theme-container page-hero-inner"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div></header>`;
}

function renderProfile(state) {
    const about = state.about || {};
    return `${pageHeader('profile')}<section class="section"><div class="theme-container editorial-split"><div>${imageOrPlaceholder(about.image, state.site_name || 'Sekolah', about)}</div><div class="article-prose"><p>${escapeHtml(about.description || state.site_description || '')}</p>${about.visi ? `<h2>Visi</h2><p>${escapeHtml(about.visi)}</p>` : ''}${about.misi ? `<h2>Misi</h2><p>${escapeHtml(about.misi)}</p>` : ''}</div></div></section>`;
}

function renderPrograms(state) { return collectionPage('programs', state.programs, 'Program', 'description', 'image', 'microscope'); }
function renderExtracurriculars(state) { return collectionPage('extracurriculars', state.extracurriculars, 'Kegiatan', 'description', 'image', 'activity'); }
function renderAchievements(state) { return collectionPage('achievements', state.achievements, 'Prestasi', 'description', 'image', 'trophy'); }

function renderTeachers(state) {
    return `${pageHeader('teachers')}<section class="section"><div class="theme-container collection-grid">${state.teachers?.length ? state.teachers.map((item,index) => `<article class="collection-card"><div class="collection-card-body">${item.image || item.image_url ? `<img src="${escapeHtml(item.image || item.image_url)}"${responsiveAttrs(item)} alt="${escapeHtml(item.name || item.title || 'Tenaga pendidik')}" loading="lazy" decoding="async">` : ''}<span class="meta">${String(index+1).padStart(2,'0')} · ${escapeHtml(item.position || 'Tenaga pendidik')}</span><h2>${escapeHtml(item.name || item.title || 'Tenaga pendidik')}</h2><p>${escapeHtml(item.bio || item.description || '')}</p></div></article>`).join('') : emptyState('Belum ada data tenaga pendidik yang tersedia.')}</div></section>`;
}

function renderTestimonials(state) { return `${pageHeader('testimonials')}<section class="section"><div class="theme-container testimonial-grid">${state.testimonials?.length ? state.testimonials.map(item => `<figure class="quote-card">${item.image || item.image_url ? `<img src="${escapeHtml(item.image || item.image_url)}"${responsiveAttrs(item)} alt="${escapeHtml(item.name || 'Warga sekolah')}" loading="lazy" decoding="async">` : ''}<blockquote>“${escapeHtml(item.quote || item.content || item.text || '')}”</blockquote><figcaption><strong>${escapeHtml(item.name || item.author || item.person || 'Warga sekolah')}</strong><span>${escapeHtml(item.role || '')}</span></figcaption></figure>`).join('') : emptyState('Belum ada cerita yang ditampilkan.')}</div></section>`; }
function renderEvents(state) { return `${pageHeader('events')}<section class="section"><div class="theme-container agenda-list">${state.events?.length ? state.events.map(item => `<article class="agenda-row"><span class="agenda-icon">${iconMarkup(item.icon || 'calendar-days')}</span><time datetime="${escapeHtml(item.event_date || item.date || '')}">${escapeHtml(item.date_label || item.event_date || item.date || 'Tanggal ditentukan kemudian')}</time><div><h2>${escapeHtml(item.title || 'Kegiatan sekolah')}</h2><p>${escapeHtml(item.description || item.excerpt || '')}</p></div></article>`).join('') : emptyState('Belum ada agenda yang tersedia.')}</div></section>`; }
function renderGallery(state) { return `${pageHeader('gallery')}<section class="section"><div class="theme-container gallery-home-grid">${state.galleries?.length ? state.galleries.map((item,index)=>`<figure class="gallery-home-item gallery-home-item-${index % 5}">${imageOrPlaceholder(item.image || item.image_url, item.title || 'Dokumentasi sekolah', item)}${item.title ? `<figcaption>${escapeHtml(item.title)}</figcaption>` : ''}</figure>`).join('') : emptyState('Belum ada dokumentasi galeri.')}</div></section>`; }
function renderFaq(state) { return `${pageHeader('faq')}<section class="section"><div class="theme-container faq-list">${state.faq?.length ? state.faq.map((item,index)=>`<details class="faq-item"${index === 0 ? ' open' : ''}><summary><span>${String(index+1).padStart(2,'0')}</span>${escapeHtml(item.question || item.title || '')}${iconMarkup('chevron-down')}</summary><div class="faq-answer">${escapeHtml(item.answer || item.content || '')}</div></details>`).join('') : emptyState('Belum ada pertanyaan umum yang tersedia.')}</div></section>`; }
function renderContact(state) { const url = escapeHtml(state.urls?.contact || '/contact'); return `${pageHeader('contact')}<section class="section"><div class="theme-container contact-page-grid"><div class="contact-stack"><div><span>Alamat</span><strong>${escapeHtml(state.contact_address || '—')}</strong></div><div><span>Telepon</span><strong>${escapeHtml(state.contact_phone || '—')}</strong></div><div><span>Email</span><strong>${escapeHtml(state.contact_email || '—')}</strong></div><div><span>Jam layanan</span><strong>${escapeHtml(state.contact_hours || '—')}</strong></div></div><div><p class="eyebrow">Kanal resmi</p><h2 class="display-title contact-display-title">Mari lanjutkan percakapan.</h2><p class="mt-5 max-w-xl leading-8 text-slate-600">Halaman kontak server-side menyediakan formulir resmi beserta validasi dan perlindungan spam.</p><a class="button mt-7" href="${url}">Buka halaman kontak</a></div></div></section>`; }

function collectionPage(route, items, type, textKey) {
    return `${pageHeader(route)}<section class="section"><div class="theme-container collection-grid">${items?.length ? items.map((item,index)=>`<article class="collection-card"><div class="collection-card-body"><span class="meta">${String(index+1).padStart(2,'0')}</span><h2>${escapeHtml(item.title || item.name || type)}</h2><p>${escapeHtml(item[textKey] || item.excerpt || item.description || '')}</p></div></article>`).join('') : emptyState(`Belum ada ${type.toLowerCase()} yang tersedia.`)}</div></section>`;
}
function imageOrPlaceholder(src, alt, item = {}) { return src ? `<figure class="inner-feature-image"><img src="${escapeHtml(src)}"${responsiveAttrs(item)} alt="${escapeHtml(alt)}" loading="lazy" decoding="async"></figure>` : `<div class="media-placeholder inner-feature-image" role="img" aria-label="${escapeHtml(alt)}"><span>${escapeHtml(alt)}</span></div>`; }
function responsiveAttrs(item = {}) {
    const srcset = item.image_srcset || item.srcset;
    const sizes = item.image_sizes || item.sizes;
    const width = item.image_width || item.width || 1600;
    const height = item.image_height || item.height || 1000;
    return ` width=\"${escapeHtml(width)}\" height=\"${escapeHtml(height)}\"${srcset ? ` srcset=\"${escapeHtml(srcset)}\"${sizes ? ` sizes=\"${escapeHtml(sizes)}\"` : ''}` : ''}`;
}
function emptyState(message) { return `<div class="empty-state"><span class="empty-state-mark" aria-hidden="true">—</span><p>${escapeHtml(message)}</p></div>`; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
