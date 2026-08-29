import { initIcons } from './icons.js';
import { initArticleActions } from './article.js';
import { getState } from './state.js';
import renderHome from './views/home.js';
import renderSection from './views/section.js';
import {
    renderArticle,
    renderContact,
    renderDownloads,
    renderFooter,
    renderNews,
    renderStaticPage,
} from './views/native.js';

const sectionRoutes = new Set([
    'profile',
    'programs',
    'extracurriculars',
    'teachers',
    'achievements',
    'testimonials',
    'events',
    'gallery',
    'faq',
    'contact',
]);

let initialLoad = true;

export function initRouter() {
    window.addEventListener('hashchange', renderCurrentRoute);
    window.addEventListener('popstate', renderCurrentRoute);
    document.addEventListener('click', handleNativeNavigation);
    renderCurrentRoute();
    initialLoad = false;
}

function renderCurrentRoute() {
    renderCurrentRouteNow();
}

function renderCurrentRouteNow() {
    const shell = document.querySelector('[data-spa-content]');
    if (!shell) return;

    shell.classList.remove('spa-changing');
    void shell.offsetWidth;

    const path = normalizePath(window.location.pathname);
    if (path === '/news') {
        renderNews(getState(), shell);
        renderFooter(getState());
        updateDocumentMeta(getState(), 'news');
        initIcons(shell);
        finishNativeNavigation();
        return;
    }
    if (path.startsWith('/news/')) {
        const slug = decodeURIComponent(path.slice('/news/'.length));
        renderArticle(getState(), slug, shell);
        renderFooter(getState());
        initIcons(shell);
        initArticleActions();
        updateDocumentMeta(getState(), 'article', slug);
        finishNativeNavigation();
        return;
    }
    if (path === '/downloads') {
        renderDownloads(getState(), shell);
        renderFooter(getState());
        initIcons(shell);
        updateDocumentMeta(getState(), 'downloads');
        finishNativeNavigation();
        return;
    }
    if (path === '/contact') {
        renderContact(getState(), shell);
        renderFooter(getState());
        initIcons(shell);
        updateDocumentMeta(getState(), 'contact');
        finishNativeNavigation();
        return;
    }
    if (path.startsWith('/pages/')) {
        const slug = decodeURIComponent(path.slice('/pages/'.length));
        renderStaticPage(getState(), slug, shell);
        renderFooter(getState());
        initIcons(shell);
        updateDocumentMeta(getState(), 'page', slug);
        finishNativeNavigation();
        return;
    }

    const route = normalizeRoute(window.location.hash);
    if (!route) {
        renderHome(getState(), shell);
        renderFooter(getState());
        updateDocumentMeta(getState(), 'home');
        setRouteState('home');
        if (!initialLoad) finishNativeNavigation();
        return;
    }

    if (!sectionRoutes.has(route)) {
        history.replaceState({}, '', '/');
        renderHome(getState(), shell);
        renderFooter(getState());
        updateDocumentMeta(getState(), 'home');
        setRouteState('home');
        return;
    }

    renderSection(route, getState(), shell);
    initIcons(shell);
    updateDocumentMeta(getState(), route);
    setRouteState(route);
    document.querySelector('[data-spa-content]')?.classList.add('spa-changing');
    focusMain();
    scrollTop();
}

function normalizePath(pathname) {
    const path = pathname.replace(/\\/g, '/').replace(/\/$/, '') || '/';
    return path.toLowerCase();
}

function handleNativeNavigation(event) {
    const link = event.target.closest('a[href]');
    if (
        !link ||
        link.target ||
        link.hasAttribute('download') ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    )
        return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const path = normalizePath(url.pathname);
    const native =
        path === '/news' ||
        path.startsWith('/news/') ||
        path === '/downloads' ||
        path === '/contact' ||
        path.startsWith('/pages/');
    if (!native) return;
    event.preventDefault();
    history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    renderCurrentRoute();
}

function finishNativeNavigation() {
    document.querySelector('[data-spa-content]')?.classList.add('spa-changing');
    setRouteState('');
    focusMain();
    scrollTop();
}

function normalizeRoute(hash) {
    return decodeURIComponent(
        hash.replace(/^#/, '').trim().replace(/^\//, '').toLowerCase(),
    );
}

function setRouteState(route) {
    document.documentElement.dataset.spaRoute = route || '';
    document.querySelectorAll('[data-spa-link]').forEach((link) => {
        const href = (link.getAttribute('href') || '')
            .replace(/^#/, '')
            .replace(/^\//, '')
            .toLowerCase();
        if (href === route) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function updateDocumentMeta(state, route, slug = '') {
    const siteName = state.site_name || 'SekolahKu';
    const titles = {
        profile: 'Profil Sekolah',
        programs: 'Program Akademik',
        extracurriculars: 'Kegiatan Siswa',
        teachers: 'Tenaga Pendidik',
        achievements: 'Prestasi',
        testimonials: 'Cerita Komunitas',
        events: 'Agenda Sekolah',
        gallery: 'Galeri',
        faq: 'Pertanyaan Umum',
        contact: 'Hubungi Sekolah',
        news: 'Berita Sekolah',
        downloads: 'Dokumen Resmi',
        article: 'Berita Sekolah',
        page: 'Halaman Informasi',
    };
    const post =
        route === 'article'
            ? (state.news || []).find((item) => item.slug === slug)
            : null;
    const page =
        route === 'page'
            ? (state.pages || []).find((item) => item.slug === slug)
            : null;
    document.title =
        route === 'home'
            ? siteName
            : `${post?.title || page?.meta_title || page?.title || titles[route] || 'Informasi'} — ${siteName}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
        meta.setAttribute(
            'content',
            post?.excerpt ||
                page?.meta_description ||
                page?.excerpt ||
                state.site_description ||
                '',
        );
}

function focusMain() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
}

function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'auto' });
}

function reduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
