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
}

const router = fs.readFileSync(
    path.join(root, 'src', 'js', 'router.js'),
    'utf8',
);
if (!router.includes('[data-spa-content][data-spa-runtime=\"standalone\"]')) {
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
if (!home.includes('<script id="theme-state" type="application/json">')) {
    errors.push('home.php: CMS rich-component hydration state is missing.');
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
if (/generated\/(?:teacher-|principal|testimonial-)/i.test(cmsState)) {
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
