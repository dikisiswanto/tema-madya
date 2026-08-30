import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
    '.editorconfig',
    'biome.json',
    'composer.json',
    'phpcs.xml',
    '.gitattributes',
    'docs/code-style.md',
];
const failures = [];

for (const relative of required) {
    try {
        await access(path.join(root, relative));
    } catch {
        failures.push(`Missing code-style configuration: ${relative}`);
    }
}

const sourceRoots = [
    path.join(root, 'src', 'js'),
    path.join(root, 'src', 'css'),
    path.join(root, 'src', 'theme'),
    path.join(root, 'scripts'),
    path.join(root, 'tests'),
    path.join(root, 'playground'),
];

async function walk(dir, files = []) {
    for (const entry of await (await import('node:fs/promises')).readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full, files);
        else files.push(full);
    }
    return files;
}

for (const rootDir of sourceRoots) {
    for (const file of await walk(rootDir)) {
        if (!/\.(js|css|php)$/.test(file)) continue;
        const source = await readFile(file, 'utf8');
        if (/\t/.test(source)) failures.push(`Tabs are not allowed: ${path.relative(root, file)}`);
        if (!source.endsWith('\n')) failures.push(`Missing final newline: ${path.relative(root, file)}`);
    }
}

if (failures.length) {
    console.error('Code style configuration check failed.');
    console.error(failures.map((failure) => `- ${failure}`).join('\n'));
    process.exit(1);
}

console.log('Code style configuration: OK');
