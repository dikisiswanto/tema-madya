import { iconMarkup } from '../icons.js';
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const image=(item,alt='')=>{const src=item?.image||item?.image_url;if(!src)return '';return `<img src="${esc(src)}" width="${esc(item?.image_width||item?.width||1200)}" height="${esc(item?.image_height||item?.height||800)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;};
function pageHeader(eyebrow,title,description,imageUrl=''){return `<header class="page-hero${imageUrl?' page-hero-has-image':''}"${imageUrl?` style="--page-hero-image:url('${esc(imageUrl)}')"`:''}><div class="page-hero-backdrop" aria-hidden="true"></div><div class="theme-container page-hero-inner"><nav class="breadcrumb" aria-label="Jejak navigasi"><a href="/">Beranda</a><span aria-hidden="true">/</span><span aria-current="page">${esc(title)}</span></nav><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:''}</div></header>`;}
function buildFooter(state){return `<footer class="site-footer"><div class="newsletter-strip"><div class="theme-container newsletter-inner"><div><p class="eyebrow">Tetap terhubung</p><h2>Informasi sekolah, langsung ke kotak masuk.</h2><p>Gunakan kanal resmi sekolah untuk mendapatkan pengumuman dan informasi terbaru.</p></div><form class="newsletter-form" onsubmit="return false"><input type="email" placeholder="Masukkan email Anda" aria-label="Alamat email"><button class="button" type="submit">Berlangganan</button></form></div></div><div class="footer-main"><div class="theme-container footer-grid footer-grid-rich"><div class="footer-intro"><a class="footer-brand" href="/"><span class="brand-mark footer-brand-mark">${iconMarkup('graduation-cap')}</span><span><strong>${esc(state.site_logo_text||state.site_name||'SekolahKu')}</strong><small>${esc(state.site_tagline||'Situs resmi sekolah')}</small></span></a><p>${esc(state.footer_description||state.site_description||'')}</p></div><div><h3 class="footer-title">Navigasi</h3><div class="footer-links"><a href="/">Beranda</a><a href="/news">Berita</a><a href="/downloads">Dokumen</a><a href="/contact">Kontak</a></div></div><div><h3 class="footer-title">Program</h3><div class="footer-links">${(state.footer_services||[]).slice(0,5).map(x=>`<a href="${esc(x.url||'#programs')}">${esc(x.label||x.title||'')}</a>`).join('')}</div></div><div><h3 class="footer-title">Layanan</h3><div class="footer-links">${(state.footer_links||[]).slice(0,5).map(x=>`<a href="${esc(x.url||'#')}">${esc(x.label||x.title||'')}</a>`).join('')}</div></div><div><h3 class="footer-title">Kontak Kami</h3><div class="footer-links"><a href="tel:${esc(state.contact_phone)}">${esc(state.contact_phone||'—')}</a><a href="mailto:${esc(state.contact_email)}">${esc(state.contact_email||'—')}</a><span>${esc(state.contact_hours||'—')}</span></div></div></div></div><div class="footer-bottom"><div class="theme-container"><p>${esc(state.footer_copyright||`© ${new Date().getFullYear()} ${state.site_name||'SekolahKu'}`)}</p><span>Dibuat dengan ♥ menggunakan CMS SekolahKu</span></div></div></footer>`;}

export function renderFooter(state){ const target=document.getElementById('playground-footer'); if(target) target.innerHTML=buildFooter(state); }

export function renderNews(state,container){
  const posts=Array.isArray(state.news)?state.news:[];
  const categories=[...new Set(posts.map(x=>x.category).filter(Boolean))];
  const counts=categories.map(category=>({category,count:posts.filter(x=>x.category===category).length}));
  const popular=[...posts].sort((a,b)=>(Number(b.view_count||0)-Number(a.view_count||0))).slice(0,5);
  const hero=state.about?.hero_image||state.about?.image||posts[0]?.image||'';
  const categoryLabels=counts.length?counts.map(x=>x.category):['Prestasi','Kegiatan','Pengumuman','Akademik','Artikel'];
  const countMap=new Map(counts.map(x=>[x.category,x.count]));
  container.innerHTML=pageHeader('Berita & Artikel','Berita','Informasi terbaru seputar kegiatan, prestasi, dan program di sekolah.',hero)+`
    <section class="section news-list-page">
      <div class="theme-container news-list-shell">
        <div class="news-list-main">
          <div class="news-list-toolbar">
            <nav class="news-category-pills" aria-label="Kategori berita">
              <a class="is-active" href="/news">Semua</a>
              ${categoryLabels.map(c=>`<a href="/news?category=${encodeURIComponent(c)}">${esc(c)}</a>`).join('')}
            </nav>
            <label class="news-sort"><span class="sr-only">Urutkan berita</span><select aria-label="Urutkan berita"><option>Terbaru</option><option>Terpopuler</option><option>A-Z</option></select>${iconMarkup('chevron-down')}</label>
          </div>
          <div class="news-archive-list">
            ${posts.length?posts.map(p=>renderCard(p,false)).join(''):`<div class="empty-state"><p>Belum ada berita untuk ditampilkan.</p></div>`}
          </div>
        </div>
        <aside class="news-list-sidebar">
          <section class="news-side-card news-search-card">
            <h2>Cari Berita</h2>
            <form class="news-sidebar-search" role="search" onsubmit="return false"><label class="sr-only" for="playground-news-search">Cari berita</label><input id="playground-news-search" name="search" placeholder="Cari berita..."><button type="submit" aria-label="Cari berita">${iconMarkup('search')}</button></form>
          </section>
          <section class="news-side-card">
            <h2>Kategori Berita</h2>
            <div class="news-category-list">
              ${categoryLabels.map(category=>`<a href="/news?category=${encodeURIComponent(category)}"><span>${esc(category)}</span><b>${countMap.get(category)||0}</b></a>`).join('')}
              <a href="/news"><span>Semua Kategori</span><span class="category-more-icon">${iconMarkup('arrow-right')}</span></a>
            </div>
          </section>
          ${popular.length?`<section class="news-side-card"><h2>Berita Populer</h2><div class="popular-news-list">${popular.map((p,i)=>`<a href="/news/${encodeURIComponent(p.slug||'')}"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${esc(p.title||'Berita sekolah')}</strong><small>${esc(p.published_at||p.created_at||'')}</small></span></a>`).join('')}<a class="side-card-more" href="/news">Lihat semua berita populer ${iconMarkup('arrow-right')}</a></div></section>`:''}
          <section class="news-newsletter-card"><h2>Dapatkan Informasi Terbaru</h2><p>Berlangganan newsletter kami untuk mendapatkan update berita dan kegiatan terbaru.</p><form class="news-newsletter-form" onsubmit="return false"><input type="email" placeholder="Masukkan email Anda" aria-label="Email untuk newsletter"><button type="submit" aria-label="Berlangganan">${iconMarkup('arrow-right')}</button></form><div class="news-newsletter-art" aria-hidden="true">${iconMarkup('mail')}</div></section>
        </aside>
      </div>
    </section>`;
}

function renderCard(post,featured=false){
  const href=`/news/${encodeURIComponent(post.slug||'contoh-berita')}`;
  const date=post.published_at||post.created_at||'Informasi terbaru';
  const excerpt=post.excerpt||post.description||'';
  const views=post.view_count!=null?Number(post.view_count):null;
  return `<article class="news-card${featured?' news-card-featured':''}">
    ${post.image?`<a class="news-card-media" href="${href}" aria-label="Baca ${esc(post.title||'berita')}">${image(post,post.title||'Berita sekolah')}${post.category?`<span class="news-card-category">${esc(post.category)}</span>`:''}</a>`:''}
    <div class="news-card-body">
      <div class="news-card-date">${iconMarkup('calendar-days')}<time datetime="${esc(date)}">${esc(date)}</time></div>
      <h2><a href="${href}">${esc(post.title||'Berita sekolah')}</a></h2>
      ${excerpt?`<p>${esc(excerpt)}</p>`:''}
      <div class="news-card-footer">
        <div class="news-card-meta" aria-label="Metadata berita">
          ${post.author?`<span>${iconMarkup('user')}${esc(post.author)}</span>`:''}
          ${views!=null?`<span>${iconMarkup('eye')}${esc(views.toLocaleString('id-ID'))} kali dibaca</span>`:''}
        </div>
        <a class="text-link" href="${href}">Baca selengkapnya ${iconMarkup('arrow-right')}</a>
      </div>
    </div>
  </article>`;
}

export function renderArticle(state,slug,container){
  const posts=Array.isArray(state.news)?state.news:[];
  const post=posts.find(x=>x.slug===slug)||posts[0];
  if(!post){
    container.innerHTML=pageHeader('Berita','Berita tidak ditemukan','Halaman yang Anda cari belum tersedia.',state.about?.hero_image||state.about?.image||'')+`<section class="section"><div class="theme-container empty-state"><p>Berita yang diminta tidak tersedia.</p><a class="button" href="/news">Kembali ke berita</a></div></section>`;
    return null;
  }
  const idx=posts.indexOf(post);
  const related=posts.filter(x=>x!==post).slice(0,3);
  const categories=[...new Set(posts.map(x=>String(x.category||'').split(',')[0].trim()).filter(Boolean))].map(name=>({name,count:posts.filter(x=>String(x.category||'').split(',')[0].trim()===name).length}));
  const tagSet=new Set();
  posts.forEach(x=>String(x.category||'').split(',').map(t=>t.trim()).filter(Boolean).forEach(t=>tagSet.add(t)));
  const tags=[...tagSet];
  const archiveMap=new Map();
  posts.forEach(x=>{const raw=x.published_at||x.created_at||'';const key=String(raw).slice(0,7);if(!key)return;archiveMap.set(key,(archiveMap.get(key)||0)+1);});
  const monthNames=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const archive=[...archiveMap.entries()].sort((a,b)=>b[0].localeCompare(a[0])).map(([key,count])=>{const [year,month]=key.split('-');return {month:key,label:`${monthNames[Number(month)-1]||month} ${year}`,count};});
  const commentsBySlug=Array.isArray(state.comments)?state.comments.filter(x=>!x.news_slug||x.news_slug===post.slug):[];
  const comments=commentsBySlug;
  const date=post.published_at||post.created_at||'';
  const wordCount=String(post.content||post.body||post.excerpt||'').replace(/<[^>]+>/g,' ').trim().split(/\s+/).filter(Boolean).length;
  const readMinutes=Math.max(1,Math.ceil(wordCount/200));
  const hero=state.about?.hero_image||state.about?.image||'';
  const title=post.title||'Berita sekolah';
  const shareUrl=window.location.href;
  const shareTitle=title;
  const meta=[
    date?`<span>${iconMarkup('calendar-days')}<time datetime="${esc(date)}">${esc(date)}</time></span>`:'',
    post.author?`<span>${iconMarkup('user-round')}${esc(post.author)}</span>`:'',
    post.view_count!=null?`<span>${iconMarkup('eye')}${Number(post.view_count).toLocaleString('id-ID')} kali dibaca</span>`:'',
    `<span>${iconMarkup('clock-3')}${readMinutes} menit baca</span>`
  ].join('');
  const prev=idx>0?posts[idx-1]:null;
  const next=idx>=0&&idx<posts.length-1?posts[idx+1]:null;
  const relatedHtml=related.length?`<section class="article-related"><div class="article-section-heading"><p class="eyebrow">Bacaan berikutnya</p><h2>Berita terkait.</h2></div><div class="article-related-grid">${related.map(item=>`<a class="article-related-card" href="/news/${encodeURIComponent(item.slug||'')}"><div class="article-related-media">${item.image?image(item,item.title||'Berita sekolah'):`<div class="article-related-placeholder">${iconMarkup('newspaper')}</div>`}</div><div class="article-related-body"><span>${esc(String(item.category||'Berita').split(',')[0].trim())}</span><strong>${esc(item.title||'')}</strong><small>${esc(item.published_at||item.created_at||'')}</small></div></a>`).join('')}</div></section>`:'';
  const commentsHtml=`<section class="comments-section" id="komentar"><div class="article-section-heading"><p class="eyebrow">Ruang diskusi</p><h2>Komentar.</h2><p class="comments-intro">Bagikan tanggapan Anda. Komentar akan tampil setelah disetujui oleh pengelola sekolah.</p></div><form class="comment-form" data-playground-comment-form onsubmit="return false;"><div class="comment-form-grid"><label><span>Nama</span><input type="text" name="name" required minlength="3" maxlength="100" autocomplete="name" placeholder="Nama Anda"></label><label><span>Email</span><input type="email" name="email" required autocomplete="email" placeholder="email@contoh.com"></label></div><label><span>Komentar</span><textarea name="message" rows="5" required minlength="10" placeholder="Tulis tanggapan Anda…"></textarea></label><div class="comment-form-footer"><p>Komentar demo di playground. Pada CMS, form ini menggunakan endpoint komentar native Sekolahku.</p><button class="button" type="submit">Kirim Komentar ${iconMarkup('arrow-right')}</button></div></form><div class="comment-list" aria-label="Contoh komentar yang telah disetujui">${comments.map(c=>`<article class="comment-card"><div class="comment-avatar" aria-hidden="true">${esc(String(c.name||'W').trim().charAt(0).toUpperCase())}</div><div class="comment-card-body"><div class="comment-card-head"><strong>${esc(c.name||'Warga sekolah')}</strong><time datetime="${esc(c.created_at||'')}">${esc(c.created_at||'')}</time></div><p>${esc(c.comment||c.message||'')}</p></div></article>`).join('')}</div></section>`;
  const sidebar=`<aside class="article-sidebar"><section class="share-card"><h2>Bagikan Artikel</h2><div class="share-actions"><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Bagikan ke Facebook">${iconMarkup('facebook')}<span>Facebook</span></a><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}" target="_blank" rel="noopener" aria-label="Bagikan ke X">${iconMarkup('twitter')}<span>X (Twitter)</span></a><a href="https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}" target="_blank" rel="noopener" aria-label="Bagikan ke WhatsApp">${iconMarkup('message-circle')}<span>WhatsApp</span></a><button type="button" data-copy-link aria-label="Salin tautan">${iconMarkup('link-2')}<span>Salin Tautan</span></button></div></section>${related.length?`<section class="sidebar-card"><h2>Berita Terkait</h2><div class="sidebar-related-list">${related.map(item=>`<a href="/news/${encodeURIComponent(item.slug||'')}">${item.image?image(item,''):`<span class="sidebar-related-placeholder">${iconMarkup('newspaper')}</span>`}<span><strong>${esc(item.title||'')}</strong><small>${esc(item.published_at||item.created_at||'')}</small></span></a>`).join('')}</div></section>`:''}${categories.length?`<section class="sidebar-card"><h2>Kategori Berita</h2><div class="sidebar-category-list">${categories.map(cat=>`<a href="/news?category=${encodeURIComponent(cat.name)}"><span>${esc(cat.name)}</span><b>${cat.count}</b></a>`).join('')}</div><a class="sidebar-more" href="/news">Lihat semua kategori ${iconMarkup('arrow-right')}</a></section>`:''}${tags.length?`<section class="sidebar-card"><h2>Topik Populer</h2><div class="article-sidebar-tags">${tags.slice(0,12).map(tag=>`<a href="/news?search=${encodeURIComponent(tag)}">${esc(tag)}</a>`).join('')}</div></section>`:''}${archive.length?`<section class="sidebar-card"><h2>Arsip Berita</h2><div class="article-archive-list">${archive.slice(0,8).map(entry=>`<a href="/news?month=${encodeURIComponent(entry.month)}"><span>${esc(entry.label)}</span><b>${entry.count}</b></a>`).join('')}</div></section>`:''}<section class="article-newsletter"><p class="eyebrow eyebrow-dark">Tetap terhubung</p><h2>Dapatkan Informasi Terbaru</h2><p>Ikuti berita dan kegiatan terbaru sekolah melalui halaman berita kami.</p><a class="button button-light" href="/news">Lihat berita terbaru ${iconMarkup('arrow-right')}</a><div class="article-newsletter-art" aria-hidden="true">${iconMarkup('mail-open')}</div></section></aside>`;
  container.innerHTML=pageHeader('Detail','Berita','Informasi terbaru seputar kegiatan, prestasi, dan program di sekolah.',hero)+`<section class="section article-detail-section"><div class="theme-container article-detail-layout"><article class="article-main"><header class="article-header"><span class="article-category">${esc(String(post.category||'Berita').split(',')[0].trim())}</span><h1>${esc(title)}</h1><div class="article-meta" aria-label="Metadata artikel">${meta}</div></header>${post.image?`<figure class="article-cover">${image(post,title)}</figure>`:''}<div class="article-prose">${post.content||post.body||`<p>${esc(post.excerpt||post.description||'')}</p>`}</div>${post.category?`<div class="article-tags"><strong>Tag:</strong>${String(post.category).split(',').map(x=>x.trim()).filter(Boolean).map(tag=>`<a href="/news?category=${encodeURIComponent(tag)}">${esc(tag)}</a>`).join('')}</div>`:''}<nav class="article-nav" aria-label="Navigasi artikel">${prev?`<a class="article-nav-card" href="/news/${encodeURIComponent(prev.slug||'')}"><span>${iconMarkup('arrow-left')}Artikel sebelumnya</span><strong>${esc(prev.title||'')}</strong></a>`:'<span></span>'}${next?`<a class="article-nav-card article-nav-next" href="/news/${encodeURIComponent(next.slug||'')}"><span>Artikel selanjutnya ${iconMarkup('arrow-right')}</span><strong>${esc(next.title||'')}</strong></a>`:'<span></span>'}</nav>${relatedHtml}${commentsHtml}</article>${sidebar}</div></section>`;
  return post.slug;
}

export function renderDownloads(state,container){const items=state.downloads||[];const cats=[...new Set(items.map(x=>x.category).filter(Boolean))];container.innerHTML=pageHeader('Pusat dokumen','Dokumen resmi','Formulir, panduan, dan dokumen resmi sekolah dalam satu tempat.',state.about?.image||'')+`<section class="section"><div class="theme-container"><div class="download-stat-grid"><div class="download-stat"><strong>${items.length}</strong><span>Total dokumen</span></div><div class="download-stat"><strong>${cats.length}</strong><span>Kategori</span></div><div class="download-stat"><strong>${items.filter(x=>String(x.type||x.extension||'PDF').toUpperCase()==='PDF').length}</strong><span>Dokumen PDF</span></div><div class="download-stat"><strong>—</strong><span>Dokumen populer</span></div></div><div class="downloads-toolbar"><input placeholder="Cari dokumen…" aria-label="Cari dokumen"><select aria-label="Urutkan"><option>Terbaru</option><option>Nama A-Z</option></select></div><div class="download-layout"><div>${cats.map(cat=>`<section class="document-group"><div class="document-group-heading"><div><p class="eyebrow">Koleksi</p><h2>${esc(cat)}</h2></div><span>${items.filter(x=>x.category===cat).length} berkas</span></div>${items.filter(x=>x.category===cat).map(x=>`<a class="document-row" href="${esc(x.url||'#')}"><span class="document-type">${esc(x.type||x.extension||'PDF')}</span><span class="document-main"><strong>${esc(x.title||'Dokumen')}</strong><small>${esc(x.description||'Dokumen resmi sekolah')} · ${esc(x.file_size||x.size||'')}</small></span><span class="document-meta">↗</span></a>`).join('')}</section>`).join('')||`<div class="empty-state"><p>Belum ada dokumen yang tersedia.</p></div>`}</div><aside class="download-sidebar"><h2>Kategori</h2>${cats.map(c=>`<a href="#">${esc(c)}<span>${items.filter(x=>x.category===c).length}</span></a>`).join('')}<a href="/contact">Butuh bantuan?</a></aside></div></div></section>`;}
export function renderContact(state,container){container.innerHTML=pageHeader('Hubungi sekolah','Kontak sekolah','Temukan alamat, kanal resmi, dan formulir untuk menghubungi sekolah.',state.about?.image||'')+`<section class="section"><div class="theme-container"><div class="contact-summary"><div class="contact-summary-item"><span class="icon">${iconMarkup('map-pin')}</span><strong>Alamat</strong><small>${esc(state.contact_address||'—')}</small></div><div class="contact-summary-item"><span class="icon">${iconMarkup('phone')}</span><strong>Telepon</strong><small>${esc(state.contact_phone||'—')}</small></div><div class="contact-summary-item"><span class="icon">${iconMarkup('mail')}</span><strong>Email</strong><small>${esc(state.contact_email||'—')}</small></div><div class="contact-summary-item"><span class="icon">${iconMarkup('clock-3')}</span><strong>Jam layanan</strong><small>${esc(state.contact_hours||'—')}</small></div></div><div class="contact-main-grid"><div class="contact-info-panel"><p class="eyebrow">Informasi sekolah</p><h2>Hubungi kanal resmi kami.</h2><p>${esc(state.site_description||'Kami siap membantu memberikan informasi yang Anda perlukan.')}</p><div class="contact-help"><div class="help-card"><strong>WhatsApp / Telepon</strong><span>${esc(state.contact_phone||'—')}</span></div><div class="help-card"><strong>Email</strong><span>${esc(state.contact_email||'—')}</span></div></div></div><div><p class="eyebrow">Kirim pesan</p><h2 class="display-title">Sampaikan kebutuhan Anda.</h2><form class="form-grid" action="${esc(state.urls?.contact_send||'/contact/send')}" method="post"><div class="form-field"><label for="contact-name">Nama</label><input id="contact-name" name="name" required></div><div class="form-field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" required></div><div class="form-field form-full"><label for="contact-subject">Subjek</label><input id="contact-subject" name="subject" required></div><div class="form-field form-full"><label for="contact-message">Pesan</label><textarea id="contact-message" name="message" required></textarea></div><button class="button" type="submit">Kirim pesan</button></form></div></div></div></section>`;}
