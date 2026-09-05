import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const cssRoot = path.join(root, 'src/css');

async function cssFiles(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await cssFiles(full)));
        else if (entry.name.endsWith('.css')) files.push(full);
    }
    return files.sort();
}

function stripComments(value) {
    return value.replace(/\/\*[\\s\\S]*?\*\//g, '');
}

const files = await cssFiles(cssRoot);
const owners = new Map();
const warnings = [];

for (const file of files) {
    const source = stripComments(await readFile(file, 'utf8'));
    const rel = path.relative(root, file);
    for (const match of source.matchAll(/(^|[}\\n])\\s*([^@{}][^{}]*)\\{/g)) {
        for (const selector of match[2]
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)) {
            if (!owners.has(selector)) owners.set(selector, new Set());
            owners.get(selector).add(rel);
        }
    }
}

for (const [selector, ownerSet] of owners) {
    if (
        ownerSet.size >= 4 &&
        !/:{1,2}(hover|focus|active|before|after)/.test(selector)
    ) {
        warnings.push(`${selector}: ${ownerSet.size} owners`);
    }
}

if (warnings.length) {
    console.warn('CSS cascade review warnings:');
    for (const warning of warnings.slice(0, 80)) console.warn(`- ${warning}`);
    if (warnings.length > 80)
        console.warn(`- ... ${warnings.length - 80} more`);
}
console.log(
    `CSS cascade audit complete — ${files.length} files, ${warnings.length} multi-owner warnings`,
);
