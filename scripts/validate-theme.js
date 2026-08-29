import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themeRoot = path.join(root, 'src', 'theme', 'app', 'Views', 'themes', 'madya');
const bridgeRoot = path.join(root, 'src', 'theme', 'app', 'Views', 'pages');
const required = [
    'pages/home.php',
    'pages/news.php',
    'pages/single_post.php',
    'pages/downloads.php',
    'pages/contact.php',
    'pages/page.php',
    'layouts/header.php',
    'layouts/footer.php',
    'partials/navigation.php',
    'partials/navigation/menu.php',
    'components/page-header.php',
    'components/section-heading.php',
    'components/content/news-card.php',
    'components/content/program-row.php',
    'components/content/event-row.php',
    'components/content/download-item.php',
    'components/media/gallery-item.php',
    'components/ui/empty-state.php',
];

const failures = [];
const bridgeRequired = ['home.php','news.php','single_post.php','downloads.php','contact.php','page.php'];
for (const file of bridgeRequired) {
    try { await access(path.join(bridgeRoot, file)); }
    catch { failures.push(`Missing public view adapter: pages/${file}`); }
}
for (const file of required) {
    try { await access(path.join(themeRoot, file)); }
    catch { failures.push(`Missing theme file: ${file}`); }
}

const phpFiles = [];
async function walk(dir) {
    const { readdir } = await import('node:fs/promises');
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else if (entry.name.endsWith('.php')) phpFiles.push(full);
    }
}
await walk(themeRoot);

const viewIncludePattern = /(?:->(?:include|renderSection)|view\s*\()\s*\(?'([^'"\)]+)'/g;
for (const file of phpFiles) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(viewIncludePattern)) {
        const target = match[1];
        if (!target.startsWith('themes/madya/')) continue;
        const targetPath = path.join(root, 'src', 'theme', 'app', 'Views', `${target}.php`);
        try { await access(targetPath); }
        catch { failures.push(`${path.relative(root, file)} references missing view: ${target}.php`); }
    }
}

if (failures.length) {
    console.error('Theme validation failed.');
    console.error(failures.map((item) => `- ${item}`).join('\n'));
    process.exit(1);
}

console.log('Theme structure: OK');
console.log('CI4 public view contract: pages/home.php, pages/news.php, pages/single_post.php, pages/downloads.php, pages/contact.php, pages/page.php');
console.log(`Internal view references checked: ${phpFiles.length} PHP files`);
