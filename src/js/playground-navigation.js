import { getState } from './state.js';

const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const safe = (value, fallback='item') => String(value || fallback).replace(/[^a-zA-Z0-9_-]/g, '-') || fallback;
const menuUrl = (item) => item?.section_key ? `/#${String(item.section_key).replace(/^#/, '')}` : (item?.url || '#');
const targetAttr = (item) => item?.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';

function renderDesktop(items, level = 0) {
  return items.map((item, index) => {
    const children = Array.isArray(item.children) ? item.children : [];
    const title = esc(item.title || 'Menu');
    const url = menuUrl(item);
    const key = safe(item.id || `${level}-${index}`);
    if (!children.length) return `<li data-nav-item data-nav-depth="${level}" data-open="false" data-nav-leaf><a class="desktop-nav-link" href="${esc(url)}" data-spa-link${targetAttr(item)}>${title}</a></li>`;
    const panelId = `playground-nav-panel-${key}-${level}-${index}`;
    return `<li data-nav-item data-nav-depth="${level}" data-open="false">
      <button class="desktop-nav-trigger" type="button" data-nav-toggle aria-expanded="false" aria-haspopup="true" aria-controls="${panelId}">
        <span>${title}</span><span class="nav-chevron" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
      </button>
      <div id="${panelId}" class="nav-panel" aria-hidden="true" hidden>
        <div class="nav-panel-heading"><span>${title}</span><small>${children.length} pilihan</small></div>
        <ul class="nav-panel-list">${renderDesktop(children, level + 1)}</ul>
      </div>
    </li>`;
  }).join('');
}

function collect(items, out = []) {
  items.forEach((item) => {
    if (Array.isArray(item.children) && item.children.length) {
      out.push(item);
      collect(item.children, out);
    }
  });
  return out;
}

function renderMobileLevel(item, level = 0) {
  const children = Array.isArray(item.children) ? item.children : [];
  const title = esc(item.title || 'Menu');
  const key = safe(item.id || `level-${level}`);
  return `<div class="mobile-level" id="mobile-navigation-panel-${key}" data-mobile-level="${key}" data-active="false" aria-hidden="true">
    <button class="mobile-back" type="button" data-mobile-back aria-label="Kembali ke menu sebelumnya"><i data-lucide="arrow-left"></i> Kembali</button>
    <p class="mobile-level-title">${title}</p>
    ${children.map((child, index) => {
      const hasChildren = Array.isArray(child.children) && child.children.length;
      const childTitle = esc(child.title || 'Menu');
      const childKey = safe(child.id || `${key}-${index}`);
      if (hasChildren) return `<button class="mobile-menu-trigger" type="button" data-mobile-trigger="${childKey}" aria-expanded="false" aria-controls="mobile-navigation-panel-${childKey}"><span>${childTitle}</span><span class="menu-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i></span></button>`;
      return `<a class="mobile-menu-link" href="${esc(menuUrl(child))}" data-spa-link${targetAttr(child)}><span>${childTitle}</span><span aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></a>`;
    }).join('')}
  </div>`;
}

export function hydratePlaygroundNavigation() {
  const state = getState();
  const tree = Array.isArray(state.navigation) ? state.navigation : [];
  const desktop = document.querySelector('.desktop-nav');
  const mobileRoot = document.querySelector('.mobile-level[data-mobile-level="root"]');
  const mobileInner = document.querySelector('.mobile-nav-inner');
  if (!tree.length || !desktop || !mobileRoot || !mobileInner) return;

  desktop.innerHTML = renderDesktop(tree);
  mobileRoot.innerHTML = `<div class="mobile-nav-intro"><span class="eyebrow">Navigasi</span><p data-demo-mobile-intro>${esc(state.site_description || 'Temukan informasi sekolah berdasarkan kebutuhan Anda.')}</p></div>${tree.map((item, index) => {
    const children = Array.isArray(item.children) ? item.children : [];
    const title = esc(item.title || 'Menu');
    const key = safe(item.id || `root-${index}`);
    if (children.length) return `<button class="mobile-menu-trigger" type="button" data-mobile-trigger="${key}" aria-expanded="false" aria-controls="mobile-navigation-panel-${key}"><span>${title}</span><span class="menu-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i></span></button>`;
    return `<a class="mobile-menu-link" href="${esc(menuUrl(item))}" data-spa-link${targetAttr(item)}><span>${title}</span><span aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></a>`;
  }).join('')}`;

  collect(tree).forEach((item) => {
    mobileInner.insertAdjacentHTML('beforeend', renderMobileLevel(item));
  });
}
