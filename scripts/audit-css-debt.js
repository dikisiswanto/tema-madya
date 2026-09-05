import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
async function cssFiles(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const out = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...(await cssFiles(full)));
        else if (entry.name.endsWith('.css')) out.push(full);
    }
    return out;
}

const files = (await cssFiles(path.join(root, 'src/css'))).sort();
const problems = [];
const warnings = [];
const selectorFiles = new Map();

for (const file of files) {
    const source = await readFile(file, 'utf8');
    const rel = path.relative(root, file);
    const selectorSource = source.replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = [
        ...selectorSource.matchAll(/(^|\n)\s*([^@\n{}][^{}]*)\{/g),
    ]
        .flatMap((m) => m[2].split(',').map((s) => s.trim()))
        .filter((selector) => selector && !selector.startsWith('@'));
    for (const selector of selectors) {
        if (!selectorFiles.has(selector))
            selectorFiles.set(selector, new Set());
        selectorFiles.get(selector).add(rel);
    }
    if (/font-size\s*:\s*(0?\.\d+rem|0?\.\d+em)/.test(source))
        problems.push(`${rel}: fixed micro font-size detected`);
    if (/@media\s*\([^)]*(?:min|max)-width/.test(source))
        problems.push(`${rel}: custom width media query detected`);
    if (/text-\[\s*0?\.\d+(?:rem|em)/.test(source))
        problems.push(`${rel}: arbitrary micro typography utility detected`);
}

for (const [selector, owners] of selectorFiles) {
    if (
        owners.size >= 6 &&
        !selector.includes(':hover') &&
        !selector.includes(':focus') &&
        !selector.includes('::')
    ) {
        warnings.push(`${selector}: ${owners.size} CSS owners`);
    }
}

if (warnings.length) {
    console.warn('CSS debt review warnings:');
    for (const warning of warnings) console.warn(`- ${warning}`);
}

if (problems.length) {
    console.error('CSS debt audit failed:');
    for (const problem of problems) console.error(`- ${problem}`);
    process.exit(1);
}
console.log(`CSS debt audit OK — ${files.length} files`);
