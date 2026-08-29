<?php $message = $message ?? 'Belum ada konten yang tersedia.'; ?>
<div class="empty-state">
    <span class="empty-state-mark" aria-hidden="true">—</span>
    <p><?= esc($message) ?></p>
</div>
