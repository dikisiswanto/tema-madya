#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cssRoot = path.join(root, 'src/css');
const files = [];
function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.css')) files.push(full);
    }
}
walk(cssRoot);

const findings = {
    customWidthBreakpoints: [],
    fixedMicroTypography: [],
    important: [],
    plainDisplayFlex: 0,
    plainDisplayGrid: 0,
    fluidFontSizes: 0,
};

for (const file of files) {
    const rel = path.relative(root, file);
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
        if (/font-size\s*:\s*0\.(?:[0-7])\d*rem/.test(line))
            findings.fixedMicroTypography.push(`${rel}:${i + 1}`);
        if (/!important/.test(line)) findings.important.push(`${rel}:${i + 1}`);
        if (/display\s*:\s*flex/.test(line)) findings.plainDisplayFlex++;
        if (/display\s*:\s*grid/.test(line)) findings.plainDisplayGrid++;
        if (/font-size\s*:\s*clamp\(/.test(line)) findings.fluidFontSizes++;
        if (/@media\s*\([^)]*(?:min|max)-width\s*:\s*(?!0px)/.test(line))
            findings.customWidthBreakpoints.push(`${rel}:${i + 1}`);
    });
}

const nav = fs.readFileSync(path.join(root, 'src/js/navigation.js'), 'utf8');
if (!nav.includes("const DESKTOP_QUERY = '(min-width: 64rem)'"))
    throw new Error(
        'Navigation desktop breakpoint is not aligned to Tailwind lg.',
    );
if (!fs.existsSync(path.join(cssRoot, 'components', 'home-hero-effects.css')))
    console.log('OK: unused home-hero-effects.css retired.');

console.log(JSON.stringify({ cssFiles: files.length, ...findings }, null, 2));
