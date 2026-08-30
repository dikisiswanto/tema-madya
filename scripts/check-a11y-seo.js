import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const warnings = [];

async function walk(dir, files = []) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full, files);
        else if (/\.(php|html|js)$/.test(full)) files.push(full);
    }
    return files;
}

const phpFiles = await walk(path.join(root, 'src', 'theme'));
for (const file of phpFiles) {
    const source = await readFile(file, 'utf8');
    const rel = path.relative(root, file);

    // Audit complete HTML tags rather than individual source lines so multiline
    // PHP templates are checked correctly. Remove PHP blocks first so the `?>`
    // delimiter cannot be mistaken for the end of an HTML tag.
    const markup = source.replace(/<\?(?:php|=)?[\s\S]*?\?>/gi, ' ');
    for (const match of markup.matchAll(/<img\b[^>]*>/gi)) {
        const tag = match[0];
        if (!/\balt\s*=/i.test(tag)) {
            failures.push(`${rel}: image is missing alt attribute.`);
        }
        if (
            !/\b(?:width|height)\s*=/i.test(tag) &&
            !/\baria-hidden=["']true["']/i.test(tag)
        ) {
            warnings.push(
                `${rel}: image should provide intrinsic dimensions where practical.`,
            );
        }
    }
    for (const match of markup.matchAll(/<i\b[^>]*data-lucide=[^>]*>/gi)) {
        const tag = match[0];
        if (!/\baria-hidden=["']true["']/i.test(tag)) {
            failures.push(
                `${rel}: decorative data-lucide icon should be aria-hidden.`,
            );
        }
    }

    for (const match of source.matchAll(
        /<a\b([^>]*)target=["']_blank["']([^>]*)>/gi,
    )) {
        const attrs = `${match[1]} ${match[2]}`;
        if (!/\brel=["'][^"']*(?:noopener|noreferrer)/i.test(attrs))
            failures.push(
                `${rel}: target=_blank link is missing noopener/noreferrer.`,
            );
    }

    for (const match of source.matchAll(
        /<(input|select|textarea)\b([^>]*)>/gi,
    )) {
        const attrs = match[2];
        const type = (
            attrs.match(/\btype=[\"']([^\"']+)/i)?.[1] || ''
        ).toLowerCase();
        if (type === 'hidden') continue;
        const id = attrs.match(/\bid=[\"']([^\"']+)/i)?.[1];
        const labelled = /\baria-label=|\baria-labelledby=/i.test(attrs);
        const sourceBefore = source.slice(0, match.index ?? 0);
        const insideHiddenRegion =
            /<(?:div|fieldset|section|label)\b[^>]*aria-hidden=[\"']true[\"'][^>]*>[\s\S]{0,600}$/i.test(
                sourceBefore,
            );
        const insideHoneypot =
            /<[^>]*class=[\"'][^\"']*honeypot[^\"']*[\"'][^>]*>[\s\S]{0,300}$/i.test(
                sourceBefore,
            ) || /class=[\"'][^\"']*sr-only[^\"']*[\"']/i.test(attrs);
        const lastLabelOpen = sourceBefore.toLowerCase().lastIndexOf('<label');
        const lastLabelClose = sourceBefore
            .toLowerCase()
            .lastIndexOf('</label>');
        const insideLabel = lastLabelOpen > lastLabelClose;
        if (insideHiddenRegion || insideHoneypot) continue;
        if (!id && !labelled && !insideLabel) {
            failures.push(
                `${rel}: form control needs an id with a matching label or an accessible aria label.`,
            );
            continue;
        }
        if (
            id &&
            !labelled &&
            !insideLabel &&
            !new RegExp(
                `<label\\b[^>]*\\bfor=[\"']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\"']`,
                'i',
            ).test(source)
        ) {
            failures.push(
                `${rel}: form control #${id} is missing a matching label.`,
            );
        }
    }
    for (const match of markup.matchAll(/<iframe\b([^>]*)>/gi)) {
        if (!/\btitle=[\"'][^\"']+['"]/i.test(match[1]))
            failures.push(`${rel}: iframe needs a non-empty title.`);
    }

    for (const match of source.matchAll(
        /<button\b([^>]*)>([\s\S]*?)<\/button>/gi,
    )) {
        const attrs = match[1];
        const body = match[2]
            .replace(/<i\b[^>]*>[\s\S]*?<\/i>/gi, '')
            .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        if (!body && !/\baria-label=|\baria-labelledby=|\btitle=/i.test(attrs))
            failures.push(`${rel}: icon-only button needs an accessible name.`);
    }
}

const requiredSeoViews = [
    'home.php',
    'news.php',
    'single_post.php',
    'downloads.php',
    'contact.php',
    'page.php',
];
for (const name of requiredSeoViews) {
    const file = path.join(
        root,
        'src',
        'theme',
        'app',
        'Views',
        'themes',
        'madya',
        'pages',
        name,
    );
    try {
        const source = await readFile(file, 'utf8');
        if (!source.includes('layouts/header'))
            failures.push(
                `${name}: does not include the canonical theme header.`,
            );
    } catch {
        failures.push(`Missing SEO view: ${name}`);
    }
}

const headerPath = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
    'layouts',
    'header.php',
);
const headerSource = await readFile(headerPath, 'utf8');
for (const required of [
    '<title>',
    'meta name="description"',
    'rel="canonical"',
    'meta name="robots"',
    'meta property="og:title"',
    'meta property="og:description"',
    'meta property="og:url"',
    'meta name="twitter:card"',
]) {
    if (!headerSource.includes(required))
        failures.push(
            `layouts/header.php: missing canonical SEO primitive: ${required}`,
        );
}

if (failures.length) {
    console.error('SEO/accessibility audit failed.');
    console.error(failures.map((x) => `- ${x}`).join('\n'));
    process.exit(1);
}

console.log(
    `SEO/accessibility audit: OK${warnings.length ? ` (${warnings.length} advisory warnings)` : ''}`,
);
if (warnings.length) console.warn(warnings.map((x) => `- ${x}`).join('\n'));
