import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const warnings = [];
const assetRoot = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
    'assets',
);

async function walk(dir, files = []) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full, files);
        else files.push(full);
    }
    return files;
}

for (const file of await walk(path.join(assetRoot, 'generated'))) {
    if (!/\.(?:png|jpe?g|webp|avif)$/i.test(file)) continue;
    const info = await stat(file);
    if (info.size > 1_500_000)
        failures.push(
            `${path.relative(root, file).replaceAll(path.sep, '/')}: ${(info.size / 1024 / 1024).toFixed(2)} MB exceeds 1.5 MB delivery budget.`,
        );
}

const header = await readFile(
    path.join(
        root,
        'src',
        'theme',
        'app',
        'Views',
        'themes',
        'madya',
        'layouts',
        'header.php',
    ),
    'utf8',
);
const stylesheetLinks = [
    ...header.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi),
].map((match) => match[0]);
const externalStylesheets = stylesheetLinks.filter((tag) =>
    /href=["']https?:\/\//i.test(tag),
);
if (externalStylesheets.length)
    warnings.push(
        `header.php contains ${externalStylesheets.length} external render-blocking stylesheet request(s); keep only dependencies that are required for the visual system.`,
    );

const home = await readFile(
    path.join(
        root,
        'src',
        'theme',
        'app',
        'Views',
        'themes',
        'madya',
        'pages',
        'home.php',
    ),
    'utf8',
);
if (
    !header.includes('rel="preload" as="image"') ||
    !home.includes("'preload_image' => $heroImage")
) {
    warnings.push(
        'Homepage hero is delivered as a CSS background without a route-aware image preload.',
    );
}

if (failures.length) {
    console.error('Performance budget audit failed.');
    console.error(failures.map((item) => `- ${item}`).join('\n'));
    process.exit(1);
}
console.log(
    `Performance budget audit: OK${warnings.length ? ` (${warnings.length} advisory warnings)` : ''}`,
);
if (warnings.length)
    console.warn(warnings.map((item) => `- ${item}`).join('\n'));
