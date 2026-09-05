import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { hasIcon } from '../src/js/icons.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const requiredStyleFiles = [
    'biome.json',
    'composer.json',
    'phpcs.xml',
    '.editorconfig',
];
for (const relative of requiredStyleFiles) {
    try {
        await access(path.join(root, relative));
    } catch {
        failures.push(`Missing code-style configuration: ${relative}`);
    }
}

async function walk(dir, predicate, files = []) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full, predicate, files);
        else if (predicate(full)) files.push(full);
    }
    return files;
}

function run(command, args, label) {
    const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
    if (result.status !== 0) {
        failures.push(
            `${label} failed${result.stderr ? `: ${result.stderr.trim()}` : ''}`,
        );
    }
}

const jsFiles = [
    ...(await walk(path.join(root, 'src', 'js'), (file) =>
        file.endsWith('.js'),
    )),
    ...(await walk(path.join(root, 'scripts'), (file) => file.endsWith('.js'))),
    ...(await walk(path.join(root, 'tests'), (file) => file.endsWith('.js'))),
    path.join(root, 'vite.config.js'),
    path.join(root, 'playwright.config.js'),
];
for (const file of jsFiles)
    run(
        process.execPath,
        ['--check', file],
        `JavaScript syntax: ${path.relative(root, file)}`,
    );

const phpFiles = await walk(path.join(root, 'src', 'theme'), (file) =>
    file.endsWith('.php'),
);
for (const file of phpFiles)
    run('php', ['-l', file], `PHP syntax: ${path.relative(root, file)}`);

const jsonFiles = [
    path.join(root, 'package.json'),
    path.join(root, 'package-lock.json'),
    path.join(
        root,
        'src',
        'theme',
        'app',
        'Views',
        'themes',
        'madya',
        'theme.json',
    ),
    path.join(root, 'playground', 'data', 'demo.json'),
];
for (const file of jsonFiles) {
    try {
        JSON.parse(await readFile(file, 'utf8'));
    } catch (error) {
        failures.push(
            `JSON syntax: ${path.relative(root, file)} — ${error.message}`,
        );
    }
}

const cssFile = path.join(root, 'src', 'css', 'app.css');
const css = await readFile(cssFile, 'utf8');
const cssFiles = await walk(path.join(root, 'src', 'css'), (file) =>
    file.endsWith('.css'),
);
const cssSource = (
    await Promise.all(cssFiles.map((file) => readFile(file, 'utf8')))
).join('\n');
let balance = 0;
for (const [index, line] of css.split(/\r?\n/).entries()) {
    balance += (line.match(/\{/g) || []).length;
    balance -= (line.match(/\}/g) || []).length;
    if (balance < 0)
        failures.push(`CSS brace closes before it opens at line ${index + 1}.`);
}
if (balance !== 0) failures.push(`CSS brace balance is ${balance}.`);
if (!css.includes('@import "tailwindcss";'))
    failures.push('Tailwind entry import is missing.');
if (!cssSource.includes('@theme'))
    failures.push('Tailwind theme tokens are missing.');
if (css.includes('.lucide-icon'))
    failures.push(
        'Dead .lucide-icon selectors remain; use the canonical .icon-tabler class.',
    );

function isFontAwesomeIcon(name) {
    return /^(?:(?:fas|far|fab|fal|fat|fad)\s+fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*|fa-(?:solid|regular|brands)\s+fa-[a-z0-9-]+(?:\s+fa-[a-z0-9-]+)*|fa-[a-z0-9-]+)$/i.test(
        String(name || '').trim(),
    );
}

function supportsConfiguredIcon(name) {
    return hasIcon(name) || isFontAwesomeIcon(name);
}

const iconNames = new Set();
const phpSourceFiles = await walk(path.join(root, 'src', 'theme'), (file) =>
    file.endsWith('.php'),
);
for (const file of phpSourceFiles) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/data-lucide=["']([^"']+)["']/g)) {
        if (!/[<$?]/.test(match[1])) iconNames.add(match[1]);
    }
}
const jsSourceFiles = await walk(path.join(root, 'src', 'js'), (file) =>
    file.endsWith('.js'),
);
for (const file of jsSourceFiles) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/iconMarkup\(["']([^"']+)["']/g))
        iconNames.add(match[1]);
}
for (const name of iconNames) {
    if (!supportsConfiguredIcon(name))
        failures.push(`Unsupported icon definition: ${name}`);
}
const demoData = JSON.parse(
    await readFile(path.join(root, 'playground', 'data', 'demo.json'), 'utf8'),
);
const dynamicIconFields = ['site_logo_icon'];
for (const field of dynamicIconFields)
    if (demoData[field] && !supportsConfiguredIcon(demoData[field]))
        failures.push(
            `Unsupported icon definition: ${field}=${demoData[field]}`,
        );
for (const collection of ['programs', 'extracurriculars']) {
    for (const item of Array.isArray(demoData[collection])
        ? demoData[collection]
        : []) {
        if (item.icon && !supportsConfiguredIcon(item.icon))
            failures.push(
                `Unsupported icon definition: ${collection}.${item.icon}`,
            );
    }
}

const markupFiles = [
    ...(await walk(path.join(root, 'src', 'theme'), (file) =>
        file.endsWith('.php'),
    )),
    ...(await walk(
        path.join(root, 'playground'),
        (file) => file.endsWith('.html') || file.endsWith('.js'),
    )),
];
for (const file of markupFiles) {
    const source = await readFile(file, 'utf8');
    const ids = [...source.matchAll(/\bid=["']([^"']+)["']/g)]
        .map((match) => match[1])
        .filter((id) => !/[<$?]/.test(id));
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    for (const id of new Set(duplicates))
        failures.push(
            `Duplicate literal id in ${path.relative(root, file)}: ${id}`,
        );
}

const forbiddenMediaRoots = [
    'public/generated',
    'public/illustrations',
    'playground/public/generated',
    'playground/public/illustrations',
];
for (const relativePath of forbiddenMediaRoots) {
    try {
        await access(path.join(root, relativePath));
        failures.push(`Duplicate media source remains: ${relativePath}`);
    } catch {}
}

if (failures.length) {
    console.error('Source quality check failed.');
    console.error(failures.map((failure) => `- ${failure}`).join('\n'));
    process.exit(1);
}

console.log(
    `Source quality: OK (${jsFiles.length} JS, ${phpFiles.length} PHP, ${jsonFiles.length} JSON files checked)`,
);
