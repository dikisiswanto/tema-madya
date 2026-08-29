const mobileState = { path: [], triggers: [], direction: 'forward' };
let closeTimer = null;
let openTimer = null;
let lastMobileFocus = null;

const DESKTOP_QUERY = '(min-width: 1120px)';
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

    document.querySelectorAll('[data-nav-item]').forEach((item) => {
        item.addEventListener('mouseenter', () => scheduleDesktopOpen(item));
        item.addEventListener('mouseleave', () => scheduleDesktopClose(item));
    });

    syncMobileAccessibility();
    syncDesktopPanels();

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
        focusSibling(siblings, index, 1);
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
    if (item.dataset.navDepth === '0') {
        const trigger = item.querySelector(':scope > [data-nav-toggle]');
        if (!trigger) return;
        const rect = trigger.getBoundingClientRect();
        const width = Math.min(panel.offsetWidth || 672, window.innerWidth * .76);
        const centeredLeft = rect.left + rect.width / 2;
        const min = 16 + width / 2;
        const max = window.innerWidth - 16 - width / 2;
        panel.style.setProperty('--panel-x', `${Math.max(min, Math.min(max, centeredLeft)) - item.getBoundingClientRect().left}px`);
        return;
    }

    const rect = item.getBoundingClientRect();
    const panelWidth = panel.offsetWidth || 352;
    const rightSpace = window.innerWidth - rect.right;
    if (rightSpace < panelWidth + 24) panel.dataset.placement = 'left';
}

function toggleDesktopItem(item) {
    if (item.dataset.open === 'true') closeDesktopBranch(item, true);
    else openDesktopItem(item);
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
    document.querySelectorAll('[data-nav-item][data-open="true"]').forEach((item) => closeDesktopBranch(item));
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
}

function syncDesktopPanels() {
    document.querySelectorAll('[data-nav-toggle]').forEach((trigger) => {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (!panel) return;
        panel.dataset.open = 'false';
        panel.setAttribute('aria-hidden', 'true');
    });
}
