import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themeRoot = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
);
const assetRoot = path.join(themeRoot, 'assets');
const generatedRoot = path.join(assetRoot, 'generated');
const failures = [];
const warnings = [];

async function walk(dir, files = []) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full, files);
        else files.push(full);
    }
    return files;
}

const assetFiles = new Set(
    (await walk(assetRoot)).map((file) =>
        path.relative(assetRoot, file).replaceAll(path.sep, '/'),
    ),
);

const manifest = JSON.parse(
    await readFile(path.join(themeRoot, 'theme.json'), 'utf8'),
);
for (const asset of manifest.visual?.illustrationAssets ?? []) {
    if (!assetFiles.has(asset))
        failures.push(`theme.json references missing illustration: ${asset}`);
}
for (const asset of manifest.visual?.generatedImageFallbacks ?? []) {
    if (!assetFiles.has(asset))
        failures.push(
            `theme.json references missing generated asset: ${asset}`,
        );
}

const sourceFiles = (await walk(path.join(root, 'src'))).filter((file) =>
    /\.(php|js)$/.test(file),
);
const dataFiles = [path.join(root, 'playground', 'data', 'demo.json')];
for (const file of sourceFiles) {
    const source = await readFile(file, 'utf8');
    const rel = path.relative(root, file).replaceAll(path.sep, '/');
    for (const match of source.matchAll(
        /(?:generated|illustrations)\/([A-Za-z0-9._-]+\.(?:png|jpe?g|webp|avif|svg))/gi,
    )) {
        const relativeAsset = match[0];
        if (!assetFiles.has(relativeAsset))
            failures.push(`${rel} references missing asset: ${relativeAsset}`);
    }
}

const generatedFiles = await walk(generatedRoot);
for (const file of generatedFiles) {
    if (path.basename(file) === 'README.md') continue;
    const info = await stat(file);
    if (info.size > 1_500_000) {
        warnings.push(
            `${path.relative(root, file).replaceAll(path.sep, '/')}: ${(info.size / 1024 / 1024).toFixed(2)} MB; consider a smaller delivery asset.`,
        );
    }
}

const legacyRefs = [
    'hero-campus.jpg',
    'hero-campus.webp',
    'campus-aerial.jpg',
    'testimonial-2.jpg',
    'testimonial-3.jpg',
];
const sourceText = (
    await Promise.all(
        [...sourceFiles, ...dataFiles].map((file) => readFile(file, 'utf8')),
    )
).join('\n');
for (const legacy of legacyRefs) {
    if (sourceText.includes(legacy))
        failures.push(`Legacy/nonexistent asset reference remains: ${legacy}`);
}

if (failures.length) {
    console.error('Theme asset audit failed.');
    console.error(failures.map((item) => `- ${item}`).join('\n'));
    process.exit(1);
}
console.log(
    `Theme asset audit: OK (${assetFiles.size} asset files indexed)${warnings.length ? ` (${warnings.length} advisory warnings)` : ''}`,
);
if (warnings.length)
    console.warn(warnings.map((item) => `- ${item}`).join('\n'));
