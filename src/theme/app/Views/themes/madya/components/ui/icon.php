<?php
$name = trim((string)($name ?? 'sparkles'));
$class = trim((string)($class ?? 'theme-icon'));
?>
<i class="<?= esc($class) ?>" data-lucide="<?= esc($name) ?>" aria-hidden="true"></i>
