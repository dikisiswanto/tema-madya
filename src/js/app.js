import '../css/app.css';
import { initState, getState } from './state.js';
import { initNavigation } from './navigation.js';
import { initRouter } from './router.js';
import { initArticleActions } from './article.js';
import { initIcons } from './icons.js';
import { hydratePlaygroundNavigation } from './playground-navigation.js';
import { iconMarkup } from './icons.js';

window.addEventListener('DOMContentLoaded', async () => {
    await initState();
    hydratePlaygroundShell();
    hydratePlaygroundNavigation();
    initNavigation();
    initRouter();
    initArticleActions();
    initIcons();
    initSearchDialog();
    initGalleryLightbox();
    initRichFilters();
    initNewsInteractions();
});

function hydratePlaygroundShell() {
    const source = document.querySelector('[data-demo-source]');
    if (!source) return;
    const state = getState();
    const setText = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = value || '';
    };
    const setLink = (selector, href, text) => {
        const el = document.querySelector(selector);
        if (!el) return;
        el.href = href || '#';
        if (text !== undefined) el.textContent = text;
    };
    setText('[data-demo-site-name]', state.site_logo_text || state.site_name);
    setText('[data-demo-tagline]', state.site_tagline);
    setText(
        '[data-demo-mobile-intro]',
        state.site_description ||
            'Temukan informasi sekolah berdasarkan kebutuhan Anda.',
    );
    setText('[data-demo-address]', state.contact_address);
    const phone = document.querySelector('[data-demo-phone]');
    if (phone) {
        phone.href = `tel:${state.contact_phone || ''}`;
        phone.textContent = state.contact_phone || '';
    }
    const email = document.querySelector('[data-demo-email]');
    if (email) {
        email.href = `mailto:${state.contact_email || ''}`;
        email.textContent = state.contact_email || '';
    }
    const logo = document.querySelector('[data-demo-logo-icon]');
    if (logo)
        logo.innerHTML = iconMarkup(
            state.site_logo_icon || 'graduation-cap',
            'brand-icon',
        );
    setLink('[data-demo-spmb]', state.spmb_url, 'SPMB Online');
    setLink('[data-demo-spmb-header]', state.spmb_url, 'SPMB Online');
    setLink('[data-demo-social-facebook]', state.social_facebook, 'f');
    setLink('[data-demo-social-instagram]', state.social_instagram, '◎');
}

function initSearchDialog() {
    const dialog = document.querySelector('[data-search-dialog]');
    if (!dialog || dialog.dataset.bound === 'true') return;
    dialog.dataset.bound = 'true';
    const input = dialog.querySelector('#site-search-input');
    const open = () => {
        dialog.hidden = false;
        dialog.setAttribute('aria-hidden', 'false');
        document.body.classList.add('search-dialog-open');
        requestAnimationFrame(() => dialog.classList.add('is-open'));
        input?.focus();
    };
    const close = () => {
        dialog.classList.remove('is-open');
        dialog.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('search-dialog-open');
        window.setTimeout(() => {
            if (!dialog.classList.contains('is-open')) dialog.hidden = true;
        }, 180);
    };
    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-search-open]')) {
            event.preventDefault();
            open();
        } else if (event.target.closest('[data-search-close]')) close();
    });
    dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
        }
    });
}

function initGalleryLightbox() {
    const root = document.querySelector('[data-spa-content]') || document;
    if (root.dataset.galleryBound === 'true') return;
    root.dataset.galleryBound = 'true';
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-gallery-open]');
        if (trigger) {
            const lightbox = document.querySelector('[data-gallery-lightbox]');
            const image = lightbox?.querySelector(
                '[data-gallery-lightbox-image]',
            );
            const caption = lightbox?.querySelector(
                '[data-gallery-lightbox-caption]',
            );
            if (!lightbox || !image) return;
            image.src = trigger.dataset.gallerySrc || '';
            image.alt = trigger.dataset.galleryAlt || 'Dokumentasi sekolah';
            if (caption) caption.textContent = trigger.dataset.galleryAlt || '';
            lightbox.hidden = false;
            lightbox.setAttribute('aria-hidden', 'false');
            requestAnimationFrame(() => lightbox.classList.add('is-open'));
            document.body.classList.add('gallery-lightbox-open');
        }
        if (event.target.closest('[data-gallery-close]'))
            closeGalleryLightbox();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeGalleryLightbox();
    });
}

function closeGalleryLightbox() {
    const lightbox = document.querySelector('[data-gallery-lightbox]');
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-lightbox-open');
    window.setTimeout(() => {
        if (!lightbox.classList.contains('is-open')) lightbox.hidden = true;
    }, 180);
}

function initRichFilters() {
    const root = document.querySelector('[data-spa-content]');
    if (!root || root.dataset.richFiltersBound === 'true') return;
    root.dataset.richFiltersBound = 'true';
    root.addEventListener('click', (event) => {
        const button = event.target.closest(
            '[data-filter-toolbar] [data-filter-value]',
        );
        if (!button) return;
        const toolbar = button.closest('[data-filter-toolbar]');
        const group = toolbar?.dataset.filterToolbar;
        if (!group) return;
        toolbar.querySelectorAll('[data-filter-value]').forEach((item) => {
            item.classList.toggle('is-active', item === button);
        });
        applyRichFilter(root, group, button.dataset.filterValue || '', toolbar);
    });
    root.addEventListener('change', (event) => {
        const select = event.target.closest(
            '[data-filter-year], [data-filter-month-select]',
        );
        if (!select) return;
        const toolbar = select.closest('[data-filter-toolbar]');
        const group = toolbar?.dataset.filterToolbar;
        if (group)
            applyRichFilter(
                root,
                group,
                toolbar.querySelector('.rich-filters .is-active')?.dataset
                    .filterValue || '',
                toolbar,
            );
    });
    applyAllRichFilters(root);
}

function applyAllRichFilters(root) {
    root.querySelectorAll('[data-filter-toolbar]').forEach((toolbar) => {
        const group = toolbar.dataset.filterToolbar;
        if (group)
            applyRichFilter(
                root,
                group,
                toolbar.querySelector('.rich-filters .is-active')?.dataset
                    .filterValue || '',
                toolbar,
            );
    });
}

function applyRichFilter(root, group, value, toolbar) {
    const items = root.querySelectorAll(
        `[data-filter-item][data-filter-group="${CSS.escape(group)}"]`,
    );
    const year = toolbar?.querySelector('[data-filter-year]')?.value || '';
    const month =
        toolbar?.querySelector('[data-filter-month-select]')?.value || '';
    items.forEach((item) => {
        const matchValue = !value || item.dataset.filterValue === value;
        const matchYear = !year || item.dataset.filterYear === year;
        const matchMonth = !month || item.dataset.filterMonth === month;
        item.hidden = !(matchValue && matchYear && matchMonth);
    });
}

function initNewsInteractions() {
    const root = document.querySelector('[data-spa-content]');
    if (!root || root.dataset.newsInteractionsBound === 'true') return;
    root.dataset.newsInteractionsBound = 'true';
    root.addEventListener('click', (event) => {
        const categoryLink = event.target.closest('[data-news-category]');
        if (!categoryLink) return;
        event.preventDefault();
        const url = new URL(categoryLink.href, window.location.href);
        history.pushState({}, '', `${url.pathname}${url.search}`);
        renderNews(getState(), root);
        initIcons(root);
        root.querySelectorAll('[data-news-category]').forEach((item) => {
            item.classList.toggle(
                'is-active',
                item === categoryLink ||
                    item.getAttribute('data-news-category') ===
                        url.searchParams.get('category'),
            );
        });
        window.scrollTo({ top: 0, behavior: 'auto' });
    });
    root.addEventListener('change', (event) => {
        const select = event.target.closest('[data-news-sort]');
        if (!select) return;
        const list = root.querySelector('[data-news-list]');
        if (!list) return;
        const cards = [...list.children].filter((item) =>
            item.matches('article, .news-card, .collection-card'),
        );
        cards.sort((a, b) => {
            if (select.value === 'az')
                return (
                    a.dataset.newsTitle ||
                    a.textContent ||
                    ''
                ).localeCompare(
                    b.dataset.newsTitle || b.textContent || '',
                    'id',
                );
            if (select.value === 'popular')
                return (
                    Number(b.dataset.newsViews || 0) -
                    Number(a.dataset.newsViews || 0)
                );
            return (
                Number(b.dataset.newsTimestamp || 0) -
                Number(a.dataset.newsTimestamp || 0)
            );
        });
        cards.forEach((card) => {
            list.appendChild(card);
        });
    });
}
