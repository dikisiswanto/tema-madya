<?php $item = $item ?? []; ?>
<a class="document-row" href="<?= esc($item['url'] ?? '#') ?>" target="_blank" rel="noopener noreferrer" aria-label="Buka <?= esc($item['title'] ?? 'Dokumen') ?> dalam tab baru">
    <span class="document-type"><?= esc($item['extension'] ?? 'PDF') ?></span>
    <span class="document-main">
        <strong><?= esc($item['title'] ?? 'Dokumen') ?></strong>
        <?php if (!empty($item['description'])): ?><small><?= esc($item['description']) ?></small><?php endif; ?>
    </span>
    <span class="document-meta"><?= esc($item['file_size'] ?? '') ?> <span aria-hidden="true">↗</span></span>
</a>
