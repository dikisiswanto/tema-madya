import { iconMarkup } from '../icons.js';
import {
    articleReadMinutes,
    newsArchive,
    newsCategories,
    newsTags,
    popularNews,
    relatedNews,
} from '../data/derived.js';

// All native news widgets consume normalized state and shared derived selectors.
// This keeps PHP and playground free to render independently while preserving one data vocabulary.
const esc = (v) =>
    String(v ?? '').replace(
        /[&<>'"]/g,
        (c) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;',
            })[c],
    );
const image = (item, alt = '') => {
    const src = item?.image || item?.image_url;
    if (!src) return '';
    return `<img src="${esc(src)}" width="${esc(item?.image_width || item?.width || 1200)}" height="${esc(item?.image_height || item?.height || 800)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
};
function pageHeader(eyebrow, title, description, imageUrl = '') {
    return `<header class="page-hero${imageUrl ? ' page-hero-has-image' : ''}"${imageUrl ? ` style="--page-hero-image:url('${esc(imageUrl)}')"` : ''}><div class="page-hero-backdrop" aria-hidden="true"></div><div class="theme-container page-hero-inner"><nav class="breadcrumb" aria-label="Jejak navigasi"><a href="/">Beranda</a><span aria-hidden="true">/</span><span aria-current="page">${esc(title)}</span></nav><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1>${description ? `<p>${esc(description)}</p>` : ''}</div></header>`;
}
function buildFooter(state) {
    return `<footer class="site-footer"><div class="newsletter-strip faq-strip"><div class="theme-container newsletter-inner"><div><p class="eyebrow">Pertanyaan yang Sering Diajukan</p><h2>Temukan jawaban sebelum menghubungi sekolah.</h2><p>Lihat informasi umum mengenai akademik, layanan, kegiatan, dan administrasi sekolah.</p></div><a class="button" href="/#faq">${iconMarkup('circle-help')} Buka FAQ</a></div></div><div class="footer-main"><div class="theme-container footer-grid footer-grid-rich"><div class="footer-intro"><a class="footer-brand" href="/"><span class="brand-mark footer-brand-mark">${iconMarkup(state.site_logo_icon || 'graduation-cap')}</span><span><strong>${esc(state.site_logo_text || state.site_name || 'SekolahKu')}</strong><small>${esc(state.site_tagline || 'Situs resmi sekolah')}</small></span></a><p>${esc(state.footer_description || state.site_description || '')}</p></div><div><h3 class="footer-title">Navigasi</h3><div class="footer-links"><a href="/">Beranda</a><a href="/news">Berita</a><a href="/downloads">Dokumen</a><a href="/contact">Kontak</a></div></div><div><h3 class="footer-title">Program</h3><div class="footer-links">${(
        state.footer_services || []
    )
        .slice(0, 5)
        .map(
            (x) =>
                `<a href="${esc(x.url || '/#programs')}">${esc(x.label || x.title || '')}</a>`,
        )
        .join(
            '',
        )}</div></div><div><h3 class="footer-title">Layanan</h3><div class="footer-links">${(
        state.footer_links || []
    )
        .slice(0, 5)
        .map(
            (x) =>
                `<a href="${esc(x.url || '#')}">${esc(x.label || x.title || '')}</a>`,
        )
        .join(
            '',
        )}</div></div><div><h3 class="footer-title">Bantuan</h3><div class="footer-links"><a href="/#faq">FAQ</a><a href="/contact">Hubungi Sekolah</a><a href="/downloads">Dokumen</a></div></div></div></div><div class="footer-bottom"><div class="theme-container"><p>${esc(state.footer_copyright || `© ${new Date().getFullYear()} ${state.site_name || 'SekolahKu'}`)}</p><span>Dibuat dengan ♥ menggunakan CMS SekolahKu</span></div></div></footer>`;
}

export function renderFooter(state) {
    const target = document.getElementById('playground-footer');
    if (target) target.innerHTML = buildFooter(state);
}

export function renderNews(state, container) {
    const allPosts = Array.isArray(state.news) ? state.news : [];
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search')?.trim().toLowerCase() || '';
    const category = params.get('category')?.trim().toLowerCase() || '';
    const month = params.get('month')?.trim() || '';
    const posts = allPosts.filter((post) => {
        const haystack = [
            post.title,
            post.excerpt,
            post.content,
            post.category,
            post.author,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        const categoryMatch =
            !category || String(post.category || '').toLowerCase() === category;
        const monthMatch =
            !month ||
            String(post.published_at || post.created_at || '').startsWith(
                month,
            ) ||
            String(post.published_at || post.created_at || '').slice(0, 7) ===
                month;
        return (
            (!search || haystack.includes(search)) &&
            categoryMatch &&
            monthMatch
        );
    });
    const counts = newsCategories(allPosts);
    const popular = popularNews(allPosts);
    const hero =
        state.about?.hero_image || state.about?.image || posts[0]?.image || '';
    const categoryLabels = counts.length
        ? counts.map((x) => x.name)
        : ['Prestasi', 'Kegiatan', 'Pengumuman', 'Akademik', 'Artikel'];
    const countMap = new Map(counts.map((x) => [x.name, x.count]));
    container.innerHTML = `${pageHeader('Berita & Artikel', 'Berita', 'Informasi terbaru seputar kegiatan, prestasi, dan program di sekolah.', hero)}
    <section class="section news-list-page">
      <div class="theme-container news-list-shell">
        <div class="news-list-main">
          <div class="news-list-toolbar">
            <nav class="news-category-pills" aria-label="Kategori berita">
              <a class="${category ? '' : 'is-active'}" href="/news" data-news-category="">Semua</a>
              ${categoryLabels.map((c) => `<a class="${category === String(c).toLowerCase() ? 'is-active' : ''}" href="/news?category=${encodeURIComponent(c)}" data-news-category="${esc(c)}">${esc(c)}</a>`).join('')}
            </nav>
            <label class="news-sort"><span class="sr-only">Urutkan berita</span><select aria-label="Urutkan berita" data-news-sort><option value="latest">Terbaru</option><option value="popular">Terpopuler</option><option value="az">A-Z</option></select>${iconMarkup('chevron-down')}</label>
          </div>
          <div class="news-archive-list" data-news-list>
            ${posts.length ? posts.map((p) => renderCard(p, false)).join('') : `<div class="empty-state"><p>Belum ada berita untuk ditampilkan.</p></div>`}
          </div>
        </div>
        <aside class="news-list-sidebar">
          <section class="news-side-card news-search-card">
            <h2>Cari Berita</h2>
            <form class="news-sidebar-search" role="search" action="/news" method="get"><label class="sr-only" for="playground-news-search">Cari berita</label><input id="playground-news-search" name="search" placeholder="Cari berita..." autocomplete="off"><button type="submit" aria-label="Cari berita">${iconMarkup('search')}</button></form>
          </section>
          <section class="news-side-card">
            <h2>Kategori Berita</h2>
            <div class="news-category-list">
              ${categoryLabels.map((category) => `<a href="/news?category=${encodeURIComponent(category)}"><span>${esc(category)}</span><b>${countMap.get(category) || 0}</b></a>`).join('')}
              <a href="/news"><span>Semua Kategori</span><span class="category-more-icon">${iconMarkup('arrow-right')}</span></a>
            </div>
          </section>
          ${popular.length ? `<section class="news-side-card"><h2>Berita Populer</h2><div class="popular-news-list">${popular.map((p, i) => `<a href="/news/${encodeURIComponent(p.slug || '')}"><b>${String(i + 1).padStart(2, '0')}</b><span><strong>${esc(p.title || 'Berita sekolah')}</strong><small>${esc(p.published_at || p.created_at || '')}</small></span></a>`).join('')}<a class="side-card-more" href="/news">Lihat semua berita populer ${iconMarkup('arrow-right')}</a></div></section>` : ''}
          <section class="news-newsletter-card faq-cta-card"><h2>Pertanyaan yang Sering Diajukan</h2><p>Temukan jawaban cepat mengenai informasi sekolah, layanan, dan kegiatan.</p><a class="button button-light" href="/#faq">Buka FAQ ${iconMarkup('arrow-right')}</a><div class="news-newsletter-art" aria-hidden="true">${iconMarkup('circle-help')}</div></section>
        </aside>
      </div>
    </section>`;
}

function renderCard(post, featured = false) {
    const href = `/news/${encodeURIComponent(post.slug || 'contoh-berita')}`;
    const date = post.published_at || post.created_at || 'Informasi terbaru';
    const excerpt = post.excerpt || post.description || '';
    const views = post.view_count != null ? Number(post.view_count) : null;
    return `<article class="news-card${featured ? ' news-card-featured' : ''}" data-news-title="${esc(post.title || '')}" data-news-views="${esc(post.view_count || 0)}" data-news-timestamp="${Date.parse(post.published_at || post.created_at || '') || 0}">
    ${post.image ? `<a class="news-card-media" href="${href}" aria-label="Baca ${esc(post.title || 'berita')}">${image(post, post.title || 'Berita sekolah')}${post.category ? `<span class="news-card-category">${esc(post.category)}</span>` : ''}</a>` : ''}
    <div class="news-card-body">
      <div class="news-card-date">${iconMarkup('calendar-days')}<time datetime="${esc(date)}">${esc(date)}</time></div>
      <h2><a href="${href}">${esc(post.title || 'Berita sekolah')}</a></h2>
      ${excerpt ? `<p>${esc(excerpt)}</p>` : ''}
      <div class="news-card-footer">
        <div class="news-card-meta" aria-label="Metadata berita">
          ${post.author ? `<span>${iconMarkup('user')}${esc(post.author)}</span>` : ''}
          ${views != null ? `<span>${iconMarkup('eye')}${esc(views.toLocaleString('id-ID'))} kali dibaca</span>` : ''}
        </div>
        <a class="text-link" href="${href}">Baca selengkapnya ${iconMarkup('arrow-right')}</a>
      </div>
    </div>
  </article>`;
}

export function renderArticle(state, slug, container) {
    const posts = Array.isArray(state.news) ? state.news : [];
    const post = posts.find((x) => x.slug === slug) || posts[0];
    if (!post) {
        container.innerHTML = `${pageHeader('Berita', 'Berita tidak ditemukan', 'Halaman yang Anda cari belum tersedia.', state.about?.hero_image || state.about?.image || '')}<section class="section"><div class="theme-container empty-state"><p>Berita yang diminta tidak tersedia.</p><a class="button" href="/news">Kembali ke berita</a></div></section>`;
        return null;
    }
    const idx = posts.indexOf(post);
    const related = relatedNews(posts, post);
    const categories = newsCategories(posts);
    const tags = newsTags(posts);
    const archive = newsArchive(posts);
    const commentsBySlug = Array.isArray(state.comments)
        ? state.comments.filter(
              (x) => !x.news_slug || x.news_slug === post.slug,
          )
        : [];
    const comments = commentsBySlug;
    const date = post.published_at || post.created_at || '';
    const readMinutes = articleReadMinutes(post);
    const hero = state.about?.hero_image || state.about?.image || '';
    const title = post.title || 'Berita sekolah';
    const shareUrl = window.location.href;
    const shareTitle = title;
    const meta = [
        date
            ? `<span>${iconMarkup('calendar-days')}<time datetime="${esc(date)}">${esc(date)}</time></span>`
            : '',
        post.author
            ? `<span>${iconMarkup('user-round')}${esc(post.author)}</span>`
            : '',
        post.view_count != null
            ? `<span>${iconMarkup('eye')}${Number(post.view_count).toLocaleString('id-ID')} kali dibaca</span>`
            : '',
        `<span>${iconMarkup('clock-3')}${readMinutes} menit baca</span>`,
    ].join('');
    const prev = idx > 0 ? posts[idx - 1] : null;
    const next = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;
    const relatedHtml = related.length
        ? `<section class="article-related"><div class="article-section-heading"><p class="eyebrow">Bacaan berikutnya</p><h2>Berita terkait.</h2></div><div class="article-related-grid">${related
              .map(
                  (item) =>
                      `<a class="article-related-card" href="/news/${encodeURIComponent(item.slug || '')}"><div class="article-related-media">${item.image ? image(item, item.title || 'Berita sekolah') : `<div class="article-related-placeholder">${iconMarkup('newspaper')}</div>`}</div><div class="article-related-body"><span>${esc(
                          String(item.category || 'Berita')
                              .split(',')[0]
                              .trim(),
                      )}</span><strong>${esc(item.title || '')}</strong><small>${esc(item.published_at || item.created_at || '')}</small></div></a>`,
              )
              .join('')}</div></section>`
        : '';
    const commentsHtml = `<section class="comments-section" id="komentar"><div class="article-section-heading"><p class="eyebrow">Ruang diskusi</p><h2>Komentar.</h2><p class="comments-intro">Bagikan tanggapan Anda. Komentar akan tampil setelah disetujui oleh pengelola sekolah.</p></div><form class="comment-form" data-playground-comment-form onsubmit="return false;"><div class="comment-form-grid"><label><span>Nama</span><input type="text" name="name" required minlength="3" maxlength="100" autocomplete="name" placeholder="Nama Anda"></label><label><span>Email</span><input type="email" name="email" required autocomplete="email" placeholder="email@contoh.com"></label></div><label><span>Komentar</span><textarea name="message" rows="5" required minlength="10" placeholder="Tulis tanggapan Anda…"></textarea></label><div class="comment-form-footer"><p>Komentar demo di playground. Pada CMS, form ini menggunakan endpoint komentar native Sekolahku.</p><button class="button" type="submit">Kirim Komentar ${iconMarkup('arrow-right')}</button></div></form><div class="comment-list" aria-label="Contoh komentar yang telah disetujui">${comments
        .map(
            (c) =>
                `<article class="comment-card"><div class="comment-card-inner"><div class="comment-avatar" aria-hidden="true">${esc(
                    String(c.name || 'W')
                        .trim()
                        .charAt(0)
                        .toUpperCase(),
                )}</div><div class="comment-card-body"><div class="comment-card-head"><strong>${esc(c.name || 'Warga sekolah')}</strong><time datetime="${esc(c.created_at || '')}">${esc(c.created_at || '')}</time></div><p>${esc(c.comment || c.message || '')}</p></div></div></article>`,
        )
        .join('')}</div></section>`;
    const sidebar = `<aside class="article-sidebar"><section class="share-card"><h2>Bagikan Artikel</h2><div class="share-actions"><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Bagikan ke Facebook">${iconMarkup('facebook')}<span>Facebook</span></a><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}" target="_blank" rel="noopener" aria-label="Bagikan ke X">${iconMarkup('twitter')}<span>X (Twitter)</span></a><a href="https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}" target="_blank" rel="noopener" aria-label="Bagikan ke WhatsApp">${iconMarkup('message-circle')}<span>WhatsApp</span></a><button type="button" data-copy-link aria-label="Salin tautan">${iconMarkup('link-2')}<span>Salin Tautan</span></button></div></section>${related.length ? `<section class="sidebar-card"><h2>Berita Terkait</h2><div class="sidebar-related-list">${related.map((item) => `<a href="/news/${encodeURIComponent(item.slug || '')}">${item.image ? image(item, '') : `<span class="sidebar-related-placeholder">${iconMarkup('newspaper')}</span>`}<span><strong>${esc(item.title || '')}</strong><small>${esc(item.published_at || item.created_at || '')}</small></span></a>`).join('')}</div></section>` : ''}${categories.length ? `<section class="sidebar-card"><h2>Kategori Berita</h2><div class="sidebar-category-list">${categories.map((cat) => `<a href="/news?category=${encodeURIComponent(cat.name)}"><span>${esc(cat.name)}</span><b>${cat.count}</b></a>`).join('')}</div><a class="sidebar-more" href="/news">Lihat semua kategori ${iconMarkup('arrow-right')}</a></section>` : ''}${
        tags.length
            ? `<section class="sidebar-card"><h2>Topik Populer</h2><div class="article-sidebar-tags">${tags
                  .slice(0, 12)
                  .map(
                      (tag) =>
                          `<a href="/news?search=${encodeURIComponent(tag)}">${esc(tag)}</a>`,
                  )
                  .join('')}</div></section>`
            : ''
    }${
        archive.length
            ? `<section class="sidebar-card"><h2>Arsip Berita</h2><div class="article-archive-list">${archive
                  .slice(0, 8)
                  .map(
                      (entry) =>
                          `<a href="/news?month=${encodeURIComponent(entry.month)}"><span>${esc(entry.label)}</span><b>${entry.count}</b></a>`,
                  )
                  .join('')}</div></section>`
            : ''
    }<section class="article-newsletter faq-cta-card"><p class="eyebrow eyebrow-dark">Pertanyaan Umum</p><h2>Masih ada yang ingin diketahui?</h2><p>Lihat jawaban atas pertanyaan yang sering diajukan mengenai sekolah dan layanan publik.</p><a class="button button-light" href="/#faq">Buka FAQ ${iconMarkup('arrow-right')}</a><div class="article-newsletter-art" aria-hidden="true">${iconMarkup('circle-help')}</div></section></aside>`;
    container.innerHTML = `${pageHeader('Detail', 'Berita', 'Informasi terbaru seputar kegiatan, prestasi, dan program di sekolah.', hero)}<section class="section article-detail-section"><div class="theme-container article-detail-layout"><article class="article-main"><header class="article-header"><span class="article-category">${esc(
        String(post.category || 'Berita')
            .split(',')[0]
            .trim(),
    )}</span><h1>${esc(title)}</h1><div class="article-meta" aria-label="Metadata artikel">${meta}</div></header>${post.image ? `<figure class="article-cover">${image(post, title)}</figure>` : ''}<div class="article-prose">${post.content || post.body || `<p>${esc(post.excerpt || post.description || '')}</p>`}</div>${
        post.category
            ? `<div class="article-tags"><strong>Tag:</strong>${String(
                  post.category,
              )
                  .split(',')
                  .map((x) => x.trim())
                  .filter(Boolean)
                  .map(
                      (tag) =>
                          `<a href="/news?category=${encodeURIComponent(tag)}">${esc(tag)}</a>`,
                  )
                  .join('')}</div>`
            : ''
    }<nav class="article-nav" aria-label="Navigasi artikel">${prev ? `<a class="article-nav-card" href="/news/${encodeURIComponent(prev.slug || '')}"><span>${iconMarkup('arrow-left')}Artikel sebelumnya</span><strong>${esc(prev.title || '')}</strong></a>` : '<span></span>'}${next ? `<a class="article-nav-card article-nav-next" href="/news/${encodeURIComponent(next.slug || '')}"><span>Artikel selanjutnya ${iconMarkup('arrow-right')}</span><strong>${esc(next.title || '')}</strong></a>` : '<span></span>'}</nav>${relatedHtml}${commentsHtml}</article>${sidebar}</div></section>`;
    return post.slug;
}

export function renderDownloads(state, container) {
    const items = Array.isArray(state.downloads)
        ? state.downloads.filter((x) => Number(x.show ?? 1) !== 0)
        : [];
    const cats = [...new Set(items.map((x) => x.category).filter(Boolean))];
    const ext = (x) =>
        String(
            x.extension ||
                (x.url || '').split('?')[0].split('.').pop() ||
                'PDF',
        ).toUpperCase();
    const pdfCount = items.filter((x) => ext(x) === 'PDF').length;
    const otherCount = Math.max(0, items.length - pdfCount);
    const slug = (x) =>
        String(x || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    const hero =
        state.about?.hero_image ||
        '/themes/madya/assets/generated/hero-campus.jpg';
    const stat = (icon, value, label) =>
        `<div class="download-stat"><span class="download-stat-icon">${iconMarkup(icon)}</span><span><strong>${esc(value)}</strong><small>${esc(label)}</small></span></div>`;
    const itemRow = (x) => {
        const e = ext(x);
        const icon =
            e === 'PDF'
                ? 'file-text'
                : e === 'XLS' || e === 'XLSX'
                  ? 'clipboard-text'
                  : e === 'DOC' || e === 'DOCX'
                    ? 'file-text'
                    : 'file-text';
        return `<a class="document-row-reference" href="${esc(x.url || '#')}" target="_blank" rel="noopener noreferrer"><span class="document-file-type document-file-type-${esc(e.toLowerCase())}">${iconMarkup(icon)}<b>${esc(e)}</b></span><span class="document-main-reference"><strong>${esc(x.title || 'Dokumen')}</strong>${x.description ? `<small>${esc(x.description)}</small>` : ''}<span class="document-meta-reference">${iconMarkup('download')}${esc(x.file_size || 'Ukuran tidak tersedia')}</span></span><span class="document-download-button">${iconMarkup('download')}Unduh</span></a>`;
    };
    const groups = cats
        .map(
            (cat) =>
                `<section class="document-group document-group-reference" id="doc-${slug(cat)}"><div class="document-group-heading"><div><p class="eyebrow">Koleksi</p><h2>${esc(cat)}</h2></div><span>${items.filter((x) => x.category === cat).length} dokumen</span></div><div class="document-list-reference">${items
                    .filter((x) => x.category === cat)
                    .map(itemRow)
                    .join('')}</div></section>`,
        )
        .join('');
    const selected = items.slice(0, 5);
    const sidebarCats = `<section class="download-widget"><h2>Kategori Dokumen</h2><div class="download-category-links"><a href="/downloads"><span>${iconMarkup('chevron-right')}Semua Kategori</span><b>${items.length}</b></a>${cats.map((c) => `<a href="#doc-${slug(c)}"><span>${iconMarkup('chevron-right')}${esc(c)}</span><b>${items.filter((x) => x.category === c).length}</b></a>`).join('')}</div></section>`;
    const sidebarSelected = `<section class="download-widget"><h2>Dokumen Pilihan</h2><div class="download-popular-list">${selected.map((x, i) => `<a href="${esc(x.url || '#')}" target="_blank" rel="noopener noreferrer"><span class="download-rank">${String(i + 1).padStart(2, '0')}</span><span><strong>${esc(x.title || 'Dokumen')}</strong><small>${esc(x.file_size || '')}</small></span></a>`).join('')}</div><a class="download-widget-link" href="#all-documents">Lihat semua ${iconMarkup('arrow-right')}</a></section>`;
    container.innerHTML = `${pageHeader('Pusat Download', 'Pusat Download', 'Unduh berbagai dokumen penting, formulir, panduan, dan informasi resmi sekolah.', hero)}<section class="downloads-reference-section section"><div class="theme-container"><div class="download-stat-grid download-stat-grid-reference">${stat('file-text', items.length, 'Total Dokumen')}${stat('folder-open', cats.length, 'Kategori')}${stat('download', pdfCount, 'Dokumen PDF')}${stat('files', otherCount, 'Format Lain')}</div><div class="download-content-grid" id="all-documents"><main class="download-main-column"><div class="download-toolbar-reference"><div><h2>Semua Dokumen</h2><p>Dokumen resmi sekolah yang tersedia untuk diunduh.</p></div></div>${groups || `<div class="empty-state"><p>Belum ada dokumen yang tersedia.</p></div>`}</main><aside class="download-sidebar-reference">${sidebarCats}${sidebarSelected}<section class="download-newsletter-widget faq-cta-card"><p class="eyebrow eyebrow-dark">Pertanyaan Umum</p><h2>Butuh bantuan terkait dokumen?</h2><p>Lihat jawaban atas pertanyaan yang sering diajukan sebelum menghubungi sekolah.</p><a class="button button-light" href="/#faq">Buka FAQ ${iconMarkup('arrow-right')}</a><img src="/themes/madya/assets/illustrations/documents.svg" alt="" aria-hidden="true"></section></aside></div><section class="download-help-banner"><img src="/themes/madya/assets/illustrations/community.svg" alt="Bantuan dokumen" loading="lazy" decoding="async"><div><p class="eyebrow">Butuh Dokumen Lain?</p><h2>Tidak menemukan dokumen yang Anda cari?</h2><p>Hubungi admin sekolah untuk mendapatkan informasi atau mengajukan permintaan dokumen.</p><a class="button" href="/contact">Hubungi Kami ${iconMarkup('arrow-right')}</a></div><span class="download-help-art" aria-hidden="true">${iconMarkup('folder-open')}</span></section></div></section>`;
}
export function renderStaticPage(state, slug, container) {
    const pages = Array.isArray(state.pages) ? state.pages : [];
    const page = pages.find(
        (item) =>
            String(item.slug || '').replace(/^\//, '') ===
            String(slug || '').replace(/^\//, ''),
    );
    if (!page) {
        container.innerHTML = `pageHeader('Informasi','Halaman tidak ditemukan','Halaman yang Anda cari belum tersedia.',state.about?.hero_image||state.about?.image||'')}<section class="section"><div class="theme-container empty-state"><p>Halaman yang diminta tidak tersedia.</p><a class="button" href="/">Kembali ke beranda</a></div></section>`;
        return;
    }
    const related = pages.filter((item) => item.slug !== page.slug).slice(0, 6);
    const docs = Array.isArray(state.downloads)
        ? state.downloads
              .filter((item) => Number(item.show ?? 1) !== 0)
              .slice(0, 3)
        : [];
    const sidebar = `<aside class="static-page-sidebar">
    ${related.length ? `<section class="static-sidebar-card"><h2>Halaman Lainnya</h2><nav class="static-sidebar-links" aria-label="Halaman lainnya">${related.map((item) => `<a href="/pages/${encodeURIComponent(item.slug || '')}">${iconMarkup('file-text')}<span>${esc(item.title || '')}</span></a>`).join('')}</nav></section>` : ''}
    ${docs.length ? `<section class="static-sidebar-card"><h2>Dokumen Terkait</h2><div class="static-document-list">${docs.map((item) => `<a href="${esc(item.url || '#')}" target="_blank" rel="noopener noreferrer"><span class="static-document-icon">${iconMarkup('file-text')}</span><span><strong>${esc(item.title || 'Dokumen')}</strong><small>${esc(item.file_size || '')}</small></span>${iconMarkup('download')}</a>`).join('')}</div><a class="static-sidebar-more" href="/downloads">Lihat semua dokumen ${iconMarkup('arrow-right')}</a></section>` : ''}
    <section class="static-help-card"><div><p class="eyebrow">Butuh Bantuan?</p><h2>Masih ada pertanyaan?</h2><p>Hubungi kanal resmi sekolah untuk mendapatkan informasi lebih lanjut.</p><a class="button" href="/contact">Hubungi Kami ${iconMarkup('arrow-right')}</a></div>${iconMarkup('messages-square')}</section>
    <section class="static-newsletter-card faq-cta-card"><p class="eyebrow">Pertanyaan Umum</p><h2>Butuh jawaban cepat?</h2><p>Lihat pertanyaan yang sering diajukan seputar layanan, kegiatan, dan informasi sekolah.</p><a class="button button-accent" href="/#faq">Lihat FAQ ${iconMarkup('arrow-right')}</a></section>
  </aside>`;
    const content = page.content || `<p>${esc(page.excerpt || '')}</p>`;
    container.innerHTML = `pageHeader('Informasi', page.title || 'Halaman Informasi', page.excerpt || '', page.image || state.about?.hero_image || '')}<section class="section static-page-section"><div class="theme-container static-page-layout"><article class="static-page-main"><div class="article-prose">${content}</div>${page.image ? `<figure class="static-feature-image"><img src="${esc(page.image)}" alt="${esc(page.title || '')}" loading="lazy" decoding="async"></figure>` : ''}</article>${sidebar}</div></section>`;
}

export function renderContact(state, container) {
    const hero =
        state.about?.hero_image ||
        '/themes/madya/assets/generated/hero-campus.jpg';
    const mapAddress = encodeURIComponent(state.contact_address || '');
    const social =
        state.social_instagram ||
        state.social_facebook ||
        state.social_youtube ||
        'Kanal resmi sekolah';
    const about = state.about || {};
    const helpLinks = [
        [
            'file-text',
            'Pusat Download',
            'Dokumen dan formulir resmi',
            '/downloads',
        ],
        ['newspaper', 'Berita Sekolah', 'Informasi dan pengumuman', '/news'],
        ['school', 'Profil Sekolah', 'Kenali sekolah lebih dekat', '/#profile'],
        [
            'messages-square',
            'Hubungi Kami',
            'Kanal komunikasi resmi',
            '/contact',
        ],
    ];
    container.innerHTML = `${pageHeader('Hubungi Sekolah', 'Kontak Sekolah', 'Kami siap membantu Anda. Hubungi kami untuk informasi, kerja sama, atau layanan sekolah lainnya.', hero)}<section class="contact-overlap-section section"><div class="theme-container"><div class="contact-summary contact-summary-five"><div class="contact-summary-item"><span class="contact-summary-icon">${iconMarkup('map-pin')}</span><div><strong>Alamat</strong><small>${esc(state.contact_address || '—')}</small></div></div><div class="contact-summary-item"><span class="contact-summary-icon">${iconMarkup('phone')}</span><div><strong>Telepon</strong><small>${esc(state.contact_phone || '—')}</small></div></div><div class="contact-summary-item"><span class="contact-summary-icon">${iconMarkup('mail')}</span><div><strong>Email</strong><small>${esc(state.contact_email || '—')}</small></div></div><div class="contact-summary-item"><span class="contact-summary-icon">${iconMarkup('clock-3')}</span><div><strong>Jam Layanan</strong><small>${esc(state.contact_hours || '—')}</small></div></div><div class="contact-summary-item"><span class="contact-summary-icon contact-summary-icon-social">${iconMarkup('message-circle')}</span><div><strong>Media Sosial</strong><small>${esc(social)}</small></div></div></div><div class="contact-main-grid contact-main-grid-reference"><section class="contact-info-panel contact-reference-card"><div class="contact-info-heading"><p class="eyebrow">Informasi Sekolah</p><h2>Temukan kami dan hubungi kanal resmi.</h2></div><div class="contact-info-body"><div class="contact-facts-list"><div><span class="contact-fact-icon">${iconMarkup('map-pin')}</span><span><strong>Alamat Lengkap</strong><small>${esc(state.contact_address || 'Alamat sekolah belum diatur.')}</small></span></div><div><span class="contact-fact-icon">${iconMarkup('phone')}</span><span><strong>Telepon</strong><small>${esc(state.contact_phone || 'Nomor telepon belum diatur.')}</small></span></div><div><span class="contact-fact-icon">${iconMarkup('mail')}</span><span><strong>Email</strong><small>${esc(state.contact_email || 'Email sekolah belum diatur.')}</small></span></div>${about.accreditation ? `<div><span class="contact-fact-icon">${iconMarkup('award')}</span><span><strong>Akreditasi</strong><small>${esc(about.accreditation)}</small></span></div>` : ''}</div><figure class="contact-campus-photo"><img src="/themes/madya/assets/generated/campus-aerial.jpg" alt="Lingkungan sekolah" loading="lazy" decoding="async"><figcaption>Lingkungan sekolah</figcaption></figure></div><div class="contact-location-block"><h3>Lokasi Sekolah</h3><div class="contact-map-wrap">${mapAddress ? `<iframe title="Peta lokasi sekolah" loading="lazy" src="https://www.google.com/maps?q=${mapAddress}&output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe>` : `<div class="contact-map-fallback">${iconMarkup('map-pin')}<span>Alamat sekolah belum tersedia untuk menampilkan peta.</span></div>`}</div>${mapAddress ? `<a class="contact-map-link" href="https://www.google.com/maps/search/?api=1&query=${mapAddress}" target="_blank" rel="noopener noreferrer">Buka di Google Maps ${iconMarkup('arrow-up-right')}</a>` : ''}</div></section><section class="contact-form-card"><p class="eyebrow">Kirim Pesan</p><h2>Hubungi tim sekolah.</h2><p class="contact-form-intro">Isi formulir di bawah ini, tim kami akan segera merespons pesan Anda.</p><form class="contact-form-grid" action="${esc(state.urls?.contact_send || '/contact/send')}" method="post" onsubmit="return false"><div class="form-field"><label for="contact-name">Nama Lengkap <span>*</span></label><input id="contact-name" name="name" placeholder="Masukkan nama lengkap Anda" required></div><div class="form-field"><label for="contact-email">Email <span>*</span></label><input id="contact-email" name="email" type="email" placeholder="Masukkan email Anda" required></div><div class="form-field form-full"><label for="contact-subject">Subjek <span>*</span></label><input id="contact-subject" name="subject" placeholder="Apa yang ingin Anda sampaikan?" required></div><div class="form-field form-full"><label for="contact-message">Pesan <span>*</span></label><textarea id="contact-message" name="message" placeholder="Tulis pesan Anda di sini..." required maxlength="5000"></textarea><small class="form-counter">Maks. 5000 karakter</small></div><div class="contact-form-note">${iconMarkup('shield-check')}<span>Data Anda hanya digunakan untuk menindaklanjuti pesan dan kebutuhan komunikasi dengan sekolah.</span></div><div><button class="button button-contact-submit" type="submit">${iconMarkup('send')}Kirim Pesan</button></div></form><p class="contact-response-note">Pesan akan dibalas pada jam kerja (${esc(state.contact_hours || 'jam layanan sekolah')}).</p></section></div><div class="contact-lower-grid"><section class="contact-help-panel"><img src="/themes/madya/assets/illustrations/community.svg" alt="Layanan bantuan sekolah" loading="lazy" decoding="async"><div class="contact-help-copy"><p class="eyebrow">Butuh Bantuan Cepat?</p><h2>Pilih kanal informasi yang Anda perlukan.</h2><p>Gunakan halaman resmi sekolah untuk menemukan informasi dan layanan yang paling relevan.</p></div><div class="contact-help-links">${helpLinks.map(([ic, title, desc, url]) => `<a href="${url}">${iconMarkup(ic)}<strong>${esc(title)}</strong><small>${esc(desc)}</small></a>`).join('')}</div></section><section class="contact-newsletter-card faq-cta-card"><p class="eyebrow eyebrow-dark">Pertanyaan Umum</p><h2>Mungkin jawabannya sudah tersedia.</h2><p>Lihat pertanyaan yang sering diajukan sebelum mengirim pesan ke sekolah.</p><a class="button button-light" href="/#faq">Buka FAQ ${iconMarkup('arrow-right')}</a><img src="/themes/madya/assets/illustrations/documents.svg" alt="" aria-hidden="true"></section></div></div></section>`;
}
