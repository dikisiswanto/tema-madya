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

    for (const line of source.split(/\r?\n/)) {
        if (/<img\b/i.test(line) && !/\balt\s*=/i.test(line)) {
            failures.push(`${rel}: image is missing alt attribute.`);
        }
        if (/<img\b/i.test(line) && !/\b(?:width|height)\s*=/i.test(line) && !/\baria-hidden=["']true["']/i.test(line)) {
            warnings.push(`${rel}: image should provide intrinsic dimensions where practical.`);
        }
        if (/<i\b[^>]*data-lucide=/i.test(line) && !/\baria-hidden=["']true["']/i.test(line)) {
            failures.push(`${rel}: decorative data-lucide icon should be aria-hidden.`);
        }
    }

    for (const match of source.matchAll(/<a\b([^>]*)target=["']_blank["']([^>]*)>/gi)) {
        const attrs = `${match[1]} ${match[2]}`;
        if (!/\brel=["'][^"']*(?:noopener|noreferrer)/i.test(attrs)) failures.push(`${rel}: target=_blank link is missing noopener/noreferrer.`);
    }

    for (const match of source.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
        const attrs = match[1];
        const body = match[2].replace(/<i\b[^>]*>[\s\S]*?<\/i>/gi, '').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '').replace(/\s+/g, ' ').trim();
        if (!body && !/\baria-label=|\baria-labelledby=|\btitle=/i.test(attrs)) failures.push(`${rel}: icon-only button needs an accessible name.`);
    }
}

const requiredSeoViews = ['home.php', 'news.php', 'single_post.php', 'downloads.php', 'contact.php', 'page.php'];
for (const name of requiredSeoViews) {
    const file = path.join(root, 'src', 'theme', 'app', 'Views', 'themes', 'madya', 'pages', name);
    try {
        const source = await readFile(file, 'utf8');
        if (!source.includes('layouts/header')) failures.push(`${name}: does not include the canonical theme header.`);
    } catch {
        failures.push(`Missing SEO view: ${name}`);
    }
}

if (failures.length) {
    console.error('SEO/accessibility audit failed.');
    console.error(failures.map((x) => `- ${x}`).join('\n'));
    process.exit(1);
}

console.log(`SEO/accessibility audit: OK${warnings.length ? ` (${warnings.length} advisory warnings)` : ''}`);
if (warnings.length) console.warn(warnings.map((x) => `- ${x}`).join('\n'));
