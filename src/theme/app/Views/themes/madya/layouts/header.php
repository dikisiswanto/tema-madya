<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php
$themeSiteName = trim((string)($site_name ?? 'SekolahKu'));
$themePageTitle = trim((string)($page_title ?? ''));
$themeTitle = $themePageTitle === '' || strcasecmp($themePageTitle, $themeSiteName) === 0
    ? $themeSiteName
    : $themePageTitle . ' — ' . $themeSiteName;
$themeDescription = trim((string)($page_description ?? $site_description ?? $site_tagline ?? ''));
$themeCurrentUrl = current_url();
$themePath = parse_url($themeCurrentUrl, PHP_URL_PATH) ?: '/';
$themeCanonical = trim((string)($canonical_url ?? base_url(ltrim($themePath, '/'))));
$themeCanonical = $themeCanonical !== '' ? $themeCanonical : base_url();
$themeOgImageRaw = trim((string)($og_image ?? $social_image ?? ''));
$themeOgImage = $themeOgImageRaw === '' ? null : (preg_match('#^(?:https?:)?//#i', $themeOgImageRaw) ? $themeOgImageRaw : base_url(ltrim($themeOgImageRaw, '/')));
$themePreloadImageRaw = trim((string)($preload_image ?? ''));
$themePreloadImage = $themePreloadImageRaw === '' ? null : (preg_match('#^(?:https?:)?//#i', $themePreloadImageRaw) ? $themePreloadImageRaw : base_url(ltrim($themePreloadImageRaw, '/')));
?>
<title><?= esc($themeTitle) ?></title>
    <meta name="description" content="<?= esc($themeDescription) ?>">
    <meta name="theme-color" content="#072A63">
    <link rel="canonical" href="<?= esc($themeCanonical) ?>">
    <meta name="robots" content="<?= esc($robots ?? 'index,follow') ?>">
    <meta property="og:locale" content="id_ID">
    <meta property="og:type" content="<?= esc($og_type ?? 'website') ?>">
    <meta property="og:title" content="<?= esc($themeTitle) ?>">
    <meta property="og:description" content="<?= esc($themeDescription) ?>">
    <meta property="og:url" content="<?= esc($themeCanonical) ?>">
    <meta property="og:site_name" content="<?= esc($themeSiteName) ?>">
    <?php if (!empty($article_published_time)): ?>
<meta property="article:published_time" content="<?= esc($article_published_time) ?>">
<?php endif; ?>
    <?php if (!empty($article_modified_time)): ?>
<meta property="article:modified_time" content="<?= esc($article_modified_time) ?>">
<?php endif; ?>
    <?php if ($themeOgImage): ?>
<meta property="og:image" content="<?= esc($themeOgImage) ?>">
    <meta property="og:image:alt" content="<?= esc($themeTitle) ?>">
<?php endif; ?>
    <meta name="twitter:card" content="<?= esc($themeOgImage ? 'summary_large_image' : 'summary') ?>">
    <meta name="twitter:title" content="<?= esc($themeTitle) ?>">
    <meta name="twitter:description" content="<?= esc($themeDescription) ?>">
    <meta name="author" content="<?= esc($site_name ?? $themeSiteName) ?>">
    <?php if ($themeOgImage): ?>
<meta name="twitter:image" content="<?= esc($themeOgImage) ?>">
<?php endif; ?>
    <?php if ($themePreloadImage): ?>
<link rel="preload" as="image" href="<?= esc($themePreloadImage) ?>" fetchpriority="high">
<?php endif; ?>
    <link rel="icon" type="image/svg+xml" href="<?= base_url(($theme_asset_base ?? 'themes/madya/assets') . '/favicon.svg') ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@300;400;500;600;700&family=Newsreader:opsz,wght@6..72,300..800&display=swap">
    <link rel="stylesheet" href="<?= base_url($theme_asset_base ?? 'themes/madya/assets') ?>/app.css">
    <?php if (($structured_data ?? null)): ?>
<script type="application/ld+json"><?= json_encode($structured_data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?></script>
<?php endif; ?>
</head>
<body class="madya-theme">
<a href="#main-content" class="skip-link">Langsung ke konten utama</a>
<?= $this->include('themes/madya/partials/navigation') ?>
<main id="main-content" class="page-shell">
