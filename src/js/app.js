import '../css/app.css';
import { initState, getState } from './state.js';
import { initNavigation } from './navigation.js';
import { initRouter } from './router.js';
import { initArticleActions } from './article.js';
import { initIcons } from './icons.js';
import { hydratePlaygroundNavigation } from './playground-navigation.js';

window.addEventListener('DOMContentLoaded', async () => {
    await initState();
    hydratePlaygroundShell();
    hydratePlaygroundNavigation();
    initNavigation();
    initRouter();
    initArticleActions();
    initIcons();
});

function hydratePlaygroundShell() {
    const source = document.querySelector('[data-demo-source]');
    if (!source) return;
    const state = getState();
    const setText = (selector, value) => { const el = document.querySelector(selector); if (el) el.textContent = value || ''; };
    const setLink = (selector, href, text) => { const el = document.querySelector(selector); if (!el) return; el.href = href || '#'; if (text !== undefined) el.textContent = text; };
    setText('[data-demo-site-name]', state.site_logo_text || state.site_name);
    setText('[data-demo-tagline]', state.site_tagline);
    setText('[data-demo-mobile-intro]', state.site_description || 'Temukan informasi sekolah berdasarkan kebutuhan Anda.');
    setText('[data-demo-address]', state.contact_address);
    const phone = document.querySelector('[data-demo-phone]');
    if (phone) { phone.href = `tel:${state.contact_phone || ''}`; phone.textContent = state.contact_phone || ''; }
    const email = document.querySelector('[data-demo-email]');
    if (email) { email.href = `mailto:${state.contact_email || ''}`; email.textContent = state.contact_email || ''; }
    const logo = document.querySelector('[data-demo-logo]');
    if (logo) logo.src = state.site_logo_url || 'https://barka.silirdev.com/media_library/images/logo.png';
    setLink('[data-demo-spmb]', state.spmb_url, 'SPMB Online');
    setLink('[data-demo-spmb-header]', state.spmb_url, 'SPMB Online');
    setLink('[data-demo-social-facebook]', state.social_facebook, 'f');
    setLink('[data-demo-social-instagram]', state.social_instagram, '◎');
}

