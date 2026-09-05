import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cssRoot = path.join(root, 'src/css');
const files = [];

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(file);
        else if (entry.name.endsWith('.css')) files.push(file);
    }
}

walk(cssRoot);

const source = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const required = [
    '.rich-sidebar-nav a',
    '.rich-program-card p',
    '.rich-program-row p',
    '.rich-person-card span',
    '.rich-achievement-card p',
    '.rich-event-row p',
    '.rich-gallery-item figcaption',
    '.rich-testimonial small',
    '.rich-faq-list',
    '.downloads-page',
    '.news-list-sidebar',
    '.article-sidebar',
    '.static-page-sidebar',
];
const missing = required.filter((selector) => !source.includes(selector));
if (missing.length) {
    console.error('Missing typography selectors:', missing.join(', '));
    process.exit(1);
}

// Fixed font sizes must use Tailwind's native text scale through @apply.
const fixedFontSize =
    /font-size\s*:\s*(?:\.?\d+(?:\.\d+)?rem|\d+(?:\.\d+)?px)\s*;/g;
const arbitraryRem = /text-\[(?:\.?\d+(?:\.\d+)?rem)\]/g;
const violations = [];

for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (fixedFontSize.test(text))
        violations.push(
            `${path.relative(root, file)}: fixed font-size declaration`,
        );
    fixedFontSize.lastIndex = 0;
    if (arbitraryRem.test(text))
        violations.push(
            `${path.relative(root, file)}: arbitrary rem text utility`,
        );
    arbitraryRem.lastIndex = 0;
}

if (violations.length) {
    console.error('Typography scale violations:');
    console.error(violations.join('\n'));
    process.exit(1);
}

const nativeTextUtilities = (
    source.match(
        /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g,
    ) || []
).length;
const fluidSpecialCases = (source.match(/font-size\s*:\s*clamp\(/g) || [])
    .length;

console.log(
    `Typography audit OK — ${required.length} selectors covered; ${nativeTextUtilities} native text utilities; ${fluidSpecialCases} fluid display exceptions.`,
);
