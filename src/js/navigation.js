import { initIcons } from './icons.js';
const mobileState = { path: [], triggers: [], direction: 'forward' };
let closeTimer = null;
let openTimer = null;
let lastMobileFocus = null;

const DESKTOP_QUERY = '(min-width: 1200px)';
const OPEN_DELAY = 90;
const CLOSE_DELAY = 220;

export function initNavigation() {
    const root = document.querySelector('[data-site-nav]');
    const mobileToggle = document.querySelector('[data-mobile-menu]');
    const mobileNav = document.getElementById('mobile-navigation');
    if (!root) return;

    root.addEventListener('click', handleNavigationClick);
    root.addEventListener('keydown', handleNavigationKeydown);
    root.addEventListener('focusin', handleNavigationFocus);
    root.addEventListener('pointerleave', () => scheduleDesktopClose());
    mobileNav?.addEventListener('click', handleNavigationClick);
    mobileNav?.addEventListener('keydown', handleMobileKeydown);

    document.addEventListener('click', (event) => {
        if (!event.target.closest('[data-site-nav]') && !event.target.closest('[data-mobile-menu]')) closeDesktopItems();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        const openItem = [...document.querySelectorAll('[data-nav-item][data-open="true"]')].at(-1);
        if (openItem) {
            closeDesktopBranch(openItem, true);
            return;
        }
        if (document.body.classList.contains('nav-open')) closeMobileMenu(true);
    });

    mobileToggle?.addEventListener('click', () => {
        if (document.body.classList.contains('nav-open')) closeMobileMenu(true);
        else openMobileMenu();
    });

    // Use delegated pointer events so recursively generated menu items behave identically.
    // This is important for playground hydration and for arbitrarily deep CMS menu trees.
    root.addEventListener('pointerover', handleNavigationPointerOver);
    root.addEventListener('pointerout', handleNavigationPointerOut);

    syncMobileAccessibility();
    syncDesktopPanels();
    syncActiveNavigation();
    initDesktopOverflowMenu();
    window.addEventListener('hashchange', syncActiveNavigation);
    window.addEventListener('popstate', syncActiveNavigation);

    const media = window.matchMedia(DESKTOP_QUERY);
    const handleMediaChange = (event) => {
        if (event.matches) {
            closeMobileMenu(false);
            closeDesktopItems();
        } else {
            closeDesktopItems();
        }
    };
    media.addEventListener?.('change', handleMediaChange);
    window.addEventListener('resize', () => {
        if (!window.matchMedia(DESKTOP_QUERY).matches) return;
        document.querySelectorAll('[data-nav-item][data-open="true"] > [data-nav-toggle]').forEach((trigger) => {
            const item = trigger.closest('[data-nav-item]');
            const panel = document.getElementById(trigger.getAttribute('aria-controls'));
            if (item && panel) positionPanel(item, panel);
        });
    }, { passive: true });
}

function initDesktopOverflowMenu() {
    const wrap = document.querySelector('.desktop-nav-wrap');
    const nav = document.querySelector('.desktop-nav');
    if (!wrap || !nav || nav.dataset.overflowBound === 'true') return;
    nav.dataset.overflowBound = 'true';
    const overflow = document.createElement('li');
    overflow.className = 'nav-overflow-item';
    overflow.dataset.navItem = '';
    overflow.dataset.navDepth = '0';
    overflow.dataset.open = 'false';
    overflow.innerHTML = `<button class="desktop-nav-trigger nav-overflow-trigger" type="button" data-nav-toggle aria-expanded="false" aria-haspopup="true" aria-controls="nav-overflow-panel"><span>Lainnya</span><span class="nav-chevron" aria-hidden="true"><i data-lucide="chevron-down"></i></span></button><div id="nav-overflow-panel" class="nav-panel nav-overflow-panel" aria-hidden="true" hidden><div class="nav-panel-heading"><span>Menu lainnya</span><small>Menu tambahan</small></div><ul class="nav-panel-list"></ul></div>`;
    nav.appendChild(overflow);
    initIcons(overflow);
    const panelList = overflow.querySelector('.nav-panel-list');
    let rebalanceFrame = 0;
    const rebalance = () => {
        cancelAnimationFrame(rebalanceFrame);
        rebalanceFrame = requestAnimationFrame(() => {
            if (!window.matchMedia(DESKTOP_QUERY).matches) return;

            // Always start from the canonical CMS order before measuring.
            while (panelList.firstElementChild) {
                const item = panelList.firstElementChild;
                item.dataset.navDepth = '0';
                nav.insertBefore(item, overflow);
            }
            overflow.hidden = true;
            overflow.dataset.open = 'false';
            overflow.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded', 'false');
            nav.querySelectorAll(':scope > li').forEach((item) => { item.style.display = ''; });

            const gap = Number.parseFloat(getComputedStyle(nav).columnGap || getComputedStyle(nav).gap || '0') || 0;
            const available = Math.max(0, wrap.clientWidth);
            const visibleItems = () => [...nav.children].filter((item) => item !== overflow && !item.hidden && getComputedStyle(item).display !== 'none');
            const measuredWidth = () => {
                const items = visibleItems();
                const itemWidth = items.reduce((total, item) => total + item.getBoundingClientRect().width, 0);
                const gaps = Math.max(0, items.length - 1) * gap;
                return itemWidth + gaps;
            };

            let guard = 0;
            while (measuredWidth() > available && guard++ < 40) {
                const candidates = visibleItems();
                const candidate = candidates.at(-1);
                if (!candidate) break;
                panelList.insertBefore(candidate, panelList.firstElementChild);
                candidate.dataset.navDepth = '1';
                overflow.hidden = false;
            }
            if (!panelList.children.length) overflow.hidden = true;
        });
    };
    const observer = new ResizeObserver(rebalance);
    observer.observe(wrap);
    window.addEventListener('resize', rebalance, { passive: true });
    requestAnimationFrame(rebalance);
}

function handleNavigationPointerOver(event) {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    const item = event.target.closest('[data-nav-item]');
    if (!item || !rootContainsTarget(event, item)) return;
    if (event.relatedTarget instanceof Node && item.contains(event.relatedTarget)) return;
    scheduleDesktopOpen(item);
}

function handleNavigationPointerOut(event) {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    const item = event.target.closest('[data-nav-item]');
    if (!item || !rootContainsTarget(event, item)) return;
    if (event.relatedTarget instanceof Node && item.contains(event.relatedTarget)) return;
    scheduleDesktopClose(item);
}

function rootContainsTarget(event, item) {
    return event.currentTarget.contains(item);
}

function handleNavigationClick(event) {
    const desktopToggle = event.target.closest('[data-nav-toggle]');
    if (desktopToggle) {
        event.preventDefault();
        const item = desktopToggle.closest('[data-nav-item]');
        if (item) toggleDesktopItem(item);
        return;
    }

    const mobileTrigger = event.target.closest('[data-mobile-trigger]');
    if (mobileTrigger) {
        event.preventDefault();
        openMobileLevel(mobileTrigger.dataset.mobileTrigger, mobileTrigger);
        return;
    }

    const mobileBack = event.target.closest('[data-mobile-back]');
    if (mobileBack) {
        event.preventDefault();
        goMobileBack();
        return;
    }

    const link = event.target.closest('a');
    if (link && document.body.classList.contains('nav-open')) closeMobileMenu(false);
}

function handleNavigationKeydown(event) {
    const toggle = event.target.closest('[data-nav-toggle]');
    if (!toggle) return;
    const item = toggle.closest('[data-nav-item]');
    if (!item) return;

    const siblings = [...(item.parentElement?.querySelectorAll(':scope > [data-nav-item]') || [])];
    const index = siblings.indexOf(item);

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        openDesktopItem(item);
        focusFirstPanelItem(item);
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const childPanel = item.querySelector(':scope > .nav-panel');
        if (childPanel) {
            openDesktopItem(item);
            focusFirstPanelItem(item);
        } else {
            focusSibling(siblings, index, 1);
        }
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (item.parentElement?.closest('[data-nav-item]')) {
            const parent = item.parentElement.closest('[data-nav-item]');
            closeDesktopBranch(item);
            parent?.querySelector(':scope > [data-nav-toggle]')?.focus();
        } else {
            focusSibling(siblings, index, -1);
        }
    } else if (event.key === 'Home') {
        event.preventDefault();
        siblings[0]?.querySelector(':scope > a, :scope > button')?.focus();
    } else if (event.key === 'End') {
        event.preventDefault();
        siblings.at(-1)?.querySelector(':scope > a, :scope > button')?.focus();
    } else if (event.key === 'Tab') {
        scheduleDesktopClose();
    } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDesktopItem(item);
    }
}

function handleMobileKeydown(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        if (mobileState.path.length) goMobileBack();
        else closeMobileMenu(true);
        return;
    }

    const focusables = [...event.currentTarget.querySelectorAll('.mobile-level[data-active="true"] a, .mobile-level[data-active="true"] button')];
    const index = focusables.indexOf(document.activeElement);
    if (index < 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        focusables[(index + delta + focusables.length) % focusables.length]?.focus();
        return;
    }

    if (event.key === 'Tab') {
        if (!focusables.length) return;
        const nextIndex = event.shiftKey ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= focusables.length) {
            event.preventDefault();
            focusables[event.shiftKey ? focusables.length - 1 : 0]?.focus();
        }
    }
}

function handleNavigationFocus(event) {
    const item = event.target.closest('[data-nav-item]');
    if (item && window.matchMedia(DESKTOP_QUERY).matches) scheduleDesktopOpen(item, true);
}

function scheduleDesktopOpen(item, immediate = false) {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (item.dataset.open === 'true') return;
    openTimer = setTimeout(() => openDesktopItem(item), immediate ? 0 : OPEN_DELAY);
}

function scheduleDesktopClose(item = null) {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
        if (item && (item.matches(':hover') || item.contains(document.activeElement))) return;
        closeDesktopItems();
    }, CLOSE_DELAY);
}

function openDesktopItem(item) {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    const parent = item.parentElement;
    const siblings = parent?.querySelectorAll(':scope > [data-nav-item]') || [];
    siblings.forEach((sibling) => {
        if (sibling !== item) closeDesktopBranch(sibling);
    });

    item.dataset.open = 'true';
    const trigger = item.querySelector(':scope > [data-nav-toggle]');
    const panel = trigger ? document.getElementById(trigger.getAttribute('aria-controls')) : null;
    trigger?.setAttribute('aria-expanded', 'true');
    if (panel) {
        panel.hidden = false;
        panel.setAttribute('aria-hidden', 'false');
        positionPanel(item, panel);
        requestAnimationFrame(() => panel.dataset.open = 'true');
    }
}

function positionPanel(item, panel) {
    panel.dataset.placement = '';
    const rect = item.getBoundingClientRect();
    const depth = Number(item.dataset.navDepth || 0);

    if (depth === 0) {
        const trigger = item.querySelector(':scope > [data-nav-toggle]');
        if (!trigger) return;
        const triggerRect = trigger.getBoundingClientRect();
        const width = Math.min(panel.offsetWidth || 672, window.innerWidth - 32);
        const centered = triggerRect.left + triggerRect.width / 2;
        const minLeft = 16;
        const maxLeft = Math.max(minLeft, window.innerWidth - width - 16);
        const left = Math.max(minLeft, Math.min(maxLeft, centered - width / 2));
        // Root panels are not transformed so their nested fixed flyouts keep
        // viewport coordinates. Therefore the root itself receives the exact
        // left coordinate instead of relying on translateX(-50%).
        panel.style.position = 'absolute';
        panel.style.top = `calc(100% + .7rem)`;
        panel.style.left = `${left - rect.left}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.setProperty('--panel-x', '0px');
        return;
    }

    // Nested panels are positioned from the actual viewport geometry instead of
    // relying on a fixed `left: 100%` rule. This keeps level 2+ stable when a
    // parent panel is near the right/left edge and when the menu is deeply nested.
    // Every nested desktop panel is viewport-fixed. This is the key invariant
    // for level 2, 3, 4 and arbitrarily deep branches: no ancestor panel may
    // participate in the coordinate system. CSS also keeps transforms off all
    // desktop flyout ancestors so fixed descendants remain viewport-relative.
    panel.style.position = 'fixed';
    const maxPanelWidth = Math.min(384, window.innerWidth - 32);
    const panelHeight = Math.min(panel.offsetHeight || 448, window.innerHeight - 32);
    const gap = 10;
    const gutter = 16;
    const rightSpace = Math.max(0, window.innerWidth - rect.right - gutter);
    const leftSpace = Math.max(0, rect.left - gutter);

    // Prefer the side that fits. If neither side has the full panel width,
    // choose the side with more room and shrink the flyout to that room.
    const fitsRight = rightSpace >= maxPanelWidth + gap;
    const fitsLeft = leftSpace >= maxPanelWidth + gap;
    const preferLeft = fitsLeft && !fitsRight
        ? true
        : !fitsRight && !fitsLeft
            ? leftSpace > rightSpace
            : false;
    const availableWidth = preferLeft ? leftSpace - gap : rightSpace - gap;
    const panelWidth = Math.max(220, Math.min(maxPanelWidth, availableWidth || maxPanelWidth));

    panel.dataset.placement = preferLeft ? 'left' : 'right';
    panel.style.width = `${panelWidth}px`;

    const naturalTop = rect.top + panelHeight > window.innerHeight - gutter
        ? rect.bottom - panelHeight
        : rect.top;
    const maxTop = Math.max(gutter, window.innerHeight - panelHeight - gutter);
    const top = Math.min(maxTop, Math.max(gutter, naturalTop));
    const naturalLeft = preferLeft
        ? rect.left - panelWidth - gap
        : rect.right + gap;
    const maxLeft = Math.max(gutter, window.innerWidth - panelWidth - gutter);
    const left = Math.min(maxLeft, Math.max(gutter, naturalLeft));

    // Nested desktop flyouts are viewport-positioned. This deliberately avoids
    // subtracting a transformed/positioned ancestor: nested panels must not
    // inherit the geometry of an ancestor dropdown.
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.dataset.verticalPlacement = top < rect.top ? 'up' : 'down';
}

function toggleDesktopItem(item) {
    if (item.dataset.open === 'true') closeDesktopBranch(item, true);
    else openDesktopItem(item);
}

function syncActiveNavigation() {
    const path = window.location.pathname.replace(/\\/g, '/').replace(/\/$/, '') || '/';
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, '').toLowerCase());
    document.querySelectorAll('[data-site-nav] [data-spa-link]').forEach((link) => {
        const url = new URL(link.href, window.location.href);
        const linkPath = url.pathname.replace(/\\/g, '/').replace(/\/$/, '') || '/';
        const linkHash = url.hash.replace(/^#/, '').toLowerCase();
        const current = linkPath === path && ((linkHash && linkHash === hash) || (!linkHash && path === '/'));
        if (current) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function closeDesktopBranch(item, restoreFocus = false) {
    item.dataset.open = 'false';
    const trigger = item.querySelector(':scope > [data-nav-toggle]');
    const panel = trigger ? document.getElementById(trigger.getAttribute('aria-controls')) : null;
    trigger?.setAttribute('aria-expanded', 'false');
    if (panel) {
        panel.dataset.open = 'false';
        panel.setAttribute('aria-hidden', 'true');
        window.setTimeout(() => {
            if (item.dataset.open !== 'true') panel.hidden = true;
        }, 280);
    }
    item.querySelectorAll('[data-nav-item]').forEach((child) => {
        child.dataset.open = 'false';
        const childTrigger = child.querySelector(':scope > [data-nav-toggle]');
        const childPanel = childTrigger ? document.getElementById(childTrigger.getAttribute('aria-controls')) : null;
        childTrigger?.setAttribute('aria-expanded', 'false');
        if (childPanel) {
            childPanel.dataset.open = 'false';
            childPanel.setAttribute('aria-hidden', 'true');
            window.setTimeout(() => {
                if (child.dataset.open !== 'true') childPanel.hidden = true;
            }, 280);
        }
    });
    if (restoreFocus) trigger?.focus();
}

function closeDesktopItems() {
    document.querySelectorAll('[data-nav-item][data-open="true"]').forEach((item) => {
            closeDesktopBranch(item);
        });
}

function focusFirstPanelItem(item) {
    const panel = item.querySelector(':scope > .nav-panel');
    panel?.querySelector('a, button')?.focus();
}

function focusSibling(siblings, index, delta) {
    if (!siblings.length) return;
    const target = siblings[(index + delta + siblings.length) % siblings.length];
    target?.querySelector(':scope > a, :scope > button')?.focus();
}

function openMobileMenu() {
    lastMobileFocus = document.activeElement;
    document.body.classList.add('nav-open');
    const toggle = document.querySelector('[data-mobile-menu]');
    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.querySelector('.sr-only')?.replaceChildren(document.createTextNode('Tutup menu'));
    const nav = document.getElementById('mobile-navigation');
    nav?.setAttribute('aria-hidden', 'false');
    if (nav) nav.inert = false;
    syncPageInert(true);
    showMobileLevel(mobileState.path.at(-1) || 'root', 'forward');
    requestAnimationFrame(() => nav?.querySelector('.mobile-level[data-active="true"] a, .mobile-level[data-active="true"] button')?.focus());
}

function closeMobileMenu(restoreFocus = true) {
    document.body.classList.remove('nav-open');
    const toggle = document.querySelector('[data-mobile-menu]');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.querySelector('.sr-only')?.replaceChildren(document.createTextNode('Buka menu'));
    const nav = document.getElementById('mobile-navigation');
    nav?.setAttribute('aria-hidden', 'true');
    if (nav) nav.inert = true;
    syncPageInert(false);
    resetMobileLevels();
    if (restoreFocus) (lastMobileFocus instanceof HTMLElement ? lastMobileFocus : toggle)?.focus();
    lastMobileFocus = null;
}

function openMobileLevel(id, trigger = null) {
    const level = document.querySelector(`[data-mobile-level="${CSS.escape(id)}"]`);
    if (!level) return;
    if (mobileState.path.at(-1) !== id) {
        mobileState.path.push(id);
        mobileState.triggers.push(trigger);
    }
    showMobileLevel(id, 'forward');
    requestAnimationFrame(() => level.querySelector('a, button')?.focus());
}

function goMobileBack() {
    if (mobileState.path.length === 0) {
        closeMobileMenu(true);
        return;
    }
    mobileState.path.pop();
    const trigger = mobileState.triggers.pop();
    showMobileLevel(mobileState.path.at(-1) || 'root', 'back');
    requestAnimationFrame(() => trigger instanceof HTMLElement ? trigger.focus() : document.querySelector('[data-mobile-menu]')?.focus());
}

function showMobileLevel(id, direction = 'forward') {
    mobileState.direction = direction;
    document.querySelectorAll('[data-mobile-level]').forEach((node) => {
        const active = node.dataset.mobileLevel === id;
        node.dataset.direction = direction;
        node.dataset.active = String(active);
        node.setAttribute('aria-hidden', String(!active));
    });
    document.querySelectorAll('[data-mobile-trigger]').forEach((trigger) => {
        trigger.setAttribute('aria-expanded', String(mobileState.path.includes(trigger.dataset.mobileTrigger)));
    });
}

function resetMobileLevels() {
    mobileState.path.length = 0;
    mobileState.triggers.length = 0;
    showMobileLevel('root', 'back');
}

function syncMobileAccessibility() {
    const nav = document.getElementById('mobile-navigation');
    if (nav) nav.inert = !document.body.classList.contains('nav-open');
    syncPageInert(document.body.classList.contains('nav-open'));
}

function syncPageInert(open) {
    const main = document.getElementById('main-content');
    const footer = document.getElementById('playground-footer');
    [main, footer].forEach((node) => { if (node) node.inert = open; });
}

function syncDesktopPanels() {
    document.querySelectorAll('[data-nav-toggle]').forEach((trigger) => {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (!panel) return;
        panel.dataset.open = 'false';
        panel.setAttribute('aria-hidden', 'true');
    });
}
