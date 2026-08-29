import { iconMarkup, initIcons } from '../icons.js';
export default function renderHome(state, container) {
    const newsUrl = state.urls?.news || '/news';
    const contactUrl = state.urls?.contact || '/contact';
    const programs = state.programs || [];
    const teachers = state.teachers || [];
    const achievements = state.achievements || [];
    const news = state.news || [];
    const events = state.events || [];
    const galleries = state.galleries || [];
    const principal = state.principal || teachers[0] || {};

    container.innerHTML = `
        <section class="section hero-section" aria-labelledby="hero-title">
            <div class="theme-container hero-editorial">
                <div class="hero-editorial-copy">
                    ${state.hero_badge ? `<p class="eyebrow">${escapeHtml(state.hero_badge)}</p>` : ''}
                    <p class="hero-kicker">Belajar · Bertumbuh · Berkarya</p>
                    <h1 id="hero-title" class="display-title hero-title">${escapeHtml(state.hero_title || 'Ruang untuk belajar, bertumbuh, dan melangkah.')}</h1>
                    <p class="hero-lead">${escapeHtml(state.hero_subtitle || state.site_tagline || '')}</p>
                    <div class="hero-actions">
                        <a class="button" href="#profile">Kenali sekolah</a>
                        <a class="button button-secondary" href="#programs">Lihat program</a>
                    </div>
                </div>
                <div class="hero-editorial-media-wrap">
                    <figure class="hero-media hero-media-editorial">
                        ${imageOrPlaceholder(state.about?.image, `Lingkungan ${state.site_name || 'sekolah'}`, state.about, true)}
                        <canvas class="campus-scene" data-campus-scene aria-hidden="true"></canvas>
                        <div class="campus-scene-label">${iconMarkup('school')}<span>Miniatur kampus</span></div>
                        <div class="hero-principal-card">
                            ${imageOrPlaceholder(principal.image || principal.image_url, principal.name || 'Kepala sekolah', principal)}
                            <div><span>Kepala sekolah</span><strong>${escapeHtml(principal.name || 'Kepala sekolah')}</strong></div>
                        </div>
                        ${state.about?.image_caption ? `<figcaption>${escapeHtml(state.about.image_caption)}</figcaption>` : ''}
                    </figure>
                    <div class="hero-note"><span>01</span><p>${escapeHtml(state.site_tagline || 'Ruang belajar untuk tumbuh bersama.')}</p></div>
                </div>
            </div>
        </section>

        <section class="section section-facts" aria-label="Gambaran singkat sekolah">
            <div class="theme-container"><div class="fact-strip editorial-facts">${renderStats(state.counter_stats || state.hero_stats || [])}</div></div>
        </section>

        <section class="section section-alt" id="profile" aria-labelledby="profile-title">
            <div class="theme-container identity-grid">
                <div class="identity-visual">
                    <div class="identity-image">${imageOrPlaceholder(state.about?.image, `Tentang ${state.site_name || 'sekolah'}`, state.about)}</div>
                    <figure class="illustration-card illustration-card-learning"><img src="/illustrations/learning.svg" width="720" height="520" alt="Ilustrasi kegiatan belajar di sekolah" loading="lazy" decoding="async"><figcaption>${iconMarkup('book-open')}<span>Belajar dengan pengalaman nyata.</span></figcaption></figure>
                </div>
                <div class="identity-copy">
                    <p class="eyebrow">Tentang sekolah</p>
                    <h2 id="profile-title" class="display-title section-title section-display">Mengenal sekolah lebih dekat.</h2>
                    <p>${escapeHtml(state.about?.description || state.site_description || 'Sekolah yang tumbuh bersama masyarakat dan memberi ruang bagi siswa untuk belajar, berproses, dan berprestasi.')}</p>
                    ${state.about?.visi ? `<div class="identity-vision"><span>Visi</span><p>${escapeHtml(state.about.visi)}</p></div>` : ''}
                    <a class="text-link" href="#profile">Lihat profil <span aria-hidden="true">→</span></a>
                </div>
            </div>
        </section>

        <section class="section" id="programs" aria-labelledby="programs-title">
            <div class="theme-container">
                <div class="section-heading editorial-heading"><div><p class="eyebrow">Pilihan belajar</p><h2 id="programs-title">Pilihan belajar untuk berkembang.</h2><p class="section-heading-description">Program yang memberi ruang untuk mencoba, mendalami minat, dan berkembang.</p></div><a class="text-link" href="#programs">Semua program <span aria-hidden="true">→</span></a></div>
                <div class="program-story">
                    <div class="program-feature-panel">
                        <div class="program-feature-art" aria-hidden="true"><img src="/illustrations/community.svg" width="720" height="520" alt="" loading="lazy" decoding="async"></div>
                        <span class="program-feature-top"><span class="program-index">01</span>${iconMarkup(programs[0]?.icon || 'sparkles', 'theme-icon theme-icon-light')}</span>
                        <h3>${escapeHtml(programs[0]?.title || 'Program akademik')}</h3>
                        <p>${escapeHtml(programs[0]?.description || programs[0]?.excerpt || 'Ruang belajar untuk mengembangkan rasa ingin tahu dan kemampuan memecahkan masalah.')}</p>${programs[0]?.image ? `<div class="program-feature-image"><img src="${escapeHtml(programs[0].image)}" width="1200" height="800" alt="" loading="lazy" decoding="async"></div>` : ''}
                        <a class="text-link" href="#programs">Jelajahi <span aria-hidden="true">↗</span></a>
                    </div>
                    <div class="program-list">${programs.slice(1, 4).map((item,index)=>`<a class="program-feature-row" href="#programs"><span class="program-row-index"><span class="program-index">${String(index+2).padStart(2,'0')}</span>${iconMarkup(item.icon || 'sparkles')}</span><span class="program-title">${escapeHtml(item.title || item.name || 'Program')}</span><span class="program-summary">${escapeHtml(item.description || item.excerpt || '')}</span><span class="program-row-image">${item.image ? `<img src="${escapeHtml(item.image)}" width="360" height="240" alt="" loading="lazy" decoding="async">` : ''}</span><span class="program-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
                </div>
            </div>
        </section>
        <section class="section section-tint" id="extracurriculars" aria-labelledby="extracurricular-title">
            <div class="theme-container">
                <div class="section-heading editorial-heading"><div><p class="eyebrow">Di luar kelas</p><h2 id="extracurricular-title">Tempat minat bertemu pengalaman.</h2><p class="section-heading-description">Kegiatan yang memberi siswa ruang untuk mencoba, bekerja sama, dan menemukan hal yang mereka sukai.</p></div><a class="text-link" href="#extracurriculars">Lihat semua <span aria-hidden="true">→</span></a></div>
                <div class="activity-strip">${(state.extracurriculars || []).slice(0, 4).map((item,index)=>`<a class="activity-card" href="#extracurriculars"><span class="activity-number">${String(index+1).padStart(2,'0')}</span><span class="activity-icon">${iconMarkup(item.icon || 'sparkles')}</span>${item.image ? `<span class="activity-image"><img src="${escapeHtml(item.image)}" width="640" height="420" alt="" loading="lazy" decoding="async"></span>` : ''}<h3>${escapeHtml(item.title || 'Kegiatan siswa')}</h3><p>${escapeHtml(item.description || '')}</p><span class="activity-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
            </div>
        </section>

        <section class="section section-dark people-feature" id="teachers" aria-labelledby="people-title">
            <div class="theme-container people-grid">
                <div class="people-portrait-grid">
                    ${teachers.slice(0,3).map((teacher,index) => `<figure class="teacher-portrait teacher-portrait-${index+1}">${imageOrPlaceholder(teacher?.image || teacher?.image_url, teacher?.name || 'Tenaga pendidik', teacher || {}, false)}<figcaption><strong>${escapeHtml(teacher?.name || '')}</strong><span>${escapeHtml(teacher?.title || 'Tenaga pendidik')}</span></figcaption></figure>`).join('')}
                </div>
                <div class="people-copy">
                    <p class="eyebrow eyebrow-dark">Orang-orang di balik pembelajaran</p>
                    <h2 id="people-title" class="display-title section-title section-display">Sekolah tumbuh lewat orang-orangnya.</h2>
                    <p class="dark-feature-copy">${escapeHtml(teachers[0]?.bio || 'Guru, staf, siswa, dan keluarga membentuk budaya belajar yang memberi makna pada setiap hari.')}</p>
                    <div class="people-quote"><span class="quote-mark">${iconMarkup('quote')}</span><p>Belajar bukan hanya tentang hasil, tetapi tentang siapa yang tumbuh di sepanjang jalan.</p></div>
                    <a class="button button-light" href="#teachers">Kenali para pengajar <span aria-hidden="true">↗</span></a>
                </div>
            </div>
        </section>

        <section class="section" id="achievements" aria-labelledby="stories-title">
            <div class="theme-container stories-layout">
                <div class="stories-intro"><p class="eyebrow">Cerita & capaian</p><h2 id="stories-title" class="display-title section-title section-display">Capaian yang patut dibanggakan.</h2><p class="editorial-copy">Setiap capaian berawal dari latihan, dukungan, dan keberanian untuk mencoba.</p></div>
                <div class="achievement-list">${achievements.slice(0,3).map((item,index)=>`<article class="achievement-row"><span class="program-index">${String(index+1).padStart(2,'0')}</span>${item.image ? `<img class="achievement-thumb" src="${escapeHtml(item.image)}" width="300" height="220" alt="${escapeHtml(item.title || 'Prestasi siswa')}" loading="lazy" decoding="async">` : ''}<div><h3>${escapeHtml(item.title || 'Prestasi siswa')}</h3><p>${escapeHtml(item.description || '')}</p><small>${escapeHtml(item.level || '')}${item.year ? ` · ${escapeHtml(item.year)}` : ''}</small></div></article>`).join('')}</div>
            </div>
        </section>
        <section class="section testimonial-feature" id="testimonials" aria-labelledby="testimonial-title">
            <div class="theme-container testimonial-feature-grid">
                <div><p class="eyebrow">Cerita dari komunitas</p><h2 id="testimonial-title" class="display-title section-title">Yang paling terasa adalah orang-orangnya.</h2></div>
                <div class="testimonial-feature-card">
                    ${state.testimonials?.[0]?.image ? `<img src="${escapeHtml(state.testimonials[0].image)}" width="160" height="160" alt="${escapeHtml(state.testimonials[0].name || 'Warga sekolah')}" loading="lazy" decoding="async">` : ''}
                    <blockquote>“${escapeHtml(state.testimonials?.[0]?.quote || 'Sekolah memberi ruang untuk mencoba, bertumbuh, dan menemukan percaya diri.') }”</blockquote>
                    <div><strong>${escapeHtml(state.testimonials?.[0]?.name || 'Warga sekolah')}</strong><span>${escapeHtml(state.testimonials?.[0]?.role || '')}</span></div>
                </div>
            </div>
        </section>

        <section class="section section-alt" aria-labelledby="news-title">
            <div class="theme-container">
                <div class="section-heading editorial-heading"><div><p class="eyebrow">Kabar sekolah</p><h2 id="news-title">Kabar dari sekolah.</h2></div><a class="text-link" href="${escapeHtml(newsUrl)}">Semua berita <span aria-hidden="true">→</span></a></div>
                <div class="news-feature-layout">
                    ${news[0] ? renderNewsFeature(news[0], newsUrl) : `<div class="empty-state"><span class="empty-state-mark" aria-hidden="true">—</span><p>Belum ada berita untuk ditampilkan.</p></div>`}
                    <div class="news-list-compact">${news.slice(1,4).map(renderNewsCompact).join('')}</div>
                </div>
            </div>
        </section>

        <section class="section events-section" id="events" aria-labelledby="event-title">
            <div class="theme-container events-layout"><div><p class="eyebrow">Agenda</p><h2 id="event-title" class="display-title section-title section-display">Yang sedang berlangsung.</h2><p class="editorial-copy">Agenda belajar, berkegiatan, dan bertemu bersama komunitas sekolah.</p></div><div class="agenda-list">${events.slice(0,3).map(renderEvent).join('')}</div></div>
        </section>

        <section class="section section-alt" id="gallery" aria-labelledby="gallery-title">
            <div class="theme-container"><div class="section-heading editorial-heading"><div><p class="eyebrow">Dokumentasi</p><h2 id="gallery-title">Potret keseharian di sekolah.</h2></div><a class="text-link" href="#gallery">Lihat galeri <span aria-hidden="true">→</span></a></div><div class="gallery-editorial-grid">${galleries.slice(0,5).map((item,index)=>`<figure class="gallery-editorial-item gallery-editorial-item-${index}">${imageOrPlaceholder(item.image || item.image_url,item.title || 'Dokumentasi sekolah',item)}${item.title ? `<figcaption>${escapeHtml(item.title)}</figcaption>` : ''}</figure>`).join('')}</div></div>
        </section>
        <section class="section" id="faq" aria-labelledby="faq-title">
            <div class="theme-container faq-preview-grid">
                <div><p class="eyebrow">Pertanyaan umum</p><h2 id="faq-title" class="display-title section-title">Hal-hal yang sering ditanyakan.</h2><a class="text-link" href="#faq">Buka semua jawaban <span aria-hidden="true">→</span></a></div>
                <div class="faq-list">${(state.faq || []).slice(0,4).map((item,index)=>`<details class="faq-item"${index === 0 ? ' open' : ''}><summary><span>${String(index+1).padStart(2,'0')}</span>${escapeHtml(item.question || '')}${iconMarkup('chevron-down')}</summary><div class="faq-answer">${escapeHtml(item.answer || '')}</div></details>`).join('')}</div>
            </div>
        </section>

        <section class="section section-cta" aria-labelledby="contact-title">
            <div class="theme-container cta-editorial"><div><p class="eyebrow">Langkah berikutnya</p><h2 id="contact-title" class="display-title section-title section-display">Mari berkenalan lebih dekat.</h2></div><div><p class="editorial-copy">Hubungi kami untuk informasi tentang pendaftaran, program, kegiatan, dan layanan sekolah.</p><a class="button" href="${escapeHtml(contactUrl)}">Hubungi sekolah <span aria-hidden="true">↗</span></a></div></div>
        </section>`;
        initIcons(container);
        import('../campus3d.js').then(({ initCampusScene }) => initCampusScene()).catch(() => {});
}


function renderStats(items) { return items.length ? items.slice(0,4).map((item,index)=>`<div class="fact-item"><span class="fact-number">${String(index+1).padStart(2,'0')}</span><strong>${escapeHtml(item.value || item.number || '')}</strong><span>${escapeHtml(item.label || item.title || '')}</span></div>`).join('') : '<div class="fact-item"><strong>—</strong><span>Profil sekolah</span></div>'; }
function renderNewsFeature(item, base) { const href = `${base}/${encodeURIComponent(item.slug || '')}`; return `<article class="news-feature-item"><a class="news-feature-media" href="${escapeHtml(href)}">${imageOrPlaceholder(item.image || item.image_url,item.title || 'Berita sekolah',item)}</a><div class="news-feature-body"><div class="card-meta"><time datetime="${escapeHtml(item.published_at || item.created_at || '')}">${escapeHtml(item.published_at || item.created_at || 'Informasi terbaru')}</time></div><h3><a href="${escapeHtml(href)}">${escapeHtml(item.title || 'Berita sekolah')}</a></h3><p>${escapeHtml(item.excerpt || item.description || '')}</p><a class="text-link" href="${escapeHtml(href)}">Baca cerita <span aria-hidden="true">↗</span></a></div></article>`; }
function renderNewsCompact(item) { const href = `/news/${encodeURIComponent(item.slug || '')}`; return `<article class="news-compact-row"><span class="program-index">Berita</span><div><time datetime="${escapeHtml(item.published_at || item.created_at || '')}">${escapeHtml(item.published_at || item.created_at || '')}</time><h3><a href="${escapeHtml(href)}">${escapeHtml(item.title || 'Berita sekolah')}</a></h3></div></article>`; }
function renderEvent(item) { return `<article class="agenda-row"><span class="agenda-icon">${iconMarkup(item.icon || 'calendar-days')}</span><time datetime="${escapeHtml(item.event_date || item.date || '')}">${escapeHtml(item.event_date || item.date || 'Tanggal ditentukan kemudian')}</time><div><h3>${escapeHtml(item.title || 'Kegiatan sekolah')}</h3><p>${escapeHtml(item.description || item.excerpt || '')}</p></div></article>`; }
function imageOrPlaceholder(src, alt, item = {}, priority = false) { return src ? `<img src="${escapeHtml(src)}"${responsiveAttrs(item)} alt="${escapeHtml(alt)}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">` : `<div class="media-placeholder" role="img" aria-label="${escapeHtml(alt)}"><span>${escapeHtml(alt)}</span></div>`; }
function responsiveAttrs(item = {}) { const srcset = item.image_srcset || item.srcset; const sizes = item.image_sizes || item.sizes; const width = item.image_width || item.width || 1600; const height = item.image_height || item.height || 1000; return ` width="${escapeHtml(width)}" height="${escapeHtml(height)}"${srcset ? ` srcset="${escapeHtml(srcset)}"${sizes ? ` sizes="${escapeHtml(sizes)}"` : ''}` : ''}`; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
