import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const themePages = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
    'pages',
);
const files = fs
    .readdirSync(themePages)
    .filter((name) => name.endsWith('.php'));
const errors = [];

// These class names exist in SekolahKu 3.1.2's bundled public stylesheet.
// Keep Madya's component classes namespaced so a stale/legacy CMS stylesheet
// cannot partially restyle the theme.
const cmsReservedClasses = [
    'section',
    'section-title',
    'section-cta',
    'header-inner',
    'hero-grid',
    'hero-meta',
    'teacher-card',
    'news-card',
    'news-filter',
    'news-pagination',
    'footer-grid',
    'footer-brand',
    'footer-bottom',
    'testimonial-grid',
    'faq-list',
    'faq-item',
    'faq-question',
    'faq-answer',
    'pagination',
];
const cssSource = fs.readFileSync(
    path.join(root, 'src', 'css', 'app.css'),
    'utf8',
);
for (const className of cmsReservedClasses) {
    const selector =
        className === 'pagination'
            ? new RegExp(`(?:^|[,{]\\s*)\\.${className}(?![A-Za-z0-9_-])`)
            : new RegExp(`\\.${className}(?![A-Za-z0-9_-])`);
    if (selector.test(cssSource)) {
        errors.push(
            `app.css: CMS-reserved class .${className} must be namespaced to prevent legacy CSS collision.`,
        );
    }
}

const forbidden = [
    /placehold\.co/i,
    /https?:\/\/.*example/i,
    /generated\/teacher-(?:1|2|3|4)\.jpg/i,
    /generated\/principal\.jpg/i,
    /generated\/testimonial-1\.jpg/i,
    /new\s+\\?App\\Models\\\\/i,
    /class_exists\s*\(\s*['"]App\\\\Models\\/i,
    /\$_GET\[['"](?:search|sort|category|month)['"]\]/i,
];

for (const name of files) {
    const file = path.join(themePages, name);
    const source = fs.readFileSync(file, 'utf8');
    if (/themes\/madya\/pages\/.*demo/i.test(source)) {
        errors.push(
            `${name}: theme PHP must not reference demo-only pages/data.`,
        );
    }
    for (const pattern of forbidden) {
        if (pattern.test(source)) {
            errors.push(
                `${name}: contains a playground/demo-only or view-level data access pattern: ${pattern}`,
            );
        }
    }
}

const expectedIncludeContract = {
    'home.php': ['themes/madya/layouts/header', 'themes/madya/layouts/footer'],
    'news.php': ['themes/madya/layouts/header', 'themes/madya/layouts/footer'],
    'single_post.php': [
        'themes/madya/layouts/header',
        'themes/madya/layouts/footer',
    ],
    'downloads.php': [
        'themes/madya/layouts/header',
        'themes/madya/layouts/footer',
    ],
    'contact.php': [
        'themes/madya/layouts/header',
        'themes/madya/layouts/footer',
    ],
    'page.php': ['themes/madya/layouts/header', 'themes/madya/layouts/footer'],
};
for (const [name, includes] of Object.entries(expectedIncludeContract)) {
    const source = fs.readFileSync(path.join(themePages, name), 'utf8');
    for (const target of includes) {
        if (!source.includes(`$this->include('${target}')`)) {
            errors.push(`${name}: required ${target} include is missing.`);
        }
    }
}
const navigation = fs.readFileSync(
    path.join(
        root,
        'src',
        'theme',
        'app',
        'Views',
        'themes',
        'madya',
        'partials',
        'navigation.php',
    ),
    'utf8',
);
if (
    !navigation.includes(
        "$this->include('themes/madya/partials/navigation/menu')",
    )
) {
    errors.push('navigation.php: menu bootstrap include is missing.');
}

const nativePages = [
    'news.php',
    'single_post.php',
    'downloads.php',
    'contact.php',
    'page.php',
];
for (const name of nativePages) {
    const source = fs.readFileSync(path.join(themePages, name), 'utf8');
    if (!source.includes('themes/madya/components/page-header')) {
        errors.push(
            `${name}: native CMS page must use the canonical Madya page header/breadcrumb renderer.`,
        );
    }
    if (source.includes('data-spa-content')) {
        errors.push(
            `${name}: native CMS page must not declare the SPA content shell.`,
        );
    }
    if (
        source.includes('data-news-category') ||
        source.includes('data-news-sort')
    ) {
        errors.push(
            `${name}: native CMS news UI must not expose playground SPA interception hooks.`,
        );
    }
}

const router = fs.readFileSync(
    path.join(root, 'src', 'js', 'router.js'),
    'utf8',
);
if (!router.includes('[data-spa-content][data-spa-runtime="standalone"]')) {
    errors.push(
        'router.js: SPA router must be gated to the standalone/playground shell so native CMS routes remain native.',
    );
}
if (!router.includes('if (!shell) return;')) {
    errors.push(
        'router.js: SPA router must no-op when the standalone shell is absent.',
    );
}

const nativeRoutePrefixes = ['/news', '/downloads', '/contact', '/pages/'];
for (const route of nativeRoutePrefixes) {
    if (!router.includes(route)) {
        errors.push(`router.js: native route contract is missing ${route}.`);
    }
}
if (!router.includes('event.preventDefault()')) {
    errors.push(
        'router.js: standalone SPA navigation handler is missing its guarded interception logic.',
    );
}

const singlePost = fs.readFileSync(
    path.join(themePages, 'single_post.php'),
    'utf8',
);
if (
    !singlePost.includes('$post ?? null') ||
    !singlePost.includes('$article = is_array($post')
) {
    errors.push(
        "single_post.php: must consume the CMS News controller's post variable.",
    );
}
if (!singlePost.includes("$article['tags']")) {
    errors.push(
        'single_post.php: article tags must come from the CMS post tags field.',
    );
}

const home = fs.readFileSync(path.join(themePages, 'home.php'), 'utf8');
if (
    !home.includes('$programs') ||
    !home.includes('$teachers') ||
    !home.includes('$news')
) {
    errors.push(
        'home.php: expected CMS homepage collection variables are missing.',
    );
}

if (!home.includes("'runtime' => 'cms-home'")) {
    errors.push(
        'home.php: CMS homepage state must explicitly identify the cms-home runtime.',
    );
}
if (
    !home.includes(
        "'asset_base' => base_url($theme_asset_base ?? 'themes/madya/assets')",
    )
) {
    errors.push(
        'home.php: CMS homepage state must expose the canonical theme asset base to rich-component hydration.',
    );
}
for (const forbiddenStateRef of [
    "'programs' => $programItems",
    "'extracurriculars' => $extraItems",
    "'teachers' => $teacherItems",
    "'achievements' => $achievementItems",
    "'events' => $eventItems",
    "'galleries' => $galleryItems",
]) {
    if (home.includes(forbiddenStateRef)) {
        errors.push(
            `home.php: CMS rich state must use the full visible collection, not the homepage preview slice (${forbiddenStateRef}).`,
        );
    }
}
if (
    !home.includes('$allProgramItems = $programItems') ||
    !home.includes('$allExtraItems = $extraItems')
) {
    errors.push(
        'home.php: full CMS collections must be captured before homepage preview slicing.',
    );
}
if (
    !home.includes(
        "$themeStatePrincipal['welcome_message'] = $themeStatePrincipal['quote']",
    )
) {
    errors.push(
        'home.php: CMS principal quote must map to the rich-component welcome_message field.',
    );
}
if (home.includes('generated/news-campus.jpg')) {
    errors.push(
        'home.php: CMS homepage must not use the demo news-campus image as a news fallback.',
    );
}
if (!home.includes('<script id="theme-state" type="application/json">')) {
    errors.push('home.php: CMS rich-component hydration state is missing.');
}
if (!router.includes('restoreCmsHomepage(shell)')) {
    errors.push(
        'router.js: empty CMS hash must restore the server-rendered homepage instead of rendering the standalone/demo homepage.',
    );
}
if (
    router.includes('renderHome(getState(), shell);') &&
    router.includes("if (runtime === 'cms-home')")
) {
    const cmsBranch =
        router
            .split("if (runtime === 'cms-home')", 2)[1]
            ?.split('// Standalone/playground', 1)[0] || '';
    if (cmsBranch.includes('renderHome(getState(), shell)')) {
        errors.push(
            'router.js: cms-home branch must never call the standalone renderHome() renderer.',
        );
    }
}
if (!router.includes('window.location.hash')) {
    errors.push(
        'router.js: hash-aware CMS homepage routing contract is missing.',
    );
}

if (!router.includes('let cmsHomeMarkup =')) {
    errors.push(
        'router.js: CMS homepage snapshot storage is missing for / vs /# parity.',
    );
}
if (
    !router.includes('if (!route) {') ||
    !router.includes('restoreCmsHomepage(shell);')
) {
    errors.push(
        'router.js: empty hash must preserve/restore the server-rendered CMS homepage.',
    );
}
if (home.includes("$newsFallback = $generated('news-campus.jpg')")) {
    errors.push(
        'home.php: demo news image fallback must not be used in CMS production.',
    );
}
const newsCard = fs.readFileSync(
    path.join(themePages, '..', 'components', 'content', 'news-card.php'),
    'utf8',
);
if (
    !newsCard.includes("$post['title']") ||
    !newsCard.includes("$post['excerpt']")
) {
    errors.push(
        'news-card.php: CMS title/excerpt fields are not consumed by the native card.',
    );
}
if (newsCard.includes("'Berita sekolah'")) {
    errors.push(
        'news-card.php: generic demo-like title fallback must not mask missing CMS news data.',
    );
}

if (!router.includes("if (runtime === 'cms-home')")) {
    errors.push('router.js: CMS homepage must have a separate runtime branch.');
}
if (!router.includes("if (path !== '/') return;")) {
    errors.push(
        'router.js: cms-home runtime must refuse URL-backed native routes.',
    );
}
if (!router.includes("shell.dataset.spaRuntime === 'standalone'")) {
    errors.push(
        'router.js: native route interception must remain standalone/playground-only.',
    );
}
const cmsState = fs.readFileSync(path.join(themePages, 'home.php'), 'utf8');
if (
    /generated\/(?:teacher-|principal|testimonial-|news-campus)/i.test(cmsState)
) {
    errors.push('home.php: CMS state must not expose demo person images.');
}

if (errors.length) {
    console.error('CMS theme contract audit failed.');
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exit(1);
}

console.log(
    `CMS theme contract audit: OK (${files.length} PHP page views checked)`,
);
console.log(
    'Homepage contract: / and /# preserve the same server-rendered CMS markup; non-empty supported hashes use rich components.',
);
