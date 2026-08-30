<?php
if (!function_exists('theme_render_menu')) {
    function theme_render_menu(array $items, bool $mobile = false, int $level = 0): void
    {
        foreach ($items as $index => $item):
            $hasChildren = !empty($item['children']);
            $title = esc($item['title'] ?? 'Menu');
            $url = !empty($item['section_key'])
                ? base_url('/#' . ltrim((string) $item['section_key'], '#'))
                : resolve_menu_url($item['url'] ?? '#');
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
                    <a class="mobile-menu-link" href="<?= esc($url) ?>"<?= $target ?><?= str_starts_with($url, "#") ? " data-spa-link" : "" ?>><span><?= $title ?></span><span aria-hidden="true"><i data-lucide="arrow-up-right" aria-hidden="true"></i></span></a>
                <?php endif;
            else:
                if ($hasChildren): ?>
                    <li data-nav-item data-nav-depth="<?= (int)$level ?>" data-open="false">
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
                    <li data-nav-item data-nav-depth="<?= (int)$level ?>" data-open="false" data-nav-leaf>
                        <a class="desktop-nav-link" href="<?= esc($url) ?>"<?= $target ?><?= str_starts_with($url, "#") ? " data-spa-link" : "" ?>><?= $title ?></a>
                    </li>
                <?php endif;
            endif;
        endforeach;
    }
}
