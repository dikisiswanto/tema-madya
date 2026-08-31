<?php
if (!function_exists('theme_resolve_menu_href')) {
    function theme_resolve_menu_href(string $url): string
    {
        $url = trim($url);
        if ($url === '' || $url === '#') {
            return '#';
        }

        // Section links are intentionally rooted at the CMS homepage.
        if (str_starts_with($url, '/#') || str_starts_with($url, '#')) {
            return base_url('/#' . ltrim(substr($url, 1), '#'));
        }

        // Preserve absolute/external URLs and protocol-relative URLs.
        if (preg_match('#^(?:[a-z][a-z0-9+.-]*:)?//#i', $url)) {
            return $url;
        }

        // CMS menu data commonly stores internal routes as `news`, `contact`,
        // or `news/slug`. Always root those URLs so `/news` never resolves
        // relative to itself as `/news/news`.
        return base_url(ltrim($url, '/'));
    }
}

if (!function_exists('theme_render_menu')) {
    function theme_render_menu(array $items, bool $mobile = false, int $level = 0): void
    {
        foreach ($items as $index => $item):
            $hasChildren = !empty($item['children']);
            $title = esc($item['title'] ?? 'Menu');
            $rawUrl = !empty($item['section_key'])
                ? '/#' . ltrim((string) $item['section_key'], '#')
                : resolve_menu_url((string) ($item['url'] ?? '#'));
            $url = theme_resolve_menu_href($rawUrl);
            $isSectionLink = str_starts_with($rawUrl, '/#') || str_starts_with($rawUrl, '#');
            $target = ($item['target'] ?? '') === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
            $key = (string)($item['id'] ?? $level . '-' . $index);
            $safeKey = preg_replace('/[^a-zA-Z0-9_-]/', '-', $key) ?: 'item';
            $panelId = 'nav-panel-' . $safeKey . '-' . $level . '-' . $index;
            $mobilePanelId = 'mobile-navigation-panel-' . $safeKey;

            if ($mobile):
                if ($hasChildren): ?>
                    <button class="mobile-menu-trigger" type="button" data-mobile-trigger="<?= esc($key) ?>" aria-expanded="false" aria-controls="<?= esc($mobilePanelId) ?>">
                        <span><?= $title ?></span><span class="menu-arrow" aria-hidden="true"><i data-lucide="arrow-right" aria-hidden="true"></i></span>
                    </button>
                <?php else: ?>
                    <a class="mobile-menu-link" href="<?= esc($url) ?>"<?= $target ?><?= $isSectionLink ? " data-spa-link" : "" ?>><span><?= $title ?></span><span aria-hidden="true"><i data-lucide="arrow-up-right" aria-hidden="true"></i></span></a>
                <?php endif;
            else:
                if ($hasChildren): ?>
                    <li data-nav-item data-nav-depth="<?= (int) $level ?>" data-open="false">
                        <button class="desktop-nav-trigger" type="button" data-nav-toggle aria-expanded="false" aria-haspopup="true" aria-controls="<?= esc($panelId) ?>">
                            <span><?= $title ?></span><span class="nav-chevron" aria-hidden="true"><i data-lucide="chevron-down" aria-hidden="true"></i></span>
                        </button>
                        <div id="<?= esc($panelId) ?>" class="nav-panel" aria-hidden="true" hidden>
                            <div class="nav-panel-heading">
                                <span><?= $title ?></span>
                                <small><?= count($item['children']) ?> pilihan</small>
                            </div>
                            <ul class="nav-panel-list">
                                <?php theme_render_menu($item['children'], false, $level + 1); ?>
                            </ul>
                        </div>
                    </li>
                <?php else: ?>
                    <li data-nav-item data-nav-depth="<?= (int) $level ?>" data-open="false" data-nav-leaf>
                        <a class="desktop-nav-link" href="<?= esc($url) ?>"<?= $target ?><?= $isSectionLink ? " data-spa-link" : "" ?>><?= $title ?></a>
                    </li>
                <?php endif;
            endif;
        endforeach;
    }
}
