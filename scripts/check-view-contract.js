import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const themeRoot = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
);
const pagesRoot = path.join(themeRoot, 'pages');
const failures = [];
const warnings = [];

const requiredPages = [
    'home.php',
    'news.php',
    'single_post.php',
    'downloads.php',
    'contact.php',
    'page.php',
];

const componentContracts = {
    'themes/madya/components/ui/icon': ['name'],
    'themes/madya/components/ui/empty-state': ['message'],
    'themes/madya/components/content/news-card': ['post'],
    'themes/madya/components/page-header': [
        'title',
        'description',
        'image',
        'breadcrumbs',
    ],
};

function extractBalancedCall(source, marker, startAt) {
    const start = source.indexOf(marker, startAt);
    if (start < 0) return null;
    const open = source.indexOf('(', start + marker.length);
    if (open < 0) return null;
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (let i = open; i < source.length; i += 1) {
        const ch = source[i];
        if (quote) {
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === quote) quote = null;
            continue;
        }
        if (ch === "'" || ch === '"') {
            quote = ch;
            continue;
        }
        if (ch === '(') depth += 1;
        if (ch === ')') {
            depth -= 1;
            if (depth === 0)
                return { start, end: i + 1, body: source.slice(open + 1, i) };
        }
    }
    return null;
}

function literalArrayKeys(body) {
    const match = body.match(/^\s*\[([\s\S]*)\]\s*$/);
    if (!match) return null;
    return [...match[1].matchAll(/['"]([^'"]+)['"]\s*=>/g)].map((m) => m[1]);
}

for (const filename of requiredPages) {
    const file = path.join(pagesRoot, filename);
    if (!fs.existsSync(file)) {
        failures.push(`${filename}: required page view is missing.`);
        continue;
    }
    const source = fs.readFileSync(file, 'utf8');

    for (const target of [
        'themes/madya/layouts/header',
        'themes/madya/layouts/footer',
    ]) {
        const marker = `$this->include('${target}')`;
        if (!source.includes(marker))
            failures.push(`${filename}: missing ${target}.`);
    }

    let cursor = 0;
    while (true) {
        const call = extractBalancedCall(source, '$this->include', cursor);
        if (!call) break;
        const comma = call.body.indexOf(',');
        if (comma >= 0) {
            failures.push(
                `${filename}: $this->include() must not receive component/view data as its second argument; use view(..., $data) or setData() instead.`,
            );
        }
        cursor = call.end;
    }

    cursor = 0;
    while (true) {
        const call = extractBalancedCall(source, 'view', cursor);
        if (!call) break;
        const targetMatch = call.body.match(
            /^\s*['"]([^'"]+)['"]\s*,([\s\S]*)$/,
        );
        if (targetMatch && componentContracts[targetMatch[1]]) {
            const keys = literalArrayKeys(targetMatch[2]);
            if (!keys) {
                warnings.push(
                    `${filename}: ${targetMatch[1]} receives a non-literal data expression; manual review required.`,
                );
            } else {
                for (const key of componentContracts[targetMatch[1]]) {
                    if (!keys.includes(key)) {
                        failures.push(
                            `${filename}: ${targetMatch[1]} is missing required prop '${key}'.`,
                        );
                    }
                }
            }
        }
        cursor = call.end;
    }
}

const navigation = fs.readFileSync(
    path.join(themeRoot, 'partials', 'navigation.php'),
    'utf8',
);
if (
    !navigation.includes(
        "$this->include('themes/madya/partials/navigation/menu')",
    )
) {
    failures.push('navigation.php: menu bootstrap include is missing.');
}

const css = fs.readFileSync(path.join(root, 'src', 'css', 'app.css'), 'utf8');
if (/\.(?:pagination)\s*\{/.test(css)) {
    failures.push(
        'app.css: unscoped .pagination rule remains; CI4/CMS pager class must be isolated under .madya-news-pagination.',
    );
}

if (failures.length) {
    console.error('View contract audit failed.');
    console.error(failures.map((item) => `- ${item}`).join('\n'));
    if (warnings.length)
        console.warn(warnings.map((item) => `- ${item}`).join('\n'));
    process.exit(1);
}
console.log(
    `View contract audit: OK (${requiredPages.length} page views checked)`,
);
if (warnings.length)
    console.warn(warnings.map((item) => `- ${item}`).join('\n'));
