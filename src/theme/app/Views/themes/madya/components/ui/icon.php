<?php
$name = trim((string) ($name ?? 'sparkles'));
$class = trim((string) ($class ?? 'theme-icon'));
$color = trim((string) ($color ?? ''));

// Sekolahku CMS stores several configurable icons as Font Awesome class values
// (e.g. "fas fa-futbol"), while older/default settings may contain a single
// name (e.g. "graduation-cap"). Keep both contracts valid.
$isFontAwesome = preg_match('/^(?:(?:fas|far|fab|fal|fat|fad)\s+fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*|fa-(?:solid|regular|brands)\s+fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*|fa-[a-z0-9-]+)$/i', $name) === 1;
$style = preg_match('/^#[0-9a-f]{6}$/i', $color) === 1 ? ' style="color:' . esc($color) . '"' : '';

if ($isFontAwesome) {
    $fontAwesomeName = $name;
    // CMS settings sometimes save only "fa-school". Font Awesome expects a
    // style prefix as well; default to the solid set used by Sekolahku.
    if (preg_match('/^fa-[a-z0-9-]+$/i', $fontAwesomeName) === 1) {
        $fontAwesomeName = 'fas ' . $fontAwesomeName;
    }
    $safeClass = preg_replace('/[^a-zA-Z0-9_ -]/', '', $fontAwesomeName);
    echo '<i class="' . esc(trim($safeClass . ' ' . $class)) . '" aria-hidden="true"' . $style . '></i>';
    return;
}
?>
<i class="<?= esc($class) ?>" data-lucide="<?= esc($name) ?>" aria-hidden="true"<?= $style ?>></i>
