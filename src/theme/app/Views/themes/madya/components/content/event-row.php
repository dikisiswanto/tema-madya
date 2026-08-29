<?php $event = $event ?? []; ?>
<article class="agenda-row">
    <?php if (!empty($event['icon'])): ?><span class="agenda-icon"><?= $this->include('themes/madya/components/ui/icon', ['name' => $event['icon']]) ?></span><?php endif; ?>
    <time datetime="<?= esc($event['event_date'] ?? $event['date'] ?? '') ?>"><?= esc($event['event_date'] ?? $event['date'] ?? 'Tanggal menyusul') ?></time>
    <div>
        <h3><?= esc($event['title'] ?? 'Kegiatan sekolah') ?></h3>
        <?php if (!empty($event['description']) || !empty($event['excerpt'])): ?><p><?= esc($event['description'] ?? $event['excerpt']) ?></p><?php endif; ?>
    </div>
</article>
