import { iconMarkup } from "../icons.js";

export default function renderHome(state, container) {
  const programs = state.programs || [];
  const teachers = state.teachers || [];
  const achievements = state.achievements || [];
  const news = state.news || [];
  const events = state.events || [];
  const galleries = state.galleries || [];
  const testimonials = state.testimonials || [];
  const principal = state.principal || teachers[0] || {};
  const about = state.about || {};
  const downloads = state.downloads || [];
  const extras = state.extracurriculars || [];
  const services = [
    [
      "user-plus",
      "PPDB / SPMB",
      "Informasi pendaftaran siswa baru",
      state.spmb_url || "#",
    ],
    [
      "clipboard-text",
      "Akademik",
      "Kurikulum & kegiatan pembelajaran",
      "#programs",
    ],
    ["award", "Prestasi", "Daftar capaian & penghargaan", "#achievements"],
    [
      "atom-2",
      "Ekstrakurikuler",
      "Pengembangan minat dan bakat siswa",
      "#extracurriculars",
    ],
    ["photo", "Galeri", "Dokumentasi kegiatan sekolah", "#gallery"],
    ["download", "Unduhan", "Dokumen & formulir penting", "/downloads"],
  ];
  const statIcons = ["users", "graduation-cap", "book-open", "trophy"];
  const imageOr = (src, alt, fallback, item = {}) =>
    `<img src="${esc(src || fallback)}" width="${esc(item.image_width || item.width || 900)}" height="${esc(item.image_height || item.height || 600)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  const date = (value) =>
    value
      ? new Date(value).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";
  const month = (value) =>
    value
      ? new Date(value)
          .toLocaleDateString("id-ID", { month: "short" })
          .toUpperCase()
      : "";
  const heroTitle = esc(
    state.hero_title ||
      "Membentuk Generasi Berilmu, Berakhlak, dan Berprestasi.",
  ).replace(
    /(Berprestasi\.?)(\s*)$/u,
    '<span class="hero-title-accent">$1</span>$2',
  );
  const generated = (name) => `/themes/madya/assets/generated/${name}`;
  const programFallbacks = [
    "program-science.jpg",
    "program-language.jpg",
    "program-students.jpg",
  ];
  const extraFallbacks = [
    "extra-sports.jpg",
    "extra-culture.jpg",
    "extra-student.jpg",
  ];
  const teacherFallbacks = [
    "teacher-1.jpg",
    "teacher-2.jpg",
    "teacher-3.jpg",
    "teacher-4.jpg",
  ];
  const galleryFallbacks = [
    "gallery-students.jpg",
    "gallery-class.jpg",
    "gallery-library.jpg",
    "gallery-lab.jpg",
  ];
  const newsFallbacks = [
    "news-campus.jpg",
    "gallery-event.jpg",
    "gallery-students.jpg",
    "gallery-computer.jpg",
  ];

  container.innerHTML = `<div class="home-page">
    <section class="home-hero" aria-labelledby="hero-title" aria-label="Hero ${esc(state.site_name || "sekolah")}" style="--hero-bg-image:url('${esc(about.hero_image || about.image || generated("hero-campus.jpg"))}')"><div class="theme-container home-hero-grid"><div class="home-hero-copy"><h1 id="hero-title">${heroTitle}</h1><p class="hero-lead">${esc(state.hero_subtitle || state.site_description || state.site_tagline || "")}</p><div class="home-hero-actions"><a class="button" href="#profile">Tentang Kami ${iconMarkup("arrow-right")}</a><a class="button button-secondary" href="#programs">Program Unggulan ${iconMarkup("arrow-right")}</a></div></div></div></section>
    <section class="home-quick-services" aria-label="Layanan cepat"><div class="theme-container quick-service-grid">${services.map(([i, l, d, u]) => `<a class="quick-service${u === "#" ? " is-disabled" : ""}" href="${esc(u)}"><span class="quick-service-icon">${iconMarkup(i)}</span><span><strong>${esc(l)}</strong><small>${esc(d)}</small></span></a>`).join("")}</div></section>
    ${
      state.counter_stats?.length
        ? `<section class="home-stat-section" aria-label="Statistik sekolah"><div class="theme-container"><div class="home-stat-grid">${state.counter_stats
            .slice(0, 4)
            .map(
              (x, i) =>
                `<div class="home-stat-item">${iconMarkup(statIcons[i] || "sparkles")}<div><strong>${esc(x.value || x.number || "")}</strong><span>${esc(x.label || x.title || "")}</span></div></div>`,
            )
            .join("")}</div></div></section>`
        : ""
    }
    <section class="home-section home-middle-section" id="profile" aria-label="Profil sekolah"><div class="theme-container home-middle-stack">
      <div class="home-middle-grid home-middle-grid-profile"><article class="principal-panel"><div class="principal-photo">${imageOr(principal.image || principal.image_url, principal.name || "Kepala sekolah", generated("principal.jpg"), principal)}</div><div class="principal-message"><p class="section-kicker">Sambutan Kepala Sekolah</p><blockquote>“${esc(principal.bio || "Membangun karakter, meraih masa depan bersama seluruh warga sekolah.")}”</blockquote>${principal.description ? `<p class="principal-description">${esc(principal.description)}</p>` : ""}<strong>${esc(principal.name || "Kepala Sekolah")}</strong><span>${esc(principal.title || principal.position || "Kepala Sekolah")}</span><div class="principal-facts">${[
        ["award", "Akreditasi", about.accreditation],
        ["book-open", "Kurikulum", about.curriculum],
        ["calendar-days", "Tahun Berdiri", about.established_year].filter(
          Boolean,
        ),
      ]
        .filter((x) => x[2])
        .map(
          (x) =>
            `<div>${iconMarkup(x[0])}<span><b>${esc(x[1])}</b>${esc(x[2])}</span></div>`,
        )
        .join(
          "",
        )}</div></div></article><article class="program-panel" id="programs"><div class="section-head-row compact"><div><p class="section-kicker">Program Unggulan</p><h2>Program Unggulan Kami</h2></div><a class="text-link" href="#programs">Lihat Semua ${iconMarkup("arrow-right")}</a></div>${
        programs.length
          ? `<div class="program-showcase-grid">${programs
              .slice(0, 3)
              .map(
                (x, i) =>
                  `<article class="program-showcase-card"><div class="program-showcase-media">${imageOr(x.image || x.image_url, "", generated(programFallbacks[i % 3]), x)}</div><div class="program-showcase-body"><h3>${esc(x.title || x.name || "Program")}</h3><p>${esc(x.description || x.excerpt || "")}</p></div></article>`,
              )
              .join("")}</div>`
          : `<div class="empty-inline">Belum ada program unggulan.</div>`
      }${
        extras.length
          ? `<div class="extra-inline" id="extracurriculars"><div class="subsection-label"><span>Ekstrakurikuler</span><a href="#extracurriculars">Lihat Semua ${iconMarkup("arrow-right")}</a></div><div class="extra-inline-list">${extras
              .slice(0, 4)
              .map(
                (x, i) =>
                  `<a href="#extracurriculars">${imageOr(x.image || x.image_url, "", generated(extraFallbacks[i % 3]), x)}<span>${esc(x.title || x.name || "Kegiatan")}</span></a>`,
              )
              .join("")}</div></div>`
          : ""
      }</article></div>
      <div class="home-middle-grid home-middle-grid-people" id="teachers">${
        teachers.length
          ? `<article class="middle-panel"><div class="section-head-row compact"><div><p class="section-kicker">Guru Berprestasi</p><h2>Tenaga pengajar pilihan.</h2></div><a class="text-link" href="#teachers">Lihat Semua ${iconMarkup("arrow-right")}</a></div><div class="teacher-grid">${teachers
              .slice(0, 4)
              .map(
                (x, i) =>
                  `<article class="teacher-card">${imageOr(x.image || x.image_url, x.name || "Tenaga pendidik", generated(teacherFallbacks[i % 4]), x)}<div><strong>${esc(x.name || "Tenaga pendidik")}</strong><span>${esc(x.title || x.position || "Tenaga pendidik")}</span></div></article>`,
              )
              .join("")}</div></article>`
          : ""
      }${
        achievements.length
          ? `<article class="middle-panel" id="achievements"><div class="section-head-row compact"><div><p class="section-kicker">Prestasi Terbaru</p><h2>Mengukir prestasi di berbagai bidang.</h2></div><a class="text-link" href="#achievements">Lihat Semua ${iconMarkup("arrow-right")}</a></div><div class="achievement-list">${achievements
              .slice(0, 3)
              .map(
                (x) =>
                  `<article class="achievement-list-row"><span class="achievement-list-icon">${iconMarkup("trophy")}</span><div><strong>${esc(x.title || "Prestasi siswa")}</strong><small>${esc(x.description || "")}</small></div><time>${esc(x.year || "")}</time></article>`,
              )
              .join("")}</div></article>`
          : ""
      }</div>
      <div class="home-middle-grid home-middle-grid-updates" id="updates">${
        news.length
          ? `<article class="middle-panel"><div class="section-head-row compact"><div><p class="section-kicker">Berita Terbaru</p><h2>Informasi terkini seputar kegiatan sekolah.</h2></div><a class="text-link" href="/news">Lihat Semua ${iconMarkup("arrow-right")}</a></div><div class="news-home-row">${news[0] ? `<a class="featured-news-home" href="/news/${encodeURIComponent(news[0].slug || "")}">${imageOr(news[0].image, "", generated(newsFallbacks[0]), news[0])}<div><span>${esc(news[0].category || "Berita")}</span><h3>${esc(news[0].title || "Berita sekolah")}</h3><small>${esc(date(news[0].published_at))}</small></div></a>` : ""}<div class="news-home-side">${news
              .slice(1, 4)
              .map(
                (x) =>
                  `<a href="/news/${encodeURIComponent(x.slug || "")}">${imageOr(x.image, "", generated(newsFallbacks[1]), x)}<span><strong>${esc(x.title || "")}</strong><small>${esc(date(x.published_at))}</small></span></a>`,
              )
              .join("")}</div></div></article>`
          : ""
      }${
        events.length
          ? `<article class="middle-panel"><div class="section-head-row compact"><div><p class="section-kicker">Agenda Kegiatan</p><h2>Agenda penting sekolah.</h2></div><a class="text-link" href="#events">Lihat Semua ${iconMarkup("arrow-right")}</a></div><div class="agenda-list" id="events">${events
              .slice(0, 3)
              .map(
                (x) =>
                  `<article class="agenda-item"><time datetime="${esc(x.event_date || "")}"><b>${esc(x.event_date ? new Date(x.event_date).toLocaleDateString("id-ID", { day: "2-digit" }) : "—")}</b><span>${esc(month(x.event_date))}</span></time><div><h3>${esc(x.title || "Kegiatan sekolah")}</h3><p>${esc(x.time || "")}${x.location ? ` · ${esc(x.location)}` : ""}</p></div>${iconMarkup("chevron-right")}</article>`,
              )
              .join("")}</div></article>`
          : ""
      }</div>
      <div class="home-middle-grid home-middle-grid-community" id="gallery">${
        galleries.length
          ? `<article class="middle-panel"><div class="section-head-row compact"><div><p class="section-kicker">Galeri Kegiatan</p><h2>Momen terbaik kami.</h2></div><a class="text-link" href="#gallery">Lihat Semua ${iconMarkup("arrow-right")}</a></div><div class="gallery-home-grid gallery-home-grid-compact">${galleries
              .slice(0, 4)
              .map(
                (x, i) =>
                  `<a class="gallery-home-item gallery-home-item-${i}" href="#gallery">${imageOr(x.image, x.title || "Dokumentasi sekolah", generated(galleryFallbacks[i]), x)}</a>`,
              )
              .join("")}</div></article>`
          : ""
      }${
        testimonials.length
          ? `<article class="middle-panel"><div class="section-head-row compact"><div><p class="section-kicker">Testimoni</p><h2>Apa kata mereka tentang sekolah?</h2></div><a class="text-link" href="#testimonials">Lihat Semua ${iconMarkup("arrow-right")}</a></div><div class="testimonial-feature" id="testimonials">${(() => {
              const x = testimonials[0];
              return `<div class="testimonial-quote-mark">“</div><blockquote>${esc(x.quote || x.content || "")}</blockquote><div class="testimonial-person">${imageOr(x.image, "", generated("testimonial-1.jpg"), x)}<span><strong>${esc(x.name || x.author || "Warga sekolah")}</strong><small>${esc(x.role || "")}</small></span><span class="testimonial-stars">★★★★★</span></div>`;
            })()}</div></article>`
          : ""
      }</div>
    </div></section>
    <section class="home-section section-soft" id="documents"><div class="theme-container documents-spmb-grid"><div><div class="section-head-row compact"><div><p class="section-kicker">Dokumen & Unduhan</p><h2>Unduh dokumen penting sekolah.</h2></div><a class="text-link" href="/downloads">Lihat Semua ${iconMarkup("arrow-right")}</a></div><div class="document-home-list">${downloads
      .slice(0, 4)
      .map(
        (x) =>
          `<a href="${esc(x.url || "#")}" class="document-home-row"><span class="document-file-icon">${iconMarkup("file-text")}</span><span><strong>${esc(x.title || "Dokumen")}</strong><small>${esc(x.type || x.extension || "PDF")} · ${esc(x.file_size || x.size || "")}</small></span>${iconMarkup("arrow-up-right")}</a>`,
      )
      .join(
        "",
      )}</div></div><aside class="spmb-home-banner"><div><p class="section-kicker">SPMB 2025/2026</p><h2>SPMB 2025/2026 Dibuka!</h2><p>Bergabung bersama kami dan raih masa depan gemilang.</p><a class="button button-accent" href="${esc(state.spmb_url || "#")}">Daftar Sekarang ${iconMarkup("arrow-right")}</a></div>${imageOr(about.image, "", generated("spmb-students.jpg"), about)}</aside></div></section>
    <section class="home-contact-strip" id="contact" aria-label="Kontak sekolah"><div class="theme-container contact-strip-grid"><div>${iconMarkup("map-pin")}<span><b>Hubungi Kami</b><small>${esc(state.contact_address || "—")}</small></span></div><div>${iconMarkup("phone")}<span><b>Telepon</b><small>${esc(state.contact_phone || "—")}</small></span></div><div>${iconMarkup("mail")}<span><b>Email</b><small>${esc(state.contact_email || "—")}</small></span></div><div>${iconMarkup("clock-3")}<span><b>Jam Layanan</b><small>${esc(state.contact_hours || "—")}</small></span></div></div></section>
  </div>`;
}
function esc(value) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ],
  );
}
