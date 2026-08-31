const paths = {
    'arrow-left': '<path d="m15 18-6-6 6-6"/><path d="M9 12h10"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    'bell-ring':
        '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4M4 4l-2-2M20 4l2-2"/>',
    'book-open':
        '<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v17H5.5A2.5 2.5 0 0 0 3 22z"/><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H13v17h5.5A2.5 2.5 0 0 1 21 22z"/>',
    'calendar-days':
        '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18"/><path d="M8 13h2M14 13h2M8 17h2M14 17h2"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'circle-help':
        '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-.9.7-1.8 1.1-1.8 2.7"/><path d="M12 17h.01"/>',
    'clock-3': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    download:
        '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    'file-text':
        '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/>',
    'graduation-cap':
        '<path d="m3 10 9-5 9 5-9 5z"/><path d="M7 12.5V17c3 2 7 2 10 0v-4.5"/><path d="M21 10v6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 4"/>',
    landmark:
        '<path d="m3 10 9-6 9 6"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18M2 21h20"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    'mail-open':
        '<path d="M3 9 12 4l9 5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m3 9 9 6 9-6"/>',

    'map-pin':
        '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    megaphone:
        '<path d="m3 11 14-5v12L3 13z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M6 14v5"/>',
    'message-circle':
        '<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-4-.9L4 20l1.5-3.5A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/>',
    'messages-square':
        '<path d="M21 11a7 7 0 0 1-7 7H8l-5 3 1.5-4A7 7 0 0 1 3 11a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    'user-round':
        '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    'building-2':
        '<path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 9h3a2 2 0 0 1 2 2v10M8 7h3M8 11h3M8 15h3M17 13h1M17 17h1"/><path d="M2 21h20"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
    'flask-conical':
        '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7 16h10"/>',
    languages:
        '<path d="M4 5h8M8 5v2a7 7 0 0 1-5 6M5 10a7 7 0 0 0 6 3M14 5h6M17 5v2c0 4 2 7 5 9M14 16h6"/>',
    'users-round':
        '<path d="M16 21a6 6 0 0 0-12 0M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 11a3 3 0 1 0-1-5.8M21 21a5 5 0 0 0-3-4.6"/>',
    dribbble:
        '<circle cx="12" cy="12" r="9"/><path d="M5 6.5c4.5 2 9 2.8 14 2.2M4 15c4.7-1.5 9.2-1.2 14 1.2M9 3.8c3.5 3.4 5.8 8 6.5 15.4M17.8 5.4C13.5 8.3 9.4 12.3 7 18.5"/>',

    'monitor-play':
        '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="m10 8 5 3-5 3z"/><path d="M8 21h8"/>',
    phone: '<path d="M6.5 3.5 9 3l2 5-2.5 1.5a14 14 0 0 0 6 6L16 13l5 2v2.5c0 1.4-1.1 2.5-2.5 2.5C10.5 20 4 13.5 4 5.5A2 2 0 0 1 6.5 3.5Z"/>',
    'play-circle': '<circle cx="12" cy="12" r="9"/><path d="m10 8 5 4-5 4z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    send: '<path d="m3 4 18 8-18 8 4-8z"/><path d="M7 12h14"/>',
    sparkles:
        '<path d="m12 3 1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2z"/><path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6z"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 3M16 6h3a3 3 0 0 1-3 3M12 13v5M8 21h8M9 18h6"/>',
    'user-plus':
        '<circle cx="9" cy="8" r="4"/><path d="M3 21a6 6 0 0 1 12 0M19 8v6M16 11h6"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.9M18 14a5 5 0 0 1 3 4.5"/>',
    user: '<circle cx="12" cy="7.5" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    eye: '<path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2.5"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    activity: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
    microscope:
        '<path d="M6 20h12M9 20a6 6 0 0 0 6-6v-2M8 4h4l2 5-4 2zM7 13h8M16 7l3 3"/>',
    music: '<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
    palette:
        '<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h2a7 7 0 0 0 0-10Z"/><circle cx="7.5" cy="10" r=".7"/><circle cx="9" cy="6.8" r=".7"/><circle cx="13" cy="6" r=".7"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7 16h10"/>',
    book: '<path d="M4 5a3 3 0 0 1 3-3h13v17H7a3 3 0 0 0-3 3z"/><path d="M7 2v17"/>',
    calendar:
        '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18"/>',
    compass:
        '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    running:
        '<circle cx="13" cy="5" r="2"/><path d="m9 9 3 2 2-2 3 2M12 11l-2 5-3 3M12 11l4 5 3 1"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    'hand-heart':
        '<path d="M6 11a4 4 0 0 1 6-3 4 4 0 0 1 6 3c0 4-6 7-6 7s-6-3-6-7Z"/><path d="M3 13v5a2 2 0 0 0 2 2h6"/>',
    'laptop-code':
        '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M2 20h20M9 9l-2 2 2 2M15 9l2 2-2 2"/>',
    microchip:
        '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    futbol: '<circle cx="12" cy="12" r="9"/><path d="m12 7 3 2-1 4h-4l-1-4zM9 13l-3 2M15 13l3 2M10 9 8 6M14 9l2-3M10 17l2-2 2 2"/>',
    'paint-brush':
        '<path d="m14 4 6 6-9 9-6-6z"/><path d="M5 13 3 15l2 2-2 2h5l2-2M14 4l2-2 2 2-2 2"/>',
    leaf: '<path d="M20 4C10 4 4 8 4 15a5 5 0 0 0 5 5c7 0 11-6 11-16Z"/><path d="M4 20c2-5 6-8 11-10"/>',
    medal: '<circle cx="12" cy="15" r="5"/><path d="m9 10 3-7 3 7M8 3l2 4M16 3l-2 4"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m9 12-1 9 4-2 4 2-1-9"/>',
    'quote-left':
        '<path d="M7 11H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3v6ZM16 11h-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3v6Z"/>',
    'user-graduate':
        '<path d="m3 9 9-5 9 5-9 5zM7 11v4c3 2 7 2 10 0v-4M12 14v6M8 20h8"/>',
    'chalkboard-teacher':
        '<rect x="3" y="4" width="13" height="12" rx="1"/><path d="M7 20h5M9 16v4M18 8a3 3 0 1 0 0 6M18 14v5M16 19h5"/>',
    'clipboard-text':
        '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h4"/>',
    'atom-2':
        '<circle cx="12" cy="12" r="2"/><path d="M19.5 12c0 4.5-3.4 8-7.5 8s-7.5-3.5-7.5-8 3.4-8 7.5-8 7.5 3.5 7.5 8Z"/><path d="M15.75 18.5C11.8 20.7 6.8 19.6 4.7 16s-.9-8.5 3-10.7 8.9-1.1 11 2.5.9 8.5-3 10.7Z" transform="rotate(60 12 12)"/><path d="M15.75 5.5c3.9 2.2 5 7.1 3 10.7s-7 4.7-11 2.5-5-7.1-3-10.7 7-4.7 11-2.5Z" transform="rotate(-60 12 12)"/>',
    photo: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 4"/>',
    'brand-facebook':
        '<path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z"/>',
    'brand-instagram':
        '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    'brand-youtube':
        '<path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9A28.5 28.5 0 0 0 2 12a28.5 28.5 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28.5 28.5 0 0 0 22 12a28.5 28.5 0 0 0-.4-4.8Z"/><path d="m10 15.3 5-3.3-5-3.3z" fill="currentColor" stroke="none"/>',
    'brand-x': '<path d="M5 4l14 16M19 4 5 20"/>',
    'brand-whatsapp':
        '<path d="M20 11.5a7.5 7.5 0 0 1-11.1 6.6L5 20l1.6-3.7A7.5 7.5 0 1 1 20 11.5Z"/><path d="M9.5 8.8c.2-.3.4-.3.7-.2l1 .6c.2.1.3.3.2.5l-.4.8c-.1.2-.1.3 0 .5.4.7 1 1.3 1.7 1.7.2.1.3.1.5 0l.7-.4c.2-.1.4 0 .5.1l.7.9c.2.2.2.4 0 .6-.4.5-1 .8-1.6.7-1.1-.2-2.3-1-3.2-1.9-.9-.9-1.7-2.1-1.9-3.2-.1-.6.2-1.2.7-1.7Z"/>',
    files: '<path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M9 7h6M9 11h6M9 15h4"/><path d="M3 7V5a2 2 0 0 1 2-2"/>',
    'folder-open':
        '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v1H3z"/><path d="m3 10 2 9h13l3-10H3z"/>',
    'shield-check':
        '<path d="M12 3 20 6v5c0 5-3.2 8.5-8 10-4.8-1.5-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    school: '<path d="m3 9 9-5 9 5-9 5z"/><path d="M7 11v5c3 2 7 2 10 0v-5"/><path d="M21 9v6"/>',
    newspaper:
        '<path d="M4 5h15v14H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M7 9h8M7 13h8M7 17h5"/><path d="M19 8h3v9a2 2 0 0 1-2 2h-1"/>',
    'external-link':
        '<path d="M14 5h5v5M19 5l-8 8"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    'file-down':
        '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M12 12v5M9 14l3 3 3-3"/>',
    'brand-link':
        '<path d="M10 13a5 5 0 0 0 7.5.5l1.5-1.5a5 5 0 0 0-7.1-7.1L11 5.8"/><path d="M14 11a5 5 0 0 0-7.5-.5L5 12a5 5 0 0 0 7.1 7.1l.9-.9"/>',
    'badge-check':
        '<path d="M9 3 12 2l3 1 3 2 2 3-1 3 1 3-2 3-3 2-3-1-3 1-3-2-2-3 1-3-1-3 2-3z"/><path d="m9 12 2 2 4-4"/>',
    lightbulb:
        '<path d="M9 18h6M10 22h4"/><path d="M8 15c-1.2-.9-2-2.4-2-4a6 6 0 0 1 12 0c0 1.6-.8 3.1-2 4-.7.5-1 1.1-1 2h-6c0-.9-.3-1.5-1-2Z"/>',
    'heart-handshake':
        '<path d="M20 12c0-3.9-4.7-6.2-8-2.8C8.7 5.8 4 8.1 4 12c0 4.3 5.8 7.1 8 8.5 2.2-1.4 8-4.2 8-8.5Z"/><path d="m7 14 2 2 2-2 2 2 2-2"/>',
};

const aliases = {
    atom: 'atom-2',

    chevron: 'chevron-down',
    facebook: 'brand-facebook',
    instagram: 'brand-instagram',
    youtube: 'brand-youtube',
    twitter: 'brand-x',
    'link-2': 'brand-link',
    'arrow-up': 'arrow-up-right',
    'graduation-cap': 'graduation-cap',
};

export function hasIcon(name) {
    const key = aliases[name] || name;
    return Boolean(key && paths[key]);
}

function isFontAwesomeIcon(name) {
    return /^(?:(?:fa|fas|far|fab|fal|fat|fad)\s+fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*|fa-(?:solid|regular|brands)\s+fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*|fa-[a-z0-9-]+)$/i.test(
        String(name || '').trim(),
    );
}

function normalizeFontAwesomeName(name) {
    const value = String(name || '')
        .replace(/[^a-zA-Z0-9_ -]/g, '')
        .trim();
    if (/^fa\s+fa-[a-z0-9-]+$/i.test(value))
        return value.replace(/^fa\s+/i, 'fas ');
    return /^fa-[a-z0-9-]+$/i.test(value) ? `fas ${value}` : value;
}

function fontAwesomeMarkup(name, className = '', color = '') {
    const safeName = normalizeFontAwesomeName(name);
    const safeColor = /^#[0-9a-f]{6}$/i.test(String(color || ''))
        ? String(color)
        : '';
    const style = safeColor ? ` style="color:${safeColor}"` : '';
    return `<i class="${safeName} ${className}" aria-hidden="true"${style}></i>`;
}

export function iconMarkup(name, className = '', color = '') {
    if (isFontAwesomeIcon(name))
        return fontAwesomeMarkup(name, className, color);
    const key = aliases[name] || name || 'graduation-cap';
    if (!paths[key] && /^[a-z0-9-]+$/i.test(String(name || '')))
        return fontAwesomeMarkup(`fas fa-${name}`, className, color);
    const inner = paths[key] || paths['graduation-cap'];
    return `<svg class="icon icon-tabler ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export function initIcons(root = document) {
    const hosts = root.querySelectorAll?.('[data-lucide]');
    if (!hosts?.length) return;
    hosts.forEach((host) => {
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg',
        );
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute(
            'class',
            `icon icon-tabler ${host.className || ''}`.trim(),
        );
        const name = host.getAttribute('data-lucide') || 'graduation-cap';
        const key = aliases[name] || name;
        if (!paths[key] && /^[a-z0-9-]+$/i.test(name)) {
            const fallback = document.createElement('i');
            fallback.setAttribute('aria-hidden', 'true');
            fallback.setAttribute(
                'class',
                `fas fa-${name} ${host.className || ''}`.trim(),
            );
            host.replaceWith(fallback);
            return;
        }
        svg.innerHTML = paths[key] || paths['graduation-cap'];
        host.replaceWith(svg);
    });
}
