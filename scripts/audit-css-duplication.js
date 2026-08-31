import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('src/css/app.css');
const css = fs.readFileSync(file, 'utf8');
const lines = css.split(/\r?\n/).length;
const applyCount = (css.match(/@apply\b/g) || []).length;
const fontVarCount = (css.match(/font-family\s*:\s*var\(/g) || []).length;
const mediaMatches = [...css.matchAll(/@media\s*\(([^{}]+)\)\s*\{/g)];
const mediaCounts = new Map();
for (const m of mediaMatches)
    mediaCounts.set(
        m[1].replace(/\s+/g, ' ').trim(),
        (mediaCounts.get(m[1].replace(/\s+/g, ' ').trim()) || 0) + 1,
    );

// Conservative selector scan. It intentionally does not claim that repeated selectors are redundant;
// breakpoint/state/context differences can make them semantically necessary.
const selectorCounts = new Map();
let depth = 0;
let quote = null;
let comment = false;
let stmtStart = 0;
for (let i = 0; i < css.length; i++) {
    const c = css[i];
    const n = css[i + 1];
    if (comment) {
        if (c === '*' && n === '/') {
            comment = false;
            i++;
        }
        continue;
    }
    if (quote) {
        if (c === '\\') i++;
        else if (c === quote) quote = null;
        continue;
    }
    if (c === '/' && n === '*') {
        comment = true;
        i++;
        continue;
    }
    if (c === '"' || c === "'") {
        quote = c;
        continue;
    }
    if (c === '{') {
        const pre = css.slice(stmtStart, i).trim();
        if (depth > 0 && !pre.startsWith('@')) {
            const selector = pre.replace(/\s+/g, ' ').trim();
            if (selector)
                selectorCounts.set(
                    selector,
                    (selectorCounts.get(selector) || 0) + 1,
                );
        }
        depth++;
        stmtStart = i + 1;
    } else if (c === '}') {
        depth = Math.max(0, depth - 1);
        stmtStart = i + 1;
    } else if (c === ';' && depth === 0) {
        stmtStart = i + 1;
    }
}

const repeated = [...selectorCounts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);
const repeatedMedia = [...mediaCounts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

console.log(`CSS lines: ${lines}`);
console.log(`@apply usages: ${applyCount}`);
console.log(`font-family: var(...) usages: ${fontVarCount}`);
console.log(`@media blocks: ${mediaMatches.length}`);
console.log(
    `Repeated selector groups (not automatically redundant): ${repeated.length}`,
);
for (const [selector, count] of repeated.slice(0, 20))
    console.log(`  ${count}x ${selector}`);
console.log('Repeated breakpoint conditions:');
for (const [condition, count] of repeatedMedia)
    console.log(`  ${count}x @media (${condition})`);

if (fontVarCount > 0) {
    console.error(
        'ERROR: direct font-family var(...) usage remains. Prefer @apply font-sans/font-display for Tailwind-managed typography.',
    );
    process.exitCode = 1;
}
