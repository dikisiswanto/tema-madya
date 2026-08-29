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
    const [eyebrow, title, description] = routeMeta[route] || routeMeta.profile;
    const image = state.about?.hero_image || state.hero_image || state.about?.image || '';
    const crumb = title;
    return `<header class="page-hero page-hero-has-image"${image ? ` style="--page-hero-image:url('${escapeHtml(image)}')"` : ''}><div class="page-hero-backdrop" aria-hidden="true"></div><div class="theme-container page-hero-inner"><nav class="breadcrumb" aria-label="Jejak navigasi"><a href="/">Beranda</a><span aria-hidden="true">›</span><span>${escapeHtml(eyebrow)}</span><span aria-hidden="true">›</span><span aria-current="page">${escapeHtml(crumb)}</span></nav><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div></header>`;
}

function richLayout(route, state, content, sideItems = []) {
    const sidebar = sideItems.length ? `<aside class="rich-sidebar"><nav class="rich-sidebar-nav" aria-label="Navigasi halaman">${sideItems.map((item, i) => `<a class="${item.active ? 'is-active' : ''}" href="${escapeHtml(item.href || '#')}"${item.active ? ' aria-current="page"' : ''}><span>${iconMarkup(item.icon || 'circle')}</span><span>${escapeHtml(item.label)}</span>${item.count != null ? `<small>${escapeHtml(item.count)}</small>` : ''}</a>`).join('')}</nav></aside>` : '';
    return `<section class="section rich-section"><div class="theme-container ${sidebar ? 'rich-layout' : ''}">${sidebar}${content}</div></section>`;
}

function renderProfile(state) {
    const about = state.about || {};
    const points = [
        ['Berakhlak Mulia', 'Menanamkan nilai-nilai agama dan moral'],
        ['Berprestasi', 'Mendorong potensi dan bakat siswa'],
        ['Berwawasan Global', 'Siap menghadapi tantangan masa depan'],
    ];
    const content = `<main class="rich-main"><div class="identity-copy"><h2>Identitas dan perjalanan sekolah.</h2><p>${escapeHtml(about.description || state.site_description || '')}</p>${about.visi ? `<div class="identity-vision"><span>Visi</span><p>${escapeHtml(about.visi)}</p></div>` : ''}</div><div class="profile-points">${points.map(([a,b]) => `<div class="profile-point"><strong>${a}</strong><span>${b}</span></div>`).join('')}</div>${about.image ? `<figure class="rich-feature-image"><img src="${escapeHtml(about.image)}" alt="Lingkungan ${escapeHtml(state.site_name || 'sekolah')}" loading="lazy" decoding="async"></figure>` : ''}<div class="identity-table"><h3>Identitas Sekolah</h3>${[['Nama Sekolah',state.site_name],['NPSN',about.npsn],['Alamat',state.contact_address],['Telepon',state.contact_phone],['Email',state.contact_email]].map(([k,v]) => `<div><span>${escapeHtml(k)}</span><strong>${escapeHtml(v || '—')}</strong></div>`).join('')}</div></main>`;
    return pageHeader('profile', state) + richLayout('profile', state, content, [
        { label: 'Profil Sekolah', icon: 'building-2', active: true }, { label: 'Sejarah', icon: 'clock-3' }, { label: 'Struktur Organisasi', icon: 'network' }, { label: 'Sambutan Kepala Sekolah', icon: 'user-round' }, { label: 'Fasilitas', icon: 'school' },
    ]);
}

function renderPrograms(state) {
    const items = state.programs || [];
    const extras = state.extracurriculars || [];
    const cards = items.slice(0, 3).map((item, i) => `<article class="rich-program-card"><span class="rich-card-icon">${iconMarkup(['atom','languages','dribbble'][i] || 'book-open')}</span><h3>${escapeHtml(item.title || item.name || 'Program Akademik')}</h3><p>${escapeHtml(item.description || item.excerpt || '')}</p><a class="text-link" href="#programs">Pelajari lebih lanjut ${iconMarkup('arrow-right')}</a></article>`).join('');
    const extraCards = extras.slice(0, 2).map(item => `<article class="rich-program-row"><span class="rich-card-icon">${iconMarkup('users-round')}</span><div><h3>${escapeHtml(item.title || item.name || 'Kegiatan')}</h3><p>${escapeHtml(item.description || item.excerpt || '')}</p></div><a class="text-link" href="#extracurriculars">Selengkapnya ${iconMarkup('arrow-right')}</a></article>`).join('');
    const featureImage = items[0]?.image || state.about?.image || '';
    const content = `<main class="rich-main"><section><div class="rich-section-label"><h2>Program Akademik</h2></div><div class="rich-program-grid">${cards || emptyState('Belum ada program akademik yang tersedia.')}</div></section><section class="rich-program-secondary"><div class="rich-section-label"><h2>Program Lainnya</h2></div><div class="rich-program-split"><div class="rich-program-list">${extraCards || emptyState('Belum ada program lainnya.')}</div>${featureImage ? `<figure class="rich-program-image"><img src="${escapeHtml(featureImage)}" alt="Program sekolah" loading="lazy" decoding="async"><figcaption><strong>Bersama kami, raih masa depan yang lebih baik.</strong><a class="button button-accent" href="#contact">Daftar Sekarang</a></figcaption></figure>` : ''}</div></section></main>`;
    return pageHeader('programs', state) + richLayout('programs', state, content);
}

function renderExtracurriculars(state) { return pageHeader('extracurriculars', state) + richLayout('extracurriculars', state, `<main class="rich-main"><div class="rich-card-grid">${(state.extracurriculars || []).slice(0, 6).map((item,i)=>richCollectionCard(item, ['activity','music','trophy','palette','users','globe'][i%6])).join('') || emptyState('Belum ada kegiatan.')}</div></main>`); }

function renderTeachers(state) {
    const items = state.teachers || [];
    const cards = items.slice(0, 8).map((item, i) => `<figure class="rich-person-card"><img src="${escapeHtml(item.image || item.image_url || '')}" alt="${escapeHtml(item.name || 'Tenaga pengajar')}" loading="lazy" decoding="async"><figcaption><strong>${escapeHtml(item.name || 'Tenaga pengajar')}</strong><span>${escapeHtml(item.position || item.title || 'Guru')}</span></figcaption></figure>`).join('');
    const content = `<main class="rich-main"><div class="rich-toolbar"><div class="rich-filters"><button class="is-active" type="button">Semua</button><button type="button">Guru</button><button type="button">Staf</button></div><label class="rich-search"><span class="sr-only">Cari nama pengajar</span><input type="search" placeholder="Cari nama pengajar…"><button type="button" aria-label="Cari">${iconMarkup('search')}</button></label></div><div class="rich-people-grid">${cards || emptyState('Belum ada data tenaga pengajar.')}</div><div class="rich-pager" aria-label="Paginasi"><button>‹</button><button class="is-active">1</button><button>2</button><button>3</button><button>…</button><button>›</button></div></main>`;
    return pageHeader('teachers', state) + richLayout('teachers', state, content);
}

function renderAchievements(state) {
    const items = state.achievements || [];
    const cards = items.slice(0, 6).map((item, i) => `<article class="rich-achievement-card">${item.image || item.image_url ? `<img src="${escapeHtml(item.image || item.image_url)}" alt="" loading="lazy" decoding="async">` : ''}<div><span class="meta">${escapeHtml(item.category || ['Akademik','Non-Akademik','Olahraga','Seni'][i%4])}</span><h2>${escapeHtml(item.title || 'Prestasi siswa')}</h2><p>${escapeHtml(item.description || item.excerpt || '')}</p><small>${escapeHtml(item.year || '2025')}</small></div></article>`).join('');
    const content = `<main class="rich-main"><div class="rich-toolbar"><div class="rich-filters"><button class="is-active" type="button">Semua</button><button type="button">Akademik</button><button type="button">Non-Akademik</button><button type="button">Olahraga</button><button type="button">Seni</button></div><div class="rich-selects"><select><option>Tahun</option><option>2025</option><option>2024</option></select><select><option>Semua</option></select></div></div><div class="rich-achievement-grid">${cards || emptyState('Belum ada prestasi yang tersedia.')}</div><div class="rich-pager"><button>‹</button><button class="is-active">1</button><button>2</button><button>3</button><button>›</button></div></main>`;
    return pageHeader('achievements', state) + richLayout('achievements', state, content);
}

function renderTestimonials(state) {
    const items = state.testimonials || [];
    const content = `<main class="rich-main"><div class="rich-testimonial-grid">${items.slice(0, 6).map(item => `<figure class="rich-testimonial"><blockquote>“${escapeHtml(item.quote || item.content || item.text || '')}”</blockquote><figcaption>${item.image || item.image_url ? `<img src="${escapeHtml(item.image || item.image_url)}" alt="" loading="lazy">` : ''}<span><strong>${escapeHtml(item.name || item.author || 'Warga sekolah')}</strong><small>${escapeHtml(item.role || '')}</small></span></figcaption></figure>`).join('') || emptyState('Belum ada testimoni.')}</div></main>`;
    return pageHeader('testimonials', state) + richLayout('testimonials', state, content);
}

function renderEvents(state) {
    const content = `<main class="rich-main"><div class="rich-toolbar"><div class="rich-filters"><button class="is-active" type="button">Semua</button><button type="button">Akademik</button><button type="button">Kesiswaan</button><button type="button">Kegiatan Sekolah</button></div><select class="rich-month"><option>Juni 2025</option><option>Juli 2025</option></select></div><div class="rich-event-list">${(state.events || []).slice(0, 8).map(item => { const d = item.event_date || item.date || ''; return `<article class="rich-event-row"><time datetime="${escapeHtml(d)}"><b>${d ? new Date(d).getDate() : '—'}</b><span>${d ? new Date(d).toLocaleString('id-ID',{month:'short'}).toUpperCase() : ''}</span></time><div><h2>${escapeHtml(item.title || 'Kegiatan sekolah')}</h2><p>${escapeHtml(item.description || item.excerpt || '')}</p></div><span class="rich-event-tag">Kegiatan Sekolah</span></article>`; }).join('') || emptyState('Belum ada agenda.')}</div><div class="rich-pager"><button>‹</button><button class="is-active">1</button><button>2</button><button>›</button></div></main>`;
    return pageHeader('events', state) + richLayout('events', state, content);
}

function renderGallery(state) {
    const items = state.galleries || [];
    const content = `<main class="rich-main"><div class="rich-toolbar"><div class="rich-filters"><button class="is-active" type="button">Semua</button><button type="button">Kegiatan Sekolah</button><button type="button">Akademik</button><button type="button">Olahraga</button><button type="button">Seni Budaya</button><button type="button">Profil Sekolah</button></div><select class="rich-month"><option>Terbaru</option><option>Terlama</option></select></div><div class="rich-gallery-grid">${items.slice(0, 8).map((item,i) => `<figure class="rich-gallery-item rich-gallery-item-${i%5}"><img src="${escapeHtml(item.image || item.image_url || '')}" alt="${escapeHtml(item.title || 'Dokumentasi sekolah')}" loading="lazy" decoding="async"><figcaption>${escapeHtml(item.title || 'Dokumentasi sekolah')}</figcaption></figure>`).join('') || emptyState('Belum ada dokumentasi galeri.')}</div><div class="rich-pager"><button>‹</button><button class="is-active">1</button><button>2</button><button>3</button><button>›</button></div></main>`;
    return pageHeader('gallery', state) + richLayout('gallery', state, content);
}

function renderFaq(state) {
    const content = `<main class="rich-main"><div class="rich-faq-layout"><aside class="rich-faq-nav"><button class="is-active">Semua</button>${(state.faq || []).slice(0, 5).map((item,i)=>`<button>${escapeHtml(item.category || ['Pendaftaran','Akademik','Kesiswaan','Fasilitas','Lainnya'][i] || 'Lainnya')}<small>${i+1}</small></button>`).join('')}</aside><div class="rich-faq-list">${(state.faq || []).map((item,i)=>`<details ${i===0?'open':''}><summary><span>${escapeHtml(item.question || item.title || '')}</span>${iconMarkup('plus')}</summary><p>${escapeHtml(item.answer || item.content || '')}</p></details>`).join('') || emptyState('Belum ada pertanyaan.')}</div></div><div class="rich-help"><span>${iconMarkup('messages-square')}</span><div><strong>Masih ada pertanyaan?</strong><small>Kami siap membantu untuk informasi yang belum terjawab.</small></div><a class="button" href="/contact">Hubungi Kami</a></div></main>`;
    return pageHeader('faq', state) + richLayout('faq', state, content);
}

function renderContact(state) { return pageHeader('contact', state) + richLayout('contact', state, `<main class="rich-main"><div class="contact-page-grid"><div class="contact-stack"><div><span>Alamat</span><strong>${escapeHtml(state.contact_address || '—')}</strong></div><div><span>Telepon</span><strong>${escapeHtml(state.contact_phone || '—')}</strong></div><div><span>Email</span><strong>${escapeHtml(state.contact_email || '—')}</strong></div><div><span>Jam layanan</span><strong>${escapeHtml(state.contact_hours || '—')}</strong></div></div><div><p class="eyebrow">Kanal resmi</p><h2 class="display-title contact-display-title">Mari lanjutkan percakapan.</h2><p class="mt-5 max-w-xl leading-8 text-slate-600">Gunakan kanal resmi sekolah untuk mendapatkan informasi dan bantuan.</p><a class="button mt-7" href="/contact">Buka halaman kontak</a></div></div></main>`); }

function richCollectionCard(item, icon) { return `<article class="rich-program-card"><span class="rich-card-icon">${iconMarkup(icon)}</span><h2>${escapeHtml(item.title || item.name || 'Kegiatan')}</h2><p>${escapeHtml(item.description || item.excerpt || '')}</p><a class="text-link" href="#">Selengkapnya ${iconMarkup('arrow-right')}</a></article>`; }
function emptyState(message) { return `<div class="empty-state"><span class="empty-state-mark" aria-hidden="true">—</span><p>${escapeHtml(message)}</p></div>`; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
