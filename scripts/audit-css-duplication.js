import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/css');
const files = [];
function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.css')) files.push(full);
    }
}
walk(root);

const selectorLocations = new Map();
for (const file of files) {
    const css = fs.readFileSync(file, 'utf8');
    const lines = css.split(/\r?\n/);
    let depth = 0;
    let quote = null;
    let comment = false;
    let statement = '';
    let statementLine = 1;

    for (let lineNo = 0; lineNo < lines.length; lineNo++) {
        const line = lines[lineNo];
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            const n = line[i + 1];
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
                const pre = statement.trim().replace(/\s+/g, ' ');
                if (depth > 0 && pre && !pre.startsWith('@')) {
                    const key = pre;
                    if (!selectorLocations.has(key))
                        selectorLocations.set(key, []);
                    selectorLocations
                        .get(key)
                        .push(
                            `${path.relative(process.cwd(), file)}:${statementLine}`,
                        );
                }
                depth++;
                statement = '';
                statementLine = lineNo + 1;
            } else if (c === '}') {
                depth = Math.max(0, depth - 1);
                statement = '';
                statementLine = lineNo + 1;
            } else if (c === ';' && depth === 0) {
                statement = '';
                statementLine = lineNo + 1;
            } else {
                statement += c;
            }
        }
        statement += '\n';
    }
}

const repeated = [...selectorLocations.entries()]
    .filter(([, locations]) => locations.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

console.log(`CSS files scanned: ${files.length}`);
console.log(
    `CSS lines scanned: ${files.reduce((n, f) => n + fs.readFileSync(f, 'utf8').split(/\r?\n/).length, 0)}`,
);
console.log(`Repeated selector groups: ${repeated.length}`);
console.log(
    'Top repeated selectors (review required; repeats can be valid responsive/state rules):',
);
for (const [selector, locations] of repeated.slice(0, 30)) {
    console.log(`  ${locations.length}x ${selector}`);
    console.log(`     ${locations.join(', ')}`);
}
