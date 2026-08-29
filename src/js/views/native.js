import { iconMarkup } from '../icons.js';
function esc(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function image(item, alt) {
    const src = item?.image || item?.image_url;
    if (!src) return '';
    const width = item?.image_width || item?.width || 1200;
    const height = item?.image_height || item?.height || 800;
    return `<img src="${esc(src)}" width="${esc(width)}" height="${esc(height)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}

function pageHeader(eyebrow, title, description) {
    return `<header class="page-hero"><div class="theme-container page-hero-inner"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p>${esc(description)}</p></div></header>`;
}

export function renderNews(state, container) {
    const posts = state.news || [];
    container.innerHTML = `${pageHeader('Kabar sekolah', 'Berita sekolah', 'Kabar, kegiatan, dan cerita terbaru dari sekolah.')}
        <section class="section"><div class="theme-container"><div class="section-heading"><div><p class="eyebrow">Terbaru</p><h2>Berita dan cerita.</h2></div><a class="text-link" href="/">Kembali ke beranda <span aria-hidden="true">↗</span></a></div>
        <div class="news-feature-grid">${posts.length ? posts.map((post, index) => renderCard(post, index === 0)).join('') : `<div class="empty-state"><span class="empty-state-mark" aria-hidden="true">—</span><p>Belum ada berita untuk ditampilkan.</p></div>`}</div></div></section>`;
}

function renderCard(post, featured = false) {
    const slug = encodeURIComponent(post.slug || 'contoh-berita');
    const href = `/news/${slug}`;
    return `<article class="news-card${featured ? ' news-card-featured' : ''}">${post.image || post.image_url ? `<a class="news-card-media" href="${href}">${image(post, post.title || 'Berita sekolah')}</a>` : ''}<div class="news-card-body"><div class="card-meta"><span class="meta-icon">${iconMarkup("calendar-days")}</span><time datetime="${esc(post.published_at || post.created_at || "")}">${esc(post.published_at || post.created_at || 'Informasi terbaru')}</time></div><h2><a href="${href}">${esc(post.title || 'Berita sekolah')}</a></h2><p>${esc(post.excerpt || post.description || '')}</p><a class="text-link" href="${href}">Baca berita <span aria-hidden="true">↗</span></a></div></article>`;
}

export function renderArticle(state, slug, container) {
    const post = (state.news || []).find((item) => item.slug === slug) || state.news?.[0];
    if (!post) {
        container.innerHTML = `${pageHeader('Berita', 'Berita tidak ditemukan', 'Halaman yang Anda cari belum tersedia.')}<section class="section"><div class="theme-container empty-state"><p>Berita yang diminta tidak tersedia.</p><a class="button" href="/news">Kembali ke berita</a></div></section>`;
        return null;
    }
    const canonicalSlug = encodeURIComponent(post.slug || slug);
    container.innerHTML = `${pageHeader('Kabar sekolah', post.title || 'Berita sekolah', post.excerpt || 'Informasi terbaru dari lingkungan sekolah.')}
        <article class="section"><div class="theme-container article-layout"><div class="article-prose">${post.image || post.image_url ? `<figure class="article-cover">${image(post, post.title || 'Berita sekolah')}</figure>` : ''}<p class="card-meta">${iconMarkup("calendar-days")}${esc(post.published_at || post.created_at || '')}</p><p>${esc(post.content || post.body || post.description || post.excerpt || '')}</p><p><a class="text-link" href="/news">← Kembali ke berita</a></p></div></div></article>`;
    return canonicalSlug;
}

export function renderDownloads(state, container) {
    const items = state.downloads || [
        { title: 'Panduan Pendaftaran Siswa Baru', category: 'Penerimaan Siswa' },
        { title: 'Kalender Akademik', category: 'Akademik' },
        { title: 'Formulir Administrasi', category: 'Administrasi' },
    ];
    container.innerHTML = `${pageHeader('Pusat dokumen', 'Dokumen resmi', 'Formulir, panduan, dan dokumen resmi sekolah dalam satu tempat.')}
        <section class="section"><div class="theme-container document-groups"><div class="document-intro-art document-intro-art-local"><img src="/illustrations/documents.svg" width="720" height="520" alt="Ilustrasi dokumen sekolah" loading="lazy" decoding="async"><span class="illustration-caption">Dokumen resmi, lebih mudah ditemukan.</span></div><div class="document-group"><div class="document-group-heading"><div><p class="eyebrow">Koleksi</p><h2>Dokumen sekolah</h2></div><span>${items.length} berkas</span></div><div class="document-list">${items.map((item) => `<a class="document-item" href="${esc(item.url || '#')}" ${item.url ? '' : 'aria-disabled="true"'}><span class="document-item-icon">${iconMarkup("book-open")} </span><span><strong>${esc(item.title || 'Dokumen')}</strong><small>${esc(item.category || 'Dokumen resmi')} · ${esc(item.type || 'PDF')} ${item.size ? `· ${esc(item.size)}` : ''}</small></span><span aria-hidden="true">${iconMarkup("arrow-up-right")}</span></a>`).join('')}</div></div></div></section>`;
}

export function renderContact(state, container) {
    container.innerHTML = `${pageHeader('Hubungi sekolah', 'Mari berbincang.', 'Temukan kanal resmi untuk bertanya dan mendapatkan informasi dari sekolah.')}
        <section class="section"><div class="theme-container contact-page-grid"><div><figure class="contact-art"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82" width="1200" height="800" alt="" loading="lazy" decoding="async">${iconMarkup('landmark')}</figure><div class="contact-stack"><div><span>${iconMarkup("map-pin")} Alamat</span><strong>${esc(state.contact_address || 'Alamat sekolah')}</strong></div><div><span>${iconMarkup("message-circle")} Telepon</span><strong>${esc(state.contact_phone || '—')}</strong></div><div><span>${iconMarkup("mail")} Email</span><strong>${esc(state.contact_email || '—')}</strong></div><div><span>${iconMarkup("clock-3")} Jam layanan</span><strong>${esc(state.contact_hours || '—')}</strong></div></div></div><div><p class="eyebrow">Kanal resmi</p><h2 class="display-title contact-display-title">Sampaikan kebutuhan Anda.</h2><p class="mt-5 max-w-xl leading-8 text-slate-600">Halaman kontak server-side menyediakan formulir resmi beserta validasi dan perlindungan spam.</p><a class="button mt-7" href="${esc(state.urls?.contact_send || '/contact/send')}">Buka formulir kontak</a></div></div></section>`;
}
