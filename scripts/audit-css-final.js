#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cssRoot = path.join(root, 'src', 'css');
const files = [];

function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) walk(p);
        else if (name.endsWith('.css')) files.push(p);
    }
}
walk(cssRoot);

const errors = [];
const warnings = [];
const all = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');

for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    if ((text.match(/{/g) || []).length !== (text.match(/}/g) || []).length) {
        errors.push(`${rel}: unbalanced braces`);
    }
    if (/1200px|1180px|1100px/.test(text) && /navigation|nav/i.test(text)) {
        warnings.push(`${rel}: review non-Tailwind nav breakpoint`);
    }
}

if (!all.includes('@variant lg')) warnings.push('No lg variant found in CSS');
if (!all.includes('@variant max-lg'))
    warnings.push('No max-lg variant found in CSS');

const navJs = path.join(root, 'src', 'js', 'navigation.js');
if (fs.existsSync(navJs)) {
    const js = fs.readFileSync(navJs, 'utf8');
    if (!js.includes('min-width: 64rem')) {
        errors.push(
            'navigation.js: desktop query is not aligned to Tailwind lg (64rem)',
        );
    }
}

for (const retired of [
    'news-compat.css',
    'shared-rich.css',
    'rich-components-overrides.css',
    'tables-utils.css',
    'institutional-shell-polish.css',
    'rhythm-polish.css',
    'component-polish.css',
    'interaction-polish.css',
    'home-hero-effects.css',
]) {
    const p = path.join(cssRoot, 'components', retired);
    if (fs.existsSync(p)) errors.push(`retired layer exists: ${retired}`);
}

if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
}
console.log(
    `Responsive/CSS architecture audit: PASS (${files.length} CSS files)`,
);
if (warnings.length) console.log(warnings.join('\n'));
