import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jsViews = path.join(root, 'src/js/views');
const phpViews = path.join(root, 'src/theme/app/Views/themes/madya');

function files(dir, ext) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory()
            ? files(full, ext)
            : entry.name.endsWith(ext)
              ? [full]
              : [];
    });
}

function classVocabulary(filesList) {
    const out = new Set();
    for (const file of filesList) {
        const source = fs.readFileSync(file, 'utf8');
        for (const match of source.matchAll(
            /class(?:Name)?\s*(?:=|:)\s*[`"']([^`"']+)[`"']/g,
        )) {
            for (const token of match[1].split(/\s+/)) {
                const normalized = token.replace(/\$\{[^}]*\}/g, '').trim();
                if (/^[A-Za-z_][\w:-]*$/.test(normalized)) out.add(normalized);
            }
        }
        for (const match of source.matchAll(
            /class\s*=\s*["'`]([^"'`]+)["'`]/g,
        )) {
            for (const token of match[1].split(/\s+/)) {
                const normalized = token.replace(/\$\{[^}]*\}/g, '').trim();
                if (/^[A-Za-z_][\w:-]*$/.test(normalized)) out.add(normalized);
            }
        }
    }
    return out;
}

const jsSource = files(jsViews, '.js')
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n');
const phpSource = files(phpViews, '.php')
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n');

// These are the classes that must remain aligned between the native playground
// renderer and the CMS PHP implementation of the same component/page shell.
const requiredParity = [
    'page-hero',
    'page-hero-inner',
    'page-breadcrumb',
    'breadcrumb',
    'madya-news-card',
    'news-card-media',
    'news-card-body',
    'news-card-date',
    'news-card-footer',
    'news-card-meta',
    'news-card-category',
    'news-archive-list',
    'news-list-page',
    'news-list-shell',
    'news-list-main',
    'news-list-sidebar',
    'news-side-card',
    'popular-news-list',
    'news-newsletter-card',
    'site-footer',
    'newsletter-strip',
    'newsletter-inner',
    'footer-main',
    'madya-footer-grid',
    'footer-grid-rich',
    'footer-intro',
    'footer-title',
    'footer-links',
    'footer-newsletter-column',
    'footer-socials',
    'madya-footer-bottom',
    'theme-container',
    'button',
    'button-light',
];

const failures = [];
for (const name of requiredParity) {
    const pattern = new RegExp(
        `\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
    );
    if (!pattern.test(jsSource)) failures.push(`playground missing: ${name}`);
    if (!pattern.test(phpSource)) failures.push(`PHP missing: ${name}`);
}

if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
}

console.log(
    `Playground/PHP class contract OK (${requiredParity.length} shared classes checked).`,
);
